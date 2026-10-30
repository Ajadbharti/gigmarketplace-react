"use client";
import { useEffect, useState } from "react";
import { cn, getInitials } from "@/lib/utils";

// Plain <img> with a graceful fallback if the URL is missing or broken.
export default function SafeImage({ src, alt = "", className, fallbackText }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white",
          className
        )}
      >
        {getInitials(fallbackText || alt) || "SB"}
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />;
}