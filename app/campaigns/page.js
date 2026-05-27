"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  MoreVertical,
  X,
} from "lucide-react";
import { ToastContainer } from "@/components/Toast";

function statusBadge(status) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  if (status === "ready") return `${base} bg-emerald-100 text-emerald-800`;
  if (status === "processing") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-red-100 text-red-800`;
}

function platformBadge(platform) {
  const p = Array.isArray(platform) ? platform[0] : platform;
  const colors = {
    facebook: "bg-blue-50 text-blue-700",
    instagram: "bg-fuchsia-50 text-fuchsia-700",
    tiktok: "bg-slate-900 text-white",
    google: "bg-sky-50 text-sky-700",
    all: "bg-indigo-50 text-indigo-700",
  };
  const c = colors[p?.toLowerCase()] || "bg-slate-100 text-slate-700";
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
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('adgenius_user');
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Fetch campaigns from API
        const fetchCampaigns = async () => {
          try {
            const response = await fetch(`/api/campaigns?userId=${parsedUser.id}`);
            const data = await response.json();
            if (response.ok && data.success) {
              setCampaigns(data.campaigns);
            } else {
              // Fallback to local storage
              const campaignData = localStorage.getItem('adgenius_campaigns');
              if (campaignData) setCampaigns(JSON.parse(campaignData));
            }
          } catch (err) {
            console.error('Failed to fetch campaigns:', err);
            const campaignData = localStorage.getItem('adgenius_campaigns');
            if (campaignData) setCampaigns(JSON.parse(campaignData));
          } finally {
            setLoading(false);
          }
        };

        fetchCampaigns();
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  const deleteCampaign = (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    localStorage.setItem('adgenius_campaigns', JSON.stringify(updated));
    showToast("Campaign deleted", "success");
  };

  // Performance: Memoize filtered results and normalize query once outside the loop
  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return campaigns;
    const normalizedQuery = searchQuery.toLowerCase();
    return campaigns.filter(c =>
      c.name.toLowerCase().includes(normalizedQuery)
    );
  }, [campaigns, searchQuery]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="My Campaigns" />
          
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
          <Link
            href="/campaign/new"
            prefetch={false}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Link>
        </div>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-50 text-5xl shadow-inner">
                <span aria-hidden>📣</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No campaigns found</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-600">Start your first campaign to see it here.</p>
              <button
                onClick={() => router.push("/campaign/new")}
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500"
              >
                Create Your First Campaign
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className={`h-24 w-full bg-gradient-to-br ${colors[index % colors.length]} p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span className={platformBadge(campaign.platform)}>{campaign.platform[0]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">{campaign.name}</h3>
                      <span className={statusBadge(campaign.status)}>{campaign.status}</span>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Layers className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{campaign.adsCount || 0} Ads</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{new Date(campaign.createdAt || campaign.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        prefetch={false}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-50 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 active:scale-95"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                      <button onClick={() => deleteCampaign(campaign.id)} className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
