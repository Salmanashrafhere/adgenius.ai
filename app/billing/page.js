"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { 
  Zap, 
  Check, 
  Crown, 
  CreditCard, 
  History, 
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { ToastContainer } from "@/components/Toast";

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
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
        setUser(JSON.parse(userData));
        setLoading(false);
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  const handleUpgrade = (plan) => {
    showToast(`${plan} plan - Coming Soon!`, "info");
  };

  if (loading) return null;

  const stats = [
    { label: "Credits Used", value: (10 - (user?.credits || 0)).toString(), total: "10", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Campaigns", value: (user?.campaigns_count || 0).toString(), total: "Unlimited", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Current Plan", value: user?.plan || "Free Trial", total: null, icon: Crown, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="Billing & Plans" />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {/* Usage Overview */}
            <div className="mb-12 grid gap-6 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${s.bg} ${s.color}`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-black text-slate-900">{s.value}</p>
                    {s.total && <p className="text-sm font-bold text-slate-400">/ {s.total}</p>}
                  </div>
                  {s.total && s.total !== "Unlimited" && (
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-1000" 
                        style={{ width: `${(parseInt(s.value) / parseInt(s.total)) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Plans Grid */}
            <div className="mb-12">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Simple, transparent pricing</h2>
                <p className="mt-2 text-lg text-slate-600">Choose the plan that&apos;s right for your business.</p>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {[
                  { name: "Starter", price: "$29", credits: "50", features: ["50 AI Ad Credits", "Standard Support", "All Platforms", "Strategy Insights"] },
                  { name: "Professional", price: "$79", credits: "200", features: ["200 AI Ad Credits", "Priority Support", "Custom Brand Voice", "Advanced Analytics"], popular: true },
                  { name: "Enterprise", price: "$199", credits: "Unlimited", features: ["Unlimited Credits", "Dedicated Account Manager", "API Access", "Custom Integrations"] },
                ].map((plan) => (
                  <div key={plan.name} className={`relative flex flex-col rounded-3xl border p-8 shadow-xl transition hover:-translate-y-1 ${plan.popular ? "border-indigo-600 ring-4 ring-indigo-600/10" : "border-slate-100 bg-white"}`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-widest">Most Popular</div>
                    )}
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-black">{plan.price}</span>
                      <span className="text-slate-500 font-bold">/mo</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-indigo-600 uppercase tracking-widest">{plan.credits} Credits</p>
                    
                    <ul className="mt-8 flex-1 space-y-4">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                          <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleUpgrade(plan.name)}
                      className={`mt-10 w-full rounded-2xl py-4 font-bold transition-all active:scale-95 ${
                        plan.popular ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500" : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      Upgrade to {plan.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
