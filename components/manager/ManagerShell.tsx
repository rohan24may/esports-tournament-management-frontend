"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAuthSession, logout, type AuthResponse } from "@/lib/auth";

const navigation = [
  { label: "Overview", href: "/manager/dashboard", icon: "◫" },
  { label: "Organization", href: "/manager/organization", icon: "⌂" },
  { label: "My Team", href: "/manager/team", icon: "♧" },
  { label: "Players & Roster", href: "/manager/players", icon: "♙" },
  { label: "Tournaments", href: "/manager/tournaments", icon: "♜" },
  { label: "Matches & Results", href: "/manager/matches", icon: "⚑" },
];

export default function ManagerShell({
  title,
  active,
  children,
}: {
  title: string;
  active: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== "TEAM_MANAGER") {
      router.replace("/");
      return;
    }
    setUser(session);
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/login");
    router.refresh();
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#090b0e] flex items-center justify-center text-[#d6ff3f]">
        Loading DROPZONE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b0e] text-white flex">
      <aside className="hidden md:flex w-64 shrink-0 border-r border-[#252b33] flex-col p-6">
        <Link href="/" className="text-2xl font-black mb-12">
          DROP<span className="text-[#d6ff3f]">ZONE</span>
        </Link>
        <p className="text-xs uppercase tracking-widest text-[#737b86] mb-4">Workspace</p>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                active === item.href
                  ? "bg-[#d6ff3f] text-black font-bold"
                  : "text-[#a1a8b1] hover:bg-[#171c22] hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-[#252b33] pt-5">
          <p className="font-semibold text-sm">{user.fullName}</p>
          <p className="text-xs text-[#737b86] mt-1">Team Manager</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 px-3 py-2 mt-4"
          >
            ↪ Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="min-h-20 border-b border-[#252b33] flex items-center justify-between px-6 md:px-10 py-4">
          <div>
            <p className="text-xs text-[#737b86]">TEAM MANAGER PORTAL</p>
            <h1 className="font-bold text-lg">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold">{user.fullName}</p>
              <p className="text-xs text-[#737b86]">Team Manager</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#d6ff3f] text-black flex items-center justify-center font-black">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
