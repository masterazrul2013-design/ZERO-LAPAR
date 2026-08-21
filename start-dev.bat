@echo off
title Zero Lapar - Development Mode
echo ========================================================
echo   ZERO LAPAR - Development Mode (Client + Server)
echo ========================================================
echo.
echo [1/2] Membersihkan proses lama...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/2] Menjalankan pelayan pembangunan...
start "Zero Lapar Backend (Port 5000)" cmd /k "cd /d %~dp0server && npm run dev"
start "Zero Lapar Frontend (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"
echo Pelayan Backend & Frontend telah dimulakan!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
pause