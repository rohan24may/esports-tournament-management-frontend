"use client";

import { useEffect, useRef, useState } from "react";
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

const roleLabels: Record<string, string> = {
  TEAM_MANAGER: "Team Manager",
  ORGANIZER: "Tournament Organizer",
  PLAYER: "Player",
  VIEWER: "Viewer",
};

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "DZ"
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = user?.fullName?.trim() || "DROPZONE Member";
  const initials = getInitials(displayName);
  const roleLabel = user ? roleLabels[user.role] || user.role : "";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close profile dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!profileOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  function handleLogout() {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    router.replace("/");
  }

  function closeMenus() {
    setMenuOpen(false);
    setProfileOpen(false);
  }

  return (
    <nav className="relative z-40 border-b border-[var(--border)] px-6 py-5 md:px-12">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black tracking-tight"
          onClick={closeMenus}
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

                {/* Profile Avatar */}
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((open) => !open)}
                    aria-label="Open profile menu"
                    aria-expanded={profileOpen}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#d6ff3f]/50 bg-[#d6ff3f]/10 text-sm font-black text-[#d6ff3f] transition hover:border-[#d6ff3f] hover:bg-[#d6ff3f]/20"
                  >
                    {initials}

                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#090b0e] bg-[#d6ff3f]" />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-xl border border-[#303741] bg-[#14181e] shadow-2xl shadow-black/50">

                      {/* Account Information */}
                      <div className="p-4">
                        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#737c87]">
                          Account Information
                        </p>

                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d6ff3f]/40 bg-[#d6ff3f]/10 text-base font-black text-[#d6ff3f]">
                            {initials}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {displayName}
                            </p>
                            <p className="mt-1 truncate text-xs text-[#9298a1]">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-[#303741] pt-4">
                          <span className="text-xs text-[#9298a1]">
                            Account type
                          </span>

                          <span className="rounded-md border border-[#d6ff3f]/20 bg-[#d6ff3f]/10 px-2.5 py-1 text-[10px] font-bold text-[#d6ff3f]">
                            {roleLabel}
                          </span>
                        </div>
                      </div>

                      {/* Dropdown Actions */}
                      <div className="border-t border-[#303741] p-2">
                        <Link
                          href={getDashboardPath(user.role)}
                          onClick={closeMenus}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-[#cbd0d6] transition hover:bg-white/5 hover:text-[#d6ff3f]"
                        >
                          <span>Go to Dashboard</span>
                          <span>→</span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                        >
                          <span>↪</span>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
        <div className="absolute left-0 right-0 top-full z-50 border-b border-[var(--border)] bg-[#090b0e] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
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
              {!isLoading &&
                (user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d6ff3f]/40 bg-[#d6ff3f]/10 text-sm font-black text-[#d6ff3f]">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-[#9298a1]">
                          {user.email}
                        </p>
                        <p className="mt-1 text-[10px] font-bold text-[#d6ff3f]">
                          {roleLabel}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={getDashboardPath(user.role)}
                      onClick={closeMenus}
                      className="block text-sm font-semibold text-[#d6ff3f]"
                    >
                      Dashboard →
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-sm text-red-400"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/login"
                      onClick={closeMenus}
                      className="text-sm font-semibold"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenus}
                      className="text-sm font-semibold text-[var(--accent)]"
                    >
                      Create Account
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}