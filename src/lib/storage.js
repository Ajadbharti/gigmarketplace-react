export const KEYS = {
  users: "gm_users",
  session: "gm_session",
  gigs: "gm_gigs",
  orders: "gm_orders",
  reviews: "gm_reviews",
  freelancers: "gm_freelancers",
};

export function loadItem(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveItem(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function removeItem(key) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
}