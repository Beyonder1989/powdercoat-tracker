import { ContainerPlan, PlanItem, CrossContainerMatch } from '../types';
import { INITIAL_CONTAINER_PLANS } from '../data/initialContainerPlans';
import { getSupabase } from '../lib/supabase';

const CLOSED_ITEMS_STORAGE_KEY = 'powdercoat_closed_plan_items';
const ACTIVE_CONTAINER_STORAGE_KEY = 'powdercoat_active_container_id';
const DEFAULT_ACTIVE_CONTAINER = 'EL_SALVADOR';

export const GOOGLE_SHEET_CSV_URL = 
  'https://docs.google.com/spreadsheets/d/1hZa5qYVzlQJlTOZGWgFz1SnE8-QbJywf/export?format=csv&gid=1962169336';

// ดึงรายการ ID ชิ้นงานที่ถูกปิดยอดแล้ว (ซิงค์กับ Supabase Cloud)
export const fetchClosedPlanItemIds = async (): Promise<string[]> => {
  const localData = localStorage.getItem(CLOSED_ITEMS_STORAGE_KEY);
  const localList: string[] = localData ? JSON.parse(localData) : [];

  const supabase = getSupabase();
  if (!supabase) return localList;

  try {
    const { data, error } = await supabase
      .from('powdercoat_jobs')
      .select('notes')
      .eq('id', 'SYSTEM_CONFIG_CLOSED_PLAN_ITEMS')
      .maybeSingle();

    if (!error && data && data.notes) {
      const cloudList: string[] = JSON.parse(data.notes);
      localStorage.setItem(CLOSED_ITEMS_STORAGE_KEY, JSON.stringify(cloudList));
      return cloudList;
    }
  } catch (e) {
    console.warn('Failed to fetch closed plan items from Supabase:', e);
  }

  return localList;
};

// บันทึกการปิด/เปิดรายการชิ้นงาน (ซิงค์กับ Supabase Cloud)
export const saveClosedPlanItemIds = async (closedIds: string[]): Promise<boolean> => {
  localStorage.setItem(CLOSED_ITEMS_STORAGE_KEY, JSON.stringify(closedIds));

  const supabase = getSupabase();
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('powdercoat_jobs')
      .upsert({
        id: 'SYSTEM_CONFIG_CLOSED_PLAN_ITEMS',
        tracking_code: 'SYS-PLAN-CLOSED',
        sender_department: 'SYSTEM',
        model_part_no: 'SYSTEM_PLAN_CLOSED',
        part_name: 'บันทึกรายการตู้ที่ปิดยอดแล้ว',
        sender_name: 'SYSTEM',
        container_no: 'SYS',
        quantity: closedIds.length,
        status: 'RECEIVED',
        notes: JSON.stringify(closedIds),
        receiver_name: 'SYSTEM',
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Failed to sync closed items to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error saving closed plan items to Supabase:', e);
    return false;
  }
};

// ดึงรหัสตู้ปัจจุบันที่กำลังทำงาน
export const getActiveContainerId = (): string => {
  return localStorage.getItem(ACTIVE_CONTAINER_STORAGE_KEY) || DEFAULT_ACTIVE_CONTAINER;
};

export const setActiveContainerId = (containerId: string): void => {
  localStorage.setItem(ACTIVE_CONTAINER_STORAGE_KEY, containerId);
};

// คำนวณโมเดลที่ซ้ำในตู้ถัดๆ ไป (Cross-Container Match)
export const getCrossContainerMatches = (
  currentContainerId: string,
  plans: ContainerPlan[] = INITIAL_CONTAINER_PLANS
): Map<string, Array<{ containerName: string; containerDate?: string; qty: number }>> => {
  const currentIdx = plans.findIndex((p) => p.id === currentContainerId);
  if (currentIdx === -1) return new Map();

  const futureContainers = plans.slice(currentIdx + 1);
  const resultMap = new Map<string, Array<{ containerName: string; containerDate?: string; qty: number }>>();

  const currentPlan = plans[currentIdx];
  currentPlan.items.forEach((item) => {
    const cleanModel = item.modelPartNo.trim().toLowerCase();
    const matches: Array<{ containerName: string; containerDate?: string; qty: number }> = [];

    futureContainers.forEach((fc) => {
      const match = fc.items.find(
        (fci) => fci.modelPartNo.trim().toLowerCase() === cleanModel
      );
      if (match) {
        matches.push({
          containerName: fc.name,
          containerDate: fc.date,
          qty: match.planQty,
        });
      }
    });

    if (matches.length > 0) {
      resultMap.set(item.modelPartNo.trim(), matches);
    }
  });

  return resultMap;
};

// ซิงค์แผนงานสดจาก Google Sheet (CSV Export)
export const syncPlansFromGoogleSheet = async (): Promise<{
  success: boolean;
  plans: ContainerPlan[];
  message?: string;
}> => {
  try {
    const res = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!res.ok) {
      throw new Error(`Google Sheet returned status ${res.status}`);
    }
    const csvText = await res.text();
    const lines = csvText.split('\n');

    const containers: ContainerPlan[] = [];
    let current: ContainerPlan | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',');

      if (parts.length > 3 && (parts[3] === 'เลเซอร์' || parts[3].includes('เลเซอร์')) && parts[1] && parts[1].trim()) {
        if (current && current.items.length > 0) {
          containers.push(current);
        }
        const rawName = parts[1].trim();
        const date = parts[2]?.trim() || '';
        current = {
          id: rawName.replace(/[^a-zA-Z0-9ก-๙]/g, '_').toUpperCase(),
          name: rawName,
          date: date,
          items: [],
        };
        continue;
      }

      if (current && parts[1] && parts[1].trim()) {
        const rawPart = parts[1].trim();
        if (
          rawPart === 'รหัสสินค้า' ||
          rawPart.includes('รหัสสินค้า') ||
          rawPart === '3' ||
          rawPart.startsWith('฿') ||
          rawPart === 'LS' ||
          rawPart === 'BD' ||
          rawPart === 'WD'
        ) {
          continue;
        }
        const qtyStr = parts[2]?.trim() || '1';
        const planQty = parseInt(qtyStr, 10) || 1;
        const pcStatus = parts[10]?.trim() || '';
        const note = parts[15]?.trim() || '';

        current.items.push({
          id: `${current.id}_${current.items.length + 1}_${rawPart.replace(/[^a-zA-Z0-9]/g, '')}`,
          modelPartNo: rawPart,
          planQty: planQty,
          pcStatus: pcStatus,
          note: note,
          isClosed: false,
        });
      }
    }

    if (current && current.items.length > 0) {
      containers.push(current);
    }

    if (containers.length > 0) {
      return { success: true, plans: containers };
    }
    return { success: false, plans: INITIAL_CONTAINER_PLANS, message: 'ไม่พบรายการตู้จากชีต' };
  } catch (e: any) {
    console.warn('Live Google Sheet fetch failed (likely CORS or network), using bundled plans:', e.message);
    return {
      success: true, // fallback smoothly
      plans: INITIAL_CONTAINER_PLANS,
      message: 'ใช้ข้อมูลแผนงานล่าสุดที่โหลดไว้ในระบบ',
    };
  }
};
