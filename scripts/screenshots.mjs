// Usage: PW_CHROME_PATH=... node scripts/screenshots.mjs [baseUrl]
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3100";
const executablePath = process.env.PW_CHROME_PATH || undefined;
const shots = [
  { name: "home", path: "/" },
  { name: "projects", path: "/projects" },
];
const widths = [
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1440, h: 900 },
];

const browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] });
for (const { w, h } of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  for (const { name, path } of shots) {
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.querySelectorAll("img").forEach((i) => (i.loading = "eager")));
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `docs/screens/${name}-${w}.png`, fullPage: true });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
