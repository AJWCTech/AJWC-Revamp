"""Generates placeholder images at their exact final dimensions.

Deliberately not Lorem Picsum or any external URL: placeholders must be
local, offline, brand-coloured, and clearly labelled as placeholders, so
nobody mistakes one for a finished asset. Each carries its own slot name
and pixel size burned into it.

Sizes are read from src/content/assets.ts, so this script and the
manifest cannot drift apart.

Run: py scripts/build-placeholders.py
"""

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "src" / "content" / "assets.ts"
OUT = ROOT / "public" / "placeholders"

BG = (11, 15, 21)        # --bg-raised
LINE = (30, 38, 48)      # --border
BRAND = (32, 194, 210)   # --brand
MUTED = (139, 151, 166)  # --text-muted


def parse_manifest() -> list[tuple[str, int, int, str]]:
    """Pull (name, w, h, kind) for every placeholder: true entry."""
    src = MANIFEST.read_text(encoding="utf-8")
    out = []
    # Each entry is "key": { ... }, — match non-greedily to the closing brace.
    for m in re.finditer(r'"([\w-]+)":\s*\{(.*?)\n  \}', src, re.S):
        key, blob = m.group(1), m.group(2)
        if "placeholder: true" not in blob:
            continue
        kind = re.search(r'kind:\s*"(\w+)"', blob)
        w = re.search(r"width:\s*(\d+)", blob)
        h = re.search(r"height:\s*(\d+)", blob)
        if not (kind and w and h):
            continue
        out.append((key, int(w.group(1)), int(h.group(1)), kind.group(1)))
    return out


def font(size: int):
    for name in ("consola.ttf", "cour.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def make(name: str, w: int, h: int) -> Image.Image:
    img = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(img)

    # Subtle diagonal hatch so a placeholder is unmistakable at a glance
    # even with the label cropped out.
    step = max(24, w // 40)
    for x in range(-h, w, step):
        d.line([(x, h), (x + h, 0)], fill=LINE, width=1)

    d.rectangle([0, 0, w - 1, h - 1], outline=BRAND, width=max(1, w // 400))

    label = f"{name}  {w}x{h}"
    f = font(max(13, min(w // 22, 44)))
    box = d.textbbox((0, 0), label, font=f)
    d.text(
        ((w - (box[2] - box[0])) / 2, (h - (box[3] - box[1])) / 2),
        label,
        font=f,
        fill=MUTED,
    )
    d.text((10, 8), "PLACEHOLDER", font=font(max(10, w // 60)), fill=BRAND)
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    entries = parse_manifest()
    if not entries:
        raise SystemExit("No placeholder entries found — did assets.ts change shape?")

    for name, w, h, kind in entries:
        if kind == "video":
            # The poster is a real image; the .mp4 itself is produced by
            # build-placeholder-video.py, which needs ffmpeg.
            make(f"{name}-poster", w, h).save(OUT / f"{name}-poster.png")
            print(f"  {name}-poster.png  {w}x{h}")
        else:
            make(name, w, h).save(OUT / f"{name}.png")
            print(f"  {name}.png  {w}x{h}")


if __name__ == "__main__":
    main()
