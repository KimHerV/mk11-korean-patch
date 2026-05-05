# Release Checklist

Run for every installer release (v1.x, hotfixes, etc.).

## Prerequisites

- `gh` CLI authenticated (`gh auth status`)
- `STATS_KEY` env var set in the current shell:
  ```powershell
  $env:STATS_KEY = "<the-stats-key>"
  ```

## Quick path

From repo root, run the helper script:

```powershell
.\scripts\release.ps1 -Tag v1.1 -Installer "C:\path\to\MK11-Korean-Patch-Setup.exe"
```

This performs steps 1 through 3 below automatically and prints the
Defender submission template for step 4.

## Manual steps (if not using the script)

### 1. Compute SHA256

```powershell
$hash = (Get-FileHash MK11-Korean-Patch-Setup.exe -Algorithm SHA256).Hash
"$hash *MK11-Korean-Patch-Setup.exe" | Set-Content MK11-Korean-Patch-Setup.exe.sha256
```

### 2. Pre-clobber snapshot

Captures the current GitHub download counter into the worker baseline
before `--clobber` resets it. Without this, downloads since the last
hourly cron are lost.

```powershell
Invoke-WebRequest "https://mk11-stats.elka2love.workers.dev/snapshot?key=$env:STATS_KEY" -UseBasicParsing
Start-Sleep 2
```

### 3. Upload to GitHub Release

```powershell
gh release upload v1.1 `
  MK11-Korean-Patch-Setup.exe `
  MK11-Korean-Patch-Setup.exe.sha256 `
  --clobber
```

### 4. Submit to Microsoft Defender (false-positive)

1. Open: <https://www.microsoft.com/en-us/wdsi/filesubmission>
2. Sign in with a Microsoft account
3. Form fields:
   - **Customer category**: Software developer
   - **File**: attach `MK11-Korean-Patch-Setup.exe`
   - **SHA256**: paste the hash from step 1
   - **Detection name** (if known): `Trojan:Win32/Wacatac.B!ml` (typical) or whatever the user reports
   - **Reason for submission**: false positive
   - **Additional info**:
     ```
     Unsigned installer for a community Korean translation patch for
     Mortal Kombat 11. Open source: https://github.com/KimHerV/mk11-korean-patch
     The installer copies translation text files (Coalesced.CHS) and a
     plugin (ASIMK11) into the user's Steam game folder. No network
     activity beyond GitHub Release fetch. ML heuristic flags appear to
     be triggered by the unsigned EXE + DLL injection pattern common to
     game mods.
     ```
4. Submit. Microsoft typically responds within 24-72 hours.
5. After confirmation, the specific SHA256 is whitelisted globally.

### 5. Verify

- Wait 1 hour for the next worker cron, then check
  `https://mk11-stats.elka2love.workers.dev/public` reflects the new
  cumulative count.
- Download the release URL, verify `sha256sum` matches the .sha256 file.

## Notes

- Each new build = new SHA256 = new submission required.
- `--clobber` resets GitHub's per-asset counter, but the worker
  detects the drop and banks the previous value into baseline. The
  pre-snapshot above maximizes accuracy.
- If a hotfix is needed within the 24-72 hour Defender review window,
  expect users to hit the same false-positive until the new hash is
  also reviewed.
