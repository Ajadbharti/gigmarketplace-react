import Link from "next/link";
import { categories } from "@/data/categories";
import ResetDemoButton from "./ResetDemoButton";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 font-bold text-white">S</span>
            <span className="text-lg font-bold text-white">SkillBridge</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            A demo freelance marketplace connecting clients with talented independent professionals.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}><Link href={`/gigs?category=${c.id}`} className="hover:text-white">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/gigs" className="hover:text-white">Explore gigs</Link></li>
            <li><Link href="/register?role=freelancer" className="hover:text-white">Become a freelancer</Link></li>
            <li><Link href="/login" className="hover:text-white">Login</Link></li>
            <li><Link href="/register" className="hover:text-white">Sign up</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Demo notice</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            All data is mock data stored in your browser. Authentication is for demonstration only and is not secure. No real payments are processed.
          </p>
        </div>
      </div>
            <div className="flex flex-wrap items-center justify-center gap-4 border-t border-slate-800 py-5 text-xs text-slate-500">
        <span>© 2026 SkillBridge. Demo project.</span>
        <ResetDemoButton />
      </div>
    </footer>
  );
}