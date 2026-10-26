# Bracken & Board — OFF/SHIFT concept 04

A fictional concept website for **Bracken & Board**, a premium landscaping and outdoor construction business (decks, paving, gardens). Built by OFF/SHIFT Studio as a portfolio piece.

> An OFF/SHIFT concept — fictional demonstration. Bracken & Board is not a real business. Nothing here was built for, sold to or delivered to a client. Every page is `noindex`.

Concept page: <https://offshiftstudio.com.au/concepts/bracken-board>

## Direction: a project archive

The site is the work. There is no hero, no services grid and no process section. The home page opens on a one-line title and goes straight into project 001 as a full-width plate. Each project is a chapter: the lead plate, a catalogue sheet (site, completion, build time, kind of work), a before/after comparison, notes, scope and materials, and two detail crops. Chapters alternate their composition so the archive does not repeat itself.

Navigation is the plates themselves: a strip of project thumbnails fixed down the right edge on wide screens (marking the project in view), and an Index overlay with large thumbnails on every screen. "Start a project like this" opens a quote drawer already set to that kind of project.

Paper and ink, one typeface (Manrope), hairline rules, square edges. No cards, no pills, no eyebrow labels.

## Pages

- `/` The archive: three projects, then the practice and contact details in the footer
- `/projects` The index of projects as a ledger, newest first
- `/start` The quote form on its own page. Every "Start a project" link points here, so it works without JavaScript; with JavaScript the same form opens in a drawer instead
- 404 page

## Interactions

- **Before/after comparison.** A native `<input type="range">` laid over two plates, so keyboard (arrows, Home, End, PageUp/PageDown), mouse and touch work with no custom event code. Without JavaScript the two plates are stacked and labelled. `@media (scripting: enabled)` switches to the overlay before any script runs, so there is no layout shift.
- **Quote drawer.** A native `<dialog>`: focus moves in, Escape closes it, and it starts on the project type of the link you used. `/start?type=...` does the same without JavaScript.
- **Index.** A `<details>` overlay, so it opens without JavaScript; with it, it closes on Escape or after a pick.

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
npm run art        # regenerate the scenes and develop them into plates (needs Python 3 with Pillow and NumPy)
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
