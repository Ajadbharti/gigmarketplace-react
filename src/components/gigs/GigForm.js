"use client";
import { useForm } from "react-hook-form";
import FormField, { inputClass } from "@/components/ui/FormField";
import { categories } from "@/data/categories";

const toList = (s) => (s || "").split(",").map((x) => x.trim()).filter(Boolean);
const whole = (v) => Number.isInteger(v) || "Must be a whole number.";

export default function GigForm({ defaultValues, onSubmit, submitLabel = "Publish gig", onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      price: "",
      deliveryDays: "",
      revisions: "",
      cover: "",
      skills: "",
      tags: "",
      ...defaultValues,
    },
  });

  const submit = (d) => {
    const title = d.title.trim();
    onSubmit({
      title,
      description: d.description.trim(),
      categoryId: d.categoryId,
      price: Number(d.price),
      deliveryDays: Number(d.deliveryDays),
      revisions: Number(d.revisions),
      cover:
        d.cover.trim() ||
        `https://picsum.photos/seed/${encodeURIComponent(title.slice(0, 20) || "gig")}/800/500`,
      skills: toList(d.skills),
      tags: toList(d.tags),
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <FormField label="Gig title" id="title" error={errors.title?.message} hint='Example: "I will build a responsive React website"'>
        <input id="title" className={inputClass} {...register("title", { required: "Title is required.", minLength: { value: 10, message: "At least 10 characters." }, maxLength: { value: 100, message: "Max 100 characters." } })} />
      </FormField>

      <FormField label="Description" id="description" error={errors.description?.message}>
        <textarea id="description" rows={6} className={inputClass} {...register("description", { required: "Description is required.", minLength: { value: 30, message: "At least 30 characters." }, maxLength: { value: 1200, message: "Max 1200 characters." } })} />
      </FormField>

      <FormField label="Category" id="categoryId" error={errors.categoryId?.message}>
        <select id="categoryId" className={inputClass} {...register("categoryId", { required: "Please choose a category." })}>
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Price (USD)" id="price" error={errors.price?.message}>
          <input id="price" type="number" className={inputClass} {...register("price", { required: "Price is required.", valueAsNumber: true, min: { value: 5, message: "Minimum $5." }, max: { value: 10000, message: "Maximum $10,000." } })} />
        </FormField>
        <FormField label="Delivery (days)" id="deliveryDays" error={errors.deliveryDays?.message}>
          <input id="deliveryDays" type="number" className={inputClass} {...register("deliveryDays", { required: "Delivery time is required.", valueAsNumber: true, min: { value: 1, message: "Minimum 1 day." }, max: { value: 90, message: "Maximum 90 days." }, validate: whole })} />
        </FormField>
        <FormField label="Revisions" id="revisions" error={errors.revisions?.message}>
          <input id="revisions" type="number" className={inputClass} {...register("revisions", { required: "Revisions are required.", valueAsNumber: true, min: { value: 0, message: "Minimum 0." }, max: { value: 20, message: "Maximum 20." }, validate: whole })} />
        </FormField>
      </div>

      <FormField label="Cover image URL (optional)" id="cover" error={errors.cover?.message} hint="Leave empty to use a placeholder image.">
        <input id="cover" className={inputClass} placeholder="https://..." {...register("cover", { pattern: { value: /^https?:\/\/.+/i, message: "Enter a valid URL starting with http:// or https://" } })} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Skills" id="skills" error={errors.skills?.message} hint="Separate with commas">
          <input id="skills" className={inputClass} placeholder="React, Tailwind CSS" {...register("skills", { validate: (v) => toList(v).length > 0 || "Add at least one skill." })} />
        </FormField>
        <FormField label="Tags (optional)" id="tags" hint="Separate with commas">
          <input id="tags" className={inputClass} placeholder="website, responsive" {...register("tags")} />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50">Cancel</button>
        )}
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}