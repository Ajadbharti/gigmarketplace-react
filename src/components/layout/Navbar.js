"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { categories } from "@/data/categories";
import SearchBar from "./SearchBar";
import SafeImage from "@/components/ui/SafeImage";

export default function Navbar() {
  const { user, ready, logout } = useAuth();
  const toast = useToast();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const dashboardHref = user?.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 font-bold text-white">S</span>
          <span className="text-lg font-bold text-slate-900">SkillBridge</span>
        </Link>

        <div className="hidden flex-1 md:block md:max-w-xl">
          <SearchBar />
        </div>

        <nav className="ml-auto hidden items-center gap-3 md:flex" aria-label="Main">
          <Link href="/gigs" className="px-2 text-sm font-medium text-slate-700 hover:text-indigo-600">Explore</Link>
          {!ready ? (
            <div className="h-9 w-28" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen((o) => !o)} aria-haspopup="menu" aria-expanded={menuOpen} className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 hover:bg-slate-50">
                <SafeImage src={user.avatar} alt={user.name} fallbackText={user.name} className="h-8 w-8 rounded-full object-cover text-xs" />
                <span className="max-w-[8rem] truncate text-sm font-medium text-slate-800">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              {menuOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                  <p className="px-3 py-2 text-xs capitalize text-slate-500">Signed in as {user.role}</p>
                  <Link role="menuitem" href={dashboardHref} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
                  {user.role === "freelancer" && (
                    <Link role="menuitem" href={`/freelancers/${user.id}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100"><User className="h-4 w-4" />My profile</Link>
                  )}
                  <button role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Log out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Login</Link>
              <Link href="/register" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Sign Up</Link>
            </>
          )}
        </nav>

        <button onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={mobileOpen} className="ml-auto rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Category strip */}
      <div className="hidden border-t border-slate-100 md:block">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6 py-2 text-sm">
          {categories.map((c) => (
            <Link key={c.id} href={`/gigs?category=${c.id}`} className="whitespace-nowrap text-slate-600 transition hover:text-indigo-600">
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="space-y-3 border-t border-slate-200 bg-white p-4 md:hidden">
          <SearchBar />
          <Link href="/gigs" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100">Explore gigs</Link>
          {ready && user ? (
            <>
              <Link href={dashboardHref} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100">Dashboard</Link>
              {user.role === "freelancer" && (
                <Link href={`/freelancers/${user.id}`} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100">My profile</Link>
              )}
              <button onClick={handleLogout} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">Log out</button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="flex-1 rounded-lg border border-slate-300 py-2 text-center text-sm font-medium">Login</Link>
              <Link href="/register" className="flex-1 rounded-lg bg-indigo-600 py-2 text-center text-sm font-semibold text-white">Sign Up</Link>
            </div>
          )}
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
            {categories.map((c) => (
              <Link key={c.id} href={`/gigs?category=${c.id}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{c.name}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}