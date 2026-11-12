-- ==============================================================================
-- สคริปต์ SQL สำหรับสร้างฐานข้อมูลใน Supabase (ใช้ฟรี 100%)
-- ให้นำโค้ดนี้ไปวางในเมนู SQL Editor บน Supabase แล้วกด Run
-- ==============================================================================

-- 1. สร้างตาราง powdercoat_jobs
CREATE TABLE IF NOT EXISTS public.powdercoat_jobs (
    id TEXT PRIMARY KEY,
    tracking_code TEXT NOT NULL,
    sender_department TEXT NOT NULL,
    model_part_no TEXT NOT NULL,
    part_name TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    container_no TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    delivery_slip_image_url TEXT,
    part_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'RECEIVED',
    received_at TIMESTAMPTZ DEFAULT NOW(),
    receiver_name TEXT NOT NULL,
    coating_started_at TIMESTAMPTZ,
    coating_finished_at TIMESTAMPTZ,
    dispatched_at TIMESTAMPTZ,
    packing_receiver_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. เปิดใช้งาน Row Level Security (RLS) เพื่อความปลอดภัย
ALTER TABLE public.powdercoat_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for jobs" 
ON public.powdercoat_jobs 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- 3. สร้าง Storage Bucket สำหรับเก็บรูปภาพหลักฐาน (ใบส่งมอบ + ตัวชิ้นงาน)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('powdercoat-evidence', 'powdercoat-evidence', true)
ON CONFLICT (id) DO NOTHING;

-- นโยบายเปิดให้อัปโหลดและดูรูปใน Bucket
CREATE POLICY "Allow public uploads to powdercoat-evidence" 
ON storage.objects 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (bucket_id = 'powdercoat-evidence');

CREATE POLICY "Allow public view from powdercoat-evidence" 
ON storage.objects 
FOR SELECT 
TO anon, authenticated 
USING (bucket_id = 'powdercoat-evidence');
