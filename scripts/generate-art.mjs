// Generates the original SVG scenes in /art. scripts/render-scenes.mjs and
// scripts/develop-photos.py turn them into the photographic plates in /public/photos.
// Run with: node scripts/generate-art.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "art");
mkdirSync(OUT, { recursive: true });

const C = {
  forest: "#24352B",
  stone: "#E9E2D4",
  sage: "#89977A",
  timber: "#886B4E",
  page: "#F8F6F0",
};

const W = 1200;
const H = 800;
const HZ = 450;

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;
const lerp = (a, b, t) => a + (b - a) * t;

function ground(g, y) {
  const t = (y - g.yb) / (g.yf - g.yb);
  return [lerp(g.xlb, g.xlf, t), lerp(g.xrb, g.xrf, t)];
}

function poly(points, attrs = "") {
  return `<polygon points="${points.map((p) => `${r1(p[0])},${r1(p[1])}`).join(" ")}" ${attrs}/>`;
}

function rowYs(g, n, pow) {
  const ys = [];
  for (let i = 0; i <= n; i++) ys.push(g.yb + (g.yf - g.yb) * Math.pow(i / n, pow));
  return ys;
}

function boardField(g, { rows, shades, gap, seed, pow = 1.7 }) {
  const rnd = mulberry32(seed);
  const ys = rowYs(g, rows, pow);
  const byShade = shades.map(() => "");
  let joints = "";
  for (let i = 0; i < rows; i++) {
    const [l0, r0] = ground(g, ys[i]);
    const [l1, r1_] = ground(g, ys[i + 1]);
    const k = Math.floor(rnd() * shades.length);
    byShade[k] += `M${r1(l0)} ${r1(ys[i])}L${r1(r0)} ${r1(ys[i])}L${r1(r1_)} ${r1(ys[i + 1])}L${r1(l1)} ${r1(ys[i + 1])}Z`;
    const f = 0.12 + rnd() * 0.76;
    const xa = lerp(l0, r0, f);
    const xb = lerp(l1, r1_, f);
    joints += `M${r1(xa)} ${r1(ys[i])}L${r1(xb)} ${r1(ys[i + 1])}`;
    if (rnd() > 0.55) {
      const f2 = (f + 0.4 + rnd() * 0.2) % 1;
      joints += `M${r1(lerp(l0, r0, f2))} ${r1(ys[i])}L${r1(lerp(l1, r1_, f2))} ${r1(ys[i + 1])}`;
    }
  }
  let gaps = "";
  for (let i = 0; i <= rows; i++) {
    const [l, r] = ground(g, ys[i]);
    gaps += `M${r1(l)} ${r1(ys[i])}L${r1(r)} ${r1(ys[i])}`;
  }
  return (
    byShade.map((d, i) => (d ? `<path d="${d}" fill="${shades[i]}"/>` : "")).join("") +
    `<path d="${gaps}${joints}" stroke="${gap}" stroke-width="1.6" fill="none"/>`
  );
}

function paverField(g, { rows, cols, shades, gap, seed, pow = 1.55 }) {
  const rnd = mulberry32(seed);
  const ys = rowYs(g, rows, pow);
  const byShade = shades.map(() => "");
  for (let i = 0; i < rows; i++) {
    const [l0, r0] = ground(g, ys[i]);
    const [l1, r1_] = ground(g, ys[i + 1]);
    for (let k = 0; k < cols; k++) {
      const a = k / cols;
      const b = (k + 1) / cols;
      const s = Math.floor(rnd() * shades.length);
      byShade[s] += `M${r1(lerp(l0, r0, a))} ${r1(ys[i])}L${r1(lerp(l0, r0, b))} ${r1(ys[i])}L${r1(lerp(l1, r1_, b))} ${r1(ys[i + 1])}L${r1(lerp(l1, r1_, a))} ${r1(ys[i + 1])}Z`;
    }
  }
  let lines = "";
  for (let i = 0; i <= rows; i++) {
    const [l, r] = ground(g, ys[i]);
    lines += `M${r1(l)} ${r1(ys[i])}L${r1(r)} ${r1(ys[i])}`;
  }
  const [lb, rb] = ground(g, g.yb);
  const [lf, rf] = ground(g, g.yf);
  for (let k = 0; k <= cols; k++) {
    const a = k / cols;
    lines += `M${r1(lerp(lb, rb, a))} ${g.yb}L${r1(lerp(lf, rf, a))} ${g.yf}`;
  }
  return (
    byShade.map((d, i) => (d ? `<path d="${d}" fill="${shades[i]}"/>` : "")).join("") +
    `<path d="${lines}" stroke="${gap}" stroke-width="2.4" fill="none"/>`
  );
}

function grass(x, y, { n = 14, h = 70, spread = 46, color = C.sage, width = 3, seed = 1 }) {
  const rnd = mulberry32(seed + Math.floor(x));
  let d = "";
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const dx = (t - 0.5) * 2 * spread * (0.6 + rnd() * 0.5);
    const hh = h * (0.65 + rnd() * 0.45) * (1 - Math.abs(t - 0.5) * 0.5);
    d += `M${r1(x + (t - 0.5) * 8)} ${r1(y)}Q${r1(x + dx * 0.25)} ${r1(y - hh * 0.7)} ${r1(x + dx)} ${r1(y - hh)}`;
  }
  return `<path d="${d}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" fill="none"/>`;
}

function shrub(x, y, { r = 46, dark = "#5F7054", mid = C.sage, light = "#A6B396", seed = 1 }) {
  const rnd = mulberry32(seed + Math.floor(x * 3));
  let s = `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r * 1.15)}" ry="${r1(r * 0.28)}" fill="#000" opacity=".1"/>`;
  const blobs = [];
  for (let i = 0; i < 6; i++) {
    blobs.push([x + (rnd() - 0.5) * r * 1.5, y - r * 0.55 - rnd() * r * 0.7, r * (0.45 + rnd() * 0.3)]);
  }
  s += blobs.map((b) => `<circle cx="${r1(b[0])}" cy="${r1(b[1])}" r="${r1(b[2])}" fill="${dark}"/>`).join("");
  s += blobs.map((b) => `<circle cx="${r1(b[0] - b[2] * 0.12)}" cy="${r1(b[1] - b[2] * 0.14)}" r="${r1(b[2] * 0.78)}" fill="${mid}"/>`).join("");
  s += blobs.slice(0, 4).map((b) => `<circle cx="${r1(b[0] - b[2] * 0.28)}" cy="${r1(b[1] - b[2] * 0.3)}" r="${r1(b[2] * 0.36)}" fill="${light}"/>`).join("");
  return s;
}

function pot(x, y, w, h, color = C.forest) {
  return (
    `<ellipse cx="${x}" cy="${y + 2}" rx="${w * 0.62}" ry="${w * 0.14}" fill="#000" opacity=".12"/>` +
    `<path d="M${x - w / 2} ${y - h}H${x + w / 2}L${x + w * 0.4} ${y}H${x - w * 0.4}Z" fill="${color}"/>` +
    `<rect x="${x - w * 0.54}" y="${y - h - 8}" width="${w * 1.08}" height="10" rx="2" fill="${color}"/>`
  );
}

function tree(x, y, { trunk = C.timber, h = 220, canopy = 90, seed = 3, dark = "#5F7054", mid = C.sage, light = "#A6B396" }) {
  const rnd = mulberry32(seed);
  let s = `<ellipse cx="${x}" cy="${y}" rx="${canopy * 0.7}" ry="${canopy * 0.12}" fill="#000" opacity=".1"/>`;
  s += `<path d="M${x - 5} ${y}Q${x - 6} ${y - h * 0.5} ${x - 2} ${y - h}L${x + 3} ${y - h}Q${x + 6} ${y - h * 0.5} ${x + 5} ${y}Z" fill="${trunk}"/>`;
  s += `<path d="M${x} ${y - h * 0.55}Q${x - 30} ${y - h * 0.75} ${x - 55} ${y - h * 0.9}M${x} ${y - h * 0.62}Q${x + 28} ${y - h * 0.8} ${x + 52} ${y - h * 0.95}" stroke="${trunk}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const blobs = [];
  for (let i = 0; i < 9; i++) {
    blobs.push([x + (rnd() - 0.5) * canopy * 1.8, y - h - 10 + (rnd() - 0.5) * canopy * 0.9, canopy * (0.32 + rnd() * 0.22)]);
  }
  s += blobs.map((b) => `<circle cx="${r1(b[0])}" cy="${r1(b[1])}" r="${r1(b[2])}" fill="${dark}"/>`).join("");
  s += blobs.map((b) => `<circle cx="${r1(b[0] - 4)}" cy="${r1(b[1] - 5)}" r="${r1(b[2] * 0.8)}" fill="${mid}"/>`).join("");
  s += blobs.slice(0, 5).map((b) => `<circle cx="${r1(b[0] - 10)}" cy="${r1(b[1] - 12)}" r="${r1(b[2] * 0.38)}" fill="${light}"/>`).join("");
  return s;
}

function rearWall() {
  let s = `<rect width="${W}" height="${HZ}" fill="#E3DACA"/>`;
  s += `<rect width="${W}" height="36" fill="#CDC3AE"/><rect y="36" width="${W}" height="26" fill="#000" opacity=".05"/>`;
  s += `<rect y="${HZ - 22}" width="${W}" height="22" fill="#C2B8A2"/>`;
  s += `<rect x="1128" y="36" width="16" height="${HZ - 36}" fill="#BEB49E"/>`;
  s += `<rect x="130" y="130" width="320" height="210" fill="${C.forest}"/>`;
  s += `<rect x="142" y="142" width="296" height="186" fill="#3A5043"/>`;
  s += `<polygon points="142,142 250,142 142,250" fill="#fff" opacity=".1"/><polygon points="290,328 438,180 438,328" fill="#fff" opacity=".07"/>`;
  s += `<rect x="288" y="142" width="6" height="186" fill="${C.forest}"/>`;
  s += `<rect x="124" y="340" width="332" height="10" fill="#B9AF99"/>`;
  s += `<rect x="540" y="90" width="540" height="${HZ - 112}" fill="${C.forest}"/>`;
  [552, 684, 816, 948].forEach((x, i) => {
    s += `<rect x="${x}" y="102" width="120" height="${HZ - 136}" fill="${i % 2 ? "#33493C" : "#3A5043"}"/>`;
    s += `<polygon points="${x},102 ${x + 70},102 ${x},${102 + 150}" fill="#fff" opacity=".08"/>`;
  });
  return s;
}

function frontWall() {
  let s = `<rect width="${W}" height="${HZ}" fill="#E6DDCB"/>`;
  s += `<rect width="${W}" height="36" fill="#CDC3AE"/><rect y="36" width="${W}" height="26" fill="#000" opacity=".05"/>`;
  s += `<rect y="${HZ - 40}" width="${W}" height="40" fill="#B9AE98"/>`;
  s += `<rect x="470" y="36" width="380" height="${HZ - 76}" fill="${C.timber}"/>`;
  for (let x = 470; x < 850; x += 19) s += `<rect x="${x}" y="36" width="2.5" height="${HZ - 76}" fill="#000" opacity=".16"/>`;
  s += `<rect x="540" y="116" width="150" height="${HZ - 156}" fill="${C.forest}"/>`;
  s += `<rect x="552" y="128" width="126" height="${HZ - 180}" fill="#2D4236"/>`;
  s += `<rect x="662" y="270" width="6" height="64" rx="3" fill="${C.stone}"/>`;
  s += `<rect x="722" y="116" width="60" height="${HZ - 156}" fill="${C.forest}"/><rect x="730" y="124" width="44" height="${HZ - 172}" fill="#3A5043"/>`;
  s += `<polygon points="730,124 774,124 730,200" fill="#fff" opacity=".1"/>`;
  s += `<rect x="130" y="150" width="240" height="160" fill="${C.forest}"/><rect x="142" y="162" width="216" height="136" fill="#3A5043"/>`;
  s += `<polygon points="142,162 240,162 142,250" fill="#fff" opacity=".1"/><rect x="247" y="162" width="6" height="136" fill="${C.forest}"/>`;
  s += `<rect x="124" y="310" width="252" height="10" fill="#B3A892"/>`;
  s += `<rect x="900" y="170" width="14" height="40" rx="3" fill="${C.forest}"/>`;
  return s;
}

function fenceWall() {
  let s = `<rect width="${W}" height="${HZ}" fill="#EEE9DD"/>`;
  s += `<circle cx="930" cy="150" r="70" fill="${C.stone}"/>`;
  const rnd = mulberry32(11);
  const can = [];
  for (let i = 0; i < 16; i++) can.push([60 + i * 76 + rnd() * 30, 190 + rnd() * 50, 70 + rnd() * 40]);
  s += can.map((b) => `<circle cx="${r1(b[0])}" cy="${r1(b[1])}" r="${r1(b[2])}" fill="#6A7A5E"/>`).join("");
  s += can.map((b) => `<circle cx="${r1(b[0] - 6)}" cy="${r1(b[1] - 8)}" r="${r1(b[2] * 0.72)}" fill="#77876B"/>`).join("");
  s += `<rect y="250" width="${W}" height="${HZ - 250}" fill="#8C9585"/>`;
  for (let x = 0; x < W; x += 20) s += `<rect x="${x}" y="250" width="1.8" height="${HZ - 250}" fill="#000" opacity=".12"/>`;
  s += `<rect y="250" width="${W}" height="10" fill="#6F7969"/><rect y="${HZ - 8}" width="${W}" height="8" fill="#6F7969"/>`;
  for (let x = 0; x <= W; x += 300) s += `<rect x="${x}" y="244" width="14" height="${HZ - 244}" fill="#6F7969"/>`;
  return s;
}

const GROUND = { yb: HZ, yf: H, xlb: 0, xrb: W, xlf: 0, xrf: W };

function svg(w, h, title, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"><title>${title}</title>${inner}</svg>\n`;
}

function weeds(points, seed) {
  const rnd = mulberry32(seed);
  let d = "";
  points.forEach(([x, y]) => {
    for (let i = 0; i < 5; i++) {
      const dx = (rnd() - 0.5) * 22;
      d += `M${r1(x)} ${r1(y)}q${r1(dx * 0.3)} -10 ${r1(dx)} ${r1(-14 - rnd() * 14)}`;
    }
  });
  return `<path d="${d}" stroke="#7E8B4F" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
}

function cracks(list) {
  return `<path d="${list.map((pts) => "M" + pts.map((p) => p.join(" ")).join("L")).join("")}" stroke="#8D887B" stroke-width="2.2" fill="none" stroke-linejoin="round"/>`;
}

function stains(list) {
  return list.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#8F8A7C" opacity=".22"/>`).join("");
}

// ---------- Scene 1: courtyard deck ----------
function deckBefore() {
  const slab = { yb: HZ, yf: H, xlb: 150, xrb: 1060, xlf: 20, xrf: 1190 };
  let s = rearWall();
  s += `<rect y="${HZ}" width="${W}" height="${H - HZ}" fill="#ABA874"/>`;
  const rnd = mulberry32(5);
  for (let i = 0; i < 40; i++) s += `<ellipse cx="${r1(rnd() * W)}" cy="${r1(HZ + 10 + rnd() * 340)}" rx="${r1(30 + rnd() * 50)}" ry="${r1(6 + rnd() * 10)}" fill="${i % 3 ? "#9B9763" : "#B8B688"}" opacity=".55"/>`;
  s += poly([[slab.xlb, HZ], [slab.xrb, HZ], [slab.xrf, H], [slab.xlf, H]], 'fill="#BDB8AC"');
  s += poly([[slab.xlb + 120, HZ], [slab.xrb - 60, HZ], [slab.xrf - 160, H], [slab.xlf + 200, H]], 'fill="#C7C2B6" opacity=".55"');
  s += stains([[420, 520, 80, 14], [820, 600, 120, 20], [300, 700, 90, 18], [980, 500, 50, 9]]);
  s += cracks([
    [[360, HZ], [372, 490], [352, 540], [380, 600], [350, 680], [366, H]],
    [[760, HZ], [748, 500], [790, 560], [770, 640], [830, 720], [820, H]],
    [[372, 490], [450, 506], [520, 500]],
    [[790, 560], [880, 580], [960, 570]],
    [[350, 680], [260, 700], [180, 720]],
  ]);
  s += weeds([[366, 492], [352, 540], [378, 600], [772, 638], [790, 560], [830, 720], [452, 506]], 4);
  const fx = 238;
  s += `<rect x="${fx}" y="250" width="8" height="${HZ + 60 - 250}" fill="#7A736A"/>`;
  s += `<path d="M${fx + 4} 260L${fx - 120} 330M${fx + 4} 260L${fx + 128} 330M${fx + 4} 260L${fx + 4} 200" stroke="#8A8378" stroke-width="5" stroke-linecap="round"/>`;
  s += `<path d="M${fx - 120} 330L${fx + 128} 330L${fx + 4} 232Z" fill="none" stroke="#A39B8E" stroke-width="2"/>`;
  s += `<ellipse cx="${fx + 4}" cy="${HZ + 62}" rx="40" ry="8" fill="#000" opacity=".14"/>`;
  s += `<rect x="1040" y="360" width="84" height="116" rx="8" fill="#5E6B5C"/><rect x="1034" y="352" width="96" height="16" rx="5" fill="#4F5B4E"/><ellipse cx="1082" cy="482" rx="56" ry="8" fill="#000" opacity=".14"/>`;
  s += `<rect x="610" y="530" width="64" height="26" rx="4" fill="#B78B5A"/><rect x="612" y="520" width="60" height="16" rx="3" fill="#A87D4E"/>`;
  s += grass(110, 760, { n: 10, h: 38, color: "#8C8A56", seed: 2 }) + grass(1130, 740, { n: 10, h: 38, color: "#8C8A56", seed: 6 });
  return svg(W, H, "Courtyard before: cracked concrete slab, patchy lawn and weeds", s);
}

function deckAfter() {
  const deck = { yb: HZ, yf: H, xlb: 90, xrb: 1110, xlf: -40, xrf: 1240 };
  let s = rearWall();
  s += `<rect y="${HZ}" width="${W}" height="${H - HZ}" fill="#7E8D6F"/>`;
  s += boardField(deck, { rows: 30, shades: ["#8B6D4E", "#7D6144", "#957652", "#836849"], gap: "#4E3C29", seed: 21 });
  s += `<rect x="${deck.xlb - 8}" y="${HZ - 6}" width="${deck.xrb - deck.xlb + 16}" height="6" fill="#4E3C29"/>`;
  s += `<rect x="640" y="${HZ - 8}" width="440" height="6" fill="none"/>`;
  s += `<rect x="690" y="372" width="400" height="22" fill="#9A7B58"/><rect x="690" y="394" width="400" height="76" fill="#6E5539"/>`;
  for (let x = 700; x < 1080; x += 22) s += `<rect x="${x}" y="394" width="2" height="76" fill="#000" opacity=".16"/>`;
  s += `<rect x="702" y="338" width="150" height="38" rx="9" fill="${C.sage}"/><rect x="872" y="338" width="150" height="38" rx="9" fill="#A6B396"/>`;
  s += `<rect x="1050" y="350" width="30" height="26" rx="4" fill="${C.timber}" opacity=".0"/>`;
  s += `<ellipse cx="880" cy="472" rx="210" ry="9" fill="#000" opacity=".18"/>`;
  s += `<rect x="150" y="388" width="300" height="86" fill="${C.forest}"/><rect x="150" y="388" width="300" height="10" fill="#33493C"/>`;
  s += shrub(200, 392, { r: 38, seed: 3 }) + shrub(300, 394, { r: 50, seed: 4 }) + shrub(400, 392, { r: 38, seed: 5 });
  s += grass(250, 392, { n: 16, h: 84, color: "#A6B396", seed: 7, width: 2.6 }) + grass(350, 392, { n: 16, h: 96, color: C.sage, seed: 8, width: 2.6 });
  s += `<ellipse cx="300" cy="476" rx="170" ry="9" fill="#000" opacity=".18"/>`;
  s += pot(560, 560, 76, 92, C.forest) + grass(560, 466, { n: 18, h: 120, spread: 44, color: C.sage, seed: 9, width: 3 });
  s += pot(1110, 690, 120, 140, "#2F4437") + shrub(1110, 560, { r: 56, seed: 12 });
  s += `<rect x="880" y="600" width="170" height="30" rx="4" fill="${C.stone}"/><rect x="880" y="600" width="170" height="8" fill="#fff" opacity=".5"/>`;
  s += `<rect x="900" y="630" width="8" height="40" fill="#C2BAA6"/><rect x="1022" y="630" width="8" height="40" fill="#C2BAA6"/>`;
  s += grass(40, 770, { n: 12, h: 90, spread: 60, color: C.sage, seed: 15 });
  return svg(W, H, "Courtyard after: spotted gum timber deck, built-in bench and planter", s);
}

// ---------- Scene 2: entry paving ----------
function pathBefore() {
  let s = frontWall();
  s += `<rect y="${HZ}" width="${W}" height="${H - HZ}" fill="#C6B391"/>`;
  const rnd = mulberry32(9);
  for (let i = 0; i < 50; i++) s += `<ellipse cx="${r1(rnd() * W)}" cy="${r1(HZ + 8 + rnd() * 340)}" rx="${r1(20 + rnd() * 50)}" ry="${r1(4 + rnd() * 9)}" fill="${i % 3 ? "#B49F7B" : "#D4C4A4"}" opacity=".6"/>`;
  const pathG = { yb: HZ, yf: H, xlb: 490, xrb: 700, xlf: 280, xrf: 900 };
  s += poly([[pathG.xlb, HZ], [pathG.xrb, HZ], [pathG.xrf, H], [pathG.xlf, H]], 'fill="#A7A296"');
  s += poly([[pathG.xlb + 30, HZ], [pathG.xrb - 10, HZ], [pathG.xrf - 70, H], [pathG.xlf + 40, H]], 'fill="#B4AFA3" opacity=".6"');
  s += cracks([
    [[510, HZ], [530, 520], [500, 580], [520, 650], [470, 740], [450, H]],
    [[690, HZ], [660, 500], [690, 570], [640, 640], [700, 720], [680, H]],
    [[505, 580], [600, 600], [660, 590]],
    [[470, 740], [560, 760], [640, 750]],
  ]);
  s += stains([[600, 520, 50, 8], [560, 700, 90, 16]]);
  s += weeds([[530, 520], [500, 580], [520, 650], [660, 500], [690, 570], [640, 640], [600, 600]], 8);
  s += `<polygon points="150,640 330,640 350,700 130,700" fill="#9C5E43"/><path d="M150 660H340M150 680H345M205 640V700M265 640V700" stroke="#7E4A34" stroke-width="2"/>`;
  s += `<ellipse cx="240" cy="704" rx="130" ry="9" fill="#000" opacity=".14"/>`;
  s += `<path d="M1000 620l60 -14l30 18l-48 14z" fill="#A7A296"/><path d="M1030 650l50 -10l24 16l-42 12z" fill="#B4AFA3"/>`;
  s += grass(150, 520, { n: 9, h: 44, color: "#8C8A56", seed: 3 }) + grass(1020, 520, { n: 9, h: 44, color: "#8C8A56", seed: 4 }) + grass(1080, 740, { n: 9, h: 40, color: "#8C8A56", seed: 5 });
  s += `<polygon points="470,${HZ} 730,${HZ} 730,${HZ - 14} 470,${HZ - 14}" fill="#A59A83"/>`;
  return svg(W, H, "Entry before: bare soil, cracked path and loose bricks", s);
}

function pathAfter() {
  const pathG = { yb: HZ, yf: H, xlb: 470, xrb: 730, xlf: 230, xrf: 970 };
  let s = frontWall();
  s += `<rect y="${HZ}" width="${W}" height="${H - HZ}" fill="#463829"/>`;
  s += paverField(pathG, { rows: 8, cols: 3, shades: ["#DDD5C3", "#D2C9B5", "#E3DCCB", "#D7CEBB"], gap: "#BFB6A1", seed: 33 });
  s += `<rect x="460" y="${HZ - 20}" width="280" height="20" fill="#CFC6B2"/><rect x="460" y="${HZ - 20}" width="280" height="5" fill="#E6DFCF"/>`;
  s += `<polygon points="150,${HZ} 450,${HZ} 190,${H} 0,${H} 0,640" fill="none"/>`;
  s += `<path d="M0 ${H}L${pathG.xlf - 4} ${H}L${pathG.xlb - 4} ${HZ}L0 ${HZ}Z" fill="#3E3125"/>`;
  s += `<path d="M${W} ${H}L${pathG.xrf + 4} ${H}L${pathG.xrb + 4} ${HZ}L${W} ${HZ}Z" fill="#3E3125"/>`;
  const wallRows = (x0, x1, y, rows, h, seed, tones) => {
    const rnd = mulberry32(seed);
    let o = "";
    for (let i = 0; i < rows; i++) {
      let x = x0 - (i % 2 ? 50 : 0);
      while (x < x1) {
        const bw = 90 + rnd() * 60;
        o += `<rect x="${r1(x)}" y="${y - (i + 1) * h}" width="${r1(bw - 3)}" height="${h - 3}" rx="2" fill="${tones[Math.floor(rnd() * tones.length)]}"/>`;
        x += bw;
      }
    }
    return o;
  };
  s += `<g>${wallRows(900, 1250, 640, 3, 44, 2, ["#DCD3BF", "#D1C7B1", "#E4DCCB"])}</g>`;
  s += `<rect x="900" y="502" width="300" height="12" fill="#EDE6D6"/>`;
  s += `<ellipse cx="1030" cy="648" rx="200" ry="10" fill="#000" opacity=".2"/>`;
  s += shrub(900, 500, { r: 50, seed: 3 }) + shrub(1100, 498, { r: 56, seed: 5 });
  s += grass(1000, 500, { n: 14, h: 90, color: "#A6B396", seed: 9, width: 2.6 });
  s += shrub(120, HZ + 40, { r: 56, seed: 7 }) + shrub(330, HZ + 24, { r: 40, seed: 8 });
  [[90, 600], [240, 560], [380, 505]].forEach(([x, y], i) => (s += grass(x, y, { n: 18, h: 96 - i * 14, spread: 58, color: i % 2 ? C.sage : "#A6B396", seed: 12 + i, width: 2.8 })));
  [[60, 720], [210, 690]].forEach(([x, y], i) => (s += shrub(x, y, { r: 44 + i * 6, seed: 20 + i })));
  [[345, 600], [715, 600]].forEach(([x, y]) => {
    s += `<rect x="${x}" y="${y - 70}" width="9" height="70" fill="${C.forest}"/><rect x="${x - 6}" y="${y - 82}" width="21" height="14" rx="3" fill="#F3E3B0"/>`;
  });
  s += `<rect x="735" y="${HZ - 26}" width="0" height="0"/>`;
  s += pot(790, HZ + 30, 70, 84, C.forest) + grass(790, HZ - 56, { n: 12, h: 64, color: C.sage, seed: 4 });
  return svg(W, H, "Entry after: large-format stone pavers, planted beds and a limestone wall", s);
}

// ---------- Scene 3: terraced garden room ----------
function terraceBefore() {
  let s = fenceWall();
  s += `<rect y="${HZ}" width="${W}" height="${H - HZ}" fill="#B9A682"/>`;
  const rnd = mulberry32(14);
  for (let i = 0; i < 55; i++) s += `<ellipse cx="${r1(rnd() * W)}" cy="${r1(HZ + 8 + rnd() * 340)}" rx="${r1(24 + rnd() * 60)}" ry="${r1(5 + rnd() * 10)}" fill="${i % 3 === 0 ? "#A3A56C" : i % 3 === 1 ? "#A69371" : "#CDBB96"}" opacity=".6"/>`;
  s += `<path d="M0 ${HZ}Q300 ${HZ + 40} 600 ${HZ + 20}T1200 ${HZ + 40}V${HZ}H0Z" fill="#9F8E6C" opacity=".6"/>`;
  s += weeds([[200, 500], [240, 520], [520, 560], [900, 520], [1000, 580], [700, 640], [320, 690], [820, 720], [120, 620]], 17);
  s += `<g>` + [0, 1, 2, 3].map((i) => `<rect x="${760 + i * 6}" y="${560 - i * 24}" width="260" height="20" rx="3" fill="${i % 2 ? "#6E5A42" : "#7C6649"}" transform="rotate(${-3 + i} ${760} ${560})"/>`).join("") + `</g>`;
  s += `<ellipse cx="890" cy="586" rx="150" ry="9" fill="#000" opacity=".14"/>`;
  s += `<rect x="150" y="600" width="90" height="120" rx="6" fill="#8D5A3F"/><rect x="150" y="620" width="90" height="8" fill="#6F4430"/><rect x="150" y="670" width="90" height="8" fill="#6F4430"/><ellipse cx="195" cy="722" rx="62" ry="8" fill="#000" opacity=".16"/>`;
  s += `<path d="M440 640l120 -18l16 36l-110 28z" fill="#9E7A52"/><ellipse cx="520" cy="690" rx="90" ry="8" fill="#000" opacity=".12"/>`;
  s += grass(60, 520, { n: 9, h: 44, color: "#8C8A56", seed: 3 }) + grass(1150, 540, { n: 9, h: 44, color: "#8C8A56", seed: 4 });
  return svg(W, H, "Garden before: bare sloping yard, weeds and stacked old sleepers", s);
}

function terraceAfter() {
  const lawn = { yb: HZ + 90, yf: H, xlb: 0, xrb: W, xlf: 0, xrf: W };
  let s = fenceWall();
  s += `<rect y="${HZ}" width="${W}" height="${H - HZ}" fill="#7E8D6F"/>`;
  for (let i = 0; i < 22; i++) s += `<rect x="0" y="${HZ + 90 + i * 17}" width="${W}" height="8" fill="${i % 2 ? "#74845F" : "#869575"}" opacity=".5"/>`;
  s += `<rect y="${HZ}" width="${W}" height="96" fill="#4B3B2B"/>`;
  const rnd = mulberry32(31);
  let blocks = "";
  const tones = ["#E3DCCB", "#D8CFBB", "#EAE3D3", "#D3C9B3"];
  for (let r = 0; r < 3; r++) {
    let x = -(r % 2 ? 60 : 0);
    while (x < W) {
      const bw = 110 + rnd() * 70;
      blocks += `<rect x="${r1(x)}" y="${HZ + 96 - 4 + r * 0}" width="0" height="0"/>`;
      x += bw;
    }
  }
  let wallBlocks = "";
  for (let r = 0; r < 2; r++) {
    let x = -(r % 2 ? 70 : 0);
    while (x < W) {
      const bw = 120 + rnd() * 70;
      wallBlocks += `<rect x="${r1(x)}" y="${HZ + 52 + r * 24}" width="${r1(bw - 3)}" height="22" rx="2" fill="${tones[Math.floor(rnd() * tones.length)]}"/>`;
      x += bw;
    }
  }
  s += `<rect y="${HZ + 44}" width="${W}" height="60" fill="#D8CFBB"/>` + wallBlocks;
  s += `<rect y="${HZ + 44}" width="${W}" height="8" fill="#EEE8D9"/>`;
  s += `<rect y="${HZ + 104}" width="${W}" height="10" fill="#000" opacity=".12"/>`;
  s += `<rect y="${HZ}" width="${W}" height="46" fill="#4B3B2B"/>`;
  for (let x = 40; x < W; x += 110) s += shrub(x + (x % 3) * 12, HZ + 46, { r: 30 + (x % 5) * 3, seed: x });
  [160, 420, 560, 880, 1060].forEach((x, i) => (s += grass(x, HZ + 46, { n: 16, h: 100 + (i % 3) * 20, color: i % 2 ? C.sage : "#A6B396", seed: i + 40, width: 2.6 })));
  s += tree(660, HZ + 50, { h: 190, canopy: 80, seed: 6 });
  const stepG = { yb: HZ + 114, yf: H, xlb: 440, xrb: 760, xlf: 330, xrf: 870 };
  s += poly([[stepG.xlb, stepG.yb], [stepG.xrb, stepG.yb], [stepG.xrf, H], [stepG.xlf, H]], 'fill="#CFC6B2" opacity="0"');
  const stones = [[600, 590, 150, 24], [580, 640, 190, 30], [620, 700, 230, 36], [590, 770, 280, 44]];
  stones.forEach(([cx, cy, w, h]) => (s += `<ellipse cx="${cx}" cy="${cy + 4}" rx="${w / 2}" ry="${h / 2 + 2}" fill="#000" opacity=".15"/><rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="5" fill="#E3DCCB"/><rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="5" rx="3" fill="#fff" opacity=".5"/>`));
  const px = 960;
  const pergolaTop = 190;
  s += `<rect x="${px - 10}" y="${pergolaTop + 30}" width="16" height="${HZ + 220 - pergolaTop - 30}" fill="#7C6144"/><rect x="1130" y="${pergolaTop + 30}" width="16" height="${HZ + 220 - pergolaTop - 30}" fill="#7C6144"/>`;
  s += `<ellipse cx="${px - 2}" cy="${HZ + 222}" rx="26" ry="6" fill="#000" opacity=".16"/><ellipse cx="1138" cy="${HZ + 222}" rx="26" ry="6" fill="#000" opacity=".16"/>`;
  s += `<rect x="${px - 40}" y="${pergolaTop + 20}" width="220" height="16" fill="${C.timber}"/><rect x="${px - 40}" y="${pergolaTop + 36}" width="220" height="5" fill="#000" opacity=".15"/>`;
  for (let x = px - 30; x < 1170; x += 28) s += `<rect x="${x}" y="${pergolaTop + 6}" width="12" height="16" fill="#9A7B58"/>`;
  s += `<path d="M${px + 4} ${HZ + 190}Q${px - 20} 320 ${px + 20} 250T${px + 90} ${pergolaTop + 40}" stroke="#5F7054" stroke-width="3" fill="none"/>`;
  s += `<rect x="${px - 20}" y="${HZ + 216}" width="190" height="6" fill="none"/>`;
  s += `<path d="M${px - 30} ${HZ + 224}H1190L1220 ${HZ + 270}H${px - 70}Z" fill="#B6A68A"/>`;
  s += `<rect x="1020" y="${HZ + 150}" width="86" height="12" rx="3" fill="${C.timber}"/><rect x="1030" y="${HZ + 162}" width="8" height="58" fill="#5E4A35"/><rect x="1088" y="${HZ + 162}" width="8" height="58" fill="#5E4A35"/>`;
  s += `<rect x="1000" y="${HZ + 110}" width="130" height="40" rx="9" fill="${C.sage}"/>`;
  s += `<path d="M${px + 16} ${pergolaTop + 40}Q${px + 40} ${pergolaTop + 90} ${px + 30} ${pergolaTop + 140}M1100 ${pergolaTop + 40}Q1080 ${pergolaTop + 100} 1100 ${pergolaTop + 160}" stroke="#6C7B5E" stroke-width="2" fill="none"/>`;
  s += shrub(60, 720, { r: 60, seed: 41 }) + grass(130, 760, { n: 14, h: 100, spread: 60, color: C.sage, seed: 42 });
  s += pot(250, 640, 80, 90, C.forest) + grass(250, 550, { n: 14, h: 84, color: "#A6B396", seed: 44 });
  return svg(W, H, "Garden after: limestone terrace wall, planted beds, stepping stones and a timber pergola", s);
}

const files = {
  "deck-before.svg": deckBefore(),
  "deck-after.svg": deckAfter(),
  "entry-before.svg": pathBefore(),
  "entry-after.svg": pathAfter(),
  "garden-before.svg": terraceBefore(),
  "garden-after.svg": terraceAfter(),
};

for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
  console.log(name, content.length);
}
