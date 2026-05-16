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
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-primary-foreground">

            {/* Background Glow Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[hsl(var(--primary)/0.12)] blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[hsl(var(--secondary)/0.12)] blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[hsl(var(--primary)/0.06)] blur-[160px] rounded-full" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
                            <img src="/logo.png" className="w-10 h-10 rounded-xl relative border border-white/10" alt="Logo" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-foreground">
                            Prefracta AI
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-primary transition-colors">Platform</a>
                        <Link href="/pricing" className="hover:text-primary transition-colors">Economics</Link>
                        <Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link href="/dashboard">
                                <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_rgba(37,99,235,0.18)] transition-all hover:scale-105">
                                    Launch Console <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block">
                                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full font-semibold">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
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
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-12 items-center gap-10">
                        <div className="col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[hsl(var(--primary)/0.08)] border border-[hsl(var(--primary)/0.16)] text-primary text-xs font-black uppercase tracking-widest mb-10 shadow-[0_0_10px_rgba(13,71,161,0.06)]"
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
                            className="col-span-7 text-4xl md:text-6xl lg:text-[64px] font-black tracking-tightest leading-[0.95] mb-6"
                        >
                            Audit your stack at scale <br />
                            <span className="text-gradient">and get an actionable report.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="col-span-7 text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 font-medium leading-relaxed"
                        >
                            Generate concrete evidence — latency distributions, error rates, benchmark graphs and alerts — so engineers can verify issues quickly.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="col-span-7 flex flex-col sm:flex-row items-center gap-5"
                        >
                            <Link href="/signup">
                                <Button size="lg" className="rounded-full px-12 h-16 text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_12px_30px_rgba(13,71,161,0.12)] transition-all hover:scale-105 active:scale-95">
                                    Run Free Audit <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg font-bold border-border/30 hover:bg-background/50 transition-all">
                                    Scan My Stack
                                </Button>
                            </Link>
                        </motion.div>
                        </div>

                        {/* Hero screenshot */}
                        <div className="col-span-5 hidden lg:block">
                            <div className="rounded-2xl overflow-hidden border border-border/40 shadow-lg">
                                <img src="/dashboard-screenshot.svg" alt="Dashboard preview" />
                            </div>
                            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Trusted integrations:</span>
                                <div className="flex items-center gap-2">
                                    <div className="px-2 py-1 bg-[hsl(var(--muted)/0.12)] rounded">K6</div>
                                    <div className="px-2 py-1 bg-[hsl(var(--muted)/0.12)] rounded">Playwright</div>
                                    <div className="px-2 py-1 bg-[hsl(var(--muted)/0.12)] rounded">Kubernetes</div>
                                </div>
                            </div>
                        </div>


                        </div>
                    </div>
                </section>

                {/* Features / Value Props */}
                <section id="features" className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                            <div className="max-w-2xl">
                                <div className="text-primary font-black uppercase tracking-widest text-sm mb-4">The Platform</div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                                    Engineered for <span className="text-muted-foreground italic font-serif">Brutal Reality.</span>
                                </h2>
                            </div>
                            <p className="text-muted-foreground max-w-sm font-medium">
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
                                    className="group p-10 rounded-[2.5rem] bg-card/80 border border-border/50 hover:border-border/40 transition-all hover:shadow-lg relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <f.icon className="w-32 h-32" />
                                    </div>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-[hsl(var(--muted)/0.3)] border border-border/30 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                        <f.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
                                    <p className="text-muted-foreground font-medium leading-relaxed">{f.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>



                {/* Final CTA */}
                <section className="py-32 relative overflow-hidden">
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="max-w-4xl mx-auto rounded-[3.5rem] bg-gradient-to-b from-[hsl(var(--primary)/0.12)] to-transparent border border-border/50 p-16 md:p-24 backdrop-blur-sm">
                            <h2 className="text-4xl md:text-7xl font-black tracking-tightest leading-none mb-10">
                                Ready to Ship with <br />
                                <span className="text-gradient italic">Absolute Certainty?</span>
                            </h2>
                            <Link href="/signup">
                                <Button size="lg" className="rounded-full px-12 h-20 text-xl font-black bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-2xl">
                                    Create Free Audit Account
                                </Button>
                            </Link>
                            <p className="mt-8 text-muted-foreground font-medium">Free for up to 500 VUs. No credit card required.</p>
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[hsl(var(--primary)/0.06)] blur-[120px] rounded-full -z-10" />
                </section>

            </main>

            {/* Footer */}
            <footer className="py-16 border-t border-border/50 bg-background">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" className="w-8 h-8 rounded-lg grayscale opacity-50" alt="Logo" />
                            <span className="text-xl font-black tracking-tighter text-muted-foreground">Prefracta AI</span>
                        </div>
                        <div className="flex gap-10 text-sm font-bold text-muted-foreground">
                            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                            <a href="#" className="hover:text-foreground transition-colors">Security</a>
                            <a href="#" className="hover:text-foreground transition-colors">Status</a>
                        </div>
                        <div className="text-muted-foreground font-medium text-sm">
                            © 2026 Prefracta AI Platform. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
