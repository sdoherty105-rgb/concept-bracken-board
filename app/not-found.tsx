import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <p className="eyebrow">404</p>
        <h1 className="h2">This page is out of bounds.</h1>
        <p className="lede">The page you are after does not exist on this concept site.</p>
        <p>
          <Link href="/" className="btn">
            Back to the home page
          </Link>
        </p>
      </div>
    </section>
  );
}
