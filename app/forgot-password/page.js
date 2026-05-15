"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Loader2, ArrowLeft } from "lucide-react";

function validateEmail(value) {
  const v = value.trim();
  if (!v) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
  return "";
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const msg = validateEmail(email);
    setError(msg);
    if (msg) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/70 to-indigo-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <Link
          href="/"
          prefetch={false}
          className="mb-8 flex items-center gap-2 font-semibold tracking-tight text-slate-900 transition hover:opacity-90"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
            <Sparkles className="h-5 w-5 text-indigo-600" aria-hidden />
          </span>
          <span className="text-lg">AdGenius AI</span>
        </Link>

        <div className="w-full rounded-2xl border border-slate-100/80 bg-white p-8 shadow-xl shadow-indigo-900/5 ring-1 ring-slate-900/5 sm:p-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Reset Password</h1>
            <p className="mt-2 text-slate-600">We&apos;ll email you a link to reset your password.</p>
          </div>

          {sent ? (
            <div className="mt-8 rounded-lg border border-emerald-100 bg-emerald-50/80 p-4 text-center text-sm text-emerald-900" role="status">
              If an account exists for <span className="font-semibold">{email.trim()}</span>, you&apos;ll receive a reset link shortly.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setSent(false);
                  }}
                  disabled={sent}
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 disabled:bg-slate-50 ${
                    error ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-indigo-600"
                  }`}
                  placeholder="you@company.com"
                  aria-invalid={!!error}
                />
              </div>
              {error ? (
                <p className="mt-1.5 text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading || sent}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Sending…
                </>
              ) : sent ? (
                "Link sent"
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <Link
            href="/login"
            prefetch={false}
            className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
