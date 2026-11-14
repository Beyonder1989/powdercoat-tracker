import React, { useState, useEffect } from 'react';
import { Lock, Unlock, X, KeyRound, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';

export const PinModal: React.FC = () => {
  const { isPinModalOpen, closePinModal, unlockWithPin, updatePin, isOperator, lockToViewer } = useRole();
  const { lang, t } = useLanguage();

  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Mode: 'enter' (unlock) | 'change' (supervisor change PIN)
  const [mode, setMode] = useState<'enter' | 'change'>('enter');
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [changeSuccess, setChangeSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isPinModalOpen) {
      setPin('');
      setError(null);
      setIsShaking(false);
      setMode('enter');
      setOldPin('');
      setNewPin('');
      setChangeSuccess(false);
    }
  }, [isPinModalOpen]);

  if (!isPinModalOpen) return null;

  const handleKeyPress = (num: string) => {
    setError(null);
    if (mode === 'enter') {
      if (pin.length < 6) {
        const next = pin + num;
        setPin(next);
        if (next.length === 4) {
          // Auto submit at 4 digits
          const ok = unlockWithPin(next);
          if (!ok) {
            setError(t.pinModalWrong);
            setIsShaking(true);
            setTimeout(() => {
              setIsShaking(false);
              setPin('');
            }, 600);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setError(null);
    if (mode === 'enter') {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setError(null);
    setPin('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'enter') {
      const ok = unlockWithPin(pin);
      if (!ok) {
        setError(t.pinModalWrong);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
      }
    } else {
      // Change PIN mode
      const res = updatePin(oldPin, newPin);
      if (res.success) {
        setChangeSuccess(true);
        setTimeout(() => {
          setMode('enter');
          setChangeSuccess(false);
          closePinModal();
        }, 1200);
      } else {
        setError(res.message || 'รหัสผ่านเดิมไม่ถูกต้อง');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden transition-transform ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <h3 className="font-bold text-sm sm:text-base">
              {mode === 'enter' ? t.pinModalTitle : t.pinChangeTitle}
            </h3>
          </div>
          <button
            onClick={closePinModal}
            className="p-1 rounded-lg text-orange-200 hover:text-white hover:bg-black/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {mode === 'enter' ? (
            <>
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-300">{t.pinModalSubtitle}</p>
                <div className="pt-2">
                  <span className="text-[11px] bg-slate-800 text-amber-300 px-2.5 py-1 rounded-full border border-slate-700">
                    💡 {t.pinModalDefaultHint}
                  </span>
                </div>
              </div>

              {/* Masked PIN Dots Display */}
              <div className="flex justify-center items-center space-x-4 py-2">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pin.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        isFilled
                          ? 'bg-orange-500 border-orange-400 scale-125 shadow-md shadow-orange-500/50'
                          : 'bg-slate-800 border-slate-600'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-2.5 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center justify-center space-x-1.5 text-center">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Numeric Keypad for Mobile / Tablet */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeyPress(digit)}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-orange-600 active:text-white text-lg font-bold text-white transition-colors border border-slate-700/80 shadow"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-12 rounded-2xl bg-slate-800/60 hover:bg-slate-700 text-xs font-semibold text-slate-400 transition-colors border border-slate-800"
                >
                  C
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress('0')}
                  className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-orange-600 active:text-white text-lg font-bold text-white transition-colors border border-slate-700/80 shadow"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="h-12 rounded-2xl bg-slate-800/60 hover:bg-slate-700 text-xs font-semibold text-slate-400 transition-colors border border-slate-800"
                >
                  ⌫
                </button>
              </div>

              {/* Supervisor Change PIN link */}
              {isOperator && (
                <div className="pt-2 text-center border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMode('change')}
                    className="text-xs text-orange-400 hover:underline flex items-center justify-center space-x-1 mx-auto"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{t.pinChangeBtn}</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Change PIN form */
            <form onSubmit={handleManualSubmit} className="space-y-4">
              {changeSuccess ? (
                <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                  <p className="font-semibold">{t.pinChangeSuccess}</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="p-2.5 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">รหัส PIN ปัจจุบัน</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      placeholder="เช่น 1234"
                      value={oldPin}
                      onChange={(e) => setOldPin(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">รหัส PIN ใหม่ (4-6 หลัก)</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      placeholder="ตั้งรหัสใหม่ 4 หลัก"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('enter')}
                      className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 text-xs"
                    >
                      {t.pinModalClose}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-md shadow-orange-600/30"
                    >
                      {t.pinModalConfirm}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
