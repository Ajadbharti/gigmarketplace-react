"use client";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ExternalLink, Lock, RefreshCw, SearchX } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/ToastProvider";
import StatusBadge from "@/components/orders/StatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import DeliverModal from "@/components/orders/DeliverModal";
import RevisionModal from "@/components/orders/RevisionModal";
import ReviewModal from "@/components/reviews/ReviewModal";
import ReviewCard from "@/components/reviews/ReviewCard";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { formatDate, formatPrice } from "@/lib/utils";

function Message({ icon: Icon, title, text, href, cta }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <Icon className="h-14 w-14 text-slate-400" />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-500">{text}</p>
      <Link href={href} className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">{cta}</Link>
    </div>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const toast = useToast();
  const { user, ready: authReady, getUserById } = useAuth();
  const { ready, getOrder, getGig, getFreelancer, getReviewForOrder, updateOrderStatus, deliverOrder, requestRevision, completeOrder, cancelOrder, addReview } = useMarketplace();

  const [deliverOpen, setDeliverOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [confirm, setConfirm] = useState(null); // "complete" | "cancel" | null

  if (!ready || !authReady) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-6 py-10">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const order = getOrder(id);
  if (!order) return <Message icon={SearchX} title="Order not found" text="This order does not exist." href="/gigs" cta="Browse gigs" />;
  if (!user) return <Message icon={Lock} title="Please log in" text="Log in to view this order." href={`/login?next=/orders/${id}`} cta="Log in" />;

  const isClient = user.id === order.clientId;
  const isFreelancer = user.id === order.freelancerId;
  if (!isClient && !isFreelancer) {
    return <Message icon={Lock} title="No access" text="You can only view your own orders." href={user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client"} cta="Go to dashboard" />;
  }

  const gig = getGig(order.gigId);
  const client = getUserById(order.clientId);
  const freelancer = getFreelancer(order.freelancerId);
  const review = getReviewForOrder(order.id);
  const revisionsLeft = order.revisionsAllowed - order.revisionsUsed;
  const dueDate = new Date(new Date(order.createdAt).getTime() + order.deliveryDays * 86400000).toISOString();
  const dashboardHref = isFreelancer ? "/dashboard/freelancer" : "/dashboard/client";

  const handleRevision = (note) => {
    const res = requestRevision(order.id, note);
    res.ok ? toast.success("Revision requested.") : toast.error(res.error);
    setRevisionOpen(false);
  };
  const handleDeliver = ({ link, note }) => {
    deliverOrder(order.id, { link, note });
    toast.success("Work delivered.");
    setDeliverOpen(false);
  };
  const handleReview = ({ rating, comment }) => {
    const res = addReview({ orderId: order.id, rating, comment, client: { id: user.id, name: user.name } });
    res.ok ? toast.success("Review published. Thank you!") : toast.error(res.error);
    setReviewOpen(false);
  };

  const confirms = {
    complete: { title: "Complete this order?", message: "This confirms you accept the delivery. You can then leave a review.", label: "Complete order", danger: false, run: () => { completeOrder(order.id); toast.success("Order completed."); } },
    cancel: { title: "Cancel this order?", message: "This cannot be undone.", label: "Cancel order", danger: true, run: () => { cancelOrder(order.id); toast.success("Order cancelled."); } },
  };
  const cfg = confirm ? confirms[confirm] : null;

  const btnPrimary = "w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700";
  const btnOutline = "w-full rounded-xl border border-slate-300 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href={dashboardHref} className="text-sm text-slate-600 hover:text-indigo-600">&larr; Back to dashboard</Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Order #{order.id.slice(-6).toUpperCase()}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <SafeImage src={order.gigCover} alt={order.gigTitle} fallbackText={order.gigTitle} className="h-20 w-28 shrink-0 rounded-xl object-cover" />
            <div>
              <p className="font-semibold text-slate-900">{order.gigTitle}</p>
              {gig ? (
                <Link href={`/gigs/${gig.id}`} className="text-sm text-indigo-600 hover:text-indigo-700">View gig</Link>
              ) : (
                <p className="text-sm text-slate-500">This gig is no longer available.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Requirements</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{order.requirements}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Delivery</h2>
            {order.deliveryLink || order.deliveryNote ? (
              <div className="mt-2 space-y-2 text-sm text-slate-700">
                {order.deliveryNote && <p className="whitespace-pre-line">{order.deliveryNote}</p>}
                {order.deliveryLink && /^https?:\/\//i.test(order.deliveryLink) && (
                  <a href={order.deliveryLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-700">
                    Open delivery link <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Nothing delivered yet.</p>
            )}
          </section>

          {review && (
            <section>
              <h2 className="mb-3 font-semibold text-slate-900">Client review</h2>
              <ReviewCard review={review} />
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-slate-900">Order timeline</h2>
            <OrderTimeline timeline={order.timeline} />
          </section>
        </div>

        <aside className="space-y-5 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm">
            <dl className="space-y-3">
              <div className="flex justify-between"><dt className="text-slate-500">Price</dt><dd className="font-bold text-slate-900">{formatPrice(order.price)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Placed</dt><dd>{formatDate(order.createdAt)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Due</dt><dd>{formatDate(dueDate)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Revisions</dt><dd>{order.revisionsUsed} / {order.revisionsAllowed} used</dd></div>
            </dl>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
            <p><span className="text-slate-500">Client:</span> <strong>{client?.name || "Unknown"}</strong></p>
            <p>
              <span className="text-slate-500">Freelancer:</span>{" "}
              {freelancer ? <Link href={`/freelancers/${freelancer.id}`} className="font-semibold text-indigo-600 hover:text-indigo-700">{freelancer.name}</Link> : <strong>Unknown</strong>}
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Actions</h2>

            {isClient && order.status === "delivered" && (
              <>
                <button onClick={() => setConfirm("complete")} className={btnPrimary}>Complete order</button>
                <button onClick={() => setRevisionOpen(true)} disabled={revisionsLeft <= 0} className={btnOutline}>
                  <RefreshCw className="mr-1 inline h-4 w-4" />
                  {revisionsLeft > 0 ? `Request revision (${revisionsLeft} left)` : "No revisions left"}
                </button>
              </>
            )}
            {isClient && order.status === "pending" && (
              <button onClick={() => setConfirm("cancel")} className="w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">Cancel order</button>
            )}
            {isClient && order.status === "completed" && !review && (
              <button onClick={() => setReviewOpen(true)} className={btnPrimary}>Leave a review</button>
            )}

            {isFreelancer && order.status === "pending" && (
              <>
                <button onClick={() => { updateOrderStatus(order.id, "in_progress", "Work started"); toast.success("Order accepted."); }} className={btnPrimary}>Accept order</button>
                <button onClick={() => setConfirm("cancel")} className="w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">Decline order</button>
              </>
            )}
            {isFreelancer && (order.status === "in_progress" || order.status === "revision") && (
              <button onClick={() => setDeliverOpen(true)} className={btnPrimary}>Deliver work</button>
            )}

            {/* No action available for this role/status */}
            {!(
              (isClient && (order.status === "delivered" || order.status === "pending" || (order.status === "completed" && !review))) ||
              (isFreelancer && ["pending", "in_progress", "revision"].includes(order.status))
            ) && <p className="text-sm text-slate-500">No actions available right now.</p>}
          </div>
        </aside>
      </div>

      <DeliverModal open={deliverOpen} onClose={() => setDeliverOpen(false)} onSubmit={handleDeliver} />
      <RevisionModal open={revisionOpen} onClose={() => setRevisionOpen(false)} onSubmit={handleRevision} remaining={revisionsLeft} />
      <ReviewModal open={reviewOpen} onClose={() => setReviewOpen(false)} onSubmit={handleReview} />
      <ConfirmModal
        open={!!cfg}
        onClose={() => setConfirm(null)}
        onConfirm={() => { cfg.run(); setConfirm(null); }}
        title={cfg?.title || ""}
        message={cfg?.message || ""}
        confirmLabel={cfg?.label}
        danger={cfg?.danger}
      />
    </div>
  );
}