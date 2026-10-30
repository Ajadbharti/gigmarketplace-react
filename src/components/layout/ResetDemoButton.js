"use client";
import { useMarketplace } from "@/context/MarketplaceContext";
import { KEYS, removeItem } from "@/lib/storage";

export default function ResetDemoButton() {
  const { resetDemoData } = useMarketplace();

  const handleReset = () => {
    const ok = window.confirm(
      "Reset all demo data (gigs, orders, reviews, profiles and accounts) to the original seed data?"
    );
    if (!ok) return;
    resetDemoData();
    removeItem(KEYS.users);
    removeItem(KEYS.session);
    window.location.href = "/";
  };

  return (
    <button onClick={handleReset} className="underline underline-offset-2 hover:text-slate-300">
      Reset demo data
    </button>
  );
}