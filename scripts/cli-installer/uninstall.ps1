# ==========================================================================================
#  MK11 Korean Patch: CLI Uninstaller (Windows)
#  by KimHerV
#
#  Restores original game files from the local backup directory
#  and optionally removes the translation loader plugin
#  (CVD bypass) from Binaries/Retail/.
#
#  Launch: double-click uninstall.bat (it calls this script).
# ==========================================================================================

$ErrorActionPreference = 'Stop'

$AppId    = '976310'
$ChsName  = 'Coalesced.CHS'
$FontName = 'ui_c_inGameFonts_chs.xxx'
$AsiFiles = @(
    'ASIMK11.asi',
    'ASIMK11.ini',
    'dinput8.dll',
    'libsodium.dll',
    'libzmq-v120-mt-4_3_4.dll'
)

# ---- output helpers ----
function Write-Step ($num, $total, $msg) {
    Write-Host ''
    Write-Host "[$num/$total] " -ForegroundColor Yellow -NoNewline
    Write-Host $msg -ForegroundColor White
}
function Write-Ok ($msg)   { Write-Host '      ' -NoNewline; Write-Host 'OK ' -ForegroundColor Green -NoNewline; Write-Host $msg }
function Write-Note ($msg) { Write-Host "      $msg" -ForegroundColor DarkGray }
function Write-Warn ($msg) { Write-Host '      ' -NoNewline; Write-Host '!  ' -ForegroundColor Yellow -NoNewline; Write-Host $msg }
function Fail ($msg) {
    Write-Host '      ' -NoNewline; Write-Host 'X  ' -ForegroundColor Red -NoNewline; Write-Host $msg
    Write-Host ''
    Write-Host '제거를 진행할 수 없어 종료합니다.' -ForegroundColor Red
    exit 1
}

# Top/bottom rules only. Korean is width-2 in terminals, so per-line side
# rails would mis-align. Cleaner this way regardless of text width.
function Print-Header {
    Write-Host ''
    Write-Host '================================================================================' -ForegroundColor Yellow
    Write-Host '  MK11 Korean Patch: CLI Uninstaller (Windows)' -ForegroundColor White
    Write-Host '  by KimHerV' -ForegroundColor DarkGray
    Write-Host '================================================================================' -ForegroundColor Yellow
    Write-Host ''
}

# Ask a yes/no question with a default. Returns $true on yes, $false on no.
function Ask-YesNo ($question, $default = 'y') {
    $hint = if ($default -eq 'y') { '[Y/n]' } else { '[y/N]' }
    while ($true) {
        Write-Host '      ' -NoNewline
        Write-Host "$question " -NoNewline
        Write-Host $hint -ForegroundColor DarkGray -NoNewline
        Write-Host ' ' -NoNewline
        $input = Read-Host
        if (-not $input) { $input = $default }
        switch ($input.ToLower()) {
            'y'   { return $true }
            'yes' { return $true }
            'n'   { return $false }
            'no'  { return $false }
            default {
                Write-Host '      y 또는 n으로 답해 주세요.' -ForegroundColor DarkYellow
            }
        }
    }
}

# ---- Steam library / game path discovery ----
function Find-SteamRoot {
    $hives = @(
        'HKLM:\SOFTWARE\WOW6432Node\Valve\Steam',
        'HKLM:\SOFTWARE\Valve\Steam',
        'HKCU:\SOFTWARE\WOW6432Node\Valve\Steam',
        'HKCU:\SOFTWARE\Valve\Steam'
    )
    foreach ($h in $hives) {
        try {
            $v = (Get-ItemProperty -Path $h -Name InstallPath -ErrorAction Stop).InstallPath
            if ($v) { return $v }
        } catch {}
    }
    return $null
}

function Find-GamePath {
    $steamRoot = Find-SteamRoot
    if (-not $steamRoot) { return $null }

    $libs = @($steamRoot)
    $vdf = Join-Path $steamRoot 'steamapps\libraryfolders.vdf'
    if (Test-Path $vdf) {
        $content = Get-Content $vdf -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $found = [regex]::Matches($content, '"path"\s+"([^"]+)"')
            foreach ($m in $found) {
                $p = $m.Groups[1].Value -replace '\\\\', '\'
                if ($libs -notcontains $p) { $libs += $p }
            }
        }
    }

    foreach ($lib in $libs) {
        $acf = Join-Path $lib "steamapps\appmanifest_$AppId.acf"
        if (Test-Path $acf) {
            $acfContent = Get-Content $acf -Raw -ErrorAction SilentlyContinue
            if ($acfContent -and ($acfContent -match '"installdir"\s+"([^"]+)"')) {
                $path = Join-Path $lib "steamapps\common\$($Matches[1])"
                if (Test-Path $path) { return $path }
            }
        }
    }
    return $null
}

# ---- main ----
Print-Header

Write-Host '  이 스크립트는 한글 패치를 제거하고 게임 원본 파일을 복원합니다.' -ForegroundColor White
Write-Host ''
Write-Host '  제거 절차:' -ForegroundColor White
Write-Host '    * 백업된 한글 번역 텍스트, 글리프 텍스처를 게임 폴더로 복원' -ForegroundColor DarkGray
Write-Host '    * 번역 로더 플러그인이 설치되어 있으면 게임 폴더에서 제거' -ForegroundColor DarkGray
Write-Host ''
Write-Host '  백업 폴더는 보존됩니다. 필요 없으면 직접 삭제해 주세요.' -ForegroundColor White
Write-Host ''
Write-Host '  계속하려면 ' -NoNewline
Write-Host 'Enter' -ForegroundColor Yellow -NoNewline
Write-Host '를, 취소하려면 ' -NoNewline
Write-Host 'Ctrl+C' -ForegroundColor Yellow -NoNewline
Write-Host '를 누르세요.' -NoNewline
[void](Read-Host)

# [1/4] game folder
Write-Step 1 4 '게임 폴더 탐색'
$GamePath = Find-GamePath
if ($GamePath) {
    Write-Ok 'Steam 라이브러리에서 자동 감지'
    Write-Note $GamePath
    if (-not (Ask-YesNo '이 폴더가 맞나요?' 'y')) {
        Write-Host '      예: C:\Program Files (x86)\Steam\steamapps\common\Mortal Kombat 11' -ForegroundColor DarkGray
        $GamePath = Read-Host '      게임 폴더 경로'
        if (-not (Test-Path $GamePath)) { Fail "폴더가 존재하지 않습니다: $GamePath" }
    }
} else {
    Write-Warn '자동 감지 실패. 수동 입력이 필요합니다.'
    Write-Host '      예: C:\Program Files (x86)\Steam\steamapps\common\Mortal Kombat 11' -ForegroundColor DarkGray
    $GamePath = Read-Host '      게임 폴더 경로'
    if (-not (Test-Path $GamePath)) { Fail "폴더가 존재하지 않습니다: $GamePath" }
}

$LocDir    = Join-Path $GamePath 'Localization'
$AssetDir  = Join-Path $GamePath 'Asset'
$RetailDir = Join-Path $GamePath 'Binaries\Retail'
$BackupDir = Join-Path $GamePath '_backup_korean_patch'

# [2/4] enumerate items to restore / remove
Write-Step 2 4 '제거 대상 확인'

$RestoreChs  = (Test-Path (Join-Path $BackupDir $ChsName))
$RestoreFont = (Test-Path (Join-Path $BackupDir $FontName))

$AsiPresent = @()
if (Test-Path $RetailDir) {
    foreach ($f in $AsiFiles) {
        if (Test-Path (Join-Path $RetailDir $f)) { $AsiPresent += $f }
    }
}

Write-Host '      복원 대상:' -ForegroundColor White
if ($RestoreChs) {
    Write-Host "        * $ChsName (백업 발견, 복원)" -ForegroundColor DarkGray
} else {
    Write-Host "        * $ChsName (백업 없음, 스킵)" -ForegroundColor DarkGray
}
if ($RestoreFont) {
    Write-Host "        * $FontName (백업 발견, 복원)" -ForegroundColor DarkGray
} else {
    Write-Host "        * $FontName (백업 없음, 스킵)" -ForegroundColor DarkGray
}

Write-Host ''
Write-Host '      제거 대상:' -ForegroundColor White
if ($AsiPresent.Count -gt 0) {
    foreach ($f in $AsiPresent) {
        Write-Host "        * $f (Binaries/Retail/)" -ForegroundColor DarkGray
    }
} else {
    Write-Host '        * 번역 로더 플러그인 설치되지 않음 (제거할 항목 없음)' -ForegroundColor DarkGray
}

if (-not $RestoreChs -and -not $RestoreFont -and $AsiPresent.Count -eq 0) {
    Write-Host ''
    Write-Host '제거할 항목이 없습니다. 종료합니다.' -ForegroundColor DarkGray
    exit 0
}

Write-Host ''
Write-Host '--------------------------------------------------------------------------------' -ForegroundColor DarkGray
Write-Host ''
if (-not (Ask-YesNo '제거를 진행할까요?' 'y')) {
    Write-Host ''
    Write-Host '취소되었습니다. 파일은 변경되지 않았습니다.' -ForegroundColor DarkGray
    exit 0
}

# [3/4] restore content
Write-Step 3 4 '콘텐츠 복원'
if ($RestoreChs) {
    Copy-Item (Join-Path $BackupDir $ChsName) (Join-Path $LocDir $ChsName) -Force
    Write-Ok "$ChsName 복원 완료"
} else {
    Write-Note "$ChsName 백업 없음, 스킵"
}
if ($RestoreFont) {
    Copy-Item (Join-Path $BackupDir $FontName) (Join-Path $AssetDir $FontName) -Force
    Write-Ok "$FontName 복원 완료"
} else {
    Write-Note "$FontName 백업 없음, 스킵"
}

# [4/4] remove translation loader plugin
Write-Step 4 4 '번역 로더 플러그인 제거'
if ($AsiPresent.Count -gt 0) {
    foreach ($f in $AsiPresent) {
        try {
            Remove-Item (Join-Path $RetailDir $f) -Force
            Write-Ok "$f 제거 완료"
        } catch {
            Write-Warn "$f 제거 실패: $_"
        }
    }
} else {
    Write-Note '설치된 번역 로더 플러그인 없음, 스킵'
}

# ---- completion ----
Write-Host ''
Write-Host '제거 완료' -ForegroundColor Green
Write-Host ''
Write-Host '  다음 단계' -ForegroundColor White
Write-Host '    Steam -> MK11 속성 -> 언어 -> 원하는 언어로 다시 변경'
Write-Host ''
Write-Host '  백업 폴더' -ForegroundColor White
Write-Host "    $BackupDir" -ForegroundColor DarkGray
Write-Host '    복원이 완료되었지만 백업 폴더는 보존됩니다.'
Write-Host '    필요 없으시면 직접 삭제해 주세요.'
Write-Host ''
