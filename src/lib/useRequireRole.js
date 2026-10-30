"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

// Redirects to /login if logged out, or to the user's own dashboard if the role is wrong.
export default function useRequireRole(role) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const allowed = ready && !!user && (!role || user.role === role);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (role && user.role !== role) {
      toast.error(`This page is only for ${role}s.`);
      router.replace(user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
    }
  }, [ready, user, role, pathname, router, toast]);

  return { user, ready, allowed };
}