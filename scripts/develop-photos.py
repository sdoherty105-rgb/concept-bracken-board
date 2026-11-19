"""Develops the generated SVG scenes into photographic prints.

Each scene is rendered at high resolution (scripts/render-scenes.mjs), then this
script adds the qualities a camera would record: directional sunlight, dappled
tree shade, surface grain, soft depth of field towards the horizon, lens
vignetting and film grain. Output is responsive WebP in public/photos,
plus portrait detail crops of each finished scene.

Usage: python3 scripts/develop-photos.py <rendered-png-dir>
Everything is procedural and seeded, so the output is reproducible.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "photos"
WIDTHS = [640, 1280, 2000]

# Per scene: where the sun comes from, how warm it is, how much shade falls
# across the ground and where the ground starts (fraction of height).
SCENES = {
    "deck-before": dict(sun=(0.15, -0.2), warmth=0.55, dapple=0.10, ground=0.56, seed=11, haze=0.0),
    "deck-after": dict(sun=(0.15, -0.2), warmth=0.85, dapple=0.22, ground=0.56, seed=12, haze=0.0),
    "entry-before": dict(sun=(0.9, -0.3), warmth=0.5, dapple=0.06, ground=0.52, seed=21, haze=0.0),
    "entry-after": dict(sun=(0.9, -0.3), warmth=0.9, dapple=0.16, ground=0.52, seed=22, haze=0.0),
    "garden-before": dict(sun=(0.75, -0.25), warmth=0.6, dapple=0.08, ground=0.53, seed=31, haze=0.35),
    "garden-after": dict(sun=(0.75, -0.25), warmth=0.95, dapple=0.26, ground=0.53, seed=32, haze=0.35),
}


def fractal_noise(h, w, rng, octaves=5, base=4):
    """Smooth value noise, summed over octaves, in 0..1."""
    acc = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        cells = base * 2**o
        grid = rng.random((cells + 1, int(cells * w / h) + 2)).astype(np.float32)
        layer = Image.fromarray((grid * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        acc += amp * np.asarray(layer, np.float32) / 255
        total += amp
        amp *= 0.5
    return acc / total


def develop(src: Path, cfg: dict) -> Image.Image:
    img = np.asarray(Image.open(src).convert("RGB"), np.float32) / 255
    h, w, _ = img.shape
    rng = np.random.default_rng(cfg["seed"])
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx, ny = xx / w, yy / h

    # Surface texture: fine mottling so flat fills read as material.
    tex = fractal_noise(h, w, rng, octaves=4, base=60)
    img *= (0.955 + 0.09 * tex)[..., None]

    # Directional sunlight: brighter towards the sun, warm in the highlights.
    sx, sy = cfg["sun"]
    d = np.sqrt((nx - sx) ** 2 + (ny - sy) ** 2)
    light = np.clip(1.16 - 0.32 * d, 0.84, 1.12)
    warm = np.array([1.0 + 0.10 * cfg["warmth"], 1.0 + 0.03 * cfg["warmth"], 1.0 - 0.08 * cfg["warmth"]], np.float32)
    img = img * light[..., None] * warm

    # Dappled shade from trees out of frame, falling on the ground plane only.
    if cfg["dapple"]:
        leaf = fractal_noise(h, w, rng, octaves=3, base=16)
        leaf = np.clip((leaf - 0.56) * 9 + 0.5, 0, 1)
        leaf = np.asarray(Image.fromarray((leaf * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(w / 700)), np.float32) / 255
        # Shade is strongest near the frame edges, where the trees would be.
        leaf *= np.clip(np.abs(nx - 0.5) * 2.2, 0.25, 1)
        on_ground = np.clip((ny - cfg["ground"]) * 12, 0, 1)
        shade = 1 - cfg["dapple"] * leaf * on_ground
        cool = np.stack([shade * 0.97, shade * 0.99, shade * 1.03], -1)
        img *= cool

    # Contact shadow where walls meet the ground.
    band = np.exp(-(((ny - cfg["ground"]) * 28) ** 2))
    img *= (1 - 0.18 * band)[..., None]

    out = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))

    # Depth of field: soften the far plane slightly, keep the foreground sharp.
    far = out.filter(ImageFilter.GaussianBlur(w / 900))
    mask = np.clip(1 - (ny - 0.05) / (cfg["ground"] - 0.05), 0, 1) * (0.35 + cfg["haze"])
    out = Image.composite(far, out, Image.fromarray((np.clip(mask, 0, 1) * 255).astype(np.uint8)))
    arr = np.asarray(out, np.float32) / 255

    # Atmospheric haze towards the horizon.
    if cfg["haze"]:
        hz = cfg["haze"] * np.clip(1 - np.abs(ny - cfg["ground"] + 0.08) * 5, 0, 1) * 0.18
        arr = arr * (1 - hz[..., None]) + np.array([0.93, 0.9, 0.84], np.float32) * hz[..., None]

    # Tone curve: lift shadows slightly, roll off highlights like film.
    arr = np.clip(arr, 0, 1)
    arr = 0.02 + 0.97 * (arr + 0.9 * arr * (1 - arr) * (arr - 0.5))
    lum = arr.mean(-1, keepdims=True)
    arr = lum + (arr - lum) * 1.12

    # Lens vignette.
    v = 1 - 0.22 * (((nx - 0.5) * 1.1) ** 2 + ((ny - 0.5) * 1.3) ** 2) ** 1.1
    arr *= v[..., None]

    # Film grain, luminance only.
    grain = rng.normal(0, 0.016, (h, w)).astype(np.float32)
    arr += grain[..., None]

    return Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8))


# Detail crops of the finished scenes: (name, centre x, centre y, width), all as
# fractions of the frame. Every crop is 4:5 portrait.
DETAILS = {
    "deck-after": [("bench", 0.78, 0.52, 0.3), ("boards", 0.26, 0.78, 0.3)],
    "entry-after": [("lights", 0.62, 0.74, 0.3), ("wall", 0.86, 0.66, 0.3)],
    "garden-after": [("pergola", 0.86, 0.56, 0.3), ("stones", 0.5, 0.74, 0.3)],
}
DETAIL_WIDTHS = [480, 960]


def crop(photo: Image.Image, cx: float, cy: float, wf: float) -> Image.Image:
    w = round(photo.width * wf)
    h = round(w * 1.25)
    x = min(max(round(photo.width * cx - w / 2), 0), photo.width - w)
    y = min(max(round(photo.height * cy - h / 2), 0), photo.height - h)
    return photo.crop((x, y, x + w, y + h))


def main():
    src_dir = Path(sys.argv[1])
    OUT.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[2:])
    for name, cfg in SCENES.items():
        if only and name not in only:
            continue
        src = src_dir / f"{name}.png"
        if not src.exists():
            continue
        photo = develop(src, cfg)
        for w in WIDTHS:
            h = round(photo.height * w / photo.width)
            photo.resize((w, h), Image.LANCZOS).save(OUT / f"{name}-{w}.webp", "WEBP", quality=74, method=6)
        for label, cx, cy, wf in DETAILS.get(name, []):
            detail = crop(photo, cx, cy, wf)
            for w in DETAIL_WIDTHS:
                detail.resize((w, round(w * 1.25)), Image.LANCZOS).save(OUT / f"{name}-{label}-{w}.webp", "WEBP", quality=76, method=6)
        print(name)


if __name__ == "__main__":
    main()
