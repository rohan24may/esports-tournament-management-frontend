
import Navbar from "@/components/layout/navbar";
import TeamCard from "@/components/ui/TeamCard";

const teams = [
  {
    name: "Phoenix BGMI",
    game: "BGMI",
    organization: "Phoenix Esports",
    players: 6,
  },
  {
    name: "Tigers BGMI",
    game: "BGMI",
    organization: "Tiger Gaming",
    players: 4,
  },
  {
    name: "Phoenix Valorant",
    game: "Valorant",
    organization: "Phoenix Esports",
    players: 4,
  },
];

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

        <div className="mt-12 flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="font-bold">ALL TEAMS</h2>

          <span className="text-sm text-[var(--muted)]">
            {teams.length.toString().padStart(2, "0")} TEAMS
          </span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard
              key={team.name}
              name={team.name}
              game={team.game}
              organization={team.organization}
              players={team.players}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
