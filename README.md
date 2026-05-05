# Mortal Kombat 11: Korean Patch

> Unofficial Korean localization: Story · Movelist · UI · DLC · In-game dialogue  
> **v1.0 (2026-05-04)** · Fan-made · by KimHerV

> **한국어 사용자**: [랜딩 페이지에서 설치 안내](https://mk11-korean-patch.pages.dev)

**[Landing Page](https://mk11-korean-patch.pages.dev)** &nbsp;|&nbsp; **[Feedback](https://mk11-korean-patch.pages.dev/#feedback)**

---

## Coverage

| Section | Entries | Notes |
|---|---:|---|
| Items & Krypt | 22,689 | Item names, descriptions, abilities, gear, skins |
| UI | 8,900 | Menus, tutorial, ladder, combat alerts, shop |
| In-game Dialogue | 9,648 | 1,350 intro/response pairs · 37 characters |
| DLC | 5,109 | Full GOTY Edition · Mileena, Rain, Rambo, Joker, Spawn +6 |
| Movelist | 3,732 | Base 25 + all DLC · move names unified |
| Story Mode | 3,004 | Chapters 1–12 + Aftermath DLC |
| **Total** | **53,000+** | 37 translation files · NanumSquare Neo font |

---

## Installation

### Prerequisites

This patch links against two Microsoft Visual C++ runtimes. Install both before running the patched game:

- **[Visual C++ 2013 Redistributable (x64)](https://aka.ms/highdpimfc2013x64enu)** — required by `libzmq` and `libsodium`. **Not bundled with Windows 10/11.**
- **[Visual C++ 2015–2022 Redistributable (x64)](https://aka.ms/vs/17/release/vc_redist.x64.exe)** — required by `ASIMK11.asi`. Usually present on Windows 10/11, but install if missing.

If the game fails to launch with `Unable to load ASIMK11.asi. Error: 126`, verify both redistributables above are installed.

### 1. Download the installer

**[MK11-Korean-Patch-Setup.exe](https://github.com/KimHerV/mk11-korean-patch/releases/latest)**

> Windows SmartScreen may warn on first run.  
> Click **"More info" → "Run anyway"** to proceed.

### 2. Run the installer

Select your MK11 installation folder (Steam path is auto-detected) and apply the patch.

### 3. Set game language

Steam → Library → Mortal Kombat 11 → Properties → Language → **Simplified Chinese**

### 4. Launch the game

Korean text and font will be active.

### Troubleshooting

**Some antivirus programs may quarantine or auto-delete the installer.** This is a heuristic flag on unsigned EXEs and not specific to this patch. Major AVs (Microsoft Defender, Norton, McAfee, BitDefender, ESET, Avast/AVG, Trend Micro) have cleared this build per VirusTotal scan.

- *Restore from quarantine*: open your antivirus program's quarantine / threat history → find the blocked entry → **Allow** or **Restore**
- *Or temporarily exclude the Downloads folder*: open your antivirus settings → Exclusions / Exceptions → add the Downloads folder → re-download → remove the exclusion after install

---

### Installed files

**Game folder (`Binaries/Retail/` and `Localization/`):**

| File | Purpose |
|---|---|
| `Coalesced.CHS` | Korean translation text (53,000+ entries) |
| `ui_c_inGameFonts_chs.xxx` | NanumSquare Neo font rendering |
| `dinput8.dll` | ASI plugin loader ([Ultimate ASI Loader](https://github.com/ThirteenAG/Ultimate-ASI-Loader)) |
| `ASIMK11.asi` | CVD bypass plugin ([ASI MK11](https://github.com/thethiny/ASIMK11)) |
| `ASIMK11.ini` | Plugin config |
| `libzmq-v120-mt-4_3_4.dll` | Plugin runtime dependency ([ZeroMQ](https://github.com/zeromq/libzmq)) |
| `libsodium.dll` | ZeroMQ cryptography dependency ([libsodium](https://github.com/jedisct1/libsodium)) |

**AppData (`%APPDATA%\MK11KoreanPatch\`):**

| Item | Purpose |
|---|---|
| `mk11_kor_manager.exe` | Patch manager: status, re-apply, update check |
| `patch_files\` | Cached patch files for re-application |
| `config.json` | Game path and version config |

> Uninstalling restores all original files and removes `%APPDATA%\MK11KoreanPatch\`.

- Game executables and original assets are **not modified**
- Translation text and font assets only. No gameplay logic, stats, hitboxes, or netcode changes
- Non-commercial personal project
- Will be taken down immediately upon request from Warner Bros. / NetherRealm Studios

---

## Online Play

Online play has been verified in our test environment on the Steam version of MK11.

This patch does not include cheats, character/item unlocks, DLC bypass, CreamAPI, or Unlocker functionality. Only the configuration required to load the translation file is active.

This is an unofficial fan-made patch, so behavior may change with game updates, platform policy, or user environment. If you are concerned about online play, we recommend testing in single-player or offline mode first.

---

## Feedback

Found a mistranslation or awkward phrasing?

- **[Feedback form](https://mk11-korean-patch.pages.dev/#feedback)** (anonymous)

---

## Disclaimer

This is an unofficial fan-made patch. Mortal Kombat 11 and all related trademarks are property of Warner Bros. Entertainment Inc. and NetherRealm Studios. This patch is created for accessibility purposes for Korean-speaking players. It does not include original game assets. The installer bundles Korean translation files and third-party plugins. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for license details.
