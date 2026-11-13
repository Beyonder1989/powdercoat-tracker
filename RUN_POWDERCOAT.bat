@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

rem เพิ่ม Node.js เข้าสู่ PATH เพื่อป้องกันปัญหาหา node ไม่เจอ
set "PATH=D:\nodejs;C:\Program Files\nodejs;%PATH%"

title POWDER COAT TRACKER - HAMER 4X4
color 0B

echo ===============================================================================
echo   POWDER COAT TRACKER - HAMER 4X4 SYSTEM
echo   ระบบรับเข้าและติดตามงานพ่นสีอะไหล่กันชน
echo ===============================================================================
echo.
echo [*] กำลังเริ่มต้นระบบ...
echo [*] URL สำหรับใช้งานบนคอมพิวเตอร์: http://localhost:5173
echo.
echo [*] ระบบจะเปิดเบราว์เซอร์ให้คุณโดยอัตโนมัติ
echo [*] หากต้องการปิดโปรแกรม ให้ปิดหน้าต่างสีดำนี้ได้เลยครับ
echo ===============================================================================
echo.

rem สั่งเปิดบราวเซอร์หลังจากเซิร์ฟเวอร์พร้อม
start "" "http://localhost:5173"

rem เริ่มต้น Vite Server
call npm run dev -- --host

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] เซิร์ฟเวอร์หยุดทำงานด้วยรหัสผิดพลาด
    echo.
    pause
)
