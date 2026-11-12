
import Navbar from "@/components/layout/navbar";
import TournamentCard from "@/components/ui/TournamentCard";
import { apiFetch } from "@/lib/api";

export const instant = false;

interface Tournament {
  tournamentId: number;
  tournamentName: string;
  gameName: string;
  prizePool: number;
  startDate: string;
  endDate: string;
  status: string;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

function formatPrize(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function TournamentsPage() {
  let tournaments: Tournament[] = [];
  let error = false;

  try {
    tournaments = await apiFetch<Tournament[]>("/tournaments");
  } catch (err) {
    console.error("Failed to fetch tournaments:", err);
    error = true;
  }

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
              LIVE TOURNAMENT DATA
            </p>
          </div>

          <span className="text-sm text-[var(--muted)]">
            {tournaments.length.toString().padStart(2, "0")} EVENTS
          </span>
        </div>

        {error ? (
          <p className="mt-8 text-sm text-red-400">
            Unable to load tournaments. Please try again later.
          </p>
        ) : tournaments.length === 0 ? (
          <p className="mt-8 text-sm text-[var(--muted)]">
            No tournaments available.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.tournamentId}
                id={String(tournament.tournamentId)}
                name={tournament.tournamentName}
                game={tournament.gameName}
                prize={formatPrize(tournament.prizePool)}
                dates={`${formatDate(tournament.startDate)} — ${formatDate(tournament.endDate)}`}
                status={tournament.status}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
