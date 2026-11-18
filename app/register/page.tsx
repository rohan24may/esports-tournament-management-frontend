
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { register, getPostLoginPath } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const searchParams = useSearchParams();
const redirectTo = searchParams.get("redirectTo");

const loginHref = redirectTo
  ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
  : "/login";
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const user = await register({ fullName, email, password });
     router.replace(getPostLoginPath(user.role, redirectTo));
router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
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
              Join the arena
            </p>
            <h1 className="text-3xl font-bold mb-2">
              Create account
            </h1>
            <p className="text-[#9298a1] text-sm">
              Register as a team manager and get started with DROPZONE.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full name
              </label>
              <input
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] px-4 py-3 outline-none focus:border-[#d6ff3f] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                maxLength={150}
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
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-lg border border-[#252b33] bg-[#090b0e] px-4 py-3 outline-none focus:border-[#d6ff3f] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#9298a1]">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="font-semibold text-[#d6ff3f] hover:underline"
            >
              Sign in
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
