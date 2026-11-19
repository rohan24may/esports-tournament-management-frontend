
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Game {
  gameId: number;
  gameName: string;
}

interface Tournament {
  tournamentId: number;
  gameId: number;
  gameName: string;
  tournamentName: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  status: string;
}

interface TournamentForm {
  gameId: string;
  tournamentName: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  status: string;
}

const emptyForm: TournamentForm = {
  gameId: "",
  tournamentName: "",
  startDate: "",
  endDate: "",
  prizePool: "0",
  status: "UPCOMING",
};

export default function OrganizerTournamentsPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [form, setForm] = useState<TournamentForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    const [gameData, tournamentData] = await Promise.all([
      apiFetch<Game[]>("/games"),
      apiFetch<Tournament[]>("/tournaments"),
    ]);

    setGames(gameData);
    setTournaments(tournamentData);
  }, []);

  useEffect(() => {
    loadData()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load data.")
      )
      .finally(() => setLoading(false));
  }, [loadData]);

  function updateField(field: keyof TournamentForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreateForm() {
    setForm({
      ...emptyForm,
      gameId: games[0] ? String(games[0].gameId) : "",
    });
    setEditingId(null);
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function openEditForm(tournament: Tournament) {
    setForm({
      gameId: String(tournament.gameId),
      tournamentName: tournament.tournamentName,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      prizePool: String(tournament.prizePool ?? 0),
      status: tournament.status,
    });
    setEditingId(tournament.tournamentId);
    setError("");
    setNotice("");
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (form.endDate < form.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    setSaving(true);

    const payload = {
      gameId: Number(form.gameId),
      tournamentName: form.tournamentName.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      prizePool: Number(form.prizePool || 0),
      status: form.status,
    };

    try {
      if (editingId !== null) {
        await apiFetch<Tournament>(`/tournaments/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setNotice("Tournament updated successfully.");
      } else {
        await apiFetch<Tournament>("/tournaments", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setNotice("Tournament created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save tournament.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTournament(tournament: Tournament) {
    if (!window.confirm(`Delete "${tournament.tournamentName}"?`)) return;

    setError("");
    setNotice("");

    try {
      await apiFetch<void>(`/tournaments/${tournament.tournamentId}`, {
        method: "DELETE",
      });

      setNotice("Tournament deleted successfully.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete tournament."
      );
    }
  }

  function formatPrize(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }

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
          <Link href="/tournaments" className="text-[#9298a1] hover:text-white">
            Public tournaments
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-5 mb-9">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d6ff3f] mb-2">
              ORGANIZER WORKSPACE
            </p>
            <h1 className="text-3xl md:text-4xl font-black">
              Tournament Management
            </h1>
            <p className="text-sm text-[#9298a1] mt-2">
              Create and manage your esports competitions.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            disabled={games.length === 0}
            className="rounded-lg bg-[#d6ff3f] text-black font-bold px-5 py-3 hover:bg-[#c5ed32] disabled:opacity-50"
          >
            + Create Tournament
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
          <section className="rounded-xl border border-[#3b4820] bg-[#14181e] p-6 mb-9">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Tournament" : "Create New Tournament"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-[#9298a1] hover:text-white"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm mb-2">Tournament Name</label>
                <input
                  required
                  maxLength={150}
                  value={form.tournamentName}
                  onChange={(e) => updateField("tournamentName", e.target.value)}
                  placeholder="e.g. DROPZONE Valorant Championship"
                  className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3 outline-none focus:border-[#d6ff3f]"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Game</label>
                <select
                  required
                  value={form.gameId}
                  onChange={(e) => updateField("gameId", e.target.value)}
                  className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3 outline-none focus:border-[#d6ff3f]"
                >
                  <option value="">Select game</option>
                  {games.map((game) => (
                    <option key={game.gameId} value={game.gameId}>
                      {game.gameName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Start Date</label>
                <input
                  required
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3 outline-none focus:border-[#d6ff3f]"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">End Date</label>
                <input
                  required
                  type="date"
                  min={form.startDate || undefined}
                  value={form.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                  className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3 outline-none focus:border-[#d6ff3f]"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Prize Pool (INR)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.prizePool}
                  onChange={(e) => updateField("prizePool", e.target.value)}
                  className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3 outline-none focus:border-[#d6ff3f]"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] p-3 outline-none focus:border-[#d6ff3f]"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving || !form.gameId}
                  className="rounded-lg bg-[#d6ff3f] text-black font-bold px-6 py-3 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Tournament"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[#252b33] px-6 py-3 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="flex justify-between items-center border-b border-[#252b33] pb-4 mb-6">
          <div>
            <h2 className="font-bold">ALL TOURNAMENTS</h2>
            <p className="text-xs text-[#9298a1] mt-1">LIVE DATABASE RECORDS</p>
          </div>
          <span className="text-sm text-[#9298a1]">
            {tournaments.length.toString().padStart(2, "0")} EVENTS
          </span>
        </div>

        {loading ? (
          <p className="text-[#d6ff3f]">Loading tournaments...</p>
        ) : tournaments.length === 0 ? (
          <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-8 text-center">
            <p className="text-[#9298a1]">No tournaments found.</p>
            <button onClick={openCreateForm} className="mt-4 text-[#d6ff3f] font-bold">
              Create your first tournament →
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {tournaments.map((tournament) => (
              <article
                key={tournament.tournamentId}
                className="rounded-xl border border-[#252b33] bg-[#14181e] p-6"
              >
                <div className="flex justify-between gap-3">
                  <p className="text-xs uppercase tracking-widest text-[#d6ff3f]">
                    {tournament.gameName}
                  </p>
                  <span className="text-xs rounded-full bg-[#20252c] px-3 py-1 text-[#c5ccd5]">
                    {tournament.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold mt-3">
                  {tournament.tournamentName}
                </h3>

                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                  <div>
                    <p className="text-xs text-[#9298a1]">START DATE</p>
                    <p className="mt-1">{tournament.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9298a1]">END DATE</p>
                    <p className="mt-1">{tournament.endDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-[#9298a1]">PRIZE POOL</p>
                    <p className="text-xl font-black text-[#d6ff3f] mt-1">
                      {formatPrize(tournament.prizePool)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-[#252b33] mt-6 pt-5">
                  <button
                    onClick={() => openEditForm(tournament)}
                    className="rounded-lg border border-[#343b45] px-4 py-2 text-sm hover:border-[#d6ff3f]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTournament(tournament)}
                    className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
