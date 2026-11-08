@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ===============================================================
echo   HIEPD5.COM V4.2 — DONG BO 5 MO-DUN DONG TAM TRIPO AI / SKETCHUP (.GLB)
echo ===============================================================
if exist "C:\Program Files\Blender Foundation\Blender 4.4\blender.exe" (
    "C:\Program Files\Blender Foundation\Blender 4.4\blender.exe" --background --python "%~dp0tools\import_tripo_sketchup.py"
) else (
    echo [ERROR] Khong tim thay Blender 4.4 tai C:\Program Files\Blender Foundation\Blender 4.4\blender.exe
)
echo.
echo [HOAN TAT] Hay F5 trinh duyet http://localhost:5188 de xem Model 3D moi!
pause
