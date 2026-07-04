"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Megaphone,
  Image as ImageIcon,
  TrendingUp,
  Zap,
  Download,
  Trash2,
  Bell,
  CheckCircle2,
  Info,
  AlertCircle,
  X,
  Eye,
  MoreVertical,
} from "lucide-react";
import { ToastContainer } from "@/components/Toast";

function statusBadge(status) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  if (status === "ready") return `${base} bg-emerald-100 text-emerald-800`;
  if (status === "processing") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-red-100 text-red-800`;
}

function platformBadge(platforms) {
  const platform = Array.isArray(platforms) ? platforms[0] : platforms;
  const colors = {
    facebook: "bg-blue-50 text-blue-700 ring-blue-100",
    instagram: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100",
    tiktok: "bg-slate-900 text-white ring-slate-700",
    google: "bg-sky-50 text-sky-700 ring-sky-100",
    all: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  };
  const c = colors[platform?.toLowerCase()] || "bg-slate-100 text-slate-700 ring-slate-200";
  return `inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${c}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [statsData, setStatsData] = useState({ totalCount: 0, totalAdsCount: 0 });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const notifRef = useRef(null);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get user 
      const userData = localStorage.getItem('adgenius_user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Fetch campaigns from API
        const fetchCampaigns = async () => {
          try {
            const response = await fetch(`/api/campaigns?userId=${parsedUser.id}&full=false&limit=5`);
            const data = await response.json();
            if (response.ok && data.success) {
              setCampaigns(data.campaigns);
              setStatsData({
                totalCount: data.totalCount || 0,
                totalAdsCount: data.totalAdsCount || 0
              });
            } else {
              // Fallback to local storage if API fails
              const savedCampaigns = localStorage.getItem('adgenius_campaigns');
              if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
            }
          } catch (err) {
            console.error('Failed to fetch campaigns:', err);
            const savedCampaigns = localStorage.getItem('adgenius_campaigns');
            if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
          } finally {
            setLoading(false);
          }
        };

        fetchCampaigns();
      } else {
        setLoading(false);
      }
      
      // Get notifications 
      const savedNotifications = localStorage.getItem('adgenius_notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        // Default notifications 
        const defaultNotifications = [ 
          { id: 1, title: 'Welcome to AdGenius AI!', message: 'Start creating your first campaign', time: 'Just now', read: false, type: 'info' }, 
          { id: 2, title: 'Free Trial Active', message: 'You have 10 credits remaining', time: '1 hour ago', read: false, type: 'success' } 
        ];
        setNotifications(defaultNotifications);
        localStorage.setItem('adgenius_notifications', JSON.stringify(defaultNotifications));
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adgenius_user');
    router.push('/login');
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('adgenius_notifications', JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem('adgenius_notifications', JSON.stringify([]));
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('adgenius_notifications', JSON.stringify(updated));
  };

  const removeCampaign = (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    localStorage.setItem('adgenius_campaigns', JSON.stringify(updated));
    showToast("Campaign deleted successfully", "success");
  };

  const downloadCampaign = (name) => {
    showToast(`Preparing download for ${name}...`, "info");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Memoize stats to avoid recalculating on every render
  const stats = useMemo(() => {
    const totalCount = statsData.totalCount || campaigns.length;
    const totalAdsCount = statsData.totalAdsCount || campaigns.reduce((sum, c) => sum + (c.adsCount || 0), 0);

    return [
      { label: "Total Campaigns", value: totalCount.toString(), icon: Megaphone, color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "Ads Generated", value: totalAdsCount.toString(), icon: ImageIcon, color: "text-purple-600", bg: "bg-purple-50" },
      { label: "Credits Remaining", value: (user?.credits || 10).toString(), icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Success Rate", value: "98%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];
  }, [campaigns, statsData, user?.credits]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="Dashboard">
          <div className="flex items-center gap-4">
            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 active:scale-95"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-slate-200 bg-white py-2 shadow-xl ring-1 ring-slate-900/5 z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 pb-2">
                    <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                    <div className="flex gap-2">
                      <button onClick={markAllAsRead} className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">Mark all read</button>
                      <button onClick={clearAllNotifications} className="text-[10px] font-semibold text-red-600 hover:text-red-700">Clear all</button>
                    </div>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`flex items-start gap-3 border-b border-slate-50 px-4 py-3 cursor-pointer transition hover:bg-slate-50 ${!n.read ? 'bg-indigo-50/30' : ''}`}
                        >
                          <div className="mt-1 shrink-0">
                            {n.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            {n.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                            {n.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                            {n.type === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs ${!n.read ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                              {!n.read && <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />}
                            </div>
                            <p className="mt-0.5 truncate text-[10px] text-slate-500">{n.message}</p>
                            <span className="mt-1 block text-[9px] text-slate-400">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Header>

        <main className="flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{s.label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{s.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                onClick={() => router.push("/campaign/new")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-[0.99] sm:w-auto"
              >
                <Megaphone className="h-4 w-4" />
                Create New Campaign
              </button>
              <button
                onClick={() => router.push("/campaigns")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-slate-50 active:scale-[0.99] sm:w-auto"
              >
                View All Campaigns
              </button>
            </div>
          </div>

          {/* Recent Campaigns Table */}
          <section className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent campaigns</h2>
            </div>

            {campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-50 text-5xl shadow-inner">
                  <span aria-hidden>📣</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No campaigns yet</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-600">Start your first campaign to generate high-converting ads.</p>
                <button
                  onClick={() => router.push("/campaign/new")}
                  className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500"
                >
                  Create Your First Campaign
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-3">Campaign Name</th>
                      <th className="px-6 py-3">Platform</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Ads</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="group transition hover:bg-slate-50/50">
                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                        <td className="whitespace-nowrap px-6 py-4"><span className={platformBadge(c.platform)}>{Array.isArray(c.platform) ? c.platform[0] : c.platform}</span></td>
                        <td className="whitespace-nowrap px-6 py-4"><span className={statusBadge(c.status)}>{c.status}</span></td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-600">{c.adsCount || 0} ads</td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-500">{new Date(c.createdAt || c.created_at).toLocaleDateString()}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => router.push(`/campaigns/${c.id}`)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => downloadCampaign(c.name)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeCampaign(c.id)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
