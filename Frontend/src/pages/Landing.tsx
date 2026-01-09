import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Server, BarChart2, Shield, Zap, Cpu, Globe, Rocket, Users, Building2, Activity, Layout, Layers } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export default function Landing() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <header className="sticky top-0 w-full z-50 border-b border-white/10 glass">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                            <img src="/logo.png" alt="SynthMind AI" className="relative w-12 h-12 rounded-xl" />
                        </div>
                        <span className="text-2xl font-black font-display tracking-tight text-gradient">SynthMind AI</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
                        <a href="#features" className="hover:text-primary transition-all hover:scale-105">Features</a>
                        <Link href="/pricing"><span className="hover:text-primary transition-all hover:scale-105 cursor-pointer">Pricing</span></Link>
                        <Link href="/docs"><span className="hover:text-primary transition-all hover:scale-105 cursor-pointer">Docs</span></Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link href="/dashboard">
                                <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                                    Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="hidden sm:inline-flex font-semibold">Sign In</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="relative z-10">
                {/* Hero */}
                <section className="container mx-auto px-4 pt-20 pb-32 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 animate-bounce">
                        <Zap className="w-4 h-4" />
                        <span>Now with AI-Powered Explanations</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black font-display tracking-tighter mb-6 leading-[0.9] lg:leading-[1.1]">
                        DevOps <span className="text-gradient">Launch Readiness</span>
                    </h1>

                    <h2 className="text-2xl md:text-4xl font-bold text-foreground/80 mb-8 font-display">
                        Measured by Data. <span className="text-primary italic">Explained by AI.</span>
                    </h2>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                        Generate real performance and deployment signals, then get clear
                        explanations only when you need them. No more guessing production stability.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/signup">
                            <Button size="lg" className="rounded-full px-12 h-16 text-lg font-bold shadow-2xl shadow-primary/40 hover:scale-105 transition-transform active:scale-95">
                                Launch Your First Test <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-24 relative mx-auto max-w-6xl">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary via-blue-500 to-accent rounded-[2rem] blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden glass-card">
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
                            <img
                                src="/dashboard-hero.png"
                                alt="SynthMind AI Dashboard"
                                className="w-full h-auto opacity-90 hover:scale-[1.02] transition-transform duration-700"
                            />
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="py-32 relative overflow-hidden bg-slate-50/50 dark:bg-black/20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mb-20">
                            <h2 className="text-4xl md:text-5xl font-black font-display mb-6">Built for High-Growth <br /><span className="text-primary">Engineering Teams</span></h2>
                            <p className="text-xl text-muted-foreground font-medium">We've automated the most tedious parts of DevOps so you can focus on building.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: BarChart2,
                                    title: "Load Intelligence",
                                    desc: "Sophisticated traffic patterns that mirror real user behavior, not just raw requests.",
                                    color: "bg-blue-500"
                                },
                                {
                                    icon: Shield,
                                    title: "GitHub Resilience",
                                    desc: "Automatic CI/CD and Docker audits that flag risks before they hit production.",
                                    color: "bg-purple-500"
                                },
                                {
                                    icon: Cpu,
                                    title: "Neural Insights",
                                    desc: "Our AI doesn't just show charts; it explains the 'why' and suggests the 'how'.",
                                    color: "bg-emerald-500"
                                }
                            ].map((feature, i) => (
                                <div key={i} className="group p-8 rounded-3xl glass-card transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20">
                                    <div className={`w-14 h-14 rounded-2xl ${feature.color}/10 flex items-center justify-center text-foreground mb-8 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Impact & Vision Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-24">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-6xl font-black font-display mb-4 tracking-tighter"
                            >
                                SYNTHMIND AI: <span className="text-gradient">IMPACT & VISION</span>
                            </motion.h2>
                        </div>

                        {/* Audience Row */}
                        <div className="grid md:grid-cols-3 gap-8 mb-24 relative">
                            {/* Connector Lines (Decorative) */}
                            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0" />

                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="glass-card p-8 rounded-3xl relative z-10 border-primary/10"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-lg shadow-primary/5">
                                    <Rocket className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">Startups & Early Teams</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Helps startups launch with confidence. Empowers students & early teams with enterprise-grade insights.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="glass-card p-10 rounded-full aspect-square flex flex-col items-center justify-center text-center relative z-10 border-accent/20 bg-accent/5"
                            >
                                <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full animate-pulse z-0" />
                                <Globe className="w-16 h-16 text-accent mb-4 relative z-10" />
                                <h3 className="text-xl font-black uppercase tracking-widest relative z-10">Global SaaS Platform</h3>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="glass-card p-8 rounded-3xl relative z-10 border-primary/10"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 shadow-lg shadow-blue-500/5">
                                    <Server className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">DevOps & MNCs</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    DevOps teams use to detect error and analysis in top MNCs companies around the world.
                                </p>
                            </motion.div>
                        </div>

                        {/* Launch Readiness & Intelligence */}
                        <div className="grid md:grid-cols-2 gap-12 mb-32 items-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="relative rounded-3xl overflow-hidden glass-card border-white/5 order-2 md:order-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                            <Cpu className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold tracking-tight uppercase">Launch Readiness Intelligence</h3>
                                    </div>
                                    <p className="text-muted-foreground mb-8 text-lg font-medium">
                                        Accessible to every team. Reduces failed launches caused by performance blind spots.
                                    </p>

                                    {/* Visual Flow Representaton */}
                                    <div className="flex items-center justify-between gap-4 p-6 bg-black/40 rounded-2xl border border-white/5">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 border border-red-500/30">
                                                <span className="text-red-500 font-bold text-xl">X</span>
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-red-500/70">Blind Spots</span>
                                        </div>

                                        <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 via-primary/50 to-emerald-500/30 relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-2 rounded-full border border-white/10">
                                                <img src="/logo.png" className="w-6 h-6 grayscale hover:grayscale-0 transition-all" />
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                                                <ArrowRight className="text-emerald-500 w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-emerald-500/70">Success</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="space-y-8 order-1 md:order-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="glass-card p-6 rounded-2xl border-white/5 flex gap-6 items-center"
                                >
                                    <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <Users className="w-8 h-8 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Collaboration Hub</h4>
                                        <p className="text-sm text-muted-foreground">Unified platform for Dev and Ops to sync on release confidence.</p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="glass-card p-6 rounded-2xl border-white/5 flex gap-6 items-center"
                                >
                                    <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Activity className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Scale Analysis</h4>
                                        <p className="text-sm text-muted-foreground">Monitoring every metric at global scale with real-time feedback loops.</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Vision Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative p-12 rounded-[2rem] overflow-hidden text-center mb-24"
                        >
                            <div className="absolute inset-0 bg-primary/5 glass border border-white/10" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

                            <div className="relative z-10 flex flex-col items-center">
                                <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black tracking-[0.2em] mb-6 uppercase">Our Vision</span>
                                <h3 className="text-2xl md:text-4xl font-black font-display tracking-tight leading-tight max-w-4xl">
                                    TO BECOME THE <span className="text-gradient">STANDARD PRE-LAUNCH VALIDATION LAYER</span> FOR MODERN WEB PRODUCTS
                                </h3>
                            </div>
                        </motion.div>

                        {/* Validation Layer Pipeline */}
                        <div className="relative p-8 md:p-16 glass-card rounded-[3rem] border-white/5 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="flex gap-4">
                                    <div className="w-16 h-24 bg-card border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 shadow-2xl">
                                        <Layout className="w-8 h-8 text-muted-foreground/50" />
                                        <div className="w-8 h-1.5 bg-muted-foreground/20 rounded-full" />
                                    </div>
                                    <div className="w-16 h-20 bg-card border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 mt-4 shadow-2xl">
                                        <Activity className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                    <div className="w-16 h-28 bg-card border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 -mt-4 shadow-2xl">
                                        <Layers className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col items-center">
                                    <div className="relative w-full max-w-md h-24 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center px-8 overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        <div className="flex flex-col items-center z-10">
                                            <img src="/logo.png" className="w-8 h-8 mb-2" />
                                            <span className="text-xs font-black tracking-widest uppercase text-primary">Pre-Launch Validation Layer</span>
                                        </div>
                                    </div>
                                    <div className="h-8 md:h-12 w-px bg-gradient-to-b from-primary/50 to-transparent" />
                                </div>

                                <div className="text-center group">
                                    <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mb-4 relative">
                                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <span className="text-xs font-black tracking-widest uppercase text-emerald-500">Validated Standard</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Glows */}
                    <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
                </section>
            </main>

            {/* Footer */}
            <footer className="py-16 border-t border-border bg-card/50">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-start justify-between gap-12">
                    <div className="space-y-6 max-w-xs">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="SynthMind AI" className="w-8 h-8 rounded-lg" />
                            <span className="font-black text-xl font-display tracking-tight text-gradient">SynthMind AI</span>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                            Empowering DevOps teams with AI-driven performance insights and deployment readiness.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                        <div>
                            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-foreground/50">Product</h4>
                            <ul className="space-y-2 text-sm font-medium text-muted-foreground">
                                <li className="hover:text-primary cursor-pointer transition-colors">Features</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">Pricing</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">API</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-foreground/50">Company</h4>
                            <ul className="space-y-2 text-sm font-medium text-muted-foreground">
                                <li className="hover:text-primary cursor-pointer transition-colors">About</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">Blog</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">Contact</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-foreground/50">Legal</h4>
                            <ul className="space-y-2 text-sm font-medium text-muted-foreground">
                                <li className="hover:text-primary cursor-pointer transition-colors">Privacy</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">Terms</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 pt-16 text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                        © 2026 SynthMind AI. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}