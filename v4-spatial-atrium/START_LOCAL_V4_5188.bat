@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ===============================================================
echo   HIEPD5.COM V4.0 SPATIAL 3D — LOCAL PREVIEW (PORT :5188)
echo   (Bao toan 100%% ban V3.0 tren hiepd5.com & cong :8091)
echo ===============================================================
start "" "http://localhost:5188"
call npm run dev
