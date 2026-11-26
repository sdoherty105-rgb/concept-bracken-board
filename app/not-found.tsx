import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <header className="title-course">
      <p className="label">404</p>
      <h1>This course is not on the wall.</h1>
      <p>The page is not part of this concept site.</p>
      <p>
        <Link href="/" className="text-link">
          Back to the yard
        </Link>
      </p>
    </header>
  );
}
