import React from 'react';
import { Layers, PlusCircle, PackageCheck, Paintbrush, Lock, Unlock, Eye, ShieldCheck, KeyRound } from 'lucide-react';
import { JobStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useRole } from '../context/RoleContext';

interface NavbarProps {
  activeTab: 'receive' | 'tracker' | 'packing';
  setActiveTab: (tab: 'receive' | 'tracker' | 'packing') => void;
  counts: Record<JobStatus, number>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  counts,
}) => {
  const { lang, setLang, t } = useLanguage();
  const { isOperator, role, openPinModal, lockToViewer } = useRole();

  const handleReceiveClick = () => {
    if (isOperator) {
      setActiveTab('receive');
    } else {
      openPinModal(() => setActiveTab('receive'));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-xl w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-1.5 sm:gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('tracker')}>
            <div className="h-9 sm:h-12 flex items-center justify-center shrink-0">
              <img 
                src="/hamer-logo.png" 
                alt="HAMER 4X4" 
                className="h-8 sm:h-11 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform" 
              />
            </div>
            <div className="leading-tight">
              <span className="text-sm sm:text-xl font-black tracking-tight text-white block">
                <span className="sm:hidden text-amber-400 font-extrabold tracking-wider">PC TRACKER</span>
                <span className="hidden sm:inline font-mono">POWDER COAT <span className="text-amber-400">TRACKER</span></span>
              </span>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden lg:block">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Right Area: Role/PIN Auth + Language Switcher + New Job Action */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Operator / Viewer Role Toggle Pill */}
            {isOperator ? (
              <div className="flex items-center bg-emerald-950/80 border border-emerald-500/80 rounded-xl p-0.5 sm:p-1 text-xs shadow-md shadow-emerald-950/40">
                <span className="px-1.5 sm:px-2 py-0.5 text-emerald-300 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">{t.modeOperator}</span>
                </span>
                <button
                  type="button"
                  onClick={lockToViewer}
                  title="ล็อกกลับเป็นโหมดดูอย่างเดียว"
                  className="px-1.5 sm:px-2 py-1 rounded-lg bg-emerald-900/80 hover:bg-rose-900 text-emerald-200 hover:text-white transition-colors flex items-center space-x-1 font-semibold text-[11px] sm:text-xs"
                >
                  <Lock className="w-3 h-3" />
                  <span className="hidden sm:inline">{t.btnLock}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-0.5 sm:p-1 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => openPinModal()}
                  title="ใส่รหัสผ่านแผนกพ่นสีเพื่อแก้ไขข้อมูล"
                  className="px-2 sm:px-2.5 py-1 rounded-lg bg-orange-600/90 hover:bg-orange-500 text-white transition-colors flex items-center space-x-1 font-bold shadow-md shadow-orange-600/30 text-[11px] sm:text-xs"
                >
                  <KeyRound className="w-3 h-3" />
                  <span className="hidden xs:inline">{t.btnUnlock}</span>
                </button>
              </div>
            )}

            {/* Language Switcher Pill */}
            <div className="bg-slate-950/80 p-0.5 sm:p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => setLang('th')}
                title="เปลี่ยนเป็นภาษาไทย"
                className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'th'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>🇹🇭</span>
                <span className="hidden sm:inline">TH</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('my')}
                title="မြန်မာဘာသာသို့ ပြောင်းရန်"
                className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'my'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>🇲🇲</span>
                <span className="hidden sm:inline">မြန်မာ</span>
              </button>
            </div>

            {/* New Job Button */}
            <button
              onClick={handleReceiveClick}
              className={`flex items-center space-x-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-md shrink-0 ${
                activeTab === 'receive'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/25 ring-2 ring-orange-400/50'
                  : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">{t.btnNewJob}</span>
              <span className="sm:hidden">{lang === 'my' ? 'အသစ်' : 'รับงาน'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-2 overflow-x-auto py-2 border-t border-slate-800/80 text-xs sm:text-sm scrollbar-none max-w-full min-w-0">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeTab === 'tracker'
                ? 'bg-slate-800 text-orange-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t.tabAllJobs}</span>
          </button>

          <button
            onClick={handleReceiveClick}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeTab === 'receive'
                ? 'bg-slate-800 text-orange-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t.tabReceive}</span>
          </button>

          <button
            onClick={() => setActiveTab('packing')}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeTab === 'packing'
                ? 'bg-slate-800 text-purple-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t.tabPacking}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
