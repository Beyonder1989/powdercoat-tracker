import React, { useState, useMemo, useEffect } from 'react';
import { 
  Layers, Package, CheckCircle2, Clock, AlertCircle, RefreshCw, 
  ExternalLink, Search, ChevronDown, Check, ArrowRight, Bell, 
  Flame, Filter, Undo2, Calendar, FileSpreadsheet, Sparkles
} from 'lucide-react';
import { ContainerPlan, PlanItem, PowderCoatJob } from '../types';
import { INITIAL_CONTAINER_PLANS } from '../data/initialContainerPlans';
import { 
  fetchClosedPlanItemIds, 
  saveClosedPlanItemIds, 
  getActiveContainerId, 
  setActiveContainerId, 
  getCrossContainerMatches,
  syncPlansFromGoogleSheet,
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

  // แผนการผลิตทั้งหมด (เริ่มต้นจาก 25 ตู้ที่ดึงมาจาก Google Sheet)
  const [plans, setPlans] = useState<ContainerPlan[]>(INITIAL_CONTAINER_PLANS);
  const [selectedContainerId, setSelectedContainerId] = useState<string>(getActiveContainerId);
  const [closedItemIds, setClosedItemIds] = useState<Set<string>>(new Set());
  
  // UI States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'PENDING' | 'CLOSED' | 'HAS_FUTURE'>('ALL');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // โหลดรายการ ID ที่ปิดยอดแล้วจาก Cloud / LocalStorage
  useEffect(() => {
    fetchClosedPlanItemIds().then((ids) => {
      setClosedItemIds(new Set(ids));
    });
  }, []);

  // เมื่อเปลี่ยนตู้ ให้บันทึกเป็นตู้ปัจจุบัน
  const handleSelectContainer = (id: string) => {
    setSelectedContainerId(id);
    setActiveContainerId(id);
  };

  // ดึงตู้ที่เลือกอยู่ปัจจุบัน
  const selectedContainer = useMemo(() => {
    return plans.find((p) => p.id === selectedContainerId) || plans[0];
  }, [plans, selectedContainerId]);

  // คำนวณรายการโมเดลที่ซ้ำในตู้ถัดๆ ไป (Cross-Container Match)
  const crossMatches = useMemo(() => {
    return getCrossContainerMatches(selectedContainer.id, plans);
  }, [selectedContainer.id, plans]);

  // Toggle ปิด/เปิดรายการชิ้นงาน (Reconciliation)
  const handleToggleClose = async (itemId: string) => {
    if (!isOperator) {
      openPinModal();
      return;
    }

    const nextClosed = new Set(closedItemIds);
    if (nextClosed.has(itemId)) {
      nextClosed.delete(itemId);
    } else {
      nextClosed.add(itemId);
    }

    setClosedItemIds(nextClosed);
    await saveClosedPlanItemIds(Array.from(nextClosed));
  };

  // ฟังก์ชันซิงค์ข้อมูลสดจาก Google Sheet
  const handleSyncGoogleSheet = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncPlansFromGoogleSheet();
      if (res.success && res.plans.length > 0) {
        setPlans(res.plans);
        setSyncMessage(
          lang === 'my' 
            ? 'Google Sheet မှ နောက်ဆုံး အချက်အလက်များကို ရယူပြီးပါပြီ' 
            : 'ซิงค์ข้อมูลล่าสุดจาก Google Sheet สำเร็จเรียบร้อยแล้ว'
        );
      } else {
        setSyncMessage(res.message || 'ใช้ข้อมูลแผนงานล่าสุดในระบบ');
      }
    } catch (e: any) {
      setSyncMessage('ไม่สามารถเชื่อมต่อได้ กำลังใช้ข้อมูลแผนงานล่าสุดในระบบ');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  // คำนวณสถิติภาพรวมของตู้นี้
  const stats = useMemo(() => {
    const totalItems = selectedContainer.items.length;
    const totalPlanSets = selectedContainer.items.reduce((s, it) => s + (it.planQty || 1), 0);
    let closedCount = 0;
    let hasFutureCount = 0;

    selectedContainer.items.forEach((it) => {
      if (closedItemIds.has(it.id)) {
        closedCount++;
      }
      if (crossMatches.has(it.modelPartNo.trim())) {
        hasFutureCount++;
      }
    });

    const pendingCount = totalItems - closedCount;
    return { totalItems, totalPlanSets, closedCount, pendingCount, hasFutureCount };
  }, [selectedContainer, closedItemIds, crossMatches]);

  // กรองรายการชิ้นงานในตู้ตามค้นหาและสถานะ
  const filteredItems = useMemo(() => {
    return selectedContainer.items.filter((item) => {
      const isClosed = closedItemIds.has(item.id);
      const hasFuture = crossMatches.has(item.modelPartNo.trim());

      // Filter Mode
      if (filterMode === 'PENDING' && isClosed) return false;
      if (filterMode === 'CLOSED' && !isClosed) return false;
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
  }, [selectedContainer, closedItemIds, crossMatches, filterMode, searchQuery]);

  // ค้นหาข้ามตู้ (กรณีผู้ใช้พิมพ์ค้นหาโมเดล แล้วอยากรู้ว่ามีในตู้ไหนบ้าง)
  const globalModelSearchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) return [];
    const q = searchQuery.trim().toLowerCase();
    const results: Array<{ containerName: string; containerDate?: string; item: PlanItem }> = [];

    plans.forEach((p) => {
      p.items.forEach((it) => {
        if (it.modelPartNo.toLowerCase().includes(q)) {
          results.push({
            containerName: p.name,
            containerDate: p.date,
            item: it,
          });
        }
      });
    });

    return results;
  }, [plans, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
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

          {/* Action Buttons: Sync Google Sheet & View Real Sheet */}
          <div className="flex flex-wrap items-center gap-2">
            <button
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
                ? `စုစုပေါင်း ကွန်တိန်နာ ${plans.length} ခု တွေ့ရှိသည်` 
                : `พบแผนงานทั้งหมด ${plans.length} ตู้ (ตู้ปัจจุบัน: ${selectedContainer.name})`}
            </span>
          </div>

          {/* Container Selector Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {plans.map((p) => {
              const isSelected = p.id === selectedContainer.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectContainer(p.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 ${
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
        </div>
      </div>

      {/* 3. Container Status Overview Cards (4 KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

        {/* KPI 4: Models appearing in future containers */}
        <div 
          onClick={() => setFilterMode('HAS_FUTURE')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-4 shadow-lg cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="group-hover:text-amber-300 transition-colors">
              {lang === 'my' ? 'နောက်ကွန်တိန်နာတွင် တူညီသော မော်ဒယ်' : 'โมเดลที่ซ้ำในตู้ถัดไป'}
            </span>
            <Bell className="w-4 h-4 text-amber-400 group-hover:animate-bounce" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            {stats.hasFutureCount} <span className="text-xs font-sans font-normal text-slate-400">โมเดล</span>
          </div>
          <div className="text-[11px] text-amber-300/90 mt-1 flex items-center space-x-1">
            <span>🔔 มีในตู้ถัดๆ ไปด้วย (แตะเพื่อกรองดู)</span>
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

      {/* 5. Global Search Results (ถ้าค้นหาแล้วเจอในตู้สินค้าอื่นๆ) */}
      {searchQuery.trim().length >= 3 && globalModelSearchResults.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-600/50 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 font-bold">
            <Search className="w-4 h-4 text-amber-400" />
            <span>
              {lang === 'my'
                ? `မော်ဒယ် "${searchQuery}" ကို အခြား ကွန်တိန်နာ ${globalModelSearchResults.length} ခုတွင် တွေ့ရှိသည်:`
                : `ผลการค้นหาข้ามตู้: พบโมเดล "${searchQuery}" ในแผนงานทั้งหมด ${globalModelSearchResults.length} รายการ:`}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {globalModelSearchResults.slice(0, 10).map((res, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-600/40 text-slate-200 flex items-center space-x-1.5"
              >
                <span className="font-bold text-amber-400">{res.containerName}</span>
                {res.containerDate && <span className="text-slate-400 text-[10px]">({res.containerDate})</span>}
                <span className="text-white font-mono font-bold">: {res.item.planQty} ชุด</span>
              </span>
            ))}
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
            const isClosed = closedItemIds.has(item.id);
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

            return (
              <div
                key={item.id}
                className={`border rounded-2xl p-4 sm:p-5 transition-all shadow-md relative overflow-hidden ${
                  isClosed
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
                      <h3 className={`font-mono font-black text-base sm:text-lg tracking-wide ${isClosed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {item.modelPartNo}
                      </h3>

                      {/* Status Badge */}
                      {isClosed ? (
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
                              <span
                                key={fi}
                                className="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-amber-600/30 text-slate-200 flex items-center space-x-1 font-mono text-[11px]"
                              >
                                <span className="font-bold text-amber-300">{f.containerName}</span>
                                {f.containerDate && <span className="text-slate-400 text-[10px]">({f.containerDate})</span>}
                                <span className="text-emerald-400 font-bold">={f.qty} ชุด</span>
                              </span>
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

                  {/* Right: Close / Reopen Action Button */}
                  <div className="shrink-0 flex items-center space-x-2">
                    {isClosed ? (
                      <button
                        type="button"
                        onClick={() => handleToggleClose(item.id)}
                        className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center space-x-1.5"
                        title="เปิดรายการกลับมาทำงานต่อ"
                      >
                        <Undo2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>{lang === 'my' ? 'ပြန်ဖွင့်မည်' : 'เปิดรายการใหม่'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleClose(item.id)}
                        className={`px-4 py-2.5 rounded-xl text-white font-bold text-xs transition-all flex items-center space-x-1.5 ${
                          isPlanComplete
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/50 scale-105'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/50'
                        }`}
                        title="ตรวจสอบร่วมกับแผนกวางแผนแล้ว กดปิดรายการนี้"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{lang === 'my' ? 'စစ်ဆေးပြီး ပိတ်မည်' : 'ตรวจแล้ว ปิดรายการ'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
