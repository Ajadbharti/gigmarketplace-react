"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import useRequireRole from "@/lib/useRequireRole";
import GigForm from "@/components/gigs/GigForm";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function EditGigPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const { user, allowed } = useRequireRole("freelancer");
  const { ready, getGig, updateGig } = useMarketplace();

  if (!allowed || !ready) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const gig = getGig(id);
  if (!gig || gig.freelancerId !== user.id) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
        <SearchX className="h-14 w-14 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Gig not found</h1>
        <p className="mt-2 text-slate-500">This gig does not exist or you do not own it.</p>
        <Link href="/dashboard/freelancer" className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Back to dashboard</Link>
      </div>
    );
  }

  const submit = (values) => {
    updateGig(gig.id, values);
    toast.success("Gig updated.");
    router.push("/dashboard/freelancer");
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/dashboard/freelancer" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit gig</h1>
      <GigForm
        defaultValues={{ ...gig, skills: (gig.skills || []).join(", "), tags: (gig.tags || []).join(", ") }}
        onSubmit={submit}
        submitLabel="Save changes"
        onCancel={() => router.push("/dashboard/freelancer")}
      />
    </div>
  );
}