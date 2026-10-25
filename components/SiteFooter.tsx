import Link from "next/link";
import { SITE } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="site-footer on-dark">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <p className="site-footer__name">{SITE.name}</p>
          <p>Landscaping and outdoor construction. Decks, paving and gardens, designed and built as one.</p>
        </div>
        <nav aria-label="Footer" className="site-footer__col">
          <h2 className="site-footer__h">Explore</h2>
          <ul>
            <li><Link href="/#services">Services</Link></li>
            <li><Link href="/#transformations">Transformations</Link></li>
            <li><Link href="/#process">Process</Link></li>
            <li><Link href="/#materials">Materials</Link></li>
            <li><Link href="/projects">All projects</Link></li>
            <li><Link href="/#quote">Request a quote</Link></li>
          </ul>
        </nav>
        <div className="site-footer__col">
          <h2 className="site-footer__h">Studio</h2>
          <address>
            <p>Studio and yard visits by appointment</p>
            <p>Perth, Western Australia</p>
            <p>{SITE.email}</p>
            <p>{SITE.phone}</p>
          </address>
        </div>
      </div>
      <div className="container">
        <div className="site-footer__legal">
        <p>
          {SITE.name} is a fictional business. The projects, prices and contact details on this site are invented for demonstration, and the
          forms do not send anything.
        </p>
        <p>
          <a href={SITE.conceptUrl} rel="noopener">
            {SITE.conceptLabel}
          </a>
        </p>
        </div>
      </div>
    </footer>
  );
}
