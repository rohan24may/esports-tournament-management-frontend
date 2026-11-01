
type TournamentCardProps = {
  name: string;
  game: string;
  prize: string;
  dates: string;
  status: string;
};

export default function TournamentCard({
  name,
  game,
  prize,
  dates,
  status,
}: TournamentCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-7 transition hover:border-[var(--accent)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-[var(--accent)]">
          {game}
        </span>

        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
          {status}
        </span>
      </div>

      <h3 className="mt-8 text-2xl font-bold">{name}</h3>

      <div className="mt-8 flex items-end justify-between border-t border-[var(--border)] pt-5">
        <div>
          <p className="text-xs text-[var(--muted)]">PRIZE POOL</p>
          <p className="mt-1 text-2xl font-black text-[var(--accent)]">
            {prize}
          </p>
        </div>

        <p className="text-right text-xs text-[var(--muted)]">
          {dates}
        </p>
      </div>
    </div>
  );
}
