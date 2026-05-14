"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
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

const headlines = [
  { text: "Step into Summer with Nike's New Collection", formula: "Curiosity" },
  { text: "Limited Time: 40% Off All Summer Footwear", formula: "Urgency" },
  { text: "The Only Shoes You'll Need This Vacation", formula: "Benefit" },
  { text: "Why Runners are Switching to Nike Air Zoom", formula: "Social Proof" },
  { text: "Experience Ultimate Comfort in Every Step", formula: "Value" },
  { text: "Your Summer Adventure Starts with Nike", formula: "Inspiration" },
  { text: "Don't Miss Out on the Hottest Drop of the Season", formula: "FOMO" },
  { text: "Engineered for Performance, Styled for Summer", formula: "Quality" },
  { text: "Upgrade Your Running Game Today", formula: "Direct" },
  { text: "Find Your Perfect Fit for the Beach and Beyond", formula: "Selection" },
  { text: "Breathable Tech for the Summer Heat", formula: "Feature" },
  { text: "Style Meets Function in Nike's Latest Release", formula: "Balanced" },
  { text: "The Secret to a Better Summer Run", formula: "Intrigue" },
  { text: "Nike Summer Sale: Live Now!", formula: "Announcement" },
  { text: "Join the Elite with Nike's Summer Series", formula: "Status" },
  { text: "Every Step Matters. Make Them Count with Nike.", formula: "Purpose" },
  { text: "The Future of Footwear is Here for Summer", formula: "Innovation" },
  { text: "Unbeatable Comfort for Your Longest Days", formula: "Endurance" },
  { text: "Designed by Pros for Your Daily Routine", formula: "Authority" },
  { text: "Ready, Set, Summer! Get Your Nike Gear.", formula: "Action" },
];

const bodyCopies = [
  { 
    text: "Tired of heavy, sweaty shoes in the summer heat? Our new Nike Air collection features ultra-breathable mesh and lightweight cushioning to keep you cool and comfortable all day long. Shop the summer sale now and save up to 40%!",
    formula: "PAS (Problem-Agitation-Solution)"
  },
  { 
    text: "Summer is here, and so is the ultimate Nike sale. Discover the perfect blend of style and performance with our latest drops. From beach walks to marathon training, we've got you covered. Limited stock available—get yours before they're gone!",
    formula: "AIDA (Attention-Interest-Desire-Action)"
  },
  { 
    text: "Experience the revolution in running. Nike's new summer lineup is engineered for those who never stop. Featuring advanced traction and energy-returning foam, these shoes are built to take you further. Order today for free shipping.",
    formula: "Benefit-Driven"
  },
  { 
    text: "What if your shoes could actually make you faster? With Nike's innovative carbon-plate technology and ultra-light materials, every stride is powered for speed. Join thousands of athletes who trust Nike for their summer goals.",
    formula: "Storytelling"
  },
  { 
    text: "Flash Sale Alert! ⚡ Get the iconic Nike look for less this summer. Our most popular styles are now at their lowest prices ever. Whether you're hitting the gym or the streets, do it in style. Shop the collection now.",
    formula: "Scarcity"
  },
];

const ctas = [
  "Shop Now", "Get 40% Off", "Browse Collection", "Claim Offer", "Start Running",
  "Find Your Store", "Learn More", "Order Today", "See the Drop", "Upgrade Now"
];

export default function CampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("ads");
  const [campaign, setCampaign] = useState(null);
  const [creatives, setCreatives] = useState([]);
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaignData() {
      try {
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', id)
          .single();

        if (campaignError) throw campaignError;
        setCampaign(campaignData);

        const { data: creativesData } = await supabase
          .from('ad_creatives')
          .select('*')
          .eq('campaign_id', id);
        
        setCreatives(creativesData || []);

        const { data: variationsData } = await supabase
          .from('copy_variations')
          .select('*')
          .eq('campaign_id', id);
        
        setVariations(variationsData || []);

      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCampaignData();
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
    </div>
  );

  if (!campaign) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold">Campaign not found</h2>
      <button onClick={() => router.push('/dashboard')} className="text-indigo-600 hover:underline">
        Back to Dashboard
      </button>
    </div>
  );

  const headlines = variations.filter(v => v.category === 'headline');
  const bodyCopies = variations.filter(v => v.category === 'body_copy');
  const ctas = variations.filter(v => v.category === 'cta');


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 active:scale-95"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">{campaign.name}</h1>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    campaign.status === 'ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-500">ID: {id} • Created {new Date(campaign.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95">
                <Download className="h-4 w-4" />
                Download All
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95">
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-red-500 transition hover:bg-red-50 hover:text-red-600 active:scale-95">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex overflow-x-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 border-b border-transparent">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition ${
                      isActive
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {activeTab === "ads" && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {creatives.map((ad, i) => (
                <div key={ad.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl">
                  <div className="relative h-[400px] w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
                    <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" />
                    <span className="relative z-10 inline-flex rounded-md bg-white/20 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md uppercase">
                      {ad.platform}
                    </span>
                    <div className="relative z-10 mt-4">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white drop-shadow-lg">
                        {ad.headline}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-white/90 drop-shadow-md">{ad.body_copy.slice(0, 100)}...</p>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 z-10">
                      <button className="w-full rounded-full bg-white py-3 text-sm font-bold text-slate-900 shadow-xl transition hover:scale-105 active:scale-95">
                        {ad.cta_text}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-3">
                    <div className="flex gap-1">
                      <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-indigo-600"><Edit2 className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-indigo-600"><Download className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-pink-500"><Heart className="h-4 w-4" /></button>
                    </div>
                    <button className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "copy" && (
            <div className="space-y-12">
              {/* Headlines */}
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Headlines</h2>
                  <span className="text-sm text-slate-500">{headlines.length} variations</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {headlines.map((item, idx) => (
                    <div key={idx} className="group relative rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-md">
                      <p className="text-sm font-medium text-slate-900">{item.content}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.formula || 'Creative'}</span>
                        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                          <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600"><Copy className="h-3.5 w-3.5" /></button>
                          <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 hover:text-amber-500"><Star className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Body Copies */}
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Body Copies</h2>
                  <span className="text-sm text-slate-500">{bodyCopies.length} variations</span>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  {bodyCopies.map((item, idx) => (
                    <div key={idx} className="group relative rounded-xl border border-slate-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-md">
                      <p className="text-sm leading-relaxed text-slate-600">{item.content}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.formula || 'PAS'}</span>
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600">
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTAs */}
              <section>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Call to Actions</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {ctas.map((cta, idx) => (
                    <button key={idx} className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                      {cta.content}
                      <Copy className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "strategy" && (
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Campaign Strategy</h2>
                    <p className="text-sm text-slate-500">AI-generated growth plan for Nike Shoes Summer Sale</p>
                  </div>
                </div>

                <div className="mt-8 space-y-10">
                  <section>
                    <div className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                      <Users className="h-5 w-5 text-indigo-600" />
                      Recommended Audience
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Segment</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">Fitness enthusiasts and casual runners aged 18-35.</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Interests</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">Outdoor sports, summer fashion, active lifestyle.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                      Budget Allocation
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                      We recommend allocating 40% of the budget to Instagram Stories, 30% to Facebook Feed, and 30% to TikTok TopView for maximum reach during the summer launch phase.
                    </p>
                  </section>

                  <section>
                    <div className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                      A/B Test Plan
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Test 'Urgency' vs 'Benefit' headlines in first 48 hours.",
                        "Compare static gradient images vs short video clips on TikTok.",
                        "Test 'Shop Now' vs 'Claim Offer' CTA buttons."
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                            {i + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-xl bg-indigo-600 p-6 text-white">
                    <div className="mb-4 flex items-center gap-2 font-bold">
                      <Lightbulb className="h-5 w-5 text-indigo-200" />
                      Expected Results
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-black">2.4%</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Avg CTR</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black">12k+</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Impressions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black">4.8x</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Est. ROAS</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Campaign Settings</h2>
                <div className="mt-6 space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Campaign Name</label>
                    <input
                      type="text"
                      defaultValue="Nike Shoes Summer Sale"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
                      Save Changes
                    </button>
                    <button className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      Duplicate Campaign
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-100 bg-red-50/50 p-6">
                <h3 className="text-sm font-bold text-red-900">Danger Zone</h3>
                <p className="mt-1 text-xs text-red-600">Once you delete a campaign, there is no going back. Please be certain.</p>
                <button className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95">
                  <Trash2 className="h-4 w-4" />
                  Delete Campaign
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
