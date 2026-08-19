"""Pre-deploy check for the static export.

Verifies that every URL the sitemap advertises actually resolves the way
the .htaccess will resolve it. This exists because the export writes
work.html but NOT work/index.html, so an extensionless URL only works if
the rewrite rule is present and the .html file is really there. Getting
that wrong means Google crawls straight into 404s.

Run after `npm run build`:
    py scripts/check-export.py
"""

import re
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "out"

FAIL = []
WARN = []


def resolves(url_path: str) -> str | None:
    """Mimics the .htaccess: exact file, then directory index, then .html."""
    rel = url_path.strip("/")
    if rel == "":
        return "index.html" if (OUT / "index.html").is_file() else None
    if (OUT / rel).is_file():
        return rel
    if (OUT / rel / "index.html").is_file():
        return f"{rel}/index.html"
    if (OUT / f"{rel}.html").is_file():
        return f"{rel}.html"
    return None


def main() -> int:
    if not OUT.is_dir():
        print("out/ not found - run `npm run build` first")
        return 1

    sitemap = OUT / "sitemap.xml"
    if not sitemap.is_file():
        FAIL.append("sitemap.xml missing from the export")
    else:
        urls = re.findall(r"<loc>([^<]+)</loc>", sitemap.read_text(encoding="utf-8"))
        print(f"Sitemap lists {len(urls)} URLs\n")
        for url in urls:
            path = re.sub(r"^https?://[^/]+", "", url)
            target = resolves(path)
            status = "ok" if target else "FAIL"
            if not target:
                FAIL.append(f"{url} does not resolve to any file")
            print(f"  [{status:4}] {path or '/':38} -> {target or 'NOTHING'}")

    # Things that must exist for the deployment to behave.
    print()
    required = [
        (".htaccess", "Apache config - without it extensionless URLs 404"),
        ("404.html", "referenced by ErrorDocument"),
        ("robots.txt", ""),
        ("contact.php", "the form handler"),
        ("opengraph-image", "OG card (extensionless - needs ForceType)"),
        ("favicon.ico", ""),
        ("manifest.webmanifest", ""),
    ]
    for name, note in required:
        exists = (OUT / name).exists()
        if not exists:
            FAIL.append(f"{name} missing from the export" + (f" - {note}" if note else ""))
        print(f"  [{'ok' if exists else 'FAIL':4}] {name:38} {note}")

    # The old site's URLs, which must keep working.
    print()
    for legacy in ["privacy.html", "terms.html", "cv.html", "index.html"]:
        exists = (OUT / legacy).is_file()
        if not exists:
            FAIL.append(f"legacy URL /{legacy} no longer resolves")
        print(f"  [{'ok' if exists else 'FAIL':4}] legacy /{legacy}")

    uni = list((OUT / "Assets" / "Uni Work Pages").rglob("*.html"))
    print(f"\n  [{'ok' if len(uni) == 16 else 'WARN':4}] {len(uni)} university module pages (expected 16)")
    if len(uni) != 16:
        WARN.append(f"expected 16 university pages, found {len(uni)}")

    print()
    for w in WARN:
        print(f"WARN: {w}")
    for f in FAIL:
        print(f"FAIL: {f}")

    if FAIL:
        print(f"\n{len(FAIL)} problem(s). Do not deploy.")
        return 1
    print("\nExport looks deployable.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
