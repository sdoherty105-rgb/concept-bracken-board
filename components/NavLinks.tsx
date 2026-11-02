"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV = [
  { href: "/#trades", label: "Build", match: (path: string) => path === "/" },
  { href: "/materials", label: "Materials", match: (path: string) => path.startsWith("/materials") },
  { href: "/projects", label: "Projects", match: (path: string) => path.startsWith("/projects") },
  { href: "/guarantee", label: "Guarantee", match: (path: string) => path.startsWith("/guarantee") },
];

export default function NavLinks() {
  const path = usePathname() || "/";
  return (
    <>
      {NAV.map((item) => (
        <Link key={item.label} href={item.href} prefetch={false} aria-current={item.match(path) ? "page" : undefined}>
          {item.label}
        </Link>
      ))}
    </>
  );
}
