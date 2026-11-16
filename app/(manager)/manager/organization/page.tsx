
"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";

interface Game {
  gameId: number;
  gameName: string;
}

interface Organization {
  organizationId: number;
  organizationName: string;
  country?: string;
}

type Mode = "create" | "existing";

export default function OrganizationPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<Mode>("create");

  const [games, setGames] = useState<Game[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [organizationName, setOrganizationName] = useState("");
  const [country, setCountry] = useState("India");
  const [foundedDate, setFoundedDate] = useState("");
  const [website, setWebsite] = useState("");

  const [organizationId, setOrganizationId] = useState("");
  const [gameId, setGameId] = useState("");
  const [teamName, setTeamName] = useState("");


  useEffect(() => {
    const session = getAuthSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    if (session.role !== "TEAM_MANAGER") {
      router.replace("/");
      return;
    }

    async function loadData() {
      const results = await Promise.allSettled([
        apiFetch<Game[]>("/games"),
        apiFetch<Organization[]>("/organizations"),
        apiFetch<{ onboarded: boolean }>("/onboarding/me"),
      ]);

      // Load games independently
      if (results[0].status === "fulfilled") {
        const gameData = results[0].value;
        setGames(Array.isArray(gameData) ? gameData : []);

        if (Array.isArray(gameData) && gameData.length > 0) {
          setGameId(String(gameData[0].gameId));
        }
      } else {
        setError("Unable to load games. Please refresh the page.");
      }

      // Load organizations independently
      if (results[1].status === "fulfilled") {
        setOrganizations(results[1].value);
      }

      // Check onboarding status
      if (results[2].status === "fulfilled") {
        if (results[2].value.onboarded) {
          router.replace("/manager/dashboard");
          return;
        }
      } else {
        setError("Unable to verify your onboarding status. Please refresh.");
      }

      setLoading(false);
    }

    loadData();
  }, [router]);


  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) =>
      org.organizationName.toLowerCase().includes(search.toLowerCase())
    );
  }, [organizations, search]);

  const selectedGame = games.find(
    (game) => String(game.gameId) === gameId
  );

  const selectedOrganization = organizations.find(
    (org) => String(org.organizationId) === organizationId
  );

  function nextStep() {
    setError("");

    if (step === 1) {
      if (mode === "create" && !organizationName.trim()) {
        setError("Please enter your organization name.");
        return;
      }

      if (mode === "existing" && !organizationId) {
        setError("Please select an organization.");
        return;
      }
    }

    if (step === 2) {
      if (!gameId || !teamName.trim()) {
        setError("Please select a game and enter your team name.");
        return;
      }
    }

    setStep((current) => Math.min(current + 1, 3));
  }

  function previousStep() {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!gameId || !teamName.trim()) {
      setError("Please complete your team details.");
      setStep(2);
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "create") {
        await apiFetch("/onboarding/create-organization", {
          method: "POST",
          body: JSON.stringify({
            organizationName: organizationName.trim(),
            country: country.trim() || null,
            foundedDate: foundedDate || null,
            website: website.trim() || null,
            gameId: Number(gameId),
            teamName: teamName.trim(),
          }),
        });
      } else {
        await apiFetch("/onboarding/join-organization", {
          method: "POST",
          body: JSON.stringify({
            organizationId: Number(organizationId),
            gameId: Number(gameId),
            teamName: teamName.trim(),
          }),
        });
      }

      router.replace("/manager/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Setup failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[#252b33] bg-[#090b0e] px-4 py-3 outline-none focus:border-[#d6ff3f] transition";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090b0e] flex items-center justify-center text-[#d6ff3f]">
        Loading your workspace...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090b0e] text-white">
      <header className="h-20 border-b border-[#252b33] flex items-center justify-between px-6 md:px-10">
        <Link href="/manager/dashboard" className="text-2xl font-black">
          DROP<span className="text-[#d6ff3f]">ZONE</span>
        </Link>
        <span className="text-xs text-[#9298a1]">
          TEAM MANAGER ONBOARDING
        </span>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.25em] text-[#d6ff3f]">
            YOUR JOURNEY STARTS HERE
          </p>
          <h1 className="text-3xl md:text-5xl font-black mt-3">
            Build your esports presence.
          </h1>
          <p className="text-[#9298a1] mt-3">
            Set up your organization and create your first competitive team.
          </p>
        </div>

        {/* Progress */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {["Organization", "Team setup", "Review"].map((label, index) => {
            const number = index + 1;
            const active = step === number;
            const completed = step > number;

            return (
              <div key={label}>
                <div
                  className={`h-1 rounded-full mb-3 ${
                    active || completed
                      ? "bg-[#d6ff3f]"
                      : "bg-[#252b33]"
                  }`}
                />
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      active || completed
                        ? "bg-[#d6ff3f] text-black"
                        : "bg-[#20252c] text-[#9298a1]"
                    }`}
                  >
                    {completed ? "✓" : `0${number}`}
                  </span>
                  <span
                    className={`text-xs sm:text-sm ${
                      active ? "text-white font-semibold" : "text-[#737b86]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#252b33] bg-[#14181e] p-6 md:p-9"
          >
            {/* STEP 1 */}
            {step === 1 && (
              <section className="space-y-7">
                <div>
                  <p className="text-[#d6ff3f] text-xs font-bold tracking-widest">
                    STEP 01
                  </p>
                  <h2 className="text-2xl font-bold mt-2">
                    Choose your organization
                  </h2>
                  <p className="text-sm text-[#9298a1] mt-2">
                    Are you creating something new or joining an existing organization?
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("create");
                      setError("");
                    }}
                    className={`text-left p-5 rounded-xl border transition ${
                      mode === "create"
                        ? "border-[#d6ff3f] bg-[#d6ff3f]/10"
                        : "border-[#303640] bg-[#090b0e] hover:border-[#657044]"
                    }`}
                  >
                    <span className="text-3xl text-[#d6ff3f]">＋</span>
                    <h3 className="font-bold mt-3">Create new</h3>
                    <p className="text-xs text-[#9298a1] mt-2">
                      Start your own esports organization.
                    </p>
                    {mode === "create" && (
                      <p className="text-xs text-[#d6ff3f] mt-4">
                        SELECTED ✓
                      </p>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("existing");
                      setError("");
                    }}
                    className={`text-left p-5 rounded-xl border transition ${
                      mode === "existing"
                        ? "border-[#d6ff3f] bg-[#d6ff3f]/10"
                        : "border-[#303640] bg-[#090b0e] hover:border-[#657044]"
                    }`}
                  >
                    <span className="text-3xl text-[#d6ff3f]">⌂</span>
                    <h3 className="font-bold mt-3">Existing organization</h3>
                    <p className="text-xs text-[#9298a1] mt-2">
                      Create a team under an existing organization.
                    </p>
                    {mode === "existing" && (
                      <p className="text-xs text-[#d6ff3f] mt-4">
                        SELECTED ✓
                      </p>
                    )}
                  </button>
                </div>

                {mode === "create" ? (
                  <div className="space-y-5 border-t border-[#252b33] pt-6">
                    <h3 className="font-bold">Organization information</h3>

                    <div>
                      <label className="block text-sm mb-2">
                        Organization name *
                      </label>
                      <input
                        required
                        maxLength={150}
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="e.g. Phoenix Esports"
                        className={inputClass}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Country</label>
                        <input
                          maxLength={100}
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">
                          Founded date
                        </label>
                        <input
                          type="date"
                          value={foundedDate}
                          onChange={(e) => setFoundedDate(e.target.value)}
                          className={`${inputClass} [color-scheme:dark]`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">
                        Website <span className="text-[#737b86]">(optional)</span>
                      </label>
                      <input
                        type="url"
                        maxLength={255}
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-[#252b33] pt-6 space-y-4">
                    <h3 className="font-bold">Find an organization</h3>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search organizations..."
                      className={inputClass}
                    />

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredOrganizations.map((org) => (
                        <button
                          key={org.organizationId}
                          type="button"
                          onClick={() =>
                            setOrganizationId(String(org.organizationId))
                          }
                          className={`w-full text-left p-4 rounded-lg border transition ${
                            organizationId === String(org.organizationId)
                              ? "border-[#d6ff3f] bg-[#d6ff3f]/10"
                              : "border-[#303640] bg-[#090b0e] hover:border-[#657044]"
                          }`}
                        >
                          <p className="font-semibold">{org.organizationName}</p>
                          <p className="text-xs text-[#9298a1] mt-1">
                            {org.country || "Country not specified"}
                          </p>
                        </button>
                      ))}

                      {filteredOrganizations.length === 0 && (
                        <p className="text-sm text-[#9298a1] py-5 text-center">
                          No matching organizations found.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <section className="space-y-7">
                <div>
                  <p className="text-[#d6ff3f] text-xs font-bold tracking-widest">
                    STEP 02
                  </p>
                  <h2 className="text-2xl font-bold mt-2">
                    Create your first team
                  </h2>
                  <p className="text-sm text-[#9298a1] mt-2">
                    Select your competitive game and give your team an identity.
                  </p>
                </div>

                <div>
                  <label className="block text-sm mb-3">Choose your game *</label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {games.map((game) => (
                      <button
                        type="button"
                        key={game.gameId}
                        onClick={() => setGameId(String(game.gameId))}
                        className={`p-5 rounded-xl border text-left transition ${
                          gameId === String(game.gameId)
                            ? "border-[#d6ff3f] bg-[#d6ff3f]/10"
                            : "border-[#303640] bg-[#090b0e] hover:border-[#657044]"
                        }`}
                      >
                        <span className="text-2xl">🎮</span>
                        <p className="font-bold mt-3">{game.gameName}</p>
                        <p className="text-xs text-[#9298a1] mt-1">
                          {gameId === String(game.gameId)
                            ? "Selected ✓"
                            : "Select game"}
                        </p>
                      </button>
                    ))}
                  </div>

                  {games.length === 0 && (
                    <p className="text-sm text-red-400">
                      No games are available from the server.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Team name *</label>
                  <input
                    required
                    maxLength={100}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Phoenix Warriors"
                    className={inputClass}
                  />
                  <p className="text-xs text-[#737b86] mt-2">
                    Choose a name that represents your competitive team.
                  </p>
                </div>
              </section>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <section className="space-y-7">
                <div>
                  <p className="text-[#d6ff3f] text-xs font-bold tracking-widest">
                    STEP 03
                  </p>
                  <h2 className="text-2xl font-bold mt-2">
                    Review your setup
                  </h2>
                  <p className="text-sm text-[#9298a1] mt-2">
                    Everything look right? Create your organization and team.
                  </p>
                </div>

                <div className="rounded-xl border border-[#303640] bg-[#090b0e] p-5 space-y-5">
                  <div>
                    <p className="text-xs text-[#9298a1] uppercase tracking-wider">
                      Organization type
                    </p>
                    <p className="font-bold mt-1">
                      {mode === "create" ? "New organization" : "Existing organization"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9298a1] uppercase tracking-wider">
                      Organization
                    </p>
                    <p className="text-lg font-bold mt-1">
                      {mode === "create"
                        ? organizationName
                        : selectedOrganization?.organizationName}
                    </p>
                    {mode === "create" && (
                      <p className="text-sm text-[#9298a1] mt-1">
                        {country || "Country not specified"}
                        {foundedDate ? ` · Founded ${foundedDate}` : ""}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[#252b33] pt-5">
                    <p className="text-xs text-[#9298a1] uppercase tracking-wider">
                      Competitive game
                    </p>
                    <p className="font-bold mt-1">
                      {selectedGame?.gameName || "Not selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9298a1] uppercase tracking-wider">
                      Team name
                    </p>
                    <p className="text-xl font-black text-[#d6ff3f] mt-1">
                      {teamName}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-[#d6ff3f]/20 bg-[#d6ff3f]/5 p-4 text-sm text-[#b9c59d]">
                  By finishing setup, your organization and team will be
                  registered in DROPZONE. You can manage your roster afterwards.
                </div>
              </section>
            )}

            {error && (
              <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 break-words">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-[#252b33] mt-8 pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={previousStep}
                  className="px-5 py-3 rounded-lg border border-[#303640] text-sm font-semibold hover:bg-[#20252c]"
                >
                  ← Back
                </button>
              ) : (
                <Link
                  href="/manager/dashboard"
                  className="px-5 py-3 text-sm text-[#9298a1] hover:text-white"
                >
                  Cancel
                </Link>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-7 py-3 rounded-lg bg-[#d6ff3f] text-black font-bold text-sm hover:bg-[#c5ed32]"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 rounded-lg bg-[#d6ff3f] text-black font-bold text-sm hover:bg-[#c5ed32] disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Finish setup →"}
                </button>
              )}
            </div>
          </form>

          {/* Summary panel */}
          <aside className="rounded-2xl border border-[#252b33] bg-[#14181e] p-6">
            <p className="text-xs font-bold tracking-widest text-[#d6ff3f]">
              YOUR SETUP
            </p>
            <h3 className="text-xl font-bold mt-3">Workspace preview</h3>
            <p className="text-sm text-[#9298a1] mt-2">
              Your organization and team details at a glance.
            </p>

            <div className="border-t border-[#252b33] mt-6 pt-5 space-y-5">
              <div>
                <p className="text-xs text-[#737b86]">ORGANIZATION</p>
                <p className="font-semibold mt-1 break-words">
                  {mode === "create"
                    ? organizationName || "Not added yet"
                    : selectedOrganization?.organizationName || "Not selected"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#737b86]">GAME</p>
                <p className="font-semibold mt-1">
                  {selectedGame?.gameName || "Not selected"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#737b86]">TEAM</p>
                <p className="font-semibold mt-1">
                  {teamName || "Not named yet"}
                </p>
              </div>
            </div>

            <div className="mt-7 rounded-xl bg-[#090b0e] border border-[#252b33] p-4">
              <p className="text-sm font-bold">One team per manager</p>
              <p className="text-xs text-[#9298a1] mt-2 leading-relaxed">
                Your account will be linked to the team you create during
                onboarding.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
