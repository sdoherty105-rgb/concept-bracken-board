# Assets

Every image, texture and font used by the Bracken & Board concept, with source and licence. No photographs of people. No stock photography of real gardens. The business is fictional.

The plates on the site are the lit set from `redesign/project-archive` at commit `ff160b4`. They were drawn as original SVG scenes (`scripts/generate-art.mjs`), rendered (`scripts/render-scenes.mjs`) and given directional light, leaf shade and grain by `scripts/develop-photos.py`. This round converts those WebP masters to the AVIF sizes the pages request. Dimension lines over the hero are inline SVG and are not baked into the files.

The earlier procedural plates, built by tiling ambientCG colour maps in `scripts/compose-plates.py`, are not what the pages display. That script remains in the repo and is not the art command.

## Plates

Masters live on `ff160b4` as `public/photos/*.webp`. Shipped files are AVIF in `public/photos/`.

| Shipped plate | Master on ff160b4 | Used for |
| --- | --- | --- |
| `hero-wall` | `deck-after-2000.webp` | Home, right side of the first screen |
| `plan-path` | `entry-after-2000.webp` | Home, beside the section drawing |
| `deck-before`, `deck-after` | `deck-before-2000.webp`, `deck-after-2000.webp` | Courtyard deck, before and after |
| `entry-before`, `entry-after` | `entry-before-2000.webp`, `entry-after-2000.webp` | Entry path, before and after |
| `garden-before`, `garden-after` | `garden-before-2000.webp`, `garden-after-2000.webp` | Terraced garden, before and after |
| `swatch-limestone` | Crop of `entry-after-wall-960.webp` | Materials wall, limestone |
| `swatch-jarrah` | Crop of `deck-after-boards-960.webp` | Materials wall, jarrah boards |
| `swatch-gravel` | Crop of the sandy ground in `entry-before-2000.webp` | Materials wall, the ground before a new base |
| `swatch-brick` | Crop of the pavers in `entry-after-2000.webp` | Materials wall, entry pavers |
| `app/icon.svg` | Original geometric mark | Favicon |

All of those masters are original work owned by OFF/SHIFT Studio. No stock photography, no photographs of people, no third-party images. The lighting treatment is procedural and seeded inside `develop-photos.py`.

Scene plates are served at 640, 800, 1200 and 1800 wide. The hero and the entry plate beside the section are served at 640, 1100 and 1600. Swatches are square at 480, 800 and 960.

## Fonts

Self-hosted through `next/font/local`. No request is made to Google Fonts or any other host.

| Font | File | Source | Licence |
| --- | --- | --- | --- |
| Archivo, Latin, weight 800 at width 125 (headings) | `app/fonts/archivo-latin-800-wdth125.woff2` | Instantiated from the variable font below | SIL Open Font License 1.1. See `app/fonts/OFL-Archivo.txt` |
| Archivo, Latin, weight 600 at width 100 (labels) | `app/fonts/archivo-latin-600-wdth100.woff2` | Instantiated from the variable font below | SIL Open Font License 1.1 |
| Archivo variable source, not served | `app/fonts/archivo-latin-standard-normal.woff2` | Omnibus-Type, Fontsource `@fontsource-variable/archivo@5.2.8` | SIL Open Font License 1.1 |
| Source Serif 4, Latin, weight 400 | `app/fonts/source-serif-4-latin-400-normal.woff2` | Adobe, Fontsource `@fontsource/source-serif-4@5.2.9` | SIL Open Font License 1.1. See `app/fonts/OFL-SourceSerif4.txt` |

The two Archivo files the site serves are static instances of the variable font (`wght` 800 / `wdth` 125, and `wght` 600 / `wdth` 100), made with fontTools so the page does not download the full variable file. Body text is Source Serif 4 at 19px. Manrope and Cormorant are not used.

## What is not in the site

- Stock photography, client photography, and photographs of faces or people: none.
- Third-party logos, reviews, awards and live statistics: none.
- Prices, visit windows, takeoff rates and the ten-year terms are invented and labelled on the page as demonstration data.
- Gradients are not used in the stylesheet or the icon.
