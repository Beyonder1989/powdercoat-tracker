import React, { useState } from 'react';
import { X, PackageCheck, User, Calendar, CheckCircle2 } from 'lucide-react';
import { PowderCoatJob } from '../types';

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
  const [receiverName, setReceiverName] = useState<string>('');
  const [dispatchNotes, setDispatchNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverName.trim()) {
      setError('กรุณาระบุชื่อเจ้าหน้าที่แผนกแพ็คกิ้งผู้รับงาน');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmDispatch(job.id, receiverName.trim(), dispatchNotes.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการส่งมอบงาน');
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
            <h3 className="text-lg font-bold">ส่งมอบงานต่อให้แผนกแพ็คกิ้ง</h3>
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
              <span className="text-slate-400">รหัสงาน:</span>
              <span className="font-mono text-orange-400 font-semibold">{job.tracking_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Model / Part:</span>
              <span className="text-white font-medium">
                {job.model_part_no} ({job.part_name})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ตู้สินค้า / จำนวน:</span>
              <span className="text-white">
                {job.container_no} / <strong className="text-emerald-400">{job.quantity} ชิ้น</strong>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              ชื่อผู้รับงาน (แผนกแพ็คกิ้ง Packing) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="ระบุชื่อเจ้าหน้าที่แพ็คกิ้ง..."
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              หมายเหตุการส่งมอบ (ถ้ามี)
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
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>กำลังบันทึก...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ยืนยันการส่งมอบ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
