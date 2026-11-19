"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthSession, logout, type AuthResponse } from "@/lib/auth";

const dashboardLinks = [
  {
    title: "Tournaments",
    description: "Create, manage and organize esports tournaments.",
    href: "/organizer/tournaments",
    icon: "🏆",
  },
  {
    title: "Analytics",
    description: "Explore tournament statistics and performance.",
    href: "/analytics",
    icon: "📊",
  },
  {
    title: "Leaderboard",
    description: "View team and player rankings.",
    href: "/leaderboard",
    icon: "🥇",
  },
  {
    title: "Teams",
    description: "Browse registered competitive teams.",
    href: "/teams",
    icon: "🎮",
  },
  {
    title: "Players",
    description: "Explore registered players.",
    href: "/players",
    icon: "👤",
  },
  {
  title: "Registrations",
  description: "Review and manage tournament registrations.",
  href: "/organizer/registrations",
  icon: "📋",
},
{
  title: "Matches",
  description: "Schedule matches, manage squads and enter results.",
  href: "/organizer/matches",
  icon: "🎯",
},
];

export default function OrganizerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    setUser(getAuthSession());
  }, []);

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

  const firstName = user.fullName.split(" ")[0];

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
          <Link
            href="/organizer/dashboard"
            className="block px-4 py-3 rounded-lg bg-[#d6ff3f] text-black font-bold text-sm"
          >
            Overview
          </Link>

          {dashboardLinks.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block px-4 py-3 rounded-lg text-sm text-[#a1a8b1] hover:bg-[#171c22] hover:text-white transition"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#252b33] pt-5">
          <p className="font-semibold text-sm">{user.fullName}</p>
          <p className="text-xs text-[#737b86] mt-1">Organizer</p>

          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 px-3 py-2 mt-4"
          >
            ↪ Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">

        <header className="h-20 border-b border-[#252b33] flex items-center justify-between px-6 md:px-10">
          <div>
            <p className="text-xs text-[#737b86]">
              ORGANIZER PORTAL
            </p>
            <h1 className="font-bold text-lg">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold">{user.fullName}</p>
              <p className="text-xs text-[#737b86]">Organizer</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#d6ff3f] text-black flex items-center justify-center font-black">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* Welcome */}
          <div className="mb-10">
            <p className="text-[#d6ff3f] text-sm font-semibold mb-2">
              WELCOME BACK
            </p>

            <h2 className="text-3xl md:text-4xl font-black">
              What's happening, {firstName}?
            </h2>

            <p className="text-[#9298a1] mt-2">
              Manage your esports tournaments and competitive ecosystem.
            </p>
          </div>

          {/* Organizer Information */}
          <div className="rounded-2xl border border-[#3b4820] bg-gradient-to-r from-[#202b13] to-[#121812] p-6 md:p-8 mb-10">
            <p className="text-xs font-bold tracking-widest text-[#d6ff3f]">
              ORGANIZER WORKSPACE
            </p>

            <h3 className="text-2xl md:text-3xl font-black mt-3">
              Welcome to DROPZONE
            </h3>

            <p className="text-sm text-[#a5ad9d] mt-3 max-w-2xl">
              Your central workspace for organizing esports competitions,
              managing tournaments and monitoring competitive activity.
            </p>

            <Link
              href="/organizer/tournaments"
              className="inline-flex mt-6 bg-[#d6ff3f] text-black font-bold text-sm px-6 py-3 rounded-lg hover:bg-[#c5ed32] transition"
            >
              Explore tournaments →
            </Link>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold">Management & Insights</h3>
              <p className="text-sm text-[#9298a1] mt-1">
                Access your organizer tools.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {dashboardLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="border border-[#252b33] bg-[#14181e] rounded-xl p-6 hover:border-[#d6ff3f] transition group"
                >
                  <span className="text-3xl">{item.icon}</span>

                  <h4 className="font-bold text-lg mt-5 group-hover:text-[#d6ff3f] transition">
                    {item.title} →
                  </h4>

                  <p className="text-sm text-[#9298a1] mt-2">
                    {item.description}
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