"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
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
    // setProcessingPhase(0); // Handled manually in runConfigure
    setTipIndex(0);

    const start = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      // Slower progress bar to wait for image generation
      const pct = Math.min(98, 5 + (elapsed / 60000) * 93);
      setProgress(pct);
    }, 200);

    tipTimerRef.current = setInterval(() => {
      setTipIndex((i) => (i + 1) % ROTATING_TIPS.length);
    }, 3500);

    return clearProcessingTimers;
  }, [step, generateLoading, clearProcessingTimers]);

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
      setConfigError("Select a tone.");
      return;
    }
    if (!urlValidated || !isValidHttpUrl(productUrl)) {
      setConfigError("Go back and validate your product URL first.");
      return;
    }

    genInProgress.current = true;
    setConfigError("");
    setCampaignData(null);
    setGeneratedImages([]);
    setGenerateLoading(true);
    setStep(3);
    setProcessingPhase(0);

    const controller = new AbortController();
    generateAbortRef.current = controller;

    // Fallback data for safety
    const fallbackData = {
      title: "New Campaign",
      headlines: ["Limited Time Offer - Shop Now", "Best Deal Today"],
      bodycopies: ["Our product delivers exactly what you need."],
      ctas: ["Shop Now", "Get Started"],
      angles: ["Value", "Quality"],
      targetAudience: "General Audience",
      strategy: "Focus on value."
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to generate campaigns");
      }

      // Progress animation steps
      const progressSteps = [
        { phase: 1, progress: 25, delay: 2000 }, // Analyzing
        { phase: 2, progress: 50, delay: 2000 }, // Extracting
      ];

      for (const stepInfo of progressSteps) {
        setProcessingPhase(stepInfo.phase);
        setProgress(stepInfo.progress);
        await new Promise(r => setTimeout(r, stepInfo.delay));
      }

      setProcessingPhase(3); // Generating ad copy
      setProgress(75);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productUrl: productUrl.trim(),
          platform: selectedPlatforms,
          goal,
          tone: tone.toLowerCase(),
          audienceTags,
          budget,
          userId: session.user.id
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();

      if (data.success && data.campaign) {
        setCampaignData(data.campaign);
        
        // Step 4 (Creating images): 75-90% - 3 seconds
        setProcessingPhase(4);
        setProgress(90);
        
        try {
          const imgRes = await fetch("/api/generate-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productTitle: data.campaign.title,
              tone: tone,
              platform: selectedPlatforms.join(", "),
            }),
            signal: controller.signal,
          });
          const imgData = await imgRes.json();
          if (imgData.success && imgData.images) {
            setGeneratedImages(imgData.images);
          }
        } catch (imgErr) {
          console.error("Image generation failed:", imgErr);
        }

        // Step 5 (Finalizing): 90-100% - 1 second
        setProcessingPhase(5);
        setProgress(100);
        await new Promise(r => setTimeout(r, 1000));
        
        setFilter("All");
        setFavorites({});
        setSelectedAds({});
        setStep(4); // Move to results
      }
    } catch (error) {
      console.error('Error:', error);
      // Still proceed with fallback data if needed or show error
      setCampaignData(fallbackData);
      setStep(4);
    } finally {
      setGenerateLoading(false);
      generateAbortRef.current = null;
      clearProcessingTimers();
      genInProgress.current = false;
    }
  }

  const adCards = useMemo(() => {
    if (!campaignData?.headlines?.length) return [];
    const headlines = campaignData.headlines;
    const ctas = campaignData.ctas || [];
    const bodies = campaignData.bodycopies || [];
    const platIds =
      Array.isArray(campaignData.platforms) && campaignData.platforms.length > 0
        ? campaignData.platforms
        : selectedPlatforms;
    const platformLabels =
      platIds.length > 0
        ? platIds.map((id) => PLATFORMS.find((p) => p.id === id)?.label || id)
        : ["Multi"];
    const productTitle = campaignData.title || "Your product";

    return headlines.map((headline, i) => {
      const imageObj = generatedImages.length > 0 ? generatedImages[i % generatedImages.length] : null;
      return {
        id: `gen-${i}`,
        headline,
        cta: ctas[i % Math.max(ctas.length, 1)] || "Shop Now",
        body: bodies[i % Math.max(bodies.length, 1)] || "",
        platform: platformLabels[i % platformLabels.length],
        type: imageObj?.type === "gradient" ? "gradient" : imageObj ? "image" : "headline",
        image: imageObj?.url,
        grad: imageObj?.type === "gradient" ? imageObj.url : CARD_GRADIENTS[i % CARD_GRADIENTS.length],
        productTitle,
      };
    });
  }, [campaignData, selectedPlatforms, generatedImages]);

  const filteredAds = useMemo(() => {
    return adCards.filter((ad) => {
      if (filter === "All") return true;
      if (filter === "Images") return ad.type === "image";
      if (filter === "Headlines") return ad.type === "headline";
      if (filter === "Favorites") return favorites[ad.id];
      return true;
    });
  }, [adCards, filter, favorites]);

  function toggleFavorite(id) {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleSelectAd(id) {
    setSelectedAds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const allFilteredSelected =
    filteredAds.length > 0 && filteredAds.every((ad) => selectedAds[ad.id]);

  function toggleSelectAll() {
    const next = !allFilteredSelected;
    setSelectedAds((prev) => {
      const copy = { ...prev };
      filteredAds.forEach((ad) => {
        copy[ad.id] = next;
      });
      return copy;
    });
  }

  function resetCampaignFlow() {
    generateAbortRef.current?.abort();
    clearProcessingTimers();
    setStep(1);
    setProductUrl("");
    setUrlError("");
    setUrlValidated(false);
    setSelectedPlatforms([]);
    setGoal("");
    setBudget(500);
    setTone("");
    setAudienceTags([]);
    setTagInput("");
    setConfigError("");
    setProgress(0);
    setProcessingPhase(0);
    setFilter("All");
    setFavorites({});
    setSelectedAds({});
    setCampaignData(null);
    setGenerateLoading(false);
    genInProgress.current = false;
  }

  const processingLines = [
    { label: "Analyzing product URL", doneAt: 0 },
    { label: "Extracting product info", doneAt: 1 },
    { label: "Generating ad copy", doneAt: 2 },
    { label: "Creating images", doneAt: 3 },
    { label: "Finalizing campaign", doneAt: 4 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="New Campaign" />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Step indicator */}
            <nav aria-label="Progress" className="mb-10 overflow-x-auto pb-2">
              <ol className="flex min-w-[640px] items-start justify-between gap-2 sm:min-w-0">
                {STEP_LABELS.map((label, i) => {
                  const n = i + 1;
                  const completed = step > n;
                  const active = step === n;
                  return (
                    <li key={label} className="flex flex-1 flex-col items-center">
                      <div className="flex w-full items-center">
                        {i > 0 && <div className={`h-0.5 flex-1 rounded ${step > i ? "bg-emerald-400" : "bg-slate-200"}`} />}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                            completed
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                              : active
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                : "border-2 border-slate-200 bg-white text-slate-400"
                          }`}
                        >
                          {completed ? <Check className="h-5 w-5" strokeWidth={3} /> : n}
                        </div>
                        {i < STEP_LABELS.length - 1 && (
                          <div className={`h-0.5 flex-1 rounded ${step > n ? "bg-emerald-400" : "bg-slate-200"}`} />
                        )}
                      </div>
                      <span
                        className={`mt-2 max-w-[5.5rem] text-center text-[11px] font-semibold leading-tight sm:max-w-none sm:text-xs ${
                          active ? "text-indigo-700" : completed ? "text-emerald-700" : "text-slate-500"
                        }`}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="transition-opacity duration-300">
              {/* Step 1 */}
              {step === 1 && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Enter Your Product URL</h2>
                  <p className="mt-2 text-slate-600">Paste any product page URL and AI will analyze it</p>
                  <div className="relative mt-8">
                    <Globe className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      inputMode="url"
                      value={productUrl}
                      onChange={(e) => {
                        setProductUrl(e.target.value);
                        setUrlValidated(false);
                        setUrlError("");
                      }}
                      placeholder="https://yourstore.com/products/..."
                      className={`w-full rounded-xl border-2 py-4 pl-14 pr-12 text-lg shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/15 ${
                        urlError ? "border-red-300 focus:border-red-500" : urlValidated ? "border-emerald-400 focus:border-emerald-500" : "border-slate-200 focus:border-indigo-600"
                      }`}
                    />
                    {urlValidated && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                        <Check className="h-7 w-7" strokeWidth={2.5} />
                      </span>
                    )}
                  </div>
                  {urlError ? (
                    <p className="mt-2 text-sm font-medium text-red-600" role="alert">
                      {urlError}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={analyzeUrl}
                    className="mt-6 w-full rounded-xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 hover:shadow-xl active:scale-[0.99] sm:w-auto sm:px-10"
                  >
                    Analyze URL
                  </button>
                  <p className="mt-8 text-sm font-medium text-slate-500">Example URLs</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                    {EXAMPLE_URLS.map((ex) => (
                      <li key={ex}>
                        <button
                          type="button"
                          onClick={() => {
                            setProductUrl(ex);
                            setUrlValidated(false);
                            setUrlError("");
                          }}
                          className="text-left text-indigo-600 underline decoration-indigo-200 underline-offset-2 transition hover:text-indigo-500"
                        >
                          {ex}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 flex justify-end border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      disabled={!urlValidated}
                      onClick={() => setStep(2)}
                      className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-bold text-slate-900">Configure Your Campaign</h2>
                    <p className="mt-1 text-slate-600">Choose platforms, goal, and creative direction.</p>

                    {configError ? (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
                        {configError}
                      </div>
                    ) : null}

                    <p className="mt-8 text-sm font-semibold text-slate-800">Platforms</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {PLATFORMS.map(({ id, label, Icon, cardClass, iconWrap }) => {
                        const checked = selectedPlatforms.includes(id);
                        return (
                          <label
                            key={id}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-white p-4 shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-md ${cardClass} ${
                              checked ? "border-indigo-600 ring-indigo-100" : "border-slate-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePlatform(id)}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 ${iconWrap || ""}`}>
                              {id === "tiktok" ? <Icon className="h-6 w-6" /> : id === "all" ? <Icon className="h-5 w-5" /> : <Icon className="h-7 w-7" />}
                            </span>
                            <span className="font-semibold text-slate-900">{label}</span>
                          </label>
                        );
                      })}
                    </div>

                    <p className="mt-8 text-sm font-semibold text-slate-800">Goal</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {GOALS.map(({ id, label, desc, icon: GIcon }) => (
                        <label
                          key={id}
                          className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                            goal === id ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-100" : "border-slate-100 bg-white"
                          }`}
                        >
                          <input type="radio" name="goal" checked={goal === id} onChange={() => setGoal(id)} className="sr-only" />
                          <GIcon className={`h-6 w-6 ${goal === id ? "text-indigo-600" : "text-slate-400"}`} />
                          <span className="mt-2 font-semibold text-slate-900">{label}</span>
                          <span className="text-xs text-slate-500">{desc}</span>
                        </label>
                      ))}
                    </div>

                    <p className="mt-8 text-sm font-semibold text-slate-800">Budget range</p>
                    <p className="mt-1 text-2xl font-bold text-indigo-600">${budget.toLocaleString()}</p>
                    <input
                      type="range"
                      min={10}
                      max={10000}
                      step={10}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
                    />
                    <div className="mt-1 flex justify-between text-xs text-slate-500">
                      <span>$10</span>
                      <span>$10,000</span>
                    </div>

                    <p className="mt-8 text-sm font-semibold text-slate-800">Tone</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {TONES.map((t) => (
                        <label key={t} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:border-indigo-200 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-800">
                          <input type="radio" name="tone" checked={tone === t} onChange={() => setTone(t)} className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                          {t}
                        </label>
                      ))}
                    </div>

                    <p className="mt-8 text-sm font-semibold text-slate-800">Target audience tags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {audienceTags.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 ring-1 ring-indigo-100">
                          {t}
                          <button type="button" onClick={() => removeTag(t)} className="rounded-full p-0.5 hover:bg-indigo-100" aria-label={`Remove ${t}`}>
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="e.g. Women 25-40, US, skincare buyers"
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      />
                      <button type="button" onClick={addTag} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200">
                        Add
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={runConfigure}
                      className="mt-8 w-full rounded-xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 hover:shadow-xl active:scale-[0.99]"
                    >
                      Generate Ads
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className="rounded-xl border-2 border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-300">
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
                  <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">AI is Creating Your Ads...</h2>
                  <p className="mt-2 text-center text-sm text-slate-600">
                    {generateLoading ? "Calling Gemini AI and analyzing your product page…" : "Finishing up…"}
                  </p>
                  <div className="mt-8 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-[width] duration-100 ease-linear"
                      style={{
                        width: `${progress}%`,
                        boxShadow: "0 0 20px rgba(99,102,241,0.5)",
                      }}
                    />
                  </div>
                  <ul className="mx-auto mt-10 max-w-md space-y-4">
                    {processingLines.map((line, idx) => {
                      const done = processingPhase > line.doneAt;
                      const running = processingPhase === line.doneAt;
                      return (
                        <li key={line.label} className="flex items-center gap-3 text-sm font-medium">
                          {done ? (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                              <Check className="h-4 w-4" strokeWidth={3} />
                            </span>
                          ) : running ? (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </span>
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 text-slate-300">○</span>
                          )}
                          <span className={done ? "text-emerald-800" : running ? "text-indigo-800" : "text-slate-400"}>{line.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-10 text-center text-sm text-slate-600 transition-opacity duration-500" key={tipIndex}>
                    {ROTATING_TIPS[tipIndex]}
                  </p>
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        generateAbortRef.current?.abort();
                        clearProcessingTimers();
                        setGenerateLoading(false);
                        setStep(2);
                      }}
                      className="rounded-xl border-2 border-red-200 bg-white px-6 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Your Ads Are Ready! 🎉</h2>
                    <p className="mt-2 text-slate-600">
                      {(campaignData?.headlines?.length ?? 0).toString()} ad creatives generated
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-100 pb-4">
                      {["All", "Images", "Headlines", "Favorites"].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setFilter(tab)}
                          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                            filter === tab ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    {campaignData?.angles?.length ? (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ad angles</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {campaignData.angles.map((angle) => (
                            <span key={angle} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800 ring-1 ring-indigo-100">
                              {angle}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredAds.map((ad) => (
                        <div
                          key={ad.id}
                          className={`group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                            selectedAds[ad.id] ? "ring-2 ring-indigo-500" : ""
                          }`}
                        >
                          <div className="relative aspect-square overflow-hidden bg-slate-100">
                            {ad.type === "gradient" ? (
                              <div 
                                className="h-full w-full transition duration-500 group-hover:scale-110" 
                                style={{ background: ad.grad }}
                              />
                            ) : ad.image ? (
                              <img
                                src={ad.image}
                                alt={ad.headline}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = ""; // Clear src to show gradient fallback if desired
                                  e.target.parentElement.classList.add("bg-gradient-to-br", ...ad.grad.split(" "));
                                }}
                              />
                            ) : (
                              <div className={`h-full w-full bg-gradient-to-br ${ad.grad}`} />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                            <span className="absolute right-3 top-3 rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ring-1 ring-white/25 backdrop-blur-sm">
                              {ad.platform}
                            </span>
                          </div>
                          <div className="p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{ad.productTitle}</p>
                            <h3 className="mt-1 line-clamp-2 text-base font-bold leading-tight text-slate-900">{ad.headline}</h3>
                            <p className="mt-2 line-clamp-2 text-xs text-slate-500">{ad.body}</p>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                              <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 ring-1 ring-indigo-100">
                                {ad.cta || "Learn More"}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => toggleFavorite(ad.id)}
                                  className={`rounded-lg p-1.5 transition hover:bg-slate-100 ${favorites[ad.id] ? "text-red-500" : "text-slate-400"}`}
                                >
                                  <Heart className={`h-4 w-4 ${favorites[ad.id] ? "fill-current" : ""}`} />
                                </button>
                                <button type="button" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100">
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-50 px-4 py-2">
                            <label className="flex cursor-pointer items-center gap-2 text-[11px] font-semibold text-slate-600">
                              <input type="checkbox" checked={!!selectedAds[ad.id]} onChange={() => toggleSelectAd(ad.id)} className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600" />
                              Select for export
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    {filteredAds.length === 0 ? (
                      <p className="mt-6 text-center text-sm text-slate-500">No ads match this filter.</p>
                    ) : null}
                    {campaignData?.strategy ? (
                      <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                        <h3 className="text-sm font-semibold text-indigo-900">Strategy snapshot</h3>
                        <p className="mt-2 line-clamp-5 text-sm leading-relaxed text-slate-700">{campaignData.strategy}</p>
                      </div>
                    ) : null}
                    {campaignData?.bodycopies?.length ? (
                      <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                        <h3 className="text-sm font-semibold text-slate-900">Body copy variants (PAS)</h3>
                        <ul className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-700">
                          {campaignData.bodycopies.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                        <input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll} className="rounded border-slate-300 text-indigo-600" />
                        Select All
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (campaignData) setStep(5);
                        }}
                        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!campaignData}
                      >
                        Download Selected
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5 */}
              {step === 5 && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Download Your Ads</h2>
                    <p className="mt-2 text-slate-600">Choose how you want to export your campaign.</p>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                      {[
                        { title: "Download All (ZIP)", desc: "All ads, assets, and copy in one archive." },
                        { title: "Download PDF Report", desc: "Strategy guide with recommendations." },
                        { title: "Individual Downloads", desc: "Pick specific creatives to save." },
                      ].map((opt) => (
                        <button
                          key={opt.title}
                          type="button"
                          className="flex flex-col rounded-xl border-2 border-slate-100 bg-slate-50/50 p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-md active:scale-[0.99]"
                        >
                          <Download className="h-8 w-8 text-indigo-600" />
                          <span className="mt-4 font-bold text-slate-900">{opt.title}</span>
                          <span className="mt-2 text-sm text-slate-600">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                    <h3 className="text-lg font-bold text-slate-900">Strategy Guide preview</h3>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{campaignData?.strategy || "—"}</p>
                    <div className="mt-6 border-t border-slate-100 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target audience</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">{campaignData?.targetAudience || "—"}</p>
                    </div>
                    <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
                      <li>
                        <span className="font-semibold text-slate-900">Budget context: </span>${budget.toLocaleString()} planned range
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">Platforms: </span>
                        {selectedPlatforms.length ? selectedPlatforms.map((id) => PLATFORMS.find((p) => p.id === id)?.label || id).join(", ") : "—"}
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">Audience tags: </span>
                        {audienceTags.length ? audienceTags.join(", ") : "—"}
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={resetCampaignFlow}
                      className="flex-1 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
                    >
                      Create Another Campaign
                    </button>
                    <Link
                      href="/dashboard"
                      className="flex flex-1 items-center justify-center rounded-xl border-2 border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-slate-50"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
