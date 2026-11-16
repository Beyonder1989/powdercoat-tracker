import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';

export const PinModal: React.FC = () => {
  const { 
    isPinModalOpen, 
    closePinModal, 
    unlockWithPin, 
    updatePin, 
    pinModalMode, 
    setPinModalMode 
  } = useRole();
  const { lang, t } = useLanguage();

  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Change PIN states
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [changeSuccess, setChangeSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isPinModalOpen) {
      setPin('');
      setError(null);
      setIsShaking(false);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setChangeSuccess(false);
    }
  }, [isPinModalOpen]);

  if (!isPinModalOpen) return null;

  const handleKeyPress = async (num: string) => {
    setError(null);
    if (pinModalMode === 'enter') {
      if (pin.length < 6) {
        const next = pin + num;
        setPin(next);
        if (next.length === 4) {
          // Auto submit at 4 digits
          const ok = await unlockWithPin(next);
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
    if (pinModalMode === 'enter') {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setError(null);
    setPin('');
  };

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!oldPin) {
      setError(lang === 'my' ? 'လက်ရှိ PIN နံပါတ် ထည့်ပါ' : 'กรุณาใส่รหัส PIN เดิม');
      return;
    }
    if (!newPin || newPin.length < 4) {
      setError(lang === 'my' ? 'PIN အသစ်သည် အနည်းဆုံး ၄ လုံး ရှိရမည်' : 'รหัส PIN ใหม่ต้องมีอย่างน้อย 4 หลัก');
      return;
    }
    if (newPin !== confirmPin) {
      setError(lang === 'my' ? 'PIN အသစ် ၂ ကြိမ် မတူညီပါ' : 'รหัส PIN ใหม่และการยืนยันไม่ตรงกัน');
      return;
    }

    const res = await updatePin(oldPin, newPin);
    if (res.success) {
      setChangeSuccess(true);
      setTimeout(() => {
        setPinModalMode('enter');
        setChangeSuccess(false);
        closePinModal();
      }, 1500);
    } else {
      setError(res.message || (lang === 'my' ? 'မူလ PIN မမှန်ပါ' : 'รหัสผ่านเดิมไม่ถูกต้อง'));
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
            {pinModalMode === 'change' ? (
              <KeyRound className="w-5 h-5 text-orange-200" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            <h3 className="font-bold text-sm sm:text-base">
              {pinModalMode === 'enter' 
                ? t.pinModalTitle 
                : (lang === 'my' ? 'PIN နံပါတ် အသစ်သတ်မှတ်ခြင်း' : 'ตั้งค่ารหัส PIN ใหม่')}
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
          {pinModalMode === 'enter' ? (
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

              {/* ปุ่มสลับไปโหมดเปลี่ยนรหัส PIN (เปิดให้คลิกเปลี่ยนได้ตลอดเวลา) */}
              <div className="pt-3 text-center border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setPinModalMode('change');
                  }}
                  className="text-xs text-orange-400 hover:text-orange-300 hover:underline inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'my' 
                      ? '⚙️ PIN နံပါတ် ပြောင်းလဲရန် နှိပ်ပါ' 
                      : '⚙️ ต้องการเปลี่ยนรหัส PIN? แตะที่นี่'}
                  </span>
                </button>
              </div>
            </>
          ) : (
            /* Change PIN form */
            <form onSubmit={handleChangePinSubmit} className="space-y-4">
              {changeSuccess ? (
                <div className="p-5 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-emerald-300 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 animate-bounce" />
                  <p className="font-bold text-sm">
                    {lang === 'my' ? 'PIN နံပါတ် အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ' : 'เปลี่ยนรหัส PIN สำเร็จเรียบร้อยแล้ว!'}
                  </p>
                  <p className="text-xs text-emerald-400/80">
                    {lang === 'my' ? 'စနစ်သည် အလိုအလျောက် ပွင့်သွားမည်ဖြစ်သည်' : 'ปลดล็อกสิทธิ์ช่างพ่นสีให้อัตโนมัติ'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center text-xs text-slate-400 pb-1">
                    {lang === 'my' 
                      ? 'မူလ PIN နံပါတ်ကို ထည့်သွင်းပြီး အသစ်သတ်မှတ်ပါ' 
                      : 'กรอกรหัสเดิมเพื่อยืนยันสิทธิ์ แล้วตั้งรหัสใหม่ตามต้องการ'}
                  </div>

                  {error && (
                    <div className="p-2.5 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center justify-center space-x-1.5 text-center">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'my' ? 'လက်ရှိ PIN နံပါတ်' : '1. รหัส PIN ปัจจุบัน'}
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      placeholder="ใส่รหัสเดิม (ค่าเริ่มต้น 1234)"
                      value={oldPin}
                      onChange={(e) => setOldPin(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'my' ? 'PIN အသစ် (၄ - ၆ လုံး)' : '2. รหัส PIN ใหม่ (4-6 หลัก)'}
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      placeholder="ตั้งรหัสใหม่ เช่น 8888"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'my' ? 'PIN အသစ် အတည်ပြုပါ' : '3. ยืนยันรหัส PIN ใหม่อีกครั้ง'}
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      placeholder="พิมพ์รหัสใหม่อีกครั้งให้ตรงกัน"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setPinModalMode('enter');
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{lang === 'my' ? 'နောက်သို့' : 'ย้อนกลับ'}</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/30 transition-all"
                    >
                      {lang === 'my' ? 'အတည်ပြုမည်' : 'บันทึกรหัสใหม่'}
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
