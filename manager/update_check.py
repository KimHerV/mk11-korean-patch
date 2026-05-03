import json
import urllib.request

RELEASES_API   = 'https://api.github.com/repos/KimHerV/mk11-korean-patch/releases/latest'
PATCH_ASSETS   = {'Coalesced.CHS', 'ui_c_inGameFonts_chs.xxx'}


def check_update(installed_version: str) -> dict:
    try:
        req = urllib.request.Request(
            RELEASES_API,
            headers={'User-Agent': 'MK11KoreanPatch-Manager/1.0'},
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.load(resp)

        latest      = data.get('tag_name', '').lstrip('v')
        html_url    = data.get('html_url', '')
        published   = data.get('published_at', '')[:10]   # YYYY-MM-DD
        assets      = data.get('assets', [])
        asset_urls  = [
            a['browser_download_url']
            for a in assets if a['name'] in PATCH_ASSETS
        ]
        update_available = bool(latest) and latest != (installed_version or '')

        return {
            'ok':               True,
            'latest':           f'v{latest}' if latest else '—',
            'latest_version':   latest,
            'published_at':     published,
            'installed':        installed_version or '—',
            'update_available': update_available,
            'release_url':      html_url,
            'asset_urls':       asset_urls,
        }
    except Exception as e:
        return {
            'ok':               False,
            'error':            str(e),
            'latest':           '확인 실패',
            'installed':        installed_version or '—',
            'update_available': False,
            'release_url':      'https://github.com/KimHerV/mk11-korean-patch/releases/latest',
            'asset_urls':       [],
        }
