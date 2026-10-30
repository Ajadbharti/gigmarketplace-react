import { ORDER_STATUS, formatDate } from "@/lib/utils";

export default function OrderTimeline({ timeline = [] }) {
  return (
    <ol className="relative space-y-5 border-l-2 border-slate-200 pl-6">
      {timeline.map((t, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white bg-indigo-600 ring-2 ring-indigo-200" />
          <p className="text-sm font-semibold text-slate-900">{ORDER_STATUS[t.status]?.label || t.status}</p>
          <p className="text-sm text-slate-600">{t.note}</p>
          <p className="text-xs text-slate-400">{formatDate(t.at)}</p>
        </li>
      ))}
    </ol>
  );
}