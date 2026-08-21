@echo off
title Upload Zero Lapar ke GitHub
color 0A
cls
echo ===================================================
echo     UPLOAD PROJEK ZERO LAPAR KE GITHUB (PYIC 2026)
echo ===================================================
echo.
echo Pastikan anda telah mencipta repository di https://github.com
echo.
set /p REPO_URL="Sila tampal (paste) URL GitHub anda di sini: "

if "%REPO_URL%"=="" (
    echo.
    echo Ralat: URL GitHub tidak boleh kosong!
    pause
    exit /b
)

echo.
echo [1/5] Memeriksa status Git...
if not exist ".git" (
    git init
)

echo.
echo [2/5] Menambah semua fail projek (mengabaikan node_modules)...
git add .

echo.
echo [3/5] Membuat commit simpanan...
git commit -m "Projek Zero Lapar - Platform Inovasi Makanan PYIC 2026 PMTG"

echo.
echo [4/5] Menetapkan branch main & remote URL...
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo.
echo [5/5] Memuat naik kod ke GitHub...
git push -u origin main

echo.
echo ===================================================
echo   SELESAI! Sila semak repository GitHub anda.
echo ===================================================
echo.
pause
