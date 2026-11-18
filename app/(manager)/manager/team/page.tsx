"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ManagerShell from "@/components/manager/ManagerShell";
import { apiFetch } from "@/lib/api";

interface ManagerProfile {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  onboarded: boolean;
  organizationId: number | null;
  organizationName: string | null;
  teamId: number | null;
  teamName: string | null;
  gameId: number | null;
  gameName: string | null;
}

interface RosterEntry {
  rosterId: number;
  teamId: number;
  playerId: number;
  role: string | null;
  startDate: string;
  endDate: string | null;
  status: string;
}

export default function MyTeamPage() {
  const [profile, setProfile] = useState<ManagerProfile | null>(null);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [profileData, rosterData] = await Promise.all([
          apiFetch<ManagerProfile>("/onboarding/me"),
          apiFetch<RosterEntry[]>("/manager/workspace/roster"),
        ]);
        setProfile(profileData);
        setRoster(rosterData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load team details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <ManagerShell title="My Team" active="/manager/team">
      <div className="mb-8">
        <p className="text-[#d6ff3f] text-sm font-semibold mb-2">YOUR COMPETITIVE UNIT</p>
        <h2 className="text-3xl md:text-4xl font-black">My Team</h2>
        <p className="text-[#9298a1] mt-2">View your team's identity, game and active roster.</p>
      </div>

      {loading ? (
        <p className="text-[#d6ff3f]">Loading team details...</p>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</div>
      ) : !profile?.onboarded ? (
        <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-6">
          <h3 className="font-bold text-lg">Finish team setup</h3>
          <p className="text-sm text-[#9298a1] mt-2">Complete onboarding to view your team workspace.</p>
          <Link href="/manager/organization" className="inline-flex mt-5 bg-[#d6ff3f] text-black font-bold px-5 py-3 rounded-lg">Set up team →</Link>
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-[#3b4820] bg-gradient-to-r from-[#202b13] to-[#121812] p-6 md:p-8 mb-6">
            <p className="text-xs font-bold tracking-widest text-[#d6ff3f]">TEAM WORKSPACE</p>
            <h3 className="text-3xl font-black mt-3">{profile.teamName}</h3>
            <p className="text-[#a5ad9d] mt-2">{profile.organizationName} · {profile.gameName}</p>
          </section>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[
              ["Team ID", profile.teamId],
              ["Organization ID", profile.organizationId],
              ["Game", profile.gameName],
              ["Active players", roster.length],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-[#252b33] bg-[#14181e] p-5">
                <p className="text-sm text-[#9298a1]">{label}</p>
                <p className="text-xl font-bold mt-3 break-words">{value ?? "—"}</p>
              </div>
            ))}
          </div>

          <section className="rounded-xl border border-[#252b33] bg-[#14181e] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold">Active roster</h3>
                <p className="text-sm text-[#9298a1] mt-1">Players currently linked to this team.</p>
              </div>
              <Link href="/manager/players" className="text-sm font-semibold text-[#d6ff3f] hover:underline">Manage roster →</Link>
            </div>
            {roster.length === 0 ? (
              <p className="text-sm text-[#9298a1]">No active players have been added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[#9298a1] border-b border-[#252b33]"><tr><th className="py-3 pr-4">Player ID</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Joined</th><th className="py-3">Status</th></tr></thead>
                  <tbody>{roster.map((entry) => <tr key={entry.rosterId} className="border-b border-[#252b33]/70"><td className="py-3 pr-4">#{entry.playerId}</td><td className="py-3 pr-4">{entry.role || "Player"}</td><td className="py-3 pr-4">{entry.startDate}</td><td className="py-3"><span className="text-[#d6ff3f]">{entry.status}</span></td></tr>)}</tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </ManagerShell>
  );
}
