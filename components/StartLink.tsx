"use client";

import type { ReactNode } from "react";

export const START_EVENT = "bb:start";

type Props = { type?: string; className?: string; children: ReactNode };

/**
 * Opens the quote drawer, starting on the given project type. Without
 * JavaScript it is an ordinary link to /start, which holds the same form.
 */
export default function StartLink({ type, className, children }: Props) {
  const href = type ? `/start?type=${encodeURIComponent(type)}` : "/start";
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(START_EVENT, { detail: { type } }));
      }}
    >
      {children}
    </a>
  );
}
