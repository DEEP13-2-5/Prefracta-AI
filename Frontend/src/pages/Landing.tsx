import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Globe2, LockKeyhole, Play, Radar, Server, ShieldCheck, Terminal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/BrandMark";
import { useAuth } from "@/hooks/use-auth";

type Phase = 0 | 1 | 2 | 3 | 4;
const stages = [["Isolated sandbox", Server], ["Load resilience", Zap], ["Browser audit", Radar], ["Repository security", LockKeyhole]] as const;

export default function Landing() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>(0);
  const app = user ? "/dashboard" : "/signup";
  useEffect(() => { if (phase === 0 || phase === 4) return; const timer = window.setTimeout(() => setPhase((phase + 1) as Phase), phase === 1 ? 1300 : 2500); return () => window.clearTimeout(timer); }, [phase]);
  useEffect(() => {
    const scrollToSection = (id: string, smooth = false) => {
      const target = document.getElementById(id);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 82;
      const options: ScrollToOptions = { top, behavior: smooth ? "smooth" : "auto" };
      window.scrollTo(options);
      document.documentElement.scrollTo(options);
      document.body.scrollTo(options);
    };
    const initialId = window.location.hash.slice(1);
    if (initialId === "simulator" || initialId === "coverage") {
      window.setTimeout(() => scrollToSection(initialId), 50);
      window.setTimeout(() => scrollToSection(initialId), 300);
    }
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (id === "simulator" || id === "coverage") {
        window.setTimeout(() => scrollToSection(id, true), 50);
        window.setTimeout(() => scrollToSection(id, true), 300);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    const jump = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest('a[href="#simulator"], a[href="#coverage"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      event.preventDefault();
      const target = anchor.getAttribute("href")?.slice(1);
      if (target) { scrollToSection(target, true); window.history.replaceState(null, "", "#" + target); window.setTimeout(() => scrollToSection(target, true), 300); }
    };
    document.addEventListener("click", jump);
    return () => { document.removeEventListener("click", jump); window.removeEventListener("hashchange", onHashChange); };
  }, []);
  return <div className="min-h-screen bg-[#f7f8fa] text-slate-950"><header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f8fa]/90 backdrop-blur"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8"><BrandMark /><nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex"><a href="#simulator" className="hover:text-slate-950">Sandbox simulator</a><a href="#coverage" className="hover:text-slate-950">Coverage</a><Link href="/pricing" className="hover:text-slate-950">Pricing</Link><Link href="/docs" className="hover:text-slate-950">Docs</Link></nav><div className="flex items-center gap-2">{!user && <Link href="/login"><Button variant="ghost" className="hidden sm:inline-flex">Sign in</Button></Link>}<Link href={app}><Button className="rounded-lg bg-slate-950 text-white hover:bg-slate-800">{user ? "Open workspace" : "Start assessment"}<ArrowRight className="ml-2 h-4 w-4" /></Button></Link></div></div></header><main><section className="mx-auto max-w-7xl px-5 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28"><div className="mx-auto max-w-4xl text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">Release readiness, evidenced</p><h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-[-.055em] sm:text-6xl lg:text-7xl">Know what could break<br /><span className="text-blue-600">before you ship.</span></h1><p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">Prefracta turns load testing, browser audits, GitHub checks and a security baseline into one clear release decision.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Button size="lg" onClick={() => document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" })} className="h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Watch sandbox assessment <Play className="ml-2 h-4 w-4" /></Button><Link href={app}><Button size="lg" variant="outline" className="h-12 rounded-lg border-slate-300 bg-white">Run a real assessment</Button></Link></div><p className="mt-7 text-sm text-slate-500">Read-only GitHub review · No production changes · Evidence before AI interpretation</p></div></section><section id="simulator" className="border-y border-slate-200 bg-white py-20"><div className="mx-auto max-w-6xl px-5"><div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">Interactive sandbox simulator</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A release assessment, without the noise.</h2><p className="mt-3 text-slate-600">See each evidence stream arrive in the same report.</p></div><Sandbox phase={phase} start={() => setPhase(1)} /></div></section><section id="coverage" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">Focused coverage</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">One decision. Four observable checks.</h2><p className="mt-4 leading-7 text-slate-600">AI writes the summary, but the evidence always stays visible. That makes release reviews fast and defensible.</p></div><div className="grid gap-3 sm:grid-cols-2">{stages.map(([label, Icon], index) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5"><div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-900"><Icon className="h-5 w-5" /></div><h3 className="mt-5 font-semibold">{label}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{["Temporary test environment", "Latency, errors and throughput", "UX and accessibility signals", "CI/CD and configuration signals"][index]}</p></div>)}</div></div></section></main></div>;
}
function Sandbox({ phase, start }: { phase: Phase; start: () => void }) {
  const running = phase > 0 && phase < 4;
  const status = phase === 4 ? "Assessment complete" : running ? "Assessment running" : "Ready to simulate";
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_65px_-35px_rgba(15,23,42,.35)]"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><span className="ml-2 font-mono text-xs text-slate-400">assessment / staging-environment</span></div><span className={"rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider " + (phase === 4 ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700")}>{status}</span></div><div className="grid lg:grid-cols-[1.05fr_.95fr]"><div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r"><div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2"><Globe2 className="ml-2 mt-2 h-4 w-4 text-slate-400" /><span className="flex-1 py-2 text-sm text-slate-600">https://staging.your-app.com</span><Button onClick={start} disabled={running} className="rounded-lg bg-slate-950 text-white hover:bg-slate-800">{phase === 4 ? "Run again" : "Simulate"} <Play className="ml-1 h-3.5 w-3.5" /></Button></div><div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-slate-400"><Terminal className="h-4 w-4" /> Assessment checks</div><div className="mt-5 space-y-3">{stages.map(([label, Icon], index) => { const done = phase === 4 || phase > index + 1; const active = phase === index + 1; return <div key={label} className={"flex items-center gap-3 text-sm transition-colors " + (done ? "text-slate-800" : active ? "text-blue-700" : "text-slate-400")}><span className={"grid h-6 w-6 place-items-center rounded-full " + (done ? "bg-emerald-100 text-emerald-700" : active ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-400")}>{done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className={"h-3.5 w-3.5 " + (active ? "animate-pulse" : "")} />}</span>{done ? "Passed" : active ? "Running" : "Queued"} · {label}</div>; })}</div></div></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Observed telemetry</p><div className="mt-5 grid grid-cols-2 gap-3">{[["Virtual users", phase >= 2 ? "200" : "0"], ["p95 latency", phase === 4 ? "182 ms" : "—"], ["Error rate", phase === 4 ? "0.02%" : "—"], ["Security review", phase === 4 ? "2 notes" : "—"]].map(([label, value]) => <div key={label} className="rounded-lg border border-slate-200 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div>)}</div><div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><ShieldCheck className="mr-2 inline h-4 w-4 text-blue-600" />{phase === 4 ? "AI summary: runtime is stable. Review the two repository configuration notes before release." : "The AI summary appears after the observable checks complete."}</div></div></div></div>;
}
