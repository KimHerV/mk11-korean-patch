@echo off
chcp 65001 > nul
echo [MK11 Kor Manager] Starting PyInstaller build...

pyinstaller ^
  --onefile ^
  --noconsole ^
  --noupx ^
  --uac-admin ^
  --version-file "version_info.txt" ^
  --name mk11_kor_manager ^
  --add-data "gui;gui" ^
  --icon "gui\app.ico" ^
  --collect-all webview ^
  main.py

echo.
if exist "dist\mk11_kor_manager.exe" (
  echo [OK] dist\mk11_kor_manager.exe created
) else (
  echo [FAIL] Build failed. Check errors above.
)
pause
