# Microsoft Defender False-Positive Submissions for v1.1

**Submission URL**: <https://www.microsoft.com/en-us/wdsi/filesubmission>

**Scope**: This release submits only the two core EXE files. The bundled
DLL/ASI plugins (`dinput8.dll`, `ASIMK11.asi`, `libzmq-v120-mt-4_3_4.dll`,
`libsodium.dll`) were not rebuilt for v1.1 and remain on the v1.0
submission record (see `DEFENDER_SUBMISSIONS_v1.0.md`).

**Why this submission exists**: v1.1 shipped a hotfix that forced a
PyInstaller rebuild of both EXEs (manager: `urllib.request.urlretrieve`
type fix + Layer 3 patch_hash self-check; installer: matching version
metadata). New SHA256 values mean v1.0 reputation does not carry over,
and a user has reported `Trojan:Win32/Wacatac.H!ml` detection on the new
binaries.

**Common form fields for both submissions**:
- **Customer category**: Software developer
- **Reason for submission**: false positive
- **Microsoft account**: elka2love@naver.com (same account as v1.0 submissions)

Submit each file as a **separate submission**.

---

## 1. MK11-Korean-Patch-Setup.exe (Installer, v1.1 hotfix rebuild)

| Field | Value |
|---|---|
| **File** | `MK11-Korean-Patch-Setup.exe` |
| **SHA256** | `CF4F6B5C85B07F23C6C2EA5BCDC757B42023246D7869199B695359CF43146E96` |
| **Size** | 45,692,294 bytes |
| **Detection name (if reported)** | `Trojan:Win32/Wacatac.H!ml` (user-reported, ML heuristic) |
| **Source URL** | <https://github.com/KimHerV/mk11-korean-patch/releases/download/v1.1/MK11-Korean-Patch-Setup.exe> |
| **Prior v1.0 submission** | `cdeea0ba-24fe-404b-982e-2857eb60f2c1` (Completed / cleared 2026-05-10) |

### Submission notes

```
Unsigned installer for an open-source community Korean translation patch
for Mortal Kombat 11. Built with PyInstaller, distributes translated
in-game text files (Coalesced.CHS) and font assets (.xxx) to the user's
Steam game folder.

Source code: https://github.com/KimHerV/mk11-korean-patch
Release page: https://github.com/KimHerV/mk11-korean-patch/releases/tag/v1.1

This is a v1.1 hotfix rebuild of the v1.0 installer that was previously
submitted and cleared (Submission ID cdeea0ba-24fe-404b-982e-2857eb60f2c1,
Completed 2026-05-10). The rebuild was required to ship a coordinated
fix with the patch manager (urllib.request.urlretrieve type fix and an
added patch_hash self-check after auto-update). Same build pipeline,
same publisher, same PE metadata as the cleared v1.0 binary.

The installer:
- Detects the Steam installation path of MK11
- Backs up original game files
- Copies translation text and font assets
- Copies bundled DLL plugins (already submitted under v1.0)
- Creates an uninstaller and patch manager in %APPDATA%

No network activity beyond GitHub Release fetch for update checks.
No data collection, no telemetry.

Build flags: PyInstaller --noupx --version-file (AV mitigation policy).
ML heuristic flags appear to be triggered by the unsigned EXE pattern
typical of game mod distributions.

User report (2026-05-22): Windows Defender still flags this hotfix
binary as Trojan:Win32/Wacatac.H!ml despite the v1.0 clearance. Same
publisher and build pattern as the cleared file.
```

---

## 2. mk11_kor_manager.exe (Patch Manager, v1.1 hotfix rebuild)

| Field | Value |
|---|---|
| **File** | `mk11_kor_manager.exe` |
| **SHA256** | `CA135F899479C3628366CD9E545804C608D009606CD7759766898AAFFCB96B36` |
| **Size** | 19,854,809 bytes |
| **Detection name (if reported)** | `Trojan:Win32/Wacatac.H!ml` (user-reported, ML heuristic) |
| **Source URL** | bundled inside `MK11-Korean-Patch-Setup.exe` (above) |
| **Prior v1.0 submission** | `ca8f47c6-2138-49c6-946e-495d347c17af` (Completed / cleared 2026-05-10) |

### Submission notes

```
Patch manager bundled inside MK11-Korean-Patch-Setup.exe installer
(separately submitted). Extracted to %APPDATA%\MK11KoreanPatch\ at
install time. Built with PyInstaller.

Source code: https://github.com/KimHerV/mk11-korean-patch
Release page: https://github.com/KimHerV/mk11-korean-patch/releases/tag/v1.1

This is a v1.1 hotfix rebuild of the v1.0 manager that was previously
submitted and cleared (Submission ID ca8f47c6-2138-49c6-946e-495d347c17af,
Completed 2026-05-10). Two fixes shipped:
  1. Replaced urllib.request.urlretrieve(Request, ...) (type mismatch
     in v1.0) with urlopen(req) + manual read/write loop.
  2. Added Layer 3 self-check: stored patch_hash must equal SHA256 of
     the actual game-folder Coalesced.CHS after apply_patch(); mismatch
     raises RuntimeError instead of silently desyncing manager state.
Same build pipeline, same publisher, same PE metadata as the cleared
v1.0 binary.

Provides: patch status display, update check via GitHub API, CVD
toggle (ASIMK11.ini write), game launch shortcut, and uninstall.

No data collection, no telemetry. Network access: GitHub API for
update check, GitHub Releases download for new assets.

Build flags: PyInstaller --noupx --version-file (AV mitigation policy).
ML heuristic flags appear to be triggered by the unsigned EXE pattern
typical of game mod distributions.

User report (2026-05-22): Windows Defender still flags this hotfix
binary as Trojan:Win32/Wacatac.H!ml despite the v1.0 clearance. Same
publisher and build pattern as the cleared file.
```

---

## Submission IDs (record after submitting)

| File | Submission ID | Status | Date |
|---|---|---|---|
| `MK11-Korean-Patch-Setup.exe` | `769febdb-7da4-40a3-a067-ad04322fcc2f` | Completed | 2026-05-23 |
| `mk11_kor_manager.exe` | `1e92cfd3-e4bb-42b3-8a81-e8616ef3d02f` | In progress | 2026-05-22 |

> Status 라이프사이클: `Submitted` → `In progress` → `Completed`. 결과 메일 수신 후 갱신.

### MK11-Korean-Patch-Setup.exe Analyst Response (2026-05-23)

```
At this time, the submitted files do not meet our criteria for malware or
potentially unwanted applications. The detection has been removed.

Please follow the steps below to clear cached detections and obtain the
latest malware definitions.
  1. Open command prompt as administrator and change directory to
     c:\Program Files\Windows Defender
  2. Run "MpCmdRun.exe -removedefinitions -dynamicsignatures"
  3. Run "MpCmdRun.exe -SignatureUpdate"

Alternatively, the latest definition is available for download here:
https://docs.microsoft.com/microsoft-365/security/defender-endpoint/manage-updates-baselines-microsoft-defender-antivirus
```

---

## After both submissions

1. Save the confirmation pages or Submission IDs from each submission (2 total)
2. Fill in the table above
3. Wait 24~72 hours for Microsoft response per submission
4. Responses arrive via the submitting Microsoft account email
5. Possible outcomes per file:
   - **Clean**: hash whitelisted globally, Defender stops flagging
   - **Threat name removed**: previous flag retracted
   - **Classification updated**: e.g., malware to PUA
   - **Classification unchanged**: rare given the v1.0 precedent; if so, request re-review citing v1.0 IDs

6. Update landing page / README wording if user-facing status changes

## Reference: SHA256 verification (PowerShell)

```powershell
Get-FileHash MK11-Korean-Patch-Setup.exe -Algorithm SHA256
Get-FileHash mk11_kor_manager.exe -Algorithm SHA256
```

Expected:

```
CF4F6B5C85B07F23C6C2EA5BCDC757B42023246D7869199B695359CF43146E96  MK11-Korean-Patch-Setup.exe
CA135F899479C3628366CD9E545804C608D009606CD7759766898AAFFCB96B36  mk11_kor_manager.exe
```
