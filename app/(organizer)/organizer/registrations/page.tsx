
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

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

export default function OrganizerRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRegistrations = useCallback(async () => {
    const data = await apiFetch<Registration[]>(
      "/tournament-registrations"
    );
    setRegistrations(data);
  }, []);

  useEffect(() => {
    loadRegistrations()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load registrations.")
      )
      .finally(() => setLoading(false));
  }, [loadRegistrations]);

  async function updateStatus(
    registration: Registration,
    status: "CONFIRMED" | "WITHDRAWN"
  ) {
    setError("");
    setNotice("");
    setSavingId(registration.registrationId);

    try {
      await apiFetch<Registration>(
        `/tournament-registrations/${registration.registrationId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            tournamentId: registration.tournamentId,
            teamId: registration.teamId,
            registrationDate: registration.registrationDate,
            seed: registration.seed,
            status,
          }),
        }
      );

      await loadRegistrations();
      setNotice(
        `${registration.teamName}: registration marked ${status.toLowerCase()}.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update registration."
      );
    } finally {
      setSavingId(null);
    }
  }

  const tournaments = Array.from(
    new Map(
      registrations.map((r) => [
        r.tournamentId,
        { id: r.tournamentId, name: r.tournamentName },
      ])
    ).values()
  );

  const filteredRegistrations =
    filter === "ALL"
      ? registrations
      : registrations.filter((r) => String(r.tournamentId) === filter);

  return (
    <div className="min-h-screen bg-[#090b0e] text-white">
      <header className="h-20 border-b border-[#252b33] flex items-center justify-between px-6 md:px-10">
        <Link href="/organizer/dashboard" className="text-2xl font-black">
          DROP<span className="text-[#d6ff3f]">ZONE</span>
        </Link>

        <Link
          href="/organizer/dashboard"
          className="text-sm text-[#9298a1] hover:text-white"
        >
          Dashboard
        </Link>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#d6ff3f] mb-2">
            ORGANIZER WORKSPACE
          </p>
          <h1 className="text-3xl md:text-4xl font-black">
            Tournament Registrations
          </h1>
          <p className="text-sm text-[#9298a1] mt-2">
            Review team registrations and manage their status.
          </p>
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

        <section className="rounded-xl border border-[#252b33] bg-[#14181e] p-5 mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#9298a1]">TOTAL REGISTRATIONS</p>
            <p className="text-3xl font-black text-[#d6ff3f] mt-1">
              {registrations.length}
            </p>
          </div>

          <div>
            <label className="block text-xs text-[#9298a1] mb-2">
              FILTER BY TOURNAMENT
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-[#252b33] bg-[#090b0e] px-4 py-3 text-sm"
            >
              <option value="ALL">All tournaments</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {loading ? (
          <p className="text-[#d6ff3f]">Loading registrations...</p>
        ) : filteredRegistrations.length === 0 ? (
          <div className="rounded-xl border border-[#252b33] bg-[#14181e] p-8 text-center">
            <h2 className="font-bold text-lg">No registrations found</h2>
            <p className="text-sm text-[#9298a1] mt-2">
              Team registrations will appear here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filteredRegistrations.map((registration) => {
              const status = registration.status.toUpperCase();
              const busy = savingId === registration.registrationId;

              return (
                <article
                  key={registration.registrationId}
                  className="rounded-xl border border-[#252b33] bg-[#14181e] p-6"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-xs text-[#d6ff3f] uppercase tracking-widest">
                        {registration.tournamentName}
                      </p>
                      <h2 className="text-xl font-bold mt-2">
                        {registration.teamName}
                      </h2>
                    </div>

                    <span className="text-xs rounded-full bg-[#20252c] px-3 py-1">
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                    <div>
                      <p className="text-xs text-[#9298a1]">REGISTRATION ID</p>
                      <p className="mt-1">#{registration.registrationId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#9298a1]">TEAM ID</p>
                      <p className="mt-1">#{registration.teamId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#9298a1]">REGISTERED ON</p>
                      <p className="mt-1">{registration.registrationDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#9298a1]">SEED</p>
                      <p className="mt-1">{registration.seed ?? "Not assigned"}</p>
                    </div>
                  </div>

                  <div className="border-t border-[#252b33] mt-6 pt-5 flex flex-wrap gap-3">
                    {status !== "CONFIRMED" && status !== "WITHDRAWN" && (
                      <button
                        onClick={() => updateStatus(registration, "CONFIRMED")}
                        disabled={busy}
                        className="rounded-lg bg-[#d6ff3f] text-black font-bold px-4 py-2 text-sm disabled:opacity-50"
                      >
                        {busy ? "Updating..." : "Confirm team"}
                      </button>
                    )}

                    {status !== "WITHDRAWN" && (
                      <button
                        onClick={() => updateStatus(registration, "WITHDRAWN")}
                        disabled={busy}
                        className="rounded-lg border border-red-500/40 text-red-400 px-4 py-2 text-sm disabled:opacity-50"
                      >
                        {busy ? "Updating..." : "Mark withdrawn"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
