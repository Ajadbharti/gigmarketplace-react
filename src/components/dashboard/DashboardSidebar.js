"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardSidebar({ role, userId }) {
  const pathname = usePathname();
  const links =
    role === "freelancer"
      ? [
          { href: "/dashboard/freelancer", label: "Overview", icon: LayoutDashboard },
          { href: "/dashboard/freelancer/gigs/new", label: "Create gig", icon: PlusCircle },
          { href: `/freelancers/${userId}`, label: "My profile", icon: User },
        ]
      : [
          { href: "/dashboard/client", label: "My orders", icon: ShoppingBag },
          { href: "/gigs", label: "Browse gigs", icon: Search },
        ];

  return (
    <nav aria-label="Dashboard" className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 lg:flex-col lg:self-start">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition",
            pathname === href ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}