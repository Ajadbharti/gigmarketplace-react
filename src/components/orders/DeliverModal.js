"use client";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";

export default function DeliverModal({ open, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: { link: "", note: "" } });

  const close = () => {
    reset();
    onClose();
  };

  const submit = (d) => {
    if (!d.link.trim() && !d.note.trim()) {
      setError("note", { message: "Add a delivery note or a delivery link." });
      return;
    }
    onSubmit({ link: d.link.trim(), note: d.note.trim() });
    reset();
  };

  return (
    <Modal open={open} onClose={close} title="Deliver work">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <FormField label="Delivery link (optional)" id="link" error={errors.link?.message} hint="Google Drive, Dropbox, GitHub, Figma, etc.">
          <input id="link" className={inputClass} placeholder="https://..." {...register("link", { pattern: { value: /^https?:\/\/.+/i, message: "Enter a valid URL starting with http:// or https://" } })} />
        </FormField>
        <FormField label="Delivery note" id="note" error={errors.note?.message}>
          <textarea id="note" rows={4} className={inputClass} placeholder="Describe what you are delivering..." {...register("note", { maxLength: { value: 800, message: "Max 800 characters." } })} />
        </FormField>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={close} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Deliver</button>
        </div>
      </form>
    </Modal>
  );
}