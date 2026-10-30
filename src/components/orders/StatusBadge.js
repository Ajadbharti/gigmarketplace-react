import { ORDER_STATUS } from "@/lib/utils";

export default function StatusBadge({ status }) {
  const s = ORDER_STATUS[status] || { label: status, color: "bg-slate-100 text-slate-700" };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.color}`}>{s.label}</span>;
}