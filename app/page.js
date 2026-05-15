"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  Menu,
  X,
  PenLine,
  Image as ImageIcon,
  LayoutGrid,
  SplitSquareHorizontal,
  Eye,
  BarChart3,
  Link2,
  Download,
  Check,
  Quote,
  ChevronDown,
  ArrowRight,
  Play,
  Twitter,
  Linkedin,
  Github,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react";

const faqItems = [
  {
    q: "What platforms does AdGenius support?",
    a: "AdGenius exports creatives and copy optimized for Facebook, Instagram, and TikTok. We follow each platform’s safe zones and aspect ratios so your ads are ready to publish.",
  },
  {
    q: "How does the AI generate ads?",
    a: "We analyze your product page—headlines, benefits, imagery, and audience signals—then generate dozens of copy and layout variations using frontier models tuned for performance marketing.",
  },
  {
    q: "Can I customize the generated ads?",
    a: "Yes. Edit copy, swap images, change CTAs, and regenerate sections. Everything stays in your workspace until you export.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "Exports pause until your next billing cycle or until you add a top-up. Your drafts and history stay available—you’re never locked out of your work.",
  },
  {
    q: "Is there a free trial?",
    a: "Start on the Free plan with no card required. Upgrade when you need more campaigns, HD exports, or video ads.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Cancel anytime from Billing in your dashboard. You keep access through the end of the paid period.",
  },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-2 font-semibold tracking-tight text-slate-900 transition hover:opacity-90"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 ring-1 ring-indigo-100">
              <Sparkles className="h-5 w-5 text-indigo-600" aria-hidden />
            </span>
            <span>AdGenius AI</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-indigo-600">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-indigo-600">
              Pricing
            </a>
            <a href="#faq" className="transition hover:text-indigo-600">
              FAQ
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              prefetch={false}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Login
            </Link>
            <Link
              href="/signup"
              prefetch={false}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/35"
            >
              Get Started Free
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-md md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700">
              <a href="#features" className="rounded-lg px-2 py-2 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
                Features
              </a>
              <a href="#pricing" className="rounded-lg px-2 py-2 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
                Pricing
              </a>
              <a href="#faq" className="rounded-lg px-2 py-2 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
                FAQ
              </a>
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/login"
                prefetch={false}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                prefetch={false}
                className="w-full rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500"
                onClick={() => setMobileOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-purple-50/60 to-slate-50 pb-20 pt-12 sm:pt-16 lg:pb-28 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.25),transparent)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-700 shadow-sm backdrop-blur sm:text-sm">
                <span aria-hidden>🚀</span>
                AI-Powered Ad Generation
              </div>
              <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Create 50+ High-Converting Ads in{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  5 Minutes
                </span>{" "}
                with AI
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-600 sm:text-xl">
                No design skills needed. Just paste your product URL and watch AI generate stunning ad creatives for Facebook, Instagram, and TikTok.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/signup"
                  prefetch={false}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-2xl hover:shadow-indigo-600/35 sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white/80 px-8 py-3.5 text-base font-semibold text-slate-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white sm:w-auto"
                >
                  <Play className="h-4 w-4 fill-current text-indigo-600" />
                  Watch Demo
                </button>
              </div>

              <div className="mt-14 grid grid-cols-1 gap-6 border-y border-indigo-100/80 py-8 sm:grid-cols-3 sm:gap-8">
                <div className="flex flex-col items-center gap-1">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <p className="text-2xl font-bold text-slate-900">1000+</p>
                  <p className="text-sm font-medium text-slate-600">Brands</p>
                </div>
                <div className="flex flex-col items-center gap-1 border-y border-indigo-100 py-6 sm:border-x sm:border-y-0 sm:py-0">
                  <Zap className="h-5 w-5 text-indigo-600" />
                  <p className="text-2xl font-bold text-slate-900">50M+</p>
                  <p className="text-sm font-medium text-slate-600">Ads Generated</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  <p className="text-2xl font-bold text-slate-900">3x</p>
                  <p className="text-sm font-medium text-slate-600">Better CTR</p>
                </div>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 sm:p-3">
                <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-3 sm:px-4">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400/90" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/90" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
                  </div>
                  <div className="mx-auto flex max-w-md flex-1 items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    app.adgenius.ai / campaign / summer-launch
                  </div>
                </div>
                <div className="grid gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-4">
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-indigo-50 to-white shadow-md transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-white/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      <span>Facebook</span>
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700">Live</span>
                    </div>
                    <div className="space-y-2 p-3">
                      <div className="aspect-[4/5] rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-inner">
                        <p className="text-[10px] font-medium opacity-90">Sponsored</p>
                        <p className="mt-2 text-sm font-bold leading-snug">Glow Serum — 24hr hydration</p>
                        <p className="mt-1 text-[10px] opacity-90 line-clamp-3">Shop the viral drop. Free shipping this week only.</p>
                        <div className="mt-3 rounded-md bg-white/20 px-2 py-1.5 text-center text-[10px] font-semibold backdrop-blur">Shop Now</div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-fuchsia-50 to-white shadow-md transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-white/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      <span>Instagram</span>
                      <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-700">New</span>
                    </div>
                    <div className="space-y-2 p-3">
                      <div className="aspect-square rounded-lg bg-slate-900 p-3 text-white shadow-inner">
                        <p className="text-[10px] text-fuchsia-300">@brandofficial</p>
                        <p className="mt-3 text-lg font-black tracking-tight">SUMMER DROP</p>
                        <p className="mt-1 text-[10px] text-slate-300">Swipe up — limited units</p>
                        <div className="mt-4 h-16 rounded-lg bg-gradient-to-tr from-fuchsia-500 to-orange-400" />
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-cyan-50 to-white shadow-md transition hover:-translate-y-1 hover:shadow-lg sm:col-span-1">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-white/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      <span>TikTok</span>
                      <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-cyan-800">Spark</span>
                    </div>
                    <div className="space-y-2 p-3">
                      <div className="aspect-[9/16] max-h-[220px] rounded-lg bg-slate-950 p-2 text-white shadow-inner">
                        <div className="flex h-full flex-col justify-end rounded-md bg-gradient-to-t from-black/80 via-transparent to-transparent p-2">
                          <p className="text-[9px] font-semibold text-cyan-300">POV: your ads finally convert</p>
                          <p className="mt-1 text-[10px] text-slate-200">Hook → offer → CTA in one click.</p>
                          <div className="mt-2 flex gap-1">
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[8px]">+42 variants</span>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[8px]">4:5 & 9:16</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-slate-200/80 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How it works</h2>
              <p className="mt-4 text-lg text-slate-600">From URL to launch-ready creatives in three simple steps.</p>
            </div>
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Paste Your URL",
                  desc: "Paste any product URL—Shopify, Webflow, or a simple landing page.",
                  icon: Link2,
                },
                {
                  step: "02",
                  title: "AI Generates Ads",
                  desc: "Our AI creates 50+ variations of copy, layouts, and hooks tailored to your offer.",
                  icon: Sparkles,
                },
                {
                  step: "03",
                  title: "Download & Launch",
                  desc: "Export platform-ready assets and push live to Meta and TikTok in minutes.",
                  icon: Download,
                },
              ].map(({ step, title, desc, icon: Icon }) => (
                <div
                  key={step}
                  className="group relative rounded-xl border border-slate-100 bg-slate-50/50 p-8 shadow-sm transition hover:-translate-y-1 hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-600/10"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">{step}</span>
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 transition group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>
                  <p className="mt-3 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-slate-200/80 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to scale ads</h2>
              <p className="mt-4 text-lg text-slate-600">Purpose-built for performance marketers and lean teams who ship fast.</p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "AI Copywriting", desc: "Headlines, hooks, and CTAs trained on winning direct-response patterns.", icon: PenLine },
                { title: "Stunning Visuals", desc: "On-brand layouts, gradients, and product-forward frames—no Figma required.", icon: ImageIcon },
                { title: "Multi-Platform", desc: "One brief, every ratio: Feed, Story, Reels, and Spark-ready exports.", icon: LayoutGrid },
                { title: "A/B Testing", desc: "Spin up statistically meaningful variants without drowning in spreadsheets.", icon: SplitSquareHorizontal },
                { title: "Competitor Insights", desc: "See what angles rivals lean on—then outbid them with fresher creative.", icon: Eye },
                { title: "Analytics", desc: "Connect performance data to learn which concepts to double down on.", icon: BarChart3 },
              ].map(({ title, desc, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-600/10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-slate-200/80 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Simple, transparent pricing</h2>
              <p className="mt-4 text-lg text-slate-600">Start free. Scale when your campaigns take off.</p>
            </div>
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {/* Free */}
              <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <h3 className="text-lg font-bold text-slate-900">Free</h3>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-slate-600">/mo</span>
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-600">
                  {["3 campaigns", "10 ads", "Watermarked exports"].map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="h-4 w-4 shrink-0 text-indigo-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 block w-full text-center rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-slate-50"
                >
                  Get started
                </Link>
              </div>

              {/* Growth - Popular */}
              <div className="relative flex flex-col rounded-xl border-2 border-indigo-600 bg-white p-8 shadow-xl shadow-indigo-600/15 ring-1 ring-indigo-600/10 transition hover:-translate-y-1 hover:shadow-2xl">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                  Popular
                </span>
                <h3 className="text-lg font-bold text-slate-900">Growth</h3>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$149</span>
                  <span className="text-slate-600">/mo</span>
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-600">
                  {["30 campaigns", "50 ads", "Video ads", "No watermark", "Priority support"].map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="h-4 w-4 shrink-0 text-indigo-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 block w-full text-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 hover:shadow-xl"
                >
                  Start Growth plan
                </Link>
              </div>

              {/* Pro */}
              <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <h3 className="text-lg font-bold text-slate-900">Pro</h3>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$399</span>
                  <span className="text-slate-600">/mo</span>
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-600">
                  {["Unlimited everything", "White-label", "API access", "Dedicated CSM", "SLA"].map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="h-4 w-4 shrink-0 text-indigo-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 block w-full text-center rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-slate-50"
                >
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-slate-200/80 bg-gradient-to-b from-slate-50 to-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Loved by growth teams</h2>
              <p className="mt-4 text-lg text-slate-600">Real outcomes from brands that moved fast.</p>
            </div>
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {[
                {
                  quote: "Generated 50 ads in 3 minutes. Our CTR increased by 340%!",
                  name: "Sarah M.",
                  role: "Marketing Director",
                },
                {
                  quote: "Best investment for my Shopify store. Sales up 2x!",
                  name: "Ahmed K.",
                  role: "Ecommerce Owner",
                },
                {
                  quote: "Replaced our entire design team for ad creatives.",
                  name: "Lisa R.",
                  role: "Agency Owner",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="relative rounded-xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl"
                >
                  <Quote className="absolute right-6 top-6 h-8 w-8 text-indigo-100" />
                  <p className="relative text-lg font-medium leading-relaxed text-slate-800">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{t.name}</p>
                      <p className="text-sm text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-slate-200/80 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Frequently asked questions</h2>
              <p className="mt-4 text-lg text-slate-600">Everything you need to know before you ship your next campaign.</p>
            </div>
            <div className="mt-12 space-y-3">
              {faqItems.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={item.q}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm transition hover:border-indigo-200 hover:bg-white"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 sm:px-6 sm:text-base"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                    >
                      {item.q}
                      <ChevronDown className={`h-5 w-5 shrink-0 text-indigo-600 transition ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && <div className="border-t border-slate-100 px-5 pb-5 pt-0 text-sm leading-relaxed text-slate-600 sm:px-6">{item.a}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-slate-200/80 bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Ready to 10x Your Ad Performance?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">Join thousands of brands using AdGenius to ship winning creative faster.</p>
            <Link
              href="/signup"
              prefetch={false}
              className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-xl transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-2xl"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link href="/" prefetch={false} className="flex items-center gap-2 font-semibold text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
                  <Sparkles className="h-5 w-5 text-indigo-300" />
                </span>
                AdGenius AI
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">The fastest way to generate high-performing ads across every major platform—powered by AI you can trust.</p>
              <div className="mt-6 flex gap-3">
                <a href="#" className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-indigo-500 hover:text-white" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-indigo-500 hover:text-white" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-indigo-500 hover:text-white" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:pl-12">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Product</p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a href="#features" className="transition hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="transition hover:text-white">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="transition hover:text-white">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Company</p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a href="#" className="transition hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Legal</p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} AdGenius AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
