"use client";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Briefcase, CheckCircle2, ExternalLink, Languages, MapPin, Pencil, SearchX } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import RatingStars from "@/components/ui/RatingStars";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import GigCard from "@/components/gigs/GigCard";
import ReviewCard from "@/components/reviews/ReviewCard";
import EditProfileModal from "@/components/freelancers/EditProfileModal";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function FreelancerProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { ready, gigs, getFreelancer, getFreelancerStats, getReviewsForFreelancer } = useMarketplace();
  const [editOpen, setEditOpen] = useState(false);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-6 py-10">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const freelancer = getFreelancer(id);
  if (!freelancer) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
        <SearchX className="h-14 w-14 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Freelancer not found</h1>
        <p className="mt-2 text-slate-500">This profile does not exist.</p>
        <Link href="/gigs" className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Browse gigs</Link>
      </div>
    );
  }

  const stats = getFreelancerStats(freelancer.id);
  const reviews = getReviewsForFreelancer(freelancer.id);
  const myGigs = gigs.filter((g) => g.freelancerId === freelancer.id);
  const isOwner = user?.id === freelancer.id;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <section className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <SafeImage src={freelancer.avatar} alt={freelancer.name} fallbackText={freelancer.name} className="h-28 w-28 shrink-0 rounded-full object-cover text-3xl ring-4 ring-indigo-50" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{freelancer.name}</h1>
          <p className="mt-1 text-slate-600">{freelancer.headline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <RatingStars rating={stats.rating} count={stats.count} />
            {freelancer.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{freelancer.location}</span>}
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{stats.completedOrders} completed orders</span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          {stats.startingPrice !== null && <PriceDisplay price={stats.startingPrice} />}
          {isOwner && (
            <button onClick={() => setEditOpen(true)} className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
              <Pencil className="h-4 w-4" /> Edit profile
            </button>
          )}
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-slate-900">About</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">{freelancer.bio}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">Portfolio</h2>
            {freelancer.portfolio?.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {freelancer.portfolio.map((p) => (
                  <figure key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="aspect-[3/2] bg-slate-100">
                      <SafeImage src={p.image} alt={p.title} fallbackText={p.title} className="h-full w-full object-cover" />
                    </div>
                    <figcaption className="p-3 text-sm font-medium text-slate-800">{p.title}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">No portfolio projects added yet.</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">Published gigs ({myGigs.length})</h2>
            {myGigs.length ? (
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {myGigs.map((g) => <GigCard key={g.id} gig={g} />)}
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">No gigs published yet.</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">Reviews ({reviews.length})</h2>
            <div className="mt-4 space-y-4">
              {reviews.length ? (
                reviews.map((r) => <ReviewCard key={r.id} review={r} />)
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">No reviews yet.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {freelancer.skills?.length
                ? freelancer.skills.map((s) => <span key={s} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">{s}</span>)
                : <span className="text-sm text-slate-500">No skills added.</span>}
            </div>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
            <p className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-indigo-600" />Experience: {freelancer.experience || "N/A"}</p>
            <p className="flex items-center gap-2"><Languages className="h-4 w-4 text-indigo-600" />{freelancer.languages?.join(", ") || "N/A"}</p>
            {freelancer.website && (
              <a href={freelancer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-700">
                <ExternalLink className="h-4 w-4" /> Portfolio website
              </a>
            )}
          </div>
        </aside>
      </div>

      {isOwner && <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} freelancer={freelancer} />}
    </div>
  );
}