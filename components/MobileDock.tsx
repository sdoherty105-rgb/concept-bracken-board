"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { NAV } from "@/components/NavLinks";

/** Bottom bar. A plain details element without JavaScript; Escape and a chosen link close it. */
export default function MobileDock() {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        el.open = false;
        el.querySelector("summary")?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a")) el.open = false;
    };
    document.addEventListener("keydown", onKey);
    el.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      el.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="dock">
      <details className="dock__menu" ref={ref}>
        <summary role="button">Menu</summary>
        <nav aria-label="Sections" className="dock__panel">
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} prefetch={false}>
              {item.label}
            </Link>
          ))}
        </nav>
      </details>
      <Link href="/#visit" prefetch={false} className="dock__visit">
        Site visit
      </Link>
    </div>
  );
}
