import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Download, 
  Layers, 
  Package, 
  TrendingUp, 
  Users, 
  Building2, 
  CheckCircle2, 
  Droplets, 
  Sparkles, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  Filter
} from 'lucide-react';
import { PowderCoatJob, JobStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AnalyticsDashboardProps {
  jobs: PowderCoatJob[];
  onSelectJob: (job: PowderCoatJob) => void;
}

type DateFilterType = 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'ALL_TIME' | 'CUSTOM';

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  jobs,
  onSelectJob,
}) => {
  const { lang, t } = useLanguage();
  const [filterType, setFilterType] = useState<DateFilterType>('TODAY');
  const [customDate, setCustomDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Helper to format minutes into human readable text
  const formatMinutes = (totalMinutes: number) => {
    if (totalMinutes <= 0) return '-';
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    if (hours === 0) return `${mins} นาที`;
    return `${hours} ชม. ${mins > 0 ? `${mins} นาที` : ''}`;
  };

  // Filter jobs by date range
  const filteredJobs = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return jobs.filter((job) => {
      // Check timestamp based on most recent activity: dispatched_at -> coating_finished_at -> coating_started_at -> received_at
      const dateToCompare = new Date(
        job.dispatched_at || job.coating_finished_at || job.coating_started_at || job.received_at
      );

      switch (filterType) {
        case 'TODAY':
          return dateToCompare >= today;
        case 'YESTERDAY':
          return dateToCompare >= yesterday && dateToCompare < today;
        case 'LAST_7_DAYS':
          return dateToCompare >= sevenDaysAgo;
        case 'CUSTOM': {
          if (!customDate) return true;
          const target = new Date(customDate);
          target.setHours(0, 0, 0, 0);
          const nextDay = new Date(target);
          nextDay.setDate(nextDay.getDate() + 1);
          return dateToCompare >= target && dateToCompare < nextDay;
        }
        case 'ALL_TIME':
        default:
          return true;
      }
    });
  }, [jobs, filterType, customDate]);

  // Calculations for KPIs
  const metrics = useMemo(() => {
    // 1. Total Coated: Jobs completed or dispatched
    const coatedJobs = filteredJobs.filter(
      (j) => j.status === 'COMPLETED' || j.status === 'DISPATCHED_TO_PACKING'
    );
    const totalCoatedParts = coatedJobs.reduce((sum, j) => sum + (j.quantity || 1), 0);

    // 2. Total Hangers Used
    const hangerSet = new Set<string>();
    filteredJobs.forEach((j) => {
      if (j.hanger_no) hangerSet.add(j.hanger_no);
    });
    const totalHangersUsed = hangerSet.size;

    // 3. Average Coating Duration
    let totalDurationMs = 0;
    let durationCount = 0;
    filteredJobs.forEach((j) => {
      if (j.coating_started_at && j.coating_finished_at) {
        const start = new Date(j.coating_started_at).getTime();
        const finish = new Date(j.coating_finished_at).getTime();
        if (finish > start) {
          totalDurationMs += finish - start;
          durationCount++;
        }
      }
    });
    const avgDurationMinutes = durationCount > 0 ? totalDurationMs / durationCount / 60000 : 0;
    const totalCoatingHours = (totalDurationMs / (1000 * 60 * 60)).toFixed(1);

    // 4. Received in period
    const totalReceivedParts = filteredJobs.reduce((sum, j) => sum + (j.quantity || 1), 0);

    // 5. Dispatched in period
    const dispatchedJobs = filteredJobs.filter((j) => j.status === 'DISPATCHED_TO_PACKING');
    const totalDispatchedParts = dispatchedJobs.reduce((sum, j) => sum + (j.quantity || 1), 0);

    // 6. Current WIP remaining in department (across entire database)
    const currentWipJobs = jobs.filter((j) => j.status !== 'DISPATCHED_TO_PACKING');
    const currentWipParts = currentWipJobs.reduce((sum, j) => sum + (j.quantity || 1), 0);
    const wipReceivedParts = jobs
      .filter((j) => j.status === 'RECEIVED')
      .reduce((sum, j) => sum + (j.quantity || 1), 0);
    const wipInProgressParts = jobs
      .filter((j) => j.status === 'IN_PROGRESS')
      .reduce((sum, j) => sum + (j.quantity || 1), 0);
    const wipCompletedParts = jobs
      .filter((j) => j.status === 'COMPLETED')
      .reduce((sum, j) => sum + (j.quantity || 1), 0);

    // 7. Coating Process Breakdown
    let edpOnlyCount = 0;
    let edpAndPowderCount = 0;
    filteredJobs.forEach((j) => {
      if (j.coating_type === 'EDP_ONLY') edpOnlyCount += j.quantity || 1;
      else if (j.coating_type === 'EDP_AND_POWDER') edpAndPowderCount += j.quantity || 1;
    });

    // 8. Department breakdowns
    const senderMap: Record<string, number> = {};
    const targetMap: Record<string, number> = {};
    filteredJobs.forEach((j) => {
      const sender = j.sender_department || 'Other';
      senderMap[sender] = (senderMap[sender] || 0) + (j.quantity || 1);

      if (j.target_department || j.status === 'DISPATCHED_TO_PACKING') {
        const target = j.target_department || 'Packing (PK)';
        targetMap[target] = (targetMap[target] || 0) + (j.quantity || 1);
      }
    });

    return {
      totalCoatedParts,
      totalCoatedJobs: coatedJobs.length,
      totalHangersUsed,
      avgDurationMinutes,
      totalCoatingHours,
      totalReceivedParts,
      totalReceivedJobs: filteredJobs.length,
      totalDispatchedParts,
      totalDispatchedJobs: dispatchedJobs.length,
      currentWipParts,
      currentWipJobs: currentWipJobs.length,
      wipReceivedParts,
      wipInProgressParts,
      wipCompletedParts,
      edpOnlyCount,
      edpAndPowderCount,
      senderMap,
      targetMap,
    };
  }, [filteredJobs, jobs]);

  // Export to Excel / CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'Tracking Code',
      'สถานะ',
      'ความเร่งด่วน',
      'Model / Part No.',
      'ชื่อชิ้นงาน',
      'หมายเลขตู้ (Box)',
      'จำนวนชิ้น',
      'หมายเลขแฮงค์เกอร์',
      'ประเภทกระบวนการ',
      'แผนกต้นทาง',
      'ผู้ส่งมอบ',
      'เวลารับเข้า',
      'ผู้รับงานพ่นสี',
      'เวลาเริ่มพ่นสี',
      'เวลาพ่นสีเสร็จ',
      'ระยะเวลาพ่นสี (นาที)',
      'แผนกปลายทาง',
      'ผู้รับมอบปลายทาง',
      'เวลาส่งมอบออก',
      'หมายเหตุ',
    ];

    const rows = filteredJobs.map((j) => {
      let durationMinutes = '';
      if (j.coating_started_at && j.coating_finished_at) {
        const diff = new Date(j.coating_finished_at).getTime() - new Date(j.coating_started_at).getTime();
        durationMinutes = String(Math.round(diff / 60000));
      }

      return [
        `"${j.tracking_code || ''}"`,
        `"${j.status || ''}"`,
        `"${j.priority || 'NORMAL'}"`,
        `"${j.model_part_no || ''}"`,
        `"${j.part_name || ''}"`,
        `"${j.container_no || ''}"`,
        j.quantity || 1,
        `"${j.hanger_no || '-'}"`,
        `"${j.coating_type === 'EDP_ONLY' ? 'EDP ONLY' : j.coating_type === 'EDP_AND_POWDER' ? 'EDP + POWDER' : '-'}"`,
        `"${j.sender_department || ''}"`,
        `"${j.sender_name || ''}"`,
        `"${j.received_at ? new Date(j.received_at).toLocaleString('th-TH') : ''}"`,
        `"${j.receiver_name || ''}"`,
        `"${j.coating_started_at ? new Date(j.coating_started_at).toLocaleString('th-TH') : ''}"`,
        `"${j.coating_finished_at ? new Date(j.coating_finished_at).toLocaleString('th-TH') : ''}"`,
        durationMinutes,
        `"${j.target_department || (j.status === 'DISPATCHED_TO_PACKING' ? 'Packing (PK)' : '-')}"`,
        `"${j.packing_receiver_name || '-'}"`,
        `"${j.dispatched_at ? new Date(j.dispatched_at).toLocaleString('th-TH') : ''}"`,
        `"${(j.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PowderCoat_Report_${filterType}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtered table data for movement log
  const movementLogs = useMemo(() => {
    return filteredJobs.filter((job) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        job.tracking_code?.toLowerCase().includes(q) ||
        job.model_part_no?.toLowerCase().includes(q) ||
        job.part_name?.toLowerCase().includes(q) ||
        job.container_no?.toLowerCase().includes(q) ||
        job.hanger_no?.toLowerCase().includes(q)
      );
    });
  }, [filteredJobs, searchQuery]);

  return (
    <div className="space-y-6 pb-16 w-full max-w-full min-w-0">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              {t.analyticsTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t.analyticsSubtitle}
          </p>
        </div>

        {/* Date Filter & Export Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs">
            {(
              [
                { id: 'TODAY', label: t.filterToday },
                { id: 'YESTERDAY', label: t.filterYesterday },
                { id: 'LAST_7_DAYS', label: t.filterLast7Days },
                { id: 'ALL_TIME', label: t.filterAllTime },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilterType(item.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterType === item.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Custom Date Input */}
          <div className="relative">
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setFilterType('CUSTOM');
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition-all"
            title="ส่งออกไฟล์ Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.btnExportExcel}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (6 Stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Coated Parts */}
        <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.kpiTotalCoated}
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {metrics.totalCoatedParts}
            </span>
            <span className="text-xs text-slate-400">{t.pieceUnit}</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {metrics.totalCoatedJobs} งานที่พ่นเสร็จ
          </span>
        </div>

        {/* 2. Hangers Used */}
        <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.kpiTotalHangers}
            </span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <span className="text-sm">🪝</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
              {metrics.totalHangersUsed}
            </span>
            <span className="text-xs text-slate-400">ตัว</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            แขวนขึ้นไลน์โซ่
          </span>
        </div>

        {/* 3. Average Coating Time */}
        <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.kpiAvgTime}
            </span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-black text-blue-300 font-mono block">
              {formatMinutes(metrics.avgDurationMinutes)}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            รวม {metrics.totalCoatingHours} ชม.
          </span>
        </div>

        {/* 4. Received in Period */}
        <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.kpiReceived}
            </span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <ArrowDownRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
              {metrics.totalReceivedParts}
            </span>
            <span className="text-xs text-slate-400">{t.pieceUnit}</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {metrics.totalReceivedJobs} ใบรับเข้า
          </span>
        </div>

        {/* 5. Dispatched in Period */}
        <div className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.kpiDispatched}
            </span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
              {metrics.totalDispatchedParts}
            </span>
            <span className="text-xs text-slate-400">{t.pieceUnit}</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {metrics.totalDispatchedJobs} งวดส่งมอบ
          </span>
        </div>

        {/* 6. WIP Current Pending in Department */}
        <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/60 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">
              {t.kpiWipPending}
            </span>
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
              {metrics.currentWipParts}
            </span>
            <span className="text-xs text-slate-400">{t.pieceUnit}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
            <span>รอ: {metrics.wipReceivedParts}</span>
            <span>•</span>
            <span>พ่น: {metrics.wipInProgressParts}</span>
            <span>•</span>
            <span>เสร็จ: {metrics.wipCompletedParts}</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Cards: Coating Type & Department Flows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Process Proportion (EDP Only vs EDP + Powder) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>🎨</span>
            <span>{t.sectionCoatingProcess}</span>
          </h3>

          <div className="space-y-3">
            {/* EDP Only Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-cyan-300 flex items-center space-x-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>EDP อย่างเดียว (EDP Only)</span>
                </span>
                <span className="text-white font-mono font-bold">
                  {metrics.edpOnlyCount} {t.pieceUnit}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      metrics.edpOnlyCount + metrics.edpAndPowderCount > 0
                        ? (metrics.edpOnlyCount / (metrics.edpOnlyCount + metrics.edpAndPowderCount)) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* EDP + Powder Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-purple-300 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EDP + พ่นสีฝุ่น (EDP + Powder)</span>
                </span>
                <span className="text-white font-mono font-bold">
                  {metrics.edpAndPowderCount} {t.pieceUnit}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      metrics.edpOnlyCount + metrics.edpAndPowderCount > 0
                        ? (metrics.edpAndPowderCount / (metrics.edpOnlyCount + metrics.edpAndPowderCount)) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Top Senders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-orange-400" />
            <span>{t.sectionSenderDepts}</span>
          </h3>

          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {Object.keys(metrics.senderMap).length > 0 ? (
              Object.entries(metrics.senderMap).map(([dept, qty]) => (
                <div key={dept} className="flex items-center justify-between text-xs bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-300 font-medium truncate">{dept}</span>
                  <span className="text-amber-400 font-bold font-mono shrink-0">
                    {qty} {t.pieceUnit}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-500 block py-4 text-center">
                ไม่มีข้อมูลในช่วงเวลานี้
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Top Handover Targets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Package className="w-4 h-4 text-purple-400" />
            <span>{t.sectionTargetDepts}</span>
          </h3>

          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {Object.keys(metrics.targetMap).length > 0 ? (
              Object.entries(metrics.targetMap).map(([dept, qty]) => (
                <div key={dept} className="flex items-center justify-between text-xs bg-purple-950/20 p-2 rounded-xl border border-purple-900/40">
                  <span className="text-purple-200 font-medium truncate">{dept}</span>
                  <span className="text-emerald-400 font-bold font-mono shrink-0">
                    {qty} {t.pieceUnit}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-500 block py-4 text-center">
                ยังไม่มีการส่งมอบออกในช่วงนี้
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Movement Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-3 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-base">
              {t.dailyMovementTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              แสดงความเคลื่อนไหวทั้งหมด {movementLogs.length} รายการ
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="ค้นหารหัสงาน, รุ่น, ตู้, แฮงค์เกอร์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-3 py-2.5">{t.colTracking}</th>
                <th className="px-3 py-2.5">{t.colModel}</th>
                <th className="px-3 py-2.5">{t.colBox} / Qty</th>
                <th className="px-3 py-2.5">{t.colHanger}</th>
                <th className="px-3 py-2.5">{t.colProcess}</th>
                <th className="px-3 py-2.5">{t.colTime}</th>
                <th className="px-3 py-2.5">{t.colDuration}</th>
                <th className="px-3 py-2.5">ปลายทาง/ผู้รับ</th>
                <th className="px-3 py-2.5">{t.colStatus}</th>
                <th className="px-3 py-2.5 text-right">ดู</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {movementLogs.map((job) => {
                let durationMinutes = '-';
                if (job.coating_started_at && job.coating_finished_at) {
                  const diff = new Date(job.coating_finished_at).getTime() - new Date(job.coating_started_at).getTime();
                  durationMinutes = formatMinutes(Math.round(diff / 60000));
                }

                return (
                  <tr key={job.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-3 py-2.5 font-mono text-amber-400 font-bold">
                      {job.tracking_code}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="font-bold text-white font-mono">{job.model_part_no}</div>
                      <div className="text-[11px] text-orange-300">{job.part_name}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="font-mono text-white font-bold">{job.container_no}</div>
                      <div className="text-emerald-400 font-semibold">{job.quantity} {t.pieceUnit}</div>
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold text-amber-300">
                      {job.hanger_no ? `🪝 #${job.hanger_no}` : '-'}
                    </td>
                    <td className="px-3 py-2.5">
                      {job.coating_type === 'EDP_ONLY' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                          EDP ONLY
                        </span>
                      ) : job.coating_type === 'EDP_AND_POWDER' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                          EDP + POWDER
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-[11px] font-mono">
                      {job.coating_started_at ? (
                        <div>
                          <span>
                            {new Date(job.coating_started_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {job.coating_finished_at && (
                            <span>
                              {' -> '}
                              {new Date(job.coating_finished_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold text-emerald-300">
                      {durationMinutes}
                    </td>
                    <td className="px-3 py-2.5 text-[11px]">
                      {job.status === 'DISPATCHED_TO_PACKING' ? (
                        <div>
                          <div className="text-purple-300 font-medium">{job.target_department || 'Packing'}</div>
                          <div className="text-slate-400 text-[10px]">{job.packing_receiver_name || '-'}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        job.status === 'DISPATCHED_TO_PACKING'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : job.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : job.status === 'IN_PROGRESS'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectJob(job)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="ดูรายละเอียดฉบับเต็ม"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
