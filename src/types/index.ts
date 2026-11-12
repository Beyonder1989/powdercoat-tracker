export type JobStatus = 
  | 'RECEIVED'              // รับเข้าแล้ว รอดำเนินการ
  | 'IN_PROGRESS'           // กำลังพ่นสี
  | 'COMPLETED'             // พ่นสีเสร็จสมบูรณ์
  | 'DISPATCHED_TO_PACKING'; // ส่งมอบให้แผนกแพ็คกิ้งแล้ว

export interface PowderCoatJob {
  id: string;
  tracking_code: string;       // e.g. PC-261113-0001
  sender_department: string;   // แผนกที่นำมาส่ง เช่น Laser(LS), Bending(BD), Welding(WD)
  model_part_no: string;       // Part No. / Model เช่น HA410-L322
  part_name: string;           // ชิ้นส่วน เช่น กันชนหน้า, ขาตั้ง
  sender_name: string;         // ผู้ส่งมอบงาน
  container_no: string;        // ตู้สินค้าหมายเลขใด
  quantity: number;            // จำนวนชิ้นงาน
  delivery_slip_image_url: string; // URL รูปถ่ายใบส่งมอบงาน
  part_image_url: string;          // URL รูปถ่ายตัวชิ้นงาน
  status: JobStatus;
  received_at: string;         // วันที่และเวลารับเข้า (ISO string)
  receiver_name: string;       // เจ้าหน้าที่แผนกพ่นสีผู้รับงาน
  coating_started_at?: string; // วันที่และเวลาเริ่มพ่นสี
  coating_finished_at?: string;// วันที่และเวลาพ่นสีเสร็จ
  dispatched_at?: string;      // วันที่และเวลาส่งมอบให้แพ็คกิ้ง
  packing_receiver_name?: string; // ชื่อเจ้าหน้าที่แผนกแพ็คกิ้งผู้รับงาน
  notes?: string;              // หมายเหตุ
  created_at: string;
}

export interface MasterModelItem {
  partNo: string;
}
