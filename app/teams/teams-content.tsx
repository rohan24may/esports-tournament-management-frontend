
"use client";

import { useEffect, useState } from "react";
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

export default function TeamsContent() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [rosters, setRosters] = useState<TeamRoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTeams() {
      try {
        const [teamData, rosterData] = await Promise.all([
          apiFetch<Team[]>("/teams"),
          apiFetch<TeamRoster[]>("/team-rosters"),
        ]);

        if (!cancelled) {
          setTeams(teamData);
          setRosters(rosterData);
        }
      } catch (err) {
        console.error("Failed to load teams:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTeams();

    return () => {
      cancelled = true;
    };
  }, []);

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

      {loading ? (
        <p className="mt-8 text-sm text-[var(--muted)]">
          Loading teams...
        </p>
      ) : error ? (
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
