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
        <p className="label">OFF/SHIFT Studio</p>
        <p className="fine">{SITE.disclosure}</p>
        <p>
          <a href={SITE.studioContactUrl} className="foot__cta">
            {SITE.studioCta}
          </a>
        </p>
        <p>
          <a href={SITE.conceptUrl}>Back to the OFF/SHIFT concept page</a>
        </p>
        <p>
          <Link href="/guarantee" prefetch={false}>
            Demonstration terms
          </Link>
        </p>
        <p className="foot__credit" data-footer-credit>
          <span>Designed by</span>
          <a href="https://offshiftstudio.com.au" rel="noopener" className="foot__credit-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/offshift-wordmark-light.svg" alt="OFF/SHIFT Studio" width={88} height={24} />
          </a>
        </p>
      </div>
    </footer>
  );
}
