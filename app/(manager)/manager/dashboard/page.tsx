
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAuthSession,
  logout,
  type AuthResponse,
} from "@/lib/auth";

const navigation = [
  { name: "Overview", icon: "◫", href: "/manager/dashboard" },
  { name: "Organization", icon: "⌂", href: "/manager/organization" },
  { name: "My Team", icon: "♧", href: "/manager/team" },
  { name: "Players & Roster", icon: "♙", href: "/manager/players" },
  { name: "Tournaments", icon: "♜", href: "/manager/tournaments" },
  { name: "Matches & Results", icon: "⚑", href: "/manager/matches" },
];

export default function ManagerDashboard() {
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
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-[#252b33] flex-col p-6">
        <Link href="/" className="text-2xl font-black mb-12">
          DROP<span className="text-[#d6ff3f]">ZONE</span>
        </Link>

        <p className="text-xs uppercase tracking-widest text-[#737b86] mb-4">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                index === 0
                  ? "bg-[#d6ff3f] text-black font-bold"
                  : "text-[#a1a8b1] hover:bg-[#171c22] hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#252b33] pt-5">
          <div className="mb-4">
            <p className="font-semibold text-sm">{user.fullName}</p>
            <p className="text-xs text-[#737b86] mt-1">Team Manager</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 px-3 py-2"
          >
            ↪ Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <header className="h-20 border-b border-[#252b33] flex items-center justify-between px-6 md:px-10">
          <div>
            <p className="text-xs text-[#737b86]">TEAM MANAGER PORTAL</p>
            <h1 className="font-bold text-lg">Dashboard</h1>
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

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-[#d6ff3f] text-sm font-semibold mb-2">
              WELCOME BACK
            </p>
            <h2 className="text-3xl md:text-4xl font-black">
              What's happening, {user.fullName.split(" ")[0]}?
            </h2>
            <p className="text-[#9298a1] mt-2">
              Manage your organization, team and tournament journey.
            </p>
          </div>

          {/* Setup banner */}
          <div className="rounded-2xl border border-[#3b4820] bg-gradient-to-r from-[#202b13] to-[#121812] p-6 md:p-8 mb-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-[#d6ff3f]">
                GET STARTED
              </span>
              <h3 className="text-2xl font-bold mt-3">
                Build your esports presence.
              </h3>
              <p className="text-sm text-[#a5ad9d] mt-2 leading-relaxed">
                Set up your organization, create your team and start
                competing in tournaments on DROPZONE.
              </p>
              <Link
                href="/manager/organization"
                className="inline-flex mt-6 bg-[#d6ff3f] text-black font-bold text-sm px-6 py-3 rounded-lg hover:bg-[#c5ed32] transition"
              >
                Set up organization →
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
            {[
              { label: "My Organization", value: "Not set up", icon: "⌂" },
              { label: "Team Members", value: "0", icon: "♙" },
              { label: "Tournaments", value: "0", icon: "♜" },
              { label: "Upcoming Matches", value: "0", icon: "⚑" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-[#252b33] bg-[#14181e] rounded-xl p-5"
              >
                <div className="flex justify-between items-center mb-5">
                  <p className="text-sm text-[#9298a1]">{stat.label}</p>
                  <span className="text-xl text-[#d6ff3f]">{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div>
            <h3 className="text-xl font-bold mb-5">Quick actions</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[
                {
                  title: "Create Organization",
                  description: "Register your esports organization.",
                  href: "/manager/organization",
                },
                {
                  title: "Manage Team",
                  description: "Set up your team and game.",
                  href: "/manager/team",
                },
                {
                  title: "Manage Players",
                  description: "Build and manage your roster.",
                  href: "/manager/players",
                },
              ].map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="border border-[#252b33] bg-[#14181e] rounded-xl p-6 hover:border-[#d6ff3f] transition group"
                >
                  <h4 className="font-bold group-hover:text-[#d6ff3f] transition">
                    {action.title} →
                  </h4>
                  <p className="text-sm text-[#9298a1] mt-2">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
