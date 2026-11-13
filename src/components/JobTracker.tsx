import React, { useState, useMemo } from 'react';
import { Search, Eye, ArrowRight, CheckCircle2, Clock, RefreshCw, LayoutGrid, Table as TableIcon, Trash2, Package, Flame, Zap, ShieldAlert } from 'lucide-react';
import { PowderCoatJob, JobStatus, JobPriority } from '../types';

interface JobTrackerProps {
  jobs: PowderCoatJob[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectJob: (job: PowderCoatJob) => void;
  onUpdateStatus: (jobId: string, status: JobStatus) => void;
  onUpdatePriority?: (jobId: string, priority: JobPriority) => void;
  onOpenDispatch: (job: PowderCoatJob) => void;
  onDeleteJob: (jobId: string) => void;
  initialFilter?: JobStatus | 'ALL' | 'URGENT_ONLY';
}

export const JobTracker: React.FC<JobTrackerProps> = ({
  jobs,
  isLoading,
  onRefresh,
  onSelectJob,
  onUpdateStatus,
  onUpdatePriority,
  onOpenDispatch,
  onDeleteJob,
  initialFilter = 'ALL',
}) => {
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'ALL' | 'URGENT_ONLY'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter & sort jobs (งานด่วนที่สุด URGENT จะลอยขึ้นบนสุดเสมอ!)
  const filteredJobs = useMemo(() => {
    const list = jobs.filter((job) => {
      // Urgent only filter
      if (statusFilter === 'URGENT_ONLY') {
        if (job.priority !== 'URGENT' && job.priority !== 'HIGH') return false;
      } else if (statusFilter !== 'ALL' && job.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTracking = job.tracking_code?.toLowerCase().includes(q);
        const matchModel = job.model_part_no?.toLowerCase().includes(q);
        const matchPart = job.part_name?.toLowerCase().includes(q);
        const matchContainer = job.container_no?.toLowerCase().includes(q);
        const matchSender = job.sender_name?.toLowerCase().includes(q);
        const matchDept = job.sender_department?.toLowerCase().includes(q);

        return matchTracking || matchModel || matchPart || matchContainer || matchSender || matchDept;
      }

      return true;
    });

    // เรียงลำดับ: URGENT (3) -> HIGH (2) -> NORMAL (1) -> ตามเวลารับเข้าล่าสุด
    return list.sort((a, b) => {
      const getPriorityScore = (p?: JobPriority) => {
        if (p === 'URGENT') return 3;
        if (p === 'HIGH') return 2;
        return 1;
      };

      const scoreDiff = getPriorityScore(b.priority) - getPriorityScore(a.priority);
      if (scoreDiff !== 0) return scoreDiff;

      return new Date(b.created_at || b.received_at).getTime() - new Date(a.created_at || a.received_at).getTime();
    });
  }, [jobs, statusFilter, searchQuery]);

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'RECEIVED':
        return {
          label: 'รอพ่นสี',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          dot: 'bg-blue-400',
        };
      case 'IN_PROGRESS':
        return {
          label: 'กำลังพ่นสี',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'COMPLETED':
        return {
          label: 'พ่นสีเสร็จสมบูรณ์',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'DISPATCHED_TO_PACKING':
        return {
          label: 'ส่งแพ็คกิ้งแล้ว',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          dot: 'bg-purple-400',
        };
    }
  };

  const getPriorityInfo = (p?: JobPriority) => {
    switch (p) {
      case 'URGENT':
        return {
          isUrgent: true,
          labelTh: 'ด่วนที่สุด!',
          labelMy: 'အရေးပေါ်',
          badgeClass: 'bg-rose-950 text-rose-200 border-rose-500 animate-pulse',
          cardClass: 'border-rose-500/90 shadow-2xl shadow-rose-950/60 ring-2 ring-rose-500/50',
          banner: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700',
        };
      case 'HIGH':
        return {
          isHigh: true,
          labelTh: 'งานด่วน',
          labelMy: 'အရေးကြီး',
          badgeClass: 'bg-amber-950 text-amber-200 border-amber-500/90',
          cardClass: 'border-amber-500/70 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/30',
          banner: 'bg-gradient-to-r from-amber-600 to-orange-600',
        };
      default:
        return {
          labelTh: 'ปกติ',
          labelMy: 'ပုံမှန်',
          badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
          cardClass: 'border-slate-800 hover:border-slate-700',
          banner: null,
        };
    }
  };

  const urgentCount = jobs.filter((j) => j.priority === 'URGENT' || j.priority === 'HIGH').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Control & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ค้นหา: ตู้สินค้า, Model, Part, ชื่อผู้ส่ง, แผนก, รหัสงาน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 justify-between sm:justify-end">
            {/* View Mode Toggle */}
            <div className="bg-slate-800 rounded-xl p-1 border border-slate-700/80 flex items-center">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'cards' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="มุมมองการ์ด (Cards)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="มุมมองตาราง (Table)"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">รีเฟรช</span>
            </button>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {/* ปุ่มงานด่วนพิเศษ */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'URGENT_ONLY' ? 'ALL' : 'URGENT_ONLY')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              statusFilter === 'URGENT_ONLY'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-2 ring-rose-400'
                : 'bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800/80'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>🔥 เฉพาะงานด่วน • အရေးပေါ် ({urgentCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            ทั้งหมด ({jobs.length})
          </button>
          <button
            onClick={() => setStatusFilter('RECEIVED')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              statusFilter === 'RECEIVED'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-slate-800/80 text-blue-400 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>รอพ่นสี ({jobs.filter((j) => j.status === 'RECEIVED').length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('IN_PROGRESS')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              statusFilter === 'IN_PROGRESS'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                : 'bg-slate-800/80 text-amber-400 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>กำลังพ่นสี ({jobs.filter((j) => j.status === 'IN_PROGRESS').length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              statusFilter === 'COMPLETED'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-slate-800/80 text-emerald-400 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>พ่นสีเสร็จแล้ว ({jobs.filter((j) => j.status === 'COMPLETED').length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('DISPATCHED_TO_PACKING')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              statusFilter === 'DISPATCHED_TO_PACKING'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-slate-800/80 text-purple-400 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>ส่งแพ็คกิ้งแล้ว ({jobs.filter((j) => j.status === 'DISPATCHED_TO_PACKING').length})</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {filteredJobs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-300">ไม่พบรายการงาน</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery ? 'ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองสถานะอื่น' : 'ยังไม่มีงานรับเข้าในระบบ กดปุ่ม "รับเข้างานใหม่" เพื่อเริ่มต้น'}
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => {
            const statusInfo = getStatusBadge(job.status);
            const priorityInfo = getPriorityInfo(job.priority);

            return (
              <div
                key={job.id}
                className={`bg-slate-900 border rounded-2xl transition-all flex flex-col justify-between overflow-hidden group ${priorityInfo.cardClass}`}
              >
                {/* 🔴 แถบสีด้านบนสำหรับงานด่วน/ด่วนที่สุด พร้อมภาษาพม่าสะดุดตา */}
                {priorityInfo.banner && (
                  <div className={`px-4 py-1.5 text-xs font-black flex items-center justify-between tracking-wide shadow-md ${priorityInfo.banner}`}>
                    <div className="flex items-center space-x-1.5">
                      {job.priority === 'URGENT' ? (
                        <Flame className="w-4 h-4 animate-bounce" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      <span>{priorityInfo.labelTh}</span>
                      <span>•</span>
                      <span className="text-sm">{priorityInfo.labelMy}</span>
                    </div>
                    <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded uppercase font-mono font-bold">
                      {job.priority}
                    </span>
                  </div>
                )}

                {/* Card Top */}
                <div className="p-5 space-y-4">
                  {/* Header Row: Tracking + Status + Priority Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md">
                      {job.tracking_code}
                    </span>
                    
                    <div className="flex items-center space-x-1.5">
                      {/* Priority pill */}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${priorityInfo.badgeClass}`}>
                        <span className="mr-1">{priorityInfo.labelTh}</span>
                        <span className="text-[10px] opacity-90">({priorityInfo.labelMy})</span>
                      </span>

                      {/* Status pill */}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo.dot}`}></span>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* 📍 HIGHLIGHTED BOX / CONTAINER NO FOR FACTORY WORKERS (ใหญ่สะดุดตา ช่างพม่าเห็นปุ๊บรู้เลยว่าต้องไปหยิบตู้ไหน) */}
                  <div className={`rounded-xl p-3.5 border-2 flex items-center justify-between transition-colors ${
                    job.priority === 'URGENT' 
                      ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-950/30' 
                      : job.priority === 'HIGH'
                      ? 'bg-amber-950/30 border-amber-500/80'
                      : 'bg-slate-800/90 border-orange-500/40'
                  }`}>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 flex items-center space-x-1">
                        <span>📍 หมายเลขตู้สินค้า (BOX)</span>
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-white tracking-wide font-mono block mt-0.5">
                        {job.container_no}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">จำนวน</span>
                      <span className="text-lg sm:text-xl font-bold text-emerald-400">
                        {job.quantity} ชิ้น
                      </span>
                    </div>
                  </div>

                  {/* Model & Part Title */}
                  <div>
                    <h3 className="text-lg font-bold text-white font-mono group-hover:text-orange-400 transition-colors">
                      {job.model_part_no}
                    </h3>
                    <p className="text-sm font-semibold text-orange-300 mt-0.5">
                      {job.part_name}
                    </p>
                  </div>

                  {/* Metadata Box */}
                  <div className="bg-slate-800/60 rounded-xl p-3 text-xs space-y-2 border border-slate-700/60">
                    <div className="flex justify-between">
                      <span className="text-slate-400">แผนกผู้นำส่ง:</span>
                      <span className="text-slate-200 font-medium">{job.sender_department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ผู้ส่งมอบ:</span>
                      <span className="text-slate-200">{job.sender_name}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-700/60 text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                        <span>เวลารับเข้า:</span>
                      </span>
                      <span className="text-slate-300">
                        {new Date(job.received_at).toLocaleDateString('th-TH', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        {new Date(job.received_at).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Photos Preview Row */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div
                      onClick={() => onSelectJob(job)}
                      className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-slate-700/60 relative cursor-pointer group/img"
                    >
                      <img
                        src={job.delivery_slip_image_url}
                        alt="ใบส่งมอบ"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 px-1.5 py-0.5 text-[10px] text-slate-300 truncate font-medium">
                        ใบส่งมอบงาน
                      </div>
                    </div>
                    <div
                      onClick={() => onSelectJob(job)}
                      className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-slate-700/60 relative cursor-pointer group/img"
                    >
                      <img
                        src={job.part_image_url}
                        alt="ตัวชิ้นงาน"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 px-1.5 py-0.5 text-[10px] text-slate-300 truncate font-medium">
                        ตัวชิ้นงานจริง
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Bottom */}
                <div className="p-4 bg-slate-800/40 border-t border-slate-800/80 space-y-2.5">
                  {/* แถบปรับระดับความด่วน 1-คลิกสำหรับหัวหน้างาน/รองหัวหน้า */}
                  {onUpdatePriority && (
                    <div className="flex items-center justify-between text-xs bg-black/30 p-1.5 rounded-xl border border-slate-700/60">
                      <span className="text-[11px] text-slate-400 font-medium pl-1">
                        ความด่วน (หัวหน้า):
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onUpdatePriority(job.id, 'NORMAL')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            !job.priority || job.priority === 'NORMAL'
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="ปกติ (ပုံမှန်)"
                        >
                          ปกติ
                        </button>
                        <button
                          onClick={() => onUpdatePriority(job.id, 'HIGH')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            job.priority === 'HIGH'
                              ? 'bg-amber-600 text-white'
                              : 'text-slate-400 hover:text-amber-300'
                          }`}
                          title="งานด่วน (အရေးကြီး)"
                        >
                          ⚡ด่วน
                        </button>
                        <button
                          onClick={() => onUpdatePriority(job.id, 'URGENT')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            job.priority === 'URGENT'
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'text-slate-400 hover:text-rose-400'
                          }`}
                          title="ด่วนที่สุด (အရေးပေါ်)"
                        >
                          🔥ด่วนมาก!
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Main Action buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectJob(job)}
                      className="p-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs transition-colors flex items-center space-x-1"
                      title="ดูหลักฐานและข้อมูลทั้งหมด"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">ดูรายละเอียด</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      {job.status === 'RECEIVED' && (
                        <button
                          onClick={() => onUpdateStatus(job.id, 'IN_PROGRESS')}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition-colors"
                        >
                          เริ่มพ่นสี
                        </button>
                      )}

                      {job.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => onUpdateStatus(job.id, 'COMPLETED')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>พ่นเสร็จ</span>
                        </button>
                      )}

                      {job.status === 'COMPLETED' && (
                        <button
                          onClick={() => onOpenDispatch(job)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition-colors flex items-center space-x-1"
                        >
                          <span>ส่งแพ็คกิ้ง</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {job.status === 'DISPATCHED_TO_PACKING' && (
                        <span className="text-[11px] text-purple-300 font-medium px-2 py-1 bg-purple-950/60 rounded-lg border border-purple-800">
                          ถึงแพ็คกิ้งแล้ว
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบรายการงาน ${job.tracking_code} ใช่หรือไม่?`)) {
                            onDeleteJob(job.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-800/80 border-b border-slate-700/80 text-slate-300 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3.5">ความเร่งด่วน</th>
                  <th className="px-4 py-3.5">รหัสงาน / เวลารับ</th>
                  <th className="px-4 py-3.5">ตู้สินค้า / จำนวน</th>
                  <th className="px-4 py-3.5">Model / Part</th>
                  <th className="px-4 py-3.5">แผนก / ผู้ส่ง</th>
                  <th className="px-4 py-3.5">รูปหลักฐาน</th>
                  <th className="px-4 py-3.5">สถานะ</th>
                  <th className="px-4 py-3.5 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredJobs.map((job) => {
                  const statusInfo = getStatusBadge(job.status);
                  const priorityInfo = getPriorityInfo(job.priority);
                  return (
                    <tr key={job.id} className={`hover:bg-slate-800/40 transition-colors ${job.priority === 'URGENT' ? 'bg-rose-950/20' : ''}`}>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${priorityInfo.badgeClass}`}>
                          {priorityInfo.labelTh} ({priorityInfo.labelMy})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-orange-400">
                          {job.tracking_code}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(job.received_at).toLocaleDateString('th-TH')}{' '}
                          {new Date(job.received_at).toLocaleTimeString('th-TH', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-base text-white">{job.container_no}</div>
                        <div className="text-emerald-400 text-xs font-semibold">
                          {job.quantity} ชิ้น
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white font-mono">{job.model_part_no}</div>
                        <div className="text-orange-300 text-xs">{job.part_name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-200">{job.sender_department}</div>
                        <div className="text-slate-400 text-xs">{job.sender_name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1.5">
                          <img
                            onClick={() => onSelectJob(job)}
                            src={job.delivery_slip_image_url}
                            alt="Slip"
                            className="w-8 h-8 rounded object-cover cursor-pointer hover:opacity-80 border border-slate-700"
                            title="คลิกดูใบส่งมอบ"
                          />
                          <img
                            onClick={() => onSelectJob(job)}
                            src={job.part_image_url}
                            alt="Part"
                            className="w-8 h-8 rounded object-cover cursor-pointer hover:opacity-80 border border-slate-700"
                            title="คลิกดูตัวชิ้นงาน"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusInfo.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${statusInfo.dot}`}></span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onSelectJob(job)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {job.status === 'RECEIVED' && (
                            <button
                              onClick={() => onUpdateStatus(job.id, 'IN_PROGRESS')}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                            >
                              เริ่มพ่น
                            </button>
                          )}
                          {job.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => onUpdateStatus(job.id, 'COMPLETED')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                            >
                              เสร็จ
                            </button>
                          )}
                          {job.status === 'COMPLETED' && (
                            <button
                              onClick={() => onOpenDispatch(job)}
                              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                            >
                              ส่งแพ็คกิ้ง
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`ต้องการลบงาน ${job.tracking_code}?`)) {
                                onDeleteJob(job.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                            title="ลบ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
