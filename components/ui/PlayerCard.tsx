
type PlayerCardProps = {
  name: string;
  country: string;
  game: string;
  inGameId: string;
};

export default function PlayerCard({
  name,
  country,
  game,
  inGameId,
}: PlayerCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-[var(--accent)]">
          {game}
        </span>

        <span className="text-xs text-[var(--muted)]">
          {country}
        </span>
      </div>

      <h3 className="mt-8 text-2xl font-bold">{name}</h3>

      <div className="mt-6 border-t border-[var(--border)] pt-4">
        <p className="text-xs text-[var(--muted)]">IN-GAME ID</p>
        <p className="mt-1 font-semibold">{inGameId}</p>
      </div>
    </div>
  );
}
