"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import {
  Sparkles,
  LayoutDashboard,
  Megaphone,
  Layout,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  CreditCard,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/campaigns", label: "Templates", icon: Layout },
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
  { href: "#", label: "Help", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, session } = useAuth(false);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('supabase.auth.token');
    }
    router.push("/login");
  };

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const isActive =
      (item.href === "/dashboard" && pathname === "/dashboard") ||
      (item.href !== "/dashboard" && item.href !== "#" && pathname?.startsWith(item.href));

    return (
      <Link
        href={item.href}
        prefetch={false}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-[260px] flex-col border-r border-slate-200/80 bg-white shadow-sm lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 ring-1 ring-indigo-100">
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </span>
          <span className="font-semibold tracking-tight text-slate-900">AdGenius AI</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
              {(user?.user_metadata?.name || user?.name || "User").split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.user_metadata?.name || user?.name || "Demo User"}</p>
              <p className="truncate text-xs text-slate-500">{user?.email || "demo@adgenius.ai"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 active:scale-[0.99]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch justify-around border-t border-slate-200 bg-white px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive =
            (item.href === "/dashboard" && pathname === "/dashboard") ||
            (item.href !== "/dashboard" && item.href !== "#" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              prefetch={false}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium transition active:scale-95 ${
                isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : ""}`} />
              <span className="truncate px-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
