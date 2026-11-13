import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // รองรับการเปิดผ่านมือถือ/แท็บเล็ตในวง Wi-Fi เดียวกัน
    port: 5173,
    open: true, // เปิดเบราว์เซอร์อัตโนมัติเมื่อระบบโหลดและพร้อม 100% แล้ว
  },
})
