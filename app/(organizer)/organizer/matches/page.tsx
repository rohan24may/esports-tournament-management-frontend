
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Tournament {
  tournamentId: number;
  tournamentName: string;
}

interface Registration {
  registrationId: number;
  tournamentId: number;
  tournamentName: string;
  teamId: number;
  teamName: string;
  registrationDate: string;
  seed: number | null;
  status: string;
}

interface MatchRecord {
  matchId: number;
  tournamentId: number;
  tournamentName: string;
  matchNumber: number;
  mapName: string;
  scheduledAt: string | null;
  status: string;
}

interface MatchTeam {
  matchTeamId: number;
  matchId: number;
  matchNumber: number;
  teamId: number;
  teamName: string;
  placement: number | null;
  totalPoints: number | null;
}

interface RosterEntry {
  rosterId: number;
  teamId: number;
  playerId: number;
  status: string;
}

interface Player {
  playerId: number;
  playerName: string;
}

interface SquadPlayer {
  matchSquadPlayerId: number;
  matchId: number;
  matchTeamId: number;
  teamId: number;
  teamName: string;
  playerId: number;
  playerName: string;
}

interface Performance {
  performanceId: number;
  matchSquadPlayerId: number;
  kills: number;
  damage: number;
  survivalTimeSeconds: number | null;
  assists: number;
}

interface TeamDetail {
  matchTeam: MatchTeam;
  roster: RosterEntry[];
  squad: SquadPlayer[];
}

interface ResultForm {
  placement: string;
  totalPoints: string;
}

interface PerformanceForm {
  performanceId?: number;
  kills: string;
  damage: string;
  survivalTimeSeconds: string;
  assists: string;
}

const emptyMatchForm = {
  tournamentId: "",
  matchNumber: "1",
  mapName: "",
  scheduledDate: "",
  scheduledTime: "18:00",
};

export default function OrganizerMatchesPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const [form, setForm] = useState(emptyMatchForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);
  const [teamDetails, setTeamDetails] = useState<TeamDetail[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, ResultForm>>({});
  const [performances, setPerformances] = useState<Record<number, PerformanceForm>>({});

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    const [tournamentData, registrationData, matchData, playerData] =
      await Promise.all([
        apiFetch<Tournament[]>("/tournaments"),
        apiFetch<Registration[]>("/tournament-registrations"),
        apiFetch<MatchRecord[]>("/matches"),
        apiFetch<Player[]>("/players"),
      ]);

    setTournaments(tournamentData);
    setRegistrations(registrationData);
    setMatches(matchData);
    setPlayers(playerData);
  }, []);

  useEffect(() => {
    loadData()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load matches.")
      )
      .finally(() => setLoading(false));
  }, [loadData]);

  async function openMatchWorkspace(match: MatchRecord) {
    setSelectedMatch(match);
    setError("");
    setNotice("");
    setWorkspaceLoading(true);
    setTeamDetails([]);

    try {
      const matchTeams = await apiFetch<MatchTeam[]>(
        `/match-teams/match/${match.matchId}`
      );

      const [details, performanceData] = await Promise.all([
        Promise.all(
          matchTeams.map(async (matchTeam) => {
            const [roster, squad] = await Promise.all([
              apiFetch<RosterEntry[]>(
                `/team-rosters/team/${matchTeam.teamId}/active`
              ),
              apiFetch<SquadPlayer[]>(
                `/match-squad-players/match-team/${matchTeam.matchTeamId}`
              ),
            ]);

            return { matchTeam, roster, squad };
          })
        ),
        apiFetch<Performance[]>(`/player-performances/match/${match.matchId}`),
      ]);

      setTeamDetails(details);

      const resultForms: Record<number, ResultForm> = {};
      details.forEach(({ matchTeam }) => {
        resultForms[matchTeam.matchTeamId] = {
          placement: matchTeam.placement == null ? "" : String(matchTeam.placement),
          totalPoints: matchTeam.totalPoints == null ? "" : String(matchTeam.totalPoints),
        };
      });
      setResults(resultForms);

      const performanceForms: Record<number, PerformanceForm> = {};
      details.forEach(({ squad }) => {
        squad.forEach((player) => {
          const existing = performanceData.find(
            (item) => item.matchSquadPlayerId === player.matchSquadPlayerId
          );

          performanceForms[player.matchSquadPlayerId] = {
            performanceId: existing?.performanceId,
            kills: existing ? String(existing.kills) : "0",
            damage: existing ? String(existing.damage) : "0",
            survivalTimeSeconds:
              existing?.survivalTimeSeconds == null
                ? ""
                : String(existing.survivalTimeSeconds),
            assists: existing ? String(existing.assists) : "0",
          };
        });
      });
      setPerformances(performanceForms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load match details.");
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function refreshWorkspace() {
    if (!selectedMatch) return;

    await loadData();

    const refreshed = await apiFetch<MatchRecord[]>("/matches");
    const current = refreshed.find(
      (item) => item.matchId === selectedMatch.matchId
    );

    if (current) {
      await openMatchWorkspace(current);
    } else {
      setSelectedMatch(null);
    }
  }

  async function createMatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.tournamentId || !form.mapName.trim()) {
      setError("Select a tournament and enter a map name.");
      return;
    }

    setSaving(true);

    try {
      await apiFetch<MatchRecord>("/matches", {
        method: "POST",
        body: JSON.stringify({
          tournamentId: Number(form.tournamentId),
          matchNumber: Number(form.matchNumber),
          mapName: form.mapName.trim(),
          scheduledAt: `${form.scheduledDate}T${form.scheduledTime}:00`,
        }),
      });

      setNotice("Match scheduled successfully.");
      setForm(emptyMatchForm);
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create match.");
    } finally {
      setSaving(false);
    }
  }

  const eligibleRegistrations = selectedMatch
    ? registrations.filter(
        (registration) =>
          registration.tournamentId === selectedMatch.tournamentId &&
          registration.status.toUpperCase() !== "WITHDRAWN" &&
          !teamDetails.some(
            (detail) => detail.matchTeam.teamId === registration.teamId
          )
      )
    : [];

  async function addTeamToMatch() {
    if (!selectedMatch || !selectedTeamId) return;

    setError("");
    setNotice("");

    try {
      await apiFetch<MatchTeam>("/match-teams", {
        method: "POST",
        body: JSON.stringify({
          matchId: selectedMatch.matchId,
          teamId: Number(selectedTeamId),
        }),
      });

      setSelectedTeamId("");
      setNotice("Team added to the match.");
      await openMatchWorkspace(selectedMatch);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add team.");
    }
  }

  async function addPlayer(matchTeam: MatchTeam) {
    const playerId = selectedPlayers[matchTeam.teamId];
    if (!playerId) return;

    setError("");
    setNotice("");

    try {
      await apiFetch<SquadPlayer>("/match-squad-players", {
        method: "POST",
        body: JSON.stringify({
          matchTeamId: matchTeam.matchTeamId,
          playerId: Number(playerId),
        }),
      });

      setSelectedPlayers((current) => ({
        ...current,
        [matchTeam.teamId]: "",
      }));

      setNotice("Player added to the match squad.");
      await openMatchWorkspace(selectedMatch!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add player.");
    }
  }

  async function removePlayer(squadPlayer: SquadPlayer) {
    if (!window.confirm(`Remove ${squadPlayer.playerName} from this match?`)) {
      return;
    }

    try {
      await apiFetch<void>(
        `/match-squad-players/${squadPlayer.matchSquadPlayerId}`,
        { method: "DELETE" }
      );

      setNotice("Player removed from the match squad.");
      await openMatchWorkspace(selectedMatch!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove player.");
    }
  }

  async function saveTeamResult(matchTeam: MatchTeam) {
    const value = results[matchTeam.matchTeamId];

    if (!value?.placement || value.totalPoints === "") {
      setError("Enter both placement and total points.");
      return;
    }

    try {
      await apiFetch<void>(`/match-results/${matchTeam.matchTeamId}`, {
        method: "PUT",
        body: JSON.stringify({
          placement: Number(value.placement),
          totalPoints: Number(value.totalPoints),
        }),
      });

      setNotice(`Result saved for ${matchTeam.teamName}.`);
      await openMatchWorkspace(selectedMatch!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save result.");
    }
  }

  async function savePlayerPerformance(player: SquadPlayer) {
    const value = performances[player.matchSquadPlayerId];

    if (!value) return;

    const payload = {
      matchSquadPlayerId: player.matchSquadPlayerId,
      kills: Number(value.kills),
      damage: Number(value.damage),
      survivalTimeSeconds:
        value.survivalTimeSeconds === ""
          ? null
          : Number(value.survivalTimeSeconds),
      assists: Number(value.assists),
    };

    try {
      if (value.performanceId) {
        await apiFetch<void>(`/player-performances/${value.performanceId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch<{ performanceId: number }>("/player-performances", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setNotice(`Performance saved for ${player.playerName}.`);
      await openMatchWorkspace(selectedMatch!);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save player performance."
      );
    }
  }

  async function startMatch() {
    if (!selectedMatch) return;

    if (
      teamDetails.length < 2 ||
      teamDetails.some((detail) => detail.squad.length !== 4)
    ) {
      setError("Add at least two teams and assign exactly four players to each team before starting.");
      return;
    }

    try {
      await apiFetch<MatchRecord>(`/matches/${selectedMatch.matchId}`, {
        method: "PUT",
        body: JSON.stringify({
          tournamentId: selectedMatch.tournamentId,
          matchNumber: selectedMatch.matchNumber,
          mapName: selectedMatch.mapName,
          scheduledAt: selectedMatch.scheduledAt,
          status: "ONGOING",
        }),
      });

      setNotice("Match started.");
      await refreshWorkspace();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start match.");
    }
  }

  async function completeMatch() {
    if (!selectedMatch) return;

    const allResultsSaved =
      teamDetails.length > 0 &&
      teamDetails.every((detail) => {
        const value = results[detail.matchTeam.matchTeamId];
        return value?.placement !== "" && value?.totalPoints !== "";
      });

    const allPerformancesSaved = teamDetails.every((detail) =>
      detail.squad.every(
        (player) => !!performances[player.matchSquadPlayerId]?.performanceId
      )
    );

    if (!allResultsSaved || !allPerformancesSaved) {
      setError("Save placements, points and performance stats for every assigned player before completing the match.");
      return;
    }

    try {
      await apiFetch<MatchRecord>(
        `/matches/${selectedMatch.matchId}/complete`,
        { method: "PUT" }
      );

      setNotice("Match completed successfully.");
      await refreshWorkspace();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete match.");
    }
  }

  async function deleteMatch(match: MatchRecord) {
    if (!window.confirm(`Delete Match ${match.matchNumber} - ${match.tournamentName}?`)) {
      return;
    }

    try {
      await apiFetch<void>(`/matches/${match.matchId}`, {
        method: "DELETE",
      });

      if (selectedMatch?.matchId === match.matchId) {
        setSelectedMatch(null);
        setTeamDetails([]);
      }

      setNotice("Match deleted.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete match.");
    }
  }

  function updateResult(
    matchTeamId: number,
    field: keyof ResultForm,
    value: string
  ) {
    setResults((current) => ({
      ...current,
      [matchTeamId]: {
        ...current[matchTeamId],
        [field]: value,
      },
    }));
  }

  function updatePerformance(
    squadPlayerId: number,
    field: keyof PerformanceForm,
    value: string
  ) {
    setPerformances((current) => ({
      ...current,
      [squadPlayerId]: {
        ...current[squadPlayerId],
        [field]: value,
      },
    }));
  }

  const isScheduled = selectedMatch?.status === "SCHEDULED";
  const isOngoing = selectedMatch?.status === "ONGOING";

  return (
    <div className="min-h-screen bg-[#090b0e] text-white">
      <header className="h-20 border-b border-[#252b33] flex items-center justify-between px-6 md:px-10">
        <Link href="/organizer/dashboard" className="text-2xl font-black">
          DROP<span className="text-[#d6ff3f]">ZONE</span>
        </Link>
        <div className="flex gap-5 text-sm">
          <Link href="/organizer/dashboard" className="text-[#9298a1] hover:text-white">
            Dashboard
          </Link>
          <Link href="/organizer/tournaments" className="text-[#9298a1] hover:text-white">
            Tournaments
          </Link>
          <Link href="/organizer/registrations" className="text-[#9298a1] hover:text-white">
            Registrations
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-5 mb-9">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d6ff3f] mb-2">
              ORGANIZER WORKSPACE
            </p>
            <h1 className="text-3xl md:text-4xl font-black">Matches & Results</h1>
            <p className="text-sm text-[#9298a1] mt-2">
              Schedule matches, assign registered teams and record results.
            </p>
          </div>

          <button
            onClick={() => setShowForm((value) => !value)}
            className="rounded-lg bg-[#d6ff3f] text-black font-bold px-5 py-3"
          >
            + Schedule Match
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-5 rounded-lg border border-[#d6ff3f]/30 bg-[#d6ff3f]/10 p-4 text-sm text-[#d6ff3f]">
            {notice}
          </div>
        )}

        {showForm && (
          <section className="rounded-xl border border-[#3b4820] bg-[#14181e] p-6 mb-8">
            <h2 className="text-xl font-bold mb-5">Schedule New Match</h2>

            <form onSubmit={createMatch} className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm mb-2">Tournament</label>
                <select
                  required
                  value={form.tournamentId}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      tournamentId: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3"
                >
                  <option value="">Select tournament</option>
                  {tournaments.map((tournament) => (
                    <option
                      key={tournament.tournamentId}
                      value={tournament.tournamentId}
                    >
                      {tournament.tournamentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Match Number</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.matchNumber}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      matchNumber: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Map Name</label>
                <input
                  required
                  maxLength={100}
                  value={form.mapName}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      mapName: e.target.value,
                    }))
                  }
                  placeholder="e.g. Ascent, Haven, Erangel"
                  className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3"
                />
              </div>

<div>
  <label className="block text-sm mb-2">Match Date</label>
  <input
    required
    type="date"
    value={form.scheduledDate}
    onChange={(e) =>
      setForm((current) => ({
        ...current,
        scheduledDate: e.target.value,
      }))
    }
    className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3"
  />
</div>

<div>
  <label className="block text-sm mb-2">Match Time</label>
  <input
    required
    type="time"
    value={form.scheduledTime}
    onChange={(e) =>
      setForm((current) => ({
        ...current,
        scheduledTime: e.target.value,
      }))
    }
    className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3"
  />
</div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  disabled={saving}
                  className="rounded-lg bg-[#d6ff3f] text-black font-bold px-6 py-3 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Create Match"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[#252b33] px-6 py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section>
          <div className="flex justify-between border-b border-[#252b33] pb-4 mb-6">
            <div>
              <h2 className="font-bold">ALL MATCHES</h2>
              <p className="text-xs text-[#9298a1] mt-1">LIVE DATABASE RECORDS</p>
            </div>
            <span className="text-sm text-[#9298a1]">
              {matches.length.toString().padStart(2, "0")} MATCHES
            </span>
          </div>

          {loading ? (
            <p className="text-[#d6ff3f]">Loading matches...</p>
          ) : matches.length === 0 ? (
            <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-8 text-center text-[#9298a1]">
              No matches scheduled yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {matches.map((match) => (
                <article
                  key={match.matchId}
                  className={`rounded-xl border bg-[#14181e] p-6 ${
                    selectedMatch?.matchId === match.matchId
                      ? "border-[#d6ff3f]"
                      : "border-[#252b33]"
                  }`}
                >
                  <div className="flex justify-between gap-3">
                    <p className="text-xs uppercase tracking-widest text-[#d6ff3f]">
                      {match.tournamentName}
                    </p>
                    <span className="text-xs rounded-full bg-[#20252c] px-3 py-1">
                      {match.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mt-3">
                    Match {match.matchNumber}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                    <div>
                      <p className="text-xs text-[#9298a1]">MAP</p>
                      <p className="mt-1">{match.mapName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#9298a1]">SCHEDULED AT</p>
                      <p className="mt-1">{match.scheduledAt || "Not scheduled"}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-[#252b33] mt-5 pt-5">
                    <button
                      onClick={() => openMatchWorkspace(match)}
                      className="rounded-lg bg-[#d6ff3f] text-black font-bold px-4 py-2 text-sm"
                    >
                      Manage match
                    </button>
                    {match.status === "SCHEDULED" && (
                      <button
                        onClick={() => deleteMatch(match)}
                        className="rounded-lg border border-red-500/40 text-red-400 px-4 py-2 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {selectedMatch && (
          <section className="mt-10 rounded-xl border border-[#3b4820] bg-[#11161a] p-5 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
              <div>
                <p className="text-xs text-[#d6ff3f] tracking-widest uppercase">
                  MATCH WORKSPACE
                </p>
                <h2 className="text-2xl font-black mt-2">
                  {selectedMatch.tournamentName} · Match {selectedMatch.matchNumber}
                </h2>
                <p className="text-sm text-[#9298a1] mt-1">
                  {selectedMatch.mapName} · {selectedMatch.status}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedMatch(null);
                  setTeamDetails([]);
                }}
                className="text-sm text-[#9298a1] hover:text-white"
              >
                Close ✕
              </button>
            </div>

            {workspaceLoading ? (
              <p className="text-[#d6ff3f]">Loading match workspace...</p>
            ) : (
              <>
                {isScheduled && (
                  <div className="rounded-lg border border-[#252b33] bg-[#14181e] p-5 mb-6">
                    <h3 className="font-bold mb-3">Add Registered Team</h3>
                    <div className="flex flex-wrap gap-3">
                      <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="flex-1 min-w-56 rounded-lg border border-[#252b33] bg-[#090b0e] p-3"
                      >
                        <option value="">Select an eligible team</option>
                        {eligibleRegistrations.map((registration) => (
                          <option
                            key={registration.registrationId}
                            value={registration.teamId}
                          >
                            {registration.teamName} · {registration.status}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={addTeamToMatch}
                        disabled={!selectedTeamId}
                        className="rounded-lg bg-[#d6ff3f] text-black font-bold px-5 py-3 disabled:opacity-50"
                      >
                        Add Team
                      </button>
                    </div>
                    {eligibleRegistrations.length === 0 && (
                      <p className="text-xs text-[#9298a1] mt-3">
                        No eligible registered teams remain for this tournament.
                      </p>
                    )}
                  </div>
                )}

                {teamDetails.length === 0 ? (
                  <div className="rounded-lg border border-[#252b33] bg-[#14181e] p-6 text-center text-[#9298a1]">
                    No teams have been assigned to this match yet.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {teamDetails.map(({ matchTeam, roster, squad }) => {
                      const assignedIds = new Set(
                        teamDetails.flatMap((detail) =>
                          detail.squad.map((player) => player.playerId)
                        )
                      );

                      const availablePlayers = roster.filter(
                        (entry) => !assignedIds.has(entry.playerId)
                      );

                      return (
                        <article
                          key={matchTeam.matchTeamId}
                          className="rounded-xl border border-[#252b33] bg-[#14181e] p-5"
                        >
                          <div className="flex flex-wrap justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-bold">
                                {matchTeam.teamName}
                              </h3>
                              <p className="text-xs text-[#9298a1] mt-1">
                                TEAM ID #{matchTeam.teamId} · {squad.length}/4 players assigned
                              </p>
                            </div>
                            <span className="text-sm text-[#d6ff3f]">
                              {matchTeam.placement
                                ? `Placement #${matchTeam.placement}`
                                : "Placement pending"}
                            </span>
                          </div>

                          {isScheduled && (
                            <div className="mt-5 flex flex-wrap gap-3">
                              <select
                                value={selectedPlayers[matchTeam.teamId] || ""}
                                onChange={(e) =>
                                  setSelectedPlayers((current) => ({
                                    ...current,
                                    [matchTeam.teamId]: e.target.value,
                                  }))
                                }
                                className="flex-1 min-w-52 rounded-lg border border-[#252b33] bg-[#090b0e] p-3 text-sm"
                              >
                                <option value="">Select active roster player</option>
                                {availablePlayers.map((entry) => {
                                  const player = players.find(
                                    (item) => item.playerId === entry.playerId
                                  );
                                  return (
                                    <option key={entry.playerId} value={entry.playerId}>
                                      {player?.playerName || `Player #${entry.playerId}`}
                                    </option>
                                  );
                                })}
                              </select>
                              <button
                                onClick={() => addPlayer(matchTeam)}
                                disabled={!selectedPlayers[matchTeam.teamId]}
                                className="rounded-lg border border-[#d6ff3f]/50 text-[#d6ff3f] px-4 py-2 text-sm disabled:opacity-50"
                              >
                                Add Player
                              </button>
                            </div>
                          )}

                          {roster.length === 0 && isScheduled && (
                            <p className="text-xs text-amber-300 mt-3">
                              This team has no active roster players. Add players from the Team Manager workspace first.
                            </p>
                          )}

                          <div className="mt-5 space-y-3">
                            {squad.map((player) => {
                              const stats = performances[player.matchSquadPlayerId] || {
                                kills: "0",
                                damage: "0",
                                survivalTimeSeconds: "",
                                assists: "0",
                              };

                              return (
                                <div
                                  key={player.matchSquadPlayerId}
                                  className="rounded-lg border border-[#252b33] p-4"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <p className="font-semibold">{player.playerName}</p>
                                    {isScheduled && (
                                      <button
                                        onClick={() => removePlayer(player)}
                                        className="text-xs text-red-400 hover:text-red-300"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>

                                  {isOngoing && (
                                    <div className="mt-4">
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {(
                                          [
                                            ["kills", "Kills"],
                                            ["damage", "Damage"],
                                            ["assists", "Assists"],
                                            ["survivalTimeSeconds", "Survival (sec)"],
                                          ] as const
                                        ).map(([field, label]) => (
                                          <label
                                            key={field}
                                            className="text-xs text-[#9298a1]"
                                          >
                                            {label}
                                            <input
                                              type="number"
                                              min="0"
                                              value={stats[field]}
                                              onChange={(e) =>
                                                updatePerformance(
                                                  player.matchSquadPlayerId,
                                                  field,
                                                  e.target.value
                                                )
                                              }
                                              className="mt-2 w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-2 text-sm text-white"
                                            />
                                          </label>
                                        ))}
                                      </div>
                                      <button
                                        onClick={() => savePlayerPerformance(player)}
                                        className="mt-3 rounded-lg border border-[#d6ff3f]/50 text-[#d6ff3f] px-4 py-2 text-xs"
                                      >
                                        {stats.performanceId ? "Update stats" : "Save stats"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {squad.length === 0 && (
                              <p className="text-sm text-[#9298a1]">
                                No players assigned to this match yet.
                              </p>
                            )}
                          </div>

                          {isOngoing && (
                            <div className="border-t border-[#252b33] mt-5 pt-5">
                              <h4 className="font-bold mb-3">Team Result</h4>
                              <div className="grid grid-cols-2 gap-3 max-w-md">
                                <label className="text-xs text-[#9298a1]">
                                  Placement
                                  <input
                                    type="number"
                                    min="1"
                                    value={results[matchTeam.matchTeamId]?.placement || ""}
                                    onChange={(e) =>
                                      updateResult(
                                        matchTeam.matchTeamId,
                                        "placement",
                                        e.target.value
                                      )
                                    }
                                    className="mt-2 w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3 text-sm text-white"
                                  />
                                </label>
                                <label className="text-xs text-[#9298a1]">
                                  Total Points
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={results[matchTeam.matchTeamId]?.totalPoints || ""}
                                    onChange={(e) =>
                                      updateResult(
                                        matchTeam.matchTeamId,
                                        "totalPoints",
                                        e.target.value
                                      )
                                    }
                                    className="mt-2 w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3 text-sm text-white"
                                  />
                                </label>
                              </div>
                              <button
                                onClick={() => saveTeamResult(matchTeam)}
                                className="mt-3 rounded-lg border border-[#d6ff3f]/50 text-[#d6ff3f] px-4 py-2 text-xs"
                              >
                                Save team result
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-7 border-t border-[#252b33] pt-6">
                  {isScheduled && (
                    <button
                      onClick={startMatch}
                      className="rounded-lg bg-[#d6ff3f] text-black font-bold px-5 py-3"
                    >
                      Start Match
                    </button>
                  )}

                  {isOngoing && (
                    <button
                      onClick={completeMatch}
                      className="rounded-lg bg-[#d6ff3f] text-black font-bold px-5 py-3"
                    >
                      Complete Match
                    </button>
                  )}
                </div>

                {isScheduled && (
                  <p className="text-xs text-[#9298a1] mt-3">
                    To start: assign at least two registered teams, then exactly four active roster players to each team.
                  </p>
                )}
                {isOngoing && (
                  <p className="text-xs text-[#9298a1] mt-3">
                    To complete: save placement and points for every team, and performance statistics for every assigned player.
                  </p>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
