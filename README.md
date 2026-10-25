# Bracken & Board — OFF/SHIFT concept 04

A fictional concept website for **Bracken & Board**, a premium landscaping and outdoor construction business (decks, paving, gardens). Built by OFF/SHIFT Studio as a portfolio piece.

> An OFF/SHIFT concept — fictional demonstration. Bracken & Board is not a real business. Nothing here was built for, sold to or delivered to a client. Every page is `noindex`.

Concept page: <https://offshiftstudio.com.au/concepts/bracken-board>

## Pages

- `/` Hero, services, before/after slider, process, materials, demo quote form, footer
- `/projects` Three illustrated before/after transformations with scope and materials
- 404 page

## Signature interaction

The before/after comparison slider is a native `<input type="range">` laid over two images, so keyboard (arrows, Home, End, PageUp/PageDown), mouse and touch work with no custom event code. Without JavaScript the two images are shown stacked and labelled "Before" and "After". `@media (scripting: enabled)` switches to the overlay layout before any script runs, so there is no layout shift.

## Stack

Next.js 15 (App Router, TypeScript), statically generated, deployable to Cloudflare Workers through `@opennextjs/cloudflare` (`wrangler.jsonc`, worker name `concept-bracken-board`). Fonts are self-hosted. No analytics or third-party requests.

## Commands

```bash
npm ci
npm run dev        # local dev server
npm run build      # production build
npm run typecheck
npm run lint
npm test           # Playwright tests (needs a build first)
npm run lhci       # Lighthouse CI, mobile
npm run art        # regenerate the SVG illustrations
npm run cf:build   # build the OpenNext/Cloudflare bundle (does not deploy)
```

Locally, set `PW_CHROME_PATH` to use an installed Chrome instead of Playwright's browser. In CI, Playwright installs Chromium.

## Safeguards

- Visible concept label on every page, linking to the OFF/SHIFT concept page.
- `noindex, nofollow` via meta tag, `X-Robots-Tag` header (`next.config.ts` and `public/_headers`) and `robots.txt` (`Disallow: /`).
- The quote form is demo only: it validates in the browser, shows a success state saying nothing was sent, and has no `fetch`, no network request and no endpoint.
- Lighthouse CI skips the `is-crawlable` audit, because the deliberate noindex would otherwise fail it. Every other SEO audit still counts.

See `ASSETS.md` for the source and licence of every asset.

This repository is not deployed and no domain is configured.


## Visual redesign

A landscape project journal replaces the generic copy-and-illustration hero. The opening design study includes the working before/after slider, followed by staggered project drawings, service scope, a two-column construction process and a material specification list. Illustrated concepts are labelled clearly. Quote validation, slider keyboard/pointer support, no-JavaScript fallback and no-network form behaviour are retained.
