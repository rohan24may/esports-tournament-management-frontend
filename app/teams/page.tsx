
import { Suspense } from "react";
import { connection } from "next/server";

import Navbar from "@/components/layout/navbar";
import TeamCard from "@/components/ui/TeamCard";
import { apiFetch } from "@/lib/api";

interface Team {
  teamId: number;
  teamName: string;
  organizationName: string;
  gameName: string;
  coachName: string | null;
}

interface TeamRoster {
  rosterId: number;
  teamId: number;
  playerId: number;
  status: string;
}

export default function TeamsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="px-6 py-16 md:px-12">
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[var(--accent)]">
          THE COMPETITORS
        </p>

        <h1 className="text-4xl font-black md:text-5xl">
          TEAMS
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Discover esports organizations, explore their teams
          and follow their competitive rosters.
        </p>

        <Suspense
          fallback={
            <p className="mt-8 text-sm text-[var(--muted)]">
              Loading teams...
            </p>
          }
        >
          <TeamsContent />
        </Suspense>
      </section>
    </main>
  );
}

async function TeamsContent() {
  await connection();

  let teams: Team[] = [];
  let rosters: TeamRoster[] = [];
  let error = false;

  try {
    [teams, rosters] = await Promise.all([
      apiFetch<Team[]>("/teams"),
      apiFetch<TeamRoster[]>("/team-rosters"),
    ]);
  } catch (err) {
    console.error("Failed to load teams:", err);
    error = true;
  }

  return (
    <>
      <div className="mt-12 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="font-bold">ALL TEAMS</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            LIVE TEAM DATA
          </p>
        </div>

        <span className="text-sm text-[var(--muted)]">
          {teams.length.toString().padStart(2, "0")} TEAMS
        </span>
      </div>

      {error ? (
        <p className="mt-8 text-sm text-red-400">
          Unable to load teams. Please try again later.
        </p>
      ) : teams.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--muted)]">
          No teams available.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => {
            const playerCount = rosters.filter(
              (roster) =>
                roster.teamId === team.teamId &&
                roster.status === "ACTIVE"
            ).length;

            return (
              <TeamCard
                key={team.teamId}
                name={team.teamName}
                game={team.gameName}
                organization={team.organizationName}
                players={playerCount}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
