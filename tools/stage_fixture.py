#!/usr/bin/env python3
"""Stage a release fixture for the local release server.

Copies the real Coalesced.CHS + font into release_fixtures/<ver>/, appending a
per-version sentinel to the CHS so each version has a distinct SHA256 — lets you
verify the installer/manager actually replaced the on-disk file. For the
initial-install version, pass --with-zip to also include MK11-CVD-Bypass.zip
(the update path does NOT fetch the zip, so 1.3/1.4 omit it).

Note: the sentinel is appended for SHA distinctness (plumbing verification). The
Coalesced format is NRS-proprietary; if trailing bytes prevent in-game render,
the download/install/update plumbing is still validated. For a true in-game
render test per version, substitute a properly rebuilt Coalesced.CHS.

Sources:
  game Localization/Coalesced.CHS, game Asset/ui_c_inGameFonts_chs.xxx
  08_CVD_ASI/MK11-CVD-Bypass.zip  (run pack_cvd_bypass.py first)

Usage:
  python stage_fixture.py 1.2 --with-zip
  python stage_fixture.py 1.3
  python stage_fixture.py 1.4
"""

import argparse
import hashlib
import shutil
from pathlib import Path

GAME = Path(r"D:\Games\Fighting\Mortal Kombat 11 (2026 Build)")
SRC_CHS = GAME / "Localization" / "Coalesced.CHS"
SRC_FONT = GAME / "Asset" / "ui_c_inGameFonts_chs.xxx"
SRC_ZIP = Path(r"D:\MK11_Translate_Composer\08_CVD_ASI\MK11-CVD-Bypass.zip")
FIXTURES = Path(__file__).resolve().parent / "release_fixtures"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("version")
    ap.add_argument("--with-zip", action="store_true",
                    help="include MK11-CVD-Bypass.zip (initial-install version only)")
    args = ap.parse_args()

    for p in (SRC_CHS, SRC_FONT):
        if not p.exists():
            print(f"ERROR: source missing: {p}")
            return 1
    if args.with_zip and not SRC_ZIP.exists():
        print(f"ERROR: zip missing (run pack_cvd_bypass.py first): {SRC_ZIP}")
        return 1

    out = FIXTURES / args.version
    out.mkdir(parents=True, exist_ok=True)

    sentinel = f"\x00MK11_TEST_v{args.version}\x00".encode("utf-8")
    chs = SRC_CHS.read_bytes() + sentinel
    (out / "Coalesced.CHS").write_bytes(chs)
    shutil.copy2(SRC_FONT, out / SRC_FONT.name)
    if args.with_zip:
        shutil.copy2(SRC_ZIP, out / SRC_ZIP.name)

    files = sorted(f.name for f in out.iterdir())
    print(f"[OK] release_fixtures/{args.version}/  ->  {files}")
    print(f"     Coalesced.CHS sha256 = {hashlib.sha256(chs).hexdigest()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
