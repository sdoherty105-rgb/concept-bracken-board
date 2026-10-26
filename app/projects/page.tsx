import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import StartDrawer from "@/components/StartDrawer";
import StartLink from "@/components/StartLink";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Index of projects",
  description: "Every project in the Bracken & Board archive, as a list. A fictional landscape builder; the projects are illustrated, not real.",
};

export default function ProjectIndex() {
  return (
    <>
      <div className="archive-title">
        <h1>Index of projects</h1>
        <p>Listed newest first. Select a project to see it in the archive.</p>
      </div>
      <ol className="ledger">
        {[...projects].reverse().map((p) => (
          <li key={p.id} className="ledger__row">
            <Link prefetch={false} href={`/#${p.id}`} className="ledger__link">
              <Photo photo={p.after.photo} alt="" sizes="(min-width: 700px) 220px, 40vw" className="ledger__thumb" />
              <span className="ledger__no">{p.no}</span>
              <span className="ledger__title">{p.title}</span>
              <span className="ledger__cell">{p.site}</span>
              <span className="ledger__cell">{p.completed}</span>
              <span className="ledger__cell ledger__kind">{p.kind}</span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="ledger__start">
        Not in the archive yet? <StartLink className="underline-link">Start a project</StartLink>
      </p>
      <StartDrawer />
    </>
  );
}
