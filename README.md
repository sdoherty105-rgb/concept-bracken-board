# Bracken & Board — OFF/SHIFT concept

A fictional concept website for **Bracken & Board**, a landscape builder that lays decks, paving, retaining and planting in courses. Built by OFF/SHIFT Studio as a portfolio piece. Direction: robust, a running-bond block wall.

> An OFF/SHIFT concept — fictional demonstration. Bracken & Board is not a real business. Nothing here was built for, sold to or delivered to a client. Every page is `noindex`.

Concept page: <https://offshiftstudio.com.au/concepts/bracken-board>

## Pages

- `/` Split hero, section drawing, four trades in running bond, a materials course, one project with the compare slider, the guarantee in large type, and a takeoff beside the site-visit request
- `/materials` Specimen wall
- `/projects` Project index, each with an engraved plate
- `/projects/[slug]` Project record and before/after plate
- `/guarantee` Demonstration ten-year workmanship terms
- 404

## What is different about this version

The page is a wall. A ledger bar holds Build, Materials, Projects and Guarantee, with a jarrah booking cell at the end. On a phone the bar becomes a bottom row: Menu and Site visit. Blocks are offset like brickwork. The section drawing assembles on scroll where the browser supports it, and becomes four snapshots on a narrow screen. The takeoff calculator works without JavaScript.

Visit windows, takeoff figures and the guarantee are labelled as demonstration data.

This branch starts from `redesign/project-archive` (lit plates, square edges, the compare slider, the demo quote form, and the plate tests). The layout is the running-bond brief, not the archive layout.

## Stack

Next.js 15 (App Router, TypeScript), OpenNext on Cloudflare Workers (`wrangler.jsonc`, worker name `concept-bracken-board`). Fonts and images are self-hosted. No analytics.

## Commands

```bash
npm ci
npm run dev
npm run build
npm run typecheck
npm run lint
npm test
npm run lhci
npm run art
npm run cf:build
```

`npm run art` needs Pillow and the ambientCG colour maps named in `docs/ASSETS.md`. `cf:build` does not deploy.

## Safeguards

- Concept label on every page, in the first viewport, linking to the OFF/SHIFT concept page.
- `noindex, nofollow` via meta tag, `X-Robots-Tag`, and `robots.txt` (`Disallow: /`).
- The quote form is demo only: it validates in the browser, says nothing was sent, and has no network request.
- Lighthouse CI skips `is-crawlable` because of the deliberate noindex.

This repository is not deployed from this branch. Do not run `wrangler deploy`.
