"use client";

import { useEffect, useState } from "react";
import Photo from "./Photo";
import { projects } from "@/lib/content";

/** The plates themselves, as a fixed strip down the side of the archive. Marks the project in view. */
export default function PlateRail() {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio));
        let best: string | null = null;
        let ratio = 0;
        seen.forEach((r, id) => {
          if (r > ratio) [best, ratio] = [id, r];
        });
        setCurrent(best);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75] },
    );
    projects.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav className="rail" aria-label="Projects">
      <ol>
        {projects.map((p) => (
          <li key={p.id}>
            <a href={`#${p.id}`} aria-current={current === p.id ? "location" : undefined}>
              <Photo photo={p.after.photo} alt="" sizes="96px" className="rail__thumb" />
              <span className="rail__no">{p.no}</span>
              <span className="visually-hidden">{p.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
