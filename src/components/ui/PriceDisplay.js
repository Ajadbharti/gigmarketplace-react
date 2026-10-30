import { formatPrice } from "@/lib/utils";

export default function PriceDisplay({ price, label = "Starting at", large = false }) {
  return (
    <div className="flex items-baseline gap-1.5">
      {label && <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>}
      <span className={large ? "text-3xl font-bold text-slate-900" : "text-lg font-bold text-slate-900"}>
        {formatPrice(price)}
      </span>
    </div>
  );
}