
import Navbar from "@/components/layout/navbar";

const overviewStats = [
  { label: "COMPLETED MATCHES", value: "—" },
  { label: "PARTICIPATING TEAMS", value: "—" },
  { label: "PLAYER KILLS", value: "—" },
  { label: "TOTAL DAMAGE", value: "—" },
];

const analyticsSections = [
  {
    number: "01",
    title: "Team Standings",
    description:
      "Compare teams using match wins, total points and average placement.",
    source: "team_standings.sql",
  },
  {
    number: "02",
    title: "Player Performance",
    description:
      "Explore kills, assists, damage and survival time across matches.",
    source: "player_leaderboard.sql",
  },
  {
    number: "03",
    title: "Player Consistency",
    description:
      "Compare average kills and damage per completed match.",
    source: "player_consistency_analysis.sql",
  },
  {
    number: "04",
    title: "Map Analysis",
    description:
      "Analyze match counts, kills, assists and damage across maps.",
    source: "map_performance_analysis.sql",
  },
  {
    number: "05",
    title: "Team Comparison",
    description:
      "Compare match wins, points, kills, assists and damage.",
    source: "team_comparison.sql",
  },
  {
    number: "06",
    title: "Tournament Rankings",
    description:
      "View team rankings across tournaments using performance metrics.",
    source: "tournament_team_rankings.sql",
  },
];

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
          and discover insights from competitive matches.
        </p>

        {/* Overview */}
        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold">TOURNAMENT OVERVIEW</h2>
            <span className="text-xs text-[var(--muted)]">
              LIVE DATA — COMING SOON
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {overviewStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <p className="text-3xl font-black text-white md:text-4xl">
                  {stat.value}
                </p>

                <p className="mt-3 text-xs font-semibold tracking-wider text-[var(--muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics sections */}
        <div className="mt-16">
          <div className="mb-6 border-b border-[var(--border)] pb-4">
            <h2 className="font-bold">PERFORMANCE INSIGHTS</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Explore different dimensions of competitive performance.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {analyticsSections.map((section) => (
              <div
                key={section.number}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]"
              >
                <p className="text-sm font-bold text-[var(--accent)]">
                  {section.number}
                </p>

                <h3 className="mt-6 text-xl font-bold">
                  {section.title}
                </h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">
                  {section.description}
                </p>

                <p className="mt-6 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
                  SQL: {section.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
