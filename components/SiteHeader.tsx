import Link from "next/link";
import IndexMenu from "./IndexMenu";
import Photo from "./Photo";
import StartLink from "./StartLink";
import { SITE, projects } from "@/lib/content";

export function ConceptBar() {
  return (
    <div className="concept-bar" role="note">
      <a href={SITE.conceptUrl} rel="noopener">
        {SITE.conceptLabel}
      </a>
    </div>
  );
}

export default function SiteHeader() {
  return (
    <header className="masthead">
      <Link prefetch={false} href="/" className="wordmark">
        Bracken <span>&amp;</span> Board
      </Link>
      <nav aria-label="Primary" className="masthead__nav">
        <IndexMenu count={projects.length}>
            <ol className="index__list">
              {projects.map((p) => (
                <li key={p.id}>
                  <a href={`/#${p.id}`}>
                    <Photo photo={p.after.photo} alt="" sizes="(min-width: 700px) 30vw, 40vw" className="index__thumb" />
                    <span className="index__no">{p.no}</span>
                    <span className="index__title">{p.title}</span>
                    <span className="index__meta">
                      {p.site}, {p.completed}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="index__more">
              <Link prefetch={false} href="/projects">All projects, as a list</Link>
            </p>
        </IndexMenu>
        <StartLink className="masthead__start">Start a project</StartLink>
      </nav>
    </header>
  );
}
