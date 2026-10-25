// Prints a Markdown table of Lighthouse scores from .lighthouseci/lhr-*.json
import { readdirSync, readFileSync } from "node:fs";

const dir = ".lighthouseci";
const rows = readdirSync(dir)
  .filter((f) => /^lhr-.*\.json$/.test(f))
  .map((f) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8")));

const pct = (r, k) => Math.round(r.categories[k].score * 100);
console.log("| URL | Perf | A11y | Best practices | SEO | LCP (ms) | CLS | TBT (ms) |");
console.log("| --- | --- | --- | --- | --- | --- | --- | --- |");
for (const r of rows) {
  const a = r.audits;
  console.log(
    `| ${new URL(r.finalUrl).pathname} | ${pct(r, "performance")} | ${pct(r, "accessibility")} | ${pct(r, "best-practices")} | ${pct(r, "seo")} | ${Math.round(a["largest-contentful-paint"].numericValue)} | ${a["cumulative-layout-shift"].numericValue.toFixed(3)} | ${Math.round(a["total-blocking-time"].numericValue)} |`,
  );
}
