
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, getDashboardPath } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({ email, password });
      router.replace(getDashboardPath(user.role));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <span className="text-3xl font-black tracking-tight">
            DROP<span className="text-[#d6ff3f]">ZONE</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-[#252b33] bg-[#14181e] p-8 sm:p-10">
          <div className="mb-8">
            <p className="text-[#d6ff3f] text-xs font-bold tracking-[0.25em] uppercase mb-3">
              Welcome back
            </p>
            <h1 className="text-3xl font-bold mb-2">Sign in</h1>
            <p className="text-[#9298a1] text-sm">
              Enter your credentials to access DROPZONE.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] px-4 py-3 outline-none focus:border-[#d6ff3f] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] px-4 py-3 outline-none focus:border-[#d6ff3f] transition"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 break-words">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#d6ff3f] py-3.5 font-bold text-[#090b0e] transition hover:bg-[#c5ed32] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#9298a1]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#d6ff3f] hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="block text-center text-sm text-[#9298a1] mt-7 hover:text-white"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
