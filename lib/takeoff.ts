/** Demonstration takeoff rates for the bond board. Not a quote. */

export const RATES = {
  baseDensity: 2.0,
  sandDepthM: 0.03,
  sandDensity: 1.6,
  paversPerM2: 50,
  paversPerPallet: 400,
} as const;

export type Takeoff = {
  area: number;
  depth: number;
  baseTonnes: number;
  sandTonnes: number;
  pavers: number;
  pallets: number;
};

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function parseTakeoff(areaRaw: string | undefined, depthRaw: string | undefined) {
  const area = clamp(areaRaw === undefined || areaRaw === "" ? 24 : Number(areaRaw), 1, 500);
  const depth = clamp(depthRaw === undefined || depthRaw === "" ? 100 : Number(depthRaw), 50, 300);
  return takeoff(area, depth);
}

export function takeoff(areaM2: number, depthMm: number): Takeoff {
  const area = clamp(areaM2, 1, 500);
  const depth = clamp(depthMm, 50, 300);
  const baseTonnes = area * (depth / 1000) * RATES.baseDensity;
  const sandTonnes = area * RATES.sandDepthM * RATES.sandDensity;
  const pavers = Math.round(area * RATES.paversPerM2);
  const pallets = Math.max(1, Math.ceil(pavers / RATES.paversPerPallet));
  return { area, depth, baseTonnes, sandTonnes, pavers, pallets };
}
