import Link from "next/link";
import CompareSlider from "@/components/CompareSlider";
import QuoteForm from "@/components/QuoteForm";
import { materials, projects, services, steps } from "@/lib/content";

export default function Home() {
  const featured = projects[0];

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Landscaping and outdoor construction</p>
            <h1 id="hero-title" className="hero__title">
              Make room for outside.
            </h1>
            <p className="lede">
              Decks, paving and gardens, designed and built as one calm, considered space. We take the yard you walk past and turn it into the
              room you live in.
            </p>
            <div className="hero__actions">
              <Link href="/#quote" className="btn">
                Request a quote
              </Link>
              <Link href="/#transformations" className="btn btn--ghost">
                See a transformation
              </Link>
            </div>
            <ul className="hero__tags" aria-label="What we build">
              <li>Decks</li>
              <li>Paving</li>
              <li>Retaining</li>
              <li>Gardens</li>
            </ul>
          </div>
          <figure className="hero__art">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/art/hero.svg"
              alt="Illustration of a timber deck outdoor room with a long dining table, a slender tree, a limestone planter wall and a sliding glass door."
              width={1000}
              height={1200}
              decoding="async"
            />
            <figcaption>Illustration. A fictional Bracken &amp; Board outdoor room.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section" id="services" aria-labelledby="services-title">
        <div className="container split">
          <div className="split__head">
            <p className="eyebrow">Services</p>
            <h2 id="services-title" className="h2">
              One team from first sketch to last plant.
            </h2>
            <p className="lede">
              Outdoor spaces work when the deck, the paving and the planting are designed together. So we design and build all three, in house.
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

      <section className="section section--stone" id="transformations" aria-labelledby="transform-title">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Transformations</p>
            <h2 id="transform-title" className="h2">
              From forgotten to lived in.
            </h2>
            <p className="lede">
              Drag the handle to compare the same space before and after. These are illustrations of fictional projects.
            </p>
          </div>
          <div className="feature">
            <CompareSlider before={featured.before} after={featured.after} title={featured.title} />
            <div className="feature__meta">
              <p className="eyebrow">{featured.kicker}</p>
              <h3 className="h3 h3--lg">{featured.title}</h3>
              <p>{featured.brief}</p>
              <h4 className="meta-h">What we did</h4>
              <ul className="ticks">
                {featured.scope.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p>
                <Link href="/projects" className="link-arrow">
                  See all three transformations
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="process" aria-labelledby="process-title">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Process</p>
            <h2 id="process-title" className="h2">
              Four steps, no surprises.
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
              Honest materials that age well.
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
