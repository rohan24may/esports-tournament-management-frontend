
import Navbar from "@/components/layout/navbar";

const leaderboard = [
  { rank: 1, name: "Player One", team: "Phoenix BGMI", matches: 5, kills: 32, damage: 6450, assists: 12 },
  { rank: 2, name: "Player Two", team: "Tigers BGMI", matches: 5, kills: 28, damage: 5900, assists: 10 },
  { rank: 3, name: "Player Three", team: "Phoenix BGMI", matches: 5, kills: 25, damage: 5400, assists: 9 },
  { rank: 4, name: "Player Four", team: "Tigers BGMI", matches: 4, kills: 21, damage: 4800, assists: 8 },
  { rank: 5, name: "Player Five", team: "Phoenix BGMI", matches: 4, kills: 18, damage: 4200, assists: 7 },
];

export default function LeaderboardPage() {
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

        <div className="mt-12 flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="font-bold">TOP PERFORMING PLAYERS</h2>
          <span className="text-sm text-[var(--muted)]">BGMI</span>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-[var(--surface)] text-xs text-[var(--muted)]">
              <tr>
                <th className="px-5 py-4">RANK</th>
                <th className="px-5 py-4">PLAYER</th>
                <th className="px-5 py-4">TEAM</th>
                <th className="px-5 py-4">MATCHES</th>
                <th className="px-5 py-4">KILLS</th>
                <th className="px-5 py-4">DAMAGE</th>
                <th className="px-5 py-4">ASSISTS</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((player) => (
                <tr
                  key={player.rank}
                  className="border-t border-[var(--border)] transition hover:bg-[var(--surface)]"
                >
                  <td className="px-5 py-5 font-bold text-[var(--accent)]">
                    #{player.rank}
                  </td>
                  <td className="px-5 py-5 font-semibold">
                    {player.name}
                  </td>
                  <td className="px-5 py-5 text-[var(--muted)]">
                    {player.team}
                  </td>
                  <td className="px-5 py-5">{player.matches}</td>
                  <td className="px-5 py-5 font-bold">{player.kills}</td>
                  <td className="px-5 py-5">{player.damage.toLocaleString()}</td>
                  <td className="px-5 py-5">{player.assists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-[var(--muted)]">
          Rankings are based on kills, followed by damage and assists.
        </p>
      </section>
    </main>
  );
}
