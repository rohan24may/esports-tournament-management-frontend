
import { Suspense } from "react";
import { connection } from "next/server";

import Navbar from "@/components/layout/navbar";
import StatCard from "@/components/ui/StatCard";
import TournamentCard from "@/components/ui/TournamentCard";
import { apiFetch } from "@/lib/api";

interface DashboardSummary {
  totalGames: number;
  totalTeams: number;
  totalPlayers: number;
  totalTournaments: number;
  ongoingMatches: number;
  scheduledMatches: number;
  totalPrizeMoneyAwarded: number;
  activeSponsorshipValue: number;
}

interface Tournament {
  tournamentId: number;
  gameName: string;
  tournamentName: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  status: string;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  }).toUpperCase();
}

function formatPrize(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="px-6 py-24 md:px-12 md:py-32">
        <p className="mb-6 text-sm font-bold tracking-[0.25em] text-[var(--accent)]">
          ESPORTS TOURNAMENT INTELLIGENCE
        </p>

        <h2 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
          COMPETITIVE
          <br />
          INTELLIGENCE.
          <br />
          <span className="text-[var(--accent)]">SIMPLIFIED.</span>
        </h2>

        <p className="mt-8 max-w-xl text-base leading-7 text-[var(--muted)]">
          Explore tournaments, track teams, discover players and
          analyze competitive performance — all in one place.
        </p>

        <a
          href="#tournaments"
          className="mt-10 inline-block rounded-md bg-[var(--accent)] px-7 py-4 font-bold text-black transition hover:bg-white"
        >
          Explore Tournaments →
        </a>
      </section>

      {/* Dynamic Dashboard Data */}
      <Suspense
        fallback={
          <div className="px-6 py-20 text-sm text-[var(--muted)] md:px-12">
            Loading dashboard data...
          </div>
        }
      >
        <DashboardContent />
      </Suspense>

      {/* Footer */}
      <footer
        id="about"
        className="border-t border-[var(--border)] px-6 py-8 md:px-12"
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <p className="font-black">
            DROPZONE<span className="text-[var(--accent)]">.</span>
          </p>

          <p className="text-sm text-[var(--muted)]">
            Competitive intelligence for esports.
          </p>

          <p className="text-xs text-[var(--muted)]">
            © 2026 DROPZONE. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

async function DashboardContent() {
  await connection();

  let summary: DashboardSummary | null = null;
  let tournaments: Tournament[] = [];

  try {
    [summary, tournaments] = await Promise.all([
      apiFetch<DashboardSummary>("/dashboard/summary"),
      apiFetch<Tournament[]>("/tournaments"),
    ]);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }

  const stats = summary
    ? [
        { label: "TOURNAMENTS", value: summary.totalTournaments },
        { label: "REGISTERED TEAMS", value: summary.totalTeams },
        { label: "PLAYERS", value: summary.totalPlayers },
        { label: "GAMES", value: summary.totalGames },
      ]
    : [];

  return (
    <>
      {/* Platform Statistics */}
      <section id="statistics" className="px-6 pb-20 md:px-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold">PLATFORM OVERVIEW</h2>

          <span className="text-xs text-[var(--muted)]">
            {summary ? "LIVE DATA" : "DATA UNAVAILABLE"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={String(stat.value).padStart(2, "0")}
            />
          ))}
        </div>

        {summary && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="ONGOING MATCHES"
              value={String(summary.ongoingMatches).padStart(2, "0")}
            />

            <StatCard
              label="PRIZE MONEY AWARDED"
              value={formatPrize(summary.totalPrizeMoneyAwarded)}
            />

            <StatCard
              label="ACTIVE SPONSORSHIP"
              value={formatPrize(summary.activeSponsorshipValue)}
            />
          </div>
        )}
      </section>

      {/* Tournaments */}
      <section
        id="tournaments"
        className="border-t border-[var(--border)] px-6 py-20 md:px-12"
      >
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[var(--accent)]">
              COMPETE & CONQUER
            </p>

            <h2 className="text-3xl font-black md:text-4xl">
              FEATURED TOURNAMENTS
            </h2>
          </div>

          <span className="hidden text-sm text-[var(--muted)] md:block">
            {tournaments.length.toString().padStart(2, "0")} EVENTS
          </span>
        </div>

        {tournaments.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.tournamentId}
                id={String(tournament.tournamentId)}
                name={tournament.tournamentName}
                game={tournament.gameName}
                prize={formatPrize(tournament.prizePool)}
                dates={`${formatDate(tournament.startDate)} — ${formatDate(tournament.endDate)} 2026`}
                status={tournament.status}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            No tournaments available right now.
          </p>
        )}
      </section>
    </>
  );
}
