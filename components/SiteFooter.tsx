import Link from "next/link";
import StartLink from "./StartLink";
import { SITE, practice } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="colophon">
      <div className="colophon__grid">
        <h2 className="colophon__title">The practice</h2>
        <div className="colophon__text">
          <p className="colophon__lede">{practice.lede}</p>
          <p>
            <strong>What we build.</strong> {practice.work}
          </p>
          <p>
            <strong>How it works.</strong> {practice.how}
          </p>
        </div>
        <div className="colophon__contact">
          <h3>Visits by appointment</h3>
          <address>
            <p>Perth, Western Australia</p>
            <p>{SITE.email}</p>
            <p>{SITE.phone}</p>
          </address>
          <p>
            <StartLink className="underline-link">Start a project</StartLink>
          </p>
          <p>
            <Link prefetch={false} className="underline-link" href="/projects">
              Index of projects
            </Link>
          </p>
        </div>
      </div>
      <div className="colophon__legal">
        <p>
          {SITE.name} is a fictional business. The projects, places and contact details are invented, the plates are illustrations made for
          this concept, and the forms do not send anything.
        </p>
        <p>
          <a href={SITE.conceptUrl} rel="noopener">
            {SITE.conceptLabel}
          </a>
        </p>
      </div>
    </footer>
  );
}
