"use client";

import { useEffect, useState } from "react";
import ManagerShell from "@/components/manager/ManagerShell";
import { apiFetch } from "@/lib/api";

interface ManagerMatch {
  matchId: number;
  tournamentId: number;
  tournamentName: string;
  matchNumber: number;
  mapName: string;
  scheduledAt: string | null;
  matchStatus: string;
  placement: number | null;
  totalPoints: number | null;
}

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function ManagerMatchesPage() {
  const [matches, setMatches] = useState<ManagerMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    apiFetch<ManagerMatch[]>("/manager/workspace/matches")
      .then(setMatches)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load match history."))
      .finally(() => setLoading(false));
  }, []);

  const visibleMatches = filter === "ALL" ? matches : matches.filter((match) => match.matchStatus.toUpperCase() === filter);

  return (
    <ManagerShell title="Matches & Results" active="/manager/matches">
      <div className="mb-8"><p className="text-[#d6ff3f] text-sm font-semibold mb-2">TEAM PERFORMANCE</p><h2 className="text-3xl md:text-4xl font-black">Matches & Results</h2><p className="text-[#9298a1] mt-2">Fixtures and recorded results for your team.</p></div>
      {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><p className="text-sm text-[#9298a1]">{matches.length} team match records</p><select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-[#303640] bg-[#14181e] px-4 py-2 text-sm"><option value="ALL">All matches</option><option value="SCHEDULED">Scheduled</option><option value="ONGOING">Ongoing</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select></div>
      {loading ? <p className="text-[#d6ff3f]">Loading matches...</p> : visibleMatches.length === 0 ? <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-8 text-center"><h3 className="font-bold">No matches found</h3><p className="text-sm text-[#9298a1] mt-2">Your team's match fixtures and results will appear here.</p></div> : (
        <div className="rounded-xl border border-[#252b33] bg-[#14181e] overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-[#101419] text-[#9298a1]"><tr><th className="px-5 py-4">Match</th><th className="px-5 py-4">Tournament</th><th className="px-5 py-4">Map</th><th className="px-5 py-4">Scheduled</th><th className="px-5 py-4">Placement</th><th className="px-5 py-4">Points</th><th className="px-5 py-4">Status</th></tr></thead><tbody>{visibleMatches.map((match) => <tr key={match.matchId} className="border-t border-[#252b33]"><td className="px-5 py-4 font-semibold">#{match.matchNumber}</td><td className="px-5 py-4">{match.tournamentName}</td><td className="px-5 py-4">{match.mapName}</td><td className="px-5 py-4 whitespace-nowrap">{formatDate(match.scheduledAt)}</td><td className="px-5 py-4">{match.placement ?? "—"}</td><td className="px-5 py-4">{match.totalPoints ?? "—"}</td><td className="px-5 py-4"><span className="rounded-full bg-[#20252c] px-3 py-1 text-xs">{match.matchStatus}</span></td></tr>)}</tbody></table></div></div>
      )}
    </ManagerShell>
  );
}
