#!/usr/bin/env bash
# ==========================================================================================
#  MK11 Korean Patch: CLI Uninstaller (Steam Deck / Linux)
#  by KimHerV
#
#  Restores original game files from the local backup directory
#  and optionally removes the translation loader plugin
#  (CVD bypass) from Binaries/Retail/.
#
#  Launch: bash uninstall.sh
# ==========================================================================================

set -euo pipefail

APP_ID="976310"
CHS_NAME="Coalesced.CHS"
FONT_NAME="ui_c_inGameFonts_chs.xxx"
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
fail()    { printf "      ${RED}X${RESET}  %s\n" "$*"; printf "\n${RED}제거를 진행할 수 없어 종료합니다.${RESET}\n"; exit 1; }

# Top/bottom rules only. Korean is width-2 in terminals, so per-line side
# rails would mis-align. Cleaner this way regardless of text width.
print_header() {
    printf "\n"
    printf "${GOLD}================================================================================${RESET}\n"
    printf "  ${BOLD}MK11 Korean Patch: CLI Uninstaller (Steam Deck / Linux)${RESET}\n"
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

# ---- main ----
print_header

printf "  ${WHITE}${BOLD}이 스크립트는 한글 패치를 제거하고 게임 원본 파일을 복원합니다.${RESET}\n"
printf "\n"
printf "  ${WHITE}${BOLD}제거 절차:${RESET}\n"
printf "    ${GRAY}* 백업된 한글 번역 텍스트, 글리프 텍스처를 게임 폴더로 복원${RESET}\n"
printf "    ${GRAY}* 번역 로더 플러그인이 설치되어 있으면 게임 폴더에서 제거${RESET}\n"
printf "\n"
printf "  ${WHITE}백업 폴더는 보존됩니다. 필요 없으면 직접 삭제해 주세요.${RESET}\n"
printf "\n"
printf "  계속하려면 ${GOLD}Enter${RESET}, 취소하려면 ${GOLD}Ctrl+C${RESET}를 누르세요."
read -r _

# [1/4] game folder
step 1 4 "게임 폴더 탐색"
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
BACKUP_DIR="$GAME_PATH/_backup_korean_patch"

# [2/4] enumerate items to restore / remove
step 2 4 "제거 대상 확인"

RESTORE_CHS=0
RESTORE_FONT=0
[[ -f "$BACKUP_DIR/$CHS_NAME" ]]  && RESTORE_CHS=1
[[ -f "$BACKUP_DIR/$FONT_NAME" ]] && RESTORE_FONT=1

ASI_PRESENT=()
if [[ -d "$RETAIL_DIR" ]]; then
    for f in "${ASI_FILES[@]}"; do
        [[ -f "$RETAIL_DIR/$f" ]] && ASI_PRESENT+=("$f")
    done
fi

printf "      ${WHITE}${BOLD}복원 대상:${RESET}\n"
if [[ $RESTORE_CHS -eq 1 ]]; then
    printf "        ${GRAY}* %s (백업 발견, 복원)${RESET}\n" "$CHS_NAME"
else
    printf "        ${GRAY}* %s (백업 없음, 스킵)${RESET}\n" "$CHS_NAME"
fi
if [[ $RESTORE_FONT -eq 1 ]]; then
    printf "        ${GRAY}* %s (백업 발견, 복원)${RESET}\n" "$FONT_NAME"
else
    printf "        ${GRAY}* %s (백업 없음, 스킵)${RESET}\n" "$FONT_NAME"
fi

printf "\n"
printf "      ${WHITE}${BOLD}제거 대상:${RESET}\n"
if [[ ${#ASI_PRESENT[@]} -gt 0 ]]; then
    for f in "${ASI_PRESENT[@]}"; do
        printf "        ${GRAY}* %s (Binaries/Retail/)${RESET}\n" "$f"
    done
else
    printf "        ${GRAY}* 번역 로더 플러그인 설치되지 않음 (제거할 항목 없음)${RESET}\n"
fi

if [[ $RESTORE_CHS -eq 0 && $RESTORE_FONT -eq 0 && ${#ASI_PRESENT[@]} -eq 0 ]]; then
    printf "\n${GRAY}제거할 항목이 없습니다. 종료합니다.${RESET}\n"
    exit 0
fi

printf "\n"
printf "${GRAY}--------------------------------------------------------------------------------${RESET}\n"
printf "\n"
if ! ask_yesno "제거를 진행할까요?" "y"; then
    printf "\n${GRAY}취소되었습니다. 파일은 변경되지 않았습니다.${RESET}\n"
    exit 0
fi

# [3/4] restore content
step 3 4 "콘텐츠 복원"
if [[ $RESTORE_CHS -eq 1 ]]; then
    cp "$BACKUP_DIR/$CHS_NAME" "$LOC_DIR/$CHS_NAME"
    ok "$CHS_NAME 복원 완료"
else
    note "$CHS_NAME 백업 없음, 스킵"
fi
if [[ $RESTORE_FONT -eq 1 ]]; then
    cp "$BACKUP_DIR/$FONT_NAME" "$ASSET_DIR/$FONT_NAME"
    ok "$FONT_NAME 복원 완료"
else
    note "$FONT_NAME 백업 없음, 스킵"
fi

# [4/4] remove translation loader plugin
step 4 4 "번역 로더 플러그인 제거"
if [[ ${#ASI_PRESENT[@]} -gt 0 ]]; then
    for f in "${ASI_PRESENT[@]}"; do
        if rm "$RETAIL_DIR/$f" 2>/dev/null; then
            ok "$f 제거 완료"
        else
            warn "$f 제거 실패"
        fi
    done
else
    note "설치된 번역 로더 플러그인 없음, 스킵"
fi

# ---- completion ----
printf "\n${GREEN}${BOLD}제거 완료${RESET}\n\n"

printf "  ${BOLD}다음 단계${RESET}\n"
printf "    Steam -> MK11 속성 -> 언어 -> 원하는 언어로 다시 변경\n"
printf "\n"

printf "  ${BOLD}백업 폴더${RESET}\n"
printf "    ${DIM}%s${RESET}\n" "$BACKUP_DIR"
printf "    복원이 완료되었지만 백업 폴더는 보존됩니다.\n"
printf "    필요 없으시면 직접 삭제해 주세요.\n"
printf "\n"
