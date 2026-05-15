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
import { ToastContainer } from "@/components/Toast";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Form states
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [notifForm, setNotifForm] = useState({ emailReady: true, emailTips: false, emailUpdates: true });
  const [securityForm, setSecurityForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('adgenius_user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setProfileForm({ name: parsed.name || "", email: parsed.email || "" });
        setNotifForm(parsed.notifications || { emailReady: true, emailTips: false, emailUpdates: true });
        setLoading(false);
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  const saveProfile = (e) => {
    e.preventDefault();
    const updated = { ...user, name: profileForm.name, email: profileForm.email };
    localStorage.setItem('adgenius_user', JSON.stringify(updated));
    setUser(updated);
    showToast("Profile updated successfully", "success");
  };

  const saveNotifications = (newNotifs) => {
    const updated = { ...user, notifications: newNotifs };
    localStorage.setItem('adgenius_user', JSON.stringify(updated));
    setNotifForm(newNotifs);
    showToast("Preferences saved", "success");
  };

  const updatePassword = (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      return showToast("Passwords do not match", "error");
    }
    if (securityForm.newPassword.length < 6) {
      return showToast("Password too short", "error");
    }
    showToast("Password updated successfully", "success");
    setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="Settings" />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
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

            {activeTab === "profile" && (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                <form onSubmit={saveProfile} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full rounded-xl border-2 border-slate-100 py-3 px-4 focus:border-indigo-600 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full rounded-xl border-2 border-slate-100 py-3 px-4 focus:border-indigo-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-indigo-500 transition-all active:scale-95">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                <h2 className="text-xl font-bold mb-6">Email Notifications</h2>
                <div className="space-y-6">
                  {[
                    { id: "emailReady", label: "Campaign Ready", desc: "Get notified when your ads are generated.", value: notifForm.emailReady },
                    { id: "emailTips", label: "Weekly Tips", desc: "Growth marketing strategies and insights.", value: notifForm.emailTips },
                    { id: "emailUpdates", label: "Product Updates", desc: "New features and platform improvements.", value: notifForm.emailUpdates },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => saveNotifications({ ...notifForm, [item.id]: !item.value })}
                        className={`w-12 h-6 rounded-full transition-all relative ${item.value ? "bg-indigo-600" : "bg-slate-300"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.value ? "left-7" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                <form onSubmit={updatePassword} className="space-y-6">
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={securityForm.currentPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                        className="w-full rounded-xl border-2 border-slate-100 py-3 px-4 focus:border-indigo-600 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={securityForm.newPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                        className="w-full rounded-xl border-2 border-slate-100 py-3 px-4 focus:border-indigo-600 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={securityForm.confirmPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                        className="w-full rounded-xl border-2 border-slate-100 py-3 px-4 focus:border-indigo-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-indigo-500 transition-all active:scale-95">
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
