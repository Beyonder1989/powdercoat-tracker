# ระบบรับเข้าและติดตามงานพ่นสีกันชน (Powder Coat Tracker)

เว็บแอพพลิเคชันสำหรับบันทึกรับเข้าอะไหล่กันชนในกระบวนการผลิตเข้าสู่แผนกพ่นสี (Powder Coat) พร้อมระบบเก็บหลักฐานภาพถ่าย และส่งมอบงานต่อไปยังแผนกแพ็คกิ้ง (Packing)
พัฒนาขึ้นโดยใช้เทคโนโลยี **Free Tier 100%**:
- **Frontend UI**: React 18 + Vite + TypeScript + Tailwind CSS + Lucide Icons
- **Database & File Storage**: Supabase (PostgreSQL + Supabase Storage)
- **Version Control**: Git & GitHub
- **Deployment**: Vercel

---

## 🌟 ฟังก์ชันหลักของระบบ (Features)

1. **ฟังก์ชันบันทึกรับเข้างาน (Receive / Check-in)**
   - ดึงข้อมูลจากไฟล์ `ข้อมูลแผนก_Model_Part` (รองรับมากกว่า 2,050+ รายการ)
   - เลือกแผนกผู้นำส่ง (Laser, Bending, Welding, Tube Bending, Grinding, Painting, Packing ฯลฯ)
   - ค้นหาและเลือก Model / Part No. แบบ Searchable Autocomplete Combobox
   - เลือกประเภทชิ้นส่วน (กันชนหน้า, กันชนท้าย, ขาตั้ง, บูท, เพลทหน้า, เพลทบน ฯลฯ)
   - ระบุชื่อผู้นำส่ง และ หมายเลขตู้สินค้า (Container / Lot No.)
   - 📸 **ถ่ายรูปหลักฐาน 2 ภาพ (ผ่านกล้องมือถือ/แท็บเล็ตได้ทันที)**:
     1. รูปถ่ายใบส่งมอบงาน
     2. รูปถ่ายตัวชิ้นงานจริง
   - **ระบบ Auto Image Compression**: บีบอัดรูปจาก 5-10MB เหลือเพียง ~150-300KB อัตโนมัติในเบราว์เซอร์ เพื่อความรวดเร็วในการส่งข้อมูลและประหยัดพื้นที่จัดเก็บฟรีของ Supabase (1GB เก็บได้มากกว่า 3,000-5,000 ภาพ)

2. **ระบบติดตามสถานะชิ้นงาน (Powder Coat Tracker & Audit Trail)**
   - บันทึกวันและเวลาที่รับเข้าแบบ Realtime
   - แสดงรายการงานพร้อมสถานะสีสันชัดเจน:
     - 📥 **รอพ่นสี (RECEIVED)**
     - 🎨 **กำลังพ่นสี (IN_PROGRESS)**
     - ✅ **พ่นสีเสร็จสมบูรณ์ (COMPLETED)**
     - 📦 **ส่งมอบแผนกแพ็คกิ้งแล้ว (DISPATCHED_TO_PACKING)**
   - ค้นหาและกรองข้อมูลตาม: ตู้สินค้า, Model, Part, ชื่อผู้ส่งมอบ, แผนก, สถานะ
   - มีทั้งมุมมองการ์ด (Cards View - เหมาะกับมือถือ) และมุมมองตาราง (Table View - เหมาะกับ PC)
   - ดูรูปหลักฐานและประวัติวันเวลาของแต่ละขั้นตอนได้อย่างละเอียด

3. **ฟังก์ชันส่งมอบงานต่อให้แผนกแพ็คกิ้ง (Dispatch to Packing)**
   - บันทึกชื่อเจ้าหน้าที่แผนกแพ็คกิ้งผู้รับงาน
   - บันทึกวันเวลาที่ส่งมอบ และหมายเหตุการส่งมอบ

4. **โหมดจำลอง (Local Storage Mode)**
   - สามารถเปิดทดสอบใช้งานได้ทันที แม้ยังไม่ได้เชื่อมต่อ Supabase Key

---

## 🚀 ขั้นตอนการติดตั้งและเชื่อมต่อใช้งาน (100% ฟรี)

### ขั้นตอนที่ 1: ติดตั้งฐานข้อมูลใน Supabase
1. เข้าไปที่ [Supabase Dashboard](https://supabase.com/dashboard) (องค์กร `hamer-job-system`)
2. เลือกโปรเจ็คของคุณ หรือสร้างโปรเจ็คใหม่ (Free Plan)
3. ไปที่เมนู **SQL Editor** ด้านซ้าย
4. เปิดไฟล์ `supabase_schema.sql` ในโฟลเดอร์นี้ คัดลอกโค้ดทั้งหมดแล้วนำไปวางใน SQL Editor แล้วกด **Run**
5. ไปที่ **Project Settings > API** คัดลอกค่า 2 ค่า:
   - **Project URL** (เช่น `https://xyz.supabase.co`)
   - **Project API Keys (anon public)** (เช่น `eyJhbGciOi...`)
6. นำค่าทั้ง 2 ไปใส่ในหน้าเว็บเมนู **"ตั้งค่า Supabase"** หรือใส่ในไฟล์ `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

---

### ขั้นตอนที่ 2: อัปโหลดขึ้น GitHub
1. เปิด Terminal ในโฟลเดอร์นี้
2. สร้าง Repository ใหม่บน [GitHub (Beyonder1989)](https://github.com/new) เช่น ตั้งชื่อว่า `powdercoat-tracker`
3. เชื่อมต่อและ Push โค้ดขึ้น GitHub:
   ```bash
   git remote add origin https://github.com/Beyonder1989/powdercoat-tracker.git
   git branch -M main
   git push -u origin main
   ```

---

### ขั้นตอนที่ 3: นำขึ้นโฮสติ้งฟรี Vercel
1. เข้าไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. กดปุ่ม **"Add New..." > "Project"**
3. เลือก Repository `powdercoat-tracker` ที่เพิ่ง Push ขึ้นไป
4. ในส่วน **Environment Variables** ให้เพิ่ม 2 ค่า:
   - `VITE_SUPABASE_URL`: (Supabase Project URL ของคุณ)
   - `VITE_SUPABASE_ANON_KEY`: (Supabase Anon Key ของคุณ)
5. กดปุ่ม **Deploy**
6. ใช้งานผ่านมือถือ แท็บเล็ต และคอมพิวเตอร์ผ่านลิงก์ `https://powdercoat-tracker.vercel.app` ได้ทันที!
