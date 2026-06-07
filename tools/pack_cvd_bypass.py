#!/usr/bin/env python3
"""Pack MK11-CVD-Bypass.zip from the standalone loader set.

Reused for BOTH the local test fixtures and the real GitHub release asset
(the file release.ps1 carries forward). The installer's StageCVDBundle
downloads this zip, extracts it, and verifies every file listed in
SHA256SUMS.txt.

Zip contents:
  dinput8.dll              Ultimate ASI Loader (x64)        [in SHA256SUMS]
  MK11_KoreanLoader.asi    standalone CVD loader            [in SHA256SUMS]
  MK11_KoreanLoader.ini    config (LogDir=logs dist form)   [in SHA256SUMS]
  THIRD_PARTY_NOTICES.txt  attribution                      [not summed]
  SHA256SUMS.txt           "<64hex>  <name>" per summed file

Inputs are pulled from the loader workspace:
  08_CVD_ASI/build/MK11_KoreanLoader.asi   (output of build.bat / mk11_compile cvd)
  08_CVD_ASI/MK11_KoreanLoader.ini         (repo distribution ini, LogDir=logs)
  08_CVD_ASI/dist_payload/dinput8.dll      (build-independent)
  08_CVD_ASI/dist_payload/THIRD_PARTY_NOTICES.txt

Usage:
  python pack_cvd_bypass.py [output_zip]
    output_zip defaults to 08_CVD_ASI/MK11-CVD-Bypass.zip
"""

import hashlib
import sys
import zipfile
from pathlib import Path

CVD = Path(r"D:\MK11_Translate_Composer\08_CVD_ASI")

# name in zip -> source path. Insertion order = SHA256SUMS line order.
SUMMED = {
    "dinput8.dll":           CVD / "dist_payload" / "dinput8.dll",
    "MK11_KoreanLoader.asi": CVD / "build" / "MK11_KoreanLoader.asi",
    "MK11_KoreanLoader.ini": CVD / "MK11_KoreanLoader.ini",
}
# in the zip but not integrity-checked (matches the original bundle convention)
EXTRA = {
    "THIRD_PARTY_NOTICES.txt": CVD / "dist_payload" / "THIRD_PARTY_NOTICES.txt",
}

DEFAULT_OUT = CVD / "MK11-CVD-Bypass.zip"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUT

    missing = [str(p) for p in list(SUMMED.values()) + list(EXTRA.values()) if not p.exists()]
    if missing:
        print("ERROR: missing inputs:")
        for m in missing:
            print("   ", m)
        print("\nBuild the loader first (08_CVD_ASI/build.bat or /mk11_compile cvd).")
        return 1

    # SHA256SUMS.txt: "<hash>  <name>" (two spaces; matches StageCVDBundle +
    # the CLI installer Test-Sha256Sums regex ^([a-fA-F0-9]{64})\s+(\S+)$).
    sums_text = "".join(f"{sha256(p)}  {name}\n" for name, p in SUMMED.items())

    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for name, p in SUMMED.items():
            z.write(p, name)
        for name, p in EXTRA.items():
            z.write(p, name)
        z.writestr("SHA256SUMS.txt", sums_text)

    print(f"[OK] {out}  ({out.stat().st_size:,} bytes)")
    print("--- SHA256SUMS.txt ---")
    print(sums_text, end="")
    return 0


if __name__ == "__main__":
    sys.exit(main())
