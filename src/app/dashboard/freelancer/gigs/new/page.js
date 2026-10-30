"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import useRequireRole from "@/lib/useRequireRole";
import GigForm from "@/components/gigs/GigForm";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function NewGigPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, allowed } = useRequireRole("freelancer");
  const { ready, addGig } = useMarketplace();

  if (!allowed || !ready) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const submit = (values) => {
    addGig({ ...values, freelancerId: user.id });
    toast.success("Gig published successfully!");
    router.push("/dashboard/freelancer");
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/dashboard/freelancer" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-slate-900">Create a new gig</h1>
      <p className="mb-6 text-slate-500">Describe your service so clients can find and order it.</p>
      <GigForm onSubmit={submit} submitLabel="Publish gig" onCancel={() => router.push("/dashboard/freelancer")} />
    </div>
  );
}