"use client";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import RatingStars from "@/components/ui/RatingStars";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function FreelancerCard({ freelancer }) {
  const { getFreelancerStats } = useMarketplace();
  const stats = getFreelancerStats(freelancer.id);

  return (
    <Link
      href={`/freelancers/${freelancer.id}`}
      className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <SafeImage src={freelancer.avatar} alt={freelancer.name} fallbackText={freelancer.name} className="h-20 w-20 rounded-full object-cover text-xl ring-4 ring-indigo-50" />
      <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-indigo-600">{freelancer.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{freelancer.headline}</p>
      <div className="mt-3"><RatingStars rating={stats.rating} count={stats.count} /></div>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {freelancer.skills.slice(0, 3).map((s) => (
          <span key={s} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">{s}</span>
        ))}
      </div>
      {stats.startingPrice !== null && (
        <div className="mt-4 border-t border-slate-100 pt-3 w-full flex justify-center">
          <PriceDisplay price={stats.startingPrice} />
        </div>
      )}
    </Link>
  );
}