
"use client";

import { useEffect, useState } from "react";
import PlayerCard from "@/components/ui/PlayerCard";
import { apiFetch } from "@/lib/api";

interface Player {
  playerId: number;
  playerName: string;
  country: string;
  dateOfBirth: string;
}

interface PlayerGameProfile {
  profileId: number;
  playerId: number;
  gameName: string;
  inGameId: string;
}

export default function PlayersContent() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [profiles, setProfiles] = useState<PlayerGameProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPlayers() {
      try {
        const [playerData, profileData] = await Promise.all([
          apiFetch<Player[]>("/players"),
          apiFetch<PlayerGameProfile[]>("/player-game-profiles"),
        ]);

        if (!cancelled) {
          setPlayers(playerData);
          setProfiles(profileData);
        }
      } catch (err) {
        console.error("Failed to load players:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPlayers();

    return () => {
      cancelled = true;
    };
  }, []);

  const playerProfiles = players.flatMap((player) => {
    const gameProfiles = profiles.filter(
      (profile) => profile.playerId === player.playerId
    );

    if (gameProfiles.length === 0) {
      return [
        {
          key: `player-${player.playerId}`,
          name: player.playerName,
          country: player.country,
          game: "No Game Profile",
          inGameId: "—",
        },
      ];
    }

    return gameProfiles.map((profile) => ({
      key: String(profile.profileId),
      name: player.playerName,
      country: player.country,
      game: profile.gameName,
      inGameId: profile.inGameId,
    }));
  });

  return (
    <>
      <div className="mt-12 flex flex-col gap-2 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold">ALL PLAYERS</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            LIVE PLAYER DATA · {profiles.length} GAME PROFILES
          </p>
        </div>

        <span className="text-sm text-[var(--muted)]">
          {players.length.toString().padStart(2, "0")} PLAYERS
        </span>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-[var(--muted)]">
          Loading players...
        </p>
      ) : error ? (
        <p className="mt-8 text-sm text-red-400">
          Unable to load players. Please try again later.
        </p>
      ) : playerProfiles.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--muted)]">
          No players available.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playerProfiles.map((player) => (
            <PlayerCard
              key={player.key}
              name={player.name}
              country={player.country}
              game={player.game}
              inGameId={player.inGameId}
            />
          ))}
        </div>
      )}
    </>
  );
}
