import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="archive-title archive-title--lost">
      <h1>This page is not in the archive.</h1>
      <p>
        <Link prefetch={false} className="underline-link" href="/">
          Back to the projects
        </Link>
      </p>
    </div>
  );
}
