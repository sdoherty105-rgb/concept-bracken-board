import CompareSlider from "@/components/CompareSlider";
import Photo from "@/components/Photo";
import PlateRail from "@/components/PlateRail";
import StartDrawer from "@/components/StartDrawer";
import StartLink from "@/components/StartLink";
import { projects } from "@/lib/content";

export default function Archive() {
  return (
    <>
      <div className="archive-title">
        <h1>
          A working archive of gardens, decks and paving, <span>designed and built in Perth.</span>
        </h1>
        <p>
          {projects.length} projects, {projects[0].completed.split(" ")[1]} to {projects[projects.length - 1].completed.split(" ")[1]}
        </p>
      </div>

      <PlateRail />

      {projects.map((p, i) => (
        <article key={p.id} id={p.id} className={`project project--${i % 2 ? "right" : "left"}`} aria-labelledby={`${p.id}-title`}>
          <figure className="lead">
            <Photo photo={p.after.photo} alt={p.after.alt} sizes="100vw" priority={i === 0} className="lead__img" />
            <figcaption className="lead__caption">
              <span>{p.no}</span>
              <span>{p.title}</span>
              <span>
                {p.site}, {p.completed}
              </span>
            </figcaption>
          </figure>

          <div className="sheet">
            <header className="sheet__head">
              <p className="sheet__no" aria-hidden="true">
                {p.no}
              </p>
              <h2 id={`${p.id}-title`}>{p.title}</h2>
              <p className="sheet__brief">{p.brief}</p>
            </header>

            <dl className="sheet__facts">
              <div>
                <dt>Site</dt>
                <dd>{p.site}</dd>
              </div>
              <div>
                <dt>Completed</dt>
                <dd>{p.completed}</dd>
              </div>
              <div>
                <dt>Build</dt>
                <dd>{p.duration}</dd>
              </div>
              <div>
                <dt>Work</dt>
                <dd>{p.kind}</dd>
              </div>
            </dl>

            <div className="sheet__compare">
              <CompareSlider before={p.before} after={p.after} title={p.title} sizes="(min-width: 1000px) 60vw, 100vw" />
            </div>

            <div className="sheet__notes">
              <p>{p.notes}</p>
              <h3>What we did</h3>
              <ul>
                {p.scope.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <h3>Materials</h3>
              <p>{p.materials.join(", ")}</p>
            </div>

            {p.details.map((d, j) => (
              <figure key={d.photo} className={`detail detail--${j + 1}`}>
                <Photo photo={d.photo} alt={d.alt} detail sizes="(min-width: 1000px) 25vw, 50vw" />
                <figcaption>{d.caption}</figcaption>
              </figure>
            ))}

            <p className="sheet__start">
              <StartLink type={p.quoteType} className="start-link">
                Start a project like this
              </StartLink>
            </p>
          </div>
        </article>
      ))}

      <StartDrawer />
    </>
  );
}
