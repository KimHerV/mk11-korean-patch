# Installer test harness (local release server)

Test the Go installer's **download -> install -> update** flow locally, simulating
GitHub Releases v1.2 -> 1.3 -> 1.4. Production is the **same binary with the env
var unset** (defaults to GitHub) -- going live is just not setting `MK11_UPDATE_API`.

## Scripts

| Script | Role |
|---|---|
| `pack_cvd_bypass.py` | Build `MK11-CVD-Bypass.zip` (loader set + `SHA256SUMS.txt`) from `08_CVD_ASI`. Reused for fixtures AND the real release. |
| `release_server.py` | Local GitHub-mock. `latest` = highest semver dir in `release_fixtures/`. |
| `stage_fixture.py` | Copy real Coalesced.CHS/font (+ per-version sentinel) into `release_fixtures/<ver>/`, plus the zip for the install version. |

## One-time setup

```
# 1. Build the loader
D:\MK11_Translate_Composer\08_CVD_ASI\build.bat        (or /mk11_compile cvd)
# 2. Pack the CVD bundle
python pack_cvd_bypass.py                               # -> 08_CVD_ASI\MK11-CVD-Bypass.zip
# 3. Stage the initial-install fixture
python stage_fixture.py 1.2 --with-zip
```

## Run

```
# 4. Start the server
python release_server.py                                # http://localhost:8099
# 5. Point the installer at it (persistent USER var so the spawned manager inherits it)
setx MK11_UPDATE_API "http://localhost:8099/releases/latest"
#    -> open a FRESH shell after setx
# 6. SAC off. Build + run the installer (wails build, or:
#    go build -tags "desktop,production" -ldflags "-w -s -H windowsgui" -o build\bin\mk11-patch.exe .)
```

Verify the install: game `Binaries\Retail` has `dinput8.dll` + `MK11_KoreanLoader.asi` + `MK11_KoreanLoader.ini`;
`Localization\Coalesced.CHS` SHA256 == the 1.2 fixture's; in-game `08_CVD_ASI\log\*.log` shows `CVD1/CVD2 patched`.

## Simulate updates

```
python stage_fixture.py 1.3            # CHS (sentinel v1.3) + font, NO zip
#  -> open the manager, click "업데이트 설치"
#  -> verify Coalesced.CHS now matches the 1.3 fixture; config.json installed_version=1.3
python stage_fixture.py 1.4            # repeat
```

## Teardown

```
# run the (under-test) uninstaller to clear shortcuts / HKCU / AppData, then:
powershell -c "[Environment]::SetEnvironmentVariable('MK11_UPDATE_API',$null,'User')"
```

## Notes

- **Update fetches only CHS + font** (not the CVD zip) -- verified in `ApplyUpdate`. So 1.3/1.4 fixtures omit the zip; the loader is installed once and persists.
- The **sentinel** appended to Coalesced.CHS gives a distinct SHA per version for plumbing verification. The NRS Coalesced format may reject trailing bytes in-game; if so, the download/install/update **plumbing is still validated** (presence + SHA + Layer-3 verify). For a true in-game render test, substitute a properly rebuilt CHS per version.
- The real installed EXE creates real Desktop/Start-Menu shortcuts + HKCU uninstall entry (no test skip flags) -- clean up via the uninstaller, not by editing env.
- Env override is verified in-process: `update.Check` picks up `MK11_UPDATE_API`; with it unset, behavior is identical to production GitHub.
- Build the loader and pack the zip after any loader change; re-stage fixtures so the server serves the new bytes.
