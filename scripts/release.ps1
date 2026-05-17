# Release helper: upload fresh build/ + carry-forward assets to GitHub Release.
#
# Fresh assets (from build/):
#   - Coalesced.CHS              (required, output of mk11_compile)
#   - ui_c_inGameFonts_chs.xxx   (optional, output of font_patcher)
#
# Carry-forward assets (fetched from -BaseTag on GitHub):
#   - MK11-Korean-Patch-Setup.exe
#   - MK11-Korean-Patch-CLI-Setup.zip
#   - MK11-CVD-Bypass.zip
#
# Usage:
#   .\scripts\release.ps1 -Tag v1.1
#   .\scripts\release.ps1 -Tag v1.1 -Notes "notes\v1.1.md"
#   .\scripts\release.ps1 -Tag v1.1 -BaseTag v1.0   # carry-forward 소스 강제 지정
#   .\scripts\release.ps1 -Tag v1.1 -DryRun
#
# Pre-requisites:
#   - gh (GitHub CLI), authenticated
#   - build\Coalesced.CHS present (run mk11_compile first)
#   - $env:STATS_KEY set when re-uploading to existing tag

param(
  [Parameter(Mandatory)]
  [string]$Tag,

  [string]$BaseTag   = "",
  [string]$BuildDir  = "",
  [string]$Notes     = "",
  [string]$Repo      = "KimHerV/mk11-korean-patch",
  [string]$WorkerUrl = "https://mk11-stats.elka2love.workers.dev",
  [switch]$SkipSnapshot,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

# ── 경로 ──────────────────────────────────────────────────────────────────────
if (-not $BuildDir) {
  $BuildDir = Join-Path $PSScriptRoot "..\build"
}
$BuildDir = (Resolve-Path $BuildDir).Path

$FRESH_ASSETS = @(
  @{ name = "Coalesced.CHS";            required = $true  },
  @{ name = "ui_c_inGameFonts_chs.xxx"; required = $false }
)
$CARRY_FORWARD = @(
  "MK11-Korean-Patch-Setup.exe",
  "MK11-Korean-Patch-CLI-Setup.zip",
  "MK11-CVD-Bypass.zip"
)

$uploadList = [System.Collections.Generic.List[string]]::new()

# ── [1/6] Fresh 에셋 확인 (build/) ────────────────────────────────────────────
Write-Host ""
Write-Host "[1/6] Fresh assets (build/)..." -ForegroundColor Cyan

foreach ($a in $FRESH_ASSETS) {
  $p = Join-Path $BuildDir $a.name
  if (Test-Path $p) {
    $mb = [math]::Round((Get-Item $p).Length / 1MB, 2)
    Write-Host ("  {0,-42} {1,6} MB" -f $a.name, $mb)
    $uploadList.Add($p)
  } elseif ($a.required) {
    Write-Error "Required: $p`n  -> run mk11_compile first"
  } else {
    Write-Warning "  $($a.name) not in build/ - skipping"
  }
}

# ── [2/6] BaseTag 자동 감지 ────────────────────────────────────────────────────
Write-Host ""
Write-Host "[2/6] Resolving -BaseTag..." -ForegroundColor Cyan

if (-not $BaseTag) {
  $prevPref = $ErrorActionPreference
  $ErrorActionPreference = 'SilentlyContinue'
  $releaseJson = & gh release list --repo $Repo --limit 20 --json tagName,createdAt | ConvertFrom-Json
  $ErrorActionPreference = $prevPref

  $candidates = $releaseJson | Where-Object { $_.tagName -ne $Tag }
  if (-not $candidates) {
    Write-Error "No previous release found. Specify -BaseTag explicitly."
  }
  $BaseTag = ($candidates | Select-Object -First 1).tagName
  Write-Host "  Auto-detected: $BaseTag"
} else {
  Write-Host "  Specified: $BaseTag"
}

# ── [3/6] Carry-forward 다운로드 ───────────────────────────────────────────────
Write-Host ""
Write-Host "[3/6] Fetching carry-forward from $BaseTag..." -ForegroundColor Cyan

$cacheDir = Join-Path $env:TEMP "mk11_carry_$($Tag -replace '[^a-zA-Z0-9]', '_')"
if (Test-Path $cacheDir) { Remove-Item $cacheDir -Recurse -Force }
New-Item -ItemType Directory -Path $cacheDir -Force | Out-Null

foreach ($name in $CARRY_FORWARD) {
  $prevPref = $ErrorActionPreference
  $ErrorActionPreference = 'SilentlyContinue'
  & gh release download $BaseTag --repo $Repo --pattern $name --dir $cacheDir --clobber | Out-Null
  $ErrorActionPreference = $prevPref

  $p = Join-Path $cacheDir $name
  if (Test-Path $p) {
    $mb = [math]::Round((Get-Item $p).Length / 1MB, 2)
    Write-Host ("  {0,-42} {1,6} MB  (from $BaseTag)" -f $name, $mb)
    $uploadList.Add($p)
  } else {
    Write-Warning "  $name not in $BaseTag - skipping"
  }
}

# ── [4/6] Installer SHA256 + carry-forward 무결성 확인 ────────────────────────
Write-Host ""
Write-Host "[4/6] Installer SHA256..." -ForegroundColor Cyan

$installerPath  = Join-Path $cacheDir "MK11-Korean-Patch-Setup.exe"
$currentHash    = $null
$defenderNeeded = $false

if (Test-Path $installerPath) {
  $currentHash = (Get-FileHash $installerPath -Algorithm SHA256).Hash
  $sha256Path  = "$installerPath.sha256"
  "$currentHash *MK11-Korean-Patch-Setup.exe" | Set-Content $sha256Path -Encoding ascii -NoNewline
  $uploadList.Add($sha256Path)
  Write-Host "  $currentHash"

  # BaseTag SHA256와 비교 (carry-forward이면 동일해야 함)
  $prevPref = $ErrorActionPreference
  $ErrorActionPreference = 'SilentlyContinue'
  & gh release download $BaseTag --repo $Repo --pattern "MK11-Korean-Patch-Setup.exe.sha256" --dir $cacheDir --clobber | Out-Null
  $ErrorActionPreference = $prevPref

  $prevSha256File = "$installerPath.sha256"
  $prevSha256Dir  = Join-Path $cacheDir "MK11-Korean-Patch-Setup.exe.sha256"
  if (Test-Path $prevSha256Dir) {
    $prevHash = ((Get-Content $prevSha256Dir -Raw).Trim() -split '\s+')[0]
    if ($prevHash -eq $currentHash) {
      Write-Host "  Matches $BaseTag SHA256 (carry-forward intact)" -ForegroundColor Green
    } else {
      $defenderNeeded = $true
      Write-Warning "  SHA256 differs from $BaseTag - installer may have changed"
    }
  }
} else {
  Write-Host "  No installer in carry-forward - skipped" -ForegroundColor Yellow
}

# ── [5/6] Tag 확인 → snapshot / create 분기 ──────────────────────────────────
Write-Host ""
Write-Host "[5/6] Checking tag $Tag..." -ForegroundColor Cyan

$prevPref = $ErrorActionPreference
$ErrorActionPreference = 'SilentlyContinue'
& gh release view $Tag --repo $Repo | Out-Null
$tagExists = ($LASTEXITCODE -eq 0)
$ErrorActionPreference = $prevPref

if ($tagExists) {
  Write-Host "  Tag exists -> clobber upload"
  if ($SkipSnapshot) {
    Write-Host "  Snapshot skipped (-SkipSnapshot)" -ForegroundColor Yellow
  } elseif (-not $env:STATS_KEY) {
    Write-Warning "  STATS_KEY not set: snapshot skipped. Set: `$env:STATS_KEY = 'your-key'"
  } else {
    Write-Host "  Triggering pre-clobber snapshot..."
    try {
      $r = Invoke-WebRequest "$WorkerUrl/snapshot?key=$env:STATS_KEY" -UseBasicParsing -TimeoutSec 30
      if ($r.StatusCode -eq 200) { Write-Host "  Snapshot OK" }
      else { Write-Warning "  Snapshot HTTP $($r.StatusCode)" }
    } catch {
      Write-Warning "  Snapshot failed: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds 2
  }
} else {
  Write-Host "  New tag -> will create release"
}

# ── [6/6] 업로드 ──────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[6/6] Uploading $($uploadList.Count) files to $Tag..." -ForegroundColor Cyan

if ($DryRun) {
  Write-Host "  [DRY RUN] files to upload:"
  $uploadList | ForEach-Object { Write-Host "    $_" }
} else {
  if ($tagExists) {
    & gh release upload $Tag --repo $Repo @($uploadList.ToArray()) --clobber
  } else {
    $createArgs = [System.Collections.Generic.List[string]]::new()
    $createArgs.Add($Tag)
    $createArgs.Add('--repo');  $createArgs.Add($Repo)
    $createArgs.Add('--title'); $createArgs.Add("MK11 Korean Patch $Tag")
    if ($Notes -and (Test-Path $Notes)) {
      $createArgs.Add('--notes-file'); $createArgs.Add($Notes)
    } else {
      $createArgs.Add('--notes'); $createArgs.Add('')
    }
    $uploadList | ForEach-Object { $createArgs.Add($_) }
    & gh release create @($createArgs.ToArray())
  }
  if ($LASTEXITCODE -ne 0) { Write-Error "gh failed (exit $LASTEXITCODE)" }
  Write-Host "  Upload OK"
}

# ── Defender 안내 (SHA256 변경 시에만) ────────────────────────────────────────
if ($defenderNeeded -and $currentHash) {
  Write-Host ""
  Write-Host "Defender submission may be needed:" -ForegroundColor Yellow
  Write-Host "  https://www.microsoft.com/en-us/wdsi/filesubmission"
  Write-Host "  SHA256: $currentHash"
  Write-Host "  URL   : https://github.com/KimHerV/mk11-korean-patch/releases/tag/$Tag"
}

Write-Host ""
Write-Host "Done." -ForegroundColor Green
