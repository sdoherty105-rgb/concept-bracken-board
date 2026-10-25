import { expect, test } from "@playwright/test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib"];
const EXT = /\.(tsx|ts|css)$/;

const FORBIDDEN: { label: string; re: RegExp }[] = [
  { label: "arrow or symbol glyph", re: /[\u2190-\u21FF\u27A1\u25B2-\u25C6\u25AA\u2022\u2043\u00B7\u00BB\u00AB\u203A\u2605\u2606\u2713\u2714\u2717\u2718]/ },
  { label: "css arrow escape", re: /\\2192|\\00bb|\\203a/i },
  { label: "ascii arrow glyph", re: /\s->\s|['"]->['"]|>\s*->/ },
];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === "art") continue;
      walk(path, out);
    } else if (EXT.test(name)) out.push(path);
  }
  return out;
}

function isAllowedLine(line: string): boolean {
  if (line.includes("Left and Right keys")) return true;
  return false;
}

test("app source has no decorative arrow, bullet or chevron glyphs", () => {
  const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));
  const hits: string[] = [];

  for (const file of files) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      if (isAllowedLine(line)) return;
      for (const { label, re } of FORBIDDEN) {
        if (re.test(line)) {
          hits.push(`${file.replace(ROOT + "/", "")}:${index + 1} (${label})`);
        }
      }
    });
  }

  expect(hits).toEqual([]);
});
