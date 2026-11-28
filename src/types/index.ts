export type JobStatus = 
  | 'RECEIVED'              // รับเข้าแล้ว รอดำเนินการ
  | 'IN_PROGRESS'           // กำลังพ่นสี
  | 'COMPLETED'             // พ่นสีเสร็จสมบูรณ์
  | 'DISPATCHED_TO_PACKING'; // ส่งมอบให้แผนกแพ็คกิ้งแล้ว

export type JobPriority = 
  | 'URGENT'   // ด่วนที่สุด / အရေးပေါ် (ไฟไหม้/เร่งด่วน)
  | 'HIGH'     // งานด่วน / အရေးကြီး
  | 'NORMAL';  // ปกติ / ပုံမှန်

export type CoatingType = 
  | 'EDP_ONLY'        // ชุบ EDP อย่างเดียว
  | 'EDP_AND_POWDER'  // ชุบ EDP + พ่นสีฝุ่น
  | 'POWDER_ONLY';    // พ่นสีฝุ่นอย่างเดียว (ไม่ชุบ EDP)

export interface PowderCoatJob {
  id: string;
  tracking_code: string;          // e.g. PC-261113-0001
  sender_department: string;      // แผนกที่นำมาส่ง เช่น Laser(LS), Bending(BD), Welding(WD)
  model_part_no: string;          // Part No. / Model เช่น HA410-L322
  part_name: string;              // ชิ้นส่วน เช่น กันชนหน้า, ขาตั้ง
  sender_name: string;            // ผู้ส่งมอบงาน
  container_no: string;           // ตู้สินค้าหมายเลขใด
  quantity: number;               // จำนวนชิ้นงาน
  delivery_slip_image_url: string;// URL รูปถ่ายใบส่งมอบงาน
  part_image_url: string;         // URL รูปถ่ายตัวชิ้นงาน
  status: JobStatus;
  priority?: JobPriority;         // ความเร่งด่วน (URGENT / HIGH / NORMAL)
  hanger_no?: string;             // หมายเลขแฮงค์เกอร์ (Hanger No.)
  coating_type?: CoatingType;     // ประเภทงาน: EDP_ONLY หรือ EDP_AND_POWDER
  received_at: string;            // วันที่และเวลารับเข้า (ISO string)
  receiver_name: string;          // เจ้าหน้าที่แผนกพ่นสีผู้รับงาน
  coating_started_at?: string;    // วันที่และเวลาเริ่มพ่นสี
  coating_finished_at?: string;   // วันที่และเวลาพ่นสีเสร็จ
  dispatched_at?: string;         // วันที่และเวลาส่งมอบให้แผนกถัดไป
  packing_receiver_name?: string; // ชื่อเจ้าหน้าที่ผู้รับงานปลายทาง
  target_department?: string;     // แผนกปลายทางที่ส่งมอบ เช่น Packing(PK), Assembly(AS), QC, Welding(WD)
  dispatch_slip_image_url?: string;// URL รูปถ่ายใบส่งมอบงานตอนส่งออก
  dispatch_part_image_url?: string;// URL รูปถ่ายตัวชิ้นงานตอนส่งมอบ
  notes?: string;                 // หมายเหตุ
  created_at: string;
}

export interface MasterModelItem {
  partNo: string;
}

export interface PlanItem {
  id: string;
  modelPartNo: string;
  planQty: number;
  rawQtyText?: string;
  previousPlanQty?: number;
  sheetColor?: 'GREEN' | 'RED' | 'YELLOW' | null;
  isQtyYellow?: boolean;
  pcStatus?: string;
  note?: string;
  isClosed?: boolean;
  closedAt?: string;
  closedBy?: string;
}

export interface ContainerPlan {
  id: string;
  name: string;
  date?: string;
  items: PlanItem[];
  isActive?: boolean;
}

export interface CrossContainerMatch {
  modelPartNo: string;
  currentContainer: string;
  currentQty: number;
  futureMatches: Array<{
    containerName: string;
    containerDate?: string;
    qty: number;
  }>;
}
