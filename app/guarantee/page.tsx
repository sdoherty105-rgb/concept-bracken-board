import type { Metadata } from "next";
import Link from "next/link";
import ConceptPlate from "@/components/ConceptPlate";
import { guarantee } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guarantee",
  description: "Demonstration ten-year workmanship terms for the fictional Bracken & Board concept. Not a warranty.",
};

const spans = ["g-1-7", "g-8-5", "g-1-5", "g-6-7", "g-1-12"];

export default function GuaranteePage() {
  return (
    <>
      <header className="title-course title-course--jarrah">
        <p className="label">Guarantee</p>
        <h1>
          Ten years
          <br />
          on the work.
        </h1>
        <ConceptPlate />
      </header>
      <section className="course" aria-labelledby="terms-title" data-layout="terms">
        <div className="course__intro">
          <h2 id="terms-title">Demonstration terms.</h2>
          <p>
            Bracken &amp; Board is not a real business. These clauses are invented for this OFF/SHIFT Studio concept. They are not a warranty, not
            an offer and not a contract. No work is covered because no work was sold.
          </p>
        </div>
        <div className="wall">
          {guarantee.map((clause, i) => (
            <article key={clause.title} className={`${spans[i]} block-pad ${i === 0 ? "block--jarrah" : ""}`}>
              <p className="label">{clause.term}</p>
              <h3>{clause.title}</h3>
              <p>{clause.body}</p>
            </article>
          ))}
        </div>
        <p className="course__intro">
          <Link href="/#visit" prefetch={false} className="text-link">
            Book a demonstration site visit
          </Link>
        </p>
      </section>
    </>
  );
}
