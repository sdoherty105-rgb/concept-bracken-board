# Assets

Every image, texture and font used by the Bracken & Board concept, with source and licence. No photographs of people. No stock photography of real gardens. The business is fictional.

The plates are original compositions made for this concept. Colour and grain come from CC0 PBR colour maps. Joints, courses, hard shadows and the set-out are drawn by `scripts/compose-plates.py`. Regenerate with the colour maps in `TEXTURE_DIR` (default `/tmp/tex/color`) and `python3 scripts/compose-plates.py`.

`npm run art` runs that script. The older SVG pipeline (`scripts/generate-art.mjs`, `scripts/render-scenes.mjs`, `scripts/develop-photos.py`) is kept from `redesign/project-archive` and is not what the pages display.

## Plates

All files are AVIF in `public/photos/`. Scene plates are 3:2 or 4:3 at 640, 1100 or 1200, and 1600 or 1800 pixels wide. Swatches are square at 480 and 960.

| Plate | Used for | How it was made |
| --- | --- | --- |
| `hero-wall` | Home, right side of the first screen | Limestone courses (Rock035) and jarrah boards (WoodFloor051), hard midday shadow |
| `plan-path` | Home, beside the section drawing | Top-down pavers (PavingStones092), gravel margin (Gravel021), limestone edge (Rock035), jarrah inset (WoodFloor051) |
| `deck-before`, `deck-after` | Courtyard deck, before and after | Elevation. Before: brick wall (Bricks097), cracked slab (Rock035). After: limestone, jarrah, planter |
| `entry-before`, `entry-after` | Entry path, before and after | Top-down. Before: soil and loose bricks. After: paver path, limestone edges, planted beds |
| `garden-before`, `garden-after` | Terraced garden, before and after | Low-sun elevation. Before: fence, sleepers, bare ground. After: limestone terrace, pergola, stepping stones |
| `swatch-limestone` | Materials wall | Rock035 recoloured and coursed |
| `swatch-jarrah` | Materials wall | WoodFloor051 recoloured into boards |
| `swatch-gravel` | Materials wall | Gravel021 |
| `swatch-brick` | Materials wall | PavingStones092 recoloured into clay pavers |
| `app/icon.svg` | Favicon | Original geometric mark, square courses, no third-party art |

Survey lines over the hero are inline SVG in the page, not baked into the file.

## Textures

Build inputs only. They are not shipped to the browser. Each colour map is the ambientCG 1K JPG Color file, CC0 1.0.

| File used by the script | ambientCG id | Source | Licence |
| --- | --- | --- | --- |
| `rock.jpg` | Rock035 | https://ambientcg.com/view?id=Rock035 | CC0 1.0 |
| `wood.jpg` | WoodFloor051 | https://ambientcg.com/view?id=WoodFloor051 | CC0 1.0 |
| `gravel.jpg` | Gravel021 | https://ambientcg.com/view?id=Gravel021 | CC0 1.0 |
| `pave.jpg` | PavingStones092 | https://ambientcg.com/view?id=PavingStones092 | CC0 1.0 |
| `brick.jpg` | Bricks097 | https://ambientcg.com/view?id=Bricks097 | CC0 1.0 |

Download example: `https://ambientcg.com/get?file=Rock035_1K-JPG.zip` and take the `*_Color.jpg`. The script grades each map into the limestone, jarrah, gravel and clay palette, then cuts courses and shadows. Shipped plates are the derived AVIF files, each well under the page image budget. The raw 1K maps are about 1 MB and are not committed.

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
