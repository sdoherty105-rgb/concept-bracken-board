import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const LABEL = "An OFF/SHIFT concept — fictional demonstration";
const CONCEPT_URL = "https://offshiftstudio.com.au/concepts/bracken-board";
const pages = [
  { path: "/", h1: /a working archive of gardens, decks and paving/i },
  { path: "/projects", h1: /index of projects/i },
  { path: "/start", h1: /start a project/i },
];

for (const { path, h1 } of pages) {
  test.describe(`page ${path}`, () => {
    test("renders with a heading and landmarks", async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });

    test("shows the concept label linking to OFF/SHIFT", async ({ page }) => {
      await page.goto(path);
      const link = page.getByRole("link", { name: LABEL }).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", CONCEPT_URL);
    });

    test("is noindex in meta tag and header", async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.headers()["x-robots-tag"]).toMatch(/noindex/);
      const robots = (await page.locator('meta[name="robots"]').evaluateAll((els) => els.map((e) => e.getAttribute("content") ?? ""))).join(",");
      expect(robots).toMatch(/noindex/);
      expect(robots).toMatch(/nofollow/);
    });

    test("only requests same-origin resources", async ({ page, baseURL }) => {
      const external: string[] = [];
      page.on("request", (r) => {
        const u = r.url();
        if (!u.startsWith(baseURL!) && !u.startsWith("data:")) external.push(u);
      });
      await page.goto(path, { waitUntil: "networkidle" });
      expect(external).toEqual([]);
    });

    test("has no WCAG 2.2 AA violations detectable by axe", async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  });
}

test("404 page renders with label and noindex", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  expect(res?.headers()["x-robots-tag"]).toMatch(/noindex/);
  await expect(page.getByRole("link", { name: LABEL }).first()).toHaveAttribute("href", CONCEPT_URL);
  const contents = await page.locator('meta[name="robots"]').evaluateAll((els) => els.map((e) => e.getAttribute("content") ?? ""));
  expect(contents.length).toBeGreaterThan(0);
  contents.forEach((c) => expect(c).toMatch(/noindex/));
  expect(contents.some((c) => /nofollow/.test(c))).toBe(true);
});

test("robots.txt disallows everything", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toMatch(/User-agent: \*/);
  expect(body).toMatch(/Disallow: \/\s*$/m);
});

test.describe("quote form (demo only)", () => {
  test("validates, shows a demo success state and never makes a network request", async ({ page }) => {
    await page.goto("/start");
    await page.waitForLoadState("networkidle");

    const requests: string[] = [];
    page.on("request", (r) => requests.push(`${r.method()} ${r.url()}`));
    page.on("websocket", (w) => requests.push(`WS ${w.url()}`));

    const form = page.getByTestId("quote-form");
    await form.scrollIntoViewIfNeeded();

    await form.getByRole("button", { name: /send demo quote request/i }).click();
    await expect(page.getByRole("alert").filter({ hasText: /please fix/i })).toBeVisible();
    await expect(page.getByText("Enter your name.").first()).toBeVisible();
    await expect(page.getByText("Choose a budget range.", { exact: false }).first()).toBeVisible();

    await page.getByLabel(/full name/i).fill("Alex Sample");
    await page.getByLabel(/^email/i).fill("not-an-email");
    await form.getByRole("button", { name: /send demo quote request/i }).click();
    await expect(page.getByText(/email address like/i).first()).toBeVisible();

    await page.getByLabel(/^email/i).fill("alex@example.com");
    await page.getByLabel(/project type/i).selectOption("Deck or screening");
    await page.getByLabel(/budget range/i).selectOption("$30,000 – $60,000");
    await form.getByRole("button", { name: /send demo quote request/i }).click();

    const success = page.getByTestId("quote-success");
    await expect(success).toBeVisible();
    await expect(success).toContainText(/demo/i);
    await expect(success).toContainText(/nothing was sent/i);
    await expect(success).toBeFocused();

    await page.waitForTimeout(750);
    expect(requests).toEqual([]);
  });

  test("form markup has no network action and no named fields", async ({ page }) => {
    await page.goto("/start");
    const action = await page.getByTestId("quote-form").getAttribute("action");
    expect(action).toBe("#quote-demo-sent");
    const named = await page.getByTestId("quote-form").locator("input[name], select[name], textarea[name]").count();
    expect(named).toBe(0);
  });
});

test.describe("before/after slider", () => {
  test("is keyboard operable and exposes slider semantics", async ({ page }) => {
    await page.goto("/");
    const slider = page.getByRole("slider").first();
    await slider.scrollIntoViewIfNeeded();
    await expect(slider).toHaveValue("50");
    await slider.focus();
    await expect(slider).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(slider).toHaveValue("51");
    await page.keyboard.press("End");
    await expect(slider).toHaveValue("100");
    await expect(slider).toHaveAttribute("aria-valuetext", "100% before, 0% after");
    await page.keyboard.press("Home");
    await expect(slider).toHaveValue("0");
    const clip = await page.locator(".compare__pane--after").first().evaluate((el) => getComputedStyle(el).clipPath);
    expect(clip).toMatch(/inset/);
  });

  test("responds to pointer drag on the image", async ({ page }) => {
    await page.goto("/");
    const stage = page.locator(".compare__stage").first();
    await stage.scrollIntoViewIfNeeded();
    const box = (await stage.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.5, { steps: 6 });
    await page.mouse.up();
    const value = Number(await page.getByRole("slider").first().inputValue());
    expect(value).toBeGreaterThan(65);
  });

  test("falls back to stacked before and after images without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    const compare = page.locator(".compare").first();
    await compare.scrollIntoViewIfNeeded();
    const scenes = compare.locator(".compare__pane img");
    await expect(scenes).toHaveCount(2);
    const [a, b] = await Promise.all([scenes.nth(0).boundingBox(), scenes.nth(1).boundingBox()]);
    expect(a && b).toBeTruthy();
    expect(b!.y).toBeGreaterThan(a!.y + a!.height - 1);
    await expect(compare.getByText("Before", { exact: true })).toBeVisible();
    await expect(compare.getByText("After", { exact: true })).toBeVisible();
    await expect(compare.locator("input[type=range]")).toBeHidden();
    await context.close();
  });
});

test.describe("quote drawer", () => {
  test("opens from a project on its project type, and closes with Escape", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#entry-path").getByRole("link", { name: "Start a project like this" }).click();
    const drawer = page.getByRole("dialog", { name: "Start a project" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByLabel(/project type/i)).toHaveValue("Paving or entry");
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
  });

  test("falls back to the /start page without JavaScript, keeping the project type in the link", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    const link = page.locator("#terraced-garden").getByRole("link", { name: "Start a project like this" });
    await expect(link).toHaveAttribute("href", "/start?type=Retaining%20walls%20or%20terraces");
    await link.click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/start a project/i);
    await context.close();
  });

  test("/start picks up the project type from the link", async ({ page }) => {
    await page.goto("/start?type=Deck%20or%20screening");
    await expect(page.getByLabel(/project type/i)).toHaveValue("Deck or screening");
  });
});

test("index overlay lists the projects and closes after a pick", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator(".index summary").click();
  const panel = page.locator(".index__panel");
  await expect(panel).toBeVisible();
  await panel.getByRole("link", { name: /the entry path/i }).click();
  await expect(page).toHaveURL(/#entry-path/);
  await expect(panel).toBeHidden();
  expect(errors).toEqual([]);
  await context.close();
});

test("the plate rail marks the project in view on wide screens", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const rail = page.getByRole("navigation", { name: "Projects" });
  await expect(rail).toBeVisible();
  await page.locator("#terraced-garden .sheet").scrollIntoViewIfNeeded();
  await expect(rail.locator('a[aria-current="location"]')).toHaveAttribute("href", "#terraced-garden");
  await context.close();
});
