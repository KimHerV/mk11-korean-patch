import os
import sys
import threading
import webbrowser

import webview

from install_ops import (
    APP_VERSION, APP_BUILD_DATE, APPDATA_DIR,
    detect_steam, detect_epic, validate_game_path,
    do_backup, copy_to_appdata, copy_to_game,
    copy_manager, copy_installer_to_appdata,
    write_config, create_shortcuts,
    register_uninstaller, uninstall,
)

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

_window = None


class Api:
    def detect_paths(self) -> dict:
        steam = detect_steam()
        epic  = detect_epic()
        return {'steam': steam, 'epic': epic, 'version': f'v{APP_VERSION} ({APP_BUILD_DATE})'}

    def validate_path(self, path: str) -> dict:
        return validate_game_path(path)

    def browse_path(self) -> dict:
        result = _window.create_file_dialog(
            webview.FOLDER_DIALOG, directory='C:\\', allow_multiple=False
        )
        if not (result and result[0]):
            return {'ok': False, 'cancelled': True}
        path = result[0]
        v = validate_game_path(path)
        return {'ok': v['ok'], 'path': path, 'reason': v.get('reason', '')}

    def start_install(self, game_path: str) -> None:
        threading.Thread(target=self._do_install, args=(game_path,), daemon=True).start()

    def _do_install(self, game_path: str):
        def report(msg: str, pct: int):
            safe = msg.replace('"', '\\"')
            _window.evaluate_js(f'onProgress("{safe}", {pct})')

        try:
            report('원본 파일 백업 중...', 10)
            do_backup(game_path)

            report('AppData 파일 복사 중...', 30)
            copy_to_appdata()

            report('패치 파일 적용 중...', 55)
            copy_to_game(game_path)

            report('관리 도구 설치 중...', 70)
            copy_manager()

            report('언인스톨러 저장 중...', 78)
            copy_installer_to_appdata()

            report('설정 파일 저장 중...', 84)
            write_config(game_path)

            report('바로 가기 생성 중...', 91)
            create_shortcuts()

            report('언인스톨러 등록 중...', 96)
            register_uninstaller()

            report('설치 완료!', 100)
            _window.evaluate_js('onInstallDone(true)')

        except Exception as e:
            safe = str(e).replace('"', '\\"')
            _window.evaluate_js(f'onInstallDone(false, "{safe}")')

    def launch_manager(self) -> None:
        path = os.path.join(APPDATA_DIR, 'mk11_kor_manager.exe')
        if os.path.exists(path):
            # explorer.exe delegates to the already-running (non-elevated) shell,
            # so the UAC prompt surfaces correctly regardless of installer's own elevation state.
            import subprocess
            subprocess.Popen(['explorer.exe', path], close_fds=True)

    def do_uninstall(self) -> dict:
        def report(msg: str, pct: int = 0):
            safe = msg.replace('"', '\\"')
            _window.evaluate_js(f'onUninstallProgress("{safe}", {pct})')
        result = uninstall(report)
        _window.evaluate_js(
            f'onUninstallDone({str(result["ok"]).lower()}, {__import__("json").dumps(result.get("restore_results", []))})'
        )
        return result

    def open_url(self, url: str) -> None:
        webbrowser.open(url)

    def close(self) -> None:
        _window.destroy()


def main():
    global _window

    uninstall_mode = '--uninstall' in sys.argv

    api = Api()
    cx, cy = _center(720, 620)
    title = 'Mortal Kombat 11 Korean Patch Uninstall' if uninstall_mode else 'Mortal Kombat 11 Korean Patch Install'
    url = HTML_PATH + ('?mode=uninstall' if uninstall_mode else '')
    _window = webview.create_window(
        title=title,
        url=url,
        js_api=api,
        width=720,
        height=620,
        x=cx,
        y=cy,
        resizable=False,
        background_color='#0a0a0a',
    )
    webview.start(debug=False)


if __name__ == '__main__':
    main()
