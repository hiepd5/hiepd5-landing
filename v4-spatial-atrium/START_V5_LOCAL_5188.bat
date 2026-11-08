@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ====================================================================
echo   HIEPD5.COM V5.0 SACRED-GEOMETRY x BILINGUAL LEAN (LOCAL :5188)
echo ====================================================================
start "" "http://localhost:5188/"
call npm run dev -- --force
pause
