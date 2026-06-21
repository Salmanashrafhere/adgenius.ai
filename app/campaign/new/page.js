"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Globe,
  Check,
  Loader2,
  ShoppingCart,
  Users,
  Eye,
  Heart,
  Download,
  X,
  Sparkles,
  ArrowRight,
  Copy,
  ChevronRight,
  Monitor,
  Smartphone,
  ExternalLink,
  FileText,
} from "lucide-react";
import { ToastContainer } from "@/components/Toast";

const STEP_LABELS = ["Product URL", "Configure", "Processing", "Results", "Download"];

const ROTATING_TIPS = [
  "💡 Tip: Our AI analyzes top-performing ads to create yours",
  "💡 Tip: Strong hooks in the first line can lift CTR by 30%+ on Meta.",
  "💡 Tip: Match creative aspect ratio to placement—Stories vs Feed matters.",
  "💡 Tip: Export variants for A/B tests; small copy changes often win big.",
];

const PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: "Facebook" },
  { id: "instagram", label: "Instagram", icon: "Instagram" },
  { id: "tiktok", label: "TikTok", icon: "TikTok" },
  { id: "google", label: "Google", icon: "Google" },
  { id: "all", label: "All Platforms", icon: "Sparkles" },
];

const GOALS = [
  { id: "sales", label: "Sales", desc: "Drive purchases", icon: ShoppingCart },
  { id: "leads", label: "Lead Generation", desc: "Capture signups", icon: Users },
  { id: "brand", label: "Brand Awareness", desc: "Reach & recall", icon: Eye },
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

export default function NewCampaignPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [toasts, setToasts] = useState([]);

  /* Step 1 */
  const [productUrl, setProductUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  /* Step 2 */
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("Professional");
  const [audienceTags, setAudienceTags] = useState([]);

  /* Step 3 */
  const [progress, setProgress] = useState(0);
  const [processingPhase, setProcessingPhase] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  /* Step 4 & 5 */
  const [campaignData, setCampaignData] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('adgenius_user');
      if (userData) {
        setUser(JSON.parse(userData));
        setLoading(false);
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  const runConfigure = async () => {
    if (selectedPlatforms.length === 0) return showToast("Select a platform", "error");
    if (!goal) return showToast("Select a goal", "error");

    setStep(3);
    
    // Simulating initial phase
    setProcessingPhase(0);
    setProgress(10);
    setTipIndex(0);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productUrl,
          platform: selectedPlatforms,
          goal,
          tone,
          audienceTags,
          userId: user?.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Generation failed');
      }

      // Simulation of remaining phases for UX
      for (let i = 1; i <= 3; i++) {
        setProcessingPhase(i);
        setProgress((i + 1) * 25);
        setTipIndex(i % ROTATING_TIPS.length);
        await new Promise(r => setTimeout(r, 800));
      }

      const newCampaign = {
        id: data.campaignId || Date.now().toString(),
        name: productUrl.replace(/^https?:\/\//, '').split('/')[0] || 'New Campaign',
        productUrl: productUrl,
        platform: selectedPlatforms,
        goal: goal,
        tone: tone,
        status: 'ready',
        adsCount: data.headlines?.length || 0,
        headlines: data.headlines || [],
        bodycopies: data.bodyCopies || data.bodycopies || [],
        ctas: data.ctas || [],
        angles: data.angles || [],
        strategy: data.strategy || '',
        targetAudience: data.targetAudience || audienceTags.join(', ') || 'General Audience',
        createdAt: new Date().toISOString()
      };

      // Save campaign 
      const existing = JSON.parse(localStorage.getItem('adgenius_campaigns') || '[]');
      existing.unshift(newCampaign);
      localStorage.setItem('adgenius_campaigns', JSON.stringify(existing));

      // Add notification
      const notifications = JSON.parse(localStorage.getItem('adgenius_notifications') || '[]');
      notifications.unshift({
        id: Date.now(),
        title: 'Campaign Ready! 🎉',
        message: `${newCampaign.name} - ${newCampaign.adsCount} ads generated`,
        time: 'Just now',
        read: false,
        type: 'success'
      });
      localStorage.setItem('adgenius_notifications', JSON.stringify(notifications));

      // Update user credits
      const userData = JSON.parse(localStorage.getItem('adgenius_user') || '{}');
      userData.credits = Math.max(0, (userData.credits || 10) - 1);
      localStorage.setItem('adgenius_user', JSON.stringify(userData));
      setUser(userData);

      setCampaignData(newCampaign);
      setStep(4);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to generate campaign", "error");
      setStep(2);
    }
  };

  const downloadAll = () => {
    if (!campaignData) return;
    const content = campaignData.headlines.map((h, i) =>
      `AD ${i+1}\nHeadline: ${h}\nBody: ${campaignData.bodycopies[i % campaignData.bodycopies.length]}\nCTA: ${campaignData.ctas[i % campaignData.ctas.length]}\n\n`
    ).join('---\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adgenius-${campaignData.name.toLowerCase().replace(/\s+/g, '-')}-ads.txt`;
    a.click();
    showToast("Download started", "success");
    setStep(5);
  };

  const copyAdText = (ad) => {
    const text = `Headline: ${ad.headline}\nBody: ${ad.body}\nCTA: ${ad.cta}`;
    navigator.clipboard.writeText(text);
    showToast("Ad text copied!", "success");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      <Sidebar />
      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="New Campaign" />
        
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {/* Stepper */}
          <div className="mx-auto mb-12 max-w-4xl px-4">
            <div className="relative flex justify-between">
              <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-slate-200" />
              <div className="absolute left-0 top-1/2 h-0.5 bg-indigo-600 transition-all duration-500 -translate-y-1/2" style={{ width: `${((step - 1) / 4) * 100}%` }} />
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="relative z-10 flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    step > i + 1 ? "bg-indigo-600 border-indigo-600 text-white" :
                    step === i + 1 ? "bg-white border-indigo-600 text-indigo-600 shadow-md" :
                    "bg-white border-slate-200 text-slate-400"
                  }`}>
                    {step > i + 1 ? <Check className="h-5 w-5" /> : <span>{i + 1}</span>}
                  </div>
                  <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider hidden sm:block ${step === i + 1 ? "text-indigo-600" : "text-slate-500"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
            {step === 1 && (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl sm:p-12">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                    <Globe className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">What are we promoting?</h2>
                  <p className="mt-3 text-lg text-slate-600">Paste your product URL to get started.</p>
                </div>
                <form
                  className="mt-10"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (productUrl) setStep(2);
                    else showToast("Please enter a URL", "error");
                  }}
                >
                  <label htmlFor="product-url" className="sr-only">Product URL</label>
                  <input
                    id="product-url"
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://yourstore.com/product"
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-4 px-6 text-lg focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="mt-6 w-full rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
                  >
                    Analyze Product
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                  <h2 className="text-2xl font-bold mb-6">Configure Campaign</h2>
                  <div className="grid gap-8">
                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Platforms</label>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {PLATFORMS.map(p => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(i => i !== p.id) : [...prev, p.id])}
                            className={`rounded-xl border-2 px-6 py-3 font-bold transition-all ${
                              selectedPlatforms.includes(p.id) ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-50 bg-slate-50/50 text-slate-600"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Campaign Goal</label>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {GOALS.map(g => (
                          <button
                            key={g.id}
                            onClick={() => setGoal(g.id)}
                            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
                              goal === g.id ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-50 bg-slate-50/50 text-slate-600"
                            }`}
                          >
                            <g.icon className="h-6 w-6" />
                            <span className="font-bold">{g.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={runConfigure}
                      className="w-full rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
                    >
                      Generate Ads
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mb-8" />
                <h2 className="text-3xl font-bold mb-4">
                  {processingPhase === 0 && "Analyzing Product..."}
                  {processingPhase === 1 && "Writing Ad Copy..."}
                  {processingPhase === 2 && "Designing Creatives..."}
                  {processingPhase === 3 && "Finalizing..."}
                </h2>
                <div className="w-full max-w-md bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-8 text-slate-500 italic px-4">{ROTATING_TIPS[tipIndex]}</p>
              </div>
            )}

            {step === 4 && campaignData && (
              <div className="space-y-10">
                <div className="flex items-center justify-between px-4 sm:px-0">
                  <h2 className="text-2xl font-bold sm:text-3xl">Your Generated Ads</h2>
                  <button onClick={downloadAll} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-500">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download All</span>
                  </button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {campaignData.headlines.map((h, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedAd({
                        headline: h,
                        body: campaignData.bodycopies[i % campaignData.bodycopies.length],
                        cta: campaignData.ctas[i % campaignData.ctas.length],
                        platform: campaignData.platform[0]
                      })}
                      className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl transition hover:-translate-y-1"
                    >
                      <div className={`h-40 rounded-2xl bg-gradient-to-br mb-6 ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`} />
                      <div className="flex items-center justify-between mb-4">
                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                          {campaignData.platform[0]}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); copyAdText({ headline: h, body: campaignData.bodycopies[i % campaignData.bodycopies.length], cta: campaignData.ctas[i % campaignData.ctas.length] }); }}
                            className="p-2 text-slate-400 hover:text-indigo-600"
                            aria-label="Copy ad text"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); showToast("Downloading...", "info"); }}
                            className="p-2 text-slate-400 hover:text-indigo-600"
                            aria-label="Download ad creative"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{h}</h3>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-6">
                        {campaignData.bodycopies[i % campaignData.bodycopies.length]}
                      </p>
                      <button className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white">
                        {campaignData.ctas[i % campaignData.ctas.length]}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-inner">
                  <Check className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-900">Campaign Exported!</h2>
                <p className="mt-4 max-w-md text-lg text-slate-600">
                  Your ads have been generated and saved. You can find them anytime in your dashboard.
                </p>
                <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link 
                    href="/dashboard" 
                    prefetch={false}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-10 py-4 text-lg font-bold text-white shadow-xl transition hover:bg-slate-800 active:scale-95"
                  >
                    Go to Dashboard
                  </Link>
                  <button onClick={() => setStep(4)} className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-10 py-4 text-lg font-bold text-slate-600 transition hover:bg-slate-50 active:scale-95">
                    View Ads Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Ad Preview Modal */}
      {selectedAd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedAd(null)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <button
              onClick={() => setSelectedAd(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/40 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-64 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="rounded-lg bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  {selectedAd.platform}
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight">{selectedAd.headline}</h2>
            </div>
            <div className="p-8">
              <div className="mb-8">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Ad Body Copy</label>
                <p className="text-slate-600 leading-relaxed text-lg">{selectedAd.body}</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="flex-1 rounded-2xl bg-slate-900 py-4 text-lg font-bold text-white hover:bg-slate-800 transition active:scale-95">
                  {selectedAd.cta}
                </button>
                <button onClick={() => copyAdText(selectedAd)} className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-100 px-6 py-4 font-bold hover:bg-slate-50 transition">
                  <Copy className="h-5 w-5" />
                  Copy All Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
