import { expect, test } from "@playwright/test";

test("plates are local AVIF images with descriptions, and only the first is loaded eagerly", async ({ page }) => {
  await page.goto("/");
  const images = page.locator("main img");
  const srcs = await images.evaluateAll((els) => els.map((e) => (e as HTMLImageElement).getAttribute("src") ?? ""));
  expect(srcs.length).toBeGreaterThan(4);
  srcs.forEach((s) => expect(s).toMatch(/^\/photos\/[a-z0-9-]+-\d+\.avif$/));

  const alts = await images.evaluateAll((els) => els.map((e) => e.getAttribute("alt") ?? "").filter((a) => a.length > 0));
  expect(alts.length).toBeGreaterThan(2);
  alts.forEach((a) => expect(a.length).toBeGreaterThan(20));

  const eager = await images.evaluateAll((els) => els.filter((e) => (e as HTMLImageElement).loading === "eager").length);
  expect(eager).toBe(1);
});

test("every plate referenced by the home page exists", async ({ page, request }) => {
  await page.goto("/");
  const sets = await page.locator("img").evaluateAll((els) => els.map((e) => e.getAttribute("srcset") ?? ""));
  const urls = new Set(sets.flatMap((s) => s.split(",").map((part) => part.trim().split(" ")[0])).filter(Boolean));
  expect(urls.size).toBeGreaterThan(4);
  for (const url of urls) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
    expect(res.headers()["content-type"] ?? "").toMatch(/avif|octet-stream/);
  }
});
