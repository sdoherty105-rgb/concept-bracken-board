import { expect, test } from "@playwright/test";

test("plates are local WebP images with descriptions, and only the first is loaded eagerly", async ({ page }) => {
  await page.goto("/");
  const images = page.locator("main img");
  const srcs = await images.evaluateAll((els) => els.map((e) => (e as HTMLImageElement).getAttribute("src") ?? ""));
  expect(srcs.length).toBeGreaterThan(10);
  srcs.forEach((s) => expect(s).toMatch(/^\/photos\/[a-z-]+-\d+\.webp$/));

  const content = page.locator("main .lead img, main .compare img, main .detail img");
  const alts = await content.evaluateAll((els) => els.map((e) => e.getAttribute("alt") ?? ""));
  alts.forEach((a) => expect(a.length).toBeGreaterThan(20));

  const eager = await images.evaluateAll((els) => els.filter((e) => (e as HTMLImageElement).loading === "eager").length);
  expect(eager).toBe(1);
});

test("every plate referenced by the page exists", async ({ page, request }) => {
  await page.goto("/");
  const sets = await page.locator("img").evaluateAll((els) => els.map((e) => e.getAttribute("srcset") ?? ""));
  const urls = new Set(sets.flatMap((s) => s.split(",").map((part) => part.trim().split(" ")[0])).filter(Boolean));
  for (const url of urls) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
  }
});
