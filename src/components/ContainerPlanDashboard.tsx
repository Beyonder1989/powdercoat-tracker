import React, { useState, useMemo, useEffect } from 'react';
import { 
  Layers, Package, CheckCircle2, Clock, AlertCircle, RefreshCw, 
  ExternalLink, Search, ChevronDown, Check, ArrowRight, Bell, 
  Flame, Filter, Undo2, Calendar, FileSpreadsheet, Sparkles, Ban,
  SlidersHorizontal, Eye, EyeOff, X, Lock
} from 'lucide-react';
import { ContainerPlan, PlanItem, PowderCoatJob } from '../types';
import { 
  fetchClosedPlanItemIds, 
  saveClosedPlanItemIds, 
  fetchCancelledPlanItemIds,
  saveCancelledPlanItemIds,
  fetchHiddenContainerKeys,
  saveHiddenContainerKeys,
  getCachedContainerPlans,
  getActiveContainerId, 
  setActiveContainerId, 
  getCrossContainerMatches,
  syncPlansFromGoogleSheet,
  makePlanItemKey,
  makeContainerKey,
  normalizeClosedItemId,
  GOOGLE_SHEET_CSV_URL
} from '../services/containerPlanService';
import { useLanguage } from '../context/LanguageContext';
import { useRole } from '../context/RoleContext';

interface ContainerPlanDashboardProps {
  jobs: PowderCoatJob[];
}

export const ContainerPlanDashboard: React.FC<ContainerPlanDashboardProps> = ({ jobs }) => {
  const { lang, t } = useLanguage();
  const { isOperator, openPinModal } = useRole();

  // แผนการผลิตทั้งหมด (เริ่มต้นจากแคชล่าสุดหรือ 25 ตู้ที่ดึงมาจาก Google Sheet)
  const [plans, setPlans] = useState<ContainerPlan[]>(() => getCachedContainerPlans());
  const [selectedContainerId, setSelectedContainerId] = useState<string>(getActiveContainerId);
  const [closedItemIds, setClosedItemIds] = useState<Set<string>>(new Set());
  const [cancelledItemIds, setCancelledItemIds] = useState<Set<string>>(new Set());
  const [hiddenContainerKeys, setHiddenContainerKeys] = useState<Set<string>>(new Set());
  
  // UI States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'PENDING' | 'CLOSED' | 'CANCELLED' | 'YELLOW' | 'HAS_FUTURE'>('ALL');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [manageSearch, setManageSearch] = useState<string>('');
  const [highlightedModel, setHighlightedModel] = useState<string | null>(null);

  // กระโดดไปยังตู้สินค้าและรายการโมเดลที่คลิกเลือก
  const handleJumpToContainerModel = (containerKey: string, modelPartNo: string) => {
    handleSelectContainer(containerKey);
    setFilterMode('ALL');
    setSearchQuery(modelPartNo);
    const cleanTarget = modelPartNo.trim().toLowerCase();
    setHighlightedModel(cleanTarget);
    setTimeout(() => {
      const el = document.getElementById(`plan-item-${cleanTarget.replace(/[^a-z0-9]/g, '_')}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    setTimeout(() => {
      setHighlightedModel((prev) => (prev === cleanTarget ? null : prev));
    }, 2600);
  };

  // โหลดรายการ ID ที่ปิดยอดแล้ว, ที่ถูกยกเลิกการผลิต และตู้ที่ซ่อนการแสดงผลจาก Cloud / LocalStorage
  useEffect(() => {
    fetchClosedPlanItemIds().then((ids) => {
      setClosedItemIds(new Set(ids.map(normalizeClosedItemId).filter(Boolean)));
    });
    fetchCancelledPlanItemIds().then((ids) => {
      setCancelledItemIds(new Set(ids.map(normalizeClosedItemId).filter(Boolean)));
    });
    fetchHiddenContainerKeys().then((keys) => {
      setHiddenContainerKeys(new Set(keys));
    });

    // ซ่อมแซมแคชอัตโนมัติหากแผนที่เคยแคชไว้ก่อนหน้านี้ยังไม่มีข้อมูลวันที่ของตู้สินค้า
    const missingDatesCount = plans.filter((p) => !p.date || p.date.startsWith('รอบที่')).length;
    if (missingDatesCount > 10) {
      syncPlansFromGoogleSheet().then(async (res) => {
        if (res.success && res.plans.length > 0) {
          setPlans(res.plans);
          const latestClosed = await fetchClosedPlanItemIds();
          setClosedItemIds(new Set(latestClosed.map(normalizeClosedItemId).filter(Boolean)));
          const latestCancelled = await fetchCancelledPlanItemIds();
          setCancelledItemIds(new Set(latestCancelled.map(normalizeClosedItemId).filter(Boolean)));
        }
      });
    }
  }, []);

  // เฉพาะตู้สินค้าที่เปิดแสดงผลอยู่จริง (ไม่รวมตู้ที่ซ่อน/เลื่อน/ยกเลิก)
  const visiblePlans = useMemo(() => {
    return plans.filter((p) => !hiddenContainerKeys.has(makeContainerKey(p)));
  }, [plans, hiddenContainerKeys]);

  const actualHiddenCount = Math.max(0, plans.length - visiblePlans.length);

  // เมื่อเปลี่ยนตู้ ให้บันทึกเป็นตู้ปัจจุบัน
  const handleSelectContainer = (keyOrId: string) => {
    setSelectedContainerId(keyOrId);
    setActiveContainerId(keyOrId);
  };

  // ดึงตู้ที่เลือกอยู่ปัจจุบัน (จากตู้ที่เปิดแสดงผลอยู่)
  const selectedContainer = useMemo(() => {
    const pool = visiblePlans.length > 0 ? visiblePlans : plans;
    return (
      pool.find((p) => makeContainerKey(p) === selectedContainerId) ||
      pool.find((p) => p.id === selectedContainerId) ||
      pool[0]
    );
  }, [visiblePlans, plans, selectedContainerId]);

  // ตรวจสอบว่าชื่อตู้ปัจจุบันมีซ้ำหลายตู้ในแผนหรือไม่ (เช่น SOUTH AFICA 28/11 กับ 15/12 หรือ K'FRANZ)
  const isSelectedContainerNameDuplicate = useMemo(() => {
    const cleanName = selectedContainer.name.trim().toUpperCase();
    return plans.filter((p) => p.name.trim().toUpperCase() === cleanName).length > 1;
  }, [plans, selectedContainer]);

  // จัดการเปิด/ปิดการแสดงผลตู้สินค้า
  const handleToggleContainerVisibility = async (plan: ContainerPlan) => {
    if (!isOperator) {
      openPinModal();
      return;
    }
    const key = makeContainerKey(plan);
    const nextHidden = new Set(hiddenContainerKeys);
    if (nextHidden.has(key)) {
      nextHidden.delete(key);
    } else {
      nextHidden.add(key);
    }
    setHiddenContainerKeys(nextHidden);
    await saveHiddenContainerKeys(Array.from(nextHidden));
  };

  const handleShowAllContainers = async () => {
    if (!isOperator) {
      openPinModal();
      return;
    }
    setHiddenContainerKeys(new Set());
    await saveHiddenContainerKeys([]);
  };

  const handleHideAllContainers = async () => {
    if (!isOperator) {
      openPinModal();
      return;
    }
    const allKeys = plans.map((p) => makeContainerKey(p));
    setHiddenContainerKeys(new Set(allKeys));
    await saveHiddenContainerKeys(allKeys);
  };

  // ตรวจสอบว่าโมเดลนี้ในตู้นี้ถูกปิดยอดแล้วหรือไม่ (แยกตู้ชื่อซ้ำออกจากกัน 100%)
  const checkIsItemClosed = (it: PlanItem): boolean => {
    const k1 = makePlanItemKey(selectedContainer.id, it.modelPartNo);
    const k2 = isSelectedContainerNameDuplicate
      ? k1
      : makePlanItemKey(selectedContainer.name, it.modelPartNo);
    return (
      closedItemIds.has(k1) ||
      closedItemIds.has(k2) ||
      closedItemIds.has(it.id) ||
      closedItemIds.has(normalizeClosedItemId(it.id))
    );
  };

  // ตรวจสอบว่าโมเดลนี้ในตู้นี้ถูกฝ่ายวางแผนยกเลิกการผลิตหรือไม่
  const checkIsItemCancelled = (it: PlanItem): boolean => {
    const k1 = makePlanItemKey(selectedContainer.id, it.modelPartNo);
    const k2 = isSelectedContainerNameDuplicate
      ? k1
      : makePlanItemKey(selectedContainer.name, it.modelPartNo);
    return (
      cancelledItemIds.has(k1) ||
      cancelledItemIds.has(k2) ||
      cancelledItemIds.has(it.id) ||
      cancelledItemIds.has(normalizeClosedItemId(it.id))
    );
  };

  // คำนวณรายการโมเดลที่ซ้ำในตู้ถัดๆ ไป (เฉพาะตู้ที่เปิดแสดงผลอยู่จริง)
  const crossMatches = useMemo(() => {
    if (visiblePlans.length === 0) {
      return new Map<string, Array<{ containerKey: string; containerName: string; containerDate?: string; qty: number }>>();
    }
    return getCrossContainerMatches(makeContainerKey(selectedContainer), visiblePlans);
  }, [selectedContainer, visiblePlans]);

  // Toggle ปิด/เปิดรายการชิ้นงาน (Reconciliation) โดยบันทึกเป็น Unique Key
  const handleToggleClose = async (itemId: string, modelPartNo: string) => {
    if (!isOperator) {
      openPinModal();
      return;
    }

    const itemKey1 = makePlanItemKey(selectedContainer.id, modelPartNo);
    const itemKey2 = isSelectedContainerNameDuplicate
      ? itemKey1
      : makePlanItemKey(selectedContainer.name, modelPartNo);
    const normalizedOldId = normalizeClosedItemId(itemId);

    const isCurrentlyClosed =
      closedItemIds.has(itemKey1) ||
      closedItemIds.has(itemKey2) ||
      closedItemIds.has(itemId) ||
      closedItemIds.has(normalizedOldId);

    const nextClosed = new Set(closedItemIds);
    if (isCurrentlyClosed) {
      nextClosed.delete(itemKey1);
      nextClosed.delete(itemKey2);
      nextClosed.delete(itemId);
      nextClosed.delete(normalizedOldId);
    } else {
      nextClosed.add(itemKey1);
      // หากเคยถูกยกเลิก ให้ปลดออกจากยกเลิก
      if (
        cancelledItemIds.has(itemKey1) ||
        cancelledItemIds.has(itemKey2) ||
        cancelledItemIds.has(itemId) ||
        cancelledItemIds.has(normalizedOldId)
      ) {
        const nextCancelled = new Set(cancelledItemIds);
        nextCancelled.delete(itemKey1);
        nextCancelled.delete(itemKey2);
        nextCancelled.delete(itemId);
        nextCancelled.delete(normalizedOldId);
        setCancelledItemIds(nextCancelled);
        await saveCancelledPlanItemIds(Array.from(nextCancelled));
      }
    }

    setClosedItemIds(nextClosed);
    await saveClosedPlanItemIds(Array.from(nextClosed));
  };

  // Toggle ยกเลิก/คืนรายการการผลิตโมเดลนี้ (Cancel Plan Model)
  const handleToggleCancel = async (itemId: string, modelPartNo: string) => {
    if (!isOperator) {
      openPinModal();
      return;
    }

    const itemKey1 = makePlanItemKey(selectedContainer.id, modelPartNo);
    const itemKey2 = isSelectedContainerNameDuplicate
      ? itemKey1
      : makePlanItemKey(selectedContainer.name, modelPartNo);
    const normalizedOldId = normalizeClosedItemId(itemId);

    const isCurrentlyCancelled =
      cancelledItemIds.has(itemKey1) ||
      cancelledItemIds.has(itemKey2) ||
      cancelledItemIds.has(itemId) ||
      cancelledItemIds.has(normalizedOldId);

    const nextCancelled = new Set(cancelledItemIds);
    if (isCurrentlyCancelled) {
      nextCancelled.delete(itemKey1);
      nextCancelled.delete(itemKey2);
      nextCancelled.delete(itemId);
      nextCancelled.delete(normalizedOldId);
    } else {
      nextCancelled.add(itemKey1);
      // หากเคยถูกปิดยอด ให้ปลดออกจากปิดยอด
      if (
        closedItemIds.has(itemKey1) ||
        closedItemIds.has(itemKey2) ||
        closedItemIds.has(itemId) ||
        closedItemIds.has(normalizedOldId)
      ) {
        const nextClosed = new Set(closedItemIds);
        nextClosed.delete(itemKey1);
        nextClosed.delete(itemKey2);
        nextClosed.delete(itemId);
        nextClosed.delete(normalizedOldId);
        setClosedItemIds(nextClosed);
        await saveClosedPlanItemIds(Array.from(nextClosed));
      }
    }

    setCancelledItemIds(nextCancelled);
    await saveCancelledPlanItemIds(Array.from(nextCancelled));
  };

  // ฟังก์ชันซิงค์ข้อมูลสดจาก Google Sheet (คงสถานะปิดรายการเดิม และรายการยกเลิกเดิมไว้ 100%)
  const handleSyncGoogleSheet = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncPlansFromGoogleSheet();
      if (res.success && res.plans.length > 0) {
        setPlans(res.plans);
        // ดึงและผสานสถานะปิดรายการ สถานะยกเลิก และตู้ที่ซ่อน เพื่อไม่ให้สถานะหลุดหาย
        const latestClosed = await fetchClosedPlanItemIds();
        setClosedItemIds(new Set(latestClosed.map(normalizeClosedItemId).filter(Boolean)));
        const latestCancelled = await fetchCancelledPlanItemIds();
        setCancelledItemIds(new Set(latestCancelled.map(normalizeClosedItemId).filter(Boolean)));
        const latestHidden = await fetchHiddenContainerKeys();
        setHiddenContainerKeys(new Set(latestHidden));
        const cs = res.colorSyncStats;
        if (cs?.usedColorApi) {
          setSyncMessage(
            lang === 'my'
              ? `Google Sheet မှ အရောင်အလိုက် ရယူပြီးပါပြီ (🟢 ပိတ်ပြီး ${cs.greenTotal} / 🔴 ဖျက်သိမ်း ${cs.redTotal} / 🟡 အရေအတွက်ပြောင်း ${cs.yellowTotal})`
              : `ซิงค์พร้อมอ่านสีจาก Google Sheet สำเร็จ! 🟢 สีเขียว(ปิดยอด) ${cs.greenTotal} รายการ${cs.newlyClosed > 0 ? ` (+ใหม่ ${cs.newlyClosed})` : ''} • 🔴 สีแดง(ยกเลิก) ${cs.redTotal} รายการ${cs.newlyCancelled > 0 ? ` (+ใหม่ ${cs.newlyCancelled})` : ''} • 🟡 สีเหลือง/ปรับยอด ${cs.yellowTotal} รายการ`
          );
        } else {
          setSyncMessage(
            lang === 'my' 
              ? 'Google Sheet မှ အောင်မြင်စွာ ရယူပြီးပါပြီ (ပိတ်ပြီး/ဖျက်သိမ်းပြီး စာရင်းများ မပျောက်ပါ)' 
              : 'ซิงค์แผนงานล่าสุดจาก Google Sheet สำเร็จ (คงสถานะปิดยอด & ยกเลิกเดิมไว้ 100%)'
          );
        }
      } else {
        setSyncMessage(res.message || 'ใช้ข้อมูลแผนงานล่าสุดในระบบ');
      }
    } catch (e: any) {
      setSyncMessage('ไม่สามารถเชื่อมต่อได้ กำลังใช้ข้อมูลแผนงานล่าสุดในระบบ');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 7000);
    }
  };

  // Helper เช็คว่ารายการนี้ถูกวางแผนไฮไลต์สีเหลืองหรือมีการปรับยอดจำนวนหรือไม่
  const checkIsItemYellow = (it: PlanItem): boolean => {
    return Boolean(
      it.isQtyYellow ||
      it.sheetColor === 'YELLOW' ||
      (it.previousPlanQty !== undefined && it.previousPlanQty !== it.planQty)
    );
  };

  // คำนวณสถิติภาพรวมของตู้นี้
  const stats = useMemo(() => {
    const totalItems = selectedContainer.items.length;
    const totalPlanSets = selectedContainer.items.reduce((s, it) => s + (it.planQty || 1), 0);
    let closedCount = 0;
    let cancelledCount = 0;
    let yellowCount = 0;
    let hasFutureCount = 0;

    selectedContainer.items.forEach((it) => {
      if (checkIsItemCancelled(it)) {
        cancelledCount++;
      } else if (checkIsItemClosed(it)) {
        closedCount++;
      }
      if (checkIsItemYellow(it)) {
        yellowCount++;
      }
      if (crossMatches.has(it.modelPartNo.trim())) {
        hasFutureCount++;
      }
    });

    const pendingCount = Math.max(0, totalItems - closedCount - cancelledCount);
    return { totalItems, totalPlanSets, closedCount, cancelledCount, yellowCount, pendingCount, hasFutureCount };
  }, [selectedContainer, closedItemIds, cancelledItemIds, crossMatches]);

  // กรองรายการชิ้นงานในตู้ตามค้นหาและสถานะ
  const filteredItems = useMemo(() => {
    return selectedContainer.items.filter((item) => {
      const isClosed = checkIsItemClosed(item);
      const isCancelled = checkIsItemCancelled(item);
      const isYellow = checkIsItemYellow(item);
      const hasFuture = crossMatches.has(item.modelPartNo.trim());

      // Filter Mode
      if (filterMode === 'PENDING' && (isClosed || isCancelled)) return false;
      if (filterMode === 'CLOSED' && !isClosed) return false;
      if (filterMode === 'CANCELLED' && !isCancelled) return false;
      if (filterMode === 'YELLOW' && !isYellow) return false;
      if (filterMode === 'HAS_FUTURE' && !hasFuture) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchModel = item.modelPartNo.toLowerCase().includes(q);
        const matchNote = item.note?.toLowerCase().includes(q);
        const matchPc = item.pcStatus?.toLowerCase().includes(q);
        return matchModel || matchNote || matchPc;
      }

      return true;
    });
  }, [selectedContainer, closedItemIds, cancelledItemIds, crossMatches, filterMode, searchQuery]);

  // ค้นหาข้ามตู้ (กรณีผู้ใช้พิมพ์ค้นหาโมเดล แล้วอยากรู้ว่ามีในตู้ไหนบ้าง)
  const globalModelSearchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) return [];
    const q = searchQuery.trim().toLowerCase();
    const results: Array<{ containerKey: string; containerName: string; containerDate?: string; item: PlanItem }> = [];

    visiblePlans.forEach((p) => {
      const containerKey = makeContainerKey(p);
      p.items.forEach((it) => {
        if (it.modelPartNo.toLowerCase().includes(q)) {
          results.push({
            containerKey,
            containerName: p.name,
            containerDate: p.date,
            item: it,
          });
        }
      });
    });

    return results;
  }, [visiblePlans, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Read-Only Banner for Outside Viewers (ต้องล็อกอินก่อนปิดรายการ/ยกเลิก/จัดการตู้) */}
      {!isOperator && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-orange-500/40 rounded-2xl px-4 sm:px-5 py-3 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5 text-slate-300">
            <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
              <Lock className="w-4 h-4" />
            </span>
            <span className="font-medium">
              {lang === 'my'
                ? 'ကြည့်ရှုရန်သာ (စာရင်းပိတ်ရန် သို့မဟုတ် ဖျက်သိမ်းရန် ဝန်ထမ်း PIN ဖြင့် ဝင်ရောက်ပါ)'
                : 'โหมดดูข้อมูลอย่างเดียว • กรุณาล็อกอินด้วย PIN เพื่อปิดรายการ ยกเลิกผลิต หรือจัดการตู้สินค้า'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => openPinModal()}
            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-md shadow-orange-600/30 flex items-center space-x-1.5 shrink-0 self-end sm:self-auto"
          >
            <span>🔑</span>
            <span>{t.btnUnlock}</span>
          </button>
        </div>
      )}

      {/* 1. Header Banner & Container Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <FileSpreadsheet className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
                  <span>{lang === 'my' ? 'ကွန်တိန်နာအလိုက် ထုတ်လုပ်မှုအစီအစဉ်' : 'แผนงานผลิตตามตู้สินค้า (Production Plan)'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {lang === 'my' 
                    ? 'အမှန်တကယ် ကွန်တိန်နာအလိုက် ပစ္စည်းစာရင်းကို စစ်ဆေးခြင်းနှင့် ပြီးစီးမှု ပိတ်သိမ်းခြင်း'
                    : 'ระบบตรวจสอบรายการชิ้นงานตามตู้ ตัดยอดโมเดลที่เสร็จแล้ว และแจ้งเตือนโมเดลซ้ำในตู้ถัดไป'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: Manage Visible Containers, Sync Google Sheet & View Real Sheet */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsManageModalOpen(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-colors ${
                actualHiddenCount > 0
                  ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-orange-500/60 shadow-sm shadow-orange-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="เลือกเปิด/ซ่อนตู้สินค้าที่ต้องการทำงานจริง"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
              <span>
                {lang === 'my'
                  ? `ကွန်တိန်နာ စီမံခန့်ခွဲမည် (${visiblePlans.length}/${plans.length})`
                  : `จัดการตู้ที่แสดง (${visiblePlans.length}/${plans.length})`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSyncGoogleSheet}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
              title="ดึงแผนงานล่าสุดจาก Google Sheet ของฝ่ายวางแผน"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? (lang === 'my' ? 'ရယူနေသည်...' : 'กำลังซิงค์...') : (lang === 'my' ? 'Google Sheet မှ ရယူမည်' : 'ซิงค์แผนงานจาก Google Sheet')}</span>
            </button>

            <a
              href="https://docs.google.com/spreadsheets/d/1hZa5qYVzlQJlTOZGWgFz1SnE8-QbJywf/edit?gid=1962169336#gid=1962169336"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold border border-emerald-800/80 flex items-center space-x-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'my' ? 'Google Sheet အစစ် ဖွင့်ပါ' : 'เปิด Google Sheet วางแผน'}</span>
            </a>
          </div>
        </div>

        {/* Sync notification message */}
        {syncMessage && (
          <div className="mt-3 p-3 rounded-xl bg-orange-950/80 border border-orange-800 text-orange-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* 2. Container Selector Dropdown & Quick Carousel */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Package className="w-4 h-4 text-orange-400" />
              <span>{lang === 'my' ? 'လက်ရှိ ကွန်တိန်နာ ရွေးချယ်ပါ' : 'เลือกตู้สินค้าที่กำลังทำงาน (Container / Project):'}</span>
            </label>
            <span className="text-xs font-medium text-amber-400">
              {lang === 'my' 
                ? `ပြသနေသော ကွန်တိန်နာ ${visiblePlans.length} / ${plans.length} ခု` 
                : `แสดง ${visiblePlans.length} จาก ${plans.length} ตู้${actualHiddenCount > 0 ? ` (ซ่อนอยู่ ${actualHiddenCount} ตู้)` : ''}${visiblePlans.length > 0 ? ` • ตู้ปัจจุบัน: ${selectedContainer.name}${selectedContainer.date ? ` (${selectedContainer.date})` : ''}` : ''}`}
            </span>
          </div>

          {/* Container Selector Pills */}
          {visiblePlans.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-dashed border-slate-700 text-center space-y-2">
              <p className="text-xs text-slate-400">
                {lang === 'my'
                  ? 'ကွန်တိန်နာအားလုံးကို ဝှက်ထားပါသည်'
                  : 'ขณะนี้ซ่อนตู้สินค้าไว้ทั้งหมด กรุณากด "จัดการตู้ที่แสดง" เพื่อเลือกตู้ที่ต้องการผลิต'}
              </p>
              <button
                type="button"
                onClick={() => setIsManageModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{lang === 'my' ? 'ကွန်တိန်နာ ရွေးချယ်မည်' : 'เลือกตู้สินค้าที่ต้องการแสดง'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {visiblePlans.map((p) => {
                const containerKey = makeContainerKey(p);
                const isSelected = containerKey === makeContainerKey(selectedContainer);
                return (
                  <button
                    key={containerKey}
                    type="button"
                    onClick={() => handleSelectContainer(containerKey)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 ring-2 ring-orange-400'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                    <span className="font-bold">{p.name}</span>
                    {p.date && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isSelected ? 'bg-black/30 text-orange-100' : 'bg-slate-900 text-slate-400'}`}>
                        {p.date}
                      </span>
                    )}
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      ({p.items.length})
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {visiblePlans.length > 0 && (
        <>
      {/* 3. Container Status Overview Cards (5 KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* KPI 1: Total Models in this container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{lang === 'my' ? 'စုစုပေါင်း မော်ဒယ်' : 'รายการในตู้นี้ทั้งหมด'}</span>
            <Package className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {stats.totalItems} <span className="text-xs font-sans font-normal text-slate-400">โมเดล</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            รวมตามแผน {stats.totalPlanSets} {t.pieceUnit}
          </div>
        </div>

        {/* KPI 2: Pending items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{lang === 'my' ? 'ကျန်ရှိနေသော မော်ဒယ်' : 'ยังค้างผลิต / รอตรวจ'}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            {stats.pendingCount} <span className="text-xs font-sans font-normal text-slate-400">โมเดล</span>
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">
            {stats.pendingCount === 0 ? '✨ ครบถ้วนทุกรายการ' : 'ยังไม่ได้ปิดยอด'}
          </div>
        </div>

        {/* KPI 3: Closed / Checked items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{lang === 'my' ? 'ပြီးစီးပြီး ပိတ်ထားသည်' : 'ตรวจสอบปิดยอดแล้ว'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {stats.closedCount} <span className="text-xs font-sans font-normal text-slate-400">โมเดล</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            {Math.round((stats.closedCount / (stats.totalItems || 1)) * 100)}% ของตู้นี้
          </div>
        </div>

        {/* KPI 4: Cancelled items */}
        <div 
          onClick={() => setFilterMode('CANCELLED')}
          className="bg-slate-900 border border-slate-800 hover:border-rose-500/60 rounded-2xl p-4 shadow-lg cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="group-hover:text-rose-300 transition-colors">
              {lang === 'my' ? 'ဖျက်သိမ်းထားသည်' : 'ยกเลิกการผลิต'}
            </span>
            <Ban className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
            {stats.cancelledCount} <span className="text-xs font-sans font-normal text-slate-400">โมเดล</span>
          </div>
          <div className="text-[11px] text-rose-300/90 mt-1">
            {stats.cancelledCount > 0 ? '🚫 วางแผนยกเลิก (แตะเพื่อกรอง)' : 'ไม่มีรายการยกเลิก'}
          </div>
        </div>

        {/* KPI 5: Models appearing in future containers */}
        <div 
          onClick={() => setFilterMode('HAS_FUTURE')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-4 shadow-lg cursor-pointer transition-all group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="group-hover:text-amber-300 transition-colors">
              {lang === 'my' ? 'နောက်ကွန်တိန်နာတွင် တူညီသော မော်ဒယ်' : 'โมเดลซ้ำในตู้ถัดไป'}
            </span>
            <Bell className="w-4 h-4 text-amber-400 group-hover:animate-bounce" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            {stats.hasFutureCount} <span className="text-xs font-sans font-normal text-slate-400">โมเดล</span>
          </div>
          <div className="text-[11px] text-amber-300/90 mt-1 flex items-center space-x-1">
            <span>🔔 มีในตู้ถัดๆ ไป (แตะดูกรอง)</span>
          </div>
        </div>
      </div>

      {/* 4. Search and Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={lang === 'my' ? 'မော်ဒယ်နံပါတ်ဖြင့် ရှာပါ เช่น AM106, TT26, B625...' : 'ค้นหารหัสโมเดลในตู้นี้ เช่น AM106, TT26, B625, MX204...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs sm:text-sm font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                filterMode === 'ALL'
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {lang === 'my' ? 'အားလုံး' : 'ทั้งหมด'} ({stats.totalItems})
            </button>

            <button
              onClick={() => setFilterMode('PENDING')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                filterMode === 'PENDING'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'my' ? 'ကျန်ရှိနေဆဲ' : 'ค้างผลิต'} ({stats.pendingCount})</span>
            </button>

            <button
              onClick={() => setFilterMode('CLOSED')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                filterMode === 'CLOSED'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'my' ? 'ပိတ်ပြီး' : 'ปิดยอดแล้ว'} ({stats.closedCount})</span>
            </button>

            <button
              onClick={() => setFilterMode('CANCELLED')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                filterMode === 'CANCELLED'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-800 text-rose-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>{lang === 'my' ? 'ဖျက်သိမ်းပြီး' : 'ยกเลิกผลิต'} ({stats.cancelledCount})</span>
            </button>

            <button
              onClick={() => setFilterMode('YELLOW')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                filterMode === 'YELLOW'
                  ? 'bg-yellow-500 text-slate-950 shadow font-bold'
                  : stats.yellowCount > 0
                  ? 'bg-yellow-950/60 text-yellow-300 hover:bg-yellow-900/60 border border-yellow-600/60'
                  : 'bg-slate-800 text-yellow-400/80 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{lang === 'my' ? 'အရေအတွက်ပြောင်း' : 'ปรับยอด/สีเหลือง'} ({stats.yellowCount})</span>
            </button>

            <button
              onClick={() => setFilterMode('HAS_FUTURE')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                filterMode === 'HAS_FUTURE'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-800 text-purple-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{lang === 'my' ? 'နောက်ကွန်တိန်နာတွင် တူညီ' : 'ซ้ำในตู้ถัดไป'} ({stats.hasFutureCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Global Search Results (ถ้าค้นหาแล้วเจอในตู้สินค้าอื่นๆ — กดจิ้มเพื่อวาร์ปไปยังตู้นั้นได้เลย) */}
      {searchQuery.trim().length >= 3 && globalModelSearchResults.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-600/50 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-amber-300 font-bold">
              <Search className="w-4 h-4 text-amber-400" />
              <span>
                {lang === 'my'
                  ? `မော်ဒယ် "${searchQuery}" ကို ကွန်တိန်နာ ${globalModelSearchResults.length} ခုတွင် တွေ့ရှိသည်:`
                  : `ผลการค้นหาข้ามตู้: พบโมเดล "${searchQuery}" ในแผนงานทั้งหมด ${globalModelSearchResults.length} รายการ:`}
              </span>
            </div>
            <span className="text-[11px] text-amber-200/80">
              {lang === 'my' ? '👆 နှိပ်၍ ကွန်တိန်နာသို့ တိုက်ရိုက်သွားပါ' : '👆 แตะที่ตู้เพื่อข้ามไปยังรายการนั้นทันที'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {globalModelSearchResults.slice(0, 15).map((res, i) => {
              const isCurrent = res.containerKey === makeContainerKey(selectedContainer);
              return (
                <button
                  key={`${res.containerKey}_${res.item.id}_${i}`}
                  type="button"
                  onClick={() => handleJumpToContainerModel(res.containerKey, res.item.modelPartNo)}
                  className={`px-3 py-1.5 rounded-xl border text-left transition-all flex items-center space-x-1.5 group cursor-pointer ${
                    isCurrent
                      ? 'bg-orange-500/25 border-orange-400 text-white shadow-sm shadow-orange-500/20 ring-1 ring-orange-400/60'
                      : 'bg-slate-900 hover:bg-amber-500/20 border-amber-600/40 hover:border-amber-400 text-slate-200 hover:text-white hover:scale-[1.02]'
                  }`}
                  title={`คลิกเพื่อเปิดดู ${res.item.modelPartNo} ในตู้ ${res.containerName}`}
                >
                  <span className="font-bold text-amber-400 group-hover:text-amber-300">{res.containerName}</span>
                  {res.containerDate && <span className="text-slate-400 text-[10px]">({res.containerDate})</span>}
                  {res.item.modelPartNo.toLowerCase() !== searchQuery.trim().toLowerCase() && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-orange-300">
                      {res.item.modelPartNo}
                    </span>
                  )}
                  <span className="text-white font-mono font-bold">: {res.item.planQty} ชุด</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Model Items List in Current Container */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-2">
            <Package className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-300">
              {lang === 'my' ? 'ကိုက်ညီသော ပစ္စည်းမရှိပါ' : 'ไม่พบรายการชิ้นงานที่ตรงกับเงื่อนไข'}
            </h4>
            <p className="text-xs text-slate-500">
              ลองเปลี่ยนคำค้นหา หรือกดเลือกตัวกรอง "ทั้งหมด"
            </p>
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const isClosed = checkIsItemClosed(item);
            const isCancelled = checkIsItemCancelled(item);
            const futureMatches = crossMatches.get(item.modelPartNo.trim()) || [];
            const hasFuture = futureMatches.length > 0;
            const totalFutureQty = futureMatches.reduce((sum, f) => sum + f.qty, 0);

            // คำนวณยอดที่พ่นเสร็จแล้วใน Tracker จริง โดยเชื่อมโยงกับตู้สินค้า
            const normalizeStr = (str: string) =>
              (str || '')
                .toLowerCase()
                .replace(/[\s\-_]/g, '')
                .replace('elsavador', 'elsalvador')
                .replace('costarica', 'costarica')
                .replace('southafica', 'southafrica');

            const isJobForThisContainer = (jobContainer: string) => {
              if (!jobContainer) return false;
              const jc = normalizeStr(jobContainer);
              const targetName = normalizeStr(selectedContainer.name);
              const targetId = normalizeStr(selectedContainer.id);
              return jc === targetName || jc === targetId || jc.includes(targetName) || targetName.includes(jc);
            };

            // ค้นหางานของโมเดลนี้ที่ตรงกับตู้สินค้านี้
            const containerJobsForModel = jobs.filter(
              (j) =>
                isJobForThisContainer(j.container_no) &&
                (j.model_part_no.toLowerCase().includes(item.modelPartNo.toLowerCase()) ||
                  item.modelPartNo.toLowerCase().includes(j.model_part_no.toLowerCase()))
            );

            // ถ้ามีงานที่ระบุตู้สินค้านี้เข้ามา ให้นับเฉพาะของตู้นี้
            // ถ้ายังไม่มีงานที่ระบุตู้ ให้ fallback นับโมเดลเดียวกันทั้งหมด
            const hasAnyTaggedForContainer = jobs.some((j) => isJobForThisContainer(j.container_no));
            const actualCoatedJobs = hasAnyTaggedForContainer
              ? containerJobsForModel
              : jobs.filter(
                  (j) =>
                    j.model_part_no.toLowerCase().includes(item.modelPartNo.toLowerCase()) ||
                    item.modelPartNo.toLowerCase().includes(j.model_part_no.toLowerCase())
                );

            const actualReceivedQty = actualCoatedJobs.reduce((sum, j) => sum + (j.quantity || 1), 0);
            const actualFinishedQty = actualCoatedJobs
              .filter((j) => j.status === 'COMPLETED' || j.status === 'DISPATCHED_TO_PACKING')
              .reduce((sum, j) => sum + (j.quantity || 1), 0);

            const isPlanComplete = actualFinishedQty >= item.planQty && item.planQty > 0;
            const cleanItemModel = item.modelPartNo.trim().toLowerCase();
            const isHighlighted = highlightedModel === cleanItemModel;

            return (
              <div
                key={item.id}
                id={`plan-item-${cleanItemModel.replace(/[^a-z0-9]/g, '_')}`}
                className={`border rounded-2xl p-4 sm:p-5 transition-all shadow-md relative overflow-hidden ${
                  isHighlighted
                    ? 'bg-slate-900 border-orange-400 ring-2 ring-orange-400/80 shadow-lg shadow-orange-500/25'
                    : isCancelled
                    ? 'bg-slate-900/60 border-rose-900/80 opacity-80'
                    : isClosed
                    ? 'bg-slate-900/60 border-slate-800/80 opacity-75'
                    : isPlanComplete
                    ? 'bg-slate-900 border-emerald-500/60 hover:border-emerald-400 shadow-emerald-950/30'
                    : hasFuture
                    ? 'bg-slate-900 border-amber-600/40 hover:border-amber-500/70 shadow-amber-950/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Model Name & Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        #{index + 1}
                      </span>
                      <h3 className={`font-mono font-black text-base sm:text-lg tracking-wide ${isCancelled ? 'line-through text-rose-400/80' : isClosed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {item.modelPartNo}
                      </h3>

                      {/* Status Badge */}
                      {isCancelled ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-700">
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                          <span>{lang === 'my' ? 'ထုတ်လုပ်မှု ဖျက်သိမ်းသည်' : 'แผนกวางแผนยกเลิกผลิต'}</span>
                        </span>
                      ) : isClosed ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'my' ? 'စစ်ဆေးပြီး' : 'ปิดยอดแล้ว'}</span>
                        </span>
                      ) : isPlanComplete ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 animate-pulse">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lang === 'my' ? 'အစီအစဉ်အတိုင်း ပြည့်ပါပြီ' : '🎉 พ่นครบตามเป้าแล้ว! พร้อมปิดยอด'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-700">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{lang === 'my' ? 'ထုတ်လုပ်ဆဲ' : 'ค้างผลิตในตู้นี้'}</span>
                        </span>
                      )}

                      {/* Yellow / Quantity Changed Badge from Google Sheet */}
                      {checkIsItemYellow(item) && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/70">
                          <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                          <span>
                            {item.previousPlanQty !== undefined && item.previousPlanQty !== item.planQty
                              ? `${lang === 'my' ? 'အရေအတွက်ပြောင်း' : 'วางแผนปรับยอด'}: ${item.previousPlanQty} → ${item.planQty} (${item.planQty - item.previousPlanQty > 0 ? `+${item.planQty - item.previousPlanQty}` : item.planQty - item.previousPlanQty})`
                              : item.rawQtyText
                              ? `${lang === 'my' ? 'အဝါရောင် သတိပေး' : 'วางแผนปรับยอด'}: ${item.rawQtyText}`
                              : (lang === 'my' ? 'အဝါရောင် (အရေအတွက် စစ်ဆေးပါ)' : 'วางแผนไฮไลต์สีเหลือง (ตรวจยอด)')}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Department Notes from Google Sheet if any */}
                    {(item.note || item.pcStatus) && (
                      <p className="text-xs text-slate-400 flex items-start space-x-1 leading-relaxed">
                        <span className="text-slate-500 font-semibold shrink-0">หมายเหตุแผนก:</span>
                        <span className="text-amber-300/90 font-medium">
                          {[item.pcStatus, item.note].filter(Boolean).join(' • ')}
                        </span>
                      </p>
                    )}

                    {/* 🔔 Cross-Container Duplicate Alert Box (แจ้งเตือนโมเดลซ้ำในตู้ถัดไป) */}
                    {hasFuture && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                        <div className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-2.5 text-xs text-amber-200 space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-amber-300">
                            <span className="flex items-center space-x-1.5">
                              <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                              <span>
                                {lang === 'my' 
                                  ? `နောက်ကွန်တိန်နာများတွင်လည်း ဤမော်ဒယ် စုစုပေါင်း ${totalFutureQty} ခု ရှိသည်:` 
                                  : `🔔 โมเดลนี้มีในตู้ถัดไปด้วย รวม ${totalFutureQty} ชุด:`}
                              </span>
                            </span>
                            <span className="text-[10px] font-mono bg-amber-900/60 px-2 py-0.5 rounded text-amber-200">
                              {futureMatches.length} ตู้ถัดไป
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {futureMatches.map((f, fi) => (
                              <button
                                key={fi}
                                type="button"
                                onClick={() => handleJumpToContainerModel(f.containerKey, item.modelPartNo)}
                                className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-amber-500/20 border border-amber-600/30 hover:border-amber-400 text-slate-200 hover:text-white flex items-center space-x-1 font-mono text-[11px] transition-all cursor-pointer group"
                                title={`คลิกเพื่อเปิดดู ${item.modelPartNo} ในตู้ ${f.containerName}`}
                              >
                                <span className="font-bold text-amber-300">{f.containerName}</span>
                                {f.containerDate && <span className="text-slate-400 text-[10px]">({f.containerDate})</span>}
                                <span className="text-emerald-400 font-bold">={f.qty} ชุด</span>
                                <ArrowRight className="w-3 h-3 text-amber-400/70 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Middle: Quantities (Plan vs Actual) */}
                  <div className="flex items-center space-x-4 shrink-0 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div className="text-center min-w-[70px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {lang === 'my' ? 'အစီအစဉ်' : 'เป้าตามแผน'}
                      </span>
                      <span className="text-lg sm:text-xl font-mono font-black text-white">
                        {item.planQty} <span className="text-xs font-sans text-slate-400">{t.pieceUnit}</span>
                      </span>
                    </div>

                    <div className="h-8 w-px bg-slate-800" />

                    <div className="text-center min-w-[70px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {lang === 'my' ? 'ဆေးမှုတ်ပြီး' : 'พ่นสีเสร็จแล้ว'}
                      </span>
                      <span className={`text-lg sm:text-xl font-mono font-black ${actualFinishedQty >= item.planQty ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {actualFinishedQty} <span className="text-xs font-sans text-slate-400">{t.pieceUnit}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions (Close / Cancel / Reopen — เฉพาะผู้ที่ล็อกอินแล้วเท่านั้น) */}
                  <div className="shrink-0 flex items-center space-x-2">
                    {!isOperator ? (
                      <button
                        type="button"
                        onClick={() => openPinModal()}
                        className="px-3 py-2 rounded-xl border border-slate-700/80 bg-slate-800/70 hover:bg-slate-800 hover:border-orange-500/50 text-slate-400 hover:text-orange-300 text-xs font-medium transition-colors flex items-center space-x-1.5"
                        title="กรุณาล็อกอินด้วย PIN ก่อนปิดรายการหรือยกเลิกการผลิต"
                      >
                        <Lock className="w-3.5 h-3.5 text-orange-400/80" />
                        <span>{lang === 'my' ? 'လော့ဂ်အင်ဝင်ရန်' : 'ล็อกอินเพื่อจัดการ'}</span>
                      </button>
                    ) : isCancelled ? (
                      <button
                        type="button"
                        onClick={() => handleToggleCancel(item.id, item.modelPartNo)}
                        className="px-3 py-2 rounded-xl border border-rose-700/80 bg-rose-950/50 hover:bg-rose-900/70 text-rose-200 text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow"
                        title="คืนรายการนี้กลับมาวางแผนผลิตตามปกติ"
                      >
                        <Undo2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>{lang === 'my' ? 'ပြန်လည်ထုတ်လုပ်မည်' : 'คืนรายการผลิต'}</span>
                      </button>
                    ) : isClosed ? (
                      <button
                        type="button"
                        onClick={() => handleToggleClose(item.id, item.modelPartNo)}
                        className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center space-x-1.5"
                        title="เปิดรายการกลับมาทำงานต่อ"
                      >
                        <Undo2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>{lang === 'my' ? 'ပြန်ဖွင့်မည်' : 'เปิดรายการใหม่'}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleToggleClose(item.id, item.modelPartNo)}
                          className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-white font-bold text-xs transition-all flex items-center space-x-1.5 ${
                            isPlanComplete
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/50 scale-105'
                              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/50'
                          }`}
                          title="ตรวจสอบร่วมกับแผนกวางแผนแล้ว กดปิดรายการนี้"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>{lang === 'my' ? 'စစ်ဆေးပြီး ပိတ်မည်' : 'ตรวจแล้ว ปิดรายการ'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleCancel(item.id, item.modelPartNo)}
                          className="px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border border-rose-800/80 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 text-xs font-semibold transition-all flex items-center space-x-1"
                          title="ฝ่ายวางแผนแจ้งยกเลิกโมเดลนี้ในตู้นี้"
                        >
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                          <span>{lang === 'my' ? 'ဖျက်သိမ်း' : 'ยกเลิกผลิต'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
        </>
      )}

      {/* Modal: จัดการตู้สินค้าที่แสดงผล (Container Visibility Manager) */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'my' ? 'ကွန်တိန်နာ ပြသမှု စီမံခန့်ခွဲခြင်း' : 'จัดการตู้สินค้าที่แสดงผล (ซ่อน/แสดง)'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'my'
                      ? 'လက်ရှိထုတ်လုပ်မည့် ကွန်တိန်နာများကိုသာ ရွေးချယ်ပြသပါ'
                      : 'เลือกแสดงเฉพาะตู้ที่ผลิตจริง ซ่อนตู้ที่ยกเลิก เลื่อนกำหนด หรือส่งออกจบแล้ว (มีผลทั้งหน้าแผนผลิตและฟอร์มรับงาน)'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsManageModalOpen(false);
                  setManageSearch('');
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Toolbar: Search & Bulk Actions */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อตู้ หรือวันที่ เช่น KENYA, SOUTH, RMA, 27/11..."
                    value={manageSearch}
                    onChange={(e) => setManageSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {manageSearch && (
                    <button
                      type="button"
                      onClick={() => setManageSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleShowAllContainers}
                    className="px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/70 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>แสดงทั้งหมด</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleHideAllContainers}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>ซ่อนทั้งหมด</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  กำลังแสดง <strong className="text-emerald-400">{visiblePlans.length}</strong> ตู้ • ซ่อนอยู่{' '}
                  <strong className="text-rose-400">{actualHiddenCount}</strong> ตู้ (จากทั้งหมด {plans.length} ตู้ใน Google Sheet)
                </span>
                {!isOperator && (
                  <span className="text-amber-400 font-medium flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>ต้องยืนยัน PIN ช่าง/หัวหน้างานเพื่อแก้ไข</span>
                  </span>
                )}
              </div>
            </div>

            {/* Modal Container List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {plans
                .filter((p) => {
                  if (!manageSearch.trim()) return true;
                  const q = manageSearch.toLowerCase();
                  return (
                    p.name.toLowerCase().includes(q) ||
                    (p.date || '').toLowerCase().includes(q)
                  );
                })
                .map((p) => {
                  const key = makeContainerKey(p);
                  const isHidden = hiddenContainerKeys.has(key);
                  return (
                    <div
                      key={key}
                      onClick={() => handleToggleContainerVisibility(p)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isHidden
                          ? 'bg-slate-950/50 border-slate-800/80 opacity-60 hover:opacity-85 hover:border-slate-700'
                          : 'bg-slate-800/70 border-emerald-500/40 hover:border-emerald-400 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isHidden
                              ? 'bg-slate-900 border-slate-800 text-slate-500'
                              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          }`}
                        >
                          {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`font-bold text-sm truncate ${isHidden ? 'line-through text-slate-400' : 'text-white'}`}>
                              {p.name}
                            </span>
                            {p.date && (
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 border border-slate-700">
                                {p.date}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {p.items.length} โมเดล • รวม {p.items.reduce((s, it) => s + (it.planQty || 1), 0)} ชิ้น
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center space-x-1.5 ${
                            isHidden
                              ? 'bg-slate-900 text-slate-400 border-slate-700'
                              : 'bg-emerald-600 text-white border-emerald-500 shadow'
                          }`}
                        >
                          {isHidden ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>ซ่อนอยู่</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>กำลังแสดง</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                * บันทึกอัตโนมัติลง Cloud และไม่กระทบไฟล์ Google Sheet ของฝ่ายวางแผน
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsManageModalOpen(false);
                  setManageSearch('');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition-all"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
