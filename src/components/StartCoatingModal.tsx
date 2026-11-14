import React, { useState } from 'react';
import { X, Check, Droplets, Sparkles, Paintbrush, AlertCircle, ChevronDown, Hash } from 'lucide-react';
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
  const { lang, t } = useLanguage();
  
  // Extract number from existing job.hanger_no if any (1 - 99)
  const initialHangerNum = React.useMemo(() => {
    if (!job.hanger_no) return '';
    const parsed = parseInt(job.hanger_no.replace(/\D/g, ''), 10);
    return !isNaN(parsed) && parsed >= 1 && parsed <= 99 ? parsed : '';
  }, [job.hanger_no]);

  const [hangerNo, setHangerNo] = useState<number | ''>(initialHangerNum);
  const [coatingType, setCoatingType] = useState<CoatingType>(job.coating_type || 'EDP_AND_POWDER');
  const [error, setError] = useState<string | null>(null);

  // Tab range for quick number buttons: 1-20, 21-40, 41-60, 61-80, 81-99
  const [activeRange, setActiveRange] = useState<number>(() => {
    if (typeof initialHangerNum === 'number') {
      return Math.floor((initialHangerNum - 1) / 20);
    }
    return 0; // Default 1 - 20
  });

  const rangeTabs = [
    { label: '1 - 20', start: 1, end: 20 },
    { label: '21 - 40', start: 21, end: 40 },
    { label: '41 - 60', start: 41, end: 60 },
    { label: '61 - 80', start: 61, end: 80 },
    { label: '81 - 99', start: 81, end: 99 },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hangerNo || hangerNo < 1 || hangerNo > 99) {
      setError(t.hangerRequiredAlert);
      return;
    }
    setError(null);
    onConfirm(job.id, String(hangerNo), coatingType);
    onClose();
  };

  const handleSelectNumber = (num: number) => {
    setHangerNo(num);
    if (error) setError(null);
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Job Summary Banner */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
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

          {/* Hanger Number Selector (1 - 99 strictly, NO manual typing) */}
          <div className="space-y-3 bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center space-x-1.5">
                <span>🪝</span>
                <span>{t.labelHangerNo}</span>
              </label>
              <span className="text-[10px] sm:text-xs text-amber-400 font-medium">
                (ล็อกเลข 1 - 99 ป้องกันพิมพ์ผิด)
              </span>
            </div>

            {/* Selected Number Highlight Banner with Quick Stepper */}
            <div className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
              hangerNo 
                ? 'bg-amber-950/40 border-amber-500/80 shadow-md shadow-amber-950/30' 
                : 'bg-slate-900/90 border-slate-700'
            }`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl leading-none">🪝</span>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    {lang === 'my' ? 'ရွေးချယ်ထားသော ချိတ်နံပါတ်' : 'หมายเลขแฮงค์เกอร์ที่เลือก'}
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-amber-300 tracking-wider block">
                    {hangerNo ? `แฮงค์เกอร์ #${hangerNo}` : (
                      <span className="text-slate-500 text-sm font-normal">-- ยังไม่ได้เลือก --</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Quick Stepper Buttons (-1 / +1) */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  disabled={!hangerNo || hangerNo <= 1}
                  onClick={() => {
                    const current = typeof hangerNo === 'number' ? hangerNo : 1;
                    if (current > 1) handleSelectNumber(current - 1);
                  }}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-sm flex items-center justify-center border border-slate-700 active:scale-95 transition-all"
                  title="ลด 1"
                >
                  -1
                </button>
                <button
                  type="button"
                  disabled={hangerNo === 99}
                  onClick={() => {
                    const current = typeof hangerNo === 'number' ? hangerNo : 0;
                    if (current < 99) handleSelectNumber(current + 1);
                  }}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-sm flex items-center justify-center border border-slate-700 active:scale-95 transition-all"
                  title="เพิ่ม 1"
                >
                  +1
                </button>
              </div>
            </div>

            {/* Dropdown Select (Native Wheel for Mobile) */}
            <div className="relative">
              <select
                value={hangerNo}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : '';
                  if (typeof val === 'number') {
                    handleSelectNumber(val);
                    // auto jump decade tab
                    setActiveRange(Math.floor((val - 1) / 20));
                  }
                }}
                className={`w-full appearance-none bg-slate-900 border-2 rounded-xl px-4 py-3 text-sm sm:text-base font-bold text-white focus:outline-none transition-all cursor-pointer ${
                  error
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/50'
                    : 'border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30'
                }`}
              >
                <option value="" disabled className="text-slate-500">
                  {t.placeholderHangerNo}
                </option>
                {Array.from({ length: 99 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num} className="bg-slate-900 text-white py-1">
                    {`🪝 แฮงค์เกอร์หมายเลข ${num} (ချိတ် ${num})`}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>

            {/* Quick Touch Number Pad Grid (1 - 99 by Ranges) */}
            <div className="space-y-2 pt-1">
              {/* Range Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {rangeTabs.map((tab, idx) => (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveRange(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                      activeRange === idx
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Number Buttons in Active Range */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                {Array.from(
                  { length: rangeTabs[activeRange].end - rangeTabs[activeRange].start + 1 },
                  (_, i) => rangeTabs[activeRange].start + i
                ).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectNumber(num)}
                    className={`py-2 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all border active:scale-95 ${
                      hangerNo === num
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/40 font-black scale-105'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: EDP Only */}
              <div
                onClick={() => setCoatingType('EDP_ONLY')}
                className={`cursor-pointer rounded-xl p-3 border-2 transition-all relative flex flex-col justify-between ${
                  coatingType === 'EDP_ONLY'
                    ? 'bg-cyan-950/50 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                      <Droplets className="w-4 h-4" />
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
                  <h4 className="font-bold text-xs sm:text-sm text-cyan-200">
                    {t.coatingTypeEdpOnly}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-snug">
                    {t.coatingTypeEdpOnlyDesc}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800">
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/80 font-semibold">
                    EDP ONLY
                  </span>
                </div>
              </div>

              {/* Option 2: EDP + Powder Coat */}
              <div
                onClick={() => setCoatingType('EDP_AND_POWDER')}
                className={`cursor-pointer rounded-xl p-3 border-2 transition-all relative flex flex-col justify-between ${
                  coatingType === 'EDP_AND_POWDER'
                    ? 'bg-purple-950/50 border-purple-400 ring-2 ring-purple-500/30 shadow-lg shadow-purple-950/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                      <Sparkles className="w-4 h-4" />
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
                  <h4 className="font-bold text-xs sm:text-sm text-purple-200">
                    {t.coatingTypeEdpAndPowder}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-snug">
                    {t.coatingTypeEdpAndPowderDesc}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800">
                  <span className="text-[9px] font-mono text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800/80 font-semibold">
                    EDP + POWDER
                  </span>
                </div>
              </div>

              {/* Option 3: Powder Coat Only (ไม่ชุบ EDP) */}
              <div
                onClick={() => setCoatingType('POWDER_ONLY')}
                className={`cursor-pointer rounded-xl p-3 border-2 transition-all relative flex flex-col justify-between ${
                  coatingType === 'POWDER_ONLY'
                    ? 'bg-amber-950/50 border-amber-400 ring-2 ring-amber-500/30 shadow-lg shadow-amber-950/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <Paintbrush className="w-4 h-4" />
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        coatingType === 'POWDER_ONLY'
                          ? 'border-amber-400 bg-amber-500 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {coatingType === 'POWDER_ONLY' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-amber-200">
                    {t.coatingTypePowderOnly}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-snug">
                    {t.coatingTypePowderOnlyDesc}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800">
                  <span className="text-[9px] font-mono text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/80 font-semibold">
                    POWDER ONLY
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
