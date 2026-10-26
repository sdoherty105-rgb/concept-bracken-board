// Renders each SVG scene in /art to a high-resolution PNG for scripts/develop-photos.py.
// Usage: node scripts/render-scenes.mjs <out-dir>
import { chromium } from "@playwright/test";
import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "art");
const out = process.argv[2];
if (!out) throw new Error("Usage: node scripts/render-scenes.mjs <out-dir>");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.PW_CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 2400, height: 1600 } });
for (const file of readdirSync(SRC).filter((f) => f.endsWith(".svg"))) {
  const svg = readFileSync(join(SRC, file), "utf8");
  await page.setContent(`<style>html,body{margin:0}svg{width:100vw;height:100vh;display:block}</style>${svg}`);
  await page.screenshot({ path: join(out, file.replace(/\.svg$/, ".png")) });
  console.log(file);
}
await browser.close();
