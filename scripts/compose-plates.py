"""Compose Bracken & Board plates from CC0 ambientCG colour maps.

Orthographic elevations and top-down plans. Hard shadows, no people.
Textures are build inputs (not shipped). Output is AVIF in public/photos.

Usage:
  TEXTURE_DIR=/tmp/tex/color python3 scripts/compose-plates.py

Expected files in TEXTURE_DIR (ambientCG 1K Color jpgs):
  rock.jpg    Rock035
  wood.jpg    WoodFloor051
  gravel.jpg  Gravel021
  pave.jpg    PavingStones092
  brick.jpg   Bricks097
"""

from __future__ import annotations

import os
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "photos"
TEX = Path(os.environ.get("TEXTURE_DIR", "/tmp/tex/color"))

SKY = np.array([0.894, 0.855, 0.780], np.float32)
JOINT = np.array([0.141, 0.106, 0.078], np.float32)
MOSS = np.array([0.247, 0.357, 0.227], np.float32)
SOIL = np.array([0.62, 0.50, 0.36], np.float32)


def load_lum(name: str) -> np.ndarray:
    path = TEX / name
    if not path.exists():
        raise SystemExit(f"Missing texture {path}. Download the ambientCG Color jpg and set TEXTURE_DIR.")
    arr = np.asarray(Image.open(path).convert("RGB"), np.float32) / 255.0
    return 0.2126 * arr[:, :, 0] + 0.7152 * arr[:, :, 1] + 0.0722 * arr[:, :, 2]


def sample(lum: np.ndarray, y0: int, x0: int, h: int, w: int) -> np.ndarray:
    th, tw = lum.shape
    yy = (np.arange(h) + y0) % th
    xx = (np.arange(w) + x0) % tw
    return lum[yy][:, xx]


def grade(lum: np.ndarray, dark: tuple[float, float, float], light: tuple[float, float, float]) -> np.ndarray:
    lo, hi = np.percentile(lum, 3), np.percentile(lum, 97)
    n = np.clip((lum - lo) / (hi - lo + 1e-6), 0, 1)
    n = np.power(n, 0.92)
    d = np.array(dark, np.float32)
    l = np.array(light, np.float32)
    return d + (l - d) * n[..., None]


def blank(h: int, w: int, color: np.ndarray) -> np.ndarray:
    canvas = np.empty((h, w, 3), np.float32)
    canvas[:] = color
    return canvas


def fill_tex(canvas, lum, box, dark, light, origin=(0, 0)):
    x, y, w, h = box
    if w <= 0 or h <= 0:
        return
    patch = sample(lum, y + origin[0], x + origin[1], h, w)
    canvas[y : y + h, x : x + w] = grade(patch, dark, light)


def shadow(canvas, mask: np.ndarray, amount: float):
    canvas *= (1.0 - amount * np.clip(mask, 0, 1))[..., None]


def rect_mask(h, w, box, dx, dy) -> np.ndarray:
    x, y, bw, bh = box
    src = np.zeros((h, w), np.float32)
    y0, y1 = max(0, y), min(h, y + bh)
    x0, x1 = max(0, x), min(w, x + bw)
    src[y0:y1, x0:x1] = 1
    out = np.zeros_like(src)
    ys, ye = max(0, y0 + dy), min(h, y1 + dy)
    xs, xe = max(0, x0 + dx), min(w, x1 + dx)
    if ye > ys and xe > xs:
        out[ys:ye, xs:xe] = 1
    # Keep the shadow off the occluder itself.
    out = np.clip(out - src, 0, 1)
    return out


def bond(canvas, lum, box, course, block, dark, light, joint=4):
    x, y, w, h = box
    row = 0
    yy = y
    while yy < y + h - 1:
        ch = min(course, y + h - yy)
        offset = (block // 2) if row % 2 else 0
        xx = x - offset
        while xx < x + w:
            x0 = max(xx + joint, x)
            x1 = min(xx + block, x + w)
            y0 = yy + joint
            y1 = yy + ch
            if x1 - x0 > 2 and y1 - y0 > 2:
                fill_tex(canvas, lum, (x0, y0, x1 - x0, y1 - y0), dark, light)
            xx += block
        yy += course
        row += 1


def boards(canvas, lum, box, dark, light, board=26, joint=3, axis="h"):
    x, y, w, h = box
    if axis == "h":
        yy = y
        i = 0
        while yy < y + h:
            bh = min(board, y + h - yy)
            shift = 0.04 * (i % 3)
            d = tuple(max(0, c - shift) for c in dark)
            l = tuple(min(1, c + shift) for c in light)
            fill_tex(canvas, lum, (x, yy, w, max(1, bh - joint)), d, l, origin=(i * 17, 0))
            yy += board
            i += 1
    else:
        xx = x
        i = 0
        while xx < x + w:
            bw = min(board, x + w - xx)
            shift = 0.04 * (i % 3)
            d = tuple(max(0, c - shift) for c in dark)
            l = tuple(min(1, c + shift) for c in light)
            fill_tex(canvas, lum, (xx, y, max(1, bw - joint), h), d, l, origin=(0, i * 17))
            xx += board
            i += 1


def blobs(canvas, box, color, seed, thresh=0.62, cell=10):
    x, y, w, h = box
    rng = np.random.default_rng(seed)
    gh, gw = max(2, h // cell), max(2, w // cell)
    noise = rng.random((gh, gw)).astype(np.float32)
    im = Image.fromarray((noise * 255).astype(np.uint8)).resize((w, h), Image.Resampling.BICUBIC)
    mask = np.asarray(im, np.float32) / 255.0 > thresh
    region = canvas[y : y + h, x : x + w]
    region[mask] = color


def cracks(canvas, box, seed):
    rng = np.random.default_rng(seed)
    x, y, w, h = box
    for _ in range(7):
        px = int(rng.integers(x + 20, x + w - 20))
        py = int(rng.integers(y + 20, y + h - 20))
        for _step in range(int(rng.integers(30, 90))):
            if not (y < py < y + h - 1 and x < px < x + w - 1):
                break
            canvas[py : py + 2, px : px + 2] = JOINT
            px += int(rng.integers(-1, 2))
            py += int(rng.integers(0, 3))


def finish(canvas: np.ndarray) -> np.ndarray:
    arr = np.clip(canvas, 0, 1)
    arr = np.clip((arr - 0.03) * 1.08, 0, 1)
    arr *= np.array([1.03, 1.0, 0.95], np.float32)
    return np.clip(arr, 0, 1)


def save(canvas: np.ndarray, name: str, widths: list[int]):
    im = Image.fromarray((finish(canvas) * 255).astype(np.uint8))
    h, w = canvas.shape[:2]
    for width in widths:
        rh = max(1, round(width * h / w))
        out = im.resize((width, rh), Image.Resampling.LANCZOS)
        path = OUT / f"{name}-{width}.avif"
        out.save(path, quality=34, speed=6)
        print(f"{path.name:32} {path.stat().st_size:7d}")


def elevation_ground(h, w, horizon):
    canvas = blank(h, w, SKY)
    canvas[horizon:, :] = SOIL * 0.85
    return canvas


def scene_hero(tex):
    h, w = 1200, 1600
    horizon = 430
    canvas = elevation_ground(h, w, horizon)
    wall = (80, 160, 1440, 620)
    bond(canvas, tex["rock"], wall, 78, 168, (0.42, 0.38, 0.32), (0.90, 0.86, 0.76))
    # gravel haunch at the wall base
    fill_tex(canvas, tex["gravel"], (80, 760, 1440, 36), (0.32, 0.29, 0.25), (0.70, 0.66, 0.58))
    boards(canvas, tex["wood"], (0, 796, w, h - 796), (0.20, 0.09, 0.07), (0.55, 0.28, 0.18), board=34)
    shadow(canvas, rect_mask(h, w, wall, 28, 48), 0.48)
    return canvas


def scene_plan(tex):
    h, w = 1200, 1600
    canvas = blank(h, w, JOINT)
    # edge restraint
    bond(canvas, tex["rock"], (0, 0, w, h), 70, 150, (0.28, 0.24, 0.20), (0.55, 0.50, 0.44), joint=3)
    # inner gravel margin
    fill_tex(canvas, tex["gravel"], (70, 70, w - 140, h - 140), (0.34, 0.31, 0.27), (0.72, 0.67, 0.58))
    # paver field
    bond(canvas, tex["pave"], (150, 150, w - 300, h - 300), 64, 128, (0.38, 0.16, 0.12), (0.66, 0.34, 0.24))
    # jarrah deck inset
    boards(canvas, tex["wood"], (980, 180, 420, 520), (0.20, 0.09, 0.07), (0.52, 0.26, 0.17), board=28, axis="v")
    return canvas


def scene_deck_before(tex):
    h, w = 1200, 1800
    horizon = 460
    canvas = elevation_ground(h, w, horizon)
    # house wall
    bond(canvas, tex["brick"], (0, 80, w, 400), 56, 150, (0.32, 0.28, 0.26), (0.62, 0.58, 0.54))
    # cracked slab
    fill_tex(canvas, tex["rock"], (0, 500, w, h - 500), (0.40, 0.38, 0.35), (0.72, 0.70, 0.66))
    cracks(canvas, (40, 540, w - 80, h - 580), 11)
    blobs(canvas, (80, 620, w - 160, 500), MOSS * 0.8, 19, thresh=0.78, cell=18)
    # bin
    canvas[560:760, 120:250] = (0.18, 0.20, 0.18)
    canvas[540:570, 140:230] = (0.12, 0.13, 0.12)
    # clothesline pole
    canvas[300:900, 1500:1516] = JOINT
    canvas[300:312, 1320:1680] = JOINT
    shadow(canvas, rect_mask(h, w, (0, 80, w, 420), 40, 36), 0.4)
    return canvas


def scene_deck_after(tex):
    h, w = 1200, 1800
    horizon = 440
    canvas = elevation_ground(h, w, horizon)
    wall = (0, 120, w, 520)
    bond(canvas, tex["rock"], wall, 74, 160, (0.42, 0.38, 0.32), (0.90, 0.86, 0.76))
    boards(canvas, tex["wood"], (0, 700, w, h - 700), (0.20, 0.09, 0.07), (0.55, 0.28, 0.18), board=32)
    # bench
    bench = (1180, 640, 460, 200)
    boards(canvas, tex["wood"], bench, (0.16, 0.07, 0.05), (0.42, 0.20, 0.13), board=22)
    # planter
    canvas[600:780, 80:280] = JOINT
    blobs(canvas, (96, 560, 168, 80), MOSS, 4, thresh=0.4, cell=8)
    shadow(canvas, rect_mask(h, w, wall, 24, 40), 0.46)
    shadow(canvas, rect_mask(h, w, bench, 18, 30), 0.4)
    return canvas


def scene_entry_before(tex):
    h, w = 1200, 1800
    canvas = blank(h, w, SOIL)
    fill_tex(canvas, tex["gravel"], (0, 0, w, h), (0.48, 0.38, 0.26), (0.78, 0.66, 0.48))
    blobs(canvas, (0, 0, w, h), MOSS * 0.75, 21, thresh=0.8, cell=22)
    # broken path
    fill_tex(canvas, tex["rock"], (700, 0, 280, h), (0.45, 0.43, 0.40), (0.75, 0.73, 0.68))
    cracks(canvas, (700, 0, 280, h), 8)
    # loose bricks
    rng = np.random.default_rng(3)
    for i in range(14):
        x = int(rng.integers(80, 600))
        y = int(rng.integers(80, h - 80))
        bw, bh = 70, 36
        fill_tex(canvas, tex["brick"], (x, y, bw, bh), (0.40, 0.18, 0.12), (0.62, 0.30, 0.20))
    return canvas


def scene_entry_after(tex):
    h, w = 1200, 1800
    canvas = blank(h, w, JOINT)
    fill_tex(canvas, tex["gravel"], (0, 0, w, h), (0.30, 0.27, 0.23), (0.62, 0.58, 0.50))
    # beds
    blobs(canvas, (40, 40, 460, h - 80), MOSS, 6, thresh=0.45, cell=16)
    blobs(canvas, (1280, 40, 460, h - 80), MOSS, 9, thresh=0.45, cell=16)
    # low limestone edges
    bond(canvas, tex["rock"], (500, 0, 80, h), 64, 120, (0.42, 0.38, 0.32), (0.88, 0.84, 0.74), joint=3)
    bond(canvas, tex["rock"], (1180, 0, 80, h), 64, 120, (0.42, 0.38, 0.32), (0.88, 0.84, 0.74), joint=3)
    bond(canvas, tex["pave"], (580, 0, 600, h), 70, 140, (0.45, 0.40, 0.34), (0.90, 0.86, 0.76))
    return canvas


def scene_garden_before(tex):
    h, w = 1200, 1800
    horizon = 520
    canvas = elevation_ground(h, w, horizon)
    # fence
    boards(canvas, tex["wood"], (0, 180, w, 360), (0.28, 0.24, 0.20), (0.55, 0.50, 0.44), board=36, axis="v")
    fill_tex(canvas, tex["gravel"], (0, horizon, w, h - horizon), (0.42, 0.32, 0.22), (0.70, 0.58, 0.40))
    blobs(canvas, (0, horizon, w, h - horizon), MOSS * 0.7, 15, thresh=0.74, cell=20)
    # sleeper stack
    for i in range(4):
        canvas[700 - i * 28 : 724 - i * 28, 140:420] = (0.28 + i * 0.02, 0.16, 0.10)
    # drum
    canvas[760:980, 1500:1660] = (0.35, 0.22, 0.14)
    shadow(canvas, rect_mask(h, w, (0, 180, w, 360), 160, 70), 0.5)
    return canvas


def scene_garden_after(tex):
    h, w = 1200, 1800
    horizon = 480
    canvas = elevation_ground(h, w, horizon)
    # fence behind
    boards(canvas, tex["wood"], (0, 140, w, 280), (0.30, 0.26, 0.22), (0.58, 0.53, 0.46), board=34, axis="v")
    # terrace wall
    wall = (80, 400, 1100, 280)
    bond(canvas, tex["rock"], wall, 70, 160, (0.42, 0.38, 0.32), (0.90, 0.86, 0.76))
    # planting on the terrace
    blobs(canvas, (120, 340, 1000, 80), MOSS, 12, thresh=0.42, cell=12)
    # lawn
    canvas[700:, :] = (0.30, 0.42, 0.28)
    fill_tex(canvas, tex["gravel"], (0, 700, w, h - 700), (0.22, 0.32, 0.20), (0.40, 0.52, 0.34))
    # stepping stones
    for i, x in enumerate(range(180, 900, 160)):
        bond(canvas, tex["rock"], (x, 860 + (i % 2) * 30, 110, 70), 70, 110, (0.50, 0.46, 0.40), (0.88, 0.84, 0.76), joint=2)
    # pergola posts and beam
    for x in (1280, 1500, 1680):
        canvas[260:820, x : x + 28] = (0.28, 0.12, 0.08)
    canvas[260:300, 1260:1720] = (0.32, 0.14, 0.09)
    shadow(canvas, rect_mask(h, w, (1260, 260, 460, 560), 200, 90), 0.55)
    shadow(canvas, rect_mask(h, w, wall, 120, 50), 0.42)
    return canvas


def swatch_bond(tex, key, dark, light, course, block):
    canvas = blank(960, 960, JOINT)
    bond(canvas, tex[key], (0, 0, 960, 960), course, block, dark, light, joint=5)
    return canvas


def swatch_boards(tex):
    canvas = blank(960, 960, JOINT)
    boards(canvas, tex["wood"], (0, 0, 960, 960), (0.18, 0.08, 0.06), (0.55, 0.28, 0.18), board=48)
    return canvas


def swatch_gravel(tex):
    canvas = blank(960, 960, JOINT)
    fill_tex(canvas, tex["gravel"], (0, 0, 960, 960), (0.30, 0.27, 0.23), (0.74, 0.68, 0.58))
    return canvas


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tex = {name: load_lum(f"{name}.jpg") for name in ("rock", "wood", "gravel", "pave", "brick")}
    scenes = {
        "hero-wall": (scene_hero(tex), [640, 1100, 1600]),
        "plan-path": (scene_plan(tex), [640, 1100, 1600]),
        "deck-before": (scene_deck_before(tex), [640, 1200, 1800]),
        "deck-after": (scene_deck_after(tex), [640, 1200, 1800]),
        "entry-before": (scene_entry_before(tex), [640, 1200, 1800]),
        "entry-after": (scene_entry_after(tex), [640, 1200, 1800]),
        "garden-before": (scene_garden_before(tex), [640, 1200, 1800]),
        "garden-after": (scene_garden_after(tex), [640, 1200, 1800]),
        "swatch-limestone": (swatch_bond(tex, "rock", (0.42, 0.38, 0.32), (0.91, 0.87, 0.78), 80, 170), [480, 960]),
        "swatch-jarrah": (swatch_boards(tex), [480, 960]),
        "swatch-gravel": (swatch_gravel(tex), [480, 960]),
        "swatch-brick": (swatch_bond(tex, "pave", (0.36, 0.15, 0.11), (0.64, 0.32, 0.22), 72, 144), [480, 960]),
    }
    for name, (canvas, widths) in scenes.items():
        save(canvas, name, widths)


if __name__ == "__main__":
    main()
