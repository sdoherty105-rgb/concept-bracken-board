import Link from "next/link";
import { SITE } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="wall foot">
      <div className="g-1-5 foot__pad">
        <p className="label">Bracken &amp; Board</p>
        <p>We draw it, then we build it. Limestone, jarrah, clay and gravel, laid in courses.</p>
      </div>
      <div className="g-6-4 foot__pad">
        <p className="label">Fictional yard</p>
        <p>Perth, Western Australia</p>
        <p>
          <a href={SITE.phoneHref}>{SITE.phone}</a>
        </p>
        <p>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
        <p className="fine">These contact details are invented.</p>
      </div>
      <div className="g-10-3 block--jarrah foot__pad">
        <p className="label">Studio</p>
        <p>
          <a href={SITE.conceptUrl} rel="noopener">
            OFF/SHIFT Studio concept
          </a>
        </p>
        <p>
          <Link href="/guarantee" prefetch={false}>
            Demonstration terms
          </Link>
        </p>
      </div>
    </footer>
  );
}
