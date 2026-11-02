
import Navbar from "@/components/layout/navbar";
import TournamentCard from "@/components/ui/TournamentCard";

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

export default function TournamentsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="px-6 py-16 md:px-12">
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[var(--accent)]">
          COMPETE & CONQUER
        </p>

        <h1 className="text-4xl font-black md:text-5xl">
          TOURNAMENTS
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Explore competitive events, discover upcoming tournaments
          and track prize pools across different games.
        </p>

<div className="mt-12 flex flex-col gap-2 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h2 className="font-bold">ALL TOURNAMENTS</h2>
    <p className="mt-1 text-xs text-[var(--muted)]">
      DEMO DATA — SAMPLE TOURNAMENTS FOR UI PREVIEW
    </p>
  </div>

  <span className="text-sm text-[var(--muted)]">
    {tournaments.length.toString().padStart(2, "0")} SAMPLE EVENTS
  </span>
</div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
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
    </main>
  );
}
