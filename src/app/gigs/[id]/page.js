"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, ExternalLink, RefreshCw, SearchX } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import RatingStars from "@/components/ui/RatingStars";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/ToastProvider";
import GigCard from "@/components/gigs/GigCard";
import ReviewCard from "@/components/reviews/ReviewCard";
import OrderModal from "@/components/orders/OrderModal";
import { categories } from "@/data/categories";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function GigDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { ready, gigs, getGig, getFreelancer, getGigStats, getReviewsForGig, createOrder } = useMarketplace();
  const [orderOpen, setOrderOpen] = useState(false);

  const gig = getGig(id);

  const related = useMemo(() => {
    if (!gig) return [];
    const same = gigs.filter((g) => g.id !== gig.id && g.categoryId === gig.categoryId);
    const others = gigs.filter((g) => g.id !== gig.id && g.categoryId !== gig.categoryId);
    return [...same, ...others].slice(0, 3);
  }, [gigs, gig]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-6 py-10">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
        <SearchX className="h-14 w-14 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Gig not found</h1>
        <p className="mt-2 text-slate-500">This gig may have been removed or the link is incorrect.</p>
        <Link href="/gigs" className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Browse all gigs</Link>
      </div>
    );
  }

  const freelancer = getFreelancer(gig.freelancerId);
  const stats = getGigStats(gig.id);
  const reviews = getReviewsForGig(gig.id);
  const category = categories.find((c) => c.id === gig.categoryId);

  const handleOrderClick = () => {
    if (!user) {
      toast.error("Please log in as a client to place an order.");
      router.push(`/login?next=/gigs/${gig.id}`);
      return;
    }
    if (user.role !== "client") {
      toast.error("Only client accounts can place orders. Please log in as a client.");
      return;
    }
    setOrderOpen(true);
  };

  const placeOrder = (requirements) => {
    const order = createOrder({ gig, clientId: user.id, requirements });
    setOrderOpen(false);
    toast.success("Order placed successfully!");
    router.push(`/orders/${order.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
        <Link href="/gigs" className="hover:text-indigo-600">Gigs</Link> /{" "}
        {category && <Link href={`/gigs?category=${category.id}`} className="hover:text-indigo-600">{category.name}</Link>}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          {category && <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{category.name}</span>}
          <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900">{gig.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {freelancer && (
              <Link href={`/freelancers/${freelancer.id}`} className="flex items-center gap-2 hover:text-indigo-600">
                <SafeImage src={freelancer.avatar} alt={freelancer.name} fallbackText={freelancer.name} className="h-9 w-9 rounded-full object-cover text-xs" />
                <span className="font-medium">{freelancer.name}</span>
              </Link>
            )}
            <RatingStars rating={stats.rating} count={stats.count} />
          </div>

          <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
            <SafeImage src={gig.cover} alt={gig.title} fallbackText={gig.title} className="h-full w-full object-cover" />
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-slate-900">About this gig</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">{gig.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[...(gig.skills || []), ...(gig.tags || [])].map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{t}</span>
              ))}
            </div>
          </section>

          {freelancer && (
            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900">About the freelancer</h2>
              <div className="mt-4 flex items-start gap-4">
                <SafeImage src={freelancer.avatar} alt={freelancer.name} fallbackText={freelancer.name} className="h-16 w-16 rounded-full object-cover text-lg" />
                <div>
                  <p className="font-semibold text-slate-900">{freelancer.name}</p>
                  <p className="text-sm text-slate-500">{freelancer.headline}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{freelancer.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm font-medium">
                    <Link href={`/freelancers/${freelancer.id}`} className="text-indigo-600 hover:text-indigo-700">View portfolio</Link>
                    {freelancer.website && (
                      <a href={freelancer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-slate-600 hover:text-indigo-600">
                        Website <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Reviews ({reviews.length})</h2>
              {reviews.length > 0 && <RatingStars rating={stats.rating} size="lg" />}
            </div>
            <div className="mt-4 space-y-4">
              {reviews.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                  No reviews yet. Be the first to order and review this gig.
                </p>
              ) : (
                reviews.map((r) => <ReviewCard key={r.id} review={r} />)
              )}
            </div>
          </section>
        </div>

        {/* Order card */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <PriceDisplay price={gig.price} label="Price" large />
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-indigo-600" />{gig.deliveryDays}-day delivery</li>
              <li className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-indigo-600" />{gig.revisions} revisions included</li>
            </ul>
            <button onClick={handleOrderClick} className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
              Order Now
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">Demo order. No real payment.</p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900">Related gigs</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((g) => <GigCard key={g.id} gig={g} />)}
          </div>
        </section>
      )}

      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} gig={gig} onSubmit={placeOrder} />
    </div>
  );
}