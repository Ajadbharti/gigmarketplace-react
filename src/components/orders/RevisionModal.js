"use client";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";

export default function RevisionModal({ open, onClose, onSubmit, remaining }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { note: "" } });

  const close = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={close} title="Request a revision">
      <form
        onSubmit={handleSubmit((d) => {
          onSubmit(d.note.trim());
          reset();
        })}
        noValidate
        className="space-y-4"
      >
        <p className="text-sm text-slate-600">Revisions remaining: <strong>{remaining}</strong></p>
        <FormField label="What should be changed?" id="rev-note" error={errors.note?.message}>
          <textarea
            id="rev-note"
            rows={4}
            className={inputClass}
            {...register("note", {
              required: "Please describe the changes you need.",
              minLength: { value: 10, message: "Write at least 10 characters." },
              maxLength: { value: 800, message: "Max 800 characters." },
            })}
          />
        </FormField>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={close} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Send request</button>
        </div>
      </form>
    </Modal>
  );
}