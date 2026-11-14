import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ReceiveJobForm } from './components/ReceiveJobForm';
import { JobTracker } from './components/JobTracker';
import { JobDetailModal } from './components/JobDetailModal';
import { DispatchModal } from './components/DispatchModal';
import { PinModal } from './components/PinModal';
import { StartCoatingModal } from './components/StartCoatingModal';
import { fetchJobs, updateJobStatus, updateJobPriority, deleteJob, saveLocalJobs } from './lib/supabase';
import { PowderCoatJob, JobStatus, JobPriority, CoatingType } from './types';
import { useLanguage } from './context/LanguageContext';
import { useRole } from './context/RoleContext';
import { Lock } from 'lucide-react';

// Sample mock data for first-time preview if completely empty
const INITIAL_DEMO_JOBS: PowderCoatJob[] = [
  {
    id: 'demo_1',
    tracking_code: 'PC-261113-1001',
    sender_department: 'Laser(LS)',
    model_part_no: 'HA410-L322',
    part_name: 'กันชนหน้า',
    sender_name: 'สมเกียรติ',
    container_no: 'BOX-A12',
    quantity: 2,
    delivery_slip_image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    part_image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    status: 'RECEIVED',
    received_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    receiver_name: 'ช่างพ่นสี 01',
    notes: 'รอเตรียมผิว ชิ้นงานสีดำด้าน',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'demo_2',
    tracking_code: 'PC-261113-1002',
    sender_department: 'Welding (WD)',
    model_part_no: 'AM101-V1-D12',
    part_name: 'ขาตั้ง',
    sender_name: 'วิชัย',
    container_no: 'T-05',
    quantity: 4,
    delivery_slip_image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    part_image_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    status: 'IN_PROGRESS',
    hanger_no: 'H-03',
    coating_type: 'EDP_AND_POWDER',
    received_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    coating_started_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    receiver_name: 'ช่างพ่นสี 02',
    notes: 'กำลังเข้าตู้อบความร้อน',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'demo_3',
    tracking_code: 'PC-261113-1003',
    sender_department: 'Bending (BD)',
    model_part_no: 'HA411-BC22',
    part_name: 'กันชนท้าย',
    sender_name: 'ประเสริฐ',
    container_no: 'LOT-99',
    quantity: 1,
    delivery_slip_image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    part_image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    status: 'COMPLETED',
    hanger_no: 'HG-12',
    coating_type: 'EDP_ONLY',
    received_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    coating_started_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    coating_finished_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    receiver_name: 'ช่างพ่นสี 01',
    notes: 'พ่นเสร็จแล้ว รอแพ็คกิ้งมารับ',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

export function App() {
  const { lang, t } = useLanguage();
  const { isOperator, openPinModal } = useRole();
  const [activeTab, setActiveTab] = useState<'receive' | 'tracker' | 'packing'>('tracker');
  const [jobs, setJobs] = useState<PowderCoatJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<PowderCoatJob | null>(null);
  const [dispatchingJob, setDispatchingJob] = useState<PowderCoatJob | null>(null);
  const [startCoatingJob, setStartCoatingJob] = useState<PowderCoatJob | null>(null);

  // Load jobs on start
  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchJobs();
      if (data.length === 0) {
        saveLocalJobs(INITIAL_DEMO_JOBS);
        setJobs(INITIAL_DEMO_JOBS);
      } else {
        setJobs(data);
      }
    } catch (e) {
      console.error('Error loading jobs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Counts for navbar badges
  const counts = useMemo(() => {
    return {
      RECEIVED: jobs.filter((j) => j.status === 'RECEIVED').length,
      IN_PROGRESS: jobs.filter((j) => j.status === 'IN_PROGRESS').length,
      COMPLETED: jobs.filter((j) => j.status === 'COMPLETED').length,
      DISPATCHED_TO_PACKING: jobs.filter((j) => j.status === 'DISPATCHED_TO_PACKING').length,
    };
  }, [jobs]);

  // Handle status update
  const handleUpdateStatus = async (
    jobId: string,
    newStatus: JobStatus,
    extraData?: Partial<PowderCoatJob>
  ) => {
    try {
      const updated = await updateJobStatus(jobId, newStatus, extraData);
      if (updated) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
        if (selectedJob && selectedJob.id === jobId) {
          setSelectedJob(updated);
        }
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  // Handle start coating confirmation (Hanger No. & Coating Process)
  const handleConfirmStartCoating = async (
    jobId: string,
    hangerNo: string,
    coatingType: CoatingType
  ) => {
    await handleUpdateStatus(jobId, 'IN_PROGRESS', {
      hanger_no: hangerNo,
      coating_type: coatingType,
    });
  };

  // Handle dispatch confirmation to Packing
  const handleConfirmDispatch = async (jobId: string, packingReceiverName: string, notes?: string) => {
    const updated = await updateJobStatus(jobId, 'DISPATCHED_TO_PACKING', {
      packing_receiver_name: packingReceiverName,
      notes: notes ? `${notes} (ส่งมอบให้แผนกแพ็คกิ้งเรียบร้อย)` : undefined,
    });

    if (updated) {
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(updated);
      }
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId: string) => {
    await deleteJob(jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    if (selectedJob?.id === jobId) {
      setSelectedJob(null);
    }
  };

  // Handle priority update (Supervisor 1-click toggle)
  const handleUpdatePriority = async (jobId: string, priority: JobPriority) => {
    try {
      await updateJobPriority(jobId, priority);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, priority } : j))
      );
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob((prev) => (prev ? { ...prev, priority } : null));
      }
    } catch (e) {
      console.error('Failed to update priority', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden max-w-full w-full">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab 1: ฟอร์มรับเข้างานใหม่ */}
        {activeTab === 'receive' && (
          isOperator ? (
            <ReceiveJobForm
              onSuccess={(newJob) => {
                setJobs((prev) => [newJob, ...prev]);
                setActiveTab('tracker');
              }}
              onCancel={() => setActiveTab('tracker')}
            />
          ) : (
            <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-400 mx-auto flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'my' ? 'ဆေးမှုတ်ဌာန ဝန်ထမ်းများအတွက်သာ' : 'เฉพาะเจ้าหน้าที่แผนกพ่นสี'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'my' 
                  ? 'အလုပ်အသစ်လက်ခံရန် ဆေးမှုတ်ဌာန PIN နံပါတ် ရိုက်ထည့်ပါ' 
                  : 'กรุณาใส่รหัส PIN แผนกพ่นสีเพื่อเปิดฟอร์มรับเข้างาน'}
              </p>
              <button
                onClick={() => openPinModal(() => setActiveTab('receive'))}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition-all"
              >
                🔑 {t.btnUnlock}
              </button>
            </div>
          )
        )}

        {/* Tab 2: รายการงาน & ติดตามสถานะ */}
        {activeTab === 'tracker' && (
          <JobTracker
            jobs={jobs}
            isLoading={isLoading}
            onRefresh={loadJobs}
            onSelectJob={setSelectedJob}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePriority={handleUpdatePriority}
            onOpenDispatch={setDispatchingJob}
            onOpenStartCoating={setStartCoatingJob}
            onDeleteJob={handleDeleteJob}
            initialFilter="ALL"
          />
        )}

        {/* Tab 3: แดชบอร์ดส่งมอบแผนกแพ็คกิ้ง */}
        {activeTab === 'packing' && (
          <div className="space-y-6">
            <div className="bg-purple-950/40 border border-purple-800/80 rounded-2xl p-5 text-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'my' ? 'ထုပ်ပိုးဌာနသို့ လွှဲပြောင်းပေးအပ်ခြင်း လုပ်ငန်းစဉ်' : 'กระบวนการส่งต่องานให้แผนกแพ็คกิ้ง'}
                </h3>
                <p className="text-xs text-purple-300 mt-0.5">
                  {lang === 'my'
                    ? 'ဆေးမှုတ်ပြီးစီးသော ပစ္စည်းများနှင့် ထုပ်ပိုးဌာနသို့ ပို့ဆောင်ပြီးသော အလုပ်များ'
                    : 'แสดงรายการชิ้นงานที่พ่นสีเสร็จสมบูรณ์แล้ว และชิ้นงานที่ส่งมอบให้แพ็คกิ้งเรียบร้อย'}
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-900 border border-purple-700 text-purple-200">
                {lang === 'my' ? 'လွှဲပြောင်းရန်စောင့်ဆိုင်း:' : 'รอส่งมอบ:'} {counts.COMPLETED} {t.pieceUnit}
              </span>
            </div>

            <JobTracker
              jobs={jobs.filter(
                (j) => j.status === 'COMPLETED' || j.status === 'DISPATCHED_TO_PACKING'
              )}
              isLoading={isLoading}
              onRefresh={loadJobs}
              onSelectJob={setSelectedJob}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
              onOpenDispatch={setDispatchingJob}
              onOpenStartCoating={setStartCoatingJob}
              onDeleteJob={handleDeleteJob}
              initialFilter="ALL"
            />
          </div>
        )}
      </main>

      {/* Modal: Job Detail & Evidence Photo Zoom */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePriority={handleUpdatePriority}
          onOpenDispatch={(job) => {
            setSelectedJob(null);
            setDispatchingJob(job);
          }}
          onOpenStartCoating={(job) => {
            setSelectedJob(null);
            setStartCoatingJob(job);
          }}
        />
      )}

      {/* Modal: Start Coating (Hanger No. & Coating Process) */}
      {startCoatingJob && (
        <StartCoatingModal
          job={startCoatingJob}
          isOpen={Boolean(startCoatingJob)}
          onClose={() => setStartCoatingJob(null)}
          onConfirm={handleConfirmStartCoating}
        />
      )}

      {/* Modal: Handover to Packing */}
      {dispatchingJob && (
        <DispatchModal
          job={dispatchingJob}
          onClose={() => setDispatchingJob(null)}
          onConfirmDispatch={handleConfirmDispatch}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        {lang === 'my'
          ? 'Powder Coat Tracker • HAMER 4X4 ဘမ်ဘာ ဆေးမှုတ်စနစ်'
          : 'ระบบรับเข้าและติดตามชิ้นงานพ่นสี (Powder Coat Tracker) • HAMER 4X4'}
      </footer>

      {/* Security PIN Keypad Modal */}
      <PinModal />
    </div>
  );
}
export default App;
