
type StatCardProps = {
  label: string;
  value: string;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
      <p className="text-3xl font-black text-white md:text-4xl">
        {value}
      </p>

      <p className="mt-3 text-xs font-semibold tracking-wider text-[var(--muted)]">
        {label}
      </p>
    </div>
  );
}
