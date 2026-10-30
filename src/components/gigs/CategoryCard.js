import Link from "next/link";
import { Code, Palette, Search, Video, PenLine, PenTool, Smartphone, Share2, Briefcase } from "lucide-react";

const icons = { Code, Palette, Search, Video, PenLine, PenTool, Smartphone, Share2 };

export default function CategoryCard({ category }) {
  const Icon = icons[category.icon] || Briefcase;
  return (
    <Link
      href={`/gigs?category=${category.id}`}
      className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <h3 className="font-semibold text-slate-900">{category.name}</h3>
        <p className="text-sm text-slate-500">{category.description}</p>
      </div>
    </Link>
  );
}