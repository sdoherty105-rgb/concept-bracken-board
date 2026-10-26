import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell Bracken & Board, a fictional landscape builder, about your outdoor space. A demo form that sends nothing.",
};

export default function Start() {
  return (
    <div className="start">
      <div className="start__intro">
        <h1>Start a project</h1>
        <p>Tell us about the space. A rough idea is enough to begin with. A site visit always comes before a price.</p>
      </div>
      <QuoteForm fromQuery />
    </div>
  );
}
