import Photo from "@/components/Photo";
import { layers, planPlate } from "@/lib/content";

const snaps = [
  { id: "c-base", label: "Base" },
  { id: "c-sand", label: "Sand bed" },
  { id: "c-paver", label: "Pavers" },
  { id: "c-all", label: "Full section" },
];

export default function SectionDrawing() {
  return (
    <section className="course" id="under" data-layout="section-drawing" aria-labelledby="under-title">
      <div className="course__intro">
        <p className="label">What is under it</p>
        <h2 id="under-title">A path is four layers.</h2>
        <p>Leave one out and the surface moves. The thicknesses are demonstration figures for this concept.</p>
      </div>
      <div className="wall">
        <div className="draw g-1-7 block-pad">
          <fieldset className="draw__controls">
            <legend className="label">Section snapshots</legend>
            {snaps.map((s) => (
              <label key={s.id} className="snap">
                <input type="radio" name="course" id={s.id} defaultChecked={s.id === "c-all"} />
                {s.label}
              </label>
            ))}
          </fieldset>
          <div className="xsect" aria-hidden="true">
            <div className="layer layer-edge" style={{ ["--i" as string]: 3 }}>
              Edge
            </div>
            <div className="xsect__stack">
              <div className="layer layer-paver" style={{ ["--i" as string]: 2 }}>
                Pavers 40 mm
              </div>
              <div className="layer layer-sand" style={{ ["--i" as string]: 1 }}>
                Sand 30 mm
              </div>
              <div className="layer layer-base" style={{ ["--i" as string]: 0 }}>
                Base 150 mm
              </div>
            </div>
            <div className="layer layer-edge" style={{ ["--i" as string]: 3 }}>
              Edge
            </div>
          </div>
          <dl className="spec">
            {layers.map((layer) => (
              <div key={layer.id}>
                <dt>
                  {layer.name} <span className="nums">{layer.mm}</span>
                </dt>
                <dd>{layer.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="g-8-5 plate-fig">
          <Photo plate={planPlate} sizes="(min-width: 768px) 40vw, 100vw" />
          <figcaption>
            <span className="label">Plan</span>
            Top-down set-out. Paver field, gravel margin, limestone edge, jarrah inset. Demonstration drawing.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
