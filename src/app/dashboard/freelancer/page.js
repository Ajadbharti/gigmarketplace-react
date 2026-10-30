"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, CheckCircle2, Clock, DollarSign, Inbox, Pencil, Plus, Trash2 } from "lucide-react";
import useRequireRole from "@/lib/useRequireRole";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import StatCard from "@/components/dashboard/StatCard";
import OrderCard from "@/components/orders/OrderCard";
import DeliverModal from "@/components/orders/DeliverModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SafeImage from "@/components/ui/SafeImage";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ORDER_STATUS, formatPrice } from "@/lib/utils";

export default function FreelancerDashboardPage() {
  const { user, allowed } = useRequireRole("freelancer");
  const { ready, gigs, orders, deleteGig, updateOrderStatus, deliverOrder } = useMarketplace();
  const toast = useToast();
  const [delivering, setDelivering] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const myGigs = useMemo(() => (user ? gigs.filter((g) => g.freelancerId === user.id) : []), [gigs, user]);
  const myOrders = useMemo(
    () => (user ? orders.filter((o) => o.freelancerId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : []),
    [orders, user]
  );

  if (!allowed || !ready) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-6 py-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const active = myOrders.filter((o) => ORDER_STATUS[o.status]?.group === "active").length;
  const completed = myOrders.filter((o) => o.status === "completed");
  const earnings = completed.reduce((sum, o) => sum + o.price, 0);

  const accept = (o) => {
    updateOrderStatus(o.id, "in_progress", "Work started");
    toast.success("Order accepted. Work in progress.");
  };
  const decline = (o) => {
    updateOrderStatus(o.id, "cancelled", "Declined by freelancer");
    toast.success("Order declined.");
  };
  const submitDelivery = ({ link, note }) => {
    deliverOrder(delivering.id, { link, note });
    toast.success("Work delivered to the client.");
    setDelivering(null);
  };
  const confirmDelete = () => {
    deleteGig(deleting.id);
    toast.success("Gig deleted.");
    setDeleting(null);
  };

  const btn = "rounded-lg px-3 py-1.5 text-sm font-semibold";

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[220px_1fr]">
      <DashboardSidebar role="freelancer" userId={user.id} />

      <div className="min-w-0 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hi, {user.name.split(" ")[0]}</h1>
            <p className="text-slate-500">Manage your gigs and incoming orders.</p>
          </div>
          <Link href="/dashboard/freelancer/gigs/new" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Create gig
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Briefcase} label="Total gigs" value={myGigs.length} />
          <StatCard icon={Clock} label="Active orders" value={active} />
          <StatCard icon={CheckCircle2} label="Completed orders" value={completed.length} />
          <StatCard icon={DollarSign} label="Demo earnings" value={formatPrice(earnings)} />
        </div>

        {/* Gigs */}
        <section>
          <h2 className="text-lg font-bold text-slate-900">My gigs</h2>
          <div className="mt-4 space-y-3">
            {myGigs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-slate-600">You have not published any gigs yet.</p>
                <Link href="/dashboard/freelancer/gigs/new" className="mt-3 inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Create your first gig</Link>
              </div>
            ) : (
              myGigs.map((g) => (
                <div key={g.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <SafeImage src={g.cover} alt={g.title} fallbackText={g.title} className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/gigs/${g.id}`} className="line-clamp-1 font-semibold text-slate-900 hover:text-indigo-600">{g.title}</Link>
                    <p className="text-sm text-slate-500">{formatPrice(g.price)} · {g.deliveryDays} days · {g.revisions} revisions</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/freelancer/gigs/${g.id}/edit`} className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"><Pencil className="h-4 w-4" />Edit</Link>
                    <button onClick={() => setDeleting(g)} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" />Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Orders */}
        <section>
          <h2 className="text-lg font-bold text-slate-900">Incoming orders</h2>
          <div className="mt-4 space-y-4">
            {myOrders.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <Inbox className="h-10 w-10 text-slate-400" />
                <p className="mt-3 text-slate-600">No orders yet. They will appear here when clients order your gigs.</p>
              </div>
            ) : (
              myOrders.map((o) => (
                <OrderCard key={o.id} order={o} perspective="freelancer">
                  <Link href={`/orders/${o.id}`} className={`${btn} border border-slate-300 font-medium hover:bg-slate-50`}>Details</Link>
                  {o.status === "pending" && (
                    <>
                      <button onClick={() => accept(o)} className={`${btn} bg-indigo-600 text-white hover:bg-indigo-700`}>Accept</button>
                      <button onClick={() => decline(o)} className={`${btn} border border-red-200 text-red-600 hover:bg-red-50`}>Decline</button>
                    </>
                  )}
                  {(o.status === "in_progress" || o.status === "revision") && (
                    <button onClick={() => setDelivering(o)} className={`${btn} bg-indigo-600 text-white hover:bg-indigo-700`}>Deliver work</button>
                  )}
                </OrderCard>
              ))
            )}
          </div>
        </section>
      </div>

      <DeliverModal open={!!delivering} onClose={() => setDelivering(null)} onSubmit={submitDelivery} />
      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete this gig?"
        message={`"${deleting?.title}" will be removed from the marketplace. Existing orders keep their details.`}
        confirmLabel="Delete gig"
        danger
      />
    </div>
  );
}