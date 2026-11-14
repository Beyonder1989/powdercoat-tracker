import React, { useState, useMemo, useRef } from 'react';
import { X, PackageCheck, User, CheckCircle2, ChevronDown, Building2, Camera, Upload, AlertCircle } from 'lucide-react';
import { PowderCoatJob } from '../types';
import { DEPARTMENTS } from '../data/masterData';
import { PACKING_RECEIVERS, getEmployeesByDepartment } from '../data/employeeData';
import { uploadEvidenceImage } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

export interface DispatchData {
  targetDepartment: string;
  receiverName: string;
  notes?: string;
  dispatchSlipImageUrl?: string;
  dispatchPartImageUrl?: string;
}

interface DispatchModalProps {
  job: PowderCoatJob;
  onClose: () => void;
  onConfirmDispatch: (jobId: string, dispatchData: DispatchData) => Promise<void>;
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

  // Dispatch Photos (ใบส่งมอบงานออก & ชิ้นงานตอนส่งมอบ)
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [partFile, setPartFile] = useState<File | null>(null);
  const [partPreview, setPartPreview] = useState<string | null>(null);

  const slipInputRef = useRef<HTMLInputElement>(null);
  const partInputRef = useRef<HTMLInputElement>(null);

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

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      setSlipPreview(URL.createObjectURL(file));
      if (error) setError(null);
    }
  };

  const handlePartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPartFile(file);
      setPartPreview(URL.createObjectURL(file));
      if (error) setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveReceiver = (isCustomReceiver ? customReceiverName : receiverName).trim();
    if (!effectiveReceiver) {
      setError(lang === 'my' ? 'ကျေးဇူးပြု၍ လက်ခံသူ အမည် ရွေးပါ' : 'กรุณาเลือกหรือระบุชื่อเจ้าหน้าที่ผู้รับงาน');
      return;
    }

    // Require both dispatch evidence photos
    if (!slipFile || !partFile) {
      setError(t.dispatchPhotosRequiredAlert);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Upload dispatch photos
      const [slipUrl, partUrl] = await Promise.all([
        uploadEvidenceImage(slipFile, 'slips'),
        uploadEvidenceImage(partFile, 'parts'),
      ]);

      const noteWithDept = dispatchNotes.trim() 
        ? `[${targetDept}] ${dispatchNotes.trim()}` 
        : `[${targetDept}]`;

      await onConfirmDispatch(job.id, {
        targetDepartment: targetDept,
        receiverName: effectiveReceiver,
        notes: noteWithDept,
        dispatchSlipImageUrl: slipUrl,
        dispatchPartImageUrl: partUrl,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Error dispatching job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 bg-white/10 rounded-xl">
              <PackageCheck className="w-5 h-5 text-purple-200" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold">{t.dispatchTitle}</h3>
              <p className="text-xs text-purple-200/80">{t.dispatchSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Job summary pill */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-mono text-[11px]">{job.tracking_code}</span>
              {job.hanger_no && (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/30">
                  🪝 #{job.hanger_no}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Model / Part:</span>
              <span className="text-white font-bold font-mono">
                {job.model_part_no} ({job.part_name})
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800">
              <span className="text-amber-400 font-bold">{t.boxNotice}: {job.container_no}</span>
              <span className="text-emerald-400 font-extrabold text-sm">{job.quantity} {t.pieceUnit}</span>
            </div>
          </div>

          {/* แผนกปลายทางที่รับงานออก */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>{t.dispatchTargetDept}</span>
            </label>
            <div className="relative">
              <select
                value={targetDept}
                onChange={(e) => handleTargetDeptChange(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-800 text-white">
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* ชื่อผู้รับงาน (ดึงตามแผนกปลายทางที่เลือก) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-purple-400" />
              <span>{t.dispatchReceiverStaff} ({targetDept})</span>
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
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {isCustomReceiver && (
              <div className="relative mt-2">
                <input
                  type="text"
                  required
                  placeholder="พิมพ์ชื่อและรหัสพนักงานผู้รับงาน..."
                  value={customReceiverName}
                  onChange={(e) => setCustomReceiverName(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            )}
          </div>

          {/* 📸 หลักฐานรูปถ่ายตอนส่งมอบงาน (ใบส่งมอบงานออก + รูปชิ้นงานส่งออก) */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <span className="block text-xs font-bold uppercase tracking-wider text-purple-300">
              📸 ภาพหลักฐานส่งมอบงาน (Dispatch Evidence Photos)
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Photo 1: ใบส่งมอบงานขาออก */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-300 font-medium block truncate">
                  {t.dispatchSlipPhoto}
                </span>
                <input
                  type="file"
                  ref={slipInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleSlipChange}
                  className="hidden"
                />
                <div
                  onClick={() => slipInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl h-28 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all relative overflow-hidden ${
                    slipPreview
                      ? 'border-purple-500 bg-purple-950/20'
                      : 'border-slate-700 hover:border-purple-500 bg-slate-800/40'
                  }`}
                >
                  {slipPreview ? (
                    <>
                      <img src={slipPreview} alt="Slip" className="w-full h-full object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        {t.photoChange}
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-purple-400 mb-1" />
                      <span className="text-[10px] text-slate-400 leading-tight">ถ่ายใบส่งออก</span>
                    </>
                  )}
                </div>
              </div>

              {/* Photo 2: ตัวชิ้นงานตอนส่งมอบ */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-300 font-medium block truncate">
                  {t.dispatchPartPhoto}
                </span>
                <input
                  type="file"
                  ref={partInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handlePartChange}
                  className="hidden"
                />
                <div
                  onClick={() => partInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl h-28 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all relative overflow-hidden ${
                    partPreview
                      ? 'border-purple-500 bg-purple-950/20'
                      : 'border-slate-700 hover:border-purple-500 bg-slate-800/40'
                  }`}
                >
                  {partPreview ? (
                    <>
                      <img src={partPreview} alt="Part" className="w-full h-full object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        {t.photoChange}
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-purple-400 mb-1" />
                      <span className="text-[10px] text-slate-400 leading-tight">ถ่ายชิ้นงานส่งออก</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* หมายเหตุ */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t.dispatchNotes}
            </label>
            <textarea
              rows={2}
              placeholder="เช่น ส่งต่อให้แผนกประกอบ, บรรจุกล่อง A พร้อมส่งต่อ"
              value={dispatchNotes}
              onChange={(e) => setDispatchNotes(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>กำลังอัปโหลดรูปภาพ...</span>
                </span>
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
