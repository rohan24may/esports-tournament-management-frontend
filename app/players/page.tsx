
import Navbar from "@/components/layout/navbar";
import PlayersContent from "./players-content";

export default function PlayersPage() {
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

        <PlayersContent />
      </section>
    </main>
  );
}
