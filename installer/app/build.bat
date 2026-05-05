@echo off
chcp 65001 > nul
echo [MK11 Installer] Starting PyInstaller build...

pyinstaller ^
  --onefile ^
  --noconsole ^
  --noupx ^
  --version-file "version_info.txt" ^
  --name MK11-Korean-Patch-Setup ^
  --add-data "gui;gui" ^
  --add-data "payload;payload" ^
  --add-data "mk11_kor_manager.exe;." ^
  --icon "gui\app.ico" ^
  --collect-all webview ^
  main.py

echo.
if exist "dist\MK11-Korean-Patch-Setup.exe" (
  echo [OK] dist\MK11-Korean-Patch-Setup.exe created
) else (
  echo [FAIL] Build failed
)
pause
