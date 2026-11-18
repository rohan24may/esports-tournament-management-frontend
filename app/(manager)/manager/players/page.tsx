"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import ManagerShell from "@/components/manager/ManagerShell";
import { apiFetch } from "@/lib/api";

interface ManagerProfile { onboarded: boolean; teamId: number | null; teamName: string | null; gameName: string | null; }
interface Player { playerId: number; playerName: string; country: string | null; dateOfBirth: string | null; }
interface RosterEntry { rosterId: number; teamId: number; playerId: number; role: string | null; startDate: string; endDate: string | null; status: string; }

export default function PlayersRosterPage() {
  const [profile, setProfile] = useState<ManagerProfile | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [role, setRole] = useState("PLAYER");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyRosterId, setBusyRosterId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    const [profileData, playerData, rosterData] = await Promise.all([
      apiFetch<ManagerProfile>("/onboarding/me"),
      apiFetch<Player[]>("/players"),
      apiFetch<RosterEntry[]>("/manager/workspace/roster"),
    ]);
    setProfile(profileData);
    setPlayers(playerData);
    setRoster(rosterData);
  }, []);

  useEffect(() => {
    loadData().catch((err) => setError(err instanceof Error ? err.message : "Unable to load roster."))
      .finally(() => setLoading(false));
  }, [loadData]);

  const playerById = useMemo(() => new Map(players.map((player) => [player.playerId, player])), [players]);
  const rosteredPlayerIds = useMemo(() => new Set(roster.filter((entry) => entry.status === "ACTIVE").map((entry) => entry.playerId)), [roster]);
  const availablePlayers = players.filter((player) => !rosteredPlayerIds.has(player.playerId));

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!selectedPlayer || !startDate) {
      setError("Choose a player and start date.");
      return;
    }
    setSaving(true);
    try {
      await apiFetch<RosterEntry>("/manager/workspace/roster", {
        method: "POST",
        body: JSON.stringify({ playerId: Number(selectedPlayer), role: role.trim() || "PLAYER", startDate }),
      });
      setSelectedPlayer("");
      setRole("PLAYER");
      await loadData();
      setNotice("Player added to your active roster.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add player.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(entry: RosterEntry) {
    setError("");
    setNotice("");
    setBusyRosterId(entry.rosterId);
    try {
      await apiFetch<void>(`/manager/workspace/roster/${entry.rosterId}`, { method: "DELETE" });
      await loadData();
      setNotice("Player moved to roster history (marked inactive).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update roster.");
    } finally {
      setBusyRosterId(null);
    }
  }

  return (
    <ManagerShell title="Players & Roster" active="/manager/players">
      <div className="mb-8">
        <p className="text-[#d6ff3f] text-sm font-semibold mb-2">SQUAD MANAGEMENT</p>
        <h2 className="text-3xl md:text-4xl font-black">Players & Roster</h2>
        <p className="text-[#9298a1] mt-2">Build and maintain the active roster for {profile?.teamName || "your team"}.</p>
      </div>

      {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
      {notice && <div className="mb-5 rounded-lg border border-[#d6ff3f]/30 bg-[#d6ff3f]/10 p-3 text-sm text-[#d6ff3f]">{notice}</div>}

      {loading ? <p className="text-[#d6ff3f]">Loading players...</p> : !profile?.onboarded ? (
        <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-6">Complete team onboarding before managing a roster.</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-7">
            <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-5"><p className="text-sm text-[#9298a1]">Team</p><p className="font-bold text-lg mt-2">{profile.teamName}</p></div>
            <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-5"><p className="text-sm text-[#9298a1]">Game</p><p className="font-bold text-lg mt-2">{profile.gameName}</p></div>
            <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-5"><p className="text-sm text-[#9298a1]">Active players</p><p className="font-bold text-lg mt-2">{roster.length}</p></div>
          </div>

          <form onSubmit={handleAdd} className="rounded-xl border border-[#252b33] bg-[#14181e] p-6 mb-7">
            <h3 className="text-lg font-bold">Add an existing player</h3>
            <p className="text-sm text-[#9298a1] mt-1 mb-5">Select a player already registered in DROPZONE and assign a squad role.</p>
            <div className="grid md:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
              <label className="text-sm">Player
                <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className="mt-2 w-full rounded-lg border border-[#303640] bg-[#090b0e] px-3 py-3" required>
                  <option value="">Select player</option>
                  {availablePlayers.map((player) => <option key={player.playerId} value={player.playerId}>{player.playerName}{player.country ? ` · ${player.country}` : ""}</option>)}
                </select>
              </label>
              <label className="text-sm">Role
                <input value={role} onChange={(e) => setRole(e.target.value)} maxLength={50} className="mt-2 w-full rounded-lg border border-[#303640] bg-[#090b0e] px-3 py-3" placeholder="PLAYER" />
              </label>
              <label className="text-sm">Start date
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-2 w-full rounded-lg border border-[#303640] bg-[#090b0e] px-3 py-3" required />
              </label>
              <button type="submit" disabled={saving || availablePlayers.length === 0} className="rounded-lg bg-[#d6ff3f] px-5 py-3 font-bold text-black disabled:opacity-50">{saving ? "Adding..." : "Add player"}</button>
            </div>
            {availablePlayers.length === 0 && <p className="text-xs text-[#9298a1] mt-3">There are no unassigned player records available. Add player records to the player database first.</p>}
          </form>

          <section className="rounded-xl border border-[#252b33] bg-[#14181e] p-6">
            <div className="flex items-center justify-between gap-3 mb-5"><div><h3 className="text-lg font-bold">Active roster</h3><p className="text-sm text-[#9298a1] mt-1">Players currently assigned to your team.</p></div><span className="text-sm text-[#d6ff3f]">{roster.length} ACTIVE</span></div>
            {roster.length === 0 ? <p className="text-sm text-[#9298a1]">Your roster is empty. Add a player above to get started.</p> : (
              <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-[#9298a1] border-b border-[#252b33]"><tr><th className="py-3 pr-4">Player</th><th className="py-3 pr-4">Country</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Start date</th><th className="py-3 text-right">Action</th></tr></thead><tbody>{roster.map((entry) => { const player = playerById.get(entry.playerId); return <tr key={entry.rosterId} className="border-b border-[#252b33]/70"><td className="py-3 pr-4 font-semibold">{player?.playerName || `Player #${entry.playerId}`}</td><td className="py-3 pr-4 text-[#9298a1]">{player?.country || "—"}</td><td className="py-3 pr-4">{entry.role || "PLAYER"}</td><td className="py-3 pr-4">{entry.startDate}</td><td className="py-3 text-right"><button onClick={() => handleRemove(entry)} disabled={busyRosterId === entry.rosterId} className="text-red-400 hover:text-red-300 disabled:opacity-50">{busyRosterId === entry.rosterId ? "Removing..." : "Remove"}</button></td></tr>; })}</tbody></table></div>
            )}
          </section>
        </>
      )}
    </ManagerShell>
  );
}
