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
} from "lucide-react";

const STEP_LABELS = ["Product URL", "Configure", "Processing", "Results", "Download"];

const ROTATING_TIPS = [
  "💡 Tip: Our AI analyzes top-performing ads to create yours",
  "💡 Tip: Strong hooks in the first line can lift CTR by 30%+ on Meta.",
  "💡 Tip: Match creative aspect ratio to placement—Stories vs Feed matters.",
  "💡 Tip: Export variants for A/B tests; small copy changes often win big.",
];

const EXAMPLE_URLS = ["amazon.com/product/...", "shopify-store.com/products/...", "any-website.com/product/..."];

function GoogleG({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function FacebookF({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const INSTAGRAM_GRADIENT_ID = "insta-grad-adgenius";

function InstagramMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id={INSTAGRAM_GRADIENT_ID} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="50%" stopColor="#e6683c" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill={`url(#${INSTAGRAM_GRADIENT_ID})`} />
      <path
        fill="white"
        d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm5-8.4a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z"
      />
    </svg>
  );
}

function TikTokMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64v-3.4a6.33 6.33 0 0 0-1.88-.28 6.34 6.34 0 1 0 6.34 6.34c-.01-.21 0-.43 0-.65V9.6a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.03z" />
    </svg>
  );
}

function isValidHttpUrl(value) {
  const v = value.trim();
  if (!v) return false;
  try {
    const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    const u = new URL(withProto);
    return Boolean(u.hostname && u.hostname.includes("."));
  } catch {
    return false;
  }
}

const PLATFORMS = [
  { id: "facebook", label: "Facebook", Icon: FacebookF, cardClass: "ring-blue-100 hover:border-blue-200" },
  { id: "instagram", label: "Instagram", Icon: InstagramMark, cardClass: "ring-fuchsia-100 hover:border-fuchsia-200" },
  { id: "tiktok", label: "TikTok", Icon: TikTokMark, cardClass: "ring-slate-200 hover:border-slate-300", iconWrap: "text-slate-900" },
  { id: "google", label: "Google", Icon: GoogleG, cardClass: "ring-sky-100 hover:border-sky-200" },
  { id: "all", label: "All Platforms", Icon: Sparkles, cardClass: "ring-indigo-100 hover:border-indigo-200", iconWrap: "text-indigo-600" },
];

const GOALS = [
  { id: "sales", label: "Sales", desc: "Drive purchases", icon: ShoppingCart },
  { id: "leads", label: "Lead Generation", desc: "Capture signups", icon: Users },
  { id: "brand", label: "Brand Awareness", desc: "Reach & recall", icon: Eye },
];

const TONES = ["Professional", "Friendly", "Urgent", "Luxurious"];

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
  const pathname = usePathname();
  const [step, setStep] = useState(1);

  /* Step 1 */
  const [productUrl, setProductUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [urlValidated, setUrlValidated] = useState(false);

  /* Step 2 */
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState(500);
  const [tone, setTone] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [audienceTags, setAudienceTags] = useState([]);
  const [configError, setConfigError] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const generateAbortRef = useRef(null);
  const genInProgress = useRef(false);

  /* Step 3 */
  const [progress, setProgress] = useState(0);
  const [processingPhase, setProcessingPhase] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const advanceTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const phaseTimerRef = useRef(null);
  const tipTimerRef = useRef(null);

  /* Step 4 */
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState({});
  const [selectedAds, setSelectedAds] = useState({});

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

  const clearProcessingTimers = useCallback(() => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    if (tipTimerRef.current) clearInterval(tipTimerRef.current);
    advanceTimerRef.current = null;
    progressTimerRef.current = null;
    phaseTimerRef.current = null;
    tipTimerRef.current = null;
  }, []);

  useEffect(() => {
    if (step !== 3 || !generateLoading) {
      clearProcessingTimers();
      return;
    }

    setProgress(5);
    setTipIndex(0);

    const start = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(98, 5 + (elapsed / 60000) * 93);
      setProgress(pct);
    }, 200);

    tipTimerRef.current = setInterval(() => {
      setTipIndex((i) => (i + 1) % ROTATING_TIPS.length);
    }, 3500);

    return clearProcessingTimers;
  }, [step, generateLoading, clearProcessingTimers]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  function analyzeUrl() {
    setUrlError("");
    if (!isValidHttpUrl(productUrl)) {
      setUrlValidated(false);
      setUrlError("Enter a valid URL (include a domain, e.g. example.com/product)");
      return;
    }
    setUrlValidated(true);
  }

  function togglePlatform(id) {
    setSelectedPlatforms((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setConfigError("");
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t) return;
    if (!audienceTags.includes(t)) setAudienceTags((prev) => [...prev, t]);
    setTagInput("");
  }

  function removeTag(t) {
    setAudienceTags((prev) => prev.filter((x) => x !== t));
  }

  async function runConfigure() {
    if (genInProgress.current) return;

    if (selectedPlatforms.length === 0) {
      setConfigError("Select at least one platform.");
      return;
    }
    if (!goal) {
      setConfigError("Select a campaign goal.");
      return;
    }
    if (!tone) {
      setConfigError("Select a brand tone.");
      return;
    }

    setGenerateLoading(true);
    setStep(3);
    genInProgress.current = true;
    setProcessingPhase(0);

    try {
      // Simulate generation for now since we are in simple mode
      await new Promise(r => setTimeout(r, 2000));
      setProcessingPhase(1);
      await new Promise(r => setTimeout(r, 2000));
      setProcessingPhase(2);
      await new Promise(r => setTimeout(r, 2000));
      setProcessingPhase(3);
      await new Promise(r => setTimeout(r, 2000));

      // Mock campaign data
      const newCampaign = {
        id: `camp_${Date.now()}`,
        name: productUrl.replace(/^https?:\/\//, '').split('/')[0] || "New Campaign",
        product_url: productUrl,
        goal,
        platforms: selectedPlatforms,
        tone,
        audienceTags,
        status: 'ready',
        created_at: new Date().toISOString(),
        creatives: [
          { id: 1, headline: "Boost Your Sales", body: "Use AdGenius to generate high-performing ads.", platform: selectedPlatforms[0] || "facebook" },
          { id: 2, headline: "Scale Faster", body: "AI-powered creative generation for modern brands.", platform: selectedPlatforms[0] || "instagram" }
        ],
        ad_creatives: [{ count: 2 }] // For dashboard display
      };

      // Save to localStorage
      const existingCampaigns = JSON.parse(localStorage.getItem('adgenius_campaigns') || '[]');
      localStorage.setItem('adgenius_campaigns', JSON.stringify([newCampaign, ...existingCampaigns]));

      // Update user credits
      if (user) {
        const updatedUser = { ...user, credits: Math.max(0, (user.credits || 0) - 1) };
        localStorage.setItem('adgenius_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      setCampaignData(newCampaign);
      setStep(4);
    } catch (err) {
      console.error(err);
      setStep(2);
      setConfigError("Generation failed. Please try again.");
    } finally {
      setGenerateLoading(false);
      genInProgress.current = false;
    }
  }

  // Rest of the UI remains mostly the same but uses local state...
  // For brevity, I'll keep the core logic and return the component
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />
      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="New Campaign" />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {/* Stepper */}
          <div className="mx-auto mb-12 max-w-4xl">
            <div className="relative flex justify-between">
              <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-slate-200" />
              <div 
                className="absolute left-0 top-1/2 h-0.5 bg-indigo-600 transition-all duration-500 -translate-y-1/2" 
                style={{ width: `${((step - 1) / (STEP_LABELS.length - 1)) * 100}%` }}
              />
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="relative z-10 flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    step > i + 1 ? "bg-indigo-600 border-indigo-600 text-white" :
                    step === i + 1 ? "bg-white border-indigo-600 text-indigo-600 shadow-md shadow-indigo-100" :
                    "bg-white border-slate-200 text-slate-400"
                  }`}>
                    {step > i + 1 ? <Check className="h-5 w-5" /> : <span>{i + 1}</span>}
                  </div>
                  <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${step === i + 1 ? "text-indigo-600" : "text-slate-500"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
            {step === 1 && (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 sm:p-12">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                    <Globe className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">What are we promoting?</h2>
                  <p className="mt-3 text-lg text-slate-600">Paste your product or landing page URL and our AI will do the rest.</p>
                </div>

                <div className="mt-10">
                  <div className="relative">
                    <input
                      type="url"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      placeholder="https://yourstore.com/product"
                      className={`w-full rounded-2xl border-2 py-4 pl-6 pr-32 text-lg transition-all focus:outline-none ${
                        urlError ? "border-red-200 bg-red-50/30 focus:border-red-500" : "border-slate-100 bg-slate-50/50 focus:border-indigo-600 focus:bg-white"
                      }`}
                    />
                    <button
                      onClick={analyzeUrl}
                      className="absolute right-2 top-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-95"
                    >
                      Analyze
                    </button>
                  </div>
                  {urlError && <p className="mt-3 text-sm font-medium text-red-600">{urlError}</p>}
                </div>

                <div className="mt-12">
                  <p className="text-center text-sm font-bold uppercase tracking-widest text-slate-400">Or try an example</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {EXAMPLE_URLS.map((url) => (
                      <button
                        key={url}
                        onClick={() => setProductUrl(`https://${url}`)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        {url}
                      </button>
                    ))}
                  </div>
                </div>

                {urlValidated && (
                  <div className="mt-12 flex justify-center border-t border-slate-100 pt-10">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
                    >
                      Continue to Config
                      <Sparkles className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 sm:p-12">
                  <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Campaign Settings</h2>
                    <p className="mt-3 text-lg text-slate-600">Tell us where and how you want to advertise.</p>
                  </div>

                  <div className="space-y-10">
                    {/* Platforms */}
                    <div>
                      <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Target Platforms</label>
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {PLATFORMS.map(({ id, label, Icon, cardClass, iconWrap }) => (
                          <button
                            key={id}
                            onClick={() => togglePlatform(id)}
                            className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-200 ${
                              selectedPlatforms.includes(id)
                                ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10"
                                : `border-slate-50 bg-slate-50/30 hover:bg-white ${cardClass}`
                            }`}
                          >
                            <div className={`rounded-xl p-2 ${iconWrap || ""}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <span className={`text-xs font-bold ${selectedPlatforms.includes(id) ? "text-indigo-700" : "text-slate-600"}`}>
                              {label}
                            </span>
                            {selectedPlatforms.includes(id) && (
                              <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-10 md:grid-cols-2">
                      {/* Campaign Goal */}
                      <div>
                        <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Campaign Goal</label>
                        <div className="mt-4 space-y-3">
                          {GOALS.map(({ id, label, desc, icon: Icon }) => (
                            <button
                              key={id}
                              onClick={() => setGoal(id)}
                              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                                goal === id
                                  ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10"
                                  : "border-slate-50 bg-slate-50/30 hover:border-slate-200 hover:bg-white"
                              }`}
                            >
                              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                goal === id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                              }`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-bold ${goal === id ? "text-indigo-700" : "text-slate-900"}`}>{label}</p>
                                <p className="text-xs text-slate-500">{desc}</p>
                              </div>
                              {goal === id && <Check className="h-5 w-5 text-indigo-600" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Brand Tone */}
                      <div>
                        <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Brand Tone</label>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {TONES.map((t) => (
                            <button
                              key={t}
                              onClick={() => setTone(t)}
                              className={`rounded-xl border-2 py-4 text-sm font-bold transition-all duration-200 ${
                                tone === t
                                  ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-600/10"
                                  : "border-slate-50 bg-slate-50/30 text-slate-600 hover:border-slate-200 hover:bg-white"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>

                        <div className="mt-8">
                          <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Audience Interests</label>
                          <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border-2 border-slate-50 bg-slate-50/30 p-3">
                            {audienceTags.map((tag) => (
                              <span
                                key={tag}
                                className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200"
                              >
                                {tag}
                                <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500">
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </span>
                            ))}
                            <input
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && addTag()}
                              placeholder="Add tag..."
                              className="flex-1 bg-transparent px-2 py-1.5 text-xs font-medium focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {configError && (
                      <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-red-100">
                        {configError}
                      </div>
                    )}

                    <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 rounded-2xl border-2 border-slate-200 py-4 text-lg font-bold text-slate-600 transition hover:bg-slate-50 active:scale-95"
                      >
                        Back
                      </button>
                      <button
                        onClick={runConfigure}
                        disabled={genInProgress.current}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
                      >
                        {genInProgress.current ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Initializing...
                          </>
                        ) : (
                          <>
                            Generate Campaign
                            <Sparkles className="h-5 w-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-12">
                  <div className="absolute -inset-4 animate-pulse rounded-full bg-indigo-50/50" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl shadow-indigo-100 ring-1 ring-slate-100">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  {processingPhase === 0 && "Analyzing your product..."}
                  {processingPhase === 1 && "Writing high-converting copy..."}
                  {processingPhase === 2 && "Designing creative variations..."}
                  {processingPhase === 3 && "Finalizing your campaign..."}
                </h2>
                
                <p className="mt-3 text-lg text-slate-500">AdGenius is crafting your high-performing ads.</p>

                <div className="mt-10 w-full max-w-md">
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 ring-1 ring-slate-200/50">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 ease-out shadow-sm" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>

                <div className="mt-16 h-12">
                  <p className="animate-in fade-in slide-in-from-bottom-2 text-sm font-medium italic text-slate-400 duration-700">
                    {ROTATING_TIPS[tipIndex]}
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Your Generated Ads</h2>
                    <p className="mt-2 text-slate-500">We've generated {campaignData?.creatives.length} ad variations for your campaign.</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95">
                      <Download className="h-4 w-4" />
                      Export All
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {campaignData?.creatives.map((ad, i) => (
                    <div key={ad.id} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl">
                      <div className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`} />
                      
                      <div className="mb-6 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 ring-1 ring-inset ring-indigo-200">
                          {ad.platform}
                        </span>
                        <div className="flex gap-1">
                          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-indigo-600">
                            <Heart className="h-5 w-5" />
                          </button>
                          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-indigo-600">
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">{ad.headline}</h3>
                      <p className="mt-3 text-slate-600 leading-relaxed">{ad.body}</p>
                      
                      <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Mockup Preview</span>
                        <button className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition hover:text-indigo-700">
                          Customize
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center border-t border-slate-100 pt-10">
                   <Link 
                     href="/dashboard" 
                     className="flex items-center gap-2 rounded-2xl bg-slate-900 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-slate-900/30 transition hover:bg-slate-800 active:scale-95"
                   >
                     Finish & Back to Dashboard
                     <Check className="h-5 w-5" />
                   </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
