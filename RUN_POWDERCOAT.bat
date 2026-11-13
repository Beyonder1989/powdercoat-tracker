@echo off
setlocal
cd /d "%~dp0"

set "PATH=D:\nodejs;C:\Program Files\nodejs;%PATH%"

title POWDER COAT TRACKER - HAMER 4X4 SYSTEM
color 0B

echo ===============================================================================
echo   POWDER COAT TRACKER - HAMER 4X4 SYSTEM
echo   Bumper Parts Inbound ^& Tracking System
echo ===============================================================================
echo.
echo   [*] Status : Starting local server...
echo   [*] Local  : http://localhost:5173
echo.
echo   [*] Note   : Browser will open automatically as soon as server is ready.
echo   [*] Exit   : Close this window to stop the server.
echo ===============================================================================
echo.

call npm run dev -- --host

if %errorlevel% neq 0 (
    echo.
    echo   [ERROR] Server exited unexpectedly.
    pause
)
