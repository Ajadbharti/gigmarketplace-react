import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RatingStars({ rating = 0, count, size = "sm", showValue = true }) {
  const dim = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(dim, i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-300")}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-slate-800">
          {count === 0 ? "New" : rating.toFixed(1)}
        </span>
      )}
      {typeof count === "number" && count > 0 && (
        <span className="text-sm text-slate-500">({count})</span>
      )}
    </div>
  );
}