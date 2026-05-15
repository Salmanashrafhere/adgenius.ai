"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
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

export default function CampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("ads");
  const [campaign, setCampaign] = useState(null);
  const [creatives, setCreatives] = useState([]);
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('adgenius_user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        router.push('/login');
      }
      setLoading(false);
    }
  }, [router]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
    </div>
  );

  if (!campaign) return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />
      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        <Header title="Campaign Details" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-5xl shadow-inner ring-1 ring-indigo-100">
            <span aria-hidden>🔍</span>
          </div>
          <h2 className="text-xl font-bold">Campaign not found</h2>
          <p className="max-w-sm text-sm text-slate-600">This campaign might have been deleted or doesn't exist.</p>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-[260px]">
        {/* Header content would go here if campaign was found */}
      </div>
    </div>
  );
}
