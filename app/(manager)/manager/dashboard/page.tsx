
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAuthSession,
  logout,
  type AuthResponse,
} from "@/lib/auth";
import { apiFetch } from "@/lib/api";

interface ManagerProfile {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  onboarded: boolean;
  organizationId: number;
  organizationName: string;
  teamId: number;
  teamName: string;
  gameId: number;
  gameName: string;
}

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
  const [profile, setProfile] = useState<ManagerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    async function loadDashboard() {
      try {
        const data = await apiFetch<ManagerProfile>("/onboarding/me");

        setProfile(data);

        if (!data.onboarded) {
          router.replace("/manager/organization");
          return;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (loading || !user) {
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

          {/* Welcome */}
          <div className="mb-10">
            <p className="text-[#d6ff3f] text-sm font-semibold mb-2">
              WELCOME BACK
            </p>

            <h2 className="text-3xl md:text-4xl font-black">
              What's happening, {firstName}?
            </h2>

            <p className="text-[#9298a1] mt-2">
              Manage your organization, team and tournament journey.
            </p>
          </div>

          {/* API error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
              <button
                onClick={() => window.location.reload()}
                className="underline ml-2"
              >
                Retry
              </button>
            </div>
          )}

          {/* Organization and team overview */}
          {profile && profile.onboarded ? (
            <>
              <div className="rounded-2xl border border-[#3b4820] bg-gradient-to-r from-[#202b13] to-[#121812] p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-[#d6ff3f]">
                      YOUR ORGANIZATION
                    </span>

                    <h3 className="text-2xl md:text-3xl font-black mt-3">
                      {profile.organizationName}
                    </h3>

                    <p className="text-sm text-[#a5ad9d] mt-2">
                      Your organization is registered on DROPZONE.
                    </p>
                  </div>

                  <Link
                    href="/manager/organization"
                    className="inline-flex justify-center bg-[#d6ff3f] text-black font-bold text-sm px-6 py-3 rounded-lg hover:bg-[#c5ed32] transition"
                  >
                    Organization details →
                  </Link>
                </div>
              </div>

              {/* Real database information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">

                <div className="border border-[#252b33] bg-[#14181e] rounded-xl p-5">
                  <p className="text-sm text-[#9298a1]">Organization</p>
                  <p className="text-xl font-bold mt-4 break-words">
                    {profile.organizationName}
                  </p>
                  <p className="text-xs text-[#737b86] mt-2">
                    ID: {profile.organizationId}
                  </p>
                </div>

                <div className="border border-[#252b33] bg-[#14181e] rounded-xl p-5">
                  <p className="text-sm text-[#9298a1]">My Team</p>
                  <p className="text-xl font-bold mt-4 break-words">
                    {profile.teamName}
                  </p>
                  <p className="text-xs text-[#737b86] mt-2">
                    Team ID: {profile.teamId}
                  </p>
                </div>

                <div className="border border-[#252b33] bg-[#14181e] rounded-xl p-5">
                  <p className="text-sm text-[#9298a1]">Competitive Game</p>
                  <p className="text-xl font-bold mt-4">
                    {profile.gameName}
                  </p>
                  <p className="text-xs text-[#737b86] mt-2">
                    Game ID: {profile.gameId}
                  </p>
                </div>
              </div>

              {/* Account details */}
              <div className="border border-[#252b33] bg-[#14181e] rounded-xl p-6 mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold">Manager profile</h3>
                  <span className="text-xs font-bold text-[#d6ff3f] bg-[#d6ff3f]/10 px-3 py-2 rounded-full">
                    ONBOARDED ✓
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs text-[#737b86]">FULL NAME</p>
                    <p className="font-semibold mt-2">{profile.fullName}</p>
                  </div>

                  <div>
                    <p className="text-xs text-[#737b86]">EMAIL ADDRESS</p>
                    <p className="font-semibold mt-2 break-all">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : !error ? (
            <div className="border border-[#252b33] bg-[#14181e] rounded-xl p-6 mb-10">
              <h3 className="font-bold text-lg">Complete your setup</h3>
              <p className="text-sm text-[#9298a1] mt-2">
                Set up your organization and first team to get started.
              </p>
              <Link
                href="/manager/organization"
                className="inline-flex mt-5 bg-[#d6ff3f] text-black font-bold text-sm px-6 py-3 rounded-lg"
              >
                Set up organization →
              </Link>
            </div>
          ) : null}

          {/* Quick actions */}
          <div>
            <h3 className="text-xl font-bold mb-5">Quick actions</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

              {[
                {
                  title: "Manage Organization",
                  description: "View and manage your organization.",
                  href: "/manager/organization",
                },
                {
                  title: "Manage Team",
                  description: "View your competitive team.",
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
