#!/usr/bin/env python3
"""Local release server: mimics the GitHub Releases API for installer testing.

Serves a GitHub-shaped `/releases/latest` JSON plus asset downloads, from
versioned fixtures in `tools/release_fixtures/<ver>/`. "latest" = the highest
semver subdir present (re-scanned each request), so dropping a new
`release_fixtures/1.3/` dir simulates publishing v1.3 with no restart.

Point the installer at it (persistent USER env var so the spawned manager
inherits it too):
    setx MK11_UPDATE_API "http://localhost:8099/releases/latest"
    # open a fresh shell, then build/run the installer

Teardown:
    powershell -c "[Environment]::SetEnvironmentVariable('MK11_UPDATE_API',$null,'User')"

Usage:
    python release_server.py [--port 8099] [--latest 1.3]
"""

import argparse
import json
import re
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

FIXTURES = (Path(__file__).resolve().parent / "release_fixtures").resolve()
VER_RE = re.compile(r"^\d+(\.\d+)*$")


def _semver_key(name: str):
    return tuple(int(x) for x in re.findall(r"\d+", name))


def available_versions():
    if not FIXTURES.is_dir():
        return []
    vers = [d.name for d in FIXTURES.iterdir() if d.is_dir() and VER_RE.match(d.name)]
    return sorted(vers, key=_semver_key)


class Handler(BaseHTTPRequestHandler):
    latest_override = None
    throttle_kbps = 0  # 0 = unlimited; >0 = simulate a slow network download

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} - {fmt % args}")

    def _latest(self):
        if self.latest_override:
            return self.latest_override
        vers = available_versions()
        return vers[-1] if vers else None

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path.endswith("/releases/latest"):
            return self._serve_release_json()
        m = re.match(r"^/dl/([^/]+)/(.+)$", path)
        if m:
            return self._serve_asset(m.group(1), m.group(2))
        self.send_error(404, "not found")

    def _serve_release_json(self):
        ver = self._latest()
        if not ver or not (FIXTURES / ver).is_dir():
            self.send_error(404, "no release fixtures present")
            return
        host = self.headers.get("Host", "localhost")
        assets = [
            {"name": f.name, "browser_download_url": f"http://{host}/dl/{ver}/{f.name}"}
            for f in sorted((FIXTURES / ver).iterdir()) if f.is_file()
        ]
        body = json.dumps({
            "tag_name": f"v{ver}",
            "html_url": f"http://{host}/releases/tag/v{ver}",
            "published_at": "2026-05-24T00:00:00Z",
            "assets": assets,
        }).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        print(f"  -> release v{ver} ({len(assets)} assets: {[a['name'] for a in assets]})")

    def _serve_asset(self, ver, name):
        f = (FIXTURES / ver / name).resolve()
        if FIXTURES not in f.parents or not f.is_file():  # path-traversal guard
            self.send_error(404, "asset not found")
            return
        data = f.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "application/octet-stream")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        kbps = Handler.throttle_kbps
        if kbps and kbps > 0:
            # Send in 32KB chunks with a per-chunk delay to simulate a slow
            # network download, so the installer's byte-based progress bar fills
            # gradually (loopback is otherwise instant). Content-Length is
            # unchanged, so the client's integrity check still passes.
            chunk = 32 * 1024
            delay = chunk / (kbps * 1024.0)
            for i in range(0, len(data), chunk):
                self.wfile.write(data[i:i + chunk])
                self.wfile.flush()
                time.sleep(delay)
            print(f"  -> asset {ver}/{name} ({len(data):,} bytes, throttled {kbps} KB/s)")
        else:
            self.wfile.write(data)
            print(f"  -> asset {ver}/{name} ({len(data):,} bytes)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8099)
    ap.add_argument("--latest", default=None, help="force a specific version as latest")
    ap.add_argument("--kbps", type=int, default=0,
                    help="throttle asset downloads to N KB/s (simulate slow network; 0 = unlimited)")
    args = ap.parse_args()
    Handler.latest_override = args.latest
    Handler.throttle_kbps = args.kbps

    vers = available_versions()
    latest = args.latest or (vers[-1] if vers else None)
    print(f"Local release server: http://localhost:{args.port}")
    print(f"Fixtures dir: {FIXTURES}")
    print(f"Versions: {vers or '(none — create release_fixtures/<ver>/)'}   latest={latest}")
    print(f"Throttle: {('%d KB/s' % args.kbps) if args.kbps else 'unlimited'}")
    print(f'Point installer:  setx MK11_UPDATE_API "http://localhost:{args.port}/releases/latest"')
    ThreadingHTTPServer(("127.0.0.1", args.port), Handler).serve_forever()


if __name__ == "__main__":
    main()
