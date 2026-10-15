import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/BrandMark";
import { useAuth } from "@/hooks/use-auth";

export function PublicNavigation() {
  const { user } = useAuth();
  const jump = (id: "simulator" | "coverage") => {
    if (window.location.pathname !== "/") { window.location.assign("/#" + id); return; }
    const target = document.getElementById(id);
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 82, behavior: "smooth" });
    window.history.replaceState(null, "", "#" + id);
  };
  return <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f7f8fa]/95 backdrop-blur"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8"><BrandMark /><nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex"><button onClick={() => jump("simulator")} className="hover:text-slate-950">Sandbox simulator</button><button onClick={() => jump("coverage")} className="hover:text-slate-950">Coverage</button><Link href="/pricing" className="hover:text-slate-950">Pricing</Link><Link href="/docs" className="hover:text-slate-950">Docs</Link></nav><div className="flex items-center gap-2">{!user && <Link href="/login"><Button variant="ghost" className="hidden sm:inline-flex">Sign in</Button></Link>}<Link href={user ? "/dashboard" : "/signup"}><Button className="rounded-lg bg-slate-950 text-white hover:bg-slate-800">{user ? "Open workspace" : "Start assessment"}<ArrowRight className="ml-2 h-4 w-4" /></Button></Link></div></div></header>;
}

export function PublicFooter() {
  return <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-xs text-slate-500 sm:flex-row lg:px-8"><BrandMark compact /><div className="flex items-center gap-5"><Link href="/docs" className="hover:text-slate-950">Documentation</Link><Link href="/pricing" className="hover:text-slate-950">Pricing</Link><a href="https://github.com/DEEP13-2-5/Prefracta-AI" target="_blank" rel="noreferrer" className="hover:text-slate-950">GitHub</a></div><span>© 2026 Prefracta AI</span></div></footer>;
}
