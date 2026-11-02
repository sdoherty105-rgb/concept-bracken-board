import type { Metadata } from "next";
import ConceptPlate from "@/components/ConceptPlate";
import BondBoard from "@/components/BondBoard";
import { parseTakeoff } from "@/lib/takeoff";

export const metadata: Metadata = {
  title: "Takeoff",
  description: "Demonstration materials takeoff for the fictional Bracken & Board concept. Not a quote.",
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
      <ConceptPlate />
      <BondBoard initialArea={result.area} initialDepth={result.depth} />
    </header>
  );
}
