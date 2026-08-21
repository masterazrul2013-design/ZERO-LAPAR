@echo off
title Upload Projek Zero Lapar ke GitHub
color 0A
cls
echo =========================================================
echo    UPLOAD PROJEK ZERO LAPAR KE GITHUB (GUI DI ROOT MAIN)
echo =========================================================
echo.
echo Sila buka https://github.com/new dan cipta repository baharu.
echo.
set /p REPO_URL="Tampal (paste) URL Repository Baharu anda di sini: "

if "%REPO_URL%"=="" (
    echo.
    echo Ralat: URL Repository tidak boleh kosong!
    pause
    exit /b
)

echo.
echo [1/4] Mempersiapkan fail GUI (index.html, assets, logo, .nojekyll)...
git init >nul 2>&1
git add .
git commit -m "Projek Zero Lapar - GUI & Full Stack PYIC 2026 PMTG" >nul 2>&1
git branch -M main

echo.
echo [2/4] Menyambungkan ke Repository Baharu:
echo %REPO_URL%
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo.
echo [3/4] Menolak semua fail ke branch main...
git push -u origin main --force

echo.
echo =========================================================
echo  TAHNIAH! Berjaya dimuat naik ke GitHub.
echo.
echo  SEKARANG ANDA BOLEH:
echo  1. Buka Repository anda di GitHub
echo  2. Pergi ke Settings -> Pages
echo  3. Branch: Pilih 'main' dan Folder: '/ (root)'
echo  4. Klik 'Save'
echo  5. GUI aplikasi Zero Lapar anda akan terus keluar!
echo =========================================================
echo.
pause
