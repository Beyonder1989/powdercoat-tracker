import React, { useState, useRef, useMemo } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle, X, Search, ChevronDown, Calendar, Clock, User, Package, Building2, Hash, FileText } from 'lucide-react';
import { DEPARTMENTS, PART_TYPES, MODELS_PART_NO } from '../data/masterData';
import { getEmployeesByDepartment, POWDER_COAT_RECEIVERS } from '../data/employeeData';
import { uploadEvidenceImage, createJob } from '../lib/supabase';
import { PowderCoatJob } from '../types';

interface ReceiveJobFormProps {
  onSuccess: (newJob: PowderCoatJob) => void;
  onCancel: () => void;
}

export const ReceiveJobForm: React.FC<ReceiveJobFormProps> = ({ onSuccess, onCancel }) => {
  // Form states
  const [department, setDepartment] = useState<string>('Laser(LS)');
  const [modelPartNo, setModelPartNo] = useState<string>('');
  const [partName, setPartName] = useState<string>('กันชนหน้า');
  const [customPartName, setCustomPartName] = useState<string>('');
  
  // Senders list based on department
  const initialSenders = getEmployeesByDepartment('Laser(LS)');
  const [senderName, setSenderName] = useState<string>(initialSenders[0]?.displayName || '');
  const [isCustomSender, setIsCustomSender] = useState<boolean>(false);
  const [customSenderName, setCustomSenderName] = useState<string>('');

  const [containerNo, setContainerNo] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  // Receivers in Powder Coat
  const [receiverName, setReceiverName] = useState<string>(POWDER_COAT_RECEIVERS[0]?.displayName || 'สุรวุฒิ กระโพธิ์ (ปอนด์) (600096)');
  const [isCustomReceiver, setIsCustomReceiver] = useState<boolean>(false);
  const [customReceiverName, setCustomReceiverName] = useState<string>('');

  const [notes, setNotes] = useState<string>('');

  // Photos
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  const [partFile, setPartFile] = useState<File | null>(null);
  const [partPreview, setPartPreview] = useState<string | null>(null);

  // Search combobox for Model/Part No.
  const [modelSearch, setModelSearch] = useState<string>('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState<boolean>(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File input refs
  const slipInputRef = useRef<HTMLInputElement>(null);
  const partInputRef = useRef<HTMLInputElement>(null);

  // Filtered models for quick combobox
  const filteredModels = useMemo(() => {
    if (!modelSearch) return MODELS_PART_NO.slice(0, 50);
    const q = modelSearch.toLowerCase();
    return MODELS_PART_NO.filter((m) => m.toLowerCase().includes(q)).slice(0, 50);
  }, [modelSearch]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const effectivePartNo = modelPartNo || modelSearch;
    if (!effectivePartNo.trim()) {
      setErrorMessage('กรุณาเลือกหรือระบุ Model / Part No.');
      return;
    }
    if (!containerNo.trim()) {
      setErrorMessage('กรุณาระบุ หมายเลขตู้สินค้า');
      return;
    }
    const effectiveSender = (isCustomSender ? customSenderName : senderName).trim();
    if (!effectiveSender) {
      setErrorMessage('กรุณาเลือกหรือระบุ ชื่อผู้นำของมาส่ง');
      return;
    }
    const effectiveReceiver = (isCustomReceiver ? customReceiverName : receiverName).trim();
    if (!effectiveReceiver) {
      setErrorMessage('กรุณาเลือกหรือระบุ ชื่อผู้รับงาน (แผนกพ่นสี)');
      return;
    }
    if (!slipFile) {
      setErrorMessage('กรุณาถ่ายรูปหรืออัปโหลด "ใบส่งมอบงาน" เพื่อเก็บเป็นหลักฐาน');
      return;
    }
    if (!partFile) {
      setErrorMessage('กรุณาถ่ายรูปหรืออัปโหลด "รูปตัวชิ้นงาน" เพื่อเก็บเป็นหลักฐาน');
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadStatus('กำลังอัปโหลดและบีบอัดรูปภาพใบส่งมอบงาน...');
      const slipUrl = await uploadEvidenceImage(slipFile, 'slips');

      setUploadStatus('กำลังอัปโหลดและบีบอัดรูปภาพตัวชิ้นงาน...');
      const partUrl = await uploadEvidenceImage(partFile, 'parts');

      setUploadStatus('กำลังบันทึกข้อมูลเข้าสู่ระบบ...');
      const finalPartName = partName === 'อื่นๆ' ? (customPartName || 'อื่นๆ') : partName;

      const newJob = await createJob({
        sender_department: department,
        model_part_no: effectivePartNo.trim(),
        part_name: finalPartName,
        sender_name: effectiveSender,
        container_no: containerNo.trim(),
        quantity: Number(quantity) || 1,
        delivery_slip_image_url: slipUrl,
        part_image_url: partUrl,
        status: 'RECEIVED',
        received_at: new Date().toISOString(),
        receiver_name: effectiveReceiver,
        notes: notes.trim(),
      });

      onSuccess(newJob);
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
              <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
                <span>บันทึกรับเข้าอะไหล่กันชน (แผนกพ่นสี)</span>
              </h2>
              <p className="text-orange-100 text-xs sm:text-sm mt-1">
                กรอกข้อมูลผู้ส่งมอบ รายละเอียด Model และถ่ายรูปหลักฐานทั้ง 2 จุด
              </p>
            </div>
            <div className="hidden sm:block text-right text-xs text-orange-200 bg-black/20 px-3 py-2 rounded-xl backdrop-blur">
              <div className="flex items-center space-x-1.5 justify-end">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date().toLocaleDateString('th-TH', { dateStyle: 'medium' })}</span>
              </div>
              <div className="flex items-center space-x-1.5 justify-end mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>เวลาปัจจุบันอัตโนมัติ</span>
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
          {/* Section 1: ข้อมูลการนำส่ง */}
          <div>
            <h3 className="text-base font-semibold text-white flex items-center space-x-2 mb-4 pb-2 border-b border-slate-800">
              <Building2 className="w-4 h-4 text-orange-400" />
              <span>1. ข้อมูลแผนกต้นทางและผู้ส่งมอบ</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* แผนกที่นำมาส่ง */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  แผนกผู้นำส่ง <span className="text-rose-400">*</span>
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
                  ชื่อผู้ส่งมอบงาน ({department}) <span className="text-rose-400">*</span>
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

              {/* หมายเลขตู้สินค้า */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  ตู้สินค้าหมายเลขใด <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="เช่น T-04, BOX-12, LOT-2026/11"
                    value={containerNo}
                    onChange={(e) => setContainerNo(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: รายละเอียด Model และ Part ชิ้นงาน */}
          <div>
            <h3 className="text-base font-semibold text-white flex items-center space-x-2 mb-4 pb-2 border-b border-slate-800">
              <Package className="w-4 h-4 text-orange-400" />
              <span>2. รายละเอียด Model และ ชิ้นส่วน (Part)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Model / Part No. (Combobox ค้นหาได้จาก 2,000+ รายการ) */}
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Model / Part No. <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="พิมพ์ค้นหา เช่น HA410, AM101, H001..."
                    value={modelSearch || modelPartNo}
                    onFocus={() => setIsModelDropdownOpen(true)}
                    onChange={(e) => {
                      setModelSearch(e.target.value);
                      setModelPartNo(e.target.value);
                      setIsModelDropdownOpen(true);
                    }}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-8 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  {modelSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setModelSearch('');
                        setModelPartNo('');
                      }}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dropdown list */}
                {isModelDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    <div className="p-2 text-xs text-slate-400 border-b border-slate-700/60 flex justify-between">
                      <span>พบ {filteredModels.length} รายการ</span>
                      <button
                        type="button"
                        onClick={() => setIsModelDropdownOpen(false)}
                        className="text-orange-400 hover:underline"
                      >
                        ปิด
                      </button>
                    </div>
                    {filteredModels.length > 0 ? (
                      filteredModels.map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            setModelPartNo(item);
                            setModelSearch(item);
                            setIsModelDropdownOpen(false);
                          }}
                          className="px-4 py-2.5 text-sm text-slate-200 hover:bg-orange-600/30 hover:text-orange-300 cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <span className="font-mono">{item}</span>
                          {modelPartNo === item && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-slate-400 text-center">
                        ไม่พบในรายการ แต่สามารถพิมพ์ชื่อใหม่ด้านบนได้เลย
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-1.5">
                  เลือกจากไฟล์ฐานข้อมูล หรือพิมพ์รหัสใหม่ได้อิสระ
                </p>
              </div>

              {/* ชิ้นส่วน (Part) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Part / ชิ้นส่วนไหน <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    {PART_TYPES.map((pt) => (
                      <option key={pt} value={pt} className="bg-slate-800 text-white">
                        {pt}
                      </option>
                    ))}
                    <option value="อื่นๆ" className="bg-slate-800 text-white">
                      + ระบุเอง (อื่นๆ)
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>

                {partName === 'อื่นๆ' && (
                  <input
                    type="text"
                    placeholder="ระบุชื่อชิ้นส่วน..."
                    value={customPartName}
                    onChange={(e) => setCustomPartName(e.target.value)}
                    className="w-full mt-2 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                )}
              </div>

              {/* จำนวนชิ้น */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  จำนวนชิ้นงาน (Quantity) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: การถ่ายรูปเก็บหลักฐาน (2 จุด) */}
          <div>
            <h3 className="text-base font-semibold text-white flex items-center space-x-2 mb-2 pb-2 border-b border-slate-800">
              <Camera className="w-4 h-4 text-orange-400" />
              <span>3. ถ่ายรูปหลักฐานเพื่อเก็บเข้าฐานข้อมูล (2 ภาพ)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              ระบบจะทำการบีบอัดภาพให้อัตโนมัติ เพื่อให้โหลดไวและไม่เปลืองพื้นที่จัดเก็บ
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 📸 1. รูปถ่ายใบส่งมอบงาน */}
              <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-orange-300 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4" />
                    <span>1. รูปถ่ายใบส่งมอบงาน</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  {slipPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setSlipFile(null);
                        setSlipPreview(null);
                      }}
                      className="text-xs text-rose-400 hover:underline flex items-center space-x-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>ลบรูป</span>
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
                      <span>คลิกเพื่อถ่ายใหม่</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => slipInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 hover:border-orange-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/80 transition-all aspect-video"
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">
                      กดเพื่อถ่ายรูปใบส่งมอบงาน
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      หรือเลือกรูปจากเครื่อง/แกลเลอรี
                    </span>
                  </div>
                )}
              </div>

              {/* 📸 2. รูปถ่ายตัวชิ้นงาน */}
              <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-orange-300 flex items-center space-x-1.5">
                    <Package className="w-4 h-4" />
                    <span>2. รูปถ่ายตัวชิ้นงานจริง</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  {partPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPartFile(null);
                        setPartPreview(null);
                      }}
                      className="text-xs text-rose-400 hover:underline flex items-center space-x-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>ลบรูป</span>
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
                      <span>คลิกเพื่อถ่ายใหม่</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => partInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 hover:border-orange-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/80 transition-all aspect-video"
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">
                      กดเพื่อถ่ายรูปตัวชิ้นงานจริง
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      หรือเลือกรูปจากเครื่อง/แกลเลอรี
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: ผู้รับงานและหมายเหตุ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                ผู้รับงานเข้าแผนกพ่นสี (POWDER COATING) <span className="text-rose-400">*</span>
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
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                หมายเหตุเพิ่มเติม (ถ้ามี)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="เช่น งานด่วน, รอสีดำเงา, มีรอยขีดข่วนก่อนพ่น"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{uploadStatus || 'กำลังบันทึก...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>ยืนยันรับเข้างานและบันทึกรูป</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
