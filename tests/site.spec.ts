import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const LABEL = "An OFF/SHIFT concept — fictional demonstration";
const CONCEPT_URL = "https://offshiftstudio.com.au/concepts/bracken-board";
const pages = [
  { path: "/", h1: /built to last outside\./i },
  { path: "/materials", h1: /the specimen wall/i },
  { path: "/projects", h1: /work on the ground/i },
  { path: "/projects/courtyard-deck", h1: /the courtyard deck/i },
  { path: "/projects/entry-path", h1: /the entry path/i },
  { path: "/projects/terraced-garden", h1: /the terraced garden/i },
  { path: "/guarantee", h1: /ten years on the work/i },
  { path: "/takeoff?area=10&depth=100", h1: /the bond board/i },
];

for (const { path, h1 } of pages) {
  test.describe(`page ${path}`, () => {
    test("renders with a heading and landmarks", async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(h1);
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

async function labelInFirstView(page: Page) {
  const link = page.getByRole("link", { name: LABEL }).first();
  await expect(link).toBeVisible();
  const box = await link.boundingBox();
  const vp = page.viewportSize();
  expect(box && vp).toBeTruthy();
  const dock = page.locator(".dock");
  const dockBox = (await dock.isVisible()) ? await dock.boundingBox() : null;
  const limit = dockBox ? dockBox.y : vp!.height;
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(limit + 1);
}

for (const width of [390, 1440]) {
  test(`concept label is in the first viewport at ${width}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
    const page = await context.newPage();
    for (const { path } of pages) {
      await page.goto(path);
      await labelInFirstView(page);
    }
    await context.close();
  });
}

test("404 page renders with label and noindex", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  expect(res?.headers()["x-robots-tag"]).toMatch(/noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/this course is not on the wall/i);
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

test("home opens as a ledger and a running-bond wall", async ({ page }) => {
  await page.goto("/");
  const layouts = await page.locator("[data-layout]").evaluateAll((els) => els.map((e) => e.getAttribute("data-layout")));
  expect(layouts.slice(0, 4)).toEqual(["ledger-bar", "split-hero", "trade-strip", "section-drawing"]);
  await expect(page.locator("[data-nav='ledger-bar']")).toBeVisible();
  await expect(page.locator("[data-unit='running-bond']")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Book a site visit" })).toBeVisible();
});

test("guarantee and takeoff are labelled as demonstration data", async ({ page }) => {
  await page.goto("/guarantee");
  await expect(page.getByText(/not a warranty/i).first()).toBeVisible();
  await expect(page.getByText(/demonstration terms/i).first()).toBeVisible();
  await page.goto("/");
  await expect(page.getByText(/demonstration takeoff/i).first()).toBeVisible();
  await expect(page.getByText(/demonstration visit windows/i).first()).toBeVisible();
});

test.describe("quote form (demo only)", () => {
  test("validates, shows a demo success state and never makes a network request", async ({ page }) => {
    await page.goto("/");
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
    await page.goto("/");
    const action = await page.getByTestId("quote-form").getAttribute("action");
    expect(action).toBe("#quote-demo-sent");
    const named = await page.getByTestId("quote-form").locator("input[name], select[name], textarea[name]").count();
    expect(named).toBe(0);
  });

  test("home picks up the project type from the address", async ({ page }) => {
    await page.goto("/?type=Deck%20or%20screening#visit");
    await expect(page.getByLabel(/project type/i)).toHaveValue("Deck or screening");
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

test("takeoff form works without JavaScript and keeps the demonstration result", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await page.locator("#takeoff-area").fill("10");
  await page.locator("#takeoff-depth").fill("100");
  await page.getByRole("button", { name: "Update takeoff" }).click();
  await expect(page).toHaveURL(/\/takeoff\?/);
  await expect(page).toHaveURL(/area=10/);
  await expect(page).toHaveURL(/depth=100/);
  await expect(page.locator(".bond-result")).toContainText("2.0 t");
  await expect(page.getByText(/demonstration takeoff/i).first()).toBeVisible();
  await context.close();
});

test("a project record links back to the visit with its project type", async ({ page }) => {
  await page.goto("/projects/terraced-garden");
  await expect(page.getByRole("link", { name: "Start a project like this" })).toHaveAttribute(
    "href",
    "/?type=Retaining%20walls%20or%20terraces#visit",
  );
});

test("mobile menu opens onto the materials page", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Materials" }).click();
  await expect(page).toHaveURL(/\/materials$/);
  expect(errors).toEqual([]);
  await context.close();
});

test("section snapshots are available on a narrow screen", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  const base = page.getByRole("radio", { name: "Base" });
  await base.scrollIntoViewIfNeeded();
  await base.check();
  await expect(base).toBeChecked();
  await expect(page.locator(".layer-base")).toBeVisible();
  await expect(page.locator(".layer-paver")).toBeHidden();
  await context.close();
});

test("reduced motion removes the course animation", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("/");
  const name = await page.locator(".wall > *").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(name).toBe("none");
  await context.close();
});
