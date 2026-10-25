import Link from "next/link";
import { ArtIllustration } from "@/components/art";
import CompareSlider from "@/components/CompareSlider";
import QuoteForm from "@/components/QuoteForm";
import { materials, projects, services, steps } from "@/lib/content";

export default function Home() {
  const featured = projects[0];

  return (
    <>
      <section className="landscape-front" id="transformations" aria-labelledby="hero-title">
        <div className="container">
          <div className="landscape-overline"><span>Landscaping &amp; outdoor construction</span><span>Western Australia</span></div>
          <div className="landscape-heading"><h1 id="hero-title">Built for<br />life outside.</h1><p>Decks, gardens and outdoor rooms.<br />Designed and built together.</p></div>
          <div className="landscape-study"><div className="study-caption"><span>Design study / 01</span><span>{featured.kicker}</span></div><CompareSlider before={featured.before} after={featured.after} title={featured.title} /></div>
          <div className="landscape-caption"><h2>{featured.title}</h2><p>A timber deck, built-in seating and a garden at the kitchen door.</p><Link href="/projects#courtyard-deck">Explore the study</Link></div>
          <p className="study-note">Illustrated concept. Use the handle to compare the existing space and proposed design.</p>
        </div>
      </section>

      <section className="section" id="services" aria-labelledby="services-title">
        <div className="container split">
          <div className="split__head">
            <p className="eyebrow">Services</p>
            <h2 id="services-title" className="h2">
              The whole outdoor space.
            </h2>
            <p className="lede">
              A deck needs to meet the garden. Paving needs to handle the rain. We design the space as a whole, then build each part to work together.
            </p>
          </div>
          <ol className="services">
            {services.map((s) => (
              <li key={s.n} className="services__item">
                <span className="services__n" aria-hidden="true">{s.n}</span>
                <div>
                  <h3 className="h3">{s.title}</h3>
                  <p>{s.body}</p>
                  <ul className="chips" aria-label={`${s.title} materials and features`}>
                    {s.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--stone landscape-journal" id="projects" aria-labelledby="journal-title"><div className="container">
        <div className="journal-heading"><p className="eyebrow">The project journal</p><h2 id="journal-title" className="h2">Three spaces.<br />Three ways to use them.</h2><Link href="/projects">View all design studies</Link></div>
        <div className="journal-projects">{projects.map((project, i) => <article key={project.id} className="journal-project"><Link href={`/projects#${project.id}`} className="journal-image" aria-label={`Explore ${project.title}`}><ArtIllustration id={project.after.art} alt={project.after.alt} /></Link><div className="journal-meta"><span>0{i + 1}</span><h3>{project.title}</h3><p>{project.kicker}</p></div></article>)}</div>
      </div></section>

      <section className="section" id="process" aria-labelledby="process-title">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Process</p>
            <h2 id="process-title" className="h2">
              From site visit to handover.
            </h2>
          </div>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.n} className="steps__item">
                <span className="steps__n" aria-hidden="true">{s.n}</span>
                <h3 className="h3">{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--forest on-dark" id="materials" aria-labelledby="materials-title">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Materials</p>
            <h2 id="materials-title" className="h2">
              Timber, stone &amp; planting.
            </h2>
            <p className="lede">
              We choose a small palette of natural materials and use them with restraint. Each is picked for how it looks in ten years, not only
              on the day we hand over.
            </p>
          </div>
          <ul className="materials">
            {materials.map((m) => (
              <li key={m.name} className="materials__item">
                <span className={`swatch swatch--${m.swatch}`} aria-hidden="true" />
                <h3 className="h3">{m.name}</h3>
                <p className="materials__use">{m.use}</p>
                <p>{m.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="quote" aria-labelledby="quote-title">
        <div className="container quote">
          <div className="quote__intro">
            <p className="eyebrow">Request a quote</p>
            <h2 id="quote-title" className="h2">
              Tell us about your outdoor project.
            </h2>
            <p className="lede">
              Share the type of project and a rough budget range. Even a loose idea helps us start the conversation in the right place.
            </p>
            <ul className="ticks">
              <li>No obligation, and no pressure to commit</li>
              <li>A site visit comes before any price</li>
              <li>Itemised quotes in plain language</li>
            </ul>
          </div>
          <div className="quote__form">
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}

