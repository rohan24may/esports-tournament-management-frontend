
import Navbar from "@/components/layout/navbar";
import PlayerCard from "@/components/ui/PlayerCard";

const players = [
  { name: "Aarav Sharma", country: "India", game: "BGMI", inGameId: "BGMI_1" },
  { name: "Vihaan Patel", country: "India", game: "BGMI", inGameId: "BGMI_2" },
  { name: "Arjun Singh", country: "India", game: "BGMI", inGameId: "BGMI_3" },
  { name: "Reyansh Kumar", country: "India", game: "BGMI", inGameId: "BGMI_4" },
  { name: "Aditya Verma", country: "India", game: "BGMI", inGameId: "BGMI_5" },
  { name: "Kabir Mehta", country: "India", game: "BGMI", inGameId: "BGMI_6" },
  { name: "Ishaan Gupta", country: "India", game: "BGMI", inGameId: "BGMI_7" },
  { name: "Rohan Malhotra", country: "India", game: "BGMI", inGameId: "BGMI_8" },
  { name: "Dev Shah", country: "India", game: "BGMI", inGameId: "BGMI_9" },
  { name: "Krish Jain", country: "India", game: "BGMI", inGameId: "BGMI_10" },
];

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

        <div className="mt-12 flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="font-bold">ALL PLAYERS</h2>

          <span className="text-sm text-[var(--muted)]">
            {players.length.toString().padStart(2, "0")} PLAYERS
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {players.map((player) => (
            <PlayerCard
              key={player.name}
              name={player.name}
              country={player.country}
              game={player.game}
              inGameId={player.inGameId}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
