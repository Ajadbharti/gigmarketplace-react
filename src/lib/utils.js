export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const formatPrice = (n) => `$${Number(n || 0).toLocaleString("en-US")}`;

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export const generateId = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// group: active | delivered | completed | cancelled (dashboard tabs use this)
export const ORDER_STATUS = {
  pending: { label: "Pending", group: "active", color: "bg-amber-100 text-amber-800" },
  in_progress: { label: "In progress", group: "active", color: "bg-blue-100 text-blue-800" },
  revision: { label: "Revision requested", group: "active", color: "bg-orange-100 text-orange-800" },
  delivered: { label: "Delivered", group: "delivered", color: "bg-violet-100 text-violet-800" },
  completed: { label: "Completed", group: "completed", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", group: "cancelled", color: "bg-slate-200 text-slate-700" },
};