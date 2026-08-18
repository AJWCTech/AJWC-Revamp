"""Generates the AJWC mark as SVG.

The mark is computed, not hand-placed, so the six blades are provably
identical and the geometry can be retuned by changing the constants
below rather than by editing path data by hand.

Two outputs, deliberately:

  ajwc-mark.svg    full mark - frame ring plus six iris blades
  ajwc-mark-16.svg simplified - frame ring and centre void only

The simplified one exists because below about 24px the blades and the
gaps between them fall under a pixel and turn to mush. Scaling one mark
down to 16px is what produces a smudge in the browser tab; shipping a
second, quieter mark for that size is why good favicons stay readable.

Run: py scripts/build-logo.py
"""

import math
from pathlib import Path

BRAND = "#20C2D2"

# Frame ring
R_FRAME_OUT = 30.0
R_FRAME_IN = 24.0

# Blade annulus
R_BLADE_OUT = 21.0
R_BLADE_IN = 11.5

# Degrees of padding at each end of a blade's 60 degree wedge. This is
# what separates one blade from the next; at 5 the gaps read clearly at
# 32px, and closing them to 0 turns the iris back into a solid star.
BLADE_PAD = 5.0

# How far the inner edge is rotated relative to the outer edge. Zero
# gives plain radial spokes; this twist is the whole reason it reads as
# an aperture rather than a wheel.
BLADE_TWIST = 14.0

CX = CY = 32.0


def pt(angle_deg: float, r: float) -> tuple[float, float]:
    """Polar to SVG coordinates. Y is negated because SVG's Y axis points
    down, so positive angles run anticlockwise as they do in maths."""
    a = math.radians(angle_deg)
    return (CX + r * math.cos(a), CY - r * math.sin(a))


def fmt(points: list[tuple[float, float]]) -> str:
    body = " ".join(f"{x:.2f} {y:.2f}" for x, y in points)
    return f"M{body}Z"


def hexagon(r: float) -> str:
    """Pointy-top hexagon: first vertex at 12 o'clock."""
    return fmt([pt(90 + 60 * k, r) for k in range(6)])


def blades() -> list[str]:
    out = []
    for k in range(6):
        base = 90 + 60 * k
        a0, a1 = base + BLADE_PAD, base + 60 - BLADE_PAD
        out.append(fmt([
            pt(a0, R_BLADE_OUT),
            pt(a1, R_BLADE_OUT),
            pt(a1 + BLADE_TWIST, R_BLADE_IN),
            pt(a0 + BLADE_TWIST, R_BLADE_IN),
        ]))
    return out


HEADER = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" '
    'role="img" aria-label="AJWC Tech Consulting">\n'
    '  <title>AJWC Tech Consulting</title>\n'
)

# The ring is one path with evenodd rather than two stacked shapes, so it
# stays a single closed region and extrudes to one solid in Three.js.
RING = '  <path fill="{fill}" fill-rule="evenodd" d="{outer} {inner}"/>\n'


def build_full(fill: str, blade_opacity: str) -> str:
    s = HEADER
    s += RING.format(fill=fill, outer=hexagon(R_FRAME_OUT), inner=hexagon(R_FRAME_IN))
    s += f'  <g fill="{fill}" fill-opacity="{blade_opacity}">\n'
    for d in blades():
        s += f'    <path d="{d}"/>\n'
    s += "  </g>\n</svg>\n"
    return s


def build_simple(fill: str) -> str:
    """Frame ring plus a solid centre hexagon. No blades, no gaps."""
    s = HEADER
    s += RING.format(fill=fill, outer=hexagon(R_FRAME_OUT), inner=hexagon(R_FRAME_IN))
    s += f'  <path fill="{fill}" d="{hexagon(R_BLADE_IN + 1)}"/>\n</svg>\n'
    return s


# --- raster ---------------------------------------------------------
# cairosvg cannot run on this machine (no native cairo), and screenshotting
# the SVG through a browser gives a matte rather than real alpha. The mark
# is nothing but polygons, so it is rasterised straight from the same
# geometry - one source of truth, true alpha, deterministic output.

SS = 8  # supersample factor; downsampled with LANCZOS for clean edges


def _poly(draw_pts, size: float):
    """Scale 0-64 space to the target pixel size."""
    k = size / 64.0
    return [(x * k, y * k) for x, y in draw_pts]


def _pts(angle_deg: float, r: float):
    return pt(angle_deg, r)


def _hex_pts(r: float):
    return [pt(90 + 60 * k, r) for k in range(6)]


def _blade_pts():
    out = []
    for k in range(6):
        base = 90 + 60 * k
        a0, a1 = base + BLADE_PAD, base + 60 - BLADE_PAD
        out.append([
            pt(a0, R_BLADE_OUT), pt(a1, R_BLADE_OUT),
            pt(a1 + BLADE_TWIST, R_BLADE_IN), pt(a0 + BLADE_TWIST, R_BLADE_IN),
        ])
    return out


def render_png(size: int, simple: bool, bg: str | None = None, inset: float = 1.0):
    """Alpha mask built at SS x, then downsampled. `inset` shrinks the mark
    within the canvas, which is what a maskable PWA icon needs so the
    launcher can crop it without clipping the mark."""
    from PIL import Image, ImageDraw

    big = int(size * SS)
    mask = Image.new("L", (big, big), 0)
    d = ImageDraw.Draw(mask)

    def scaled(points, value):
        k = (big / 64.0) * inset
        off = (big - big * inset) / 2.0
        d.polygon([(x * k + off, y * k + off) for x, y in points], fill=value)

    # Ring: outer at full alpha, inner punched back to transparent.
    scaled(_hex_pts(R_FRAME_OUT), 255)
    scaled(_hex_pts(R_FRAME_IN), 0)

    if simple:
        scaled(_hex_pts(R_BLADE_IN + 1), 255)
    else:
        for blade in _blade_pts():
            scaled(blade, 153)  # 0.6 opacity

    mask = mask.resize((size, size), Image.LANCZOS)

    rgb = tuple(int(BRAND[i:i + 2], 16) for i in (1, 3, 5))
    img = Image.new("RGBA", (size, size), rgb + (0,))
    img.putalpha(mask)

    if bg:
        back = Image.new("RGBA", (size, size), tuple(int(bg[i:i + 2], 16) for i in (1, 3, 5)) + (255,))
        back.alpha_composite(img)
        img = back
    return img


def main() -> None:
    out = Path(__file__).resolve().parent.parent / "public" / "logo"
    out.mkdir(parents=True, exist_ok=True)

    files = {
        "ajwc-mark.svg": build_full(BRAND, "0.6"),
        "ajwc-mark-mono.svg": build_full("currentColor", "1"),
        "ajwc-mark-knockout.svg": build_full("#FFFFFF", "0.6"),
        "ajwc-mark-16.svg": build_simple(BRAND),
        "ajwc-mark-16-mono.svg": build_simple("currentColor"),
    }
    for name, content in files.items():
        (out / name).write_text(content, encoding="utf-8")
        print(f"  {name}  {len(content)} bytes")

    app = out.parent  # public/
    # 16 and 32 use the simplified mark; the full mark turns to mush there.
    icons = [
        ("favicon-16.png", 16, True, None, 1.0),
        ("favicon-32.png", 32, True, None, 1.0),
        ("apple-touch-icon.png", 180, False, "#05070A", 0.76),
        ("icon-192.png", 192, False, None, 1.0),
        ("icon-512.png", 512, False, None, 1.0),
        ("icon-maskable-512.png", 512, False, "#05070A", 0.66),
    ]
    for name, size, simple, bg, inset in icons:
        img = render_png(size, simple, bg, inset)
        img.save(app / name)
        print(f"  {name}  {size}x{size}")

    # Multi-size .ico for legacy browsers and Windows pinned sites.
    ico = render_png(64, True)
    ico.save(app / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("  favicon.ico  16/32/48")


if __name__ == "__main__":
    main()
