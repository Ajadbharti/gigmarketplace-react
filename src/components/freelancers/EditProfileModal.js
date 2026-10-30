"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";

const toList = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function EditProfileModal({ open, onClose, freelancer }) {
  const { updateFreelancer } = useMarketplace();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (open && freelancer) {
      reset({
        name: freelancer.name,
        headline: freelancer.headline,
        bio: freelancer.bio,
        location: freelancer.location || "",
        experience: freelancer.experience || "",
        website: freelancer.website || "",
        avatar: freelancer.avatar || "",
        skills: (freelancer.skills || []).join(", "),
        languages: (freelancer.languages || []).join(", "),
      });
    }
  }, [open, freelancer, reset]);

  const submit = (d) => {
    updateFreelancer(freelancer.id, {
      name: d.name.trim(),
      headline: d.headline.trim(),
      bio: d.bio.trim(),
      location: d.location.trim(),
      experience: d.experience.trim(),
      website: d.website.trim(),
      avatar: d.avatar.trim(),
      skills: toList(d.skills),
      languages: toList(d.languages),
    });
    toast.success("Profile updated.");
    onClose();
  };

  const urlRule = { value: /^https?:\/\/.+/i, message: "Enter a valid URL starting with http:// or https://" };

  return (
    <Modal open={open} onClose={onClose} title="Edit profile">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <FormField label="Full name" id="name" error={errors.name?.message}>
          <input id="name" className={inputClass} {...register("name", { required: "Name is required." })} />
        </FormField>
        <FormField label="Professional headline" id="headline" error={errors.headline?.message}>
          <input id="headline" className={inputClass} {...register("headline", { required: "Headline is required.", minLength: { value: 5, message: "At least 5 characters." } })} />
        </FormField>
        <FormField label="Biography" id="bio" error={errors.bio?.message}>
          <textarea id="bio" rows={4} className={inputClass} {...register("bio", { required: "Bio is required.", minLength: { value: 20, message: "At least 20 characters." }, maxLength: { value: 600, message: "Max 600 characters." } })} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Location" id="location">
            <input id="location" className={inputClass} {...register("location")} />
          </FormField>
          <FormField label="Experience" id="experience">
            <input id="experience" className={inputClass} placeholder="e.g. 5 years" {...register("experience")} />
          </FormField>
        </div>
        <FormField label="Skills" id="skills" hint="Separate with commas">
          <input id="skills" className={inputClass} {...register("skills")} />
        </FormField>
        <FormField label="Languages" id="languages" hint="Separate with commas">
          <input id="languages" className={inputClass} {...register("languages")} />
        </FormField>
        <FormField label="Website (optional)" id="website" error={errors.website?.message}>
          <input id="website" className={inputClass} {...register("website", { pattern: urlRule })} />
        </FormField>
        <FormField label="Avatar image URL (optional)" id="avatar" error={errors.avatar?.message}>
          <input id="avatar" className={inputClass} {...register("avatar", { pattern: urlRule })} />
        </FormField>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save changes</button>
        </div>
      </form>
    </Modal>
  );
}