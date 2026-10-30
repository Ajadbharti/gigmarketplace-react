"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ShieldAlert } from "lucide-react";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const toast = useToast();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const next = params.get("next");
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;

  const submit = (d) => {
    const res = login(d.email, d.password);
    if (!res.ok) {
      setServerError(res.error);
      return;
    }
    toast.success(`Welcome back, ${res.user.name.split(" ")[0]}!`);
    router.push(safeNext || (res.user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client"));
  };

  const fill = (email) => {
    setValue("email", email);
    setValue("password", "demo1234");
    setServerError("");
  };

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-900">Log in</h1>
      <p className="mt-1 text-slate-500">Welcome back to SkillBridge.</p>

      <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          <strong>Demo authentication only.</strong> Accounts and passwords are stored in plain text in your browser&apos;s LocalStorage. This is not secure. Never use a real password.
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} noValidate className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {serverError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
        <FormField label="Email" id="email" error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className={inputClass} {...register("email", { required: "Email is required.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." } })} />
        </FormField>
        <FormField label="Password" id="password" error={errors.password?.message}>
          <input id="password" type="password" autoComplete="current-password" className={inputClass} {...register("password", { required: "Password is required." })} />
        </FormField>
        <button type="submit" className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">Log in</button>

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Quick demo accounts</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => fill("client@demo.com")} className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium hover:bg-slate-50">Demo client</button>
            <button type="button" onClick={() => fill("freelancer@demo.com")} className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium hover:bg-slate-50">Demo freelancer</button>
          </div>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        New here? <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 py-14">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}