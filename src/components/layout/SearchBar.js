"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchBar({ large = false, className, placeholder = "Search for services, skills or freelancers" }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/gigs?q=${encodeURIComponent(query)}` : "/gigs");
  };

  return (
    <form onSubmit={submit} role="search" className={cn("flex w-full items-center rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200", className)}>
      <label htmlFor={large ? "hero-search" : "nav-search"} className="sr-only">Search gigs</label>
      <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
      <input
        id={large ? "hero-search" : "nav-search"}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={cn("w-full bg-transparent px-3 text-slate-900 outline-none placeholder:text-slate-400", large ? "py-4 text-base" : "py-2 text-sm")}
      />
      <button type="submit" className={cn("m-1 shrink-0 rounded-lg bg-indigo-600 font-semibold text-white transition hover:bg-indigo-700", large ? "px-6 py-3" : "px-4 py-1.5 text-sm")}>
        Search
      </button>
    </form>
  );
}