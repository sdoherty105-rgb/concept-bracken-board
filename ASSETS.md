# Assets

Every visual and font asset used by this concept, with its source and licence. No stock photography, no photographs of people, and no third-party images are used.

## Plates (original artwork)

Every image on the site is an original illustration made for this concept by OFF/SHIFT Studio. Nothing is a photograph and the site says so in the footer.

1. `scripts/generate-art.mjs` draws each scene as SVG into `art/`.
2. `scripts/render-scenes.mjs` renders each SVG at 2400 × 1600.
3. `scripts/develop-photos.py` gives each render a printed, sunlit finish (directional light, leaf shade, surface grain, soft depth and film grain, all procedural and seeded), cuts two 4:5 detail crops from each finished scene, and writes responsive WebP files to `public/photos/`.

`npm run art` runs all three.

| Source | Output | Used for |
| --- | --- | --- |
| `art/deck-before.svg`, `art/deck-after.svg` | `public/photos/deck-*.webp` | Project 001, the courtyard deck |
| `art/entry-before.svg`, `art/entry-after.svg` | `public/photos/entry-*.webp` | Project 002, the entry path |
| `art/garden-before.svg`, `art/garden-after.svg` | `public/photos/garden-*.webp` | Project 003, the terraced garden |
| `app/icon.svg` | Favicon | Hand-written SVG |

All are original work owned by OFF/SHIFT Studio, with no third-party rights.

## Fonts (self-hosted)

The font is served from this repository through `next/font/local`. No request is made to Google Fonts or any other third party.

| Font | Files | Source | Licence |
| --- | --- | --- | --- |
| Manrope (body, variable weight, Latin subset) | `app/fonts/manrope-latin-wght-normal.woff2` | Mikhail Sharanda, via the Fontsource distribution (`@fontsource-variable/manrope`) | SIL Open Font License 1.1 |

## Summary

- Stock or licensed photography: none.
- Photographs of faces or people: none.
- Third-party images or logos: none.
- Client logos, awards, reviews and statistics: none (all content is invented and clearly labelled as a fictional demonstration).
- Fonts: one OFL 1.1 font, self-hosted.
