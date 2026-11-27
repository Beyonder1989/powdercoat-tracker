import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Camera, CheckCircle2, AlertCircle, X, Search, ChevronDown, 
  Calendar, Clock, User, Package, Building2, Hash, FileText, 
  Flame, Zap, Plus, Trash2, Layers, Sparkles, Box, Edit3, Ban
} from 'lucide-react';
import { DEPARTMENTS, PART_TYPES, MODELS_PART_NO, getPartTypeLabel } from '../data/masterData';
import { getEmployeesByDepartment, POWDER_COAT_RECEIVERS } from '../data/employeeData';
import { uploadEvidenceImage, createBatchJobs } from '../lib/supabase';
import { PowderCoatJob, JobPriority, PlanItem } from '../types';
import { 
  getActiveContainerId, 
  getCachedContainerPlans,
  fetchCancelledPlanItemIds, 
  fetchHiddenContainerKeys,
  makePlanItemKey, 
  makeContainerKey,
  normalizeClosedItemId 
} from '../services/containerPlanService';
import { useLanguage } from '../context/LanguageContext';

export interface ReceiveJobItem {
  id: string;
  modelPartNo: string;
  partName: string;
  customPartName: string;
  quantity: number | '';
  priority: JobPriority;
  modelSearch: string;
  isModelDropdownOpen: boolean;
}

interface ReceiveJobFormProps {
  onSuccess: (newJobs: PowderCoatJob | PowderCoatJob[]) => void;
  onCancel: () => void;
}

const createInitialItem = (): ReceiveJobItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  modelPartNo: '',
  partName: 'กันชนหน้า',
  customPartName: '',
  quantity: 1,
  priority: 'NORMAL',
  modelSearch: '',
  isModelDropdownOpen: false,
});

export const ReceiveJobForm: React.FC<ReceiveJobFormProps> = ({ onSuccess, onCancel }) => {
  const { lang, t } = useLanguage();

  // 1. ข้อมูลการนำส่ง (ข้อมูลร่วมของใบส่งมอบนี้)
  const [department, setDepartment] = useState<string>('Laser(LS)');
  const initialSenders = getEmployeesByDepartment('Laser(LS)');
  const [senderName, setSenderName] = useState<string>(initialSenders[0]?.displayName || '');
  const [isCustomSender, setIsCustomSender] = useState<boolean>(false);
  const [customSenderName, setCustomSenderName] = useState<string>('');

  // ตู้สินค้าจากแผนการผลิต (Production Plan Container)
  const allPlans = useMemo(() => getCachedContainerPlans(), []);
  const [hiddenContainerKeys, setHiddenContainerKeys] = useState<Set<string>>(new Set());

  const visiblePlans = useMemo(() => {
    const filtered = allPlans.filter((p) => !hiddenContainerKeys.has(makeContainerKey(p)));
    return filtered.length > 0 ? filtered : allPlans;
  }, [allPlans, hiddenContainerKeys]);

  const initialActiveContainerId = useMemo(() => getActiveContainerId(), []);
  const defaultContainer = useMemo(() => {
    return (
      allPlans.find((p) => makeContainerKey(p) === initialActiveContainerId || p.id === initialActiveContainerId) ||
      allPlans[0]
    );
  }, [allPlans, initialActiveContainerId]);

  const [containerMode, setContainerMode] = useState<'PLAN' | 'CUSTOM'>('PLAN');
  const [selectedPlanContainerKey, setSelectedPlanContainerKey] = useState<string>(
    defaultContainer ? makeContainerKey(defaultContainer) : ''
  );
  const [containerNo, setContainerNo] = useState<string>(
    defaultContainer ? defaultContainer.name : ''
  );
  const [customContainerText, setCustomContainerText] = useState<string>('');

  // ดึงแผนงานของตู้ที่เลือก (เพื่อนำมาใช้แนะนำโมเดลในฟอร์ม)
  const currentPlanContainer = useMemo(() => {
    if (containerMode !== 'PLAN') return null;
    return (
      visiblePlans.find((p) => makeContainerKey(p) === selectedPlanContainerKey || p.id === selectedPlanContainerKey) ||
      visiblePlans[0] ||
      null
    );
  }, [containerMode, visiblePlans, selectedPlanContainerKey]);

  const handleSelectPlanContainer = (planKey: string) => {
    if (planKey === '__custom__') {
      setContainerMode('CUSTOM');
      setContainerNo(customContainerText);
      return;
    }
    const found = visiblePlans.find((p) => makeContainerKey(p) === planKey || p.id === planKey);
    if (found) {
      setContainerMode('PLAN');
      setSelectedPlanContainerKey(makeContainerKey(found));
      setContainerNo(found.name);
    }
  };

  // 1.1 รายการที่ถูกฝ่ายวางแผนยกเลิกการผลิต และตู้ที่ซ่อนการแสดงผล
  const [cancelledItemIds, setCancelledItemIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCancelledPlanItemIds().then((ids) => {
      setCancelledItemIds(new Set(ids.map(normalizeClosedItemId)));
    });
    fetchHiddenContainerKeys().then((keys) => {
      const hiddenSet = new Set(keys);
      setHiddenContainerKeys(hiddenSet);
      // ถ้าตู้ที่เลือกอยู่เริ่มต้นถูกซ่อนไว้ ให้สลับไปตู้แรกที่เปิดแสดงผลอยู่ทันที
      const visible = allPlans.filter((p) => !hiddenSet.has(makeContainerKey(p)));
      if (visible.length > 0) {
        const stillVisible = visible.find(
          (p) => makeContainerKey(p) === selectedPlanContainerKey || p.id === selectedPlanContainerKey
        );
        if (!stillVisible) {
          setSelectedPlanContainerKey(makeContainerKey(visible[0]));
          setContainerNo(visible[0].name);
        }
      }
    });
  }, []);

  // 2. รายการชิ้นงานในใบนี้ (รองรับหลายรายการ / หลายโมเดล)
  const [items, setItems] = useState<ReceiveJobItem[]>([createInitialItem()]);

  // 3. รูปถ่ายหลักฐาน (ถ่ายครั้งเดียว ใช้ร่วมกันทุกรายการในใบนี้)
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [partFile, setPartFile] = useState<File | null>(null);
  const [partPreview, setPartPreview] = useState<string | null>(null);

  // 4. ผู้รับงานแผนกพ่นสี & หมายเหตุ
  const [receiverName, setReceiverName] = useState<string>(
    POWDER_COAT_RECEIVERS[0]?.displayName || 'สุรวุฒิ กระโพธิ์ (ปอนด์) (600096)'
  );
  const [isCustomReceiver, setIsCustomReceiver] = useState<boolean>(false);
  const [customReceiverName, setCustomReceiverName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // สถานะการบันทึก
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File input refs
  const slipInputRef = useRef<HTMLInputElement>(null);
  const partInputRef = useRef<HTMLInputElement>(null);

  // Senders dynamically derived from selected department
  const departmentSenders = useMemo(() => {
    return getEmployeesByDepartment(department);
  }, [department]);

  const handleDepartmentChange = (newDept: string) => {
    setDepartment(newDept);
    const emps = getEmployeesByDepartment(newDept);
    if (emps.length > 0) {
      setSenderName(emps[0].displayName);
      setIsCustomSender(false);
    } else {
      setSenderName('');
      setIsCustomSender(true);
    }
  };

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSlipFile(file);
      setSlipPreview(URL.createObjectURL(file));
    }
  };

  const handlePartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPartFile(file);
      setPartPreview(URL.createObjectURL(file));
    }
  };

  // จัดการรายการชิ้นงาน
  const handleAddItem = () => {
    setItems((prev) => [...prev, createInitialItem()]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<ReceiveJobItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...updates } : it))
    );
  };

  // รวมจำนวนชิ้นงานทั้งหมดในใบนี้
  const totalQuantity = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // ตรวจสอบข้อมูลร่วม
    if (!containerNo.trim()) {
      setErrorMessage(lang === 'my' ? 'ကွန်တိန်နာ / ဘောက်စ် နံပါတ် ထည့်ပါ' : 'กรุณาระบุ หมายเลขตู้สินค้า/รถเข็น');
      return;
    }
    const effectiveSender = (isCustomSender ? customSenderName : senderName).trim();
    if (!effectiveSender) {
      setErrorMessage(lang === 'my' ? 'ပို့ဆောင်သူ အမည် ထည့်ပါ' : 'กรุณาเลือกหรือระบุ ชื่อผู้นำของมาส่ง');
      return;
    }
    const effectiveReceiver = (isCustomReceiver ? customReceiverName : receiverName).trim();
    if (!effectiveReceiver) {
      setErrorMessage(lang === 'my' ? 'လက်ခံသူ အမည် ထည့်ပါ' : 'กรุณาเลือกหรือระบุ ชื่อผู้รับงาน (แผนกพ่นสี)');
      return;
    }
    if (!slipFile) {
      setErrorMessage(lang === 'my' ? 'လွှဲပြောင်းလွှာ ဓာတ်ပုံ ရိုက်ပါ' : 'กรุณาถ่ายรูปหรืออัปโหลด "ใบส่งมอบงาน" เพื่อเก็บเป็นหลักฐาน');
      return;
    }
    if (!partFile) {
      setErrorMessage(lang === 'my' ? 'ပစ္စည်း ဓာတ်ပုံ ရိုက်ပါ' : 'กรุณาถ่ายรูปหรืออัปโหลด "รูปตัวชิ้นงาน/รถเข็น" เพื่อเก็บเป็นหลักฐาน');
      return;
    }

    // ตรวจสอบทุกรายการชิ้นงาน
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const effectivePartNo = (it.modelPartNo || it.modelSearch).trim();
      if (!effectivePartNo) {
        setErrorMessage(
          lang === 'my'
            ? `အစီအစဉ် #${i + 1} ၏ Model / Part No. ရိုက်ထည့်ပါ`
            : `กรุณาระบุ Model / Part No. ในรายการที่ ${i + 1}`
        );
        return;
      }
      if (!it.quantity || Number(it.quantity) < 1) {
        setErrorMessage(
          lang === 'my'
            ? `အစီအစဉ် #${i + 1} ၏ အရေအတွက် ထည့်ပါ`
            : `กรุณาระบุจำนวนชิ้นงานในรายการที่ ${i + 1} ให้ถูกต้อง (อย่างน้อย 1 ชิ้น)`
        );
        return;
      }
    }

    // ตรวจสอบความปลอดภัย: มีโมเดลใดที่ฝ่ายวางแผนแจ้ง "ยกเลิกการผลิต" ในตู้นี้หรือไม่
    if (containerMode === 'PLAN' && currentPlanContainer) {
      const cancelledItemInForm = items.find((it) => {
        const model = (it.modelPartNo || it.modelSearch).trim();
        if (!model) return false;
        const key1 = makePlanItemKey(currentPlanContainer.id, model);
        const key2 = makePlanItemKey(currentPlanContainer.name, model);
        return (
          cancelledItemIds.has(key1) ||
          cancelledItemIds.has(key2) ||
          cancelledItemIds.has(normalizeClosedItemId(key1))
        );
      });
      if (cancelledItemInForm) {
        const modelName = (cancelledItemInForm.modelPartNo || cancelledItemInForm.modelSearch).trim();
        const confirmAccept = window.confirm(
          `⚠️ แจ้งเตือนความปลอดภัย: โมเดล "${modelName}" ถูกฝ่ายวางแผน "🚫 ยกเลิกการผลิต" ในตู้ ${containerNo}!\n\nคุณแน่ใจหรือไม่ว่าต้องการรับเข้าพ่นสีรายการนี้จริง? (หากไม่มีคำสั่งพิเศษแนะนำให้กดยกเลิกและแจ้งฝ่ายวางแผน)`
        );
        if (!confirmAccept) {
          setErrorMessage(`ไม่อนุญาตให้รับงาน: โมเดล ${modelName} ถูกฝ่ายวางแผนยกเลิกการผลิตในตู้ ${containerNo}`);
          return;
        }
      }
    }

    try {
      setIsSubmitting(true);
      setUploadStatus(
        lang === 'my' ? 'လွှဲပြောင်းလွှာပုံ အပ်လုဒ်လုပ်နေသည်...' : 'กำลังอัปโหลดและบีบอัดรูปภาพใบส่งมอบงาน...'
      );
      const slipUrl = await uploadEvidenceImage(slipFile, 'slips');

      setUploadStatus(
        lang === 'my' ? 'ပစ္စည်းပုံ အပ်လုဒ်လုပ်နေသည်...' : 'กำลังอัปโหลดและบีบอัดรูปภาพตัวชิ้นงาน...'
      );
      const partUrl = await uploadEvidenceImage(partFile, 'parts');

      setUploadStatus(
        lang === 'my'
          ? `အချက်အလက်များကို ခွဲခြားသိမ်းဆည်းနေသည် (${items.length} မျိုး)...`
          : `กำลังแยกการ์ดและบันทึกข้อมูล (${items.length} รายการ)...`
      );

      const jobsToCreate = items.map((it) => {
        const effectivePartNo = (it.modelPartNo || it.modelSearch).trim();
        const finalPartName = it.partName === 'อื่นๆ' ? (it.customPartName || 'อื่นๆ') : it.partName;

        return {
          sender_department: department,
          model_part_no: effectivePartNo,
          part_name: finalPartName,
          sender_name: effectiveSender,
          container_no: containerNo.trim(),
          quantity: Number(it.quantity) || 1,
          delivery_slip_image_url: slipUrl,
          part_image_url: partUrl,
          status: 'RECEIVED' as const,
          priority: it.priority,
          received_at: new Date().toISOString(),
          receiver_name: effectiveReceiver,
          notes: notes.trim(),
        };
      });

      const createdJobs = await createBatchJobs(jobsToCreate);
      onSuccess(createdJobs);
    } catch (err: any) {
      console.error('Submit error:', err);
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Layers className="w-6 h-6 text-orange-200" />
                <h2 className="text-xl sm:text-2xl font-bold">
                  {t.formTitle}
                </h2>
              </div>
              <p className="text-orange-100 text-xs sm:text-sm mt-1">
                {lang === 'my'
                  ? '၁ စာရွက်တွင် မော်ဒယ်/ပစ္စည်း အမျိုးအစားများစွာ ထည့်သွင်းနိုင်သည် (စနစ်သည် သီးခြားကတ်များအဖြစ် အလိုအလျောက်ခွဲပေးမည်)'
                  : 'รองรับ 1 ใบส่งมอบ หลายโมเดล/หลายชิ้นงาน (ระบบจะแยกการ์ดติดตามให้อัตโนมัติ เพื่อให้ขึ้นแขวนพ่นสีและส่งออกแยกกันได้อย่างอิสระ)'}
              </p>
            </div>
            <div className="hidden sm:block text-right text-xs text-orange-200 bg-black/20 px-3 py-2 rounded-xl backdrop-blur">
              <div className="flex items-center space-x-1.5 justify-end">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date().toLocaleDateString(lang === 'my' ? 'en-GB' : 'th-TH', { dateStyle: 'medium' })}</span>
              </div>
              <div className="flex items-center space-x-1.5 justify-end mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === 'my' ? 'လက်ရှိအချိန်' : 'เวลาปัจจุบันอัตโนมัติ'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="m-6 p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{errorMessage}</div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* Section 1: ข้อมูลการนำส่ง (ร่วมกันในใบนี้) */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-orange-400" />
                <span>{t.step1Title} ({lang === 'my' ? 'အထွေထွေ အချက်အလက်' : 'ข้อมูลรวมของใบส่งมอบนี้'})</span>
              </h3>
              <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                1 ใบส่งมอบ
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* แผนกที่นำมาส่ง */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t.labelSenderDept} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-medium"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="bg-slate-800 text-white">
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* ใครเป็นคนเอางานมาส่ง (ดึงรายชื่อตามแผนกที่เลือก) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t.labelSenderName} ({department}) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={isCustomSender ? '__custom__' : senderName}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomSender(true);
                      } else {
                        setIsCustomSender(false);
                        setSenderName(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    {departmentSenders.length > 0 ? (
                      departmentSenders.map((emp) => (
                        <option key={emp.empId || emp.name} value={emp.displayName} className="bg-slate-800 text-white">
                          {emp.displayName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled className="bg-slate-800 text-slate-500">
                        -- ไม่มีรายชื่อในระบบ --
                      </option>
                    )}
                    <option value="__custom__" className="bg-slate-800 text-amber-300 font-semibold">
                      + ระบุชื่อเอง (ไม่อยู่ในรายชื่อ)
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>

                {isCustomSender && (
                  <div className="relative mt-2">
                    <input
                      type="text"
                      required
                      placeholder="พิมพ์ชื่อและรหัสพนักงานผู้ส่ง..."
                      value={customSenderName}
                      onChange={(e) => setCustomSenderName(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                )}
              </div>

              {/* หมายเลขตู้สินค้า / ลังใส่ชิ้นงาน (เชื่อมโยงกับแผนการผลิต Planning) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                    <Box className="w-4 h-4 text-orange-400" />
                    <span>{t.labelContainerNo}</span>
                    <span className="text-rose-400">*</span>
                  </label>

                  {containerMode === 'PLAN' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setContainerMode('CUSTOM');
                        setContainerNo(customContainerText);
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 hover:underline font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{lang === 'my' ? 'စိတ်ကြိုက်ထည့်မည်' : 'ระบุตู้/ลังอื่นเอง'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setContainerMode('PLAN');
                        const p =
                          visiblePlans.find((x) => makeContainerKey(x) === selectedPlanContainerKey) ||
                          visiblePlans[0];
                        if (p) {
                          setSelectedPlanContainerKey(makeContainerKey(p));
                          setContainerNo(p.name);
                        }
                      }}
                      className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center space-x-1 hover:underline font-medium"
                    >
                      <Layers className="w-3 h-3" />
                      <span>{lang === 'my' ? 'အစီအစဉ်မှရွေးမည်' : 'เลือกจากแผนผลิต'}</span>
                    </button>
                  )}
                </div>

                {containerMode === 'PLAN' ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <select
                        value={currentPlanContainer ? makeContainerKey(currentPlanContainer) : selectedPlanContainerKey}
                        onChange={(e) => handleSelectPlanContainer(e.target.value)}
                        className="w-full bg-slate-800/90 border border-orange-500/50 rounded-xl pl-10 pr-9 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold appearance-none cursor-pointer"
                      >
                        {visiblePlans.map((plan) => {
                          const planKey = makeContainerKey(plan);
                          return (
                            <option key={planKey} value={planKey} className="bg-slate-900 text-white py-1">
                              📦 {plan.name}{plan.date ? ` [${plan.date}]` : ''} ({plan.items.length} {lang === 'my' ? 'ခု အစီအစဉ်' : 'รายการตามแผน'})
                            </option>
                          );
                        })}
                        <option value="__custom__" className="bg-slate-900 text-amber-300 font-semibold">
                          {lang === 'my'
                            ? '✏️ + အခြား ကွန်တိန်နာ/ဘောက်စ် ကိုယ်တိုင်ရိုက်ထည့်မည်'
                            : '✏️ + ระบุตู้/ลังสินค้าอื่นด้วยตนเอง (นอกแผน)'}
                        </option>
                      </select>
                      <Box className="w-4 h-4 text-orange-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>

                    {/* Quick selection chips for active/visible containers */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] text-slate-400 font-medium mr-1">
                        {lang === 'my' ? 'အမြန်ရွေးချယ်:' : 'ตู้ด่วน:'}
                      </span>
                      {visiblePlans.slice(0, 5).map((plan) => {
                        const planKey = makeContainerKey(plan);
                        const isSelected =
                          currentPlanContainer && makeContainerKey(currentPlanContainer) === planKey;
                        return (
                          <button
                            key={planKey}
                            type="button"
                            onClick={() => handleSelectPlanContainer(planKey)}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                              isSelected
                                ? 'bg-orange-500 text-white font-bold shadow-sm shadow-orange-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
                            }`}
                          >
                            {plan.name}{plan.date ? ` (${plan.date})` : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder={t.placeholderContainerNo}
                        value={containerNo}
                        onChange={(e) => {
                          setContainerNo(e.target.value);
                          setCustomContainerText(e.target.value);
                        }}
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-medium"
                      />
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                    <p className="text-[11px] text-amber-400/90">
                      * กำลังระบุตู้/ลังเองด้วยตนเอง (หากเป็นตู้ส่งออกตามแผน แนะนำให้กด "เลือกจากแผนผลิต")
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* การถ่ายรูปเก็บหลักฐานร่วม (ใบส่งมอบ 1 ใบ + รูปกองงาน/รถเข็น 1 รูป) */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-orange-400" />
                <span>{t.step3Title} ({lang === 'my' ? 'ဓာတ်ပုံ ၂ ပုံ ရိုက်ပါ' : 'ถ่ายรูปหลักฐาน 2 จุด'})</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 📸 1. รูปถ่ายใบส่งมอบงาน */}
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-orange-300 flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.photo1Title} <span className="text-rose-400">*</span></span>
                    </label>
                    {slipPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setSlipFile(null);
                          setSlipPreview(null);
                        }}
                        className="text-[11px] text-rose-400 hover:underline flex items-center space-x-1"
                      >
                        <X className="w-3 h-3" />
                        <span>{lang === 'my' ? 'ဖျက်မည်' : 'ลบรูป'}</span>
                      </button>
                    )}
                  </div>

                  <input
                    ref={slipInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleSlipChange}
                    className="hidden"
                  />

                  {slipPreview ? (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-600 bg-black/40 aspect-video flex items-center justify-center">
                      <img
                        src={slipPreview}
                        alt="ใบส่งมอบงาน"
                        className="w-full h-full object-cover"
                      />
                      <div
                        onClick={() => slipInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs space-x-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{t.photoChange}</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => slipInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-600 hover:border-orange-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/80 transition-all aspect-video"
                    >
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mb-2">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-slate-200">
                        {t.photoTapCamera}
                      </span>
                    </div>
                  )}
                </div>

                {/* 📸 2. รูปถ่ายตัวชิ้นงาน / ตู้สินค้า / รถเข็น */}
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-orange-300 flex items-center space-x-1.5">
                      <Package className="w-3.5 h-3.5" />
                      <span>{t.photo2Title} <span className="text-rose-400">*</span></span>
                    </label>
                    {partPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setPartFile(null);
                          setPartPreview(null);
                        }}
                        className="text-[11px] text-rose-400 hover:underline flex items-center space-x-1"
                      >
                        <X className="w-3 h-3" />
                        <span>{lang === 'my' ? 'ဖျက်မည်' : 'ลบรูป'}</span>
                      </button>
                    )}
                  </div>

                  <input
                    ref={partInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePartChange}
                    className="hidden"
                  />

                  {partPreview ? (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-600 bg-black/40 aspect-video flex items-center justify-center">
                      <img
                        src={partPreview}
                        alt="ตัวชิ้นงานจริง"
                        className="w-full h-full object-cover"
                      />
                      <div
                        onClick={() => partInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs space-x-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{t.photoChange}</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => partInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-600 hover:border-orange-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/80 transition-all aspect-video"
                    >
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mb-2">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-slate-200">
                        {t.photoTapCamera}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: รายการชิ้นงานในใบส่งมอบนี้ (Multi-Item Part & Model) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                  <Package className="w-5 h-5 text-orange-400" />
                  <span>
                    {lang === 'my' 
                      ? `၂။ ပစ္စည်းစာရင်း (${items.length} မျိုး, စုစုပေါင်း ${totalQuantity} ခု)` 
                      : `2. รายการชิ้นงานในใบนี้ (${items.length} รายการ, รวมทั้งหมด ${totalQuantity} ชิ้น)`}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'my'
                    ? 'ပစ္စည်းတစ်ခုစီကို သီးခြားကတ်အဖြစ် ခွဲပေးမည်ဖြစ်၍ သီးခြားစီ ချိတ်ဆွဲဆေးမှုတ်နိုင်သည်'
                    : 'แต่ละรายการจะถูกแยกเป็นการ์ดติดตามอิสระ เพื่อให้เลือกแขวนเบอร์แฮงค์เกอร์และส่งออกแยกกันได้'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'my' ? '+ နောက်ထပ် ပစ္စည်းထည့်မည်' : '+ เพิ่มรายการชิ้นงานในใบนี้'}</span>
              </button>
            </div>

            {/* รายการชิ้นงานแต่ละตัว */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <ItemCardRow
                  key={item.id}
                  item={item}
                  index={index}
                  totalItems={items.length}
                  planItems={currentPlanContainer?.items || []}
                  planContainerName={currentPlanContainer?.name}
                  planContainerId={currentPlanContainer?.id}
                  cancelledItemIds={cancelledItemIds}
                  onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                  onRemove={() => handleRemoveItem(item.id)}
                  lang={lang}
                  t={t}
                />
              ))}
            </div>

            {/* ปุ่มเพิ่มรายการตัวใหญ่ด้านล่าง */}
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-3.5 rounded-2xl border-2 border-dashed border-orange-500/40 hover:border-orange-400 bg-orange-950/10 hover:bg-orange-950/25 text-orange-300 hover:text-orange-200 font-semibold text-sm transition-all flex items-center justify-center space-x-2 group"
            >
              <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 group-hover:scale-110 flex items-center justify-center transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span>
                {lang === 'my'
                  ? `+ ဤစာရွက်တွင် နောက်ထပ် ပစ္စည်း/မော်ဒယ် ထည့်မည် (ယခု ${items.length} မျိုးရှိပြီ)`
                  : `+ เพิ่มรายการชิ้นงาน/โมเดลอื่นในใบส่งมอบนี้ (ตอนนี้มี ${items.length} รายการ)`}
              </span>
            </button>
          </div>

          {/* Section 3: ผู้รับงานและหมายเหตุ */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 sm:p-6">
            <h3 className="text-base font-semibold text-white flex items-center space-x-2 mb-4 pb-2 border-b border-slate-700/80">
              <User className="w-5 h-5 text-orange-400" />
              <span>3. {lang === 'my' ? 'လက်ခံသူနှင့် မှတ်ချက်' : 'ผู้รับงาน (แผนกพ่นสี) และหมายเหตุ'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t.labelCoatingReceiver} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={isCustomReceiver ? '__custom__' : receiverName}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomReceiver(true);
                      } else {
                        setIsCustomReceiver(false);
                        setReceiverName(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  >
                    {POWDER_COAT_RECEIVERS.map((emp) => (
                      <option key={emp.empId || emp.name} value={emp.displayName} className="bg-slate-800 text-white">
                        {emp.displayName}
                      </option>
                    ))}
                    <option value="__custom__" className="bg-slate-800 text-amber-300 font-semibold">
                      + ระบุชื่อเอง (ไม่อยู่ในรายชื่อ)
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>

                {isCustomReceiver && (
                  <div className="relative mt-2">
                    <input
                      type="text"
                      required
                      placeholder="พิมพ์ชื่อเจ้าหน้าที่พ่นสีผู้รับงาน..."
                      value={customReceiverName}
                      onChange={(e) => setCustomReceiverName(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t.labelNotes}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.placeholderNotes}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {lang === 'my' 
                ? `စုစုပေါင်း ပစ္စည်း ${items.length} မျိုး၊ အရေအတွက် ${totalQuantity} ခု` 
                : `สรุป: มีทั้งหมด ${items.length} รายการโมเดล, รวมชิ้นงาน ${totalQuantity} ชิ้น`}
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onCancel}
                className="w-1/2 sm:w-auto px-6 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                {t.btnCancel}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{uploadStatus || (lang === 'my' ? 'သိမ်းဆည်းနေသည်...' : 'กำลังบันทึก...')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {items.length > 1
                        ? (lang === 'my' ? `မှတ်တမ်းတင်မည် (${items.length} မျိုး ခွဲထုတ်မည်)` : `บันทึกรับเข้างาน (${items.length} รายการ - แยกการ์ด)`)
                        : t.btnSubmitJob}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-component แสดงแถวรายการชิ้นงานแต่ละตัว
interface ItemCardRowProps {
  item: ReceiveJobItem;
  index: number;
  totalItems: number;
  planItems?: PlanItem[];
  planContainerName?: string;
  planContainerId?: string;
  cancelledItemIds?: Set<string>;
  onUpdate: (updates: Partial<ReceiveJobItem>) => void;
  onRemove: () => void;
  lang: string;
  t: any;
}

const ItemCardRow: React.FC<ItemCardRowProps> = ({
  item,
  index,
  totalItems,
  planItems = [],
  planContainerName,
  planContainerId,
  cancelledItemIds,
  onUpdate,
  onRemove,
  lang,
  t,
}) => {
  const checkIsCancelled = (model: string) => {
    if (!planContainerId || !model || !cancelledItemIds || cancelledItemIds.size === 0) return false;
    const key = makePlanItemKey(planContainerId, model);
    return cancelledItemIds.has(key) || cancelledItemIds.has(normalizeClosedItemId(key));
  };

  const isCurrentModelCancelled = checkIsCancelled(item.modelPartNo || item.modelSearch);

  // กรองโมเดลในตู้ตามคำค้นหา
  const matchedPlanItems = useMemo(() => {
    if (!planItems || planItems.length === 0) return [];
    if (!item.modelSearch) return planItems;
    const q = item.modelSearch.toLowerCase();
    return planItems.filter((p) => p.modelPartNo.toLowerCase().includes(q));
  }, [planItems, item.modelSearch]);

  const filteredModels = useMemo(() => {
    if (!item.modelSearch) return MODELS_PART_NO.slice(0, 50);
    const q = item.modelSearch.toLowerCase();
    return MODELS_PART_NO.filter((m) => m.toLowerCase().includes(q)).slice(0, 50);
  }, [item.modelSearch]);

  return (
    <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 relative transition-all hover:border-slate-600 shadow-md">
      {/* Header ของแต่ละรายการ */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 font-bold text-sm flex items-center justify-center border border-orange-500/30">
            #{index + 1}
          </span>
          <span className="text-sm font-bold text-white">
            {lang === 'my' ? `ပစ္စည်း စာရင်း #${index + 1}` : `รายการที่ ${index + 1}`}
          </span>
          {item.modelPartNo && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-orange-300 border border-slate-700">
              {item.modelPartNo}
            </span>
          )}
        </div>

        {totalItems > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 px-2.5 py-1.5 rounded-lg border border-rose-800/50 flex items-center space-x-1.5 transition-colors"
            title="ลบรายการนี้"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{lang === 'my' ? 'ဖျက်မည်' : 'ลบรายการนี้'}</span>
          </button>
        )}
      </div>

      {/* Inputs: Model, Part Name, Quantity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Model / Part No. (Combobox ค้นหาได้จากแผนผลิตตู้ หรือ 2,000+ รายการ) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t.labelModelPartNo} <span className="text-rose-400">*</span>
            </label>
            {planContainerName && (
              <span className="text-[10px] text-orange-300/90 font-medium">
                {lang === 'my' ? 'ကွန်တိန်နာ:' : 'ตู้:'} {planContainerName}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={lang === 'my' ? 'ရှာဖွေရန် ဥပမာ HA410, AM101...' : 'พิมพ์ค้นหา เช่น HA410, AM101...'}
              value={item.modelSearch || item.modelPartNo}
              onFocus={() => onUpdate({ isModelDropdownOpen: true })}
              onChange={(e) => {
                onUpdate({
                  modelSearch: e.target.value,
                  modelPartNo: e.target.value,
                  isModelDropdownOpen: true,
                });
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {(item.modelSearch || item.modelPartNo) && (
              <button
                type="button"
                onClick={() => {
                  onUpdate({ modelSearch: '', modelPartNo: '', isModelDropdownOpen: false });
                }}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* แจ้งเตือนกรณีโมเดลนี้ถูกฝ่ายวางแผนยกเลิกการผลิต */}
          {isCurrentModelCancelled && (
            <div className="mt-2.5 p-3 rounded-xl bg-rose-950/90 border border-rose-600/80 text-rose-200 text-xs flex items-start space-x-2.5 shadow-lg animate-pulse">
              <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300 block">
                  {lang === 'my'
                    ? `🚫 သတိပေးချက်: ဤမော်ဒယ်ကို ${planContainerName} ကွန်တိန်နာတွင် ထုတ်လုပ်မှု ဖျက်သိမ်းထားသည်!`
                    : `🚫 แจ้งเตือน: ฝ่ายวางแผนยกเลิกการผลิตโมเดลนี้ในตู้ ${planContainerName}!`}
                </span>
                <span className="text-[11px] text-rose-300/80 leading-relaxed block mt-0.5">
                  {lang === 'my'
                    ? 'ဆေးမှုတ်ဌာနသို့ မလက်ခံပါနှင့်။ အစီအစဉ်ဌာနနှင့် အရင်စစ်ဆေးပါ။'
                    : 'ห้ามรับเข้าพ่นสีโดยพลการ กรุณาตรวจสอบกับฝ่ายวางแผนก่อนดำเนินการ'}
                </span>
              </div>
            </div>
          )}

          {/* Dropdown list */}
          {item.isModelDropdownOpen && (
            <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
              <div className="p-2 text-xs text-slate-400 border-b border-slate-800 flex justify-between bg-slate-950 sticky top-0 z-10">
                <span>
                  {matchedPlanItems.length > 0
                    ? (lang === 'my' ? `ကွန်တိန်နာ အစီအစဉ်: ${matchedPlanItems.length} ခု` : `โมเดลในแผนตู้: ${matchedPlanItems.length} รายการ`)
                    : (lang === 'my' ? `${filteredModels.length} ခု တွေ့ရှိသည်` : `พบ ${filteredModels.length} รายการ`)}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdate({ isModelDropdownOpen: false })}
                  className="text-orange-400 hover:underline"
                >
                  {lang === 'my' ? 'ပိတ်မည်' : 'ปิด'}
                </button>
              </div>

              {/* 🌟 1. โมเดลตามแผนผลิตของตู้สินค้าที่เลือก */}
              {matchedPlanItems.length > 0 && (
                <div>
                  <div className="bg-orange-950/50 border-b border-orange-500/30 px-3 py-1.5 text-[11px] font-bold text-orange-300 flex items-center justify-between sticky top-8 z-10">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      <span>รายการตามแผนตู้ {planContainerName}</span>
                    </span>
                    <span className="text-[10px] text-orange-400/80 font-normal">คลิกเลือกพร้อมตั้งยอด</span>
                  </div>
                  {matchedPlanItems.map((p) => {
                    const isCancelled = checkIsCancelled(p.modelPartNo);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          onUpdate({
                            modelPartNo: p.modelPartNo,
                            modelSearch: p.modelPartNo,
                            isModelDropdownOpen: false,
                            quantity: item.quantity === 1 || !item.quantity ? p.planQty : item.quantity,
                          });
                        }}
                        className={`px-3.5 py-2 text-xs cursor-pointer transition-colors flex items-center justify-between border-b border-slate-800/60 ${
                          isCancelled
                            ? 'bg-rose-950/30 hover:bg-rose-950/50 text-rose-200'
                            : 'bg-orange-950/15 hover:bg-orange-500/20 text-slate-100 hover:text-orange-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`font-mono font-bold ${isCancelled ? 'line-through text-rose-400' : 'text-orange-300'}`}>
                            {p.modelPartNo}
                          </span>
                          {isCancelled && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700">
                              🚫 แผนกวางแผนยกเลิกผลิต
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isCancelled 
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-700/60'
                              : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                          }`}>
                            {isCancelled ? 'ยกเลิก' : `เป้า: ${p.planQty} ชิ้น`}
                          </span>
                          {item.modelPartNo === p.modelPartNo && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. โมเดลทั้งหมดในระบบ (Master Catalog) */}
              {filteredModels.length > 0 ? (
                <div>
                  {matchedPlanItems.length > 0 && (
                    <div className="bg-slate-950 px-3 py-1.5 text-[10px] font-semibold text-slate-400 border-b border-slate-800">
                      โมเดลทั้งหมดในระบบ (Master Catalog)
                    </div>
                  )}
                  {filteredModels.map((m) => (
                    <div
                      key={m}
                      onClick={() => {
                        onUpdate({
                          modelPartNo: m,
                          modelSearch: m,
                          isModelDropdownOpen: false,
                        });
                      }}
                      className="px-3.5 py-2 text-xs text-slate-200 hover:bg-orange-600/30 hover:text-orange-300 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <span className="font-mono">{m}</span>
                      {item.modelPartNo === m && <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />}
                    </div>
                  ))}
                </div>
              ) : matchedPlanItems.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center">
                  ไม่พบในรายการ แต่สามารถพิมพ์ชื่อใหม่ด้านบนได้เลย
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* ชิ้นส่วน (Part) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            {lang === 'my' ? 'အစိတ်အပိုင်း (PART)' : 'Part / ชิ้นส่วนไหน'} <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <select
              value={item.partName}
              onChange={(e) => onUpdate({ partName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              {PART_TYPES.map((pt) => (
                <option key={pt} value={pt} className="bg-slate-800 text-white">
                  {getPartTypeLabel(pt, lang)}
                </option>
              ))}
              <option value="อื่นๆ" className="bg-slate-800 text-white">
                {lang === 'my' ? '+ ကိုယ်တိုင်ရိုက်ထည့်မည် (အခြား)' : '+ ระบุเอง (อื่นๆ)'}
              </option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {item.partName === 'อื่นๆ' && (
            <input
              type="text"
              placeholder={lang === 'my' ? 'အစိတ်အပိုင်းအမည် ရိုက်ထည့်ပါ...' : 'ระบุชื่อชิ้นส่วน...'}
              value={item.customPartName}
              onChange={(e) => onUpdate({ customPartName: e.target.value })}
              className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
            />
          )}
        </div>

        {/* จำนวนชิ้น (Quantity with Stepper & Quick Chips) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
            <span>{t.labelQuantity} <span className="text-rose-400">*</span></span>
            <span className="text-emerald-400 font-bold">{item.quantity || 0} {t.pieceUnit}</span>
          </label>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => {
                const current = typeof item.quantity === 'number' ? item.quantity : 1;
                onUpdate({ quantity: Math.max(1, current - 1) });
              }}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-700 active:bg-slate-600 text-white font-bold text-base flex items-center justify-center border border-slate-700 shadow shrink-0"
              title="ลด 1"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              required
              value={item.quantity}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  onUpdate({ quantity: '' });
                } else {
                  const parsed = parseInt(val, 10);
                  onUpdate({ quantity: isNaN(parsed) ? '' : Math.max(1, parsed) });
                }
              }}
              onBlur={() => {
                if (!item.quantity || item.quantity < 1) {
                  onUpdate({ quantity: 1 });
                }
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-center text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const current = typeof item.quantity === 'number' ? item.quantity : 0;
                onUpdate({ quantity: current + 1 });
              }}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-700 active:bg-slate-600 text-white font-bold text-base flex items-center justify-center border border-slate-700 shadow shrink-0"
              title="เพิ่ม 1"
            >
              +
            </button>
          </div>

          {/* Quick chips */}
          <div className="flex items-center space-x-1 mt-1.5 overflow-x-auto pb-0.5">
            <span className="text-[10px] text-slate-400 mr-0.5">{lang === 'my' ? 'အမြန်:' : 'ด่วน:'}</span>
            {[1, 2, 4, 5, 10, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onUpdate({ quantity: num })}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold border transition-colors ${
                  item.quantity === num
                    ? 'bg-orange-500 text-white border-orange-400'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Selector for this specific item */}
      <div className="mt-3.5 pt-3 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs text-slate-400 flex items-center space-x-1.5">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>{lang === 'my' ? 'ဤပစ္စည်း၏ အရေးကြီးမှု အဆင့်:' : 'ระดับความเร่งด่วนของรายการนี้:'}</span>
        </span>

        <div className="grid grid-cols-3 gap-2">
          {/* NORMAL */}
          <button
            type="button"
            onClick={() => onUpdate({ priority: 'NORMAL' })}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              item.priority === 'NORMAL'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40 shadow'
                : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{t.priorityNormal}</span>
          </button>

          {/* HIGH */}
          <button
            type="button"
            onClick={() => onUpdate({ priority: 'HIGH' })}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              item.priority === 'HIGH'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 ring-1 ring-amber-500/40 shadow'
                : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{t.priorityHigh}</span>
          </button>

          {/* URGENT */}
          <button
            type="button"
            onClick={() => onUpdate({ priority: 'URGENT' })}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              item.priority === 'URGENT'
                ? 'bg-rose-950/90 border-rose-500 text-rose-200 ring-1 ring-rose-500/50 shadow animate-pulse'
                : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>{t.priorityUrgent}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
