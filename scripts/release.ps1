# Release helper: SHA256 + pre-clobber snapshot + GitHub Release upload.
#
# Usage:
#   .\scripts\release.ps1 -Tag v1.1 -Installer "path\to\MK11-Korean-Patch-Setup.exe"
#
# Requires:
#   - gh (GitHub CLI), authenticated
#   - $env:STATS_KEY for the worker /snapshot endpoint

param(
  [Parameter(Mandatory = $true)]
  [string]$Tag,

  [Parameter(Mandatory = $true)]
  [string]$Installer,

  [string]$WorkerUrl = "https://mk11-stats.elka2love.workers.dev",

  [switch]$SkipSnapshot,

  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $Installer)) {
  Write-Error "Installer not found: $Installer"
}

# 1. Compute SHA256
Write-Host ""
Write-Host "[1/4] Computing SHA256..." -ForegroundColor Cyan
$hash       = (Get-FileHash -Path $Installer -Algorithm SHA256).Hash
$installerName = Split-Path $Installer -Leaf
$sha256File = "$Installer.sha256"
"$hash *$installerName" | Set-Content -Path $sha256File -Encoding ascii -NoNewline
Write-Host "  SHA256: $hash"
Write-Host "  Saved : $sha256File"

# 2. Pre-clobber snapshot (preserves download counter into baseline)
if (-not $SkipSnapshot) {
  Write-Host ""
  Write-Host "[2/4] Triggering pre-clobber snapshot..." -ForegroundColor Cyan
  if (-not $env:STATS_KEY) {
    Write-Warning "STATS_KEY env var not set. Skipping snapshot."
    Write-Warning "Set with: `$env:STATS_KEY = 'your-key'"
  } else {
    try {
      $resp = Invoke-WebRequest -Uri "$WorkerUrl/snapshot?key=$env:STATS_KEY" -UseBasicParsing -TimeoutSec 30
      if ($resp.StatusCode -eq 200) {
        Write-Host "  Snapshot OK"
      } else {
        Write-Warning "  Snapshot HTTP $($resp.StatusCode)"
      }
    } catch {
      Write-Warning "  Snapshot failed: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds 2
  }
} else {
  Write-Host ""
  Write-Host "[2/4] Snapshot skipped (-SkipSnapshot)" -ForegroundColor Yellow
}

# 3. Upload to GitHub Release
Write-Host ""
Write-Host "[3/4] Uploading to GitHub Release $Tag..." -ForegroundColor Cyan
if ($DryRun) {
  Write-Host "  [DRY RUN] gh release upload $Tag $Installer $sha256File --clobber"
} else {
  & gh release upload $Tag $Installer $sha256File --clobber
  if ($LASTEXITCODE -ne 0) {
    Write-Error "gh release upload failed with exit code $LASTEXITCODE"
  }
  Write-Host "  Upload OK"
}

# 4. Print Defender submission reminder
Write-Host ""
Write-Host "[4/4] Microsoft Defender false-positive submission" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Open: https://www.microsoft.com/en-us/wdsi/filesubmission"
Write-Host "  - Category    : Software developer"
Write-Host "  - File        : $Installer"
Write-Host "  - SHA256      : $hash"
Write-Host "  - Reason      : Mod tool false-positive. Unsigned installer for community Korean translation patch."
Write-Host "  - Source URL  : https://github.com/KimHerV/mk11-korean-patch/releases/tag/$Tag"
Write-Host ""
Write-Host "Done." -ForegroundColor Green
