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
  Heart,
  ChevronRight,
} from "lucide-react";
import { ToastContainer } from "@/components/Toast";

const tabs = [
  { id: "ads", label: "Ads", icon: Layout },
  { id: "copy", label: "Copy Variations", icon: Type },
  { id: "strategy", label: "Strategy", icon: Target },
];

const CARD_GRADIENTS = [
  "from-violet-500 to-fuchsia-600",
  "from-amber-400 to-orange-500",
  "from-slate-800 to-slate-600",
  "from-sky-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-red-600",
  "from-indigo-500 to-purple-600",
  "from-cyan-500 to-blue-600",
];

export default function CampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("ads");
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('adgenius_user');
      const saved = localStorage.getItem('adgenius_campaigns');
      
      if (userData) setUser(JSON.parse(userData));
      
      if (saved) {
        const campaigns = JSON.parse(saved);
        const found = campaigns.find(c => c.id === id);
        if (found) setCampaign(found);
      }
      setLoading(false);
    }
  }, [id]);

  const deleteCampaign = () => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    const saved = JSON.parse(localStorage.getItem('adgenius_campaigns') || '[]');
    const updated = saved.filter(c => c.id !== id);
    localStorage.setItem('adgenius_campaigns', JSON.stringify(updated));
    router.push('/campaigns');
  };

  const copyText = (text) => {
    try {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Copied!", "success");
      }).catch(() => {
        // Fallback or just show error
        showToast("Failed to copy. Please try manually.", "error");
      });
    } catch (err) {
      showToast("Failed to copy. Please try manually.", "error");
    }
  };

  const downloadAd = (headline) => {
    showToast(`Downloading ad: ${headline.substring(0, 20)}...`, "info");
  };

  if (loading) return null;

  if (!campaign) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Campaign not found</h2>
        <Link href="/dashboard" prefetch={false} className="text-indigo-600 font-bold hover:underline">Back to Dashboard</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title={campaign.name} />
        
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition">
              <ArrowLeft className="h-4 w-4" />
              Back to Campaigns
            </button>

            <div className="mb-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <h1 className="text-3xl font-bold">{campaign.name}</h1>
                    <p className="mt-2 flex items-center gap-2 text-indigo-100 text-sm">
                      <ExternalLink className="h-4 w-4" />
                      {campaign.productUrl}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={deleteCampaign} className="flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-2 text-sm font-bold backdrop-blur-md hover:bg-red-500/30 transition">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition">
                      <Download className="h-4 w-4" />
                      Export All
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 p-6 bg-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Goal</p>
                  <p className="mt-1 font-bold text-slate-900 capitalize">{campaign.goal}</p>
                </div>
                <div className="sm:px-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Platforms</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {campaign.platform?.map(p => (
                      <span key={p} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="sm:pl-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Created</p>
                  <p className="mt-1 font-bold text-slate-900">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex gap-8 border-b border-slate-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition ${
                      isActive ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "ads" && (
              <div className="grid gap-6 sm:grid-cols-2">
                {campaign.headlines.map((h, i) => (
                  <div key={i} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl transition hover:-translate-y-1">
                    <div className={`h-40 rounded-2xl bg-gradient-to-br mb-6 ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`} />
                    <div className="flex items-center justify-between mb-4">
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        {campaign.platform[0]}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => copyText(h)} className="p-2 text-slate-400 hover:text-indigo-600"><Copy className="h-4 w-4" /></button>
                        <button onClick={() => downloadAd(h)} className="p-2 text-slate-400 hover:text-indigo-600"><Download className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{h}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{campaign.bodycopies[i % campaign.bodycopies.length]}</p>
                    <button className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white">
                      {campaign.ctas[i % campaign.ctas.length]}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "copy" && (
              <div className="space-y-8">
                <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Type className="h-5 w-5 text-indigo-600" />
                    Headlines
                  </h3>
                  <div className="space-y-3">
                    {campaign.headlines.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 group">
                        <p className="text-sm font-medium text-slate-700">{h}</p>
                        <button onClick={() => copyText(h)} className="p-2 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition"><Copy className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Body Copies
                  </h3>
                  <div className="space-y-4">
                    {campaign.bodycopies.map((b, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 group relative">
                        <p className="text-sm text-slate-600 leading-relaxed pr-10">{b}</p>
                        <button onClick={() => copyText(b)} className="absolute right-4 top-4 p-2 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition"><Copy className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    Call to Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {campaign.ctas.map((c, i) => (
                      <button key={i} onClick={() => copyText(c)} className="px-6 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm border border-indigo-100 hover:bg-indigo-100 transition active:scale-95">
                        {c}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "strategy" && (
              <div className="space-y-8">
                <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Campaign Strategy</h2>
                  </div>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <h4 className="flex items-center gap-2 font-bold mb-4 text-slate-900">
                        <Users className="h-4 w-4 text-indigo-600" />
                        Target Audience
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{campaign.targetAudience}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <h4 className="flex items-center gap-2 font-bold mb-4 text-slate-900">
                        <BarChart3 className="h-4 w-4 text-indigo-600" />
                        Recommended Budget
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">We recommend a starting budget of $500 - $1,500 per month for this campaign type.</p>
                    </div>
                  </div>
                  <div className="mt-8 p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <h4 className="font-bold mb-2 text-indigo-900">AI Strategy Insights</h4>
                    <p className="text-sm text-indigo-800 leading-relaxed">{campaign.strategy}</p>
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
