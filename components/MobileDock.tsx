import Link from "next/link";

/** One full-width site-visit bar. The routes live in the ledger strip above, not in a second cell. */
export default function MobileDock() {
  return (
    <div className="dock">
      <Link href="/#visit" prefetch={false} className="dock__visit">
        Book a site visit
      </Link>
    </div>
  );
}
