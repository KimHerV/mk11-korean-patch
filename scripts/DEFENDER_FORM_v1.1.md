# Microsoft Defender Submission Form — v1.1 (Copy-Paste Sheet)

**Portal**: <https://www.microsoft.com/en-us/wdsi/filesubmission>
**MS account**: `elka2love@naver.com`

각 항목 값을 그대로 폼에 복붙. **2회 제출** (Installer 1회 + Manager 1회).

---

## 공통 필드 (두 제출 동일)

| 필드 | 값 |
|---|---|
| Submission updates will be sent to | `elka2love@naver.com` (자동) |
| Give additional users access | (비워둠) |
| Select the Microsoft security product used | `Microsoft Defender Antivirus (Windows 11)` |
| Company Name * | `KimHerV` |
| Do you have a Microsoft support case number? | `No` |
| Should this file be removed from our database at a certain date? | `No — remove the file automatically after a period of inactivity` |
| What do you believe this file is? | `Incorrectly detected as malware/malicious` |
| Detection name * | `Trojan:Win32/Wacatac.H!ml` |
| Definition version (recommended) | 본인 PC에서 확인 (아래 참고) |

### Definition version 확인

PowerShell 한 줄:

```powershell
Get-MpComputerStatus | Select-Object AntivirusSignatureVersion, AntivirusSignatureLastUpdated
```

GUI: **설정 → 개인 정보 및 보안 → Windows 보안 → 바이러스 및 위협 방지 → 바이러스 및 위협 방지 업데이트 → "보안 인텔리전스 버전"** (`1.XXX.XXX.X` 형식)

두 제출에 같은 값 사용.

---

## 제출 #1 — Installer

### Select the file *

```
D:\My AI Projects\Git Repository\mk11-korean-patch\installer\output\MK11-Korean-Patch-Setup.exe
```

- 크기: 45,692,294 bytes (~43.6 MB, 500 MB 한도 내)
- SHA256: `CF4F6B5C85B07F23C6C2EA5BCDC757B42023246D7869199B695359CF43146E96`
- 압축 불필요

### Additional information * (영어, 1900자 이내)

```
Unsigned installer for an open-source community Korean translation patch for Mortal Kombat 11. Built with PyInstaller --noupx --version-file (AV mitigation policy).

Source code: https://github.com/KimHerV/mk11-korean-patch
Release page: https://github.com/KimHerV/mk11-korean-patch/releases/tag/v1.1
Direct download: https://github.com/KimHerV/mk11-korean-patch/releases/download/v1.1/MK11-Korean-Patch-Setup.exe

This is a v1.1 hotfix rebuild of the v1.0 installer that was previously submitted and cleared:
- v1.0 Submission ID: cdeea0ba-24fe-404b-982e-2857eb60f2c1 (Completed 2026-05-10)

The rebuild was required to ship a coordinated fix with the bundled patch manager (urllib.request.urlretrieve type fix and added patch_hash self-check after auto-update). Same build pipeline, same publisher, same PE metadata as the cleared v1.0 binary.

Installer behavior:
- Detects the Steam installation path of MK11
- Backs up original game files
- Copies translated text (Coalesced.CHS) and font assets (.xxx)
- Copies bundled DLL/ASI plugins (already submitted under v1.0)
- Creates an uninstaller and patch manager in %APPDATA%

No data collection, no telemetry. Network access limited to GitHub Release fetch for update checks.

SHA256: CF4F6B5C85B07F23C6C2EA5BCDC757B42023246D7869199B695359CF43146E96
Size: 45,692,294 bytes

User report (2026-05-22): Windows Defender flags this hotfix binary as Trojan:Win32/Wacatac.H!ml despite the v1.0 clearance, with the same publisher and build pattern as the cleared file.
```

---

## 제출 #2 — Manager

### Select the file *

```
D:\My AI Projects\Git Repository\mk11-korean-patch\manager\dist\mk11_kor_manager.exe
```

- 크기: 19,854,809 bytes (~18.9 MB)
- SHA256: `CA135F899479C3628366CD9E545804C608D009606CD7759766898AAFFCB96B36`

### Additional information * (영어, 1900자 이내)

```
Patch manager bundled inside MK11-Korean-Patch-Setup.exe (separately submitted). Extracted to %APPDATA%\MK11KoreanPatch\ at install time. Built with PyInstaller --noupx --version-file (AV mitigation policy).

Source code: https://github.com/KimHerV/mk11-korean-patch
Release page: https://github.com/KimHerV/mk11-korean-patch/releases/tag/v1.1

This is a v1.1 hotfix rebuild of the v1.0 manager that was previously submitted and cleared:
- v1.0 Submission ID: ca8f47c6-2138-49c6-946e-495d347c17af (Completed 2026-05-10)

Two fixes shipped:
1. Replaced urllib.request.urlretrieve(Request, ...) (type mismatch in v1.0) with urlopen(req) + manual read/write loop.
2. Added a self-check: stored patch_hash must equal SHA256 of the actual game-folder Coalesced.CHS after apply_patch(); mismatch raises RuntimeError instead of silently desyncing manager state.

Same build pipeline, same publisher, same PE metadata as the cleared v1.0 binary.

Manager behavior: patch status display, update check via GitHub API, CVD toggle (ASIMK11.ini write), game launch shortcut, uninstall. No data collection, no telemetry. Network access: GitHub API for update check, GitHub Releases download for new assets.

SHA256: CA135F899479C3628366CD9E545804C608D009606CD7759766898AAFFCB96B36
Size: 19,854,809 bytes

User report (2026-05-22): Windows Defender flags this hotfix binary as Trojan:Win32/Wacatac.H!ml despite the v1.0 clearance, with the same publisher and build pattern as the cleared file.
```

---

## 제출 후

각 제출 완료 화면에서 받은 Submission ID(UUID)를 워크시트에 기입:

```
/mk11_defender_submit v1.1 record MK11-Korean-Patch-Setup.exe <UUID>
/mk11_defender_submit v1.1 record mk11_kor_manager.exe <UUID>
```

결과 메일(24~72시간) 수신 후 같은 명령으로 Status `Completed` 갱신.
