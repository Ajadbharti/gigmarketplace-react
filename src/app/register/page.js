"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ShieldAlert } from "lucide-react";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { register: registerUser } = useAuth();
  const { addFreelancerProfile } = useMarketplace();
  const toast = useToast();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      role: params.get("role") === "freelancer" ? "freelancer" : "client",
    },
  });
  const role = watch("role");

  const submit = (d) => {
    const res = registerUser({ name: d.name, email: d.email, password: d.password, role: d.role });
    if (!res.ok) {
      setServerError(res.error);
      return;
    }
    if (d.role === "freelancer") addFreelancerProfile(res.user);
    toast.success("Account created! Welcome to SkillBridge.");
    router.push(d.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
  };

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-1 text-slate-500">Join as a client or a freelancer.</p>

      <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <p><strong>Demo authentication only.</strong> Data is saved in your browser, not on a server. Do not use a real password.</p>
      </div>

      <form onSubmit={handleSubmit(submit)} noValidate className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {serverError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">I want to join as</legend>
          <div className="grid grid-cols-2 gap-3">
            {["client", "freelancer"].map((r) => (
              <label key={r} className={cn("cursor-pointer rounded-xl border p-4 text-sm focus-within:ring-2 focus-within:ring-indigo-300", role === r ? "border-indigo-600 bg-indigo-50" : "border-slate-300")}>
                <input type="radio" value={r} className="sr-only" {...register("role")} />
                <span className="block font-semibold capitalize text-slate-900">{r}</span>
                <span className="block text-xs text-slate-500">{r === "client" ? "I want to hire talent" : "I want to sell my services"}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <FormField label="Full name" id="name" error={errors.name?.message}>
          <input id="name" autoComplete="name" className={inputClass} {...register("name", { required: "Name is required.", minLength: { value: 2, message: "At least 2 characters." } })} />
        </FormField>
        <FormField label="Email" id="email" error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className={inputClass} {...register("email", { required: "Email is required.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." } })} />
        </FormField>
        <FormField label="Password" id="password" error={errors.password?.message} hint="At least 6 characters">
          <input id="password" type="password" autoComplete="new-password" className={inputClass} {...register("password", { required: "Password is required.", minLength: { value: 6, message: "At least 6 characters." } })} />
        </FormField>
        <FormField label="Confirm password" id="confirm" error={errors.confirm?.message}>
          <input id="confirm" type="password" autoComplete="new-password" className={inputClass} {...register("confirm", { required: "Please confirm your password.", validate: (v) => v === watch("password") || "Passwords do not match." })} />
        </FormField>

        <button type="submit" className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">Create account</button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Log in</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 py-14">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}