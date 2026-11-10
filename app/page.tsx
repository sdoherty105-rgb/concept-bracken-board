import Link from "next/link";
import BondBoard from "@/components/BondBoard";
import CompareSlider from "@/components/CompareSlider";
import ConceptPlate from "@/components/ConceptPlate";
import Photo from "@/components/Photo";
import ProjectPlate from "@/components/ProjectPlate";
import SiteVisitForm from "@/components/SiteVisitForm";
import SectionDrawing from "@/components/SectionDrawing";
import { heroPlate, materials, projects, trades } from "@/lib/content";

export const metadata = {
  description:
    "An OFF/SHIFT concept — fictional demonstration. Bracken & Board lays limestone, jarrah and clay in courses.",
};

export default function Home() {
  const featured = projects[0];

  return (
    <>
      <section className="hero" data-layout="split-hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="label hero__where">Landscaping, Perth</p>
          <h1 id="hero-title">
            Built
            <br />
            to
            <br />
            last
            <br />
            outside.
          </h1>
          <div className="hero__rule">
            <ConceptPlate />
          </div>
        </div>
        <figure className="hero__photo">
          <Photo
            plate={heroPlate}
            sizes="(min-width: 1101px) 37vw, (min-width: 768px) 43vw, calc(100vw - 80px)"
            priority
            className="hero__img"
          />
          <svg className="survey" viewBox="0 0 2000 1333" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="none" stroke="#F4F0E6" strokeWidth="4">
              <line x1="180" y1="1080" x2="1750" y2="1080" />
              <line x1="180" y1="1056" x2="180" y2="1104" />
              <line x1="1750" y1="1056" x2="1750" y2="1104" />
              <line x1="220" y1="360" x2="220" y2="860" />
              <line x1="196" y1="360" x2="244" y2="360" />
              <line x1="196" y1="860" x2="244" y2="860" />
            </g>
            <g fill="none" stroke="#241B14" strokeWidth="1.5">
              <line x1="180" y1="1080" x2="1750" y2="1080" />
              <line x1="220" y1="360" x2="220" y2="860" />
            </g>
          </svg>
          <figcaption className="hero__cap">
            Courtyard deck, dappled light. Demonstration dimensions: board run 4.2 m, opening 2.1 m.
          </figcaption>
        </figure>
        <nav className="hero__strip" data-layout="trade-strip" aria-label="Trades">
          {trades.map((t) => (
            <a key={t.id} href={`#${t.id}`}>
              <span className="label">{t.n}</span>
              {t.title}
            </a>
          ))}
        </nav>
      </section>

      <section className="course" id="trades" data-layout="running-bond" aria-labelledby="trades-title">
        <div className="course__intro">
          <p className="label">The trades</p>
          <h2 id="trades-title">Laid in courses.</h2>
          <p>Four kinds of work. Each one is a different block, because the jobs are not the same size.</p>
        </div>
        <div className="wall">
          <article id="decks" className="g-1-5 block-pad">
            <p className="label">{trades[0].n}</p>
            <h3>{trades[0].title}</h3>
            <p>{trades[0].body}</p>
          </article>
          <ul className="g-6-7 block-pad fact-list">
            {trades[0].facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="g-1-2 block-pad block--moss">
            <span className="label">Bond</span>
            Half a block over.
          </p>
          <article id="paving" className="g-3-5 block-pad">
            <p className="label">{trades[1].n}</p>
            <h3>{trades[1].title}</h3>
            <p>{trades[1].body}</p>
          </article>
          <ul className="g-8-5 block-pad fact-list">
            {trades[1].facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <article id="retaining" className="g-1-8 block-pad block--raised">
            <p className="label">{trades[2].n}</p>
            <h3>{trades[2].title}</h3>
            <p>{trades[2].body}</p>
            <ul className="fact-list fact-list--row">
              {trades[2].facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </article>
          <p className="g-9-4 block-pad block--jarrah">
            <span className="label">Levels</span>
            A wall is only as good as the drain behind it.
          </p>
          <article id="planting" className="g-1-6 block-pad">
            <p className="label">{trades[3].n}</p>
            <h3>{trades[3].title}</h3>
            <p>{trades[3].body}</p>
          </article>
          <ul className="g-7-6 block-pad fact-list">
            {trades[3].facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="course" id={featured.id} data-layout="project-case" aria-labelledby="case-title">
        <div className="course__intro">
          <p className="label">One project</p>
          <h2 id="case-title">{featured.title}</h2>
          <p>{featured.brief}</p>
        </div>
        <div className="wall">
          <div className="g-1-8">
            <CompareSlider
              before={featured.before}
              after={featured.after}
              title={featured.title}
              sizes="(min-width: 768px) 66vw, 100vw"
            />
          </div>
          <div className="g-9-4">
            <ProjectPlate project={featured} />
          </div>
          <div className="g-1-12 block-pad case-foot">
            <p>{featured.notes}</p>
            <Link href={`/projects/${featured.id}`} prefetch={false} className="text-link">
              Open the project record
            </Link>
          </div>
        </div>
      </section>

      <SectionDrawing />

      <section className="course" id="materials" data-layout="materials-wall" aria-labelledby="materials-title">
        <div className="course__intro">
          <p className="label">Materials</p>
          <h2 id="materials-title">The specimen wall.</h2>
          <p>A short course here. The full wall, with demonstration specifications, is on the materials page.</p>
        </div>
        <div className="wall">
          <Link href="/materials#limestone" prefetch={false} className="specimen g-1-5">
            <Photo plate={materials[0].plate} sizes="(min-width: 768px) 40vw, 100vw" alt="" />
            <span className="specimen__name">{materials[0].name}</span>
          </Link>
          <Link href="/materials#jarrah" prefetch={false} className="specimen specimen--mid g-6-3">
            <Photo plate={materials[1].plate} sizes="(min-width: 768px) 24vw, 100vw" alt="" />
            <span className="specimen__name">{materials[1].name}</span>
          </Link>
          <Link href="/materials#gravel" prefetch={false} className="specimen specimen--short g-9-4">
            <Photo plate={materials[2].plate} sizes="(min-width: 768px) 30vw, 100vw" alt="" />
            <span className="specimen__name">{materials[2].name}</span>
          </Link>
          <Link href="/materials#brick" prefetch={false} className="specimen g-1-7">
            <Photo plate={materials[3].plate} sizes="(min-width: 768px) 50vw, 100vw" alt="" />
            <span className="specimen__name">{materials[3].name}</span>
          </Link>
          <div className="g-8-5 block-pad">
            <p className="label">Full wall</p>
            <p>Sizes and notes for each material sit on the specimen wall.</p>
            <Link href="/materials" prefetch={false} className="text-link">
              Open materials
            </Link>
          </div>
        </div>
      </section>

      <section className="guarantee-slab" data-layout="guarantee-slab" aria-labelledby="guarantee-title">
        <p className="label">Demonstration terms</p>
        <h2 id="guarantee-title">
          Ten
          <br />
          years.
        </h2>
        <p>On the workmanship. These are invented terms for a fictional business. Not a warranty.</p>
        <Link href="/guarantee" prefetch={false} className="slab-link">
          Read the terms
        </Link>
      </section>

      <section className="course" id="visit" data-layout="bond-board" aria-labelledby="visit-title">
        <div className="course__intro">
          <p className="label">Site visit</p>
          <h2 id="visit-title">Tell us the ground.</h2>
          <p>Pick a window, tell us where the ground is, and a builder walks it with you. The takeoff beside it gives a rough idea of the materials. Both are demonstrations: nothing is booked and nothing is sent.</p>
        </div>
        <div className="wall visit-wall">
          <div className="g-8-5 block-pad visit-form" id="visit-request">
            <p className="label">Book a site visit</p>
            <h3>Two steps. About a minute.</h3>
            <SiteVisitForm fromQuery />
          </div>
          <div className="g-1-7 block-pad">
            <BondBoard initialArea={24} initialDepth={100} />
          </div>
        </div>
      </section>
    </>
  );
}
