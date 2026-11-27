import type { Metadata } from "next";
import BondBoard from "@/components/BondBoard";
import { parseTakeoff } from "@/lib/takeoff";

export const metadata: Metadata = {
  title: "Takeoff",
  description: "An OFF/SHIFT concept: fictional demonstration. Materials takeoff for a fictional builder. Not a quote.",
};

type Search = { area?: string; depth?: string };

export default async function TakeoffPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const result = parseTakeoff(sp.area, sp.depth);
  return (
    <header className="title-course">
      <p className="label">Demonstration takeoff</p>
      <h1>The bond board.</h1>
      <p>These densities and pallet counts are invented. Nothing here is a quote.</p>
      <BondBoard initialArea={result.area} initialDepth={result.depth} />
    </header>
  );
}
