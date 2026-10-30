"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ClipboardList, Clock, PackageCheck, ShoppingBag, XCircle } from "lucide-react";
import useRequireRole from "@/lib/useRequireRole";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import StatCard from "@/components/dashboard/StatCard";
import OrderCard from "@/components/orders/OrderCard";
import ReviewModal from "@/components/reviews/ReviewModal";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ORDER_STATUS, cn } from "@/lib/utils";

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function ClientDashboardPage() {
  const { user, allowed } = useRequireRole("client");
  const { ready, orders, getReviewForOrder, addReview } = useMarketplace();
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [reviewing, setReviewing] = useState(null);

  const mine = useMemo(
    () => (user ? orders.filter((o) => o.clientId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : []),
    [orders, user]
  );
  const count = (g) => mine.filter((o) => ORDER_STATUS[o.status]?.group === g).length;
  const visible = tab === "all" ? mine : mine.filter((o) => ORDER_STATUS[o.status]?.group === tab);

  if (!allowed || !ready) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-6 py-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const submitReview = ({ rating, comment }) => {
    const res = addReview({ orderId: reviewing.id, rating, comment, client: { id: user.id, name: user.name } });
    if (!res.ok) {
      toast.error(res.error);
    } else {
      toast.success("Thanks! Your review has been published.");
    }
    setReviewing(null);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[220px_1fr]">
      <DashboardSidebar role="client" userId={user.id} />

      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-slate-900">Hi, {user.name.split(" ")[0]}</h1>
        <p className="text-slate-500">Track and manage your orders.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard icon={ClipboardList} label="Total orders" value={mine.length} />
          <StatCard icon={Clock} label="Active" value={count("active")} />
          <StatCard icon={PackageCheck} label="Delivered" value={count("delivered")} />
          <StatCard icon={CheckCircle2} label="Completed" value={count("completed")} />
          <StatCard icon={XCircle} label="Cancelled" value={count("cancelled")} />
        </div>

        <div role="tablist" aria-label="Order status" className="mt-8 flex gap-2 overflow-x-auto border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn("whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium", tab === t.key ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800")}
            >
              {t.label} ({t.key === "all" ? mine.length : count(t.key)})
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <ShoppingBag className="h-10 w-10 text-slate-400" />
              <h2 className="mt-3 font-semibold text-slate-900">{mine.length === 0 ? "No orders yet" : "No orders in this tab"}</h2>
              <p className="mt-1 text-sm text-slate-500">Find a service and place your first demo order.</p>
              <Link href="/gigs" className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Browse gigs</Link>
            </div>
          ) : (
            visible.map((o) => (
              <OrderCard key={o.id} order={o} perspective="client">
                <Link href={`/orders/${o.id}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50">View details</Link>
                {o.status === "completed" &&
                  (getReviewForOrder(o.id) ? (
                    <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">Reviewed</span>
                  ) : (
                    <button onClick={() => setReviewing(o)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700">Leave review</button>
                  ))}
              </OrderCard>
            ))
          )}
        </div>
      </div>

      <ReviewModal open={!!reviewing} onClose={() => setReviewing(null)} onSubmit={submitReview} />
    </div>
  );
}