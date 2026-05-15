"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Home, LayoutDashboard, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration */}
        <div className="mb-8 relative">
          <div className="text-9xl font-black text-slate-200 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">
            🕵️‍♂️
          </div>
          <div className="absolute -top-4 left-1/2 -translate-x-20 text-4xl animate-pulse">
            ✨
          </div>
          <div className="absolute top-0 left-1/2 translate-x-12 text-3xl">
            🔍
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">404 - Page Not Found</h1>
        <p className="text-slate-600 mb-10 text-lg">
          Oops! The page you're looking for has vanished into thin air. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            prefetch={false}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-500 active:scale-95"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            prefetch={false}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-slate-50 active:scale-95"
          >
            Back Home
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Brand logo at bottom */}
        <div className="mt-16 flex items-center justify-center gap-2 opacity-40 grayscale">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 ring-1 ring-indigo-100">
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900">AdGenius AI</span>
        </div>
      </div>
    </div>
  );
}
