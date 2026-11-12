
import Navbar from "@/components/layout/navbar";
import PlayerCard from "@/components/ui/PlayerCard";
import { apiFetch } from "@/lib/api";

export const instant = false;

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

export default async function PlayersPage() {
  let players: Player[] = [];
  let profiles: PlayerGameProfile[] = [];
  let error = false;

  try {
    [players, profiles] = await Promise.all([
      apiFetch<Player[]>("/players"),
      apiFetch<PlayerGameProfile[]>("/player-game-profiles"),
    ]);
  } catch (err) {
    console.error("Failed to load players:", err);
    error = true;
  }

  const playerProfiles = players.flatMap((player) => {
    const gameProfiles = profiles.filter(
      (profile) => profile.playerId === player.playerId
    );

    if (gameProfiles.length === 0) {
      return [{
        key: `player-${player.playerId}`,
        name: player.playerName,
        country: player.country,
        game: "No Game Profile",
        inGameId: "—",
      }];
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
    <main className="min-h-screen">
      <Navbar />

      <section className="px-6 py-16 md:px-12">
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[var(--accent)]">
          THE COMPETITORS
        </p>

        <h1 className="text-4xl font-black md:text-5xl">
          PLAYERS
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Discover esports players, explore their game profiles
          and follow their competitive journey.
        </p>

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

        {error ? (
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
      </section>
    </main>
  );
}
