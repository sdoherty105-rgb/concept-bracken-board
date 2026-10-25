import { expect, test } from "@playwright/test";

test("illustrations are inline SVG, not external img assets", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('main img[src*=".svg"]')).toHaveCount(0);
  await expect(page.locator("main svg.compare__art, main svg.hero__art__svg").first()).toBeVisible();

  await page.goto("/projects");
  await expect(page.locator('main img[src*=".svg"]')).toHaveCount(0);
  await expect(page.locator("main .compare__pane svg").first()).toBeVisible();
});
