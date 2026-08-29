"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  Ticket, 
  MessageSquare, 
  Users, 
  Tag, 
  Layers, 
  Image as ImageIcon, 
  Map, 
  Sparkles, 
  Settings, 
  LogOut, 
  FileText,
  Menu,
  X,
  Home
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If it's the login page, render children directly without layout
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }

      // Check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!profile || (profile.role !== "admin" && profile.role !== "staff")) {
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      setUser(session.user);
      setLoading(false);
    }

    checkAuth();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-accent border-r-2 mb-4"></div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Checking Session...
          </p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: Ticket },
    { name: "Enquiries", href: "/admin/contacts", icon: MessageSquare },
    { name: "Influencers", href: "/admin/influencers", icon: Users },
    { name: "Website Content", href: "/admin/content", icon: FileText },
    { name: "Offers", href: "/admin/offers", icon: Tag },
    { name: "Packages", href: "/admin/packages", icon: Layers },
    { name: "Accommodation", href: "/admin/accommodation", icon: Home },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Attractions", href: "/admin/attractions", icon: Map },
    { name: "Activities", href: "/admin/activities", icon: Sparkles },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-6 py-4 z-40">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={30}
            className="h-8 w-auto brightness-110"
          />
          <span className="font-bold text-white uppercase text-sm tracking-wide">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-300 p-1 hover:text-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-50 md:z-30 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-slate-800">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={35}
              className="h-10 w-auto brightness-110"
            />
            <span className="font-black text-white uppercase text-base tracking-wider">
              Admin
            </span>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-accent text-black shadow-md shadow-accent/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout & User Info */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/20">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-accent">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-300 truncate">
                  {user?.email}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Administrator
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-0">
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
