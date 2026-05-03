import hashlib
import os
import re
import shutil
import subprocess
import winreg

from config import Config

APPDATA_DIR      = os.path.join(os.environ['APPDATA'], 'MK11KoreanPatch')
PATCH_FILES_DIR  = os.path.join(APPDATA_DIR, 'patch_files')
BACKUP_DIR_NAME  = '_backup_korean_patch'
UNINSTALL_REG    = r'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\MK11KoreanPatch'

CVD_FILES = [
    'dinput8.dll',
    'ASIMK11.asi',
    'ASIMK11.ini',
    'libzmq-v120-mt-4_3_4.dll',
]
CVD_DIR = os.path.join('Binaries', 'Retail')


def _sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()

PATCH_FILE_DIRS = {
    'Coalesced.CHS':              'Localization',
    'ui_c_inGameFonts_chs.xxx':   'Asset',
    'dinput8.dll':                 os.path.join('Binaries', 'Retail'),
    'ASIMK11.asi':                 os.path.join('Binaries', 'Retail'),
    'ASIMK11.ini':                 os.path.join('Binaries', 'Retail'),
    'libzmq-v120-mt-4_3_4.dll':   os.path.join('Binaries', 'Retail'),
}

ANCHOR_FILE = 'Coalesced.CHS'


def validate_game_path(path: str) -> dict:
    checks = [
        (os.path.join(path, 'Localization'),       'Localization/ 폴더'),
        (os.path.join(path, 'Binaries', 'Retail'), 'Binaries/Retail/ 폴더'),
    ]
    missing = [label for p, label in checks if not os.path.isdir(p)]
    loc_dir = os.path.join(path, 'Localization')
    has_coalesced = (
        os.path.exists(os.path.join(loc_dir, 'Coalesced.ENG')) or
        os.path.exists(os.path.join(loc_dir, 'Coalesced.CHS'))
    )
    if not has_coalesced:
        missing.append('Localization/Coalesced.ENG (또는 CHS)')
    if missing:
        return {'ok': False, 'reason': '올바른 MK11 폴더가 아닙니다. 누락: ' + ', '.join(missing)}
    return {'ok': True}


class PatchOps:
    def __init__(self, config: Config):
        self.config = config

    def _version_display(self) -> str:
        ver  = self.config.get('installed_version', '')
        date = self.config.get('installed_build_date', '')
        if ver and date:
            return f'v{ver} ({date})'
        return ver or '—'

    def _base(self, game_path: str) -> dict:
        backup_dir = os.path.join(game_path, BACKUP_DIR_NAME) if game_path else ''
        return {
            'installed_version':         self.config.get('installed_version', '—'),
            'installed_version_display': self._version_display(),
            'backup_date':               self.config.get('backup_date', '—'),
            'backup_dir':                backup_dir if os.path.isdir(backup_dir) else '',
        }

    def get_status(self) -> dict:
        game_path = self.config.get('game_path', '')
        base = self._base(game_path)

        if not game_path or not os.path.isdir(game_path):
            return {**base, 'state': 'GAME_PATH_INVALID', 'game_path': game_path}

        patch_src = os.path.join(PATCH_FILES_DIR, ANCHOR_FILE)
        if not os.path.exists(patch_src):
            return {**base, 'state': 'BACKUP_MISSING', 'game_path': game_path}

        game_file = os.path.join(game_path, PATCH_FILE_DIRS[ANCHOR_FILE], ANCHOR_FILE)
        if not os.path.exists(game_file):
            return {**base, 'state': 'BROKEN',
                    'reason': '번역 파일이 게임 폴더에 없습니다. 인스톨러를 다시 실행하세요.',
                    'game_path': game_path}

        return {**base, 'state': 'PATCHED', 'game_path': game_path}

    # ── Patch Apply (internal, used for updates) ─────────────

    def apply_patch(self) -> dict:
        game_path = self.config.get('game_path', '')
        if not game_path or not os.path.isdir(game_path):
            return {'ok': False, 'error': '게임 경로를 찾을 수 없습니다.'}
        errors = []
        for filename, rel_dir in PATCH_FILE_DIRS.items():
            src = os.path.join(PATCH_FILES_DIR, filename)
            if not os.path.exists(src):
                continue
            dst_dir = os.path.join(game_path, rel_dir)
            os.makedirs(dst_dir, exist_ok=True)
            try:
                shutil.copy2(src, os.path.join(dst_dir, filename))
            except Exception as e:
                errors.append(f'{filename}: {e}')
        if errors:
            return {'ok': False, 'error': '\n'.join(errors)}
        return {'ok': True}

    # ── CVD Toggle ───────────────────────────────────────────

    def _cvd_ini_path(self) -> str:
        game_path = self.config.get('game_path', '')
        return os.path.join(game_path, CVD_DIR, 'ASIMK11.ini') if game_path else ''

    def get_cvd_status(self) -> dict:
        ini = self._cvd_ini_path()
        if not ini:
            return {'state': 'unknown'}
        if not os.path.exists(ini):
            return {'state': 'not_installed'}
        try:
            with open(ini, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            enabled = bool(re.search(r'bDisableAntiCVD\s*=\s*true', content, re.IGNORECASE))
            return {'state': 'enabled' if enabled else 'disabled'}
        except Exception:
            return {'state': 'unknown'}

    def set_cvd_enabled(self, enable: bool) -> dict:
        ini = self._cvd_ini_path()
        if not ini:
            return {'ok': False, 'error': '게임 경로 없음'}
        if not os.path.exists(ini):
            return {'ok': False, 'error': 'ASIMK11.ini 파일을 찾을 수 없습니다. 인스톨러를 다시 실행하세요.'}
        try:
            with open(ini, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            new_val = 'true' if enable else 'false'
            content = re.sub(
                r'(bDisableAntiCVD\s*=\s*)\w+',
                lambda m: m.group(1) + new_val,
                content,
                flags=re.IGNORECASE,
            )
            with open(ini, 'w', encoding='utf-8') as f:
                f.write(content)
            return {'ok': True}
        except PermissionError:
            return {'ok': False, 'error': '게임이 실행 중입니다. 게임을 종료한 후 다시 시도하세요.'}
        except Exception as e:
            return {'ok': False, 'error': f'설정 변경 실패: {e}'}


# ── Uninstall ────────────────────────────────────────────────

def do_uninstall(report=None) -> dict:
    config_path = os.path.join(APPDATA_DIR, 'config.json')
    game_path = ''
    try:
        import json
        with open(config_path, 'r', encoding='utf-8') as f:
            game_path = json.load(f).get('game_path', '')
    except Exception:
        pass

    restore_results = []
    if game_path and os.path.isdir(game_path):
        backup_dir = os.path.join(game_path, BACKUP_DIR_NAME)
        if os.path.isdir(backup_dir):
            for filename, rel_dir in PATCH_FILE_DIRS.items():
                src = os.path.join(backup_dir, filename)
                dst = os.path.join(game_path, rel_dir, filename)
                if os.path.exists(src):
                    try:
                        shutil.copy2(src, dst)
                        ok = _sha256(src) == (_sha256(dst) if os.path.exists(dst) else '')
                        restore_results.append({'file': filename, 'status': 'ok' if ok else 'mismatch', 'note': '원본 복구 완료' if ok else '해시 불일치'})
                    except Exception as e:
                        restore_results.append({'file': filename, 'status': 'error', 'note': str(e)})
                else:
                    restore_results.append({'file': filename, 'status': 'no_backup', 'note': '백업 없음'})
            shutil.rmtree(backup_dir, ignore_errors=True)
        for filename in CVD_FILES:
            p = os.path.join(game_path, CVD_DIR, filename)
            if os.path.exists(p):
                try:
                    os.remove(p)
                    restore_results.append({'file': filename, 'status': 'removed', 'note': '패치 파일 제거'})
                except Exception as e:
                    restore_results.append({'file': filename, 'status': 'error', 'note': str(e)})
    if report: report('원본 파일 복구 완료', 50)

    for lnk in [
        os.path.join(os.environ['USERPROFILE'], 'Desktop',
                     'Mortal Kombat 11 Korean Patch Manager.lnk'),
        os.path.join(os.environ['APPDATA'], 'Microsoft', 'Windows',
                     'Start Menu', 'Programs',
                     'Mortal Kombat 11 Korean Patch Manager.lnk'),
    ]:
        if os.path.exists(lnk):
            try:
                os.remove(lnk)
            except Exception:
                pass

    try:
        winreg.DeleteKey(winreg.HKEY_CURRENT_USER, UNINSTALL_REG)
    except Exception:
        pass

    cleanup_script = f'Start-Sleep -Seconds 2; Remove-Item -Recurse -Force "{APPDATA_DIR}"'
    subprocess.Popen(
        ['powershell', '-NoProfile', '-WindowStyle', 'Hidden', '-Command', cleanup_script],
        creationflags=0x00000008,
    )
    return {'ok': True}
