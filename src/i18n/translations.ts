export type Language = 'th' | 'my';

export interface Translations {
  // Brand & Navbar
  brandTitle: string;
  brandTitleHighlight: string;
  brandSubtitle: string;
  tabAllJobs: string;
  tabReceive: string;
  tabPacking: string;
  btnNewJob: string;
  statsReceived: string;
  statsInProgress: string;
  statsCompleted: string;
  statsDispatched: string;

  // Priorities
  priorityUrgent: string;
  priorityHigh: string;
  priorityNormal: string;
  urgentBannerText: string;
  urgentNotice: string;
  supervisorPriorityLabel: string;
  btnUrgent: string;
  btnHigh: string;
  btnNormal: string;

  // Statuses
  statusReceived: string;
  statusInProgress: string;
  statusCompleted: string;
  statusDispatched: string;

  // Tracker & Cards
  searchPlaceholder: string;
  filterAll: string;
  filterReceived: string;
  filterInProgress: string;
  filterCompleted: string;
  filterDispatched: string;
  filterUrgentOnly: string;
  refresh: string;
  boxLabel: string;
  boxNotice: string;
  partLabel: string;
  qtyLabel: string;
  pieceUnit: string;
  senderDeptLabel: string;
  senderNameLabel: string;
  receiverNameLabel: string;
  packingReceiverLabel: string;
  receivedTimeLabel: string;
  slipPhotoLabel: string;
  partPhotoLabel: string;
  clickToZoom: string;
  btnStartCoating: string;
  btnFinishCoating: string;
  btnHandoverPacking: string;
  btnViewDetail: string;
  deleteJobConfirm: string;
  emptyTitle: string;
  emptySubtitle: string;

  // Receive Form
  formTitle: string;
  formSubtitle: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  labelSenderDept: string;
  labelSenderName: string;
  labelModelPartNo: string;
  labelPartName: string;
  labelContainerNo: string;
  placeholderContainerNo: string;
  labelQuantity: string;
  labelCoatingReceiver: string;
  labelNotes: string;
  placeholderNotes: string;
  btnSubmitJob: string;
  btnCancel: string;
  photo1Title: string;
  photo2Title: string;
  photoTapCamera: string;
  photoChange: string;

  // Job Detail Modal
  modalTitle: string;
  timelineTitle: string;
  timelineReceived: string;
  timelineStarted: string;
  timelineFinished: string;
  timelineDispatched: string;
  labelSentBy: string;
  labelReceivedBy: string;
  labelQcPassed: string;
  labelDispatchedTo: string;
  photosTitle: string;
  btnClose: string;
  btnOpenFullImage: string;

  // Dispatch Modal
  dispatchTitle: string;
  dispatchSubtitle: string;
  dispatchTargetDept: string;
  dispatchReceiverStaff: string;
  dispatchNotes: string;
  dispatchConfirmBtn: string;
}

export const translations: Record<Language, Translations> = {
  th: {
    // Brand & Navbar
    brandTitle: 'POWDER COAT',
    brandTitleHighlight: 'TRACKER',
    brandSubtitle: 'ระบบรับเข้าและส่งมอบงานพ่นสีอะไหล่กันชน (HAMER 4X4)',
    tabAllJobs: 'รายการงานทั้งหมด',
    tabReceive: 'ฟอร์มรับเข้า (ถ่ายรูป)',
    tabPacking: 'ส่งมอบแผนกแพ็คกิ้ง',
    btnNewJob: 'รับเข้างานใหม่',
    statsReceived: 'รอพ่น',
    statsInProgress: 'กำลังพ่น',
    statsCompleted: 'พ่นเสร็จ',
    statsDispatched: 'ส่งแพ็คกิ้งแล้ว',

    // Priorities
    priorityUrgent: 'ด่วนที่สุด! (Urgent)',
    priorityHigh: 'งานด่วน (High)',
    priorityNormal: 'ทั่วไป (Normal)',
    urgentBannerText: 'งานด่วนที่สุด ต้องรีบพ่นก่อน!',
    urgentNotice: 'ด่วนมาก',
    supervisorPriorityLabel: 'หัวหน้างานปรับความด่วน:',
    btnUrgent: '🔥 ด่วนมาก!',
    btnHigh: '⚡ งานด่วน',
    btnNormal: 'ปกติ',

    // Statuses
    statusReceived: 'รับเข้าแล้ว (รอพ่น)',
    statusInProgress: 'กำลังพ่นสี (In Progress)',
    statusCompleted: 'พ่นสีเสร็จสมบูรณ์',
    statusDispatched: 'ส่งมอบแผนกแพ็คกิ้งแล้ว',

    // Tracker & Cards
    searchPlaceholder: 'ค้นหา: ตู้สินค้า, Model, Part, ชื่อผู้ส่ง, แผนก, รหัสงาน...',
    filterAll: 'ทั้งหมด',
    filterReceived: 'รอพ่นสี',
    filterInProgress: 'กำลังพ่นสี',
    filterCompleted: 'พ่นสีเสร็จแล้ว',
    filterDispatched: 'ส่งแพ็คกิ้งแล้ว',
    filterUrgentOnly: '🔥 เฉพาะงานด่วน',
    refresh: 'รีเฟรช',
    boxLabel: 'ตู้สินค้า',
    boxNotice: '📍 หมายเลขตู้สินค้า (BOX)',
    partLabel: 'ชิ้นงาน',
    qtyLabel: 'จำนวน',
    pieceUnit: 'ชิ้น',
    senderDeptLabel: 'แผนกผู้ส่ง',
    senderNameLabel: 'ผู้ส่งมอบ',
    receiverNameLabel: 'ผู้รับงาน',
    packingReceiverLabel: 'ผู้รับมอบ',
    receivedTimeLabel: 'เวลารับเข้า',
    slipPhotoLabel: 'ใบส่งมอบงาน',
    partPhotoLabel: 'ตัวชิ้นงานจริง',
    clickToZoom: 'คลิกเพื่อดูรูปขยาย',
    btnStartCoating: 'เริ่มพ่นสี',
    btnFinishCoating: 'พ่นสีเสร็จสมบูรณ์',
    btnHandoverPacking: 'ส่งมอบแผนกแพ็คกิ้ง',
    btnViewDetail: 'ดูรายละเอียด',
    deleteJobConfirm: 'คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?',
    emptyTitle: 'ไม่พบรายการงานพ่นสี',
    emptySubtitle: 'ลองเปลี่ยนคำค้นหา หรือกดปุ่ม "รับเข้างานใหม่" เพื่อเริ่มรับงาน',

    // Receive Form
    formTitle: 'ฟอร์มรับเข้าชิ้นงานพ่นสีใหม่',
    formSubtitle: 'บันทึกข้อมูลและหลักฐานภาพถ่ายสำหรับติดตามกระบวนการพ่นสี (HAMER 4X4)',
    step1Title: '1. ข้อมูลชิ้นงานและผู้ส่ง',
    step2Title: '2. กำหนดระดับความสำคัญ (ความด่วน)',
    step3Title: '3. ถ่ายรูปหลักฐาน (2 รูป)',
    step4Title: '4. ผู้รับงานและหมายเหตุ',
    labelSenderDept: 'แผนกผู้ส่งมอบงาน *',
    labelSenderName: 'พนักงานผู้ส่งมอบ *',
    labelModelPartNo: 'Model / Part No. (ค้นหาหรือพิมพ์เอง) *',
    labelPartName: 'ชื่อชิ้นงาน (Part Name) *',
    labelContainerNo: 'หมายเลขตู้สินค้า / ลังใส่ชิ้นงาน (Container / Box) *',
    placeholderContainerNo: 'เช่น BOX-A12, T-05, LOT-01',
    labelQuantity: 'จำนวนชิ้นงาน (Qty) *',
    labelCoatingReceiver: 'พนักงานช่างพ่นสีผู้รับงาน *',
    labelNotes: 'หมายเหตุเพิ่มเติม (ถ้ามี)',
    placeholderNotes: 'เช่น พ่นสีดำด้าน, เก็บขอบมุมพิเศษ, ตู้อบเบอร์ 2',
    btnSubmitJob: 'บันทึกรับเข้างานพ่นสี',
    btnCancel: 'ยกเลิก',
    photo1Title: 'รูปที่ 1: รูปใบส่งมอบงาน (Delivery Slip) *',
    photo2Title: 'รูปที่ 2: รูปตัวชิ้นงานจริง (Actual Part) *',
    photoTapCamera: 'แตะเพื่อถ่ายรูปด้วยกล้อง หรือเลือกไฟล์',
    photoChange: 'เปลี่ยนรูปภาพ',

    // Job Detail Modal
    modalTitle: 'รายละเอียดชิ้นงานและประวัติการทำงาน',
    timelineTitle: 'ประวัติและวันเวลารับเข้า - ส่งมอบ',
    timelineReceived: 'รับเข้าแผนกพ่นสี',
    timelineStarted: 'เริ่มกระบวนการพ่น',
    timelineFinished: 'พ่นสีเสร็จสมบูรณ์',
    timelineDispatched: 'ส่งต่อแผนกแพ็คกิ้ง',
    labelSentBy: 'ส่งโดย',
    labelReceivedBy: 'ผู้รับงาน',
    labelQcPassed: 'ตรวจผ่าน QC สี',
    labelDispatchedTo: 'ผู้รับ',
    photosTitle: 'รูปภาพหลักฐานในระบบ (คลิกที่ภาพเพื่อขยาย)',
    btnClose: 'ปิดหน้าต่าง',
    btnOpenFullImage: 'เปิดภาพเต็ม',

    // Dispatch Modal
    dispatchTitle: 'ส่งมอบชิ้นงานให้แผนกต่อไป',
    dispatchSubtitle: 'บันทึกข้อมูลการส่งต่องานไปยังแผนกแพ็คกิ้งหรือแผนกถัดไป',
    dispatchTargetDept: 'แผนกปลายทางที่รับมอบงาน *',
    dispatchReceiverStaff: 'พนักงานผู้รับมอบงาน *',
    dispatchNotes: 'หมายเหตุการส่งมอบ (ถ้ามี)',
    dispatchConfirmBtn: 'ยืนยันการส่งมอบงาน',
  },

  my: {
    // Brand & Navbar
    brandTitle: 'POWDER COAT',
    brandTitleHighlight: 'TRACKER',
    brandSubtitle: 'ဘမ်ဘာအစိတ်အပိုင်း ဆေးမှုတ်လက်ခံခြင်းနှင့် လွှဲပြောင်းခြင်းစနစ် (HAMER 4X4)',
    tabAllJobs: 'လုပ်ငန်းစဉ် အားလုံး',
    tabReceive: 'လက်ခံပုံစံ (ဓာတ်ပုံ)',
    tabPacking: 'ထုပ်ပိုးဌာနသို့ လွှဲပြောင်းရန်',
    btnNewJob: 'အလုပ်အသစ် လက်ခံမည်',
    statsReceived: 'စောင့်ဆိုင်း',
    statsInProgress: 'ဆေးမှုတ်ဆဲ',
    statsCompleted: 'ပြီးစီး',
    statsDispatched: 'ထုပ်ပိုးသို့ပို့ပြီး',

    // Priorities
    priorityUrgent: 'အရေးပေါ်! (Urgent)',
    priorityHigh: 'အရေးကြီး (High)',
    priorityNormal: 'ပုံမှန် (Normal)',
    urgentBannerText: 'အရေးပေါ်! ဦးစားပေး ဆေးမှုတ်ရမည်!',
    urgentNotice: 'အရေးပေါ်',
    supervisorPriorityLabel: 'ကြီးကြပ်သူ အဆင့်သတ်မှတ်ရန်:',
    btnUrgent: '🔥 အရေးပေါ်',
    btnHigh: '⚡ အရေးကြီး',
    btnNormal: 'ပုံမှန်',

    // Statuses
    statusReceived: 'လက်ခံပြီး (စောင့်ဆိုင်းဆဲ)',
    statusInProgress: 'ဆေးမှုတ်နေသည် (In Progress)',
    statusCompleted: 'ဆေးမှုတ်ပြီးစီးပါပြီ',
    statusDispatched: 'ထုပ်ပိုးဌာနသို့ လွှဲပြောင်းပြီး',

    // Tracker & Cards
    searchPlaceholder: 'ရှာဖွေရန်: သေတ္တာ၊ မော်ဒယ်၊ ပစ္စည်း၊ ပေးပို့သူ၊ နံပါတ်...',
    filterAll: 'အားလုံး',
    filterReceived: 'စောင့်ဆိုင်းဆဲ',
    filterInProgress: 'ဆေးမှုတ်နေသည်',
    filterCompleted: 'ပြီးစီးပါပြီ',
    filterDispatched: 'ထုပ်ပိုးသို့ပို့ပြီး',
    filterUrgentOnly: '🔥 အရေးပေါ် သီးသန့်',
    refresh: 'ပြန်စတင်',
    boxLabel: 'သေတ္တာ / ဘောက်စ်',
    boxNotice: '📍 သေတ္တာ / ဘောက်စ်အမှတ် (BOX)',
    partLabel: 'ပစ္စည်းအမည်',
    qtyLabel: 'အရေအတွက်',
    pieceUnit: 'ခု',
    senderDeptLabel: 'ပေးပို့သည့်ဌာန',
    senderNameLabel: 'ပေးပို့သူ',
    receiverNameLabel: 'လက်ခံသူ',
    packingReceiverLabel: 'လက်ခံသူ (ထုပ်ပိုး)',
    receivedTimeLabel: 'လက်ခံချိန်',
    slipPhotoLabel: 'လွှဲပြောင်းစာရွက် ဓာတ်ပုံ',
    partPhotoLabel: 'ပစ္စည်း အမှန်တကယ်',
    clickToZoom: 'ပုံကြီးကြည့်ရန် နှိပ်ပါ',
    btnStartCoating: 'ဆေးစတင်မှုတ်မည်',
    btnFinishCoating: 'ဆေးမှုတ်ပြီးစီးပါပြီ',
    btnHandoverPacking: 'ထုပ်ပိုးဌာနသို့ လွှဲပြောင်းမည်',
    btnViewDetail: 'အသေးစိတ်ကြည့်ရန်',
    deleteJobConfirm: 'ဤအလုပ်ကို ဖျက်ရန် သေချာပါသလား?',
    emptyTitle: 'ဆေးမှုတ်ရန် အလုပ်မရှိသေးပါ',
    emptySubtitle: 'စာလုံးအသစ်ဖြင့် ရှာပါ သို့မဟုတ် "အလုပ်အသစ် လက်ခံမည်" ကို နှိပ်ပါ',

    // Receive Form
    formTitle: 'ဆေးမှုတ်ရန် ပစ္စည်းအသစ် လက်ခံပုံစံ',
    formSubtitle: 'ဆေးမှုတ်လုပ်ငန်းစဉ် ခြေရာခံရန် အချက်အလက်နှင့် ဓာတ်ပုံ မှတ်တမ်းတင်ပါ (HAMER 4X4)',
    step1Title: '၁။ ပစ္စည်းနှင့် ပေးပို့သူ အချက်အလက်',
    step2Title: '၂။ အရေးပေါ် အဆင့် သတ်မှတ်ချက်',
    step3Title: '၃။ သက်သေဓာတ်ပုံ (၂ ပုံ)',
    step4Title: '၄။ လက်ခံသူနှင့် မှတ်ချက်',
    labelSenderDept: 'ပေးပို့သည့် ဌာန *',
    labelSenderName: 'ပေးပို့သည့် ဝန်ထမ်း *',
    labelModelPartNo: 'မော်ဒယ် / ပစ္စည်းနံပါတ် (Model / Part No.) *',
    labelPartName: 'ပစ္စည်းအမည် (Part Name) *',
    labelContainerNo: 'သေတ္တာ / ဘောက်စ်အမှတ် (Container / Box) *',
    placeholderContainerNo: 'ဥပမာ BOX-A12, T-05, LOT-01',
    labelQuantity: 'ပစ္စည်း အရေအတွက် (Qty) *',
    labelCoatingReceiver: 'လက်ခံသည့် ဆေးမှုတ်ဝန်ထမ်း *',
    labelNotes: 'နောက်ထပ် မှတ်ချက် (ရှိလျှင်)',
    placeholderNotes: 'ဥပမာ အနက်ရောင်မှုတ်ရန်၊ အနားသတ်သေချာလုပ်ရန်',
    btnSubmitJob: 'ဆေးမှုတ်လက်ခံမှု သိမ်းဆည်းမည်',
    btnCancel: 'ပယ်ဖျက်မည်',
    photo1Title: 'ပုံ ၁: ပစ္စည်းလွှဲပြောင်းစာရွက် ဓာတ်ပုံ (Delivery Slip) *',
    photo2Title: 'ပုံ ၂: အမှန်တကယ် ပစ္စည်းဓာတ်ပုံ (Actual Part) *',
    photoTapCamera: 'ဓာတ်ပုံရိုက်ရန် သို့မဟုတ် ဖိုင်ရွေးရန် နှိပ်ပါ',
    photoChange: 'ဓာတ်ပုံ ပြောင်းမည်',

    // Job Detail Modal
    modalTitle: 'ပစ္စည်း အသေးစိတ်နှင့် လုပ်ငန်းမှတ်တမ်း',
    timelineTitle: 'လက်ခံခြင်းနှင့် လွှဲပြောင်းခြင်း အချိန်မှတ်တမ်း',
    timelineReceived: 'ဆေးမှုတ်ဌာနသို့ ရောက်ရှိ',
    timelineStarted: 'ဆေးစတင်မှုတ်ချိန်',
    timelineFinished: 'ဆေးမှုတ်ပြီးစီးချိန်',
    timelineDispatched: 'ထုပ်ပိုးဌာနသို့ လွှဲပြောင်းချိန်',
    labelSentBy: 'ပေးပို့သူ',
    labelReceivedBy: 'လက်ခံသူ',
    labelQcPassed: 'စစ်ဆေးမှု အောင်မြင်သည်',
    labelDispatchedTo: 'လက်ခံသူ',
    photosTitle: 'စနစ်အတွင်းရှိ သက်သေဓာတ်ပုံများ (ပုံကြီးကြည့်ရန် နှိပ်ပါ)',
    btnClose: 'ပိတ်မည်',
    btnOpenFullImage: 'ပုံအပြည့် ဖွင့်ပါ',

    // Dispatch Modal
    dispatchTitle: 'နောက်ဌာနသို့ ပစ္စည်းလွှဲပြောင်းပေးအပ်ခြင်း',
    dispatchSubtitle: 'ထုပ်ပိုးဌာနသို့ ပစ္စည်းလွှဲပြောင်းမှု အချက်အလက် မှတ်တမ်းတင်ပါ',
    dispatchTargetDept: 'လက်ခံမည့် ဌာန *',
    dispatchReceiverStaff: 'လက်ခံမည့် ဝန်ထမ်း *',
    dispatchNotes: 'လွှဲပြောင်းမှု မှတ်ချက် (ရှိလျှင်)',
    dispatchConfirmBtn: 'လွှဲပြောင်းမှု အတည်ပြုမည်',
  },
};
