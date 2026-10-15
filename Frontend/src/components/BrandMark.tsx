import { Activity } from "lucide-react";
import { Link } from "wouter";

export function BrandMark({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return <Link href={href} className="inline-flex items-center gap-2.5 text-slate-950">
    <span className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
      <Activity className="h-5 w-5" strokeWidth={2.25} />
    </span>
    {!compact && <span className="text-lg font-extrabold tracking-tight">Prefracta<span className="text-blue-600">.ai</span></span>}
  </Link>;
}
