import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // รองรับการเปิดผ่านมือถือ/แท็บเล็ตในวง Wi-Fi เดียวกัน
    port: 5173,
    open: false, // จัดการเปิดผ่าน Batch Script ให้เอง
  },
})
