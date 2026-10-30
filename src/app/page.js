"use client";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, MousePointerClick, PackageCheck, Search, Star } from "lucide-react";
import SearchBar from "@/components/layout/SearchBar";
import CategoryCard from "@/components/gigs/CategoryCard";
import GigCard from "@/components/gigs/GigCard";
import FreelancerCard from "@/components/freelancers/FreelancerCard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { categories } from "@/data/categories";
import { useMarketplace } from "@/context/MarketplaceContext";

const steps = [
  { icon: Search, title: "Browse services", text: "Search or explore categories to find the skill you need." },
  { icon: MousePointerClick, title: "Place an order", text: "Pick a gig, share your requirements and order in one click." },
  { icon: PackageCheck, title: "Receive your work", text: "Track progress, request revisions and approve the delivery." },
  { icon: Star, title: "Leave a review", text: "Rate your experience and help others choose with confidence." },
];

export default function HomePage() {
  const { ready, gigs, freelancers, getGigStats, getFreelancerStats } = useMarketplace();

  const featured = useMemo(
    () =>
      [...gigs]
        .sort((a, b) => getGigStats(b.id).rating - getGigStats(a.id).rating)
        .slice(0, 4),
    [gigs, getGigStats]
  );

  const topFreelancers = useMemo(
    () =>
      [...freelancers]
        .sort((a, b) => getFreelancerStats(b.id).rating - getFreelancerStats(a.id).rating)
        .slice(0, 3),
    [freelancers, getFreelancerStats]
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Find the Right Freelancer for Your Next Big Idea.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-indigo-100">
            Hire skilled professionals for web, design, marketing, video and more, ready to start today.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar large />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-indigo-200">
            <span>Popular:</span>
            {["React", "Logo design", "SEO", "Video editing"].map((t) => (
              <Link key={t} href={`/gigs?q=${encodeURIComponent(t)}`} className="rounded-full border border-indigo-300/40 px-3 py-1 transition hover:bg-white/10">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <h2 className="text-2xl font-bold text-slate-900">Popular categories</h2>
        <p className="mt-1 text-slate-500">Explore services by what you need done.</p>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* Featured gigs */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured gigs</h2>
            <p className="mt-1 text-slate-500">Top-rated services from our community.</p>
          </div>
          <Link href="/gigs" className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8">
          {!ready ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((g) => (
                <GigCard key={g.id} gig={g} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top freelancers */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <h2 className="text-2xl font-bold text-slate-900">Top-rated freelancers</h2>
        <p className="mt-1 text-slate-500">Talented professionals clients love working with.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ready
            ? topFreelancers.map((f) => <FreelancerCard key={f.id} freelancer={f} />)
            : Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200" />
              ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-indigo-600">Step {i + 1}</p>
              <h3 className="mt-1 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to turn your skills into income?</h2>
          <p className="mx-auto mt-3 max-w-xl text-indigo-100">
            Create your freelancer profile, publish gigs and start receiving demo orders in minutes.
          </p>
          <Link href="/register?role=freelancer" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50">
            Become a freelancer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}