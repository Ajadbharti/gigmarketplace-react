"use client";
import Link from "next/link";
import { Clock } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import RatingStars from "@/components/ui/RatingStars";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function GigCard({ gig }) {
  const { getFreelancer, getGigStats } = useMarketplace();
  const freelancer = getFreelancer(gig.freelancerId);
  const stats = getGigStats(gig.id);

  return (
    <Link
      href={`/gigs/${gig.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <SafeImage
          src={gig.cover}
          alt={gig.title}
          fallbackText={gig.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <SafeImage src={freelancer?.avatar} alt={freelancer?.name || "Freelancer"} fallbackText={freelancer?.name} className="h-7 w-7 rounded-full object-cover text-[10px]" />
          <span className="truncate text-sm font-medium text-slate-700">{freelancer?.name || "Unknown freelancer"}</span>
        </div>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-indigo-600">
          {gig.title}
        </h3>
        <RatingStars rating={stats.rating} count={stats.count} />
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            {gig.deliveryDays} day{gig.deliveryDays > 1 ? "s" : ""}
          </span>
          <PriceDisplay price={gig.price} />
        </div>
      </div>
    </Link>
  );
}