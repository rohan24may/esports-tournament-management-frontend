"use client";

import { useCallback, useEffect, useState } from "react";
import ManagerShell from "@/components/manager/ManagerShell";
import { apiFetch } from "@/lib/api";

interface ManagerProfile { onboarded: boolean; teamId: number | null; teamName: string | null; gameId: number | null; gameName: string | null; }
interface Tournament { tournamentId: number; gameId: number; gameName: string; tournamentName: string; startDate: string; endDate: string; prizePool: number; status: string; }
interface Registration { registrationId: number; tournamentId: number; tournamentName: string; teamId: number; teamName: string; registrationDate: string; seed: number | null; status: string; }

export default function ManagerTournamentsPage() {
  const [profile, setProfile] = useState<ManagerProfile | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    const [profileData, tournamentData, registrationData] = await Promise.all([
      apiFetch<ManagerProfile>("/onboarding/me"),
      apiFetch<Tournament[]>("/tournaments"),
      apiFetch<Registration[]>("/manager/workspace/tournament-registrations"),
    ]);
    setProfile(profileData);
    setTournaments(tournamentData);
    setRegistrations(registrationData);
  }, []);

  useEffect(() => {
    loadData().catch((err) => setError(err instanceof Error ? err.message : "Unable to load tournaments."))
      .finally(() => setLoading(false));
  }, [loadData]);

  async function registerTeam(tournament: Tournament) {
    setError("");
    setNotice("");
    setRegisteringId(tournament.tournamentId);
    try {
      await apiFetch<Registration>(`/manager/workspace/tournaments/${tournament.tournamentId}/register`, { method: "POST" });
      await loadData();
      setNotice(`Your team has been registered for ${tournament.tournamentName}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register your team.");
    } finally {
      setRegisteringId(null);
    }
  }

  const registrationByTournament = new Map(registrations.map((item) => [item.tournamentId, item]));

  return (
    <ManagerShell title="Tournaments" active="/manager/tournaments">
      <div className="mb-8"><p className="text-[#d6ff3f] text-sm font-semibold mb-2">COMPETE ON THE BIG STAGE</p><h2 className="text-3xl md:text-4xl font-black">Tournaments</h2><p className="text-[#9298a1] mt-2">Explore competitions and register your team.</p></div>
      {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
      {notice && <div className="mb-5 rounded-lg border border-[#d6ff3f]/30 bg-[#d6ff3f]/10 p-3 text-sm text-[#d6ff3f]">{notice}</div>}
      {loading ? <p className="text-[#d6ff3f]">Loading tournaments...</p> : !profile?.onboarded ? <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-6">Complete team onboarding before registering for tournaments.</div> : (
        <>
          <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-5 mb-7 flex flex-wrap justify-between gap-3"><div><p className="text-xs text-[#9298a1]">REGISTERING TEAM</p><p className="font-bold text-lg mt-1">{profile.teamName}</p><p className="text-sm text-[#9298a1]">{profile.gameName}</p></div><div className="text-right"><p className="text-xs text-[#9298a1]">REGISTRATIONS</p><p className="text-2xl font-black text-[#d6ff3f]">{registrations.length}</p></div></div>
          {tournaments.length === 0 ? <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-6 text-sm text-[#9298a1]">No tournaments are currently listed.</div> : (
            <div className="grid lg:grid-cols-2 gap-5">{tournaments.map((tournament) => {
              const registration = registrationByTournament.get(tournament.tournamentId);
              const sameGame = tournament.gameId === profile.gameId;
              const closed = ["COMPLETED", "CANCELLED", "CLOSED"].includes(tournament.status.toUpperCase());
              return <article key={tournament.tournamentId} className="rounded-xl border border-[#252b33] bg-[#14181e] p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-[#d6ff3f]">{tournament.gameName}</p><h3 className="text-xl font-bold mt-2">{tournament.tournamentName}</h3></div><span className="text-xs rounded-full bg-[#20252c] px-3 py-1 text-[#c5ccd5]">{tournament.status}</span></div><div className="grid grid-cols-2 gap-4 mt-6"><div><p className="text-xs text-[#9298a1]">START DATE</p><p className="font-semibold mt-1">{tournament.startDate}</p></div><div><p className="text-xs text-[#9298a1]">END DATE</p><p className="font-semibold mt-1">{tournament.endDate}</p></div><div><p className="text-xs text-[#9298a1]">PRIZE POOL</p><p className="font-semibold mt-1">{Number(tournament.prizePool || 0).toLocaleString()}</p></div><div><p className="text-xs text-[#9298a1]">YOUR TEAM</p><p className="font-semibold mt-1">{profile.teamName}</p></div></div><div className="border-t border-[#252b33] mt-5 pt-5">{registration ? <p className="text-sm text-[#d6ff3f]">Registered · {registration.status} · {registration.registrationDate}</p> : !sameGame ? <p className="text-sm text-[#9298a1]">Your team plays {profile.gameName}; this tournament is for {tournament.gameName}.</p> : closed ? <p className="text-sm text-[#9298a1]">Registration is not available for this tournament.</p> : <button onClick={() => registerTeam(tournament)} disabled={registeringId === tournament.tournamentId} className="rounded-lg bg-[#d6ff3f] px-5 py-3 text-sm font-bold text-black disabled:opacity-50">{registeringId === tournament.tournamentId ? "Registering..." : "Register my team →"}</button>}</div></article>;
            })}</div>
          )}
        </>
      )}
    </ManagerShell>
  );
}
