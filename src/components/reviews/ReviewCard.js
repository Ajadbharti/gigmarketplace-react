import RatingStars from "@/components/ui/RatingStars";
import { formatDate, getInitials } from "@/lib/utils";

export default function ReviewCard({ review }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          {getInitials(review.clientName)}
        </span>
        <div className="flex-1">
          <p className="font-semibold text-slate-900">{review.clientName}</p>
          <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.comment}</p>
    </article>
  );
}