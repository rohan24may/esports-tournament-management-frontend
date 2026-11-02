
import { Suspense } from "react";
import Navbar from "@/components/layout/navbar";

const tournaments = [
  {
    id: "1",
    name: "BGMI Championship 2026",
    game: "Battlegrounds Mobile India",
    prize: "₹100,000",
    dates: "October 20–22, 2026",
    status: "Upcoming",
    description:
      "A competitive BGMI tournament featuring registered esports teams.",
  },
{
  id: "2",
  name: "Valorant Cup 2026",
  game: "Valorant",
  prize: "₹50,000",
  dates: "October 25–27, 2026",
  status: "Upcoming",
  description:
    "A competitive Valorant tournament featuring registered esports teams.",
},
];

export default function TournamentDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Suspense fallback={<div className="h-16 border-b border-[var(--border)]" />}>
        <Navbar />
      </Suspense>

      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-6 py-16 text-[var(--muted)]">
            Loading tournament...
          </div>
        }
      >
        <TournamentContent params={params} />
      </Suspense>
    </main>
  );
}

async function TournamentContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournament = tournaments.find((item) => item.id === id);

  if (!tournament) {
    return (
      <div className="px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Tournament Not Found</h1>
        <p className="mt-3 text-[var(--muted)]">
          We couldn't find this tournament.
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
<div className="flex flex-wrap items-center gap-3">
  <p className="text-sm font-semibold tracking-widest text-[var(--accent)]">
    TOURNAMENT DETAILS
  </p>

  <span className="rounded border border-[var(--border)] px-2 py-1 text-[10px] font-semibold tracking-wider text-[var(--muted)]">
    DEMO DATA
  </span>
</div>
      <h1 className="mt-4 text-4xl font-black md:text-6xl">
        {tournament.name}
      </h1>

      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        {tournament.description}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--muted)]">Game</p>
          <h2 className="mt-2 text-xl font-bold">{tournament.game}</h2>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--muted)]">Prize Pool</p>
          <h2 className="mt-2 text-xl font-bold text-[var(--accent)]">
            {tournament.prize}
          </h2>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--muted)]">Dates</p>
          <h2 className="mt-2 text-xl font-bold">{tournament.dates}</h2>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--muted)]">Status</p>
          <h2 className="mt-2 text-xl font-bold text-[var(--accent)]">
            {tournament.status}
          </h2>
        </div>
      </div>
    </section>
  );
}
