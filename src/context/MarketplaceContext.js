"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedGigs } from "@/data/gigs";
import { seedOrders } from "@/data/orders";
import { seedReviews } from "@/data/reviews";
import { seedFreelancers } from "@/data/freelancers";
import { KEYS, loadItem, saveItem, removeItem } from "@/lib/storage";
import { generateId } from "@/lib/utils";

const MarketplaceContext = createContext(null);

export function MarketplaceProvider({ children }) {
  const [gigs, setGigs] = useState(seedGigs);
  const [orders, setOrders] = useState(seedOrders);
  const [reviews, setReviews] = useState(seedReviews);
  const [freelancers, setFreelancers] = useState(seedFreelancers);
  const [ready, setReady] = useState(false);

  // Load from LocalStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    setGigs(loadItem(KEYS.gigs, seedGigs));
    setOrders(loadItem(KEYS.orders, seedOrders));
    setReviews(loadItem(KEYS.reviews, seedReviews));
    setFreelancers(loadItem(KEYS.freelancers, seedFreelancers));
    setReady(true);
  }, []);

  useEffect(() => { if (ready) saveItem(KEYS.gigs, gigs); }, [gigs, ready]);
  useEffect(() => { if (ready) saveItem(KEYS.orders, orders); }, [orders, ready]);
  useEffect(() => { if (ready) saveItem(KEYS.reviews, reviews); }, [reviews, ready]);
  useEffect(() => { if (ready) saveItem(KEYS.freelancers, freelancers); }, [freelancers, ready]);

  /* ---------- Getters ---------- */
  const getGig = useCallback((id) => gigs.find((g) => g.id === id), [gigs]);
  const getFreelancer = useCallback((id) => freelancers.find((f) => f.id === id), [freelancers]);
  const getOrder = useCallback((id) => orders.find((o) => o.id === id), [orders]);
  const getReviewsForGig = useCallback(
    (gigId) => reviews.filter((r) => r.gigId === gigId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [reviews]
  );
  const getReviewsForFreelancer = useCallback(
    (fid) => reviews.filter((r) => r.freelancerId === fid).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [reviews]
  );
  const getReviewForOrder = useCallback((orderId) => reviews.find((r) => r.orderId === orderId), [reviews]);

  const getGigStats = useCallback(
    (gigId) => {
      const list = reviews.filter((r) => r.gigId === gigId);
      const rating = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
      return { rating, count: list.length };
    },
    [reviews]
  );

  const getFreelancerStats = useCallback(
    (fid) => {
      const list = reviews.filter((r) => r.freelancerId === fid);
      const rating = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
      const profile = freelancers.find((f) => f.id === fid);
      const completedOrders =
        (profile?.baseCompletedOrders || 0) +
        orders.filter((o) => o.freelancerId === fid && o.status === "completed").length;
      const prices = gigs.filter((g) => g.freelancerId === fid).map((g) => g.price);
      return {
        rating,
        count: list.length,
        completedOrders,
        startingPrice: prices.length ? Math.min(...prices) : null,
      };
    },
    [reviews, orders, gigs, freelancers]
  );

  /* ---------- Gigs ---------- */
  const addGig = useCallback((data) => {
    const gig = { ...data, id: generateId("g"), createdAt: new Date().toISOString() };
    setGigs((prev) => [gig, ...prev]);
    return gig;
  }, []);
  const updateGig = useCallback((id, patch) => {
    setGigs((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);
  const deleteGig = useCallback((id) => {
    setGigs((prev) => prev.filter((g) => g.id !== id));
  }, []);

  /* ---------- Orders ---------- */
  const patchOrder = (id, fn) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? fn(o) : o)));

  const createOrder = useCallback(({ gig, clientId, requirements }) => {
    const now = new Date().toISOString();
    const order = {
      id: generateId("o"),
      gigId: gig.id,
      gigTitle: gig.title,
      gigCover: gig.cover,
      clientId,
      freelancerId: gig.freelancerId,
      price: gig.price,
      deliveryDays: gig.deliveryDays,
      revisionsAllowed: gig.revisions,
      revisionsUsed: 0,
      status: "pending",
      requirements,
      deliveryLink: "",
      deliveryNote: "",
      createdAt: now,
      timeline: [{ status: "pending", at: now, note: "Order placed" }],
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const updateOrderStatus = useCallback((id, status, note = "", extra = {}) => {
    patchOrder(id, (o) => ({
      ...o,
      ...extra,
      status,
      timeline: [...o.timeline, { status, at: new Date().toISOString(), note: note || status }],
    }));
  }, []);

  const deliverOrder = useCallback(
    (id, { link, note }) =>
      updateOrderStatus(id, "delivered", "Work delivered", {
        deliveryLink: link || "",
        deliveryNote: note || "",
      }),
    [updateOrderStatus]
  );

  const requestRevision = useCallback(
    (id, note) => {
      const order = orders.find((o) => o.id === id);
      if (!order) return { ok: false, error: "Order not found." };
      if (order.revisionsUsed >= order.revisionsAllowed)
        return { ok: false, error: "No revisions left for this order." };
      updateOrderStatus(id, "revision", note || "Revision requested", {
        revisionsUsed: order.revisionsUsed + 1,
      });
      return { ok: true };
    },
    [orders, updateOrderStatus]
  );

  const completeOrder = useCallback(
    (id) => updateOrderStatus(id, "completed", "Order completed by client"),
    [updateOrderStatus]
  );
  const cancelOrder = useCallback(
    (id) => updateOrderStatus(id, "cancelled", "Order cancelled"),
    [updateOrderStatus]
  );

  /* ---------- Reviews ---------- */
  const addReview = useCallback(
    ({ orderId, rating, comment, client }) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return { ok: false, error: "Order not found." };
      if (order.status !== "completed")
        return { ok: false, error: "You can only review completed orders." };
      if (order.clientId !== client.id)
        return { ok: false, error: "Only the client of this order can review it." };
      if (reviews.some((r) => r.orderId === orderId))
        return { ok: false, error: "You have already reviewed this order." };
      const review = {
        id: generateId("r"),
        orderId,
        gigId: order.gigId,
        freelancerId: order.freelancerId,
        clientId: client.id,
        clientName: client.name,
        rating: Number(rating),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => [review, ...prev]);
      return { ok: true, review };
    },
    [orders, reviews]
  );

  /* ---------- Freelancer profiles ---------- */
  const addFreelancerProfile = useCallback((user) => {
    setFreelancers((prev) =>
      prev.some((f) => f.id === user.id)
        ? prev
        : [
            ...prev,
            {
              id: user.id,
              name: user.name,
              headline: "New freelancer on SkillBridge",
              bio: "Tell clients about yourself. Use Edit Profile to update your bio.",
              avatar: user.avatar,
              location: "",
              experience: "New",
              skills: [],
              languages: ["English"],
              website: "",
              baseCompletedOrders: 0,
              portfolio: [],
            },
          ]
    );
  }, []);
  const updateFreelancer = useCallback((id, patch) => {
    setFreelancers((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const resetDemoData = useCallback(() => {
    [KEYS.gigs, KEYS.orders, KEYS.reviews, KEYS.freelancers].forEach(removeItem);
    setGigs(seedGigs);
    setOrders(seedOrders);
    setReviews(seedReviews);
    setFreelancers(seedFreelancers);
  }, []);

  const value = useMemo(
    () => ({
      ready, gigs, orders, reviews, freelancers,
      getGig, getFreelancer, getOrder, getReviewsForGig, getReviewsForFreelancer, getReviewForOrder,
      getGigStats, getFreelancerStats,
      addGig, updateGig, deleteGig,
      createOrder, updateOrderStatus, deliverOrder, requestRevision, completeOrder, cancelOrder,
      addReview, addFreelancerProfile, updateFreelancer, resetDemoData,
    }),
    [
      ready, gigs, orders, reviews, freelancers,
      getGig, getFreelancer, getOrder, getReviewsForGig, getReviewsForFreelancer, getReviewForOrder,
      getGigStats, getFreelancerStats,
      addGig, updateGig, deleteGig,
      createOrder, updateOrderStatus, deliverOrder, requestRevision, completeOrder, cancelOrder,
      addReview, addFreelancerProfile, updateFreelancer, resetDemoData,
    ]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return ctx;
}