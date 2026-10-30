export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-6 py-10">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-slate-200" />
      <div className="h-72 w-full animate-pulse rounded-lg bg-slate-200" />
    </div>
  );
}