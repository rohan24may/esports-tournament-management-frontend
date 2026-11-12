
import { Suspense } from "react";
import { connection } from "next/server";

import Navbar from "@/components/layout/navbar";
import { apiFetch } from "@/lib/api";

interface TournamentOverview {
  tournamentId: number;
  gameId: number;
  tournamentName: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  status: string;
  registeredTeams: number;
  totalMatches: number;
  completedMatches: number;
}

interface MatchOverview {
  matchId: number;
  matchNumber: number;
  tournamentId: number;
  tournamentName: string;
  mapName: string;
  scheduledAt: string;
  status: string;
  participatingTeams: number;
  participatingPlayers: number;
}

function formatPrize(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="px-6 py-16 md:px-12">
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[var(--accent)]">
          DATA-DRIVEN COMPETITION
        </p>

        <h1 className="text-4xl font-black md:text-5xl">
          ANALYTICS
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Explore tournament statistics, evaluate team performance
          and discover insights from competitive matches across multiple games.
        </p>

        <Suspense
          fallback={
            <p className="mt-10 text-sm text-[var(--muted)]">
              Loading analytics...
            </p>
          }
        >
          <AnalyticsContent />
        </Suspense>
      </section>
    </main>
  );
}

async function AnalyticsContent() {
  await connection();

  let tournaments: TournamentOverview[] = [];
  let matches: MatchOverview[] = [];
  let error = false;

  try {
    [tournaments, matches] = await Promise.all([
      apiFetch<TournamentOverview[]>("/analytics/tournaments"),
      apiFetch<MatchOverview[]>("/analytics/matches"),
    ]);
  } catch (err) {
    console.error("Failed to load analytics:", err);
    error = true;
  }

  const completedMatches = matches.filter(
    (match) => match.status === "COMPLETED"
  ).length;

  const totalParticipatingTeams = matches.reduce(
    (total, match) => total + match.participatingTeams,
    0
  );

  const totalPlayerAppearances = matches.reduce(
    (total, match) => total + match.participatingPlayers,
    0
  );

  const overviewStats = [
    { label: "COMPLETED MATCHES", value: completedMatches },
    {
      label: "REGISTERED TEAMS",
      value: tournaments.reduce(
        (total, item) => total + item.registeredTeams,
        0
      ),
    },
    { label: "PLAYER APPEARANCES", value: totalPlayerAppearances },
    { label: "TOURNAMENTS", value: tournaments.length },
  ];

  if (error) {
    return (
      <p className="mt-10 text-sm text-red-400">
        Unable to load analytics. Please try again later.
      </p>
    );
  }

  return (
    <>
      {/* Overview */}
      <div className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold">PLATFORM OVERVIEW</h2>
          <span className="text-xs text-[var(--accent)]">
            LIVE DATA
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {overviewStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <p className="text-3xl font-black text-white md:text-4xl">
                {String(stat.value).padStart(2, "0")}
              </p>
              <p className="mt-3 text-xs font-semibold tracking-wider text-[var(--muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Analytics */}
      <div className="mt-16">
        <div className="mb-6 border-b border-[var(--border)] pb-4">
          <h2 className="font-bold">TOURNAMENT PERFORMANCE</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Registration, match progress and prize pool overview.
          </p>
        </div>

        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <div
              key={tournament.tournamentId}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold">
                  {tournament.tournamentName}
                </h3>
                <span className="text-xs font-bold text-[var(--accent)]">
                  {tournament.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-[var(--muted)]">REGISTERED TEAMS</p>
                  <p className="mt-2 text-xl font-bold">
                    {tournament.registeredTeams}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">TOTAL MATCHES</p>
                  <p className="mt-2 text-xl font-bold">
                    {tournament.totalMatches}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">COMPLETED</p>
                  <p className="mt-2 text-xl font-bold text-[var(--accent)]">
                    {tournament.completedMatches}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">PRIZE POOL</p>
                  <p className="mt-2 text-xl font-bold">
                    {formatPrize(tournament.prizePool)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Match Analytics */}
      <div className="mt-16">
        <div className="mb-6 border-b border-[var(--border)] pb-4">
          <h2 className="font-bold">MATCH PERFORMANCE</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Match status, participating teams and player appearances.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface)] text-[var(--muted)]">
              <tr>
                <th className="p-4">MATCH</th>
                <th className="p-4">TOURNAMENT</th>
                <th className="p-4">MAP</th>
                <th className="p-4">TEAMS</th>
                <th className="p-4">PLAYERS</th>
                <th className="p-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr
                  key={match.matchId}
                  className="border-t border-[var(--border)]"
                >
                  <td className="p-4 font-bold">
                    Match {match.matchNumber}
                  </td>
                  <td className="p-4">{match.tournamentName}</td>
                  <td className="p-4">{match.mapName}</td>
                  <td className="p-4">{match.participatingTeams}</td>
                  <td className="p-4">{match.participatingPlayers}</td>
                  <td className="p-4 font-bold text-[var(--accent)]">
                    {match.status}
                  </td>
                </tr>
              ))}

              {matches.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-[var(--muted)]">
                    No matches available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-xs text-[var(--muted)]">
            TOTAL TEAM APPEARANCES
          </p>
          <p className="mt-3 text-3xl font-black text-[var(--accent)]">
            {totalParticipatingTeams}
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-xs text-[var(--muted)]">
            TOTAL PLAYER APPEARANCES
          </p>
          <p className="mt-3 text-3xl font-black text-[var(--accent)]">
            {totalPlayerAppearances}
          </p>
        </div>
      </div>
    </>
  );
}
