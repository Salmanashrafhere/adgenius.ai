"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
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

function statusBadge(status) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  if (status === "ready") return `${base} bg-emerald-100 text-emerald-800`;
  if (status === "processing") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-red-100 text-red-800`;
}

function platformBadge(platform) {
  const colors = {
    facebook: "bg-blue-50 text-blue-700",
    instagram: "bg-fuchsia-50 text-fuchsia-700",
    tiktok: "bg-slate-900 text-white",
    google: "bg-sky-50 text-sky-700",
    all: "bg-indigo-50 text-indigo-700",
  };
  const c = colors[platform?.toLowerCase()] || "bg-slate-100 text-slate-700";
  return `inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-inset ring-slate-200/10 ${c}`;
}

const colors = [
  "from-indigo-500 to-blue-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-slate-700 to-slate-900",
  "from-orange-500 to-red-600",
  "from-blue-600 to-indigo-700",
  "from-green-500 to-emerald-600"
];

export default function CampaignsPage() {
  const { session, user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All Status");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      fetchCampaigns();
    }
  }, [authLoading]);

  async function fetchCampaigns() {
    if (!supabase) {
      console.log('Supabase not configured');
      setCampaigns([]);
      setLoading(false);
      return;
    }
    try {
      if (!session && !user) return;

      const userId = user?.id || session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('campaigns')
        .select('*, ad_creatives(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCampaign(id) {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    if (!supabase) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);
      if (error) throw error;
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  }

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "All Status" || c.status === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });


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
            {filteredCampaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Gradient Header */}
                <div className={`h-24 w-full bg-gradient-to-br ${colors[index % colors.length]} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {(Array.isArray(campaign.platform) ? campaign.platform : [campaign.platform]).map((p) => (
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
                      <span className="font-medium text-slate-700">{campaign.ad_creatives?.[0]?.count || 0} Ads</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{new Date(campaign.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-2">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-50 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 active:scale-95"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                    <button className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95">
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => deleteCampaign(campaign.id)}
                      className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                    >
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
