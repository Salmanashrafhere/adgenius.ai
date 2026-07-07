"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Bell, 
  Zap, 
  ChevronDown, 
  User, 
  CreditCard, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function Header({ title = "Dashboard", children }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('adgenius_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Campaign Ready: Nike Shoes", read: false, time: "2m ago" },
    { id: 2, text: "3 new ads generated", read: false, time: "1h ago" },
    { id: 3, text: "Welcome to AdGenius AI", read: false, time: "1d ago" },
  ]);
  
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
        
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3 sm:flex-nowrap">
          {/* Search bar */}
          <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-slate-200 bg-white py-2 shadow-xl ring-1 ring-slate-900/5">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  <button 
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-xs text-slate-500">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => markAsRead(n.id)}
                        className={`flex flex-col gap-1 px-4 py-3 cursor-pointer transition hover:bg-slate-50 ${!n.read ? 'bg-indigo-50/30' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                            {n.text}
                          </p>
                          {!n.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
                        </div>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Credits - Desktop */}
          <span className="hidden items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm sm:inline-flex">
            <Zap className="h-4 w-4" />
            {user?.credits || 0} Credits
          </span>

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-1.5 pl-1.5 pr-2 shadow-sm transition hover:bg-slate-50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="User menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                {(user?.name || "U").split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
              <ChevronDown className={`h-4 w-4 text-slate-500 transition ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-slate-900/5"
              >
                <Link
                  href="/settings"
                  prefetch={false}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Profile
                </Link>
                <Link
                  href="/billing"
                  prefetch={false}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  Billing
                </Link>
                <Link
                  href="/settings"
                  prefetch={false}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <Link
                  href="/login"
                  prefetch={false}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {children}

      {/* Credits - Mobile (only visible on small screens) */}
      <div className="border-t border-slate-100 px-4 py-2 sm:hidden">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
          <Zap className="h-3.5 w-3.5" />
          {user?.credits || 0} Credits
        </span>
      </div>
    </header>
  );
}
