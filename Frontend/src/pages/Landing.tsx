import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    CheckCircle2,
    BarChart2,
    Shield,
    Cpu,
    Zap,
    Activity,
    Code,
    Terminal,
    Globe,
    Lock,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export default function Landing() {
    const { user } = useAuth();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-[#020817] text-slate-50 flex flex-col font-sans selection:bg-primary/30 selection:text-primary-foreground">

            {/* Background Glow Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[160px] rounded-full" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
                            <img src="/logo.png" className="w-10 h-10 rounded-xl relative border border-white/10" alt="Logo" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                            Prefracta AI
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-primary transition-colors">Platform</a>
                        <Link href="/pricing" className="hover:text-primary transition-colors">Economics</Link>
                        <Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link href="/dashboard">
                                <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105">
                                    Launch Console <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block">
                                    <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 rounded-full font-semibold">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="rounded-full px-8 bg-white text-slate-950 hover:bg-slate-200 font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-1">

                {/* Hero section */}
                <section className="relative pt-24 pb-32 overflow-hidden">
                    <div className="container mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-10 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Live: Agentic DevOps Intelligence
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-6xl md:text-8xl lg:text-[100px] font-black tracking-tightest leading-[0.95] mb-8"
                        >
                            Audit Your Scale <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-blue-600 to-indigo-700">Before Deployment.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-14 font-medium leading-relaxed"
                        >
                            The world's first agentic performance audit platform. We don't just show charts;
                            we tell you <span className="text-white font-bold">why</span> your stack will break and <span className="text-white font-bold">how</span> to fix it.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-5"
                        >
                            <Link href="/signup">
                                <Button size="lg" className="rounded-full px-12 h-16 text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95">
                                    Start Performance Audit <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg font-bold border-white/10 hover:bg-white/5 transition-all">
                                View Demo Audit
                            </Button>
                        </motion.div>


                    </div>
                </section>

                {/* Features / Value Props */}
                <section id="features" className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                            <div className="max-w-2xl">
                                <div className="text-primary font-black uppercase tracking-widest text-sm mb-4">The Platform</div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                                    Engineered for <span className="text-slate-400 italic font-serif">Brutal Reality.</span>
                                </h2>
                            </div>
                            <p className="text-slate-400 max-w-sm font-medium">
                                Generic load tests lie. Prefracta AI simulates human behavior at massive scale to find your true breaking point.
                            </p>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {[
                                {
                                    icon: Activity,
                                    title: "Hyper-Scale Simulation",
                                    desc: "Generate 1,000,000+ virtual users with geographically distributed pressure from 20+ edge regions.",
                                    color: "blue",
                                },
                                {
                                    icon: Shield,
                                    title: "DevOps Integrity Audit",
                                    desc: "Deep analysis of your Docker, CI/CD, and Kubernetes configs to predict deployment failure before it happens.",
                                    color: "indigo",
                                },
                                {
                                    icon: Cpu,
                                    title: "Agentic Root Cause",
                                    desc: "Our LLM-powered engine interprets telemetry in real-time to explain bottlenecks in plain English.",
                                    color: "emerald",
                                },
                                {
                                    icon: Globe,
                                    title: "Global Edge Network",
                                    desc: "Test latency from the exact locations of your customers with millisecond precision.",
                                    color: "cyan",
                                },
                                {
                                    icon: Lock,
                                    title: "Security Hardening",
                                    desc: "Automated vulnerability scanning during load tests to ensure your stack doesn't leak under pressure.",
                                    color: "amber",
                                },
                                {
                                    icon: Code,
                                    title: "CI/CD Enforcement",
                                    desc: "Block merges automatically if your latest commit degrades performance beyond your defined SLOs.",
                                    color: "rose",
                                },
                            ].map((f, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    className="group p-10 rounded-[2.5rem] bg-slate-900/20 border border-white/5 hover:border-white/10 transition-all hover:bg-slate-900/40 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <f.icon className="w-32 h-32" />
                                    </div>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-slate-800/50 border border-white/5 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                        <f.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>



                {/* Final CTA */}
                <section className="py-32 relative overflow-hidden">
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="max-w-4xl mx-auto rounded-[3.5rem] bg-gradient-to-b from-primary/20 to-transparent border border-primary/20 p-16 md:p-24 backdrop-blur-sm">
                            <h2 className="text-4xl md:text-7xl font-black tracking-tightest leading-none mb-10">
                                Ready to Ship with <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 italic">Absolute Certainty?</span>
                            </h2>
                            <Link href="/signup">
                                <Button size="lg" className="rounded-full px-12 h-20 text-xl font-black bg-white text-slate-950 hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-2xl">
                                    Create Free Audit Account
                                </Button>
                            </Link>
                            <p className="mt-8 text-slate-500 font-medium">Free for up to 500 VUs. No credit card required.</p>
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[120px] rounded-full -z-10" />
                </section>

            </main>

            {/* Footer */}
            <footer className="py-16 border-t border-white/5 bg-slate-950">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" className="w-8 h-8 rounded-lg grayscale opacity-50" alt="Logo" />
                            <span className="text-xl font-black tracking-tighter text-slate-500">Prefracta AI</span>
                        </div>
                        <div className="flex gap-10 text-sm font-bold text-slate-500">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Security</a>
                            <a href="#" className="hover:text-white transition-colors">Status</a>
                        </div>
                        <div className="text-slate-600 font-medium text-sm">
                            © 2026 Prefracta AI Platform. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
