#!/usr/bin/env bash
# ==========================================================================================
#  MK11 Korean Patch: CLI Installer (Steam Deck / Linux)
#  by KimHerV
#
#  Downloads the latest patch from GitHub Releases and applies
#  it to the local game folder. Optionally installs the
#  translation loader plugin (CVD bypass) so the patch loads on
#  the 2026 build of MK11.
#
#  Launch: bash install.sh
# ==========================================================================================

set -euo pipefail

REPO="KimHerV/mk11-korean-patch"
BASE_URL="https://github.com/${REPO}/releases/latest/download"
API_URL="https://api.github.com/repos/${REPO}/releases/latest"
APP_ID="976310"
CHS_NAME="Coalesced.CHS"
FONT_NAME="ui_c_inGameFonts_chs.xxx"
CVD_ZIP_NAME="MK11-CVD-Bypass.zip"
ASI_FILES=(
    "ASIMK11.asi"
    "ASIMK11.ini"
    "dinput8.dll"
    "libsodium.dll"
    "libzmq-v120-mt-4_3_4.dll"
)

# ---- colors (disabled if not a TTY) ----
if [[ -t 1 ]]; then
    BOLD=$'\033[1m'; DIM=$'\033[2m'; RESET=$'\033[0m'
    GOLD=$'\033[38;5;220m'
    GREEN=$'\033[38;5;71m'
    YELLOW=$'\033[38;5;214m'
    RED=$'\033[38;5;167m'
    GRAY=$'\033[38;5;245m'
    WHITE=$'\033[38;5;255m'
else
    BOLD=''; DIM=''; RESET=''
    GOLD=''; GREEN=''; YELLOW=''; RED=''; GRAY=''; WHITE=''
fi

# ---- output helpers ----
step()    { printf "\n${GOLD}${BOLD}[%s/%s]${RESET} ${BOLD}%s${RESET}\n" "$1" "$2" "$3"; }
ok()      { printf "      ${GREEN}OK${RESET} %s\n" "$*"; }
note()    { printf "      ${GRAY}%s${RESET}\n" "$*"; }
warn()    { printf "      ${YELLOW}!${RESET}  %s\n" "$*"; }
fail()    { printf "      ${RED}X${RESET}  %s\n" "$*"; printf "\n${RED}설치를 진행할 수 없어 종료합니다.${RESET}\n"; exit 1; }

# Top/bottom rules only. Korean is width-2 in terminals, so per-line side
# rails would mis-align. Cleaner this way regardless of text width.
print_header() {
    printf "\n"
    printf "${GOLD}================================================================================${RESET}\n"
    printf "  ${BOLD}MK11 Korean Patch: CLI Installer (Steam Deck / Linux)${RESET}\n"
    printf "  ${DIM}by KimHerV${RESET}\n"
    printf "${GOLD}================================================================================${RESET}\n"
    printf "\n"
}

# Yes/no prompt with a default. Returns 0 (success) on yes, 1 on no.
ask_yesno() {
    local question="$1" default="${2:-y}"
    local hint
    if [[ "$default" == "y" ]]; then hint="[Y/n]"; else hint="[y/N]"; fi
    while true; do
        printf "      %s ${GRAY}%s${RESET} " "$question" "$hint"
        local reply=""
        read -r reply
        [[ -z "$reply" ]] && reply="$default"
        case "${reply,,}" in
            y|yes) return 0 ;;
            n|no)  return 1 ;;
            *)     printf "      ${YELLOW}y 또는 n으로 답해 주세요.${RESET}\n" ;;
        esac
    done
}

# ---- game path discovery (Steam libraries on Linux) ----
find_game_path() {
    local vdf_candidates=(
        "$HOME/.local/share/Steam/steamapps/libraryfolders.vdf"
        "$HOME/.steam/steam/steamapps/libraryfolders.vdf"
        "$HOME/.var/app/com.valvesoftware.Steam/data/Steam/steamapps/libraryfolders.vdf"
    )
    for vdf in "${vdf_candidates[@]}"; do
        [[ -f "$vdf" ]] || continue
        while IFS= read -r line; do
            if [[ "$line" =~ \"path\"[[:space:]]+\"([^\"]+)\" ]]; then
                local lib="${BASH_REMATCH[1]}"
                local acf="$lib/steamapps/appmanifest_${APP_ID}.acf"
                if [[ -f "$acf" ]]; then
                    local installdir
                    installdir=$(grep -Po '"installdir"\s+"\K[^"]+' "$acf" 2>/dev/null || true)
                    if [[ -n "$installdir" ]]; then
                        echo "$lib/steamapps/common/$installdir"
                        return 0
                    fi
                fi
            fi
        done < "$vdf"
    done
    return 1
}

# ---- SHA256 verification against SHA256SUMS.txt in the same dir ----
verify_sha256sums() {
    local dir="$1"
    local sums="$dir/SHA256SUMS.txt"
    [[ -f "$sums" ]] || return 1
    (cd "$dir" && sha256sum -c SHA256SUMS.txt) >/dev/null 2>&1
}

# ---- CVD bypass plugin explanation ----
print_cvd_explanation() {
    printf "\n"
    printf "      MK11 2026 빌드는 게임 파일 무결성을 검증하며,\n"
    printf "      수정된 파일(한글 패치 포함)을 로딩하지 않을 수\n"
    printf "      있습니다.\n"
    printf "\n"
    printf "      번역 로더 플러그인은 메모리에서 무결성 검사를\n"
    printf "      비활성화하여 한글 패치가 정상 동작하도록 합니다.\n"
    printf "\n"
    printf "      ${BOLD}설치되는 항목 (게임 폴더 Binaries/Retail/):${RESET}\n"
    printf "        ${GRAY}* dinput8.dll                Ultimate ASI Loader, MIT${RESET}\n"
    printf "        ${GRAY}* ASIMK11.asi, ASIMK11.ini   CVD 우회 본체${RESET}\n"
    printf "        ${GRAY}* libzmq, libsodium          런타임 의존성${RESET}\n"
    printf "\n"
    printf "      ${BOLD}본 플러그인이 수행하지 않는 일:${RESET}\n"
    printf "        ${GRAY}* 치트, 언락, DLC 우회, 승부 조작 등 부정 행위${RESET}\n"
    printf "        ${GRAY}* 게임 파일 디스크 변경 (메모리 패치만 수행)${RESET}\n"
    printf "        ${GRAY}* 게임 폴더 외 다른 파일, 프로그램 변경${RESET}\n"
    printf "        ${GRAY}* 외부 서버와의 통신 또는 사용자 정보 수집${RESET}\n"
    printf "\n"
    printf "      ${DIM}Steam Deck / Proton 환경 후속 안내는 설치 완료 후${RESET}\n"
    printf "      ${DIM}표시됩니다.${RESET}\n"
    printf "\n"
}

# ---- main ----
print_header

printf "  ${WHITE}${BOLD}이 스크립트가 설치하는 항목:${RESET}\n"
printf "    ${GRAY}* 한글 번역 텍스트 (53,000+ 항목)${RESET}\n"
printf "    ${GRAY}* 한글 글리프 텍스처 (나눔스퀘어 네오)${RESET}\n"
printf "    ${GRAY}* 번역 로더 플러그인 (선택, [3/6] 단계에서 결정)${RESET}\n"
printf "\n"
printf "  ${WHITE}원본 파일은 설치 전 자동 백업되며 게임 폴더의${RESET}\n"
printf "  ${WHITE}_backup_korean_patch/ 에 보존됩니다.${RESET}\n"
printf "\n"
printf "  계속하려면 ${GOLD}Enter${RESET}, 취소하려면 ${GOLD}Ctrl+C${RESET}를 누르세요."
read -r _

# [1/6] game folder
step 1 6 "게임 폴더 탐색"
GAME_PATH=""
if GAME_PATH=$(find_game_path 2>/dev/null) && [[ -n "$GAME_PATH" ]]; then
    ok "Steam 라이브러리에서 자동 감지"
    note "$GAME_PATH"
    if ! ask_yesno "이 폴더가 맞나요?" "y"; then
        printf "      ${GRAY}예: ~/.steam/steam/steamapps/common/Mortal Kombat 11${RESET}\n"
        printf "      게임 폴더 경로: "
        read -r GAME_PATH
        [[ -d "$GAME_PATH" ]] || fail "폴더가 존재하지 않습니다: $GAME_PATH"
    fi
else
    warn "자동 감지 실패. 수동 입력이 필요합니다."
    printf "      ${GRAY}예: ~/.steam/steam/steamapps/common/Mortal Kombat 11${RESET}\n"
    printf "      게임 폴더 경로: "
    read -r GAME_PATH
    [[ -d "$GAME_PATH" ]] || fail "폴더가 존재하지 않습니다: $GAME_PATH"
fi

LOC_DIR="$GAME_PATH/Localization"
ASSET_DIR="$GAME_PATH/Asset"
RETAIL_DIR="$GAME_PATH/Binaries/Retail"
[[ -d "$LOC_DIR" ]]   || fail "Localization/ 폴더 없음. MK11이 설치되어 있는지 확인하세요."
[[ -d "$ASSET_DIR" ]] || fail "Asset/ 폴더 없음. MK11이 설치되어 있는지 확인하세요."

# [2/6] latest version
step 2 6 "최신 버전 확인"
LATEST_TAG=""
LATEST_DATE=""
if command -v curl >/dev/null 2>&1; then
    REL_JSON=$(curl -fsSL -H "User-Agent: mk11-cli-installer" "$API_URL" 2>/dev/null || true)
    if [[ -n "$REL_JSON" ]]; then
        LATEST_TAG=$(echo "$REL_JSON" | grep -oP '"tag_name"\s*:\s*"\K[^"]+' | head -1 || true)
        # GitHub returns UTC ISO 8601. Convert to local time so the date
        # matches the user's calendar.
        LATEST_ISO=$(echo "$REL_JSON" | grep -oP '"published_at"\s*:\s*"\K[^"]+' | head -1 || true)
        if [[ -n "$LATEST_ISO" ]]; then
            LATEST_DATE=$(date -d "$LATEST_ISO" +%Y-%m-%d 2>/dev/null || echo "$LATEST_ISO" | cut -c1-10)
        fi
    fi
fi
if [[ -n "$LATEST_TAG" ]]; then
    ok "GitHub Releases: ${LATEST_TAG}${LATEST_DATE:+ (${LATEST_DATE})}"
else
    warn "최신 버전 정보를 가져오지 못했습니다. 그래도 진행합니다."
fi

# [3/6] CVD bypass plugin decision
step 3 6 "번역 로더 플러그인 설치 여부"
print_cvd_explanation
INSTALL_CVD=0
if ask_yesno "번역 로더 플러그인을 설치하시겠습니까?" "y"; then
    INSTALL_CVD=1
else
    note "번역 로더 플러그인 설치를 건너뜁니다."
    note "2026 빌드에서는 한글이 영문으로 폴백될 수 있습니다."
fi

# Final confirmation before any file changes.
printf "\n"
printf "${GRAY}--------------------------------------------------------------------------------${RESET}\n"
printf "\n"
if ! ask_yesno "위 정보로 설치를 진행할까요?" "y"; then
    printf "\n"
    printf "${GRAY}취소되었습니다. 파일은 변경되지 않았습니다.${RESET}\n"
    exit 0
fi

# [4/6] backup
step 4 6 "원본 파일 백업"
# Only game-original files are backed up (Coalesced.CHS, font asset).
# ASI plugin files in Binaries/Retail/ are not part of the original game
# install, so we don't back them up. To remove the plugin, the user simply
# deletes the five ASI files from Binaries/Retail/.
BACKUP_DIR="$GAME_PATH/_backup_korean_patch"
mkdir -p "$BACKUP_DIR"

back_one() {
    local src="$1" name="$2"
    local dst="$BACKUP_DIR/$name"
    if [[ -f "$src" && ! -f "$dst" ]]; then
        cp "$src" "$dst"
        ok "$name -> _backup_korean_patch/"
    elif [[ -f "$dst" ]]; then
        note "$name (기존 백업 보존)"
    else
        note "$name (원본 없음, 백업 스킵)"
    fi
}

back_one "$LOC_DIR/$CHS_NAME"    "$CHS_NAME"
back_one "$ASSET_DIR/$FONT_NAME" "$FONT_NAME"

# Verify Binaries/Retail/ exists when CVD bypass will be installed.
if [[ $INSTALL_CVD -eq 1 && ! -d "$RETAIL_DIR" ]]; then
    fail "Binaries/Retail/ 폴더 없음. MK11이 설치되어 있는지 확인하세요."
fi

# [5/6] download
step 5 6 "패치 파일 다운로드"
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

download() {
    local url="$1" out="$2" label="$3"
    printf "      ${BOLD}%s${RESET}\n" "$label"
    if curl -fL --progress-bar -o "$out" "$url"; then
        ok "$label 완료"
    else
        fail "$label 다운로드 실패: $url"
    fi
}

download "$BASE_URL/$CHS_NAME"  "$TMP_DIR/$CHS_NAME"  "$CHS_NAME"
download "$BASE_URL/$FONT_NAME" "$TMP_DIR/$FONT_NAME" "$FONT_NAME"
if [[ $INSTALL_CVD -eq 1 ]]; then
    download "$BASE_URL/$CVD_ZIP_NAME" "$TMP_DIR/$CVD_ZIP_NAME" "$CVD_ZIP_NAME"
fi

# [6/6] apply
step 6 6 "게임 폴더 적용"
cp "$TMP_DIR/$CHS_NAME"  "$LOC_DIR/$CHS_NAME"
ok "한글 번역 텍스트  -> Localization/"
cp "$TMP_DIR/$FONT_NAME" "$ASSET_DIR/$FONT_NAME"
ok "한글 글리프 텍스처 -> Asset/"

if [[ $INSTALL_CVD -eq 1 ]]; then
    EXTRACT_DIR="$TMP_DIR/cvd-extract"
    mkdir -p "$EXTRACT_DIR"
    if ! command -v unzip >/dev/null 2>&1; then
        fail "unzip 명령어를 찾을 수 없습니다. SteamOS/Linux 패키지 관리자로 설치 후 다시 시도하세요."
    fi
    if ! unzip -oq "$TMP_DIR/$CVD_ZIP_NAME" -d "$EXTRACT_DIR"; then
        fail "CVD 우회 zip 압축 해제 실패"
    fi

    if ! command -v sha256sum >/dev/null 2>&1; then
        warn "sha256sum 명령어 없음. 무결성 검증을 건너뜁니다."
    elif ! verify_sha256sums "$EXTRACT_DIR"; then
        fail "번역 로더 플러그인 무결성 검증 실패. 다운로드 파일이 손상되었거나 변조되었을 수 있습니다."
    else
        ok "번역 로더 플러그인 무결성 검증 통과"
    fi

    for f in "${ASI_FILES[@]}"; do
        cp "$EXTRACT_DIR/$f" "$RETAIL_DIR/$f"
    done
    ok "번역 로더 플러그인 5파일 -> Binaries/Retail/"

    # License notice preservation: ship the third-party notices alongside
    # the user's backup folder so the user can find it later if needed.
    if [[ -f "$EXTRACT_DIR/THIRD_PARTY_NOTICES.txt" ]]; then
        cp "$EXTRACT_DIR/THIRD_PARTY_NOTICES.txt" "$BACKUP_DIR/CVD_BYPASS_NOTICES.txt"
        ok "라이센스 표기 -> _backup_korean_patch/CVD_BYPASS_NOTICES.txt"
    fi
fi

# ---- completion ----
printf "\n${GREEN}${BOLD}설치 완료${RESET}\n\n"

printf "  ${BOLD}다음 단계${RESET}\n"
printf "    1. Steam -> MK11 속성 -> 언어 -> ${GOLD}중국어 간체${RESET}\n"
printf "    2. 게임을 실행하여 한글 표시 여부를 확인합니다.\n"
if [[ $INSTALL_CVD -eq 1 ]]; then
    printf "    3. 한글이 표시되지 않으면 Steam 시작 옵션에 다음을 추가합니다:\n"
    printf "       ${DIM}WINEDLLOVERRIDES=\"dinput8=n,b\" %%command%%${RESET}\n"
    printf "    4. 그래도 표시되지 않으면 사용 중인 Proton 버전과 함께\n"
    printf "       GitHub Issues에 제보 부탁드립니다.\n"
else
    printf "    3. 한글이 영문으로 표시되면 이 스크립트를 다시 실행하여\n"
    printf "       ${BOLD}[3/6]${RESET} 단계에서 ${GOLD}y${RESET}를 선택하세요.\n"
fi
printf "\n"

printf "  ${BOLD}복구${RESET}\n"
printf "    원본 파일은 ${DIM}_backup_korean_patch/${RESET} 폴더에 보존됩니다.\n"
if [[ $INSTALL_CVD -eq 1 ]]; then
    printf "    번역 로더 플러그인 라이센스 표기:\n"
    printf "    ${DIM}_backup_korean_patch/CVD_BYPASS_NOTICES.txt${RESET}\n"
fi
printf "\n"
