
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Tournaments", href: "/tournaments" },
  { label: "Teams", href: "/teams" },
  { label: "Players", href: "/players" },
  { label: "Analytics", href: "/analytics" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5 md:px-12">
      <Link href="/" className="text-2xl font-black tracking-tight">
        DROPZONE<span className="text-[var(--accent)]">.</span>
      </Link>

      <div className="hidden items-center gap-8 text-sm md:flex">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${
                isActive
                  ? "font-semibold text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <Link
        href="/tournaments"
        className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-white"
      >
        Explore
      </Link>
    </nav>
  );
}
