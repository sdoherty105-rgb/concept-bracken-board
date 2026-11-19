import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { takeoff } from "../lib/takeoff";

test("the stylesheet has square edges and no gradients or shadows", () => {
  const css = readFileSync("app/globals.css", "utf8");
  expect(css).not.toMatch(/linear-gradient|radial-gradient|conic-gradient/);
  expect(css).not.toMatch(/box-shadow/);
  const radii = css.match(/border-radius:\s*[^;]+/g) ?? [];
  expect(radii.length).toBeGreaterThan(0);
  for (const rule of radii) expect(rule).toMatch(/border-radius:\s*0\b/);
});

test("takeoff uses the published demonstration rates", () => {
  const result = takeoff(10, 100);
  expect(result.baseTonnes).toBeCloseTo(2);
  expect(result.sandTonnes).toBeCloseTo(0.48);
  expect(result.pavers).toBe(500);
  expect(result.pallets).toBe(2);
  expect(takeoff(1, 50).area).toBe(1);
  expect(takeoff(9000, 9000).area).toBe(500);
  expect(takeoff(9000, 9000).depth).toBe(300);
});
