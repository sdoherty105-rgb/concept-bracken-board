import type { Metadata } from "next";
import Link from "next/link";
import ConceptPlate from "@/components/ConceptPlate";
import Photo from "@/components/Photo";
import ProjectPlate from "@/components/ProjectPlate";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "An OFF/SHIFT concept — fictional demonstration. Three outdoor projects: a courtyard deck, an entry path and a terraced garden.",
};

export default function ProjectsPage() {
  const spans = [
    { fig: "g-1-8", plate: "g-9-4" },
    { fig: "g-5-8", plate: "g-1-4" },
    { fig: "g-1-6", plate: "g-7-6" },
  ];
  return (
    <>
      <header className="title-course">
        <p className="label">Projects</p>
        <h1>Work on the ground.</h1>
        <ConceptPlate />
      </header>
      <section className="course" aria-labelledby="index-title" data-layout="project-index">
        <div className="course__intro">
          <h2 id="index-title">Three records.</h2>
          <p>Each plate is a fictional project record: year, area, crew and materials. None of this work was built for a client.</p>
        </div>
        {projects.map((p, i) => (
          <article key={p.id} className="wall project-row" aria-labelledby={`${p.id}-title`}>
            <Link href={`/projects/${p.id}`} prefetch={false} className={`plate-fig ${spans[i].fig}`}>
              <Photo plate={p.after} sizes="(min-width: 768px) 60vw, 100vw" priority={i === 0} />
              <span className="visually-hidden">Open {p.title}</span>
            </Link>
            <div className={spans[i].plate}>
              <h3 id={`${p.id}-title`} className="visually-hidden">
                {p.title}
              </h3>
              <ProjectPlate project={p} />
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
