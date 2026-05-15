"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Code, 
  Camera, 
  Lock, 
  Upload, 
  ChevronRight, 
  Copy, 
  RefreshCw,
  ExternalLink,
  Smartphone,
  Laptop,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "brand", label: "Brand", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "api", label: "API", icon: Code },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="Settings">
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
        </Header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                  <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
                    <div className="relative h-24 w-24 shrink-0">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white shadow-lg">
                        {(user?.name || "U").split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-600 transition hover:bg-slate-200">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid flex-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.name || ""}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            disabled
                            defaultValue={user?.email || ""}
                            className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 pl-3 pr-10 text-sm text-slate-500"
                          />
                          <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 000-0000"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Company Name</label>
                        <input
                          type="text"
                          defaultValue="AdGenius AI"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                    <button className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.99]">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "brand" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Brand Identity</h2>
                  <div className="mt-8 space-y-8">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Brand Logo</label>
                      <div className="mt-2 flex items-center gap-6">
                        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-200">
                          <Upload className="h-6 w-6 text-slate-400" />
                        </div>
                        <div className="flex-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-indigo-300">
                          <p className="text-sm text-slate-600">
                            <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="mt-1 text-xs text-slate-500">PNG, JPG or SVG (max. 2MB)</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Primary Color</label>
                        <div className="flex items-center gap-3">
                          <input type="color" defaultValue="#4f46e5" className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-none" />
                          <input type="text" defaultValue="#4F46E5" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Secondary Color</label>
                        <div className="flex items-center gap-3">
                          <input type="color" defaultValue="#9333ea" className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-none" />
                          <input type="text" defaultValue="#9333EA" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Default Tone of Voice</label>
                      <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20">
                        <option>Professional</option>
                        <option>Witty & Playful</option>
                        <option>Urgent & Direct</option>
                        <option>Friendly & Helpful</option>
                        <option>Luxurious & Elegant</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">Default Platforms</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {["Facebook", "Instagram", "TikTok", "Google"].map((p) => (
                          <label key={p} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600/20" />
                            <span className="text-sm text-slate-700">{p}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                    <button className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.99]">
                      Save Brand Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Email Notifications</h2>
                  <p className="text-sm text-slate-500">Choose which updates you want to receive via email.</p>
                  
                  <div className="mt-8 divide-y divide-slate-100">
                    {[
                      { id: "ready", label: "Campaign Ready", desc: "Get notified when your ads are generated.", active: true },
                      { id: "failed", label: "Campaign Failed", desc: "Receive alerts if there's an issue with generation.", active: true },
                      { id: "tips", label: "Weekly Tips", desc: "Performance insights and optimization strategies.", active: false },
                      { id: "updates", label: "Product Updates", desc: "New features and platform improvements.", active: true },
                      { id: "billing", label: "Billing Alerts", desc: "Invoices and subscription changes.", active: true },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" defaultChecked={item.active} className="peer sr-only" />
                          <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-600/20" />
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                    <button className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.99]">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Security Settings</h2>
                  <div className="mt-8 space-y-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="col-span-full space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                    <button className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.99]">
                      Update Password
                    </button>
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
