@echo off
REM ============================================================
REM  MK11 Korean Patch - CLI Uninstaller (Windows launcher)
REM
REM  This batch file is intentionally minimal. All Korean text
REM  and actual uninstall logic lives in uninstall.ps1, because
REM  cmd.exe has well-known UTF-8/CP949 encoding issues that
REM  drop the first byte of Korean strings under chcp 65001.
REM
REM  Double-click this file to start the uninstaller.
REM ============================================================

setlocal

REM Resolve uninstall.ps1 path relative to this batch file's location
set "PS_SCRIPT=%~dp0uninstall.ps1"

if not exist "%PS_SCRIPT%" (
    echo uninstall.ps1 not found at: %PS_SCRIPT%
    echo Make sure both files are in the same folder.
    pause
    exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"
set "PS_EXIT=%ERRORLEVEL%"

echo.
pause
exit /b %PS_EXIT%
