export type Language = 'th' | 'my';

export interface Translations {
  // Brand & Navbar
  brandTitle: string;
  brandTitleHighlight: string;
  brandSubtitle: string;
  tabAllJobs: string;
  tabReceive: string;
  tabPacking: string;
  tabAnalytics: string;
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

  // Start Coating (Hanger & Process) Modal
  startCoatingModalTitle: string;
  startCoatingModalSubtitle: string;
  labelHangerNo: string;
  placeholderHangerNo: string;
  hangerRequiredAlert: string;
  labelCoatingType: string;
  coatingTypeEdpOnly: string;
  coatingTypeEdpOnlyDesc: string;
  coatingTypeEdpAndPowder: string;
  coatingTypeEdpAndPowderDesc: string;
  coatingTypePowderOnly: string;
  coatingTypePowderOnlyDesc: string;
  btnConfirmStartCoating: string;
  badgeHanger: string;
  badgeEdpOnly: string;
  badgeEdpAndPowder: string;
  badgePowderOnly: string;

  // Role & PIN Auth
  modeViewer: string;
  modeOperator: string;
  btnUnlock: string;
  btnLock: string;
  pinModalTitle: string;
  pinModalSubtitle: string;
  pinModalWrong: string;
  pinModalDefaultHint: string;
  pinModalClose: string;
  pinModalConfirm: string;
  pinChangeBtn: string;
  pinChangeTitle: string;
  pinChangeSuccess: string;
  readOnlyNotice: string;

  // Dispatch Photos & Analytics
  dispatchSlipPhoto: string;
  dispatchPartPhoto: string;
  dispatchPhotosRequiredAlert: string;
  incomingPhotosTitle: string;
  dispatchPhotosTitle: string;
  labelTargetDept: string;
  labelDuration: string;
  analyticsTitle: string;
  analyticsSubtitle: string;
  filterToday: string;
  filterYesterday: string;
  filterLast7Days: string;
  filterAllTime: string;
  kpiTotalCoated: string;
  kpiTotalHangers: string;
  kpiAvgTime: string;
  kpiReceived: string;
  kpiDispatched: string;
  kpiWipPending: string;
  wipWaiting: string;
  wipCoating: string;
  wipFinished: string;
  btnExportExcel: string;
  sectionCoatingProcess: string;
  sectionSenderDepts: string;
  sectionTargetDepts: string;
  dailyMovementTitle: string;
  colTracking: string;
  colModel: string;
  colBox: string;
  colHanger: string;
  colProcess: string;
  colTime: string;
  colDuration: string;
  colStatus: string;
}

export const translations: Record<Language, Translations> = {
  th: {
    // Brand & Navbar
    brandTitle: 'POWDER COAT',
    brandTitleHighlight: 'TRACKER',
    brandSubtitle: 'ระบบรับเข้าและส่งมอบงานพ่นสีอะไหล่กันชน (HAMER 4X4)',
    tabAllJobs: 'รายการงานทั้งหมด',
    tabReceive: 'ฟอร์มรับเข้า (ถ่ายรูป)',
    tabPacking: 'ส่งมอบงานออก',
    tabAnalytics: 'สถิติ & Analytics',
    btnNewJob: 'รับเข้างานใหม่',
    statsReceived: 'รอพ่น',
    statsInProgress: 'กำลังพ่น',
    statsCompleted: 'พ่นเสร็จ',
    statsDispatched: 'ส่งแพ็คกิ้งแล้ว',

    // Priorities
    priorityUrgent: 'ด่วนที่สุด! (Urgent)',
    priorityHigh: 'งานด่วน (High)',
    priorityNormal: 'งานทั่วไป (Normal)',
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

    // Start Coating (Hanger & Process) Modal
    startCoatingModalTitle: 'บันทึกขึ้นไลน์พ่นสี (แขวนแฮงค์เกอร์)',
    startCoatingModalSubtitle: 'เลือกหมายเลขแฮงค์เกอร์ และเลือกประเภทกระบวนการพ่นสี',
    labelHangerNo: 'เลือกหมายเลขแฮงค์เกอร์ (1 - 99) *',
    placeholderHangerNo: '-- แตะเพื่อเลือกหมายเลขแฮงค์เกอร์ (1 - 99) --',
    hangerRequiredAlert: 'กรุณาเลือกหมายเลขแฮงค์เกอร์ก่อนเริ่มงาน',
    labelCoatingType: 'ประเภทกระบวนการ (Coating Process) *',
    coatingTypeEdpOnly: 'EDP อย่างเดียว (ชุบกันสนิม)',
    coatingTypeEdpOnlyDesc: 'ชุบล้างผิวและลงบ่อ EDP ดำด้านกันสนิมเท่านั้น (ไม่เข้าห้องพ่นสีฝุ่น)',
    coatingTypeEdpAndPowder: 'EDP + พ่นสีฝุ่น (ครบระบบ)',
    coatingTypeEdpAndPowderDesc: 'ชุบ EDP รองพื้นกันสนิม + เข้าห้องพ่นสีฝุ่น Powder Coat อบความร้อน',
    coatingTypePowderOnly: 'พ่นสีฝุ่นอย่างเดียว (ไม่ชุบ EDP)',
    coatingTypePowderOnlyDesc: 'เข้าห้องพ่นสีฝุ่น Powder Coat และอบความร้อนโดยตรง ไม่ผ่านบ่อชุบ EDP',
    btnConfirmStartCoating: 'ยืนยันเริ่มขึ้นไลน์พ่นสี',
    badgeHanger: 'แฮงค์เกอร์',
    badgeEdpOnly: '💧 EDP อย่างเดียว',
    badgeEdpAndPowder: '✨ EDP + พ่นสีฝุ่น',
    badgePowderOnly: '🎨 พ่นสีฝุ่นอย่างเดียว',

    // Role & PIN Auth
    modeViewer: 'โหมดดูงาน (Viewer)',
    modeOperator: 'ช่างพ่นสี (ทำงานได้)',
    btnUnlock: 'ปลดล็อกช่าง',
    btnLock: 'ล็อกระบบ',
    pinModalTitle: 'ใส่รหัส PIN แผนกพ่นสี',
    pinModalSubtitle: 'เพื่อปลดล็อกสิทธิ์การรับงาน ปรับความด่วน และเปลี่ยนสถานะ',
    pinModalWrong: 'รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
    pinModalDefaultHint: 'รหัสเริ่มต้นคือ 1234',
    pinModalClose: 'ยกเลิก',
    pinModalConfirm: 'ยืนยันรหัส PIN',
    pinChangeBtn: 'เปลี่ยนรหัส PIN',
    pinChangeTitle: 'ตั้งรหัส PIN แผนกพ่นสีใหม่',
    pinChangeSuccess: 'เปลี่ยนรหัส PIN เรียบร้อยแล้ว',
    readOnlyNotice: 'โหมดดูงาน (คนนอกแผนก): ไม่สามารถแก้ไขหรือเปลี่ยนสถานะได้',

    // Dispatch Photos & Analytics
    dispatchSlipPhoto: 'ภาพถ่ายใบส่งมอบงานออก *',
    dispatchPartPhoto: 'ภาพถ่ายชิ้นงานตอนส่งมอบ *',
    dispatchPhotosRequiredAlert: 'กรุณาแนบภาพถ่ายใบส่งมอบและภาพชิ้นงานก่อนยืนยันส่งมอบ',
    incomingPhotosTitle: 'ภาพหลักฐานรับเข้า (ใบส่งมอบ + ชิ้นงานขาเข้า)',
    dispatchPhotosTitle: 'ภาพหลักฐานส่งมอบ (ใบส่งมอบออก + ชิ้นงานขาออก)',
    labelTargetDept: 'ส่งต่อไปยังแผนก',
    labelDuration: 'ระยะเวลาพ่นสี',
    analyticsTitle: 'แดชบอร์ดสรุปสถิติ & การเคลื่อนไหวของงาน',
    analyticsSubtitle: 'สรุปยอดพ่นสีรายวัน อัตราใช้แฮงค์เกอร์ และยอดงานคงค้างในแผนก (Real-time)',
    filterToday: 'วันนี้ (Today)',
    filterYesterday: 'เมื่อวาน',
    filterLast7Days: '7 วันล่าสุด',
    filterAllTime: 'ทั้งหมด',
    kpiTotalCoated: 'ชิ้นงานพ่นเสร็จ',
    kpiTotalHangers: 'แฮงค์เกอร์ที่ใช้',
    kpiAvgTime: 'เวลาเฉลี่ย/งาน',
    kpiReceived: 'ยอดรับเข้า',
    kpiDispatched: 'ยอดส่งมอบออก',
    kpiWipPending: 'งานค้างสะสมในแผนก',
    wipWaiting: 'รอเตรียมพ่น',
    wipCoating: 'อยู่บนไลน์พ่น',
    wipFinished: 'เสร็จรอส่ง',
    btnExportExcel: 'ส่งออกข้อมูล Excel / CSV',
    sectionCoatingProcess: 'สัดส่วนกระบวนการพ่นสี',
    sectionSenderDepts: 'แผนกต้นทางที่ส่งงานมามากที่สุด',
    sectionTargetDepts: 'แผนกปลายทางที่ส่งมอบออกไป',
    dailyMovementTitle: 'ตารางบันทึกความเคลื่อนไหวงวดงาน (Movement Audit Log)',
    colTracking: 'รหัสงาน',
    colModel: 'รุ่น / ชิ้นส่วน',
    colBox: 'ตู้สินค้า',
    colHanger: 'แฮงค์เกอร์',
    colProcess: 'กระบวนการ',
    colTime: 'เวลาเริ่ม - เสร็จ',
    colDuration: 'เวลาที่ใช้',
    colStatus: 'สถานะ',
  },

  my: {
    // Brand & Navbar
    brandTitle: 'POWDER COAT',
    brandTitleHighlight: 'TRACKER',
    brandSubtitle: 'ဘမ်ဘာအစိတ်အပိုင်း ဆေးမှုတ်လက်ခံခြင်းနှင့် လွှဲပြောင်းခြင်းစနစ် (HAMER 4X4)',
    tabAllJobs: 'လုပ်ငန်းစဉ် အားလုံး',
    tabReceive: 'လက်ခံပုံစံ (ဓာတ်ပုံ)',
    tabPacking: 'လွှဲပြောင်းပေးအပ်ခြင်း',
    tabAnalytics: 'စာရင်းအင်း & Analytics',
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

    // Start Coating (Hanger & Process) Modal
    startCoatingModalTitle: 'လိုင်းတင်ခြင်းနှင့် ဟန်းဂါးချိတ်ဆွဲခြင်း',
    startCoatingModalSubtitle: 'ဟန်းဂါးနံပါတ် ရွေးချယ်ပြီး ဆေးမှုတ်လုပ်ငန်းစဉ် ရွေးပါ',
    labelHangerNo: 'ဟန်းဂါးနံပါတ် ရွေးပါ (၁ - ၉၉) *',
    placeholderHangerNo: '-- ဟန်းဂါးနံပါတ် ရွေးချယ်ပါ (၁ - ၉၉) --',
    hangerRequiredAlert: 'ကျေးဇူးပြု၍ ဟန်းဂါးနံပါတ် ရွေးချယ်ပါ',
    labelCoatingType: 'ဆေးမှုတ်ခြင်း အမျိုးအစား (Process Type) *',
    coatingTypeEdpOnly: 'EDP သီးသန့် (သံချေးကာကွယ်ရည်)',
    coatingTypeEdpOnlyDesc: 'EDP သံချေးကာကွယ်ရည်ကန်သာ စိမ်ပါမည် (အမှုန့်ဆေးမမှုတ်ပါ)',
    coatingTypeEdpAndPowder: 'EDP + အမှုန့်ဆေးမှုတ် (စနစ်အပြည့်)',
    coatingTypeEdpAndPowderDesc: 'EDP သံချေးကာကွယ်ရည်စိမ်ပြီးနောက် Powder Coat အမှုန့်ဆေးမှုတ် မီးဖုတ်ပါမည်',
    coatingTypePowderOnly: 'အမှုန့်ဆေးသီးသန့် (EDP မစိမ်ပါ)',
    coatingTypePowderOnlyDesc: 'EDP ကန်မစိမ်ဘဲ Powder Coat အမှုန့်ဆေး တိုက်ရိုက်မှုတ်မီးဖုတ်ပါမည်',
    btnConfirmStartCoating: 'လိုင်းတင်ဆေးစတင်မည် အတည်ပြုပါ',
    badgeHanger: 'ဟန်းဂါး',
    badgeEdpOnly: '💧 EDP သီးသန့်',
    badgeEdpAndPowder: '✨ EDP + ဆေးမှုတ်',
    badgePowderOnly: '🎨 ဆေးမှုတ်သီးသန့်',

    // Role & PIN Auth
    modeViewer: 'ကြည့်ရှုသူ မုဒ် (Viewer)',
    modeOperator: 'ဆေးမှုတ်သူ မုဒ် (Operator)',
    btnUnlock: 'ခွင့်ပြုချက် ဖွင့်ရန်',
    btnLock: 'ပြန်လည် ပိတ်ဆို့ရန်',
    pinModalTitle: 'ဆေးမှုတ်ဌာန PIN နံပါတ် ရိုက်ထည့်ပါ',
    pinModalSubtitle: 'အလုပ်လက်ခံရန်၊ အရေးပေါ်အဆင့် ပြောင်းရန်နှင့် လုပ်ငန်းစဉ်ပြင်ဆင်ရန်',
    pinModalWrong: 'PIN နံပါတ် မှားယွင်းနေပါသည် ထပ်မံကြိုးစားပါ',
    pinModalDefaultHint: 'မူလ PIN နံပါတ်မှာ 1234 ဖြစ်သည်',
    pinModalClose: 'ပယ်ဖျက်မည်',
    pinModalConfirm: 'အတည်ပြုမည်',
    pinChangeBtn: 'PIN ပြောင်းရန်',
    pinChangeTitle: 'PIN အသစ် သတ်မှတ်ပါ',
    pinChangeSuccess: 'PIN ပြောင်းလဲပြီးပါပြီ',
    readOnlyNotice: 'ကြည့်ရှုရန်သာ: ပြင်ဆင်ခြင်းနှင့် အဆင့်ပြောင်းခြင်း မပြုလုပ်နိုင်ပါ',

    // Dispatch Photos & Analytics
    dispatchSlipPhoto: 'လွှဲပြောင်းလက်မှတ် ဓာတ်ပုံ *',
    dispatchPartPhoto: 'လွှဲပြောင်းပစ္စည်း ဓာတ်ပုံ *',
    dispatchPhotosRequiredAlert: 'ကျေးဇူးပြု၍ လွှဲပြောင်းလက်မှတ်နှင့် ပစ္စည်းဓာတ်ပုံ ထည့်သွင်းပါ',
    incomingPhotosTitle: 'အဝင် သက်သေဓာတ်ပုံများ (လက်ခံလွှာ + ပစ္စည်း)',
    dispatchPhotosTitle: 'အထွက် သက်သေဓာတ်ပုံများ (လွှဲပြောင်းလွှာ + ပစ္စည်း)',
    labelTargetDept: 'လွှဲပြောင်းမည့် ဌာန',
    labelDuration: 'ဆေးမှုတ်ကြာချိန်',
    analyticsTitle: 'စာရင်းအင်းနှင့် လုပ်ငန်းစဉ်လှုပ်ရှားမှု ဒက်ရှ်ဘုတ်',
    analyticsSubtitle: 'နေ့စဉ်ဆေးမှုတ်မှု၊ ဟန်းဂါးအသုံးပြုမှုနှင့် လက်ကျန်အလုပ်များ (Real-time)',
    filterToday: 'ယနေ့ (Today)',
    filterYesterday: 'မနေ့က',
    filterLast7Days: 'လွန်ခဲ့သော ၇ ရက်',
    filterAllTime: 'အားလုံး',
    kpiTotalCoated: 'ဆေးမှုတ်ပြီး ပစ္စည်း',
    kpiTotalHangers: 'သုံးခဲ့သော ဟန်းဂါး',
    kpiAvgTime: 'ပျမ်းမျှကြာချိန်',
    kpiReceived: 'အဝင်ပစ္စည်း',
    kpiDispatched: 'လွှဲပြောင်းပြီး',
    kpiWipPending: 'ဌာနတွင်း လက်ကျန်',
    wipWaiting: 'စောင့်ဆိုင်း',
    wipCoating: 'လိုင်းပေါ်ရှိ',
    wipFinished: 'လွှဲပြောင်းရန်စောင့်',
    btnExportExcel: 'Excel / CSV ထုတ်ယူမည်',
    sectionCoatingProcess: 'ဆေးမှုတ်လုပ်ငန်းစဉ် အချိုး',
    sectionSenderDepts: 'အများဆုံး ပို့ဆောင်သော ဌာနများ',
    sectionTargetDepts: 'အများဆုံး လက်ခံသော ဌာနများ',
    dailyMovementTitle: 'လုပ်ငန်းစဉ် လှုပ်ရှားမှု မှတ်တမ်းဇယား (Movement Audit Log)',
    colTracking: 'ကုဒ်',
    colModel: 'မော်ဒယ် / ပစ္စည်း',
    colBox: 'ပုံးနံပါတ်',
    colHanger: 'ဟန်းဂါး',
    colProcess: 'လုပ်ငန်းစဉ်',
    colTime: 'စတင် - ပြီးချိန်',
    colDuration: 'ကြာချိန်',
    colStatus: 'အခြေအနေ',
  },
};
