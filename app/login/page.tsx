"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  login,
  getPostLoginPath,
  type UserRole,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("TEAM_MANAGER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = searchParams.get("redirectTo");

  const registerHref = redirectTo
    ? `/register?redirectTo=${encodeURIComponent(redirectTo)}`
    : "/register";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({ email, password, role });

      const destination = getPostLoginPath(user.role, redirectTo);

      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090b0e] px-5 py-12 text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#d6ff3f]/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#d6ff3f]/[0.05] blur-[120px]" />

      <div className="relative z-10 w-full max-w-[440px]">

        {/* Logo */}
        <div className="mb-9 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-3xl font-black tracking-tighter transition hover:opacity-80"
          >
            DROP<span className="text-[#d6ff3f]">ZONE</span>
            <span className="ml-2 h-2 w-2 rounded-full bg-[#d6ff3f] shadow-[0_0_12px_#d6ff3f]" />
          </Link>

          <p className="mt-2 text-[10px] font-semibold tracking-[0.3em] text-[#68717c]">
            COMPETITIVE GAMING PLATFORM
          </p>
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-2xl border border-[#272e36] bg-[#14181e]/95 shadow-2xl shadow-black/40 backdrop-blur-xl">

          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#d6ff3f] to-transparent" />

          <div className="p-7 sm:p-9">

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#d6ff3f]">
                Welcome back
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                Sign in to DROPZONE
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-[#9298a1]">
                Enter your account details to continue to your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Account Type */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium text-[#dce0e5]"
                >
                  Account type
                </label>

                <div className="relative">
                  <select
                    id="role"
                    required
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as UserRole)
                    }
                    className="w-full appearance-none rounded-xl border border-[#303741] bg-[#0b0e12] px-4 py-3.5 pr-11 text-sm text-white outline-none transition hover:border-[#555f6b] focus:border-[#d6ff3f] focus:ring-2 focus:ring-[#d6ff3f]/10"
                  >
                    <option value="TEAM_MANAGER">Team Manager</option>
                    <option value="ORGANIZER">Tournament Organizer</option>
                    <option value="PLAYER">Player</option>
                    <option value="VIEWER">Viewer</option>
                  </select>

                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9298a1]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#dce0e5]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#303741] bg-[#0b0e12] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#555e69] hover:border-[#555f6b] focus:border-[#d6ff3f] focus:ring-2 focus:ring-[#d6ff3f]/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#dce0e5]"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#303741] bg-[#0b0e12] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#555e69] hover:border-[#555f6b] focus:border-[#d6ff3f] focus:ring-2 focus:ring-[#d6ff3f]/10"
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/[0.08] px-4 py-3 text-sm leading-relaxed text-red-400"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#d6ff3f] py-3.5 font-bold text-[#090b0e] shadow-lg shadow-[#d6ff3f]/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#c8f12f] hover:shadow-[#d6ff3f]/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#090b0e]/30 border-t-[#090b0e]" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Registration */}
            <div className="mt-7 border-t border-[#272e36] pt-6 text-center">
              <p className="text-sm text-[#9298a1]">
                Don&apos;t have an account?{" "}
                <Link
                  href={registerHref}
                  className="font-semibold text-[#d6ff3f] transition hover:text-white"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Link
          href="/"
          className="mt-7 block text-center text-sm text-[#737c87] transition hover:text-[#d6ff3f]"
        >
          ← Back to home
        </Link>

        <p className="mt-5 text-center text-[10px] tracking-widest text-[#454d57]">
          DROPZONE © 2026
        </p>
      </div>
    </main>
  );
}