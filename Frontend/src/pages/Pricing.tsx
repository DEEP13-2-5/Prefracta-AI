import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Activity, GitBranch, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { PublicNavigation } from "@/components/PublicShell";

const plans = [
    {
        id: "free",
        name: "Free Starter",
        price: "₹0",
        period: "/forever",
        description: "Explore the platform with limited credits.",
        features: [
            "1 Free Load Test Credit",
            "Basic Metrics Dashboard",
            "Community Support",
            "1 Day Data Retention",
        ],
        cta: "Start for Free",
        href: "/signup",
    },
    {
        id: "weekly",
        name: "Weekly Pro",
        price: "₹499",
        period: "/week",
        description: "Perfect for sprint deadlines and release cycles.",
        features: [
            "Unlimited Load Tests",
            "AI Readiness Insights",
            "Email Support",
            "7 Day Data Retention",
            "Custom Load Profiles",
        ],
        cta: "Get Pro Access",
        href: "/signup",
    },
    {
        id: "monthly",
        name: "Monthly Elite",
        price: "₹1,499",
        period: "/month",
        description: "For teams shipping production-scale services.",
        features: [
            "Unlimited Load Tests",
            "Advanced AI Architecture Review",
            "Priority Support",
            "30 Day Data Retention",
            "GitHub Integration",
            "Full API Access",
        ],
        popular: true,
        cta: "Choose Elite",
        href: "/signup",
    },
];

export default function Pricing() {
    const { user } = useAuth();

    useEffect(() => {
        document.title = "Pricing — Prefracta AI | DevOps Load Testing Plans";
        const setMeta = (name: string, content: string) => {
            let el = document.querySelector(`meta[name="${name}"]`);
            if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
            el.setAttribute("content", content);
        };
        setMeta("description", "Pick a Prefracta plan. Automate load testing, Playwright browser audits, and AI launch verdicts for your DevOps pipeline.");
        setMeta("keywords", "Prefracta, DevOps testing tool, load testing pricing, Playwright audit plans, k6 SaaS, launch readiness");
    }, []);

    return (
        <div className="public-premium min-h-screen font-sans selection:bg-blue-100 selection:text-blue-950 relative overflow-x-hidden">
            <PublicNavigation />

            {/* Tech grid background — identical to Landing */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-20" />

            {/* Glowing orbs */}
            <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0,transparent_65%)] blur-[80px] pointer-events-none -z-10" />
            <div className="absolute top-[40%] right-[-15%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0,transparent_65%)] blur-[80px] pointer-events-none -z-10" />

            {/* Header — exact same as Landing.tsx */}
            <header className="hidden sticky top-0 z-50 border-b border-slate-800/40 bg-slate-950/60 backdrop-blur-xl transition-all duration-300">
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
                        <Link href="/pricing" className="text-white">Pricing</Link>
                        <Link href="/docs" className="hover:text-white transition-colors duration-200">Docs</Link>
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
                    Transparent Pricing
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white"
                >
                    Plans for every{" "}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                        release cycle.
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6 text-lg text-slate-400 leading-relaxed"
                >
                    Clear plans for individual builders and teams that need dependable release evidence.
                </motion.p>
            </section>

            {/* Pricing Cards */}
            <section className="max-w-6xl mx-auto px-6 pb-32">
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {plans.map((plan, idx) => {
                        const isCurrentPlan = user?.subscription.plan === plan.id;
                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="flex flex-col pt-4"
                            >
                                <div
                                    className={`relative flex flex-col flex-1 rounded-2xl overflow-hidden border transition-all duration-300 ${
                                        plan.popular
                                            ? "border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.12)] bg-slate-900/80"
                                            : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700"
                                    }`}
                                >
                                    {/* Top accent line for popular plan */}
                                    {plan.popular && (
                                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                                    )}

                                    {plan.popular && (
                                        <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-sm">
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <div className={`p-8 flex flex-col flex-1 ${plan.popular ? "pt-14" : "pt-8"}`}>
                                        {/* Plan name + desc */}
                                        <div className="mb-8">
                                            <h2 className={`text-lg font-bold tracking-tight ${plan.popular ? "text-cyan-400" : "text-slate-300"}`}>
                                                {plan.name}
                                            </h2>
                                            <p className="text-slate-500 text-sm mt-1.5 leading-snug">{plan.description}</p>

                                            <div className="mt-6 flex items-baseline gap-1">
                                                <span className="text-5xl font-black font-mono text-white tracking-tight">{plan.price}</span>
                                                <span className="text-slate-500 text-sm font-mono ml-1">{plan.period}</span>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className={`h-px mb-8 ${plan.popular ? "bg-cyan-500/20" : "bg-slate-800"}`} />

                                        {/* Features */}
                                        <ul className="space-y-4 flex-1">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                                        plan.popular ? "bg-cyan-500/15 text-cyan-400" : "bg-slate-800 text-slate-400"
                                                    }`}>
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                    <span className="text-slate-300 leading-tight">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <div className="mt-8">
                                            <Link href={user ? (isCurrentPlan ? "#" : "/subscription") : plan.href} className="block">
                                                <Button
                                                    className={`w-full h-12 font-bold text-sm group rounded-xl transition-all ${
                                                        plan.popular
                                                            ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                                            : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-500"
                                                    }`}
                                                    disabled={isCurrentPlan}
                                                >
                                                    {isCurrentPlan ? "Current Plan" : plan.cta}
                                                    {!isCurrentPlan && (
                                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    )}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Trust row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 text-center"
                >
                    <p className="text-slate-600 font-mono text-xs uppercase tracking-widest mb-6">Trusted by engineering teams shipping at scale</p>
                    <div className="flex justify-center flex-wrap gap-10 text-slate-700 font-black text-sm tracking-widest">
                        <span>CLOUDCORE</span>
                        <span>DATAVIZ</span>
                        <span>NETSTREAM</span>
                        <span>SECURELY</span>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="hidden border-t border-slate-900 py-12 bg-slate-950">
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
