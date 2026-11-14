import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PowderCoatJob, JobStatus, JobPriority } from '../types';

// พยายามดึงจาก ENV หรือ LocalStorage เพื่อให้ผู้ใช้สามารถใส่ Key ผ่านหน้าเว็บได้เลย
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  const savedUrl = localStorage.getItem('powdercoat_supabase_url') || '';
  const savedKey = localStorage.getItem('powdercoat_supabase_key') || '';

  const url = savedUrl || envUrl;
  const key = savedKey || envKey;

  return { url, key, isConfigured: Boolean(url && key && url.includes('supabase.co')) };
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (url) localStorage.setItem('powdercoat_supabase_url', url.trim());
  else localStorage.removeItem('powdercoat_supabase_url');

  if (key) localStorage.setItem('powdercoat_supabase_key', key.trim());
  else localStorage.removeItem('powdercoat_supabase_key');
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (e) {
      console.error('Error creating Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
};

// ฟังก์ชันบีบอัดรูปภาพหน้างานก่อนส่ง (จาก 5-10MB เหลือ ~200-300KB ประหยัดเน็ต & Supabase Free 1GB)
export const compressImage = (file: File, maxWidth = 1280, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else resolve(file);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// อัปโหลดไฟล์รูปไปยัง Supabase Storage Bucket 'powdercoat-evidence'
export const uploadEvidenceImage = async (
  file: File,
  folder: 'slips' | 'parts'
): Promise<string> => {
  const supabase = getSupabase();
  const compressedBlob = await compressImage(file);

  if (!supabase) {
    // โหมด Local / Demo: แปลงเป็น Base64 Data URL เพื่อแสดงผลได้ทันที
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(compressedBlob);
    });
  }

  const fileExt = 'jpg';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('powdercoat-evidence')
    .upload(fileName, compressedBlob, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    // หาก bucket ยังไม่ถูกสร้างหรือติดสิทธิ์ ให้ Fallback เป็น Data URL ชั่วคราวเพื่อให้งานไม่สะดุด
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(compressedBlob);
    });
  }

  const { data: publicUrlData } = supabase.storage
    .from('powdercoat-evidence')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};

// LOCAL STORAGE FALLBACK KEY
const LOCAL_STORAGE_KEY = 'powdercoat_jobs_db';

export const getLocalJobs = (): PowderCoatJob[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to read local jobs', e);
    return [];
  }
};

export const saveLocalJobs = (jobs: PowderCoatJob[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error('Failed to save local jobs', e);
  }
};

// ดึงรายการงานทั้งหมด
export const fetchJobs = async (): Promise<PowderCoatJob[]> => {
  const supabase = getSupabase();
  if (!supabase) {
    return getLocalJobs();
  }

  const { data, error } = await supabase
    .from('powdercoat_jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase fetch failed, falling back to local:', error.message);
    return getLocalJobs();
  }

  return data as PowderCoatJob[];
};

// บันทึกรับเข้างานใหม่
export const createJob = async (
  jobData: Omit<PowderCoatJob, 'id' | 'tracking_code' | 'created_at'>
): Promise<PowderCoatJob> => {
  const timestamp = Date.now();
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const tracking_code = `PC-${dateStr}-${randomSuffix}`;
  const id = `job_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;
  const created_at = new Date().toISOString();

  const newJob: PowderCoatJob = {
    priority: 'NORMAL',
    ...jobData,
    id,
    tracking_code,
    created_at,
  };

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('powdercoat_jobs')
      .insert([newJob])
      .select()
      .single();

    if (!error && data) {
      return data as PowderCoatJob;
    }
    console.warn('Supabase insert failed, saving to local:', error?.message);
  }

  // Save to local
  const localJobs = getLocalJobs();
  const updated = [newJob, ...localJobs];
  saveLocalJobs(updated);
  return newJob;
};

// อัปเดตสถานะงาน
export const updateJobStatus = async (
  id: string,
  newStatus: JobStatus,
  extraData?: Partial<PowderCoatJob>
): Promise<PowderCoatJob | null> => {
  const now = new Date().toISOString();
  const updatePayload: Partial<PowderCoatJob> = {
    status: newStatus,
    ...extraData,
  };

  if (newStatus === 'IN_PROGRESS' && !extraData?.coating_started_at) {
    updatePayload.coating_started_at = now;
  } else if (newStatus === 'COMPLETED' && !extraData?.coating_finished_at) {
    updatePayload.coating_finished_at = now;
  } else if (newStatus === 'DISPATCHED_TO_PACKING' && !extraData?.dispatched_at) {
    updatePayload.dispatched_at = now;
  }

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('powdercoat_jobs')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      return data as PowderCoatJob;
    }

    if (error) {
      console.warn('Supabase update failed:', error.message);
      // หากเกิดปัญหาเรื่องคอลัมน์ใหม่ (hanger_no หรือ coating_type) ยังไม่ได้รัน SQL ใน Supabase
      if (error.message?.includes('hanger_no') || error.message?.includes('coating_type')) {
        const { hanger_no, coating_type, ...fallbackPayload } = updatePayload;
        const { data: fbData, error: fbError } = await supabase
          .from('powdercoat_jobs')
          .update(fallbackPayload)
          .eq('id', id)
          .select()
          .single();

        if (!fbError && fbData) {
          const merged = { ...(fbData as PowderCoatJob), ...updatePayload };
          const localJobs = getLocalJobs();
          const idx = localJobs.findIndex((j) => j.id === id);
          if (idx !== -1) {
            localJobs[idx] = merged;
            saveLocalJobs(localJobs);
          }
          return merged;
        }
      }
    }
  }

  // Update local
  const localJobs = getLocalJobs();
  const index = localJobs.findIndex((j) => j.id === id);
  if (index !== -1) {
    localJobs[index] = { ...localJobs[index], ...updatePayload };
    saveLocalJobs(localJobs);
    return localJobs[index];
  }

  return null;
};

// อัปเดตระดับความสำคัญ/ความเร่งด่วนของงาน (โดยหัวหน้างาน/รองหัวหน้า)
export const updateJobPriority = async (
  id: string,
  priority: JobPriority
): Promise<PowderCoatJob | null> => {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('powdercoat_jobs')
      .update({ priority })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      return data as PowderCoatJob;
    }
    console.warn('Supabase update priority failed:', error?.message);
  }

  // Update local
  const localJobs = getLocalJobs();
  const index = localJobs.findIndex((j) => j.id === id);
  if (index !== -1) {
    localJobs[index] = { ...localJobs[index], priority };
    saveLocalJobs(localJobs);
    return localJobs[index];
  }

  return null;
};

// ลบงาน (ลบทั้งใน Supabase และ LocalStorage เสมอ ไม่ให้งานเด้งกลับมา)
export const deleteJob = async (id: string): Promise<boolean> => {
  // 1. ลบจาก local storage เสมอ
  const localJobs = getLocalJobs();
  const filtered = localJobs.filter((j) => j.id !== id);
  saveLocalJobs(filtered);

  // 2. ลบจาก Supabase
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from('powdercoat_jobs').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete failed:', error.message);
    }
  }

  return true;
};

// คำสั่ง SQL สำหรับ Supabase Editor
export const SUPABASE_SQL_SETUP = `-- 1. สร้างตาราง powdercoat_jobs
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

-- 2. เปิดใช้งาน Row Level Security (RLS) แบบ Public ให้ทีมงานอ่าน-เขียนได้
ALTER TABLE public.powdercoat_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for jobs" 
ON public.powdercoat_jobs 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- 3. คำสั่งสร้าง Storage Bucket (powdercoat-evidence) สำหรับเก็บรูปถ่าย
INSERT INTO storage.buckets (id, name, public) 
VALUES ('powdercoat-evidence', 'powdercoat-evidence', true)
ON CONFLICT (id) DO NOTHING;

-- นโยบายเปิดให้ทุกคนอัปโหลดและดูรูปใน bucket ได้
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
`;
