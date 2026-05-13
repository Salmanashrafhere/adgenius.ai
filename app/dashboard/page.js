"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Megaphone,
  Image as ImageIcon,
  TrendingUp,
  Zap,
  Eye,
  Download,
  Trash2,
} from "lucide-react";

const initialCampaigns = [
  { id: "1", name: "Nike Shoes Summer", platform: "Facebook", status: "Ready", ads: 20, date: "2026-05-08" },
  { id: "2", name: "iPhone 15 Pro", platform: "Instagram", status: "Ready", ads: 15, date: "2026-05-07" },
  { id: "3", name: "Coffee Brand", platform: "TikTok", status: "Processing", ads: 0, date: "2026-05-06" },
  { id: "4", name: "Laptop Deal", platform: "Google", status: "Failed", ads: 0, date: "2026-05-05" },
  { id: "5", name: "Fashion Store", platform: "All", status: "Ready", ads: 50, date: "2026-05-04" },
];

function statusBadge(status) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  if (status === "Ready") return `${base} bg-emerald-100 text-emerald-800`;
  if (status === "Processing") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-red-100 text-red-800`;
}

function platformBadge(platform) {
  const colors = {
    Facebook: "bg-blue-50 text-blue-700 ring-blue-100",
    Instagram: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100",
    TikTok: "bg-slate-900 text-white ring-slate-700",
    Google: "bg-sky-50 text-sky-700 ring-sky-100",
    All: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  };
  const c = colors[platform] || "bg-slate-100 text-slate-700 ring-slate-200";
  return `inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${c}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  function removeCampaign(id) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />

      {/* Main column */}
      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="Dashboard" />

        <main className="flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Campaigns", value: "12", icon: Megaphone, iconBg: "bg-indigo-50 text-indigo-600 ring-indigo-100" },
              { label: "Ads Generated", value: "240", icon: ImageIcon, iconBg: "bg-purple-50 text-purple-600 ring-purple-100" },
              { label: "Credits Remaining", value: "150", icon: Zap, iconBg: "bg-amber-50 text-amber-600 ring-amber-100" },
              { label: "Avg CTR", value: "3.2%", icon: TrendingUp, iconBg: "bg-emerald-50 text-emerald-600 ring-emerald-100" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{s.label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{s.value}</p>
                  </div>
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset ${s.iconBg}`}>
                    <s.icon className="h-5 w-5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/campaign/new"
                prefetch={false}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 hover:shadow-indigo-600/35 active:scale-[0.99] sm:w-auto"
              >
                <Megaphone className="h-4 w-4" />
                New Campaign
              </Link>
              <Link
                href="/campaigns"
                prefetch={false}
                className="flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-slate-50 active:scale-[0.99] sm:w-auto"
              >
                Browse Templates
              </Link>
              <Link
                href="/dashboard"
                prefetch={false}
                className="flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-slate-50 active:scale-[0.99] sm:w-auto"
              >
                View Analytics
              </Link>
            </div>
          </div>

          {/* Recent campaigns */}
          <section className="rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent campaigns</h2>
              <Link
                href="/campaigns"
                prefetch={false}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View All Campaigns →
              </Link>
            </div>

            {campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-5xl shadow-inner ring-1 ring-indigo-100">
                  <span aria-hidden>📣</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No campaigns yet</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-600">Launch your first campaign to generate ads across Facebook, Instagram, and TikTok.</p>
                <button
                  type="button"
                  onClick={() => router.push("/campaign/new")}
                  className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-[0.99]"
                >
                  Create Your First Campaign
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-3">Campaign Name</th>
                      <th className="px-6 py-3">Platform</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Ads</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {campaigns.map((row) => (
                      <tr key={row.id} className="transition hover:bg-slate-50/80">
                        <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                        <td className="px-6 py-4">
                          <span className={platformBadge(row.platform)}>{row.platform}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={statusBadge(row.status)}>{row.status}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{row.ads}</td>
                        <td className="px-6 py-4 text-slate-600">{row.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            <Link
                              href="/campaigns/1"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
                              aria-label="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              type="button"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
                              aria-label="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeCampaign(row.id)}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 active:scale-95"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
