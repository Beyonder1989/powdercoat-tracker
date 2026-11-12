import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, SUPABASE_SQL_SETUP } from '../lib/supabase';

interface SupabaseSettingsModalProps {
  onSaved: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({ onSaved }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState<string>(currentConfig.url);
  const [key, setKey] = useState<string>(currentConfig.key);
  const [copied, setCopied] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      saveSupabaseConfig('', '');
      setMessage({ type: 'success', text: 'รีเซ็ตกลับเป็นโหมดจำลอง (Local Storage Mode) เรียบร้อย' });
      onSaved();
      return;
    }

    if (!url.includes('supabase.co')) {
      setMessage({ type: 'error', text: 'Supabase URL ต้องอยู่ในรูปแบบ https://xxxx.supabase.co' });
      return;
    }

    saveSupabaseConfig(url.trim(), key.trim());
    setMessage({ type: 'success', text: 'บันทึกการตั้งค่า Supabase เรียบร้อยแล้ว! กำลังเชื่อมต่อ...' });
    setTimeout(() => {
      onSaved();
      window.location.reload();
    }, 800);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      {/* Settings Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">ตั้งค่าเชื่อมต่อ Supabase Database (Free Tier 100%)</h2>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                ใช้พื้นที่ฟรีของ Supabase สำหรับเก็บข้อมูลงานและรูปภาพหลักฐาน
              </p>
            </div>
          </div>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 text-xs bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-xl backdrop-blur transition-colors"
          >
            <span>เปิด Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-xl text-sm flex items-center space-x-2 ${
                message.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/80 border border-rose-800 text-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                1. Project URL (หาได้จาก Supabase: Project Settings {'>'} API)
              </label>
              <input
                type="text"
                placeholder="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                2. Project API Anon Key (public)
              </label>
              <textarea
                rows={3}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              สถานะ: {currentConfig.isConfigured ? (
                <strong className="text-emerald-400">เชื่อมต่อกับ Supabase แล้ว</strong>
              ) : (
                <strong className="text-amber-400">ทำงานในโหมดจำลอง (Local Storage)</strong>
              )}
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </form>
      </div>

      {/* SQL Setup Instructions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>คำสั่ง SQL สำหรับรันใน Supabase (SQL Editor)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              คัดลอกโค้ดนี้ไปวางในเมนู <strong>SQL Editor</strong> บนเว็บ Supabase แล้วกด <strong>Run</strong> ครั้งเดียวจบ!
            </p>
          </div>
          <button
            onClick={handleCopySql}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">คัดลอกแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>คัดลอกคำสั่ง SQL</span>
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <pre className="bg-black/60 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-72">
            {SUPABASE_SQL_SETUP}
          </pre>
        </div>

        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-2">
          <div className="font-semibold text-white">สิ่งที่ระบบจะสร้างให้อัตโนมัติ:</div>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>ตาราง <code className="text-orange-300">powdercoat_jobs</code> สำหรับเก็บข้อมูลการรับเข้า ผู้ส่ง Model Part วันที่เวลา และลิงก์รูป</li>
            <li>Storage Bucket <code className="text-orange-300">powdercoat-evidence</code> สำหรับเก็บรูปภาพใบส่งมอบและตัวชิ้นงาน</li>
            <li>ตั้งค่านโยบาย Public RLS ให้อ่านและเขียนข้อมูลได้ปลอดภัย</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
