"""Traces the AJWC monogram artwork into clean, optimised SVG.

The source is a raster the client supplied. Rather than approximate it by
hand - which would drift from the mark they actually chose - it is
traced: threshold to a binary mask, extract iso-contours, then simplify
each contour with Douglas-Peucker until the path count is small enough
to extrude cheaply and stay crisp at favicon size.

Holes (the counters inside A, W and C) are handled by emitting every
contour into one path with fill-rule="evenodd". Even-odd decides
inside/outside by containment rather than winding direction, so the
holes come out right without having to detect and reverse them.

Two outputs:

  ajwc-mark.svg     full trace
  ajwc-mark-16.svg  heavier simplification for 16-32px

Run: py scripts/trace-logo.py
"""

from pathlib import Path

import numpy as np
from PIL import Image
from skimage import measure

SRC = Path(
    "C:/Users/archi/Desktop/Jumpboards for Dad/portfolio-site/"
    "Assets/logo-concepts/logo-1-monogram.png"
)
OUT = Path(__file__).resolve().parent.parent / "public" / "logo"

BRAND = "#20C2D2"
VIEWBOX = 64.0

# Contours shorter than this fraction of the image are speckle from the
# raster's antialiased edges, not real features.
MIN_CONTOUR_FRACTION = 0.02


def load_mask() -> np.ndarray:
    img = Image.open(SRC).convert("RGB")
    a = np.asarray(img).astype(np.float32)
    # The mark is bright cyan on near-black, so plain luminance separates
    # them cleanly; no colour-space work needed.
    lum = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
    return (lum > 60).astype(np.float32)


def trace(mask: np.ndarray, tolerance: float) -> list[np.ndarray]:
    # Pad so shapes touching the edge still close into a loop.
    padded = np.pad(mask, 1, mode="constant", constant_values=0)
    contours = measure.find_contours(padded, 0.5)

    h, w = padded.shape
    min_len = MIN_CONTOUR_FRACTION * max(h, w)

    out = []
    for c in contours:
        if len(c) < 8:
            continue
        # Perimeter as a cheap size proxy.
        span = np.ptp(c[:, 0]) + np.ptp(c[:, 1])
        if span < min_len:
            continue
        simplified = measure.approximate_polygon(c, tolerance=tolerance)
        if len(simplified) >= 3:
            out.append(simplified)
    return out


def to_svg(contours: list[np.ndarray], shape: tuple[int, int], fill: str) -> str:
    h, w = shape
    scale = VIEWBOX / max(h, w)
    # Centre the mark in the viewBox.
    ox = (VIEWBOX - w * scale) / 2
    oy = (VIEWBOX - h * scale) / 2

    parts = []
    for c in contours:
        # find_contours returns (row, col) = (y, x).
        pts = [f"{col * scale + ox:.2f} {row * scale + oy:.2f}" for row, col in c]
        parts.append("M" + " ".join(pts) + "Z")

    d = " ".join(parts)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" '
        'role="img" aria-label="AJWC Tech Consulting">\n'
        "  <title>AJWC Tech Consulting</title>\n"
        f'  <path fill="{fill}" fill-rule="evenodd" d="{d}"/>\n'
        "</svg>\n"
    )


def crop_to_ink(mask: np.ndarray) -> np.ndarray:
    rows = np.any(mask > 0, axis=1)
    cols = np.any(mask > 0, axis=0)
    r0, r1 = np.where(rows)[0][[0, -1]]
    c0, c1 = np.where(cols)[0][[0, -1]]
    return mask[r0 : r1 + 1, c0 : c1 + 1]


def render_png(mask: np.ndarray, size: int, bg: str | None = None, inset: float = 1.0):
    """Rasterised from the same mask the vector trace came from, so the
    favicon and the SVG cannot drift. Downsampled with LANCZOS from the
    full-resolution mask, which anti-aliases better than scaling the
    simplified vector would."""
    h, w = mask.shape
    side = max(h, w)
    square = np.zeros((side, side), dtype=np.uint8)
    r0, c0 = (side - h) // 2, (side - w) // 2
    square[r0 : r0 + h, c0 : c0 + w] = (mask * 255).astype(np.uint8)

    inner = max(1, int(size * inset))
    alpha = Image.fromarray(square, mode="L").resize((inner, inner), Image.LANCZOS)

    rgb = tuple(int(BRAND[i : i + 2], 16) for i in (1, 3, 5))
    layer = Image.new("RGBA", (inner, inner), rgb + (0,))
    layer.putalpha(alpha)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pad = (size - inner) // 2
    canvas.alpha_composite(layer, (pad, pad))

    if bg:
        back = Image.new(
            "RGBA", (size, size), tuple(int(bg[i : i + 2], 16) for i in (1, 3, 5)) + (255,)
        )
        back.alpha_composite(canvas)
        canvas = back
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    mask = crop_to_ink(load_mask())

    for name, tol, fill in [
        ("ajwc-mark.svg", 1.4, BRAND),
        ("ajwc-mark-mono.svg", 1.4, "currentColor"),
        ("ajwc-mark-knockout.svg", 1.4, "#FFFFFF"),
        ("ajwc-mark-16.svg", 3.2, BRAND),
        ("ajwc-mark-16-mono.svg", 3.2, "currentColor"),
    ]:
        contours = trace(mask, tol)
        svg = to_svg(contours, (mask.shape[0] + 2, mask.shape[1] + 2), fill)
        (OUT / name).write_text(svg, encoding="utf-8")
        pts = sum(len(c) for c in contours)
        print(f"  {name}  {len(contours)} contours, {pts} points, {len(svg)} bytes")

    app = OUT.parent
    for name, size, bg, inset in [
        ("favicon-16.png", 16, None, 1.0),
        ("favicon-32.png", 32, None, 1.0),
        ("apple-touch-icon.png", 180, "#05070A", 0.80),
        ("icon-192.png", 192, None, 1.0),
        ("icon-512.png", 512, None, 1.0),
        ("icon-maskable-512.png", 512, "#05070A", 0.66),
    ]:
        render_png(mask, size, bg, inset).save(app / name)
        print(f"  {name}  {size}x{size}")

    render_png(mask, 64).save(app / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("  favicon.ico  16/32/48")


if __name__ == "__main__":
    main()
