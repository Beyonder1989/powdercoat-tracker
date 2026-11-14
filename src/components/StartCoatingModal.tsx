import React, { useState } from 'react';
import { X, Check, Droplets, Sparkles, AlertCircle } from 'lucide-react';
import { PowderCoatJob, CoatingType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface StartCoatingModalProps {
  job: PowderCoatJob;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (jobId: string, hangerNo: string, coatingType: CoatingType) => void;
}

export const StartCoatingModal: React.FC<StartCoatingModalProps> = ({
  job,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useLanguage();
  const [hangerNo, setHangerNo] = useState<string>(job.hanger_no || '');
  const [coatingType, setCoatingType] = useState<CoatingType>(job.coating_type || 'EDP_AND_POWDER');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hangerNo.trim()) {
      setError(t.hangerRequiredAlert);
      return;
    }
    setError(null);
    onConfirm(job.id, hangerNo.trim().toUpperCase(), coatingType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600/30 via-slate-800 to-slate-800 px-5 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <span className="text-xl leading-none">🪝</span>
            </span>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                {t.startCoatingModalTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.startCoatingModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Job Summary Banner */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                {t.boxNotice}: <span className="font-mono text-white text-sm">{job.container_no}</span>
              </span>
              <p className="font-bold text-white text-sm font-mono truncate mt-0.5">
                {job.model_part_no}
              </p>
              <p className="text-xs text-orange-300 truncate">
                {job.part_name}
              </p>
            </div>
            <div className="text-right shrink-0 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">{t.qtyLabel}</span>
              <span className="text-base font-extrabold text-emerald-400">
                {job.quantity} {t.pieceUnit}
              </span>
            </div>
          </div>

          {/* Hanger Number Input */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span>🪝</span>
                <span>{t.labelHangerNo}</span>
              </span>
              <span className="text-[11px] text-amber-400 font-normal">
                (จำเป็น / မဖြစ်မနေ)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={hangerNo}
                onChange={(e) => {
                  setHangerNo(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={t.placeholderHangerNo}
                className={`w-full bg-slate-950 border-2 rounded-xl px-4 py-3 text-lg font-mono font-bold tracking-wider text-white placeholder-slate-600 focus:outline-none transition-all uppercase ${
                  error
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/50'
                    : 'border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30'
                }`}
              />
            </div>

            {/* Quick Hanger Pre-set buttons for speed on mobile */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 mr-1">ปุ่มช่วยเติม:</span>
              {['H-', 'HG-', 'LINE-1', 'LINE-2'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setHangerNo((prev) => (prev ? `${prev}${preset}` : preset));
                  }}
                  className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                >
                  +{preset}
                </button>
              ))}
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-medium flex items-center space-x-1 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Coating Process Selection Cards */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-200">
              {t.labelCoatingType}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: EDP Only */}
              <div
                onClick={() => setCoatingType('EDP_ONLY')}
                className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all relative flex flex-col justify-between ${
                  coatingType === 'EDP_ONLY'
                    ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                      <Droplets className="w-5 h-5" />
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        coatingType === 'EDP_ONLY'
                          ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {coatingType === 'EDP_ONLY' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-cyan-200">
                    {t.coatingTypeEdpOnly}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {t.coatingTypeEdpOnlyDesc}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80 font-semibold">
                    EDP ONLY
                  </span>
                </div>
              </div>

              {/* Option 2: EDP + Powder Coat */}
              <div
                onClick={() => setCoatingType('EDP_AND_POWDER')}
                className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all relative flex flex-col justify-between ${
                  coatingType === 'EDP_AND_POWDER'
                    ? 'bg-purple-950/40 border-purple-400 ring-2 ring-purple-500/30 shadow-lg shadow-purple-950/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        coatingType === 'EDP_AND_POWDER'
                          ? 'border-purple-400 bg-purple-500 text-white'
                          : 'border-slate-600'
                      }`}
                    >
                      {coatingType === 'EDP_AND_POWDER' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-purple-200">
                    {t.coatingTypeEdpAndPowder}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {t.coatingTypeEdpAndPowderDesc}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/80 font-semibold">
                    EDP + POWDER
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-medium transition-colors"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-600/30 transition-all flex items-center space-x-1.5"
            >
              <span>{t.btnConfirmStartCoating}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
