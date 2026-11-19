import type { Project } from "@/lib/content";

export default function ProjectPlate({ project }: { project: Project }) {
  return (
    <aside className="plaque" aria-label={`${project.title} site plate`}>
      <p className="plaque__name">{project.title}</p>
      <dl className="plaque__facts">
        <div>
          <dt>Year</dt>
          <dd>{project.year}</dd>
        </div>
        <div>
          <dt>Area</dt>
          <dd>{project.area}</dd>
        </div>
        <div>
          <dt>Crew</dt>
          <dd>{project.crew}</dd>
        </div>
        <div>
          <dt>Materials</dt>
          <dd>{project.materials.join(", ")}</dd>
        </div>
      </dl>
      <p className="plaque__note">Fictional project record. Not a built sign.</p>
    </aside>
  );
}
