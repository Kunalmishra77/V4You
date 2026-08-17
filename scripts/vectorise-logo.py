"""
Vectorise the client-supplied raster logos into brand SVGs.

`docs/08-asset-checklist.md` flags the raster PNG as a critical blocker: a 2048px
bitmap will not scale cleanly to a 34px header mark. This script resolves that by
tracing the rasters to true vector outlines.

    python scripts/vectorise-logo.py [logo.png] [favicon.png]

With no arguments it reads `assets/brand/source/`, which keeps the whole brand
pipeline reproducible from a clean checkout. Outputs land in `assets/brand/`.
Run once — the generated SVGs are committed. Re-run only when the client supplies
new artwork.

Method
  1. Classify every pixel to the nearest of {background, slash, navy, amber}.
     The bone background and the near-white diagonal slash inside the mark both
     classify as transparent, which is what "remove the background" means here.
  2. Trace the navy and amber masks separately with potrace (bezier output).
  3. Emit SVGs snapped to the exact design tokens from `docs/01 §1`, cropped to the
     ink bounding box.

Requires: pillow, numpy, potracer.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import potrace
from PIL import Image

# Design tokens (docs/01 §1). The traced output is snapped to these rather than to
# the raster's anti-aliased averages, so the logo and the site share one palette.
NAVY = "#0A1D3E"
AMBER = "#EDA11A"
BONE = "#F6F5F1"

# Reference colours measured from the source rasters.
REF = {
    "bg": (246, 245, 241),
    "slash": (253, 252, 250),  # the near-white diagonal gap inside the mark
    "navy": (10, 29, 62),
    "amber": (237, 161, 26),
}
TRANSPARENT = {"bg", "slash"}

OUT = Path(__file__).resolve().parent.parent / "assets" / "brand"


def classify(rgb: np.ndarray) -> dict[str, np.ndarray]:
    """Nearest-reference-colour classification, one boolean mask per ink colour."""
    names = list(REF)
    refs = np.array([REF[n] for n in names], dtype=float)
    d = np.linalg.norm(rgb[:, :, None, :].astype(float) - refs[None, None, :, :], axis=3)
    idx = d.argmin(axis=2)
    return {n: (idx == i) for i, n in enumerate(names) if n not in TRANSPARENT}


def trace(mask: np.ndarray, turdsize: int = 8) -> str:
    """Trace a boolean mask to SVG path data."""
    # potracer thresholds at 255 * blacklevel and then inverts unconditionally, so
    # ink has to be handed over as 0 and background as 255.
    bmp = potrace.Bitmap(np.where(mask, 0, 255).astype(np.uint8))
    path = bmp.trace(turdsize=turdsize, alphamax=1.0, opticurve=True, opttolerance=0.2)

    def xy(p):
        return (p.x, p.y) if hasattr(p, "x") else tuple(p)

    out = []
    for curve in path:
        sx, sy = xy(curve.start_point)
        d = [f"M{sx:.2f} {sy:.2f}"]
        for seg in curve:
            ex, ey = xy(seg.end_point)
            if seg.is_corner:
                cx, cy = xy(seg.c)
                d.append(f"L{cx:.2f} {cy:.2f}L{ex:.2f} {ey:.2f}")
            else:
                c1x, c1y = xy(seg.c1)
                c2x, c2y = xy(seg.c2)
                d.append(f"C{c1x:.2f} {c1y:.2f} {c2x:.2f} {c2y:.2f} {ex:.2f} {ey:.2f}")
        d.append("Z")
        out.append("".join(d))
    return "".join(out)


def extract(src: str) -> tuple[dict[str, str], int, int]:
    """Trace one raster. Returns per-colour path data plus the ink bounding box size."""
    rgb = np.array(Image.open(src).convert("RGB"))
    masks = classify(rgb)

    ink = np.zeros(rgb.shape[:2], bool)
    for m in masks.values():
        ink |= m
    ys, xs = np.nonzero(ink)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1

    paths = {name: trace(m[y0:y1, x0:x1]) for name, m in masks.items()}
    return paths, int(x1 - x0), int(y1 - y0)


def svg(paths: dict[str, str], view: str, navy_fill: str, extra: str = "") -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" fill="none" '
        f'role="img" aria-label="V4You Technologies">'
        f"<title>V4You Technologies</title>{extra}"
        f'<path fill="{AMBER}" d="{paths["amber"]}"/>'
        f'<path fill="{navy_fill}" d="{paths["navy"]}"/>'
        f"</svg>"
    )


def write(name: str, content: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(content, encoding="utf-8")
    print(f"  {name:<26} {len(content) / 1024:5.1f} KB")


def main(logo_src: str, mark_src: str) -> None:
    print("Tracing the full lockup…")
    lock, lw, lh = extract(logo_src)
    view = f"0 0 {lw} {lh}"
    write("logo-full.svg", svg(lock, view, NAVY))
    write("logo-full-light.svg", svg(lock, view, BONE))

    print("Tracing the mark…")
    mark, mw, mh = extract(mark_src)

    # Square the mark so it drops into an icon slot without the caller having to
    # compensate. 7% optical padding on the long edge.
    side = round(max(mw, mh) * 1.14)
    dx, dy = (side - mw) / 2, (side - mh) / 2
    shifted = f'<g transform="translate({dx:.2f} {dy:.2f})">'
    boxed = {k: v for k, v in mark.items()}
    square = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side} {side}" fill="none" '
        f'role="img" aria-label="V4You Technologies">'
        f"<title>V4You Technologies</title>{shifted}"
        f'<path fill="{AMBER}" d="{boxed["amber"]}"/>'
        f'<path fill="{{navy}}" d="{boxed["navy"]}"/>'
        f"</g></svg>"
    )
    write("logo-mark.svg", square.replace("{navy}", NAVY))
    write("logo-mark-light.svg", square.replace("{navy}", BONE))

    # The favicon carries a colour-scheme swap so the navy mark does not disappear
    # into a dark browser chrome.
    favicon = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side} {side}" fill="none" '
        f'role="img" aria-label="V4You Technologies">'
        f"<title>V4You Technologies</title>"
        f"<style>.ink{{fill:{NAVY}}}"
        f"@media(prefers-color-scheme:dark){{.ink{{fill:{BONE}}}}}</style>"
        f"{shifted}"
        f'<path fill="{AMBER}" d="{boxed["amber"]}"/>'
        f'<path class="ink" d="{boxed["navy"]}"/>'
        f"</g></svg>"
    )
    write("favicon.svg", favicon)


if __name__ == "__main__":
    if len(sys.argv) == 1:
        source = OUT / "source"
        args = (str(source / "logo-2048.png"), str(source / "favicon-2048.png"))
    elif len(sys.argv) == 3:
        args = (sys.argv[1], sys.argv[2])
    else:
        sys.exit("usage: python scripts/vectorise-logo.py [logo.png] [favicon.png]")

    for path in args:
        if not Path(path).exists():
            sys.exit(f"missing input: {path}\nSee assets/brand/source/README.md.")

    main(*args)
