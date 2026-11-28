import { ContainerPlan, PlanItem, CrossContainerMatch } from '../types';
import { INITIAL_CONTAINER_PLANS } from '../data/initialContainerPlans';
import { getSupabase } from '../lib/supabase';

const CLOSED_ITEMS_STORAGE_KEY = 'powdercoat_closed_plan_items';
const CANCELLED_ITEMS_STORAGE_KEY = 'powdercoat_cancelled_plan_items';
const HIDDEN_CONTAINERS_STORAGE_KEY = 'powdercoat_hidden_containers';
const CACHED_PLANS_STORAGE_KEY = 'powdercoat_cached_container_plans';
const ACTIVE_CONTAINER_STORAGE_KEY = 'powdercoat_active_container_id';
const DEFAULT_ACTIVE_CONTAINER = 'EL_SALVADOR';

/**
 * สร้างคีย์เฉพาะสำหรับตู้สินค้า (แยกตู้ที่ชื่อซ้ำกันแต่คนละวันที่ได้ เช่น SOUTH AFICA 27/11 vs เดือน 12)
 */
export const makeContainerKey = (plan: Pick<ContainerPlan, 'id' | 'date'>): string => {
  const cleanId = (plan.id || '').trim().toUpperCase();
  const cleanDate = (plan.date || '').trim().toUpperCase();
  return cleanDate ? `${cleanId}::${cleanDate}` : cleanId;
};

// ดึงแผนตู้สินค้าล่าสุด (จากแคชที่ซิงค์ไว้ หรือค่าเริ่มต้น)
export const getCachedContainerPlans = (): ContainerPlan[] => {
  try {
    const raw = localStorage.getItem(CACHED_PLANS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to read cached container plans:', e);
  }
  return INITIAL_CONTAINER_PLANS;
};

export const GOOGLE_SHEET_CSV_URL = 
  'https://docs.google.com/spreadsheets/d/1hZa5qYVzlQJlTOZGWgFz1SnE8-QbJywf/export?format=csv&gid=1962169336';

/**
 * สร้างคีย์เฉพาะ (Unique Key) สำหรับโมเดลในแต่ละตู้สินค้า
 * รูปแบบ: CONTAINER__MODEL เช่น EL_SALVADOR__AM106B625
 * ทำให้คงทนถาวร ไม่ขึ้นกับลำดับแถวหรือการซิงค์ใหม่จาก Google Sheet
 */
export const makePlanItemKey = (containerIdOrName: string, modelPartNo: string): string => {
  const cleanContainer = (containerIdOrName || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9ก-๙]/g, '_');
  const cleanModel = (modelPartNo || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  return `${cleanContainer}__${cleanModel}`;
};

/**
 * แปลงรหัสเดิม (เช่น EL_SALVADOR_2_AM106B625) เป็น Unique Key แบบใหม่
 * เพื่อให้รายการที่เคยปิดยอดไว้แล้วก่อนหน้านี้ไม่สูญหาย
 */
export const normalizeClosedItemId = (id: string): string => {
  if (!id) return '';
  const trimmed = id.trim();
  // ถ้าเป็นรูปแบบใหม่แล้ว: CONTAINER__MODEL
  if (trimmed.includes('__')) return trimmed.toUpperCase();

  // ถ้าเป็นรูปแบบเดิม: CONTAINER_INDEX_MODEL เช่น EL_SALVADOR_2_AM106B625 หรือ งานผลิตในประเทศ_2_AM106F12
  const match = trimmed.match(/^(.*?)_\d+_(.*)$/);
  if (match) {
    const cleanContainer = match[1].trim().toUpperCase().replace(/[^A-Z0-9_ก-๙]/g, '_');
    const cleanModel = match[2].trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    return `${cleanContainer}__${cleanModel}`;
  }

  return trimmed.toUpperCase();
};

// ดึงรายการ ID ชิ้นงานที่ถูกปิดยอดแล้ว (ซิงค์กับ Supabase Cloud)
export const fetchClosedPlanItemIds = async (): Promise<string[]> => {
  const localData = localStorage.getItem(CLOSED_ITEMS_STORAGE_KEY);
  let localList: string[] = localData ? JSON.parse(localData) : [];
  localList = Array.from(new Set(localList.map(normalizeClosedItemId).filter(Boolean)));

  const supabase = getSupabase();
  if (!supabase) return localList;

  try {
    const { data, error } = await supabase
      .from('powdercoat_jobs')
      .select('notes')
      .eq('id', 'SYSTEM_CONFIG_CLOSED_PLAN_ITEMS')
      .maybeSingle();

    if (!error && data && data.notes) {
      const rawCloudList: string[] = JSON.parse(data.notes);
      const normalizedCloudList = Array.from(new Set(rawCloudList.map(normalizeClosedItemId).filter(Boolean)));
      localStorage.setItem(CLOSED_ITEMS_STORAGE_KEY, JSON.stringify(normalizedCloudList));
      return normalizedCloudList;
    }
  } catch (e) {
    console.warn('Failed to fetch closed plan items from Supabase:', e);
  }

  return localList;
};

// บันทึกการปิด/เปิดรายการชิ้นงาน (ซิงค์กับ Supabase Cloud)
export const saveClosedPlanItemIds = async (closedIds: string[]): Promise<boolean> => {
  const normalizedIds = Array.from(new Set(closedIds.map(normalizeClosedItemId).filter(Boolean)));
  localStorage.setItem(CLOSED_ITEMS_STORAGE_KEY, JSON.stringify(normalizedIds));

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
        quantity: normalizedIds.length,
        status: 'RECEIVED',
        notes: JSON.stringify(normalizedIds),
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

// ดึงรายการ ID ชิ้นงานที่ถูกยกเลิกการผลิต (ซิงค์กับ Supabase Cloud)
export const fetchCancelledPlanItemIds = async (): Promise<string[]> => {
  const localData = localStorage.getItem(CANCELLED_ITEMS_STORAGE_KEY);
  let localList: string[] = localData ? JSON.parse(localData) : [];
  localList = Array.from(new Set(localList.map(normalizeClosedItemId).filter(Boolean)));

  const supabase = getSupabase();
  if (!supabase) return localList;

  try {
    const { data, error } = await supabase
      .from('powdercoat_jobs')
      .select('notes')
      .eq('id', 'SYSTEM_CONFIG_CANCELLED_PLAN_ITEMS')
      .maybeSingle();

    if (!error && data && data.notes) {
      const rawCloudList: string[] = JSON.parse(data.notes);
      const normalizedCloudList = Array.from(new Set(rawCloudList.map(normalizeClosedItemId).filter(Boolean)));
      localStorage.setItem(CANCELLED_ITEMS_STORAGE_KEY, JSON.stringify(normalizedCloudList));
      return normalizedCloudList;
    }
  } catch (e) {
    console.warn('Failed to fetch cancelled plan items from Supabase:', e);
  }

  return localList;
};

// บันทึกรายการชิ้นงานที่ถูกยกเลิกการผลิต (ซิงค์กับ Supabase Cloud)
export const saveCancelledPlanItemIds = async (cancelledIds: string[]): Promise<boolean> => {
  const normalizedIds = Array.from(new Set(cancelledIds.map(normalizeClosedItemId).filter(Boolean)));
  localStorage.setItem(CANCELLED_ITEMS_STORAGE_KEY, JSON.stringify(normalizedIds));

  const supabase = getSupabase();
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('powdercoat_jobs')
      .upsert({
        id: 'SYSTEM_CONFIG_CANCELLED_PLAN_ITEMS',
        tracking_code: 'SYS-PLAN-CANCELLED',
        sender_department: 'SYSTEM',
        model_part_no: 'SYSTEM_PLAN_CANCELLED',
        part_name: 'บันทึกรายการตู้ที่ยกเลิกการผลิต',
        sender_name: 'SYSTEM',
        container_no: 'SYS',
        quantity: normalizedIds.length,
        status: 'RECEIVED',
        notes: JSON.stringify(normalizedIds),
        receiver_name: 'SYSTEM',
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Failed to sync cancelled items to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error saving cancelled plan items to Supabase:', e);
    return false;
  }
};

// ดึงรายการคีย์ตู้สินค้าที่ถูกซ่อนไว้ (ซิงค์กับ Supabase Cloud)
export const fetchHiddenContainerKeys = async (): Promise<string[]> => {
  const localData = localStorage.getItem(HIDDEN_CONTAINERS_STORAGE_KEY);
  let localList: string[] = [];
  try {
    localList = localData ? JSON.parse(localData) : [];
  } catch {
    localList = [];
  }

  const supabase = getSupabase();
  if (!supabase) return localList;

  try {
    const { data, error } = await supabase
      .from('powdercoat_jobs')
      .select('notes')
      .eq('id', 'SYSTEM_CONFIG_HIDDEN_CONTAINERS')
      .maybeSingle();

    if (!error && data && data.notes) {
      const cloudList: string[] = JSON.parse(data.notes);
      if (Array.isArray(cloudList)) {
        localStorage.setItem(HIDDEN_CONTAINERS_STORAGE_KEY, JSON.stringify(cloudList));
        return cloudList;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch hidden containers from Supabase:', e);
  }

  return localList;
};

// บันทึกรายการคีย์ตู้สินค้าที่ถูกซ่อนไว้ (ซิงค์กับ Supabase Cloud)
export const saveHiddenContainerKeys = async (hiddenKeys: string[]): Promise<boolean> => {
  const uniqueKeys = Array.from(new Set(hiddenKeys.filter(Boolean)));
  localStorage.setItem(HIDDEN_CONTAINERS_STORAGE_KEY, JSON.stringify(uniqueKeys));

  const supabase = getSupabase();
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('powdercoat_jobs')
      .upsert({
        id: 'SYSTEM_CONFIG_HIDDEN_CONTAINERS',
        tracking_code: 'SYS-PLAN-HIDDEN',
        sender_department: 'SYSTEM',
        model_part_no: 'SYSTEM_PLAN_HIDDEN',
        part_name: 'บันทึกรายการตู้ที่ซ่อนการแสดงผล',
        sender_name: 'SYSTEM',
        container_no: 'SYS',
        quantity: uniqueKeys.length,
        status: 'RECEIVED',
        notes: JSON.stringify(uniqueKeys),
        receiver_name: 'SYSTEM',
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Failed to sync hidden containers to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error saving hidden containers to Supabase:', e);
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
  currentContainerIdOrKey: string,
  plans: ContainerPlan[] = INITIAL_CONTAINER_PLANS
): Map<string, Array<{ containerKey: string; containerName: string; containerDate?: string; qty: number }>> => {
  const currentIdx = plans.findIndex(
    (p) => makeContainerKey(p) === currentContainerIdOrKey || p.id === currentContainerIdOrKey
  );
  if (currentIdx === -1) return new Map();

  const futureContainers = plans.slice(currentIdx + 1);
  const resultMap = new Map<string, Array<{ containerKey: string; containerName: string; containerDate?: string; qty: number }>>();

  const currentPlan = plans[currentIdx];
  currentPlan.items.forEach((item) => {
    const cleanModel = item.modelPartNo.trim().toLowerCase();
    const matches: Array<{ containerKey: string; containerName: string; containerDate?: string; qty: number }> = [];

    futureContainers.forEach((fc) => {
      const match = fc.items.find(
        (fci) => fci.modelPartNo.trim().toLowerCase() === cleanModel
      );
      if (match) {
        matches.push({
          containerKey: makeContainerKey(fc),
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

export interface ColorSyncStats {
  greenTotal: number;
  redTotal: number;
  yellowTotal: number;
  newlyClosed: number;
  newlyCancelled: number;
  qtyChangedCount: number;
  usedColorApi: boolean;
}

// เทียบยอดจำนวนเดิมกับยอดใหม่ที่ซิงค์มา เพื่อจับการปรับเพิ่ม/ลดยอดอัตโนมัติ
const annotateQtyChanges = (
  newPlans: ContainerPlan[],
  prevPlans: ContainerPlan[]
): { plans: ContainerPlan[]; qtyChangedCount: number } => {
  const prevQtyMap = new Map<string, number>();
  prevPlans.forEach((p) => {
    const cKey = makeContainerKey(p);
    p.items.forEach((it) => {
      prevQtyMap.set(`${cKey}::${it.modelPartNo.trim().toUpperCase()}`, it.planQty);
      prevQtyMap.set(makePlanItemKey(p.id, it.modelPartNo), it.planQty);
    });
  });

  let qtyChangedCount = 0;
  const annotated = newPlans.map((p) => {
    const cKey = makeContainerKey(p);
    return {
      ...p,
      items: p.items.map((it) => {
        const prevQty =
          prevQtyMap.get(`${cKey}::${it.modelPartNo.trim().toUpperCase()}`) ??
          prevQtyMap.get(makePlanItemKey(p.id, it.modelPartNo));
        if (prevQty !== undefined && prevQty !== it.planQty) {
          qtyChangedCount++;
          return { ...it, previousPlanQty: prevQty, isQtyYellow: true };
        }
        return it;
      }),
    };
  });

  return { plans: annotated, qtyChangedCount };
};

// ซิงค์แผนงานสดจาก Google Sheet (รองรับอ่านสีพื้นหลัง เขียว=ปิดยอด, แดง=ยกเลิก, เหลือง=ปรับยอด ผ่าน /api/sync-plan)
export const syncPlansFromGoogleSheet = async (): Promise<{
  success: boolean;
  plans: ContainerPlan[];
  colorSyncStats?: ColorSyncStats;
  message?: string;
}> => {
  const prevPlans = getCachedContainerPlans();

  // 1. ลองดึงผ่าน Serverless API (/api/sync-plan) ซึ่งอ่านสีจากไฟล์ .xlsx จริงได้ 100% และไม่ติด CORS
  try {
    const apiRes = await fetch('/api/sync-plan', { cache: 'no-store' });
    if (apiRes.ok) {
      const json = await apiRes.json();
      if (json?.success && Array.isArray(json.plans) && json.plans.length > 0) {
        const { plans: annotatedPlans, qtyChangedCount } = annotateQtyChanges(json.plans, prevPlans);

        // ผสานสถานะตามสีจาก Google Sheet เข้ากับฐานข้อมูลปิดยอด / ยกเลิกบน Cloud
        const existingClosed = new Set(
          (await fetchClosedPlanItemIds()).map(normalizeClosedItemId).filter(Boolean)
        );
        const existingCancelled = new Set(
          (await fetchCancelledPlanItemIds()).map(normalizeClosedItemId).filter(Boolean)
        );

        let newlyClosed = 0;
        let newlyCancelled = 0;
        let closedChanged = false;
        let cancelledChanged = false;

        annotatedPlans.forEach((p) => {
          p.items.forEach((it) => {
            const key = makePlanItemKey(p.id, it.modelPartNo);
            if (it.sheetColor === 'GREEN') {
              if (!existingClosed.has(key)) {
                existingClosed.add(key);
                newlyClosed++;
                closedChanged = true;
              }
              if (existingCancelled.has(key)) {
                existingCancelled.delete(key);
                cancelledChanged = true;
              }
            } else if (it.sheetColor === 'RED') {
              if (!existingCancelled.has(key)) {
                existingCancelled.add(key);
                newlyCancelled++;
                cancelledChanged = true;
              }
              if (existingClosed.has(key)) {
                existingClosed.delete(key);
                closedChanged = true;
              }
            }
          });
        });

        if (closedChanged) {
          await saveClosedPlanItemIds(Array.from(existingClosed));
        }
        if (cancelledChanged) {
          await saveCancelledPlanItemIds(Array.from(existingCancelled));
        }

        try {
          localStorage.setItem(CACHED_PLANS_STORAGE_KEY, JSON.stringify(annotatedPlans));
        } catch (e) {
          console.warn('Failed to cache synced plans:', e);
        }

        return {
          success: true,
          plans: annotatedPlans,
          colorSyncStats: {
            greenTotal: json.summary?.greenCount || 0,
            redTotal: json.summary?.redCount || 0,
            yellowTotal: json.summary?.yellowCount || 0,
            newlyClosed,
            newlyCancelled,
            qtyChangedCount,
            usedColorApi: true,
          },
        };
      }
    }
  } catch (apiErr: any) {
    console.warn('Color sync API (/api/sync-plan) unavailable, falling back to CSV:', apiErr?.message);
  }

  // 2. Fallback: ดึงแบบ CSV กรณีรัน dev ภายในเครื่องโดยไม่มี Vercel API
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

        const itemKey = makePlanItemKey(current.id, rawPart);
        current.items.push({
          id: itemKey,
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
      const { plans: annotatedPlans, qtyChangedCount } = annotateQtyChanges(containers, prevPlans);
      try {
        localStorage.setItem(CACHED_PLANS_STORAGE_KEY, JSON.stringify(annotatedPlans));
      } catch (e) {
        console.warn('Failed to cache synced plans:', e);
      }
      return {
        success: true,
        plans: annotatedPlans,
        colorSyncStats: {
          greenTotal: 0,
          redTotal: 0,
          yellowTotal: qtyChangedCount,
          newlyClosed: 0,
          newlyCancelled: 0,
          qtyChangedCount,
          usedColorApi: false,
        },
      };
    }
    return { success: false, plans: INITIAL_CONTAINER_PLANS, message: 'ไม่พบรายการตู้จากชีต' };
  } catch (e: any) {
    console.warn('Live Google Sheet fetch failed (likely CORS or network), using bundled plans:', e.message);
    return {
      success: true, // fallback smoothly
      plans: prevPlans,
      message: 'ใช้ข้อมูลแผนงานล่าสุดที่โหลดไว้ในระบบ',
    };
  }
};
