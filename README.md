# Mortal Kombat 11: Korean Patch

![Version](https://img.shields.io/github/v/release/KimHerV/mk11-korean-patch?color=c9a84c&label=version)
![Downloads](https://img.shields.io/github/downloads/KimHerV/mk11-korean-patch/total?color=c9a84c)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Steam%20Deck-555)

> Unofficial Korean localization · Story · Movelist · UI · DLC · In-game dialogue  
> Fan-made · by KimHerV

> **한국어 사용자**: [랜딩 페이지에서 설치 안내](https://mk11-korean-patch.pages.dev)

**[Landing Page](https://mk11-korean-patch.pages.dev)** &nbsp;|&nbsp; **[Releases](https://github.com/KimHerV/mk11-korean-patch/releases)** &nbsp;|&nbsp; **[Feedback](https://mk11-korean-patch.pages.dev/#feedback)**

---

## Coverage

| Section | Entries | Notes |
|---|---:|---|
| Items & Krypt | 22,689 | Item names, descriptions, abilities, gear, skins |
| UI | 8,900 | Menus, tutorial, ladder, combat alerts, shop |
| In-game Dialogue | 9,648 | 1,350 intro/response pairs · 37 characters |
| DLC | 5,109 | Full GOTY Edition · Mileena, Rain, Rambo, Joker, Spawn +6 |
| Movelist | 3,732 | Base 25 + all DLC · move names unified |
| Story Mode | 3,004 | Chapters 1-12 + Aftermath DLC |
| **Total** | **53,000+** | 37 translation files · NanumSquare Neo font |

---

## Installation

### GUI: Windows (Recommended)

**Prerequisites** (install before running the patch):

| Dependency | Required by | Download |
|---|---|---|
| Visual C++ 2013 Redistributable (x64) | CVD bypass plugin | [aka.ms/highdpimfc2013x64enu](https://aka.ms/highdpimfc2013x64enu) |
| Visual C++ 2015-2022 Redistributable (x64) | CVD bypass plugin | [aka.ms/vs/17/release/vc_redist.x64.exe](https://aka.ms/vs/17/release/vc_redist.x64.exe) |
| WebView2 Evergreen Standalone | GUI installer | [go.microsoft.com/fwlink/p/?LinkId=2124703](https://go.microsoft.com/fwlink/p/?LinkId=2124703) |

VC++ 2015-2022 and WebView2 are typically pre-installed on Windows 10/11. VC++ 2013 is the one most likely to be missing.

**Steps:**

1. **[Download MK11-Korean-Patch-Setup.exe](https://github.com/KimHerV/mk11-korean-patch/releases/latest)**
2. Run the installer. MK11 path is auto-detected
3. Steam → MK11 → Properties → Language → **Simplified Chinese**
4. Launch the game

> **Defender note**: Installer, manager, and dinput8.dll have passed Microsoft's official review (submitted May 6, cleared May 10, 2026).  
> SmartScreen may show a warning on first run. Click **More info → Run anyway** to proceed.

---

### CLI: Steam Deck / Linux · Bazzite

Download **[MK11-Korean-Patch-CLI-Setup.zip](https://github.com/KimHerV/mk11-korean-patch/releases/latest)**, extract, then run:

| Platform | Command |
|---|---|
| Windows | double-click `install.bat` |
| Steam Deck / Linux · Bazzite | `bash install.sh` in a terminal |

The script auto-detects your Steam library, fetches the latest patch from GitHub, and walks you through each step including the optional CVD bypass plugin.

After install: Steam → MK11 → Properties → Language → **Simplified Chinese**

---

## Installed Files

All files go inside the MK11 game folder. Originals are backed up to `_backup_korean_patch/` before any changes.

| File | Location | Notes |
|---|---|---|
| `Coalesced.CHS` | `Localization/` | Korean translation (53,000+ entries) |
| `ui_c_inGameFonts_chs.xxx` | `Asset/` | NanumSquare Neo font |
| `dinput8.dll` | `Binaries/Retail/` | ASI plugin loader · optional |
| `ASIMK11.asi` | `Binaries/Retail/` | CVD bypass · optional |
| `ASIMK11.ini` | `Binaries/Retail/` | CVD bypass config · optional |
| `libzmq-v120-mt-4_3_4.dll` | `Binaries/Retail/` | Runtime dependency · optional |
| `libsodium.dll` | `Binaries/Retail/` | Runtime dependency · optional |

The five `Binaries/Retail/` files are only installed when the **translation loader plugin** (CVD bypass) option is selected. They are required on the 2026 build of MK11 for the patch to load.

The GUI installer also places a patch manager (`mk11_kor_manager.exe`) in `%APPDATA%\MK11KoreanPatch\` for status checks and re-application.

To uninstall: run `uninstall.bat` (Windows) or `bash uninstall.sh` (Steam Deck / Linux). Original files are restored from `_backup_korean_patch/`.

---

## Online Play

Tested and confirmed working on the Steam version, including online play. This patch modifies translation text and font only. No gameplay logic, stats, hitboxes, or netcode changes. No cheats, unlocks, or DLC bypass of any kind.

---

## Troubleshooting

**Antivirus quarantine**  
All core files have passed Microsoft's official review (May 2026). If another AV flags the installer, restore from quarantine and allow the file, or temporarily exclude the Downloads folder during install.

**Korean text not showing (Windows)**  
Re-run the installer and select **Yes** at the translation loader plugin step (CVD bypass).

**Error 126 on launch**  
Install [Visual C++ 2013 Redistributable (x64)](https://aka.ms/highdpimfc2013x64enu).

**Korean text not showing (Steam Deck / Linux)**  
Add to Steam launch options for MK11:
```
WINEDLLOVERRIDES="dinput8=n,b" %command%
```

---

## Feedback

- **[Feedback form](https://mk11-korean-patch.pages.dev/#feedback)**: anonymous, in-page form
- **[GitHub Issues](https://github.com/KimHerV/mk11-korean-patch/issues)**: bug reports and suggestions

---

## Disclaimer

Unofficial fan-made patch. Mortal Kombat 11 and all related trademarks are property of Warner Bros. Entertainment Inc. and NetherRealm Studios. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for third-party license details.
