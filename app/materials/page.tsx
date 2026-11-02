import type { Metadata } from "next";
import ConceptPlate from "@/components/ConceptPlate";
import Photo from "@/components/Photo";
import { materials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Materials",
  description: "An OFF/SHIFT concept — fictional demonstration. Limestone, jarrah, crushed gravel and clay pavers, with demonstration specifications.",
};

const rest = materials.slice(1);
const spans = ["g-1-7", "g-8-5", "g-1-8"];

export default function MaterialsPage() {
  const limestone = materials[0];
  return (
    <>
      <link rel="preload" as="image" href="/photos/swatch-limestone-800.avif" fetchPriority="high" />
      <header className="lead-specimen">
        <div className="lead-specimen__copy">
          <p className="label">Materials</p>
          <h1>The specimen wall.</h1>
          <ConceptPlate />
        </div>
        <figure>
          <Photo plate={limestone.plate} sizes="(min-width: 768px) 58vw, 100vw" priority />
          <figcaption className="visually-hidden">{limestone.name}. {limestone.spec}. Demonstration specification.</figcaption>
        </figure>
      </header>
      <section className="course" aria-labelledby="spec-title" data-layout="specimen-wall">
        <div className="course__intro">
          <h2 id="spec-title">{limestone.name}.</h2>
          <p>{limestone.note} {limestone.spec}. Demonstration specification, not a supply list and not a price.</p>
        </div>
        <div className="wall">
          {rest.map((m, i) => (
            <article key={m.id} id={m.id} className={`specimen-block ${spans[i]}`}>
              <Photo plate={m.plate} sizes="(min-width: 768px) 40vw, 100vw" />
              <div className="specimen-block__copy">
                <h3>{m.name}</h3>
                <p className="label">{m.use}</p>
                <p className="nums">{m.spec}</p>
                <p>{m.note}</p>
              </div>
            </article>
          ))}
          <article id="limestone" className="g-9-4 block-pad">
            <p className="label">{limestone.use}</p>
            <h3>{limestone.name}</h3>
            <p className="nums">{limestone.spec}</p>
            <p>{limestone.note}</p>
          </article>
          <article id="planting" className="g-1-7 block-pad block--moss">
            <p className="label">Planting</p>
            <h3>Banksia, lomandra, kangaroo paw.</h3>
            <p>The green is a material too. We plant what will still look deliberate in February, and we mulch it 75 mm deep.</p>
          </article>
          <article className="g-8-5 block-pad">
            <p className="label">Steel</p>
            <h3>Where timber should not touch soil.</h3>
            <p>Deck frames and edge restraint in powder-coated steel. The colour is ironbark. The planting does the talking.</p>
          </article>
        </div>
      </section>
    </>
  );
}
