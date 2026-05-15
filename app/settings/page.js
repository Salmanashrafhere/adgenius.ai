"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
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
  const { session, user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (authLoading) return null;

  if (!supabase) {
    console.log('Supabase not configured');
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
                        {(user?.user_metadata?.name || user?.name || "User").split(' ').map(n => n[0]).join('').toUpperCase()}
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
                          defaultValue={user?.user_metadata?.name || user?.name || "John Doe"}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            disabled
                            defaultValue={user?.email || "john@adgenius.ai"}
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
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Two-factor authentication</p>
                          <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-600/20" />
                      </label>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Active Sessions</h3>
                      <div className="mt-4 space-y-4">
                        {[
                          { device: "MacBook Pro", browser: "Chrome", location: "San Francisco, US", current: true, icon: Laptop },
                          { device: "iPhone 15", browser: "Safari", location: "San Francisco, US", current: false, icon: Smartphone },
                        ].map((session, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <session.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">
                                  {session.device} • {session.browser}
                                  {session.current && <span className="ml-2 text-xs font-bold text-emerald-600">Current</span>}
                                </p>
                                <p className="text-xs text-slate-500">{session.location}</p>
                              </div>
                            </div>
                            {!session.current && (
                              <button className="text-xs font-semibold text-red-600 hover:text-red-700">Revoke</button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                    <button className="text-sm font-semibold text-red-600 hover:text-red-700">
                      Sign out of all devices
                    </button>
                    <button className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.99]">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50/30 p-8">
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-indigo-100">
                      <Lock className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h2 className="mt-6 text-xl font-bold text-slate-900">Pro Plan Required</h2>
                    <p className="mt-2 max-w-sm text-sm text-slate-600">
                      API access is only available on our Pro Plan. Upgrade your subscription to start building with AdGenius AI.
                    </p>
                    <button className="mt-8 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-[0.99]">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>

                <div className="opacity-50 pointer-events-none grayscale">
                  <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">API Access</h2>
                    <div className="mt-6 space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Your API Key</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              readOnly
                              value="sk_test_51MzXXXXXXXXXXXXXXXXXXXXX"
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-500 blur-sm"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 hover:bg-slate-200">
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                            <RefreshCw className="h-4 w-4" />
                            Regenerate
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                        <a href="#" className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                          API Documentation
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
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
