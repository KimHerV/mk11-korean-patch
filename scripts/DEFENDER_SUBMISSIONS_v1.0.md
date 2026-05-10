# Microsoft Defender False-Positive Submissions for v1.0

**Submission URL**: <https://www.microsoft.com/en-us/wdsi/filesubmission>

**Common form fields for all 6 submissions**:
- **Customer category**: Software developer
- **Reason for submission**: false positive
- **Microsoft account**: required (any personal account)

Submit each file as a **separate submission**. The form accepts one or more files at a time, but tailored notes per file improve review accuracy.

---

## 1. MK11-Korean-Patch-Setup.exe (Installer)

| Field | Value |
|---|---|
| **File** | `MK11-Korean-Patch-Setup.exe` |
| **SHA256** | `77B837DC862A9555E4E4B9F8340151C78EFEA194447522A4D81D33939783FC9A` |
| **Size** | 45,674,764 bytes |
| **Detection name (if reported)** | `Trojan:Win32/Wacatac.H!ml` (typical ML heuristic) |
| **Source URL** | <https://github.com/KimHerV/mk11-korean-patch/releases/tag/v1.0> |

### Submission notes

```
Unsigned installer for an open-source community Korean translation patch
for Mortal Kombat 11. Built with PyInstaller, distributes translated
in-game text files (Coalesced.CHS) and font assets (.xxx) to the user's
Steam game folder.

Source code: https://github.com/KimHerV/mk11-korean-patch

The installer:
- Detects the Steam installation path of MK11
- Backs up original game files
- Copies translation text and font assets
- Copies bundled DLL plugins (separately submitted)
- Creates an uninstaller and patch manager in %APPDATA%

No network activity beyond GitHub Release fetch for update checks.
No data collection, no telemetry.

ML heuristic flags appear to be triggered by the unsigned EXE pattern
typical of game mod distributions.
```

---

## 2. ASIMK11.asi (CVD Bypass Plugin)

| Field | Value |
|---|---|
| **File** | `ASIMK11.asi` |
| **SHA256** | `B90D6B857E8D341AB27F5455F163F402653F6FF94945D583688D73B0C66E1C17` |
| **Size** | 424,448 bytes |
| **Source** | <https://github.com/thethiny/ASIMK11> (third-party, MIT-style usage) |

### Submission notes

```
Open-source plugin DLL bundled with a Korean translation patch for
Mortal Kombat 11 (Steam version). Loaded by the game via Ultimate ASI
Loader (dinput8.dll, separately submitted).

Purpose: bypasses the game's Content Validation Data (CVD) check that
otherwise prevents loading modified text/font assets. This is a
runtime-only memory patch — no game files on disk are modified by the
plugin itself.

Configuration (ASIMK11.ini bundled separately) sets only:
  bDisableAntiCVD = true
All other plugin features (Python integration, Discord RPC, mod
manager) are disabled.

Original project: https://github.com/thethiny/ASIMK11
Used in: https://github.com/KimHerV/mk11-korean-patch

Necessary for fan translation patches to load. The CVD bypass is
required because the game otherwise rejects modified Coalesced.CHS
files even when the user owns a legitimate Steam copy.

Pattern flagged by ML: DLL with memory-patch logic (common in both
legitimate game modding tools and tampering tools).
```

---

## 3. dinput8.dll (Ultimate ASI Loader)

| Field | Value |
|---|---|
| **File** | `dinput8.dll` |
| **SHA256** | `A494B8200179F3FD5B089C5CE24F42CAC7400EA390F062FBDC4D779321585792` |
| **Size** | 272,896 bytes |
| **Source** | <https://github.com/ThirteenAG/Ultimate-ASI-Loader> (MIT) |

### Submission notes

```
Ultimate ASI Loader by ThirteenAG (MIT licensed). Widely used in PC
game modding to enable ASI-format plugins.

Purpose in this distribution: replaces the system dinput8.dll in the
game folder so the game loads it (and forwarded ASI plugins) at
startup. Forwards all DirectInput8 calls to the system dinput8.dll, so
controller input continues to work normally.

Original project: https://github.com/ThirteenAG/Ultimate-ASI-Loader
Used in: https://github.com/KimHerV/mk11-korean-patch

This DLL is the standard loader for community modding across many
games. Pattern flagged by ML: DLL hijacking entry point (used both by
mods and by malware).
```

---

## 4. libzmq-v120-mt-4_3_4.dll (ZeroMQ)

| Field | Value |
|---|---|
| **File** | `libzmq-v120-mt-4_3_4.dll` |
| **SHA256** | `71785BB5DCAF028D5B65A2D87137379A8B628520DAD43A02D3A41D4765E505E6` |
| **Size** | 528,896 bytes |
| **Source** | ZeroMQ 4.3.4, VS2013 build (MPL-2.0) — <https://github.com/zeromq/libzmq> |

### Submission notes

```
ZeroMQ messaging library v4.3.4, VS2013 (v120) build. Standard
upstream binary, MPL-2.0 licensed.

Purpose in this distribution: runtime dependency of ASIMK11.asi
(separately submitted). The translation patch itself does not use any
ZeroMQ messaging features — this DLL is bundled solely because
ASIMK11 was originally built with ZeroMQ as a dependency.

Project: https://github.com/zeromq/libzmq
Used in: https://github.com/KimHerV/mk11-korean-patch

Standard third-party library, no modification.
```

---

## 5. libsodium.dll (Cryptography)

| Field | Value |
|---|---|
| **File** | `libsodium.dll` |
| **SHA256** | `E475D5F596ED5691850131D9066B66E2C27A5E77D950DC5EF5815C4D3BCF1576` |
| **Size** | 297,472 bytes |
| **Source** | libsodium 1.0.18, jedisct1 official build (ISC) — <https://github.com/jedisct1/libsodium> |

### Submission notes

```
libsodium cryptography library v1.0.18. Standard upstream binary from
the official jedisct1 distribution, ISC licensed.

Purpose in this distribution: indirect dependency loaded by libzmq
(separately submitted). The translation patch itself does not use any
cryptography features — this DLL is bundled solely because ZeroMQ in
the bundled libzmq build links against libsodium.

Project: https://github.com/jedisct1/libsodium
Used in: https://github.com/KimHerV/mk11-korean-patch

Standard third-party library, no modification.
```

---

## 6. mk11_kor_manager.exe (Patch Manager)

| Field | Value |
|---|---|
| **File** | `mk11_kor_manager.exe` |
| **SHA256** | `AAB55754F609853A1B1F9F5CB661772875C13523997761617BCD632E4246F282` |
| **Size** | 19,852,582 bytes |
| **Detection name (if reported)** | `Trojan:Win32/Wacatac.H!ml` (typical ML heuristic) |

### Submission notes

```
Patch manager bundled inside MK11-Korean-Patch-Setup.exe installer
(separately submitted). Extracted to %APPDATA%\MK11KoreanPatch\ at
install time. Built with PyInstaller.

Provides: patch status display, update check via GitHub API, CVD
toggle (ASIMK11.ini write), game launch shortcut, and uninstall.

Source code: https://github.com/KimHerV/mk11-korean-patch
No data collection, no telemetry.

ML heuristic flags appear to be triggered by the unsigned EXE pattern
typical of game mod distributions.
```

---

## Submission IDs (2026-05-06) — 결과 업데이트 2026-05-10

| File | Submission ID | Status |
|---|---|---|
| `MK11-Korean-Patch-Setup.exe` | `cdeea0ba-24fe-404b-982e-2857eb60f2c1` | **Completed** |
| `mk11_kor_manager.exe` | `ca8f47c6-2138-49c6-946e-495d347c17af` | **Completed** |
| `dinput8.dll` | `46401b8b-508a-4bf3-82ec-5b64db2da928` | **Completed** |
| `ASIMK11.asi` | `f5661a31-a277-48a9-acb7-df2fd93e80aa` | In progress |
| `libzmq-v120-mt-4_3_4.dll` | `06f0b92c-97a5-48bf-a3a3-b91210f25c3e` | In progress |
| `libsodium.dll` | `a5836ebe-1f7d-49ba-98b8-5729235d9b05` | In progress |

---

## After all 6 submissions

1. Save the confirmation pages or numbers from each submission (6 total)
2. Wait 24–72 hours for Microsoft response (per submission)
3. Responses arrive via the email tied to the submitting Microsoft account
4. Possible outcomes per file:
   - **Clean**: hash whitelisted globally — Defender stops flagging
   - **Threat name removed**: previous flag retracted
   - **Classification updated**: e.g., from malware to PUA
   - **Classification unchanged**: rare for these submission notes; if so, request re-review with additional context

5. Update landing page wording based on actual outcomes:
   - All clean → strong wording fine
   - Partial clean → mention only what's confirmed
   - Some still flagged → consider code signing path or self-built ASI DLL roadmap

## Reference: SHA256 verification (PowerShell)

```powershell
Get-FileHash MK11-Korean-Patch-Setup.exe -Algorithm SHA256
Get-FileHash ASIMK11.asi -Algorithm SHA256
Get-FileHash dinput8.dll -Algorithm SHA256
Get-FileHash libzmq-v120-mt-4_3_4.dll -Algorithm SHA256
Get-FileHash libsodium.dll -Algorithm SHA256
Get-FileHash mk11_kor_manager.exe -Algorithm SHA256
```
