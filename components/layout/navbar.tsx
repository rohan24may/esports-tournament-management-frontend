"use client";

import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="relative border-b border-[var(--border)] px-6 py-5 md:px-12">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight"
          onClick={() => setMenuOpen(false)}
        >
          DROPZONE<span className="text-[var(--accent)]">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${
                isActive(link.href)
                  ? "font-semibold text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Explore */}
        <Link
          href="/tournaments"
          className="hidden rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-white md:block"
        >
          Explore
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="rounded-md border border-[var(--border)] p-2 text-white md:hidden"
        >
          {menuOpen ? (
            <span className="text-xl">✕</span>
          ) : (
            <span className="text-xl">☰</span>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-[var(--border)] bg-[var(--background)] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm transition ${
                  isActive(link.href)
                    ? "font-semibold text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}