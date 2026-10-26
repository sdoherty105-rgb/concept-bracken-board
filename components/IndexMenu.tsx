"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** The Index overlay. A plain <details> without JavaScript; with it, closes on Escape or after a pick. */
export default function IndexMenu({ count, children }: { count: number; children: ReactNode }) {
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
      if ((e.target as Element).closest(".index__panel a")) el.open = false;
    };
    document.addEventListener("keydown", onKey);
    el.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      el.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <details className="index" ref={ref}>
      <summary>
        Index <span className="index__count">{count}</span>
      </summary>
      <div className="index__panel">{children}</div>
    </details>
  );
}
