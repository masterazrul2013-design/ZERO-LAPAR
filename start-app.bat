@echo off
title Zero Lapar - PYIC 2026 Platform
echo ========================================================
echo   ZERO LAPAR - The Digital Food Redistribution Platform
echo   Inisiatif PYIC 2026 - Politeknik METrO Tasek Gelugor
echo ========================================================
echo.
echo [1/2] Menamatkan proses pelayan lama...
taskkill /f /im node.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/2] Memulakan pelayan Zero Lapar versi terkini...
echo.
echo ========================================================
echo  Pelayan kini aktif!
echo  Sila buka pelayar web di: http://localhost:5000
echo ========================================================
echo.
cd /d "%~dp0server"
node index.js
pause