# Bracken & Board — OFF/SHIFT concept

A fictional concept website for **Bracken & Board**, a landscape builder that lays decks, paving, retaining and planting in courses. Built by OFF/SHIFT Studio as a portfolio piece. Direction: robust, a running-bond block wall.

> An OFF/SHIFT concept — fictional demonstration. Bracken & Board is not a real business. Nothing here was built for, sold to or delivered to a client. Every page is `noindex`.

Concept page: <https://offshiftstudio.com.au/concepts/bracken-board>

## Pages

- `/` Split hero, four trades in running bond, one project with the compare slider, the section drawing, a materials course, the guarantee in large type, and a two-step site-visit request beside the takeoff
- `/materials` Specimen wall
- `/projects` Project index, each with an engraved plate
- `/projects/[slug]` Project record and before/after plate
- `/guarantee` Demonstration ten-year workmanship terms
- `/takeoff` Materials takeoff (works without JavaScript)
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

- A concept plate on every page, in the first viewport: the label linking back to the OFF/SHIFT concept page, a one-line fictional-business disclosure, and "Want a website like this?" linking to `https://offshiftstudio.com.au/?concept=bracken-board#contact`. The footer repeats all three.
- `noindex, nofollow` via meta tag, `X-Robots-Tag`, and `robots.txt` (`Disallow: /`).
- The site-visit form is demo only: it validates in the browser, shows a short local pending state, says nothing was sent, and makes no network request (a Playwright test fails on any fetch, XHR, navigation, beacon or socket). Only the visit-window radios carry a `name`, so even a no-JavaScript submit carries no personal data.
- Lighthouse CI skips `is-crawlable` because of the deliberate noindex.

## Deployment

- Live URL: <https://bracken-board.offshiftstudio.com.au> (Cloudflare Workers, worker `concept-bracken-board`).
- As checked on 10 November 2026, the live URL serves `main` at `7895e87` (the landscape-journal version, "Built for life outside."). It does **not** serve this redesign yet.
- Nothing in this repository deploys: CI (`.github/workflows/ci.yml`) only lints, builds, tests, bundles with OpenNext and runs Lighthouse. Production appears to follow `main` through a Cloudflare Git integration configured outside the repo (not verifiable from here). Pushes to `redesign/2026-11` since 26 October have not changed the live site, which is consistent with only `main` being the production branch.
- Deploying this version means merging PR #3 to `main` (owner decision). Do not run `wrangler deploy` from a branch.
