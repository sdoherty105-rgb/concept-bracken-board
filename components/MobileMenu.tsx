"use client";

import Link from "next/link";
import { useRef } from "react";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#transformations", label: "Transformations" },
  { href: "/#process", label: "Process" },
  { href: "/#materials", label: "Materials" },
  { href: "/projects", label: "Projects" },
];

export default function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");

  return (
    <details className="menu" ref={ref}>
      <summary>
        <span>Menu</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 8h16M4 16h16" />
        </svg>
      </summary>
      <ul className="menu__panel">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} onClick={close}>
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/#quote" className="btn btn--small" onClick={close}>
            Request a quote
          </Link>
        </li>
      </ul>
    </details>
  );
}
