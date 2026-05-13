"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  Eye, 
  Download, 
  Trash2,
  Calendar,
  Layers,
  MoreVertical
} from "lucide-react";

const campaigns = [
  { id: "1", name: "Nike Shoes Summer Sale", platform: ["Facebook", "Instagram"], status: "Ready", ads: 24, date: "May 12, 2026", color: "from-indigo-500 to-blue-600" },
  { id: "2", name: "iPhone 15 Pro Launch", platform: ["Instagram", "TikTok"], status: "Ready", ads: 18, date: "May 10, 2026", color: "from-purple-500 to-pink-600" },
  { id: "3", name: "Starbucks Morning Coffee", platform: ["TikTok"], status: "Processing", ads: 0, date: "May 09, 2026", color: "from-emerald-500 to-teal-600" },
  { id: "4", name: "Tesla Model 3 Promo", platform: ["Google", "Facebook"], status: "Failed", ads: 0, date: "May 08, 2026", color: "from-slate-700 to-slate-900" },
  { id: "5", name: "Fashion Week Collection", platform: ["All"], status: "Ready", ads: 42, date: "May 07, 2026", color: "from-orange-500 to-red-600" },
  { id: "6", name: "Gaming Headset Review", platform: ["TikTok", "Instagram"], status: "Ready", ads: 12, date: "May 06, 2026", color: "from-blue-600 to-indigo-700" },
  { id: "7", name: "Eco-Friendly Water Bottle", platform: ["Facebook"], status: "Ready", ads: 15, date: "May 05, 2026", color: "from-green-500 to-emerald-600" },
  { id: "8", name: "Online Course: AI Basics", platform: ["Google"], status: "Processing", ads: 0, date: "May 04, 2026", color: "from-indigo-600 to-purple-700" },
  { id: "9", name: "Pet Food Subscription", platform: ["Instagram"], status: "Ready", ads: 20, date: "May 03, 2026", color: "from-amber-500 to-orange-600" },
];

function statusBadge(status) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  if (status === "Ready") return `${base} bg-emerald-100 text-emerald-800`;
  if (status === "Processing") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-red-100 text-red-800`;
}

function platformBadge(platform) {
  const colors = {
    Facebook: "bg-blue-50 text-blue-700",
    Instagram: "bg-fuchsia-50 text-fuchsia-700",
    TikTok: "bg-slate-900 text-white",
    Google: "bg-sky-50 text-sky-700",
    All: "bg-indigo-50 text-indigo-700",
  };
  const c = colors[platform] || "bg-slate-100 text-slate-700";
  return `inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-inset ring-slate-200/10 ${c}`;
}

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="My Campaigns" />
          
        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-white/50 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium focus:border-indigo-600 focus:outline-none"
              >
                <option>All Status</option>
                <option>Ready</option>
                <option>Processing</option>
                <option>Failed</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-end">
            <Link
              href="/campaign/new"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              New Campaign
            </Link>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Gradient Header */}
                <div className={`h-24 w-full bg-gradient-to-br ${campaign.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {campaign.platform.map((p) => (
                        <span key={p} className={platformBadge(p)}>{p}</span>
                      ))}
                    </div>
                    <button className="rounded-lg bg-white/20 p-1.5 text-white backdrop-blur-md transition hover:bg-white/30">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {campaign.name}
                    </h3>
                    <span className={statusBadge(campaign.status)}>{campaign.status}</span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Layers className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{campaign.ads} Ads</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{campaign.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-2">
                    <Link
                      href="/campaigns/1"
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-50 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 active:scale-95"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                    <button className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 transition hover:border-indigo-600 hover:text-indigo-600 shadow-sm">
              1
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-indigo-600 hover:text-indigo-600 shadow-sm">
              2
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-indigo-600 hover:text-indigo-600 shadow-sm">
              3
            </button>
            <span className="mx-2 text-slate-400">...</span>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-indigo-600 hover:text-indigo-600 shadow-sm">
              12
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
