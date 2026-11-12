import React from 'react';
import { Layers, PlusCircle, CheckCircle2, PackageCheck, Database, Paintbrush } from 'lucide-react';
import { JobStatus } from '../types';

interface NavbarProps {
  activeTab: 'receive' | 'tracker' | 'packing' | 'settings';
  setActiveTab: (tab: 'receive' | 'tracker' | 'packing' | 'settings') => void;
  isSupabaseConnected: boolean;
  counts: Record<JobStatus, number>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isSupabaseConnected,
  counts,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('tracker')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Paintbrush className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  POWDER COAT <span className="text-orange-400">TRACKER</span>
                </span>
                {isSupabaseConnected ? (
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                    Supabase Cloud
                  </span>
                ) : (
                  <span 
                    onClick={(e) => { e.stopPropagation(); setActiveTab('settings'); }} 
                    className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
                    โหมดจำลอง (คลิกเพื่อต่อ DB)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                ระบบรับเข้าและส่งมอบงานพ่นสีอะไหล่กันชน
              </p>
            </div>
          </div>

          {/* Quick Stats on desktop */}
          <div className="hidden lg:flex items-center space-x-2 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-slate-400">รอพ่น:</span>
              <span className="font-semibold text-white">{counts.RECEIVED || 0}</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-slate-400">กำลังพ่น:</span>
              <span className="font-semibold text-white">{counts.IN_PROGRESS || 0}</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">พ่นเสร็จ:</span>
              <span className="font-semibold text-white">{counts.COMPLETED || 0}</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-slate-400">ส่งแพ็คกิ้งแล้ว:</span>
              <span className="font-semibold text-white">{counts.DISPATCHED_TO_PACKING || 0}</span>
            </div>
          </div>

          {/* Actions & Settings */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('receive')}
              className={`flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-medium text-sm transition-all shadow-md ${
                activeTab === 'receive'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/25 ring-2 ring-orange-400/50'
                  : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>รับเข้างานใหม่</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              title="ตั้งค่า Supabase / ฐานข้อมูล"
              className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
                activeTab === 'settings'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Database className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-2 overflow-x-auto py-2 border-t border-slate-800/80 text-sm">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'tracker'
                ? 'bg-slate-800 text-orange-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>รายการงานทั้งหมด</span>
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
            <span>ฟอร์มรับเข้า (ถ่ายรูป)</span>
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
            <span>ส่งมอบแผนกแพ็คกิ้ง</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>ตั้งค่า Supabase</span>
          </button>
        </div>
      </div>
    </header>
  );
};
