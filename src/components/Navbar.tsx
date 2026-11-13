import React from 'react';
import { Layers, PlusCircle, PackageCheck, Paintbrush, Globe } from 'lucide-react';
import { JobStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';

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

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('tracker')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Paintbrush className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-xl font-bold tracking-tight text-white">
                  {t.brandTitle} <span className="text-orange-400">{t.brandTitleHighlight}</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Stats on desktop */}
          <div className="hidden xl:flex items-center space-x-2 text-xs">
            <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-slate-400">{t.statsReceived}:</span>
              <span className="font-semibold text-white">{counts.RECEIVED || 0}</span>
            </div>
            <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-slate-400">{t.statsInProgress}:</span>
              <span className="font-semibold text-white">{counts.IN_PROGRESS || 0}</span>
            </div>
            <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">{t.statsCompleted}:</span>
              <span className="font-semibold text-white">{counts.COMPLETED || 0}</span>
            </div>
            <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-slate-400">{t.statsDispatched}:</span>
              <span className="font-semibold text-white">{counts.DISPATCHED_TO_PACKING || 0}</span>
            </div>
          </div>

          {/* Language Switcher + New Job Action */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Language Switcher Pill */}
            <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => setLang('th')}
                title="เปลี่ยนเป็นภาษาไทย"
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'th'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>🇹🇭</span>
                <span className="hidden xs:inline">TH</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('my')}
                title="မြန်မာဘာသာသို့ ပြောင်းရန်"
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'my'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>🇲🇲</span>
                <span>မြန်မာ</span>
              </button>
            </div>

            {/* New Job Button */}
            <button
              onClick={() => setActiveTab('receive')}
              className={`flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-md ${
                activeTab === 'receive'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/25 ring-2 ring-orange-400/50'
                  : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30'
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{t.btnNewJob}</span>
              <span className="sm:hidden">{lang === 'my' ? 'အသစ်' : 'รับงาน'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-2 overflow-x-auto py-2 border-t border-slate-800/80 text-xs sm:text-sm scrollbar-none">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'tracker'
                ? 'bg-slate-800 text-orange-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.tabAllJobs}</span>
          </button>

          <button
            onClick={() => setActiveTab('receive')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'receive'
                ? 'bg-slate-800 text-orange-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.tabReceive}</span>
          </button>

          <button
            onClick={() => setActiveTab('packing')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'packing'
                ? 'bg-slate-800 text-purple-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>{t.tabPacking}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
