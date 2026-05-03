import os
import sys
import threading
import webbrowser

import webview

from config import Config
from patch_ops import PatchOps, validate_game_path
from update_check import check_update

# base dir: PyInstaller bundle or dev mode
if getattr(sys, 'frozen', False):
    BASE_DIR = sys._MEIPASS
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def _center(w: int, h: int) -> tuple:
    try:
        import ctypes
        sw = ctypes.windll.user32.GetSystemMetrics(0)
        sh = ctypes.windll.user32.GetSystemMetrics(1)
        return (sw - w) // 2, (sh - h) // 2
    except Exception:
        return None, None

HTML_PATH = os.path.join(BASE_DIR, 'gui', 'app.html')


class Api:
    def __init__(self):
        self._config = Config()
        self._ops = PatchOps(self._config)
        self._window = None  # injected by main()

    def get_status(self) -> dict:
        return self._ops.get_status()

    def check_update(self) -> dict:
        installed = self._config.get('installed_version', '')
        return check_update(installed)

    def get_cvd_status(self) -> dict:
        return self._ops.get_cvd_status()

    def set_cvd_enabled(self, enable: bool) -> dict:
        return self._ops.set_cvd_enabled(enable)

    def open_in_explorer(self, path: str) -> None:
        if path and os.path.exists(path):
            os.startfile(path)

    def open_feedback_page(self) -> None:
        webbrowser.open('https://mk11-korean-patch.pages.dev/#feedback')

    def do_uninstall(self) -> None:
        import subprocess
        installer_path = os.path.join(
            os.environ['APPDATA'], 'MK11KoreanPatch', 'MK11-Korean-Patch-Setup.exe'
        )
        if not os.path.exists(installer_path):
            if self._window:
                self._window.evaluate_js('onUninstallError("언인스톨러를 찾을 수 없습니다. 인스톨러를 다시 실행하여 복구하세요.")')
            return
        subprocess.Popen([installer_path, '--uninstall'])
        if self._window:
            self._window.destroy()

    def apply_update(self, update_json: str) -> None:
        threading.Thread(target=self._do_update, args=(update_json,), daemon=True).start()

    def _do_update(self, update_json: str):
        import json
        import tempfile
        import urllib.request
        from patch_ops import PATCH_FILES_DIR

        def push(pct: int, msg: str):
            safe = msg.replace('"', '\\"')
            self._window.evaluate_js(f'onUpdateProgress({pct}, "{safe}")')

        try:
            info       = json.loads(update_json)
            urls       = info.get('urls', [])
            new_ver    = info.get('version', '')
            new_date   = info.get('date', '')

            if not urls:
                raise RuntimeError('다운로드할 파일 URL이 없습니다.')

            os.makedirs(PATCH_FILES_DIR, exist_ok=True)
            n = len(urls)

            for i, url in enumerate(urls):
                filename  = url.split('/')[-1]
                dst_final = os.path.join(PATCH_FILES_DIR, filename)
                pct_start = 10 + i * 45 // n
                pct_end   = 10 + (i + 1) * 45 // n

                push(pct_start, f'{filename} 다운로드 중...')

                with tempfile.NamedTemporaryFile(delete=False, suffix='.tmp',
                                                 dir=PATCH_FILES_DIR) as tf:
                    tmp_path = tf.name

                def _hook(count, block, total,
                          _ps=pct_start, _pe=pct_end, _fn=filename):
                    if total > 0:
                        p = _ps + int(count * block / total * (_pe - _ps))
                        push(min(p, _pe - 1), f'{_fn} 다운로드 중...')

                req = urllib.request.Request(
                    url, headers={'User-Agent': 'MK11KoreanPatch-Manager/1.0'})
                urllib.request.urlretrieve(req, tmp_path, reporthook=_hook)
                os.replace(tmp_path, dst_final)
                push(pct_end, f'{filename} 완료')

            push(60, '게임 폴더에 적용 중...')
            result = self._ops.apply_patch()
            if not result['ok']:
                raise RuntimeError(result.get('error', '적용 실패'))

            push(90, '버전 정보 업데이트 중...')
            if new_ver:
                self._config.set('installed_version', new_ver)
            if new_date:
                self._config.set('installed_build_date', new_date)

            push(100, '완료')
            self._window.evaluate_js('onUpdateDone(true)')

        except Exception as e:
            safe = str(e).replace('"', '\\"').replace('\n', ' ')
            self._window.evaluate_js(f'onUpdateDone(false, "{safe}")')

    def launch_game(self) -> dict:
        game_path = self._config.get('game_path', '')
        if not game_path or not os.path.isdir(game_path):
            return {'ok': False, 'error': '게임 경로 없음'}
        retail = os.path.join(game_path, 'Binaries', 'Retail')
        for name in ['MK11.exe', 'MortalKombat11.exe']:
            exe = os.path.join(retail, name)
            if os.path.exists(exe):
                os.startfile(exe)
                return {'ok': True}
        try:
            for f in os.listdir(retail):
                if f.lower().endswith('.exe'):
                    os.startfile(os.path.join(retail, f))
                    return {'ok': True}
        except Exception:
            pass
        return {'ok': False, 'error': '게임 실행 파일을 찾을 수 없습니다.'}

    def open_release_page(self, url: str = '') -> None:
        target = url or 'https://github.com/KimHerV/mk11-korean-patch/releases/latest'
        webbrowser.open(target)


def main():
    api = Api()
    cx, cy = _center(500, 440)
    window = webview.create_window(
        title='Mortal Kombat 11 Korean Patch Manager',
        url=HTML_PATH,
        js_api=api,
        width=500,
        height=440,
        x=cx,
        y=cy,
        resizable=False,
        on_top=False,
        background_color='#0a0a0a',
    )
    api._window = window
    webview.start(debug=False)


if __name__ == '__main__':
    main()
