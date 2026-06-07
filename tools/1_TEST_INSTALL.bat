@echo off
set "MK11_UPDATE_API=http://localhost:8099/releases/latest"
setx MK11_UPDATE_API "http://localhost:8099/releases/latest" >nul
echo [SWITCH ON] Installer + Manager will use the LOCAL test server.
echo Launching installer (installs version 1.2 from localhost)...
start "" "D:\My AI Projects\Git Repository\mk11-korean-patch\wails-app\build\bin\MK11-Korean-Patch-Setup.exe"