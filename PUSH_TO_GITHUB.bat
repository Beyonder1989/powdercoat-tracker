@echo off
setlocal
cd /d "%~dp0"

title PUSH TO GITHUB - POWDER COAT TRACKER
color 0A

echo ===============================================================================
echo   POWDER COAT TRACKER - PUSH TO GITHUB
echo ===============================================================================
echo.
echo   [*] Repository: https://github.com/Beyonder1989/powdercoat-tracker.git
echo   [*] Branch    : main
echo.
echo   [*] กำลังดันโค้ดขึ้น GitHub...
echo   (หากมีหน้าต่าง GitHub เด้งขึ้นมา ให้กดปุ่มสีเขียว Authorize เพื่อยืนยันตัวตนครับ)
echo.
echo ===============================================================================
echo.

git branch -M main
git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo ===============================================================================
    echo   [SUCCESS] ดันโค้ดทั้งหมดขึ้น GitHub เรียบร้อยแล้ว 100%!
    echo ===============================================================================
) else (
    echo ===============================================================================
    echo   [FAILED] ไม่สามารถ Push ได้ กรุณาตรวจสอบการเข้าสู่ระบบ GitHub ด้านบน
    echo ===============================================================================
)

echo.
pause
