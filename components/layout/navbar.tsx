"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { getDashboardPath, logout } from "@/lib/auth";

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
  const router = useRouter();

  const { user, isLoading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    router.replace("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="relative border-b border-[var(--border)] px-6 py-5 md:px-12">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight"
          onClick={closeMenu}
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

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/tournaments"
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-white"
          >
            Explore
          </Link>

          {!isLoading &&
            (user ? (
              <>
                <Link
                  href={getDashboardPath(user.role)}
                  className="rounded-md border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2.5 text-sm text-[var(--muted)] transition hover:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2.5 text-sm font-semibold transition hover:text-[var(--accent)]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-md border border-[var(--accent)] px-4 py-2.5 text-sm font-bold text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-black"
                >
                  Sign Up
                </Link>
              </>
            ))}
        </div>

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
                onClick={closeMenu}
                className={`text-sm transition ${
                  isActive(link.href)
                    ? "font-semibold text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-[var(--border)] pt-5">
              <div className="flex flex-col gap-4">
                {!isLoading &&
                  (user ? (
                    <>
                      <Link
                        href={getDashboardPath(user.role)}
                        onClick={closeMenu}
                        className="text-sm font-semibold text-[var(--accent)]"
                      >
                        Dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-left text-sm text-red-400"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="text-sm font-semibold"
                      >
                        Login
                      </Link>

                      <Link
                        href="/register"
                        onClick={closeMenu}
                        className="text-sm font-semibold text-[var(--accent)]"
                      >
                        Create Account
                      </Link>
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}