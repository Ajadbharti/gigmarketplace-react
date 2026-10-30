"use client";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import StatusBadge from "@/components/orders/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { formatDate, formatPrice } from "@/lib/utils";

// perspective: "client" shows the freelancer's name, "freelancer" shows the client's name
export default function OrderCard({ order, perspective, children }) {
  const { getFreelancer } = useMarketplace();
  const { getUserById } = useAuth();
  const other = perspective === "client" ? getFreelancer(order.freelancerId) : getUserById(order.clientId);

  return (
    <div className="gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex sm:items-center">
      <SafeImage src={order.gigCover} alt={order.gigTitle} fallbackText={order.gigTitle} className="h-24 w-full shrink-0 rounded-xl object-cover sm:h-20 sm:w-32" />
      <div className="mt-3 min-w-0 flex-1 sm:mt-0">
        <Link href={`/orders/${order.id}`} className="line-clamp-2 font-semibold text-slate-900 hover:text-indigo-600">
          {order.gigTitle}
        </Link>
        <p className="mt-1 text-sm text-slate-500">
          {perspective === "client" ? "Freelancer" : "Client"}: {other?.name || "Unknown"} · Ordered {formatDate(order.createdAt)}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <StatusBadge status={order.status} />
          <span className="text-sm font-semibold text-slate-800">{formatPrice(order.price)}</span>
        </div>
      </div>
      {children && <div className="mt-3 flex flex-wrap gap-2 sm:mt-0 sm:justify-end">{children}</div>}
    </div>
  );
}