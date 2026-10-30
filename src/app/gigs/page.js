"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, SlidersHorizontal } from "lucide-react";
import GigCard from "@/components/gigs/GigCard";
import FilterSidebar from "@/components/gigs/FilterSidebar";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { categories } from "@/data/categories";
import { useMarketplace } from "@/context/MarketplaceContext";

const PAGE_SIZE = 6;

function GigsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { ready, gigs, getFreelancer, getGigStats } = useMarketplace();

  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const min = params.get("min") || "";
  const max = params.get("max") || "";
  const rating = params.get("rating") || "0";
  const sort = params.get("sort") || "newest";
  const qs = params.toString();

  const [search, setSearch] = useState(q);
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => setSearch(q), [q]);
  useEffect(() => setVisible(PAGE_SIZE), [qs]);

  const update = (patch) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      const empty = v === "" || v == null || (k === "rating" && v === "0") || (k === "sort" && v === "newest");
      empty ? next.delete(k) : next.set(k, String(v));
    });
    const s = next.toString();
    router.replace(s ? `/gigs?${s}` : "/gigs", { scroll: false });
  };

  const hasActive = Boolean(q || category || min || max || rating !== "0");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const minP = min === "" ? null : Number(min);
    const maxP = max === "" ? null : Number(max);
    const minRating = Number(rating);

    const list = gigs.filter((g) => {
      if (category && g.categoryId !== category) return false;
      if (minP !== null && g.price < minP) return false;
      if (maxP !== null && g.price > maxP) return false;
      if (minRating > 0 && getGigStats(g.id).rating < minRating) return false;
      if (term) {
        const f = getFreelancer(g.freelancerId);
        const haystack = [g.title, f?.name, ...(g.skills || []), ...(g.tags || [])].join(" ").toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    const sorters = {
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
      price_asc: (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      rating: (a, b) => getGigStats(b.id).rating - getGigStats(a.id).rating,
    };
    return list.sort(sorters[sort] || sorters.newest);
  }, [gigs, q, category, min, max, rating, sort, getFreelancer, getGigStats]);

  const activeCategory = categories.find((c) => c.id === category);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900">
        {activeCategory ? activeCategory.name : "Explore gigs"}
      </h1>
      <p className="mt-1 text-slate-500">Find the perfect service for your project.</p>

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: search.trim() });
        }}
        className="mt-6 flex max-w-2xl items-center rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200"
      >
        <label htmlFor="gig-search" className="sr-only">Search gigs</label>
        <Search className="ml-3 h-5 w-5 text-slate-400" />
        <input id="gig-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, skill or freelancer name" className="w-full bg-transparent px-3 py-3 text-sm outline-none" />
        <button type="submit" className="m-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Search</button>
      </form>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <FilterSidebar
            filters={{ category, min, max, rating }}
            onChange={update}
            onClear={() => router.replace("/gigs", { scroll: false })}
            hasActive={hasActive}
          />
        </div>

        <section aria-live="polite">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              {ready ? `${results.length} gig${results.length === 1 ? "" : "s"} found` : "Loading gigs..."}
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters((s) => !s)} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium lg:hidden">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span className="sr-only sm:not-sr-only">Sort by</span>
                <select value={sort} onChange={(e) => update({ sort: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500">
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                  <option value="rating">Highest rated</option>
                </select>
              </label>
            </div>
          </div>

          {!ready ? (
            <LoadingSkeleton count={6} />
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <SearchX className="h-12 w-12 text-slate-400" />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">No gigs match your search</h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">Try different keywords or remove some filters.</p>
              <button onClick={() => router.replace("/gigs", { scroll: false })} className="mt-5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.slice(0, visible).map((g) => (
                  <GigCard key={g.id} gig={g} />
                ))}
              </div>
              {visible < results.length && (
                <div className="mt-10 text-center">
                  <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                    Load more ({results.length - visible} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

// useSearchParams needs a Suspense boundary for production builds
export default function GigsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-10"><LoadingSkeleton count={6} /></div>}>
      <GigsContent />
    </Suspense>
  );
}