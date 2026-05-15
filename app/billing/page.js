"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { 
  CreditCard, 
  Download, 
  Plus, 
  Check, 
  ArrowRight,
  Zap,
  Clock,
  ShieldCheck
} from "lucide-react";

const billingHistory = [
  { id: "INV-001", date: "May 12, 2026", description: "Growth Plan - Monthly", amount: "$149.00", status: "Paid" },
  { id: "INV-002", date: "Apr 12, 2026", description: "Growth Plan - Monthly", amount: "$149.00", status: "Paid" },
  { id: "INV-003", date: "Mar 12, 2026", description: "Growth Plan - Monthly", amount: "$149.00", status: "Paid" },
  { id: "INV-004", date: "Feb 12, 2026", description: "Growth Plan - Monthly", amount: "$149.00", status: "Paid" },
  { id: "INV-005", date: "Jan 12, 2026", description: "Growth Plan - Monthly", amount: "$149.00", status: "Pending" },
];

const plans = [
  { name: "Free", price: "$0", campaigns: "1", ads: "10", video: "No", support: "Community", team: "1", current: false },
  { name: "Starter", price: "$49", campaigns: "10", ads: "100", video: "5", support: "Email", team: "2", current: false },
  { name: "Growth", price: "$149", campaigns: "30", ads: "500", video: "25", support: "Priority", team: "5", current: true },
  { name: "Pro", price: "$399", campaigns: "Unlimited", ads: "Unlimited", video: "Unlimited", support: "24/7 Dedicated", team: "Unlimited", current: false },
];

export default function BillingPage() {
  const { session, user, loading: authLoading } = useAuth();

  if (authLoading) return null;

  if (!supabase) {
    console.log('Supabase not configured');
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="Billing & Subscription" />

        <main className="flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Top Grid: Current Plan & Usage */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Plan Card */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Current Plan</h2>
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                  Growth Plan
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-slate-900">$149<span className="text-sm font-normal text-slate-500">/month</span></p>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Next billing date: <span className="font-medium text-slate-900">June 12, 2025</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95">
                  Upgrade Plan
                </button>
                <button className="text-sm font-medium text-slate-500 transition hover:text-red-600">
                  Cancel subscription
                </button>
              </div>
            </div>

            {/* Usage Meter */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Usage this month</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Campaigns</span>
                    <span className="text-slate-500">12 / 30</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: "40%" }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Ads Generated</span>
                    <span className="text-slate-500">240 / 500</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: "48%" }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Credits Remaining</span>
                    <span className="text-slate-500">150 / 500</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: "30%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Comparison Table */}
          <section className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Compare Plans</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">Features</th>
                    {plans.map((plan) => (
                      <th key={plan.name} className={`px-6 py-4 text-center ${plan.current ? "bg-indigo-50/30" : ""}`}>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-slate-900">{plan.name}</span>
                          <span className="mt-1 text-lg font-bold text-indigo-600">{plan.price}</span>
                          {plan.current && (
                            <span className="mt-1 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                              Current
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {[
                    { label: "Campaigns", key: "campaigns" },
                    { label: "Ads", key: "ads" },
                    { label: "Video Ads", key: "video" },
                    { label: "Support", key: "support" },
                    { label: "Team Members", key: "team" },
                  ].map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-medium text-slate-700">{row.label}</td>
                      {plans.map((plan) => (
                        <td key={plan.name} className={`px-6 py-4 text-center text-slate-600 ${plan.current ? "bg-indigo-50/30" : ""}`}>
                          {plan[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="px-6 py-6" />
                    {plans.map((plan) => (
                      <td key={plan.name} className={`px-6 py-6 text-center ${plan.current ? "bg-indigo-50/30" : ""}`}>
                        {plan.current ? (
                          <button disabled className="w-full rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-400">
                            Current Plan
                          </button>
                        ) : (
                          <button className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95">
                            {plan.name === "Pro" ? "Upgrade" : "Select"}
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Payment Methods</h2>
              <button className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500">
                <Plus className="h-4 w-4" />
                Add new card
              </button>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-12 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm">
                    <span className="text-xs font-bold italic text-blue-700">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Visa ending in 4242</p>
                    <p className="text-xs text-slate-500">Expires 12/28</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Default</span>
                  <button className="text-sm font-medium text-slate-400 hover:text-slate-600">Edit</button>
                </div>
              </div>
            </div>
          </section>

          {/* Billing History */}
          <section className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Billing History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {billingHistory.map((row) => (
                    <tr key={row.id} className="transition hover:bg-slate-50/80">
                      <td className="px-6 py-4 text-slate-600">{row.date}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{row.description}</td>
                      <td className="px-6 py-4 text-slate-600">{row.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          row.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 active:scale-95">
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
