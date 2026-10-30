"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Star } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";
import { cn } from "@/lib/utils";

export default function ReviewModal({ open, onClose, onSubmit, title = "Leave a review" }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [ratingError, setRatingError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { comment: "" } });

  const close = () => {
    reset();
    setRating(0);
    setRatingError("");
    onClose();
  };

  const submit = (d) => {
    if (rating < 1) {
      setRatingError("Please select a rating from 1 to 5 stars.");
      return;
    }
    onSubmit({ rating, comment: d.comment.trim() });
    reset();
    setRating(0);
    setRatingError("");
  };

  return (
    <Modal open={open} onClose={close} title={title}>
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-700">Your rating</p>
          <div role="radiogroup" aria-label="Rating" className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => {
                  setRating(n);
                  setRatingError("");
                }}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
              >
                <Star className={cn("h-8 w-8 transition", n <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
              </button>
            ))}
          </div>
          {ratingError && <p role="alert" className="mt-1 text-xs text-red-600">{ratingError}</p>}
        </div>
        <FormField label="Your feedback" id="comment" error={errors.comment?.message}>
          <textarea
            id="comment"
            rows={4}
            className={inputClass}
            placeholder="Share your experience working with this freelancer..."
            {...register("comment", {
              required: "Please write some feedback.",
              minLength: { value: 10, message: "Write at least 10 characters." },
              maxLength: { value: 500, message: "Max 500 characters." },
            })}
          />
        </FormField>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={close} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Submit review</button>
        </div>
      </form>
    </Modal>
  );
}