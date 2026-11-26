import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompareSlider from "@/components/CompareSlider";
import Photo from "@/components/Photo";
import ProjectPlate from "@/components/ProjectPlate";
import { projectBySlug, projects } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: `An OFF/SHIFT concept: fictional demonstration. ${project.brief}`,
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  const visit = `/?type=${encodeURIComponent(project.quoteType)}#visit`;

  return (
    <article data-layout="project-record">
      <header className="title-course">
        <p className="label">
          {project.site}
        </p>
        <h1>{project.title}</h1>
      </header>
      <div className="wall project-record">
        <figure className="g-1-8 plate-fig">
          <Photo plate={project.after} sizes="(min-width: 768px) 66vw, 100vw" priority />
          <figcaption>
            {project.kind}. Completed {project.completed}, a fictional record.
          </figcaption>
        </figure>
        <div className="g-9-4">
          <ProjectPlate project={project} />
        </div>
        <div className="g-1-12">
          <CompareSlider before={project.before} after={project.after} title={project.title} sizes="(min-width: 768px) 100vw, 100vw" />
        </div>
        <div className="g-1-7 block-pad">
          <p className="label">{project.duration}</p>
          <p>{project.brief}</p>
          <p>{project.notes}</p>
          <h2>What we did</h2>
          <ul className="fact-list">
            {project.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="g-8-5 block-pad block--raised">
          <h2>Materials</h2>
          <ul className="fact-list">
            {project.materials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            <Link href={visit} prefetch={false} className="text-link">
              Start a project like this
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
