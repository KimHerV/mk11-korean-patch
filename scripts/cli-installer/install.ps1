# ==========================================================================================
#  MK11 Korean Patch: CLI Installer (Windows)
#  by KimHerV
#
#  Downloads the latest patch from GitHub Releases and applies
#  it to the local game folder. Optionally installs the
#  translation loader plugin (CVD bypass) so the patch loads on
#  the 2026 build of MK11.
#
#  Launch: double-click install.bat (it calls this script).
# ==========================================================================================

$ErrorActionPreference = 'Stop'

$Repo       = 'KimHerV/mk11-korean-patch'
$BaseUrl    = "https://github.com/$Repo/releases/latest/download"
$ApiUrl     = "https://api.github.com/repos/$Repo/releases/latest"
$AppId      = '976310'
$ChsName    = 'Coalesced.CHS'
$FontName   = 'ui_c_inGameFonts_chs.xxx'
$CvdZipName = 'MK11-CVD-Bypass.zip'
$AsiFiles   = @(
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
    Write-Host '설치를 진행할 수 없어 종료합니다.' -ForegroundColor Red
    exit 1
}

# Side rails (| |) are deliberately omitted from the header.
# Korean characters are width-2 and ASCII box math mis-aligns with them.
# Top/bottom rules only is robust regardless of text width.
function Print-Header {
    Write-Host ''
    Write-Host '================================================================================' -ForegroundColor Yellow
    Write-Host '  MK11 Korean Patch: CLI Installer (Windows)' -ForegroundColor White
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

# ---- SHA256 verification against SHA256SUMS.txt in the same dir ----
function Test-Sha256Sums ($dir) {
    $sumsPath = Join-Path $dir 'SHA256SUMS.txt'
    if (-not (Test-Path $sumsPath)) { return $false }
    $lines = Get-Content $sumsPath
    foreach ($line in $lines) {
        if ($line -match '^([a-f0-9]{64})\s+(\S+)$') {
            $expected = $Matches[1].ToLower()
            $name = $Matches[2]
            $path = Join-Path $dir $name
            if (-not (Test-Path $path)) { return $false }
            $actual = (Get-FileHash -Algorithm SHA256 $path).Hash.ToLower()
            if ($actual -ne $expected) { return $false }
        }
    }
    return $true
}

# ---- CVD bypass plugin explanation ----
function Print-CVDExplanation {
    Write-Host ''
    Write-Host '      MK11 2026 빌드는 게임 파일 무결성을 검증하며,'
    Write-Host '      수정된 파일(한글 패치 포함)을 로딩하지 않을 수'
    Write-Host '      있습니다.'
    Write-Host ''
    Write-Host '      번역 로더 플러그인은 메모리에서 무결성 검사를'
    Write-Host '      비활성화하여 한글 패치가 정상 동작하도록 합니다.'
    Write-Host ''
    Write-Host '      설치되는 항목 (게임 폴더 Binaries/Retail/):' -ForegroundColor White
    Write-Host '        * dinput8.dll                Ultimate ASI Loader, MIT' -ForegroundColor DarkGray
    Write-Host '        * ASIMK11.asi, ASIMK11.ini   CVD 우회 본체' -ForegroundColor DarkGray
    Write-Host '        * libzmq, libsodium          런타임 의존성' -ForegroundColor DarkGray
    Write-Host ''
    Write-Host '      본 플러그인이 수행하지 않는 일:' -ForegroundColor White
    Write-Host '        * 치트, 언락, DLC 우회, 승부 조작 등 부정 행위' -ForegroundColor DarkGray
    Write-Host '        * 게임 파일 디스크 변경 (메모리 패치만 수행)' -ForegroundColor DarkGray
    Write-Host '        * 게임 폴더 외 다른 파일, 프로그램 변경' -ForegroundColor DarkGray
    Write-Host '        * 외부 서버와의 통신 또는 사용자 정보 수집' -ForegroundColor DarkGray
    Write-Host ''
}

# ---- main ----
Print-Header

Write-Host '  이 스크립트가 설치하는 항목:' -ForegroundColor White
Write-Host '    * 한글 번역 텍스트 (53,000+ 항목)' -ForegroundColor DarkGray
Write-Host '    * 한글 글리프 텍스처 (나눔스퀘어 네오)' -ForegroundColor DarkGray
Write-Host '    * 번역 로더 플러그인 (선택, [3/6] 단계에서 결정)' -ForegroundColor DarkGray
Write-Host ''
Write-Host '  원본 파일은 설치 전 자동 백업되며 게임 폴더의' -ForegroundColor White
Write-Host '  _backup_korean_patch/ 에 보존됩니다.' -ForegroundColor White
Write-Host ''
Write-Host '  계속하려면 ' -NoNewline
Write-Host 'Enter' -ForegroundColor Yellow -NoNewline
Write-Host '를, 취소하려면 ' -NoNewline
Write-Host 'Ctrl+C' -ForegroundColor Yellow -NoNewline
Write-Host '를 누르세요.' -NoNewline
[void](Read-Host)

# [1/6] game folder
Write-Step 1 6 '게임 폴더 탐색'
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
if (-not (Test-Path $LocDir))   { Fail 'Localization/ 폴더 없음. MK11이 설치되어 있는지 확인하세요.' }
if (-not (Test-Path $AssetDir)) { Fail 'Asset/ 폴더 없음. MK11이 설치되어 있는지 확인하세요.' }

# [2/6] latest version
Write-Step 2 6 '최신 버전 확인'
$latestTag  = $null
$latestDate = $null
try {
    $rel = Invoke-RestMethod -Uri $ApiUrl -Headers @{ 'User-Agent' = 'mk11-cli-installer' } -TimeoutSec 10
    $latestTag = $rel.tag_name
    if ($rel.published_at) {
        try {
            # GitHub returns UTC ISO 8601. Convert to local time so the date
            # matches the user's calendar (KST publish near midnight UTC
            # shows up as the previous day if we don't convert).
            $latestDate = (Get-Date $rel.published_at).ToString('yyyy-MM-dd')
        } catch {
            $latestDate = $rel.published_at.Substring(0, 10)
        }
    }
} catch {}
if ($latestTag) {
    if ($latestDate) {
        Write-Ok "GitHub Releases: $latestTag ($latestDate)"
    } else {
        Write-Ok "GitHub Releases: $latestTag"
    }
} else {
    Write-Warn '최신 버전 정보를 가져오지 못했습니다. 그래도 진행합니다.'
}

# [3/6] CVD bypass plugin decision
Write-Step 3 6 '번역 로더 플러그인 설치 여부'
Print-CVDExplanation
$InstallCVD = Ask-YesNo '번역 로더 플러그인을 설치하시겠습니까?' 'y'
if (-not $InstallCVD) {
    Write-Note '번역 로더 플러그인 설치를 건너뜁니다.'
    Write-Note '2026 빌드에서는 한글이 영문으로 폴백될 수 있습니다.'
}

# Final confirmation before any file changes.
Write-Host ''
Write-Host '--------------------------------------------------------------------------------' -ForegroundColor DarkGray
Write-Host ''
if (-not (Ask-YesNo '위 정보로 설치를 진행할까요?' 'y')) {
    Write-Host ''
    Write-Host '취소되었습니다. 파일은 변경되지 않았습니다.' -ForegroundColor DarkGray
    exit 0
}

# [4/6] backup
# Only game-original files are backed up (Coalesced.CHS, font asset).
# ASI plugin files in Binaries/Retail/ are not part of the original game
# install, so we don't back them up. To remove the plugin, the user simply
# deletes the five ASI files from Binaries/Retail/.
Write-Step 4 6 '원본 파일 백업'
$BackupDir = Join-Path $GamePath '_backup_korean_patch'
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}
function Backup-One ($src, $name) {
    $dst = Join-Path $BackupDir $name
    if ((Test-Path $src) -and (-not (Test-Path $dst))) {
        Copy-Item $src $dst
        Write-Ok "$name -> _backup_korean_patch/"
    } elseif (Test-Path $dst) {
        Write-Note "$name (기존 백업 보존)"
    } else {
        Write-Note "$name (원본 없음, 백업 스킵)"
    }
}
Backup-One (Join-Path $LocDir   $ChsName)  $ChsName
Backup-One (Join-Path $AssetDir $FontName) $FontName

# Verify Binaries/Retail/ exists when CVD bypass will be installed.
if ($InstallCVD -and (-not (Test-Path $RetailDir))) {
    Fail "Binaries\Retail\ 폴더 없음. MK11이 설치되어 있는지 확인하세요."
}

# [5/6] download
Write-Step 5 6 '패치 파일 다운로드'
$TmpDir = Join-Path $env:TEMP "mk11-cli-$(Get-Random)"
New-Item -ItemType Directory -Path $TmpDir -Force | Out-Null

function Download-One ($url, $out, $label) {
    Write-Host "      $label" -ForegroundColor White
    try {
        $ProgressPreference = 'Continue'
        Invoke-WebRequest -Uri $url -OutFile $out `
            -Headers @{ 'User-Agent' = 'mk11-cli-installer' } -UseBasicParsing
        Write-Ok "$label 완료"
    } catch {
        Fail "$label 다운로드 실패: $_"
    }
}
Download-One "$BaseUrl/$ChsName"  (Join-Path $TmpDir $ChsName)  $ChsName
Download-One "$BaseUrl/$FontName" (Join-Path $TmpDir $FontName) $FontName
if ($InstallCVD) {
    Download-One "$BaseUrl/$CvdZipName" (Join-Path $TmpDir $CvdZipName) $CvdZipName
}

# [6/6] apply
Write-Step 6 6 '게임 폴더 적용'
Copy-Item (Join-Path $TmpDir $ChsName)  (Join-Path $LocDir   $ChsName)  -Force
Write-Ok '한글 번역 텍스트  -> Localization/'
Copy-Item (Join-Path $TmpDir $FontName) (Join-Path $AssetDir $FontName) -Force
Write-Ok '한글 글리프 텍스처 -> Asset/'

if ($InstallCVD) {
    $ExtractDir = Join-Path $TmpDir 'cvd-extract'
    New-Item -ItemType Directory -Path $ExtractDir -Force | Out-Null
    try {
        Expand-Archive -Path (Join-Path $TmpDir $CvdZipName) -DestinationPath $ExtractDir -Force
    } catch {
        Fail "CVD 우회 zip 압축 해제 실패: $_"
    }

    # Verify SHA256 integrity using the SHA256SUMS.txt shipped in the zip.
    if (-not (Test-Sha256Sums $ExtractDir)) {
        Fail '번역 로더 플러그인 무결성 검증 실패. 다운로드 파일이 손상되었거나 변조되었을 수 있습니다.'
    }
    Write-Ok '번역 로더 플러그인 무결성 검증 통과'

    foreach ($f in $AsiFiles) {
        Copy-Item (Join-Path $ExtractDir $f) (Join-Path $RetailDir $f) -Force
    }
    Write-Ok '번역 로더 플러그인 5파일 -> Binaries/Retail/'

    # License notice preservation: ship the third-party notices alongside
    # the user's backup folder so the user can find it later if needed.
    $noticesSrc = Join-Path $ExtractDir 'THIRD_PARTY_NOTICES.txt'
    if (Test-Path $noticesSrc) {
        Copy-Item $noticesSrc (Join-Path $BackupDir 'CVD_BYPASS_NOTICES.txt') -Force
        Write-Ok '라이센스 표기 -> _backup_korean_patch/CVD_BYPASS_NOTICES.txt'
    }
}

Remove-Item -Recurse -Force $TmpDir -ErrorAction SilentlyContinue

# ---- completion ----
Write-Host ''
Write-Host '설치 완료' -ForegroundColor Green
Write-Host ''
Write-Host '  다음 단계' -ForegroundColor White
Write-Host '    1. Steam -> MK11 속성 -> 언어 -> ' -NoNewline
Write-Host '중국어 간체' -ForegroundColor Yellow
if (-not $InstallCVD) {
    Write-Host '    2. 2026 빌드에서 한글이 영문으로 표시되면 이 스크립트를'
    Write-Host '       다시 실행하여 [3/6] 단계에서 Y를 선택하세요.'
}
Write-Host ''
Write-Host '  복구' -ForegroundColor White
Write-Host '    원본 파일은 _backup_korean_patch/ 폴더에 보존됩니다.'
if ($InstallCVD) {
    Write-Host '    번역 로더 플러그인 라이센스 표기:'
    Write-Host '    _backup_korean_patch/CVD_BYPASS_NOTICES.txt'
}
Write-Host ''
