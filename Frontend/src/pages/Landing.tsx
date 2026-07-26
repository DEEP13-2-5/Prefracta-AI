import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
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
    Server,
    Play,
    RefreshCw,
    Sliders,
    X,
    ChevronDown,
    ChevronUp,
    Check,
    AlertTriangle,
    Eye,
    ChevronRight,
    TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

// Custom Mock Terminal Logs for the simulation
interface LogEntry {
    time: string;
    type: "info" | "warn" | "success" | "error";
    text: string;
}

const TERMINAL_LOGS: Record<string, LogEntry[]> = {
    ecommerce: [
        { time: "00:01", type: "info", text: "Provisioning isolated cloud sandbox container..." },
        { time: "00:02", type: "info", text: "VPC networking active. Binding k6 test engine..." },
        { time: "00:03", type: "info", text: "Ramping up virtual users to 10,000 (Target: 800 req/s)..." },
        { time: "00:04", type: "warn", text: "Latency spike: p95 exceeded 650ms at 6,200 active VUs." },
        { time: "00:05", type: "info", text: "Launching Playwright headless audits for checkout flow..." },
        { time: "00:06", type: "success", text: "LCP measured: 1.8s. Accessibility validation (A11y): 94%." },
        { time: "00:07", type: "success", text: "Audit complete. Verdict generated in 7.2s." }
    ],
    api: [
        { time: "00:01", type: "info", text: "Allocating cloud agent. Initializing network hooks..." },
        { time: "00:02", type: "info", text: "Injecting k6 load scripts. Simulating global GET /v1/products..." },
        { time: "00:03", type: "info", text: "Staggering traffic up to 5,000 RPS across 20 edge nodes..." },
        { time: "00:04", type: "success", text: "Response latency flat at 24ms. Error rate: 0.00%." },
        { time: "00:05", type: "info", text: "Executing security checks & token rate-limit stress tests..." },
        { time: "00:06", type: "success", text: "All API contracts verified. Rate limiting triggers working." },
        { time: "00:07", type: "success", text: "Audit complete. 100/100 performance score." }
    ],
    legacy: [
        { time: "00:01", type: "info", text: "Spinning up staging mirror environment..." },
        { time: "00:02", type: "info", text: "Launching benchmark engine. Target: 1,500 active users..." },
        { time: "00:03", type: "warn", text: "Spawning traffic... 300 VUs active." },
        { time: "00:04", type: "error", text: "DB Connection Pool Exhausted. Latency = 8,400ms." },
        { time: "00:05", type: "error", text: "HTTP 504 Gateway Timeout detected on /checkout (Rate: 22.4%)." },
        { time: "00:06", type: "info", text: "Playwright audit aborted due to remote connection failures." },
        { time: "00:07", type: "error", text: "Audit completed with errors. CRITICAL crash limit hit." }
    ]
};

export default function Landing() {
    const { user } = useAuth();

    // Sandbox Simulator States
    const [simUrl, setSimUrl] = useState("https://my-startup-app.dev");
    const [simState, setSimState] = useState<"idle" | "provisioning" | "loadtest" | "playwright" | "verdict">("idle");
    const [simProfile, setSimProfile] = useState<"ecommerce" | "api" | "legacy">("ecommerce");
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [activeVU, setActiveVU] = useState(0);
    const [reqRate, setReqRate] = useState(0);
    const [chartData, setChartData] = useState<number[]>([]);
    const [scoreGauge, setScoreGauge] = useState(0);
    const simulationRef = useRef<NodeJS.Timeout | null>(null);
    const widgetSectionRef = useRef<HTMLDivElement>(null);

    // Concurrency Slider States
    const [sliderVU, setSliderVU] = useState<number[]>([800]);

    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // How It Works Active Tab
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: "1. Spawn Sandbox",
            desc: "Provision an isolated VPC workspace dynamically mapping to your code configurations.",
            details: "Prefracta creates a clean testing bubble, downloading your container definitions and routing setup. This ensures your tests never pollute production or drag down live databases.",
            code: `// Provisioning cloud sandbox...\n$ npx prefracta-cli provision \\\n   --repo=github.com/org/app \\\n   --env=staging-mirror`
        },
        {
            title: "2. Load Test (k6)",
            desc: "Simulate distributed user behaviors scaling to tens of thousands of concurrent nodes.",
            details: "Using high-density Go-based load scripting, we test real user journeys (e.g. login, add to cart, check API limits) instead of hammering static index pages.",
            code: `import http from 'k6/http';\nexport const options = {\n  stages: [\n    { duration: '3m', target: 5000 },\n    { duration: '5m', target: 5000 }\n  ]\n};`
        },
        {
            title: "3. UX Audit (Playwright)",
            desc: "Run real, headless browser tests to detect visual layout shifts and accessibility drops under stress.",
            details: "Simultaneously boot chromium instances during peak load to verify if buttons freeze, client scripts crash, or Layout Shifts (CLS) degrade the customer experience.",
            code: `test('checkout stays interactive', async ({ page }) => {\n  await page.goto('/checkout');\n  await page.click('#pay-btn');\n  await expect(page.locator('#receipt')).toBeVisible();\n});`
        },
        {
            title: "4. Unified Verdict",
            desc: "Receive an actionable launch verdict, cost review, and auto-blocking validation report.",
            details: "Our orchestration engine cross-references latencies, error percentages, DOM load speeds, and estimated server scaling costs to give a strict YES or NO launch rating.",
            code: `{\n  "score": 94,\n  "verdict": "SAFE_TO_LAUNCH",\n  "sloStatus": "PASSING",\n  "maxConcurrencyLimit": 8200\n}`
        }
    ];

    // Trigger Demo Simulation
    const startSimulation = (profileName = simProfile) => {
        if (simulationRef.current) clearInterval(simulationRef.current);
        setSimState("provisioning");
        setLogs([]);
        setActiveVU(0);
        setReqRate(0);
        setChartData([]);
        setScoreGauge(0);

        const profileLogs = TERMINAL_LOGS[profileName];
        let index = 0;

        // Step 1: Provisioning logs
        setLogs([profileLogs[0]]);
        
        let timer = 0;
        simulationRef.current = setInterval(() => {
            timer += 1;

            if (timer === 2) {
                // Shift to load testing
                setSimState("loadtest");
                setLogs(prev => [...prev, profileLogs[1], profileLogs[2]]);
            }

            if (simState === "loadtest" || timer >= 2 && timer < 6) {
                // Simulate metric values ticking up
                const maxVU = profileName === "ecommerce" ? 8200 : profileName === "api" ? 5000 : 400;
                const progress = (timer - 2) / 4; // over 4 seconds
                const currentVUs = Math.floor(Math.min(maxVU, maxVU * progress + Math.random() * 200));
                setActiveVU(currentVUs);
                setReqRate(Math.floor(currentVUs * (profileName === "api" ? 1.2 : 0.08)));

                // Update dynamic graph array
                setChartData(prev => {
                    let nextVal = 0;
                    if (profileName === "ecommerce") {
                        nextVal = 120 + Math.pow(currentVUs / 2000, 2) * 20 + Math.random() * 15;
                    } else if (profileName === "api") {
                        nextVal = 20 + Math.random() * 5;
                    } else {
                        nextVal = 180 + Math.pow(currentVUs / 100, 3) * 60 + Math.random() * 100;
                    }
                    const nextArr = [...prev, nextVal];
                    if (nextArr.length > 20) nextArr.shift();
                    return nextArr;
                });

                if (timer === 4 && profileLogs[3]) {
                    setLogs(prev => [...prev, profileLogs[3]]);
                }
            }

            if (timer === 6) {
                setSimState("playwright");
                setLogs(prev => [...prev, profileLogs[4]]);
            }

            if (timer === 7) {
                setLogs(prev => [...prev, profileLogs[5]]);
            }

            if (timer === 8) {
                setSimState("verdict");
                setLogs(prev => [...prev, profileLogs[6]]);
                
                // Roll up gauge score
                const finalScore = profileName === "api" ? 100 : profileName === "ecommerce" ? 94 : 32;
                let currentScore = 0;
                const scoreInterval = setInterval(() => {
                    currentScore += 2;
                    setScoreGauge(currentScore);
                    if (currentScore >= finalScore) {
                        setScoreGauge(finalScore);
                        clearInterval(scoreInterval);
                    }
                }, 15);
                
                if (simulationRef.current) clearInterval(simulationRef.current);
            }
        }, 1200);
    };

    // Auto-cleanup simulation
    useEffect(() => {
        return () => {
            if (simulationRef.current) clearInterval(simulationRef.current);
        };
    }, []);

    // Handle submit from Hero Input
    const handleHeroSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        widgetSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        startSimulation();
    };

    // Calculate dynamic slider parameters based on concurrency state
    const currentVU = sliderVU[0];
    const calcLatency = Math.max(45, Math.floor(45 + Math.pow(currentVU / 1000, 3.2) * 80 + (currentVU > 3500 ? (currentVU - 3500) * 1.6 : 0)));
    const calcErrors = currentVU < 2800 ? "0.0%" : ((currentVU - 2800) / 100 * 0.85).toFixed(1) + "%";
    const calcCpu = Math.min(100, Math.floor((currentVU / 5000) * 82 + 18 + (currentVU > 3800 ? (currentVU - 3800) * 0.12 : 0)));
    const calcCost = (currentVU * 0.00045).toFixed(2);
    
    // Status text and style mappings
    let sliderStatusText = "HEALTHY (STABLE)";
    let sliderStatusColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    let sliderGlow = "shadow-emerald-500/5 border-emerald-500/20";
    if (currentVU >= 2000 && currentVU < 3800) {
        sliderStatusText = "WARNING (DEGRADED)";
        sliderStatusColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
        sliderGlow = "shadow-amber-500/5 border-amber-500/20";
    } else if (currentVU >= 3800) {
        sliderStatusText = "CRITICAL BREAKPOINT (FAILING)";
        sliderStatusColor = "text-rose-500 bg-rose-500/10 border-rose-500/20 animate-pulse";
        sliderGlow = "shadow-rose-500/10 border-rose-500/30";
    }

    return (
        <div className="dark bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-300 relative">
            
            {/* Tech grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-20" />
            
            {/* Glowing orbs */}
            <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0,transparent_65%)] blur-[80px] pointer-events-none -z-10" />
            <div className="absolute top-[30%] right-[-15%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0,transparent_65%)] blur-[80px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0,transparent_70%)] blur-[100px] pointer-events-none -z-10" />

            {/* Header / Navigation */}
            <header className="sticky top-0 z-50 border-b border-slate-800/40 bg-slate-950/60 backdrop-blur-xl transition-all duration-300">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-700/60 flex items-center justify-center bg-slate-900 group-hover:border-cyan-500/60 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                            <Activity className="w-5 h-5 text-cyan-400 relative z-10 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                            Prefracta<span className="text-cyan-400 font-extrabold">.ai</span>
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#simulator" className="hover:text-white transition-colors duration-200">Sandbox Simulator</a>
                        <a href="#breakpoint" className="hover:text-white transition-colors duration-200">Breakpoint Stressor</a>
                        <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
                        <Link href="/pricing" className="hover:text-white transition-colors duration-200">Pricing</Link>
                        <Link href="/docs" className="hover:text-white transition-colors duration-200">Docs</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link href="/dashboard">
                                <Button className="relative group overflow-hidden bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all">
                                    Launch Dashboard
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

            <main className="container mx-auto px-6 relative">
                
                {/* Hero Section */}
                <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32">
                    <div className="max-w-5xl mx-auto text-center">
                        

                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-6xl lg:text-[76px] font-black tracking-tight leading-[1.05] text-white"
                        >
                            Is your backend safe to launch? <br />
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                Get your launch readiness score.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-8 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
                        >
                            Prefracta orchestrates <span className="text-slate-100 font-semibold">k6 load scaling</span> and <span className="text-slate-100 font-semibold">Playwright browser sweeps</span> inside dynamic cloud sandboxes. We map limits, trace memory spikes, and verify UX stability to secure a binary ship verdict.
                        </motion.p>

                        {/* Interactive URL Input Panel */}
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            onSubmit={handleHeroSubmit}
                            className="mt-12 max-w-xl mx-auto bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80 backdrop-blur-md flex flex-col sm:flex-row gap-2 shadow-2xl focus-within:border-cyan-500/40 transition-colors"
                        >
                            <div className="flex-1 flex items-center gap-3 px-4 py-3">
                                <Globe className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Enter your target URL (e.g. staging-app.com)"
                                    value={simUrl}
                                    onChange={(e) => setSimUrl(e.target.value)}
                                    className="bg-transparent border-0 text-white outline-none w-full text-sm font-medium placeholder:text-slate-600 focus:ring-0 focus:outline-none"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold h-12 rounded-xl px-6 flex items-center justify-center gap-2 group transition-all"
                            >
                                Run Sandbox Simulation
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-500"
                        >
                            <span>Engine Integrations:</span>
                            <div className="flex gap-3">
                                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-400 font-mono">k6.io</span>
                                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-400 font-mono">Playwright</span>
                                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-400 font-mono">Kubernetes</span>
                            </div>
                        </motion.div>

                    </div>
                </section>


                {/* Section 1: The Interactive Audit Simulator Console */}
                <section id="simulator" ref={widgetSectionRef} className="py-20 border-t border-slate-900 scroll-mt-24">
                    <div className="max-w-6xl mx-auto">
                        
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
                                Interactive Sandbox Simulation
                            </h2>
                            <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
                                Run a simulated sandbox load test right now. Choose a target application type and click simulate to view live telemetry logs, concurrency graphs, and readiness scoring.
                            </p>

                            {/* Profile Selector Buttons */}
                            <div className="mt-6 inline-flex p-1 bg-slate-900/80 rounded-full border border-slate-800">
                                <button
                                    onClick={() => { setSimProfile("ecommerce"); startSimulation("ecommerce"); }}
                                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${simProfile === "ecommerce" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                                >
                                    🛍️ E-Commerce Checkout
                                </button>
                                <button
                                    onClick={() => { setSimProfile("api"); startSimulation("api"); }}
                                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${simProfile === "api" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                                >
                                    ⚡ Fast API Gateway
                                </button>
                                <button
                                    onClick={() => { setSimProfile("legacy"); startSimulation("legacy"); }}
                                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${simProfile === "legacy" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                                >
                                    ⚠️ Rails Legacy API
                                </button>
                            </div>
                        </div>

                        {/* Interactive Console Widget Frame */}
                        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl relative">
                            
                            {/* Window Header */}
                            <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                    <span className="ml-3 text-xs text-slate-400 font-mono hidden sm:inline">{simUrl}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate-500 font-mono">Platform State:</span>
                                    <Badge className={`uppercase text-[10px] tracking-wider px-2.5 py-0.5 font-bold ${
                                        simState === "idle" ? "bg-slate-800 text-slate-400" :
                                        simState === "provisioning" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                        simState === "loadtest" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                        simState === "playwright" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    }`}>
                                        {simState}
                                    </Badge>
                                </div>
                            </div>

                            {/* Main Interactive Inner Layout */}
                            <div className="grid lg:grid-cols-12 min-h-[420px] bg-slate-950/80">
                                
                                {/* Left Side: Terminal Output logs */}
                                <div className="lg:col-span-6 p-6 border-r border-slate-800/60 font-mono text-xs flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4 text-slate-500">
                                            <span className="flex items-center gap-1.5"><Terminal className="w-4 h-4" /> Live Environment Logs</span>
                                            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded">Console</span>
                                        </div>
                                        
                                        <div className="space-y-3.5 min-h-[220px]">
                                            {logs.map((log, i) => (
                                                <div key={i} className="flex gap-3 leading-relaxed">
                                                    <span className="text-slate-600 select-none">[{log.time}]</span>
                                                    <span className={
                                                        log.type === "info" ? "text-slate-300" :
                                                        log.type === "warn" ? "text-amber-400 font-semibold" :
                                                        log.type === "error" ? "text-red-400 font-semibold" :
                                                        "text-emerald-400 font-semibold"
                                                    }>
                                                        {log.type.toUpperCase()}:
                                                    </span>
                                                    <span className="text-slate-300 flex-1">{log.text}</span>
                                                </div>
                                            ))}
                                            
                                            {simState === "provisioning" && (
                                                <div className="flex items-center gap-2 text-cyan-400 font-semibold mt-3 animate-pulse">
                                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                    Provisioning resources...
                                                </div>
                                            )}

                                            {simState === "loadtest" && (
                                                <div className="flex items-center gap-2 text-amber-400 font-semibold mt-3 animate-pulse">
                                                    <Activity className="w-3.5 h-3.5 animate-spin" />
                                                    Injecting high-density VUs...
                                                </div>
                                            )}

                                            {simState === "playwright" && (
                                                <div className="flex items-center gap-2 text-purple-400 font-semibold mt-3 animate-pulse">
                                                    <Eye className="w-3.5 h-3.5 animate-pulse" />
                                                    Running browser rendering benchmarks...
                                                </div>
                                            )}

                                            {simState === "idle" && (
                                                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 text-center">
                                                    <Server className="w-12 h-12 text-slate-700 mb-3" />
                                                    <p className="max-w-[280px]">Select a profile above or input a URL to run the dynamic audit simulation.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Console actions bar */}
                                    <div className="pt-6 border-t border-slate-900 mt-6 flex items-center justify-between">
                                        <div className="text-slate-500 text-[11px]">
                                            Target: <span className="text-slate-400 font-bold">{simUrl}</span>
                                        </div>
                                        <Button
                                            onClick={() => startSimulation()}
                                            disabled={simState !== "idle" && simState !== "verdict"}
                                            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-100 px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                                        >
                                            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" /> Run Simulation
                                        </Button>
                                    </div>
                                </div>

                                {/* Right Side: Telemetry Graphs or Score Verdict */}
                                <div className="lg:col-span-6 p-6 flex flex-col justify-between bg-slate-900/10 relative">
                                    
                                    {/* Idle State Overview */}
                                    {simState === "idle" && (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                                            <Activity className="w-12 h-12 text-slate-800 mb-4" />
                                            <p className="text-sm font-semibold text-slate-400">Waiting for simulator initialization...</p>
                                            <p className="text-xs text-slate-600 mt-1.5">Launch telemetry values will plot here in real-time.</p>
                                        </div>
                                    )}

                                    {/* Provisioning Loader screen */}
                                    {simState === "provisioning" && (
                                        <div className="flex flex-col items-center justify-center h-full py-12">
                                            <div className="relative w-16 h-16 mb-4">
                                                <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                                                <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 animate-spin" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-300">Spawning Virtual Containers</p>
                                            <p className="text-xs text-slate-500 mt-1">Configuring edge network proxies...</p>
                                        </div>
                                    )}

                                    {/* Load testing / Playwright Active Telemetry */}
                                    {(simState === "loadtest" || simState === "playwright") && (
                                        <div className="flex flex-col justify-between h-full space-y-6">
                                            <div>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-3 font-mono">Live Telemetry Dashboard</span>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/40">
                                                        <div className="text-slate-500 text-xs font-mono">ACTIVE USERS (VUs)</div>
                                                        <div className="text-2xl font-black text-white mt-1 font-mono tracking-tight">{activeVU.toLocaleString()}</div>
                                                    </div>
                                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/40">
                                                        <div className="text-slate-500 text-xs font-mono">THROUGHPUT</div>
                                                        <div className="text-2xl font-black text-white mt-1 font-mono tracking-tight">{reqRate.toLocaleString()} req/s</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dynamic Graph Visualizer */}
                                            <div className="flex-1 min-h-[140px] bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between overflow-hidden relative">
                                                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                                    <span>LATENCY p95 OVER TIME</span>
                                                    <span className={simProfile === "legacy" ? "text-red-400" : "text-cyan-400"}>
                                                        {chartData[chartData.length - 1] ? `${Math.floor(chartData[chartData.length - 1])}ms` : "Gathering..."}
                                                    </span>
                                                </div>
                                                
                                                {/* Plotting custom SVG Path dynamically */}
                                                <div className="w-full h-24 flex items-end justify-center relative mt-3">
                                                    {chartData.length > 1 ? (
                                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                                                            <defs>
                                                                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="0%" stopColor={simProfile === "legacy" ? "#f43f5e" : "#06b6d4"} stopOpacity="0.2"/>
                                                                    <stop offset="100%" stopColor={simProfile === "legacy" ? "#f43f5e" : "#06b6d4"} stopOpacity="0.0"/>
                                                                </linearGradient>
                                                            </defs>
                                                            {/* Fill under line */}
                                                            <path
                                                                d={`M 0 100 ${chartData.map((val, idx) => {
                                                                    const x = (idx / (chartData.length - 1)) * 300;
                                                                    // clamp height from 0 to 100
                                                                    const maxVal = simProfile === "legacy" ? 2200 : simProfile === "ecommerce" ? 800 : 80;
                                                                    const normalized = Math.min(90, (val / maxVal) * 85);
                                                                    const y = 100 - normalized;
                                                                    return `L ${x} ${y}`;
                                                                }).join(" ")} L 300 100 Z`}
                                                                fill="url(#chartGlow)"
                                                                className="transition-all duration-300"
                                                            />
                                                            {/* Chart line */}
                                                            <path
                                                                d={chartData.map((val, idx) => {
                                                                    const x = (idx / (chartData.length - 1)) * 300;
                                                                    const maxVal = simProfile === "legacy" ? 2200 : simProfile === "ecommerce" ? 800 : 80;
                                                                    const normalized = Math.min(90, (val / maxVal) * 85);
                                                                    const y = 100 - normalized;
                                                                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                                                                }).join(" ")}
                                                                fill="none"
                                                                stroke={simProfile === "legacy" ? "#f43f5e" : "#22d3ee"}
                                                                strokeWidth="2.5"
                                                                strokeLinecap="round"
                                                                className="transition-all duration-300"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <div className="text-xs text-slate-700 animate-pulse font-mono">Gathering telemetry metrics...</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                                <Shield className="w-4 h-4 text-purple-400" />
                                                <span>
                                                    {simState === "loadtest" ? "Injecting geographically distributed workload..." : "Playwright scraping layout shifting & accessibility..."}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Completed State: The readiness Verdict Gauge */}
                                    {simState === "verdict" && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col justify-between h-full space-y-4 text-center lg:text-left"
                                        >
                                            <div className="flex flex-col items-center lg:items-start">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Launch readiness report</span>
                                                
                                                <div className="flex items-center gap-8 mt-5 flex-col sm:flex-row text-center sm:text-left">
                                                    {/* Circular gauge */}
                                                    <div className="relative w-28 h-28 flex items-center justify-center">
                                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                            <circle cx="50" cy="50" r="42" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                                                            <circle
                                                                cx="50"
                                                                cy="50"
                                                                r="42"
                                                                fill="transparent"
                                                                stroke={simProfile === "legacy" ? "#f43f5e" : simProfile === "ecommerce" ? "#10b981" : "#06b6d4"}
                                                                strokeWidth="8"
                                                                strokeDasharray={263.89}
                                                                strokeDashoffset={263.89 - (263.89 * scoreGauge) / 100}
                                                                strokeLinecap="round"
                                                                className="transition-all duration-300"
                                                            />
                                                        </svg>
                                                        <span className="absolute text-2xl font-black text-white font-mono">{scoreGauge}%</span>
                                                    </div>

                                                    <div>
                                                        <div className="text-slate-500 text-xs font-mono">LAUNCH VERDICT</div>
                                                        <div className={`text-2xl font-black tracking-tight mt-1 ${
                                                            simProfile === "legacy" ? "text-rose-500" : "text-emerald-400"
                                                        }`}>
                                                            {simProfile === "legacy" ? "🔴 DO NOT SHIP" : "🟢 SAFE TO SHIP"}
                                                        </div>
                                                        <div className="text-xs text-slate-400 mt-1 max-w-[280px]">
                                                            {simProfile === "legacy" ? "Critical DB locks and timeouts detected. Aborted launch cycle." : "Telemetry benchmarks pass defined SLO gates."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Report Breakdown */}
                                            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/40 text-xs space-y-2.5">
                                                <div className="flex justify-between items-center pb-2 border-b border-slate-950 font-bold font-mono text-[10px] text-slate-500">
                                                    <span>SIGNAL GROUP</span>
                                                    <span>STATUS</span>
                                                </div>
                                                <div className="flex justify-between items-center text-slate-300">
                                                    <span className="flex items-center gap-1.5 font-medium"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Max Concurrency</span>
                                                    <span className="font-mono font-semibold">{simProfile === "legacy" ? "300 VUs" : simProfile === "ecommerce" ? "8,200 VUs" : "5,000+ VUs"}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-slate-300">
                                                    <span className="flex items-center gap-1.5 font-medium"><Eye className="w-3.5 h-3.5 text-purple-400" /> Browser LCP</span>
                                                    <span className="font-mono font-semibold">{simProfile === "legacy" ? "FAIL (>8s)" : simProfile === "ecommerce" ? "1.8s (PASS)" : "0.4s (PASS)"}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-slate-300">
                                                    <span className="flex items-center gap-1.5 font-medium"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Error Threshold</span>
                                                    <span className="font-mono font-semibold text-emerald-400">{simProfile === "legacy" ? "22.4% (CRITICAL)" : "0.00% (PASS)"}</span>
                                                </div>
                                            </div>

                                            {/* CTA within sandbox */}
                                            <div className="pt-2 text-center lg:text-left">
                                                <Link href="/signup">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:text-cyan-300 transition-colors cursor-pointer group">
                                                        Run a real audit on your application free
                                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}

                                </div>
                            </div>
                        </div>

                    </div>
                </section>


                {/* Section 2: Concurrency Slider Breakpoint Stressor */}
                <section id="breakpoint" className="py-20 border-t border-slate-900 scroll-mt-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-12 items-center gap-12">
                            
                            <div className="lg:col-span-5 space-y-6">
                                <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest block font-bold">Stress Testing 101</span>
                                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.1] font-display">
                                    Simulate your breaking point.
                                </h2>
                                <p className="text-slate-400 text-base leading-relaxed">
                                    Every stack has a limits cliff. As virtual traffic scales, database transaction lockups and network queue overflows trigger exponential latency curves.
                                </p>
                                <p className="text-slate-400 text-base leading-relaxed">
                                    Drag the slider to increase virtual load and watch how our telemetry scoring engine changes from healthy to alert, predicting structural collapse before it strikes.
                                </p>
                                
                                <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-slate-200 font-bold block mb-0.5">Automated Baseline Testing</span>
                                        <span className="text-slate-400">Integrate SLO gating directly to GitHub actions. Block merges automatically when commits decrease concurrency targets.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-7">
                                {/* Interactive Breakpoint Widget Box */}
                                <div className={`bg-slate-900/30 border p-8 rounded-3xl shadow-2xl transition-all duration-305 relative overflow-hidden ${sliderGlow}`}>
                                    
                                    {/* Slider state status badge */}
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-xs text-slate-500 font-mono">SIMULATION PANEL</span>
                                        <div className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border ${sliderStatusColor}`}>
                                            {sliderStatusText}
                                        </div>
                                    </div>

                                    {/* Slider display */}
                                    <div className="mb-10 text-center">
                                        <div className="text-slate-500 text-xs font-mono">CONCURRENT VIRTUAL USERS (VUs)</div>
                                        <div className="text-5xl sm:text-6xl font-black text-white mt-2 font-mono tracking-tight">
                                            {currentVU.toLocaleString()}
                                        </div>
                                        
                                        <div className="mt-8 px-4">
                                            <Slider
                                                defaultValue={[800]}
                                                max={5000}
                                                step={50}
                                                value={sliderVU}
                                                onValueChange={(val) => setSliderVU(val)}
                                                className="[&_[data-slot=slider-track]]:bg-slate-800 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-cyan-400 [&_[data-slot=slider-range]]:to-rose-500 [&_[data-slot=slider-thumb]]:border-cyan-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        
                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                            <span className="text-slate-500 text-[10px] font-mono block mb-1">p95 RESPONSE LATENCY</span>
                                            <span className={`text-2xl font-black font-mono tracking-tight ${
                                                currentVU < 2000 ? "text-emerald-400" :
                                                currentVU < 3800 ? "text-amber-400" :
                                                "text-rose-500 animate-pulse"
                                            }`}>
                                                {calcLatency} ms
                                            </span>
                                            <div className="text-[10px] text-slate-600 font-mono mt-1">Normal target: &lt; 200ms</div>
                                        </div>

                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                            <span className="text-slate-500 text-[10px] font-mono block mb-1">HTTP ERROR RATE</span>
                                            <span className={`text-2xl font-black font-mono tracking-tight ${
                                                currentVU < 2800 ? "text-emerald-400" : "text-rose-500"
                                            }`}>
                                                {calcErrors}
                                            </span>
                                            <div className="text-[10px] text-slate-600 font-mono mt-1">SLA requirement: &lt; 0.1%</div>
                                        </div>

                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                            <span className="text-slate-500 text-[10px] font-mono block mb-1">CONTAINER CPU LOAD</span>
                                            <span className={`text-2xl font-black font-mono tracking-tight ${
                                                calcCpu < 80 ? "text-emerald-400" : "text-rose-500"
                                            }`}>
                                                {calcCpu}%
                                            </span>
                                            <div className="text-[10px] text-slate-600 font-mono mt-1">Threshold throttling at 90%</div>
                                        </div>

                                        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                            <span className="text-slate-500 text-[10px] font-mono block mb-1">ESTIMATED RUN RATE COST</span>
                                            <span className="text-2xl font-black font-mono tracking-tight text-white">
                                                {calcCost} <span className="text-xs text-slate-500 font-normal">/ hr</span>
                                            </span>
                                            <div className="text-[10px] text-slate-600 font-mono mt-1">Temporary cluster pricing</div>
                                        </div>

                                    </div>

                                    <div className="mt-6 flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
                                        <span>0 VUs</span>
                                        <span>Breakpoint Threshold (3,800 VUs)</span>
                                        <span>5,000 VUs</span>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>


                {/* Section 3: How it Works Interactive Timeline */}
                <section className="py-20 border-t border-slate-900">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest block font-bold">Under The Hood</span>
                            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 font-display">
                                Platform Architecture Flow
                            </h2>
                            <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
                                Prefracta AI doesn't run simple ping tests. Here is exactly how our launch intelligence environment functions step-by-step.
                            </p>
                        </div>

                        {/* Interactive Steps Layout */}
                        <div className="grid lg:grid-cols-12 gap-8 items-start">
                            
                            {/* Steps Left Buttons list */}
                            <div className="lg:col-span-5 space-y-4">
                                {steps.map((step, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setActiveStep(idx)}
                                        className={`p-6 rounded-2xl border text-left cursor-pointer transition-all ${
                                            activeStep === idx
                                                ? "bg-slate-900/60 border-cyan-500/40 shadow-lg shadow-cyan-500/5 translate-x-2"
                                                : "bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-400"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-bold font-mono ${activeStep === idx ? "text-cyan-400" : "text-slate-500"}`}>
                                                {activeStep === idx ? "⚡ ACTIVE STAGE" : `STAGE 0${idx + 1}`}
                                            </span>
                                            {activeStep > idx && <Check className="w-4 h-4 text-emerald-400" />}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mt-2 font-display">{step.title}</h3>
                                        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Details/Code display card on the right */}
                            <div className="lg:col-span-7 h-full">
                                <div className="bg-slate-900/40 border border-slate-850 p-8 rounded-3xl min-h-[380px] flex flex-col justify-between shadow-2xl relative">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">ENVIRONMENT STATE SIMULATOR</span>
                                            <Badge variant="outline" className="text-cyan-400 border-cyan-500/20 text-[10px] font-mono">
                                                Stage {activeStep + 1}
                                            </Badge>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-2xl font-black text-white font-display">{steps[activeStep].title}</h3>
                                            <p className="text-slate-300 text-sm mt-3 leading-relaxed font-medium">
                                                {steps[activeStep].details}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mock Code Block */}
                                    <div className="mt-8 bg-slate-950 border border-slate-900 rounded-xl p-5 relative overflow-hidden font-mono text-xs text-slate-400 shadow-inner">
                                        <div className="absolute top-3 right-3 text-[10px] text-slate-600 uppercase font-bold select-none">CODE PREVIEW</div>
                                        <pre className="leading-relaxed select-all">
                                            <code>{steps[activeStep].code}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>


                {/* Section 4: Glowing Hover Feature Cards Grid */}
                <section id="features" className="py-20 border-t border-slate-900">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div className="max-w-2xl">
                                <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest block font-bold">Platform Capabilities</span>
                                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 font-display">
                                    Engineered for Brutal Reality.
                                </h2>
                            </div>
                            <p className="text-slate-400 max-w-sm text-sm font-medium leading-relaxed font-sans">
                                Standard load tests skew metrics using static endpoints. Prefracta simulates authentic multi-step customer journeys at global edge scales.
                            </p>
                        </div>

                        {/* Hover Grid cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: Activity,
                                    title: "Hyper-Scale workload",
                                    desc: "Generate 1,000,000+ virtual requests using lightweight Go-based executors. Geographically map traffic from 20+ global regions.",
                                    glowColor: "group-hover:border-cyan-500/40"
                                },
                                {
                                    icon: Shield,
                                    title: "Integrity Config Auditing",
                                    desc: "Read‑only scans of your Docker, K8s pipelines, and database parameters to identify configurations prone to resource throttling.",
                                    glowColor: "group-hover:border-blue-500/40"
                                },
                                {
                                    icon: Cpu,
                                    title: "Orchestrated Analytics",
                                    desc: "Our analytics engine translates telemetry graphs, browser errors, and network limits into clear launch recommendations.",
                                    glowColor: "group-hover:border-indigo-500/40"
                                },
                                {
                                    icon: Globe,
                                    title: "Global Edge Diagnostics",
                                    desc: "Spin up endpoints closest to your customer databases. Trace transaction latencies from Asia-Pacific, America, and Europe.",
                                    glowColor: "group-hover:border-purple-500/40"
                                },
                                {
                                    icon: Lock,
                                    title: "Security Hardening",
                                    desc: "Run automated vulnerability scans during peak user simulations to guarantee your environment doesn't spill customer tokens under pressure.",
                                    glowColor: "group-hover:border-rose-500/40"
                                },
                                {
                                    icon: Code,
                                    title: "Continuous SLO Blockers",
                                    desc: "Enforce deployment gates via CLI integration. Fail pipeline builds if commits reduce latency capacity below SLO requirements.",
                                    glowColor: "group-hover:border-emerald-500/40"
                                },
                            ].map((feat, idx) => (
                                <div
                                    key={idx}
                                    className={`group bg-slate-900/20 border border-slate-900 p-8 rounded-[2rem] hover:bg-slate-900/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[280px] hover:shadow-2xl hover:shadow-cyan-500/[0.02] ${feat.glowColor}`}
                                >
                                    {/* Ambient card glow background */}
                                    <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                        <feat.icon className="w-32 h-32 text-white" />
                                    </div>

                                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-cyan-500/30 transition-all">
                                        <feat.icon className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight mb-3 font-display">{feat.title}</h3>
                                        <p className="text-slate-400 text-xs leading-relaxed font-medium">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Section 5: Animated FAQ Accordion */}
                <section className="py-20 border-t border-slate-900">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-14">
                            <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest block font-bold">Common Queries</span>
                            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 font-display">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        {/* Accordion List */}
                        <div className="space-y-4">
                            {[
                                {
                                    q: "How does Prefracta run tests without polluting production databases?",
                                    a: "Prefracta spins up isolated temporary sandboxes ('staging mirrors') matching your git code configs. We can run test pipelines using isolated mock datasets, database transactions rolled back upon test completion, or targeted queries using test accounts in staging environments."
                                },
                                {
                                    q: "What is the difference between k6 and Playwright audits in Prefracta?",
                                    a: "k6 focuses on raw api and protocol load testing (simulating hundreds of thousands of network requests to test databases and server clusters). Playwright runs real headless browser instances under that load to measure client performance markers like accessibility, DOM layout shifts, and React interaction blocks."
                                },
                                {
                                    q: "Is credit usage billed continuously?",
                                    a: "No. The Free Starter package includes 1 free audit credit monthly (up to 500 VUs). The Weekly Pro and Monthly Elite tiers offer unlimited load test capabilities billed in predictable intervals, suitable for sprints or CI/CD pipelines."
                                },
                                {
                                    q: "Can I run audits directly in my CI/CD pipeline?",
                                    a: "Yes. Prefracta provides a CLI wrapper (`npx prefracta-cli`) that handles sandbox allocation and telemetry audits. You can configure it to fail build stages automatically if p95 response time degrades beyond your predefined SLO margins."
                                }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden transition-all duration-200"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-white hover:bg-slate-900/50 transition-colors"
                                    >
                                        <span className="text-sm sm:text-base font-display">{item.q}</span>
                                        {openFaq === idx ? (
                                            <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                        )}
                                    </button>
                                    
                                    <AnimatePresence initial={false}>
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="border-t border-slate-950 bg-slate-950/40"
                                            >
                                                <div className="px-6 py-5 text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                                                    {item.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Section 6: CTA Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="text-center relative z-10 max-w-4xl mx-auto bg-gradient-to-b from-slate-900/80 to-transparent border border-slate-800/80 p-16 md:p-20 rounded-[3rem] backdrop-blur-md shadow-2xl">
                        
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none font-display">
                            Ready to ship with <br />
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic">
                                absolute certainty?
                            </span>
                        </h2>
                        
                        <p className="mt-6 text-slate-400 text-sm max-w-md mx-auto leading-relaxed font-medium">
                            Run a simulated environment audit in less than 5 minutes. Safeguard your scaling limits before they affect production logs.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link href="/signup">
                                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold h-16 px-10 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95">
                                    Create Free Sandbox Account
                                </Button>
                            </Link>
                            <a href="#simulator">
                                <Button size="lg" variant="outline" className="border-slate-800 hover:bg-slate-900 text-slate-300 font-bold h-16 px-8 rounded-full transition-all">
                                    Simulate Audit Again
                                </Button>
                            </a>
                        </div>
                        
                        <p className="mt-6 text-slate-500 text-xs font-semibold">
                            Free tier includes 500 VUs and basic dashboard metrics. No credit card required.
                        </p>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04)_0,transparent_75%)] blur-[100px] pointer-events-none -z-10" />
                </section>

            </main>

            {/* Footer */}
            <footer className="py-16 border-t border-slate-900/60 bg-slate-950 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-md border border-slate-800 flex items-center justify-center bg-slate-900/40">
                                <Activity className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="text-base font-bold tracking-tight text-slate-400 font-display">
                                Prefracta<span className="text-slate-500 font-extrabold">.ai</span>
                            </span>
                        </div>

                        <div className="flex gap-8 text-xs font-bold text-slate-500 font-sans">
                            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-slate-300 transition-colors">Security Gates</a>
                            <a href="#" className="hover:text-slate-300 transition-colors">Platform Status</a>
                        </div>

                        <div className="text-slate-500 font-medium text-xs font-mono">
                            © 2026 Prefracta AI. All rights reserved.
                        </div>

                    </div>
                </div>
            </footer>

        </div>
    );
}
