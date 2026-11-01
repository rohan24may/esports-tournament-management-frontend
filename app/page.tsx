
import Navbar from "@/components/layout/navbar";
import StatCard from "@/components/ui/StatCard";
import TournamentCard from "@/components/ui/TournamentCard";


const stats = [
  { label: "TOURNAMENTS", value: "02" },
  { label: "REGISTERED TEAMS", value: "03" },
  { label: "PLAYERS", value: "10" },
  { label: "GAMES", value: "02" },
];

const tournaments = [
  {
    id: "1",
    name: "BGMI Championship 2026",
    game: "BGMI",
    prize: "₹1,00,000",
    dates: "20 OCT — 22 OCT 2026",
    status: "UPCOMING",
  },
  {
    id: "2",
    name: "Valorant Cup 2026",
    game: "Valorant",
    prize: "₹50,000",
    dates: "25 OCT — 27 OCT 2026",
    status: "UPCOMING",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
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

      {/* Platform Statistics */}

{/* Platform Statistics */}
<section id="statistics" className="px-6 pb-20 md:px-12">
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {stats.map((stat) => (
      <StatCard
        key={stat.label}
        label={stat.label}
        value={stat.value}
      />
    ))}
  </div>
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

  <div className="grid gap-5 md:grid-cols-2">
{tournaments.map((tournament) => (
  <TournamentCard
    key={tournament.id}
    id={tournament.id}
    name={tournament.name}
    game={tournament.game}
    prize={tournament.prize}
    dates={tournament.dates}
    status={tournament.status}
  />
))}
  </div>
</section>


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
