
import Navbar from "@/components/layout/navbar";
import { apiFetch } from "@/lib/api";

export const instant = false;

interface LeaderboardPlayer {
  playerId: number;
  playerName: string;
  teamName: string;
  totalKills: number;
  totalDamage: number;
  totalAssists: number;
}

function LeaderboardTable({
  title,
  players,
  metric,
}: {
  title: string;
  players: LeaderboardPlayer[];
  metric: "totalKills" | "totalDamage" | "totalAssists";
}) {
  return (
    <div className="mt-12">
      <div className="mb-5 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h2 className="font-bold">{title}</h2>
        <span className="text-xs text-[var(--muted)]">
          {players.length.toString().padStart(2, "0")} PLAYERS
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-[var(--surface)] text-xs text-[var(--muted)]">
            <tr>
              <th className="px-5 py-4">RANK</th>
              <th className="px-5 py-4">PLAYER</th>
              <th className="px-5 py-4">TEAM</th>
              <th className="px-5 py-4">KILLS</th>
              <th className="px-5 py-4">DAMAGE</th>
              <th className="px-5 py-4">ASSISTS</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player, index) => (
              <tr
                key={player.playerId}
                className="border-t border-[var(--border)] transition hover:bg-[var(--surface)]"
              >
                <td className="px-5 py-5 font-bold text-[var(--accent)]">
                  #{index + 1}
                </td>
                <td className="px-5 py-5 font-semibold">
                  {player.playerName}
                </td>
                <td className="px-5 py-5 text-[var(--muted)]">
                  {player.teamName}
                </td>
                <td className={`px-5 py-5 ${metric === "totalKills" ? "font-bold text-[var(--accent)]" : ""}`}>
                  {player.totalKills}
                </td>
                <td className={`px-5 py-5 ${metric === "totalDamage" ? "font-bold text-[var(--accent)]" : ""}`}>
                  {player.totalDamage.toLocaleString("en-IN")}
                </td>
                <td className={`px-5 py-5 ${metric === "totalAssists" ? "font-bold text-[var(--accent)]" : ""}`}>
                  {player.totalAssists}
                </td>
              </tr>
            ))}

            {players.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-[var(--muted)]">
                  No player records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function LeaderboardPage() {
  let kills: LeaderboardPlayer[] = [];
  let damage: LeaderboardPlayer[] = [];
  let assists: LeaderboardPlayer[] = [];
  let error = false;

  try {
    [kills, damage, assists] = await Promise.all([
      apiFetch<LeaderboardPlayer[]>("/leaderboards/top-kills"),
      apiFetch<LeaderboardPlayer[]>("/leaderboards/top-damage"),
      apiFetch<LeaderboardPlayer[]>("/leaderboards/top-assists"),
    ]);
  } catch (err) {
    console.error("Failed to load leaderboards:", err);
    error = true;
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="px-6 py-16 md:px-12">
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[var(--accent)]">
          PERFORMANCE RANKINGS
        </p>

        <h1 className="text-4xl font-black md:text-5xl">
          LEADERBOARD
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Track individual player performance and discover the
          top competitors across completed tournament matches.
        </p>

        {error ? (
          <p className="mt-10 text-sm text-red-400">
            Unable to load leaderboards. Please try again later.
          </p>
        ) : (
          <>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <h2 className="font-bold">TOP PERFORMING PLAYERS</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  LIVE RANKINGS FROM MATCH PERFORMANCE DATA
                </p>
              </div>

              <span className="w-fit rounded-md border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--accent)]">
                ALL GAMES
              </span>
            </div>

            <LeaderboardTable
              title="TOP KILLS"
              players={kills}
              metric="totalKills"
            />

            <LeaderboardTable
              title="TOP DAMAGE"
              players={damage}
              metric="totalDamage"
            />

            <LeaderboardTable
              title="TOP ASSISTS"
              players={assists}
              metric="totalAssists"
            />
          </>
        )}
      </section>
    </main>
  );
}
