"use client";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";
import { formatPrice } from "@/lib/utils";

export default function OrderModal({ open, onClose, gig, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { requirements: "" } });

  const close = () => {
    reset();
    onClose();
  };

  const submit = (data) => {
    onSubmit(data.requirements.trim());
    reset();
  };

  return (
    <Modal open={open} onClose={close} title="Place your order">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <div className="rounded-xl bg-slate-50 p-4 text-sm">
          <p className="font-semibold text-slate-900">{gig?.title}</p>
          <p className="mt-1 text-slate-600">
            {formatPrice(gig?.price)} · {gig?.deliveryDays} day delivery · {gig?.revisions} revisions
          </p>
        </div>

        <FormField label="Project requirements" id="requirements" error={errors.requirements?.message} hint="Describe what you need so the freelancer can start right away.">
          <textarea
            id="requirements"
            rows={5}
            className={inputClass}
            placeholder="Tell the freelancer about your project..."
            {...register("requirements", {
              required: "Please describe your requirements.",
              minLength: { value: 20, message: "Please write at least 20 characters." },
              maxLength: { value: 1000, message: "Keep it under 1000 characters." },
            })}
          />
        </FormField>

        <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Demo order: no real payment is taken.
        </p>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={close} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Confirm order</button>
        </div>
      </form>
    </Modal>
  );
}