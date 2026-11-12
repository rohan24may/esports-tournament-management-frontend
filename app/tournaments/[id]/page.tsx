
import Navbar from "@/components/layout/navbar";
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

interface TournamentMatch {
  matchId: number;
  matchNumber: number;
  mapName: string;
  scheduledAt: string;
  status: string;
  participatingTeams: number;
}

interface Standing {
  teamId: number;
  teamName: string;
  matchesPlayed: number;
  totalPoints: number;
  averagePlacement: number;
  bestPlacement: number;
}

interface PrizeSummary {
  totalPrizeDistributed: number;
  teamsAwarded: number;
  awards: {
    teamName?: string;
    amount?: number;
    placement?: number;
  }[];
}

function formatPrize(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function TournamentDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournamentId = Number(id);

  if (!Number.isInteger(tournamentId) || tournamentId <= 0) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="px-6 py-24 text-center">
          <h1 className="text-3xl font-bold">Tournament Not Found</h1>
        </div>
      </main>
    );
  }

  let tournament: Tournament | undefined;
  let matches: TournamentMatch[] = [];
  let standings: Standing[] = [];
  let prizes: PrizeSummary | null = null;
  let error = false;

  try {
    const [allTournaments, matchData, standingData, prizeData] =
      await Promise.all([
        apiFetch<Tournament[]>("/tournaments"),
        apiFetch<TournamentMatch[]>(
          `/analytics/tournaments/${tournamentId}/matches`
        ),
        apiFetch<Standing[]>(
          `/analytics/tournaments/${tournamentId}/standings`
        ),
        apiFetch<PrizeSummary>(
          `/analytics/tournaments/${tournamentId}/prizes`
        ),
      ]);

    tournament = allTournaments.find(
      (item) => item.tournamentId === tournamentId
    );

    matches = matchData;
    standings = standingData;
    prizes = prizeData;
  } catch (err) {
    console.error("Failed to load tournament details:", err);
    error = true;
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {error ? (
        <div className="px-6 py-24 text-center">
          <h1 className="text-3xl font-bold">Unable to Load Tournament</h1>
          <p className="mt-3 text-[var(--muted)]">
            Please try again later.
          </p>
        </div>
      ) : !tournament ? (
        <div className="px-6 py-24 text-center">
          <h1 className="text-3xl font-bold">Tournament Not Found</h1>
          <p className="mt-3 text-[var(--muted)]">
            We couldn't find this tournament.
          </p>
        </div>
      ) : (
        <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
          <p className="text-sm font-semibold tracking-widest text-[var(--accent)]">
            TOURNAMENT DETAILS
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            {tournament.tournamentName}
          </h1>

          <p className="mt-4 text-[var(--muted)]">
            {tournament.gameName} · {tournament.status}
          </p>

          {/* Overview */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "GAME", value: tournament.gameName },
              { label: "PRIZE POOL", value: formatPrize(tournament.prizePool) },
              {
                label: "DATES",
                value: `${formatDate(tournament.startDate)} – ${formatDate(tournament.endDate)}`,
              },
              { label: "STATUS", value: tournament.status },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <p className="text-sm text-[var(--muted)]">{item.label}</p>
                <h2 className="mt-2 text-xl font-bold text-[var(--accent)]">
                  {item.value}
                </h2>
              </div>
            ))}
          </div>

          {/* Matches */}
          <div className="mt-16">
            <h2 className="text-2xl font-black">TOURNAMENT MATCHES</h2>

            <div className="mt-6 space-y-3">
              {matches.length ? matches.map((match) => (
                <div
                  key={match.matchId}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <div>
                    <h3 className="font-bold">
                      Match {match.matchNumber} · {match.mapName}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {match.scheduledAt.replace("T", " ")}
                      {" · "}
                      {match.participatingTeams} teams
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[var(--accent)]">
                    {match.status}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-[var(--muted)]">
                  No matches available.
                </p>
              )}
            </div>
          </div>

          {/* Standings */}
          <div className="mt-16">
            <h2 className="text-2xl font-black">TEAM STANDINGS</h2>

            <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--border)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--surface)] text-[var(--muted)]">
                  <tr>
                    <th className="p-4">TEAM</th>
                    <th className="p-4">PLAYED</th>
                    <th className="p-4">POINTS</th>
                    <th className="p-4">AVG. PLACEMENT</th>
                    <th className="p-4">BEST</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team) => (
                    <tr
                      key={team.teamId}
                      className="border-t border-[var(--border)]"
                    >
                      <td className="p-4 font-bold">{team.teamName}</td>
                      <td className="p-4">{team.matchesPlayed}</td>
                      <td className="p-4 text-[var(--accent)]">
                        {team.totalPoints}
                      </td>
                      <td className="p-4">{team.averagePlacement}</td>
                      <td className="p-4">{team.bestPlacement}</td>
                    </tr>
                  ))}
                  {!standings.length && (
                    <tr>
                      <td colSpan={5} className="p-4 text-[var(--muted)]">
                        No standings available yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prize Distribution */}
          <div className="mt-16 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-2xl font-black">PRIZE DISTRIBUTION</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-[var(--muted)]">
                  TOTAL PRIZE DISTRIBUTED
                </p>
                <p className="mt-2 text-2xl font-black text-[var(--accent)]">
                  {formatPrize(prizes?.totalPrizeDistributed ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">TEAMS AWARDED</p>
                <p className="mt-2 text-2xl font-black">
                  {prizes?.teamsAwarded ?? 0}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
