import hashlib
import json
import os
import shutil
import subprocess
import winreg
from datetime import date

APP_VERSION       = '1.0'
APP_BUILD_DATE    = '2026-05-04'
APPDATA_DIR       = os.path.join(os.environ['APPDATA'], 'MK11KoreanPatch')
PATCH_FILES_DIR   = os.path.join(APPDATA_DIR, 'patch_files')
BACKUP_DIR_NAME   = '_backup_korean_patch'
UNINSTALL_REG     = r'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\MK11KoreanPatch'
INSTALLER_EXE_NAME = 'MK11-Korean-Patch-Setup.exe'

PATCH_FILE_DIRS = {
    'Coalesced.CHS':            'Localization',
    'ui_c_inGameFonts_chs.xxx': 'Asset',
    'dinput8.dll':              os.path.join('Binaries', 'Retail'),
    'ASIMK11.asi':              os.path.join('Binaries', 'Retail'),
    'ASIMK11.ini':              os.path.join('Binaries', 'Retail'),
    'libzmq-v120-mt-4_3_4.dll': os.path.join('Binaries', 'Retail'),
}

# ── Path Detection ───────────────────────────────────────────

def validate_game_path(path: str) -> dict:
    if not path or not os.path.isdir(path):
        return {'ok': False, 'reason': '폴더가 존재하지 않습니다.'}
    missing = []
    if not os.path.isdir(os.path.join(path, 'Localization')):
        missing.append('Localization/')
    if not os.path.isdir(os.path.join(path, 'Binaries', 'Retail')):
        missing.append('Binaries/Retail/')
    loc = os.path.join(path, 'Localization')
    has_coalesced = (
        os.path.exists(os.path.join(loc, 'Coalesced.ENG')) or
        os.path.exists(os.path.join(loc, 'Coalesced.CHS'))
    )
    if not has_coalesced:
        missing.append('Localization/Coalesced.ENG (또는 CHS)')
    if missing:
        return {'ok': False, 'reason': '누락: ' + ', '.join(missing)}
    return {'ok': True}

def _steam_library_paths(steam_root: str) -> list:
    paths = [steam_root]
    vdf = os.path.join(steam_root, 'steamapps', 'libraryfolders.vdf')
    if not os.path.exists(vdf):
        return paths
    try:
        import re
        with open(vdf, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        for m in re.finditer(r'"path"\s+"([^"]+)"', content):
            p = m.group(1).replace('\\\\', '\\')
            if p not in paths:
                paths.append(p)
    except Exception:
        pass
    return paths


def _mk11_path_from_acf(lib: str) -> str:
    import re
    acf = os.path.join(lib, 'steamapps', 'appmanifest_976310.acf')
    if os.path.exists(acf):
        try:
            with open(acf, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            m = re.search(r'"installdir"\s+"([^"]+)"', content)
            if m:
                return os.path.join(lib, 'steamapps', 'common', m.group(1))
        except Exception:
            pass
    # fallback: common folder name variants
    for name in ['Mortal Kombat 11', 'Mortal Kombat 11 Ultimate', 'MortalKombat11']:
        p = os.path.join(lib, 'steamapps', 'common', name)
        if os.path.isdir(p):
            return p
    return ''


def detect_steam() -> str:
    try:
        steam_root = ''
        for hive in [winreg.HKEY_LOCAL_MACHINE, winreg.HKEY_CURRENT_USER]:
            for sub in [r'SOFTWARE\WOW6432Node\Valve\Steam', r'SOFTWARE\Valve\Steam']:
                try:
                    with winreg.OpenKey(hive, sub, access=winreg.KEY_READ) as k:
                        steam_root = winreg.QueryValueEx(k, 'InstallPath')[0]
                    break
                except Exception:
                    pass
            if steam_root:
                break
        if not steam_root:
            return ''
        for lib in _steam_library_paths(steam_root):
            path = _mk11_path_from_acf(lib)
            if path and validate_game_path(path)['ok']:
                return path
    except Exception:
        pass
    return ''


def detect_epic() -> str:
    try:
        manifests = os.path.join(os.environ.get('PROGRAMDATA', 'C:\\ProgramData'),
                                 'Epic', 'EpicGamesLauncher', 'Data', 'Manifests')
        if not os.path.isdir(manifests):
            return ''
        for fname in os.listdir(manifests):
            if not fname.endswith('.item'):
                continue
            try:
                with open(os.path.join(manifests, fname), 'r',
                          encoding='utf-8', errors='ignore') as f:
                    data = json.load(f)
                display = data.get('DisplayName', '')
                # AppName is a UUID hash, unreliable. Use DisplayName only.
                if 'Mortal Kombat 11' in display:
                    loc = data.get('InstallLocation', '')
                    if validate_game_path(loc)['ok']:
                        return loc
            except Exception:
                pass
    except Exception:
        pass
    return ''

# ── Installation ─────────────────────────────────────────────

def do_backup(game_path: str, report=None):
    backup_dir = os.path.join(game_path, BACKUP_DIR_NAME)
    os.makedirs(backup_dir, exist_ok=True)
    for filename, rel_dir in PATCH_FILE_DIRS.items():
        src = os.path.join(game_path, rel_dir, filename)
        dst = os.path.join(backup_dir, filename)
        if os.path.exists(src) and not os.path.exists(dst):
            shutil.copy2(src, dst)
    if report:
        report('원본 파일 백업 완료')

def copy_to_appdata(report=None):
    os.makedirs(PATCH_FILES_DIR, exist_ok=True)

    # patch_files location: relative to the executable (PyInstaller bundle or dev mode)
    import sys
    if getattr(sys, 'frozen', False):
        base = sys._MEIPASS
    else:
        base = os.path.dirname(os.path.abspath(__file__))

    src_dir = os.path.join(base, 'payload')
    for filename in PATCH_FILE_DIRS:
        src = os.path.join(src_dir, filename)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(PATCH_FILES_DIR, filename))
    if report:
        report('AppData 파일 복사 완료')

def copy_to_game(game_path: str, report=None):
    for filename, rel_dir in PATCH_FILE_DIRS.items():
        src = os.path.join(PATCH_FILES_DIR, filename)
        if not os.path.exists(src):
            continue
        dst_dir = os.path.join(game_path, rel_dir)
        os.makedirs(dst_dir, exist_ok=True)
        shutil.copy2(src, os.path.join(dst_dir, filename))
    if report:
        report('패치 파일 적용 완료')

def copy_manager(report=None):
    import sys
    if getattr(sys, 'frozen', False):
        base = sys._MEIPASS
    else:
        base = os.path.dirname(os.path.abspath(__file__))
    src = os.path.join(base, 'mk11_kor_manager.exe')
    dst = os.path.join(APPDATA_DIR, 'mk11_kor_manager.exe')
    if os.path.exists(src):
        shutil.copy2(src, dst)
    if report:
        report('MK11KoreanPatch 설치 완료')

def copy_installer_to_appdata(report=None):
    import sys
    if not getattr(sys, 'frozen', False):
        if report: report('개발 환경: 인스톨러 복사 건너뜀')
        return
    src = sys.executable
    dst = os.path.join(APPDATA_DIR, INSTALLER_EXE_NAME)
    os.makedirs(APPDATA_DIR, exist_ok=True)
    shutil.copy2(src, dst)
    if report:
        report('언인스톨러 저장 완료')

def _sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()

def write_config(game_path: str, report=None):
    coalesced = os.path.join(PATCH_FILES_DIR, 'Coalesced.CHS')
    patch_hash = _sha256(coalesced) if os.path.exists(coalesced) else ''
    config = {
        'game_path': game_path,
        'installed_version': APP_VERSION,
        'installed_build_date': APP_BUILD_DATE,
        'backup_date': date.today().isoformat(),
        'patch_hash': patch_hash,
    }
    os.makedirs(APPDATA_DIR, exist_ok=True)
    with open(os.path.join(APPDATA_DIR, 'config.json'), 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    if report:
        report('설정 파일 저장 완료')

def create_shortcuts(report=None):
    resolver = os.path.join(APPDATA_DIR, 'mk11_kor_manager.exe')
    desktop  = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'Mortal Kombat 11 Korean Patch Manager.lnk')
    startmenu_dir = os.path.join(os.environ['APPDATA'],
                                 'Microsoft', 'Windows', 'Start Menu', 'Programs')
    startmenu = os.path.join(startmenu_dir, 'Mortal Kombat 11 Korean Patch Manager.lnk')

    for target_lnk in [desktop, startmenu]:
        script = (
            f'$ws = New-Object -ComObject WScript.Shell; '
            f'$s = $ws.CreateShortcut("{target_lnk}"); '
            f'$s.TargetPath = "{resolver}"; '
            f'$s.IconLocation = "{resolver}"; '
            f'$s.Save()'
        )
        subprocess.run(['powershell', '-NoProfile', '-Command', script],
                       capture_output=True)
    if report:
        report('바탕화면·시작 메뉴 바로 가기 생성 완료')

def register_uninstaller(report=None):
    resolver = os.path.join(APPDATA_DIR, 'mk11_kor_manager.exe')
    try:
        with winreg.CreateKey(winreg.HKEY_CURRENT_USER, UNINSTALL_REG) as k:
            winreg.SetValueEx(k, 'DisplayName',     0, winreg.REG_SZ,    'MK11 한글 패치')
            winreg.SetValueEx(k, 'DisplayVersion',  0, winreg.REG_SZ,    f'v{APP_VERSION} ({APP_BUILD_DATE})')
            winreg.SetValueEx(k, 'Publisher',       0, winreg.REG_SZ,    'KimHerV')
            winreg.SetValueEx(k, 'URLInfoAbout',    0, winreg.REG_SZ,
                              'https://mk11-korean-patch.pages.dev')
            installer_path = os.path.join(APPDATA_DIR, INSTALLER_EXE_NAME)
            winreg.SetValueEx(k, 'UninstallString', 0, winreg.REG_SZ,
                              f'"{installer_path}" --uninstall')
            winreg.SetValueEx(k, 'InstallLocation', 0, winreg.REG_SZ,    APPDATA_DIR)
            winreg.SetValueEx(k, 'NoModify',        0, winreg.REG_DWORD, 1)
            winreg.SetValueEx(k, 'NoRepair',        0, winreg.REG_DWORD, 1)
    except Exception:
        pass
    if report:
        report('언인스톨러 등록 완료')

# ── Uninstall ────────────────────────────────────────────────

def uninstall(report=None) -> dict:
    config_path = os.path.join(APPDATA_DIR, 'config.json')
    game_path = ''
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            game_path = json.load(f).get('game_path', '')
    except Exception:
        pass

    restore_results = []   # [{file, status, note}]

    if report: report('게임 파일 복구 중...', 10)

    if game_path and os.path.isdir(game_path):
        backup_dir = os.path.join(game_path, BACKUP_DIR_NAME)
        if os.path.isdir(backup_dir):
            for filename, rel_dir in PATCH_FILE_DIRS.items():
                src = os.path.join(backup_dir, filename)
                dst = os.path.join(game_path, rel_dir, filename)
                if os.path.exists(src):
                    try:
                        shutil.copy2(src, dst)
                        h_src = _sha256(src)
                        h_dst = _sha256(dst) if os.path.exists(dst) else ''
                        ok = h_src == h_dst
                        restore_results.append({
                            'file': filename,
                            'status': 'ok' if ok else 'mismatch',
                            'note': '원본 복구 완료' if ok else '해시 불일치',
                        })
                    except Exception as e:
                        restore_results.append({'file': filename, 'status': 'error', 'note': str(e)})
                else:
                    # no backup = file was added by patch (not in original) → delete
                    if os.path.exists(dst):
                        try:
                            os.remove(dst)
                            restore_results.append({'file': filename, 'status': 'removed', 'note': '패치 파일 제거'})
                        except Exception as e:
                            restore_results.append({'file': filename, 'status': 'error', 'note': str(e)})
            shutil.rmtree(backup_dir, ignore_errors=True)
        else:
            restore_results.append({'file': '(백업 없음)', 'status': 'no_backup', 'note': '이미 복구됐거나 패치 미설치 상태'})

    if report: report('게임 파일 복구 완료', 40)

    # remove CVD plugin files
    if game_path and os.path.isdir(game_path):
        if report: report('CVD 플러그인 제거 중...', 55)
        for filename in ['dinput8.dll', 'ASIMK11.asi', 'ASIMK11.ini', 'libzmq-v120-mt-4_3_4.dll']:
            p = os.path.join(game_path, 'Binaries', 'Retail', filename)
            if os.path.exists(p):
                try:
                    os.remove(p)
                    restore_results.append({'file': filename, 'status': 'removed', 'note': '플러그인 제거'})
                except Exception as e:
                    restore_results.append({'file': filename, 'status': 'error', 'note': str(e)})

    if report: report('바로 가기 정리 중...', 70)

    for lnk in [
        os.path.join(os.environ['USERPROFILE'], 'Desktop', 'Mortal Kombat 11 Korean Patch Manager.lnk'),
        os.path.join(os.environ['APPDATA'], 'Microsoft', 'Windows',
                     'Start Menu', 'Programs', 'Mortal Kombat 11 Korean Patch Manager.lnk'),
    ]:
        if os.path.exists(lnk):
            try:
                os.remove(lnk)
            except Exception:
                pass

    if report: report('레지스트리 정리 중...', 82)

    try:
        winreg.DeleteKey(winreg.HKEY_CURRENT_USER, UNINSTALL_REG)
    except Exception:
        pass

    if report: report('설정 파일 정리 중...', 92)

    shutil.rmtree(APPDATA_DIR, ignore_errors=True)

    if report:
        report('언인스톨 완료', 100)

    return {'ok': True, 'restore_results': restore_results}
