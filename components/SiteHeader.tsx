import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { SITE } from "@/lib/content";

export function ConceptBar() {
  return (
    <div className="concept-bar" role="note">
      <a href={SITE.conceptUrl} rel="noopener">
        <span className="concept-bar__dot" aria-hidden="true" />
        {SITE.conceptLabel}
      </a>
    </div>
  );
}

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">
            B&amp;B
          </span>
          <span className="brand__name">{SITE.name}</span>
        </Link>
        <nav aria-label="Primary" className="nav">
          <ul className="nav__list">
            <li><Link href="/#services">Services</Link></li>
            <li><Link href="/#transformations">Transformations</Link></li>
            <li><Link href="/#process">Process</Link></li>
            <li><Link href="/#materials">Materials</Link></li>
            <li><Link href="/projects">Projects</Link></li>
          </ul>
          <MobileMenu />
        </nav>
        <Link href="/#quote" className="btn btn--small site-header__cta">
          Request a quote
        </Link>
      </div>
    </header>
  );
}
