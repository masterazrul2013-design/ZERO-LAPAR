@echo off
title Upload Zero Lapar ke GitHub
color 0A
cls
echo ===================================================
echo     UPLOAD PROJEK ZERO LAPAR KE GITHUB (PYIC 2026)
echo ===================================================
echo.

echo [1/3] Menambah fail dan membuat simpanan...
git add .
git commit -m "Projek Zero Lapar - Platform Inovasi Makanan PYIC 2026 PMTG" >nul 2>&1
git branch -M main

echo.
echo [2/3] Memeriksa sambungan ke GitHub:
echo URL: https://github.com/masterazrul2013-design/apps-zero-lapar.git
echo.
git remote set-url origin https://github.com/masterazrul2013-design/apps-zero-lapar.git >nul 2>&1

echo.
echo [3/3] Memuat naik kod ke GitHub (Sila log masuk pelayar jika diminta)...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo Cuba tolak dengan kemaskini branch...
    git push -u origin main --force
)

echo.
echo ===================================================
echo   SELESAI! Kod projek berjaya dimuat naik ke GitHub.
echo ===================================================
echo.
pause
