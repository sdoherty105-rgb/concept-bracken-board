import type { Metadata } from "next";
import Link from "next/link";
import CompareSlider from "@/components/CompareSlider";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Transformations",
  description: "Three before and after outdoor transformations from Bracken & Board, a fictional landscape builder. Illustrated, not real projects.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <nav aria-label="Breadcrumb" className="crumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Transformations</li>
            </ol>
          </nav>
          <p className="eyebrow">Transformations</p>
          <h1 className="h1">Before, and after.</h1>
          <p className="lede">
            Three fictional outdoor projects, shown as illustrations. In each one, drag the handle to move between the existing space and the
            finished build.
          </p>
        </div>
      </section>

      {projects.map((p, i) => (
        <section key={p.id} className={`section project${i % 2 ? " section--stone" : ""}`} id={p.id} aria-labelledby={`${p.id}-title`}>
          <div className="container">
            <div className="project__head">
              <p className="eyebrow">{`0${i + 1} · ${p.kicker}`}</p>
              <h2 id={`${p.id}-title`} className="h2">{p.title}</h2>
            </div>
            <div className="feature">
              <CompareSlider before={p.before} after={p.after} title={p.title} priority={i === 0} />
              <div className="feature__meta">
                <p>{p.brief}</p>
                <h3 className="meta-h">What we did</h3>
                <ul className="ticks">
                  {p.scope.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <h3 className="meta-h">Materials</h3>
                <ul className="chips" aria-label="Materials">
                  {p.materials.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="cta-band on-dark" aria-labelledby="cta-title">
        <div className="container cta-band__inner">
          <h2 id="cta-title" className="h2">Have a space in mind?</h2>
          <Link href="/#quote" className="btn btn--light">
            Request a quote
          </Link>
        </div>
      </section>
    </>
  );
}
