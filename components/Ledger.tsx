import Link from "next/link";
import NavLinks from "@/components/NavLinks";

export default function Ledger() {
  return (
    <header className="ledger" data-nav="ledger-bar" data-layout="ledger-bar">
      <Link href="/" prefetch={false} className="ledger__mark">
        <span>Bracken</span>
        <span>&amp;</span>
        <span>Board</span>
      </Link>
      <nav aria-label="Primary" className="ledger__nav">
        <NavLinks />
      </nav>
      <Link href="/#visit" prefetch={false} className="ledger__book">
        Book a site visit
      </Link>
    </header>
  );
}
