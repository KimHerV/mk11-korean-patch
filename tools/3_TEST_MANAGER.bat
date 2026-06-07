@echo off
set "MK11_UPDATE_API=http://localhost:8099/releases/latest"
echo [SWITCH ON] Manager uses the LOCAL test server.
echo Opening patch manager...
start "" "%APPDATA%\MK11KoreanPatch\mk11-patch.exe" --manager