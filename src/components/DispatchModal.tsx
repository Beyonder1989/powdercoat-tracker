import React, { useState, useMemo } from 'react';
import { X, PackageCheck, User, CheckCircle2, ChevronDown, Building2 } from 'lucide-react';
import { PowderCoatJob } from '../types';
import { DEPARTMENTS } from '../data/masterData';
import { PACKING_RECEIVERS, getEmployeesByDepartment } from '../data/employeeData';
import { useLanguage } from '../context/LanguageContext';

interface DispatchModalProps {
  job: PowderCoatJob;
  onClose: () => void;
  onConfirmDispatch: (jobId: string, packingReceiverName: string, notes?: string) => Promise<void>;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  job,
  onClose,
  onConfirmDispatch,
}) => {
  const { lang, t } = useLanguage();
  const [targetDept, setTargetDept] = useState<string>('Packing (PK)');
  
  // Dynamic employees for the target department
  const departmentEmployees = useMemo(() => {
    const list = getEmployeesByDepartment(targetDept);
    return list.length > 0 ? list : PACKING_RECEIVERS;
  }, [targetDept]);

  const [receiverName, setReceiverName] = useState<string>(
    PACKING_RECEIVERS[0]?.displayName || ''
  );
  const [isCustomReceiver, setIsCustomReceiver] = useState<boolean>(false);
  const [customReceiverName, setCustomReceiverName] = useState<string>('');
  
  const [dispatchNotes, setDispatchNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTargetDeptChange = (newDept: string) => {
    setTargetDept(newDept);
    const emps = getEmployeesByDepartment(newDept);
    if (emps.length > 0) {
      setReceiverName(emps[0].displayName);
      setIsCustomReceiver(false);
    } else {
      setReceiverName('');
      setIsCustomReceiver(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveReceiver = (isCustomReceiver ? customReceiverName : receiverName).trim();
    if (!effectiveReceiver) {
      setError(lang === 'my' ? 'ကျေးဇူးပြု၍ လက်ခံသူ အမည် ရွေးပါ' : 'กรุณาเลือกหรือระบุชื่อเจ้าหน้าที่ผู้รับงาน');
      return;
    }

    try {
      setIsSubmitting(true);
      const noteWithDept = dispatchNotes.trim() 
        ? `[${targetDept}] ${dispatchNotes.trim()}` 
        : `[${targetDept}]`;
      await onConfirmDispatch(job.id, effectiveReceiver, noteWithDept);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error dispatching job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PackageCheck className="w-5 h-5" />
            <h3 className="text-lg font-bold">{t.dispatchTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-purple-200 hover:text-white hover:bg-black/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Job summary pill */}
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Tracking Code:</span>
              <span className="font-mono text-orange-400 font-semibold">{job.tracking_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Model / Part:</span>
              <span className="text-white font-medium">
                {job.model_part_no} ({job.part_name})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{t.boxLabel} / {t.qtyLabel}:</span>
              <span className="text-white">
                {job.container_no} / <strong className="text-emerald-400">{job.quantity} {t.pieceUnit}</strong>
              </span>
            </div>
          </div>

          {/* แผนกปลายทางที่รับงานออก */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              {t.dispatchTargetDept}
            </label>
            <div className="relative">
              <select
                value={targetDept}
                onChange={(e) => handleTargetDeptChange(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-800 text-white">
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* ชื่อผู้รับงาน (ดึงตามแผนกปลายทางที่เลือก) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              {t.dispatchReceiverStaff} ({targetDept})
            </label>
            <div className="relative">
              <select
                value={isCustomReceiver ? '__custom__' : receiverName}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomReceiver(true);
                  } else {
                    setIsCustomReceiver(false);
                    setReceiverName(e.target.value);
                  }
                }}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                {departmentEmployees.length > 0 ? (
                  departmentEmployees.map((emp) => (
                    <option key={emp.empId || emp.name} value={emp.displayName} className="bg-slate-800 text-white">
                      {emp.displayName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled className="bg-slate-800 text-slate-500">
                    -- ไม่มีรายชื่อในระบบ --
                  </option>
                )}
                <option value="__custom__" className="bg-slate-800 text-amber-300 font-semibold">
                  + ระบุชื่อเอง (ไม่อยู่ในรายชื่อ)
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {isCustomReceiver && (
              <div className="relative mt-2">
                <input
                  type="text"
                  required
                  placeholder="พิมพ์ชื่อและรหัสพนักงาน..."
                  value={customReceiverName}
                  onChange={(e) => setCustomReceiverName(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              {t.dispatchNotes}
            </label>
            <textarea
              rows={2}
              placeholder="เช่น บรรจุกล่อง A, ติดสติ๊กเกอร์เรียบร้อย"
              value={dispatchNotes}
              onChange={(e) => setDispatchNotes(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.dispatchConfirmBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
