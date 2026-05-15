"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Trash2, 
  Layout, 
  Type, 
  Target, 
  Settings,
  Copy,
  Star,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  BarChart3,
  Lightbulb,
  Edit2,
  Heart
} from "lucide-react";

const tabs = [
  { id: "ads", label: "Ads", icon: Layout },
  { id: "copy", label: "Copy Variations", icon: Type },
  { id: "strategy", label: "Strategy", icon: Target },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function CampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("ads");
  const [campaign, setCampaign] = useState(null);
  const [creatives, setCreatives] = useState([]);
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('adgenius_user');
      const campaignData = localStorage.getItem('adgenius_campaigns');
      
      if (userData) {
        setUser(JSON.parse(userData));
        
        if (campaignData) {
          const parsedCampaigns = JSON.parse(campaignData);
          const foundCampaign = parsedCampaigns.find(c => c.id === id);
          if (foundCampaign) {
            setCampaign(foundCampaign);
            setCreatives(foundCampaign.creatives || []);
            // variations would be derived from creatives if not stored separately
          }
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    }
  }, [id, router]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
    </div>
  );

  if (!campaign) return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />
      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="Campaign Details" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-5xl shadow-inner ring-1 ring-indigo-100">
            <span aria-hidden>🔍</span>
          </div>
          <h2 className="text-xl font-bold">Campaign not found</h2>
          <p className="max-w-sm text-sm text-slate-600">This campaign might have been deleted or doesn't exist.</p>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title={campaign.name} />
        
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {/* Back button */}
            <button 
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Campaigns
            </button>

            {/* Campaign Summary Card */}
            <div className="mb-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <h1 className="text-3xl font-bold">{campaign.name}</h1>
                    <p className="mt-2 flex items-center gap-2 text-indigo-100">
                      <ExternalLink className="h-4 w-4" />
                      {campaign.product_url}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur-md transition hover:bg-white/30">
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50">
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Campaign Goal</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Target className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-slate-900 capitalize">{campaign.goal}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Target Platforms</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {campaign.platforms?.map(p => (
                      <span key={p} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 capitalize">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Creation Date</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-slate-900">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 flex gap-8 border-b border-slate-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition ${
                      isActive
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === "ads" && (
              <div className="grid gap-6 sm:grid-cols-2">
                {creatives.map((ad, i) => (
                  <div key={ad.id} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 ring-1 ring-inset ring-indigo-200">
                        {ad.platform}
                      </span>
                      <div className="flex gap-1">
                        <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-indigo-600">
                          <Heart className="h-5 w-5" />
                        </button>
                        <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-indigo-600">
                          <Copy className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{ad.headline}</h3>
                    <p className="mt-3 text-slate-600 leading-relaxed">{ad.body}</p>
                    <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Performance Potential</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-bold">9.2/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "strategy" && (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Campaign Strategy</h2>
                </div>
                <div className="mt-8 space-y-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-6">
                      <h3 className="flex items-center gap-2 font-bold text-slate-900">
                        <Users className="h-4 w-4 text-indigo-600" />
                        Target Audience
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {campaign.audienceTags?.map(tag => (
                          <span key={tag} className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-6">
                      <h3 className="flex items-center gap-2 font-bold text-slate-900">
                        <Type className="h-4 w-4 text-indigo-600" />
                        Tone of Voice
                      </h3>
                      <p className="mt-4 text-sm font-bold text-slate-700 capitalize">{campaign.tone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
