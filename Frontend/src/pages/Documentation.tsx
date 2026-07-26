import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
    Activity,
    GitBranch,
    ArrowRight,
    ExternalLink,
    Terminal,
    Cpu,
    Code,
    Shield,
    Zap,
    Book,
    ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const sections = [
    {
        icon: Zap,
        title: "Getting Started",
        tag: "QUICK START",
        content:
            "Enter the URL of the application you want to stress-test. Prefracta provisions an isolated cloud sandbox, pulls your environment definitions, and gets the audit engine ready — in seconds.",
        code: `$ npx prefracta-cli provision \\
   --url=https://staging.myapp.dev \\
   --env=staging-mirror`,
    },
    {
        icon: Terminal,
        title: "Load Test Configuration",
        tag: "K6 ENGINE",
        content:
            "Configure concurrent users, duration, ramp-up strategy, and request patterns. For deeper analysis, connect your GitHub repo so the AI can correlate commits with performance regressions.",
        code: `export const options = {
  stages: [
    { duration: '2m', target: 2000 },
    { duration: '5m', target: 5000 },
    { duration: '2m', target: 0 },
  ],
};`,
    },
    {
        icon: Cpu,
        title: "Understanding Metrics",
        tag: "TELEMETRY",
        content:
            "Track response times (p50, p95, p99), throughput RPS, error rates, and memory spikes. All metrics are visualized in real-time — you'll see exactly when and where your system starts to degrade.",
        code: `{
  "p95_latency_ms": 248,
  "throughput_rps": 4820,
  "error_rate": "0.04%",
  "max_concurrency": 8200
}`,
    },
    {
        icon: Code,
        title: "AI Analysis & Recommendations",
        tag: "AI ENGINE",
        content:
            "Prefracta's AI doesn't just display charts — it identifies anomalous patterns, predicts scalability ceilings, and generates concrete architecture recommendations. From caching strategies to DB pool tuning.",
        code: `// AI-generated recommendation
FINDING: Connection pool exhaustion at 3,200 VUs
ACTION:  Increase pg pool max from 20 → 100
IMPACT:  Estimated +1,800 concurrency headroom`,
    },
    {
        icon: Shield,
        title: "Security & Stability Radar",
        tag: "STABILITY",
        content:
            "The stability radar assesses non-functional aspects: rate-limiting effectiveness, authentication resilience under flood, and data consistency under concurrent write loads.",
        code: `RATE_LIMIT:    ✓ PASSING (triggers at 1000 req/min)
AUTH_RESILIENCE: ✓ PASSING (no token leakage)
DATA_INTEGRITY:  ✓ PASSING (ACID guarantees hold)`,
    },
    {
        icon: Book,
        title: "CI/CD Integration",
        tag: "DEVOPS",
        content:
            "Embed Prefracta directly into your pull request pipeline. Trigger load tests automatically on every PR, and auto-block merges when performance benchmarks regress beyond defined SLO thresholds.",
        code: `# .github/workflows/prefracta.yml
- name: Run Load Audit
  run: npx prefracta-cli run \\
    --url=\$\{\{ env.STAGING_URL \}\} \\
    --slo-threshold=80`,
    },
];

export default function Documentation() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState<number | null>(null);

    useEffect(() => {
        document.title = "Documentation — Prefracta AI | DevOps Load Testing Guide";
        const setMeta = (name: string, content: string) => {
            let el = document.querySelector(`meta[name="${name}"]`);
            if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
            el.setAttribute("content", content);
        };
        setMeta("description", "Complete documentation for Prefracta AI. Learn how to run load tests, configure k6 scripts, analyze AI recommendations, and integrate with your CI/CD pipeline.");
        setMeta("keywords", "Prefracta documentation, DevOps testing guide, k6 load testing, Playwright audit docs, launch readiness CI/CD");
    }, []);

    return (
        <div className="dark bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-300 relative overflow-x-hidden">

            {/* Tech grid background — identical to Landing */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-20" />

            {/* Glowing orbs */}
            <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0,transparent_65%)] blur-[80px] pointer-events-none -z-10" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0,transparent_65%)] blur-[80px] pointer-events-none -z-10" />

            {/* Header — exact same as Landing.tsx */}
            <header className="sticky top-0 z-50 border-b border-slate-800/40 bg-slate-950/60 backdrop-blur-xl transition-all duration-300">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">

                    <Link href="/">
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-700/60 flex items-center justify-center bg-slate-900 group-hover:border-cyan-500/60 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                                <Activity className="w-5 h-5 text-cyan-400 relative z-10 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                                Prefracta<span className="text-cyan-400 font-extrabold">.ai</span>
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="/#simulator" className="hover:text-white transition-colors duration-200">Sandbox Simulator</a>
                        <a href="/#breakpoint" className="hover:text-white transition-colors duration-200">Breakpoint Stressor</a>
                        <a href="/#features" className="hover:text-white transition-colors duration-200">Features</a>
                        <Link href="/pricing" className="hover:text-white transition-colors duration-200">Pricing</Link>
                        <Link href="/docs" className="text-white">Docs</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/DEEP13-2-5/Prefracta-AI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-slate-800 hover:border-slate-600 bg-slate-900/50"
                            title="View on GitHub"
                        >
                            <GitBranch className="w-3.5 h-3.5" />
                            GitHub
                        </a>
                        {user ? (
                            <Link href="/dashboard">
                                <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all group">
                                    Dashboard
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block">
                                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-900 rounded-full px-5">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-white hover:bg-slate-100 text-slate-950 font-semibold px-6 rounded-full transition-transform active:scale-95">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Page Hero */}
            <section className="pt-24 pb-16 text-center max-w-3xl mx-auto px-6">
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono mb-5"
                >
                    Technical Reference
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white"
                >
                    Master{" "}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                        Prefracta AI.
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6 text-lg text-slate-400 leading-relaxed"
                >
                    Everything you need to run production-grade load tests, interpret AI verdicts, and ship with confidence.
                </motion.p>
            </section>

            {/* Doc Sections */}
            <section className="max-w-5xl mx-auto px-6 pb-32 space-y-5">
                {sections.map((section, idx) => {
                    const isOpen = activeSection === idx;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + idx * 0.07 }}
                        >
                            <div
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    isOpen
                                        ? "border-cyan-500/40 bg-slate-900/70 shadow-[0_0_30px_rgba(6,182,212,0.08)]"
                                        : "border-slate-800/80 bg-slate-900/30 hover:border-slate-700"
                                }`}
                            >
                                {/* Section header — always visible */}
                                <button
                                    className="w-full flex items-center gap-4 p-6 text-left cursor-pointer group"
                                    onClick={() => setActiveSection(isOpen ? null : idx)}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                                        isOpen ? "bg-cyan-500/15 text-cyan-400" : "bg-slate-800 text-slate-400 group-hover:text-slate-300"
                                    }`}>
                                        <section.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block mb-0.5 ${isOpen ? "text-cyan-500" : "text-slate-600"}`}>
                                            {section.tag}
                                        </span>
                                        <span className={`text-base font-bold ${isOpen ? "text-white" : "text-slate-200"}`}>
                                            {section.title}
                                        </span>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${isOpen ? "rotate-90 text-cyan-400" : ""}`} />
                                </button>

                                {/* Expanded content */}
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-6"
                                    >
                                        <div className="grid lg:grid-cols-2 gap-6">
                                            <div>
                                                <div className="h-px bg-slate-800 mb-5" />
                                                <p className="text-slate-400 leading-relaxed text-sm">{section.content}</p>
                                            </div>
                                            <div>
                                                <div className="bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
                                                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/60 bg-slate-900/50">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                                        <span className="text-[10px] text-slate-600 font-mono ml-2">example</span>
                                                    </div>
                                                    <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                                                        {section.code}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </section>

            {/* CTA Banner */}
            <section className="max-w-5xl mx-auto px-6 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.04)_0,transparent_70%)]" />
                    <h2 className="text-2xl font-black text-white relative z-10">Need help or want to contribute?</h2>
                    <p className="text-slate-400 mt-3 mb-7 relative z-10 text-sm leading-relaxed max-w-lg mx-auto">
                        Open an issue, request a feature, or browse the source code. The entire Prefracta stack is MIT-licensed and open to the community.
                    </p>
                    <div className="flex justify-center gap-4 relative z-10 flex-wrap">
                        <a
                            href="https://github.com/DEEP13-2-5/Prefracta-AI"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] group">
                                <GitBranch className="w-4 h-4 mr-2" />
                                View on GitHub
                                <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-60 group-hover:opacity-100" />
                            </Button>
                        </a>
                        <Link href="/pricing">
                            <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold px-6 rounded-full">
                                View Pricing
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-900 py-12 bg-slate-950">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2.5">
                        <Activity className="w-4 h-4 text-cyan-500" />
                        <span className="text-sm font-bold text-slate-400">Prefracta<span className="text-cyan-500">.ai</span></span>
                    </div>
                    <div className="flex gap-8 text-xs font-medium text-slate-600">
                        <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                        <a
                            href="https://github.com/DEEP13-2-5/Prefracta-AI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-slate-300 transition-colors flex items-center gap-1"
                        >
                            GitHub <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                    <p className="text-slate-700 text-xs font-mono">© 2026 Prefracta AI · MIT License</p>
                </div>
            </footer>
        </div>
    );
}
