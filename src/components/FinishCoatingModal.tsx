import React, { useState } from 'react';
import { X, CheckCircle2, PackageCheck, Clock } from 'lucide-react';
import { PowderCoatJob } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getPartTypeLabel } from '../data/masterData';

interface FinishCoatingModalProps {
  job: PowderCoatJob;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (jobId: string, unloadQty: number) => void;
}

export const FinishCoatingModal: React.FC<FinishCoatingModalProps> = ({
  job,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { lang, t } = useLanguage();
  const [unloadQty, setUnloadQty] = useState<number>(job.quantity || 1);

  if (!isOpen) return null;

  const remainingOnLine = Math.max(0, (job.quantity || 1) - unloadQty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeQty = Math.max(1, Math.min(unloadQty, job.quantity || 1));
    onConfirm(job.id, safeQty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/30 via-slate-800 to-slate-800 px-5 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <PackageCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base">
                {lang === 'my' ? 'ဆေးမှုတ်ပြီး ပစ္စည်းဖြုတ်မည်' : 'ยืนยันปลดชิ้นงานลง (พ่นสีเสร็จแล้ว)'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'my'
                  ? 'လိုင်းပေါ်မှ ဖြုတ်ပြီးသော အရေအတွက်ကို ရွေးချယ်ပါ'
                  : 'ระบุจำนวนที่ปลดลงแล้ว (ส่วนที่ยังไม่ปลดจะคงสถานะอยู่บนไลน์)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Job Summary */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  {t.boxNotice}: <span className="font-mono text-white text-xs">{job.container_no}</span>
                </span>
                {job.hanger_no && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    🪝 #{job.hanger_no}
                  </span>
                )}
              </div>
              <p className="font-bold text-white text-sm font-mono truncate mt-1">
                {job.model_part_no}
              </p>
              <p className="text-xs text-orange-300 truncate">{getPartTypeLabel(job.part_name, lang)}</p>
            </div>
            <div className="text-right shrink-0 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">
                {lang === 'my' ? 'လိုင်းပေါ်စုစုပေါင်း' : 'บนไลน์ทั้งหมด'}
              </span>
              <span className="text-base font-extrabold text-amber-400 font-mono">
                {job.quantity} {t.pieceUnit}
              </span>
            </div>
          </div>

          {/* Unload Quantity Selector */}
          <div className="space-y-3 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <label className="text-xs sm:text-sm font-bold text-emerald-300 block">
              {lang === 'my'
                ? 'ဖြုတ်ပြီးသော အရေအတွက် (ဆေးမှုတ်ပြီး):'
                : 'จำนวนที่ปลดลงจากไลน์แล้ว (พ่นเสร็จพร้อมส่งมอบ):'}
            </label>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={unloadQty <= 1}
                  onClick={() => setUnloadQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold text-lg flex items-center justify-center border border-slate-700 active:scale-95 transition-all"
                >
                  -
                </button>
                <div className="min-w-[88px] text-center bg-slate-900 border-2 border-emerald-500/80 rounded-xl px-3 py-2">
                  <span className="text-xl font-black font-mono text-emerald-400">{unloadQty}</span>
                  <span className="text-xs text-slate-400 ml-1">{t.pieceUnit}</span>
                </div>
                <button
                  type="button"
                  disabled={unloadQty >= job.quantity}
                  onClick={() => setUnloadQty((q) => Math.min(job.quantity, q + 1))}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold text-lg flex items-center justify-center border border-slate-700 active:scale-95 transition-all"
                >
                  +
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setUnloadQty(1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    unloadQty === 1
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  1 {t.pieceUnit}
                </button>
                <button
                  type="button"
                  onClick={() => setUnloadQty(job.quantity)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    unloadQty === job.quantity
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {lang === 'my' ? 'အားလုံး' : 'ทั้งหมด'} ({job.quantity})
                </button>
              </div>
            </div>

            {/* Live Status Split Preview */}
            <div className="pt-2 space-y-1.5 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between text-emerald-300 font-semibold">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'my' ? 'ဖြုတ်ပြီး (ဆေးမှုတ်ပြီး):' : 'ปลดลงแล้ว (พ่นเสร็จพร้อมส่งมอบ):'}</span>
                </span>
                <span className="font-mono font-bold">{unloadQty} {t.pieceUnit}</span>
              </div>

              {remainingOnLine > 0 ? (
                <div className="flex items-center justify-between text-amber-300 font-semibold bg-amber-950/40 border border-amber-600/40 rounded-lg px-2.5 py-1.5">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {lang === 'my'
                        ? `လိုင်းပေါ်တွင် ကျန်ရှိနေဆဲ${job.hanger_no ? ` (ချိတ် #${job.hanger_no})` : ''}:`
                        : `คงค้างอยู่บนไลน์${job.hanger_no ? ` (แฮงค์เกอร์ #${job.hanger_no})` : ''}:`}
                    </span>
                  </span>
                  <span className="font-mono font-bold">{remainingOnLine} {t.pieceUnit}</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  {lang === 'my'
                    ? `✨ ပစ္စည်းအားလုံး ${job.quantity} ${t.pieceUnit} ကို ဖြုတ်ပြီးပါပြီ`
                    : `✨ ปลดชิ้นงานลงครบทั้งหมด ${job.quantity} ${t.pieceUnit} แล้ว`}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-medium transition-colors"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {remainingOnLine > 0
                  ? (lang === 'my'
                      ? `${unloadQty} ${t.pieceUnit} ဖြုတ်ပြီး အတည်ပြုမည် (လိုင်းပေါ် ${remainingOnLine} ကျန်)`
                      : `ยืนยันปลดลง ${unloadQty} ${t.pieceUnit} (ค้างไลน์ ${remainingOnLine})`)
                  : (lang === 'my'
                      ? `အားလုံးပြီးစီးကြောင်း အတည်ပြုမည် (${job.quantity} ${t.pieceUnit})`
                      : `ยืนยันพ่นเสร็จทั้งหมด (${job.quantity} ${t.pieceUnit})`)}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
