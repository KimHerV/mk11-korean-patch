# Mortal Kombat 11 Korean Patch

![Version](https://img.shields.io/github/v/release/KimHerV/mk11-korean-patch?color=c9a84c&label=version)
![Downloads](https://img.shields.io/github/downloads/KimHerV/mk11-korean-patch/total?color=c9a84c)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Steam%20Deck%20%7C%20Linux-555)

Unofficial, non-commercial Korean localization patch for legitimate Steam owners of Mortal Kombat 11.

- Story Mode / Movelist / UI / DLC / In-game dialogue
- 53,000+ translated entries
- Windows GUI installer + CLI installer for Steam Deck / Linux

**[Landing Page](https://mk11-korean-patch.pages.dev)** | **[Releases](https://github.com/KimHerV/mk11-korean-patch/releases)** | **[Patch Notes](https://mk11-korean-patch.pages.dev/changelog)** | **[Feedback](https://mk11-korean-patch.pages.dev/#feedback)**

---

## Coverage

| Section | Entries | Notes |
|---|---:|---|
| Items & Krypt | 22,689 | Item names, descriptions, abilities, gear, skins |
| UI | 8,900 | Menus, tutorial, ladder, combat alerts, shop |
| In-game Dialogue | 9,648 | Intro / response dialogue across 37 characters |
| DLC | 5,109 | Full GOTY Edition coverage |
| Movelist | 3,732 | Base roster + DLC move names unified |
| Story Mode | 3,004 | Chapters 1-12 + Aftermath DLC |
| **Total** | **53,000+** | 37 translation files + NanumSquare Neo font |

---

## Installation Options

### GUI Installer (Windows)

Recommended for most Windows users.

**Prerequisites**

| Dependency | Required by | Download |
|---|---|---|
| Visual C++ 2013 Redistributable (x64) | Translation loader chain | [aka.ms/highdpimfc2013x64enu](https://aka.ms/highdpimfc2013x64enu) |
| Visual C++ 2015-2022 Redistributable (x64) | Translation loader chain | [aka.ms/vs/17/release/vc_redist.x64.exe](https://aka.ms/vs/17/release/vc_redist.x64.exe) |
| WebView2 Evergreen Standalone | GUI installer | [go.microsoft.com/fwlink/p/?LinkId=2124703](https://go.microsoft.com/fwlink/p/?LinkId=2124703) |

VC++ 2015-2022 and WebView2 are usually already installed on Windows 10/11. VC++ 2013 is the dependency most likely to be missing.

**Steps**

1. Download **[MK11-Korean-Patch-Setup.exe](https://github.com/KimHerV/mk11-korean-patch/releases/latest)**
2. Run the installer and confirm the detected MK11 path
3. In Steam, open **MK11 -> Properties -> Language** and set it to **Simplified Chinese**
4. Launch the game

> **Security note:** The GUI installer is an unsigned executable and may trigger warnings in some security products.  
> Related response history is publicly documented, and a CLI installation path is also available.  
> If EXE-based installation feels uncomfortable, use the CLI installer instead.

---

### CLI Installer (Windows / Steam Deck / Linux / Bazzite)

Recommended if GUI execution is blocked, or if you prefer a script-based installation path.

Download **[MK11-Korean-Patch-CLI-Setup.zip](https://github.com/KimHerV/mk11-korean-patch/releases/latest)**, extract it, then run:

| Platform | Command |
|---|---|
| Windows | double-click `install.bat` |
| Steam Deck / Linux / Bazzite | `bash install.sh` |

The script auto-detects your Steam library, downloads the latest patch assets from GitHub Releases, and guides you through each step.

After install, set Steam language to **Simplified Chinese**:
- **Steam -> MK11 -> Properties -> Language -> Simplified Chinese**

---

## Installed Files

All game files are installed inside the MK11 folder. Original files are backed up to `_backup_korean_patch/` before changes are applied.

| File | Location | Notes |
|---|---|---|
| `Coalesced.CHS` | `Localization/` | Korean translation |
| `ui_c_inGameFonts_chs.xxx` | `Asset/` | NanumSquare Neo font |
| `dinput8.dll` | `Binaries/Retail/` | ASI plugin loader |
| `ASIMK11.asi` | `Binaries/Retail/` | Translation loader / CVD bypass |
| `ASIMK11.ini` | `Binaries/Retail/` | Loader configuration |
| `libzmq-v120-mt-4_3_4.dll` | `Binaries/Retail/` | Runtime dependency |
| `libsodium.dll` | `Binaries/Retail/` | Runtime dependency |

The `Binaries/Retail/` loader chain is only installed when the translation loader option is enabled.

The GUI installer also stores a patch manager and local settings in `%APPDATA%\MK11KoreanPatch\` for patch status checks and re-application.

To uninstall:
- Windows: run `uninstall.bat`
- Steam Deck / Linux: run `bash uninstall.sh`

Original files are restored from `_backup_korean_patch/`.

---

## Online Play

This patch is intended only to localize text and font rendering.

- No gameplay logic changes
- No stat, hitbox, or netcode changes
- No cheats, unlocks, or DLC bypass features

The Steam version has been tested with online play, but use remains at your own discretion.

---

## Security & Trust

### Windows Defender

Microsoft Defender false-positive removal for the installer was confirmed on **2026-05-23**.  
If detection still appears, your local security intelligence cache may be outdated.

Update via:
- **Windows Security -> Virus & threat protection -> Protection updates -> Check for updates**

More detailed refresh steps are documented on the landing page FAQ.

### Smart App Control

Smart App Control (SAC) is separate from Defender and may still block unsigned GUI installers.

If SAC blocks the installer, use the **CLI installer** instead.

### VirusTotal / Other AV Engines

VirusTotal aggregates many independent engines with different heuristics and thresholds. Some detections may remain even after Microsoft Defender review.

Known contributors include:
- unsigned executable distribution
- GUI installer packaging/runtime behavior
- translation loader / CVD bypass chain

The project continues to improve packaging structure and distribution trust signals.  
If EXE-based installation feels uncomfortable, use the **CLI installer**.

---

## Troubleshooting

### Korean text does not appear (Windows)

Re-run the installer and enable the translation loader option.

### Error 126 on launch

Install [Visual C++ 2013 Redistributable (x64)](https://aka.ms/highdpimfc2013x64enu).

### Korean text does not appear (Steam Deck / Linux)

Add this to the Steam launch options for MK11:

```bash
WINEDLLOVERRIDES="dinput8=n,b" %command%
```

### GUI installer does not open or shows a blank screen

Install or update WebView2, then try again. If the problem persists, use the CLI installer.

---

## Feedback

- **[Feedback form](https://mk11-korean-patch.pages.dev/#feedback)** for translation reports and installation feedback
- **[GitHub Issues](https://github.com/KimHerV/mk11-korean-patch/issues)** for bug reports and project issues

---

## Rights & Distribution Notice

This repository hosts an unofficial, non-commercial fan-made Korean patch distribution project for Mortal Kombat 11.

- Mortal Kombat 11 and all related copyrights, trademarks, characters, game assets, and original content belong to Warner Bros. Entertainment Inc., NetherRealm Studios, and their respective rights holders.
- This project is not affiliated with, endorsed by, or approved by Warner Bros. Games or NetherRealm Studios.
- The patch is intended only for legitimate Steam owners of the game and is distributed for Korean language accessibility purposes.
- Distribution and availability may be reviewed, limited, or discontinued upon request by rights holders.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for third-party license details.
