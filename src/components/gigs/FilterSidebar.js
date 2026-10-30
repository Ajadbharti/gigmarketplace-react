"use client";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";

const ratingOptions = [
  { value: "0", label: "Any rating" },
  { value: "3", label: "3.0 & up" },
  { value: "4", label: "4.0 & up" },
  { value: "4.5", label: "4.5 & up" },
];

export default function FilterSidebar({ filters, onChange, onClear, hasActive }) {
  const [min, setMin] = useState(filters.min);
  const [max, setMax] = useState(filters.max);

  useEffect(() => {
    setMin(filters.min);
    setMax(filters.max);
  }, [filters.min, filters.max]);

  const priceError = min !== "" && max !== "" && Number(min) > Number(max);

  const applyPrice = () => {
    if (priceError) return;
    onChange({ min, max });
  };

  const inputCls =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

  return (
    <aside aria-label="Filters" className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Filters</h2>
        {hasActive && (
          <button onClick={onClear} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Clear all
          </button>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-800">Category</legend>
        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="category" checked={filters.category === ""} onChange={() => onChange({ category: "" })} className="accent-indigo-600" />
            All categories
          </label>
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input type="radio" name="category" checked={filters.category === c.id} onChange={() => onChange({ category: c.id })} className="accent-indigo-600" />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-800">Price range ($)</legend>
        <div className="flex items-center gap-2">
          <input type="number" min="0" inputMode="numeric" aria-label="Minimum price" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} onBlur={applyPrice} onKeyDown={(e) => e.key === "Enter" && applyPrice()} className={inputCls} />
          <span className="text-slate-400">to</span>
          <input type="number" min="0" inputMode="numeric" aria-label="Maximum price" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} onBlur={applyPrice} onKeyDown={(e) => e.key === "Enter" && applyPrice()} className={inputCls} />
        </div>
        {priceError && <p role="alert" className="mt-1 text-xs text-red-600">Min price cannot be higher than max price.</p>}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-800">Minimum rating</legend>
        <div className="space-y-1.5">
          {ratingOptions.map((o) => (
            <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input type="radio" name="rating" checked={filters.rating === o.value} onChange={() => onChange({ rating: o.value })} className="accent-indigo-600" />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
    </aside>
  );
}