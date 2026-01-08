import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Redirect, useLocation } from "wouter";
import {
  Activity,
  Cpu,
  Clock,
  BrainCircuit,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DashboardChat } from "@/components/DashboardChat";
import {
  SystemHealthChart,
  ThroughputChart,
  ScalabilityChart,
  SecurityRadarChart,
  SummaryMatrixTable,
  BusinessImpactCards,
  CollapsePointChart
} from "@/components/DashboardCharts";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const [latestData, setLatestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- FETCH LATEST TEST ---------------- */
  const fetchData = () => {
    if (!token) return;
    setIsLoading(true);
    api.getLatestLoadTest(token)
      .then(setLatestData)
      .catch(err => console.error("Error fetching latest test:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!user || !token) return;
    fetchData();
  }, [user?.totalTests, token]);

  if (!user) return <Redirect to="/" />;

  const testsRun = user.totalTests || 0;
  const hasNoData = testsRun === 0;

  const m = latestData?.metrics;
  const g = latestData?.github;
  const b = latestData?.browserMetrics;
  const ai = latestData?.ai;
  const business = ai?.businessInsights;

  /* ---------------- DATA SYNTHESIS FOR CHARTS ---------------- */

  // 1. Throughput Data Synthesis (Trend simulation based on final result)
  const variance = (base: number) => {
    const v = base * 0.15;
    return Math.max(0, base - v + Math.random() * (v * 2));
  };

  const throughputData = m ? [
    { timestamp: "T-4s", success: variance(m.throughput * 0.7 * (1 - m.failureRateUnderTest)), errors: variance(m.throughput * 0.7 * m.failureRateUnderTest) },
    { timestamp: "T-3s", success: variance(m.throughput * 0.8 * (1 - m.failureRateUnderTest)), errors: variance(m.throughput * 0.8 * m.failureRateUnderTest) },
    { timestamp: "T-2s", success: variance(m.throughput * 1.0 * (1 - m.failureRateUnderTest)), errors: variance(m.throughput * 1.0 * m.failureRateUnderTest) },
    { timestamp: "T-1s", success: variance(m.throughput * 1.2 * (1 - m.failureRateUnderTest)), errors: variance(m.throughput * 1.2 * m.failureRateUnderTest) },
    { timestamp: "Latest", success: m.throughput * (1 - m.failureRateUnderTest), errors: m.throughput * m.failureRateUnderTest }
  ] : [];

  // 2. Scalability Data Synthesis
  const toMs = (v?: number) => {
    if (typeof v !== "number" || v === 0) return 0;
    return v > 10 ? v : v * 1000;
  };

  const scalabilityData = m ? [
    { percentile: "p50", latency: toMs(m.latency?.p50) },
    { percentile: "p95", latency: toMs(m.latency?.p95) },
    { percentile: "p99", latency: toMs(m.latency?.p99) },
    { percentile: "Avg", latency: toMs(m.latency?.avg) },
  ].filter(i => i.latency > 0) : [];

  // 3. Security Radar Data
  const securityData = b ? [
    { subject: "Performance", A: b.performance || 0, fullMark: 100 },
    { subject: "Access", A: b.accessibility || 0, fullMark: 100 },
    { subject: "Practices", A: b.bestPractices || 0, fullMark: 100 },
    { subject: "SEO", A: b.seo || 0, fullMark: 100 },
    { subject: "Speed", A: b.interactivity || 0, fullMark: 100 },
  ] : [
    { subject: 'Performance', A: 85, fullMark: 100 },
    { subject: 'Access', A: 90, fullMark: 100 },
    { subject: 'Practices', A: 88, fullMark: 100 },
    { subject: 'SEO', A: 95, fullMark: 100 },
    { subject: 'Speed', A: 82, fullMark: 100 },
  ];

  const stats = [
    {
      label: "Available Credits",
      value: user.subscription.plan === "free" ? user.credits.toString() : "Unlimited",
      icon: Cpu,
      color: "text-primary",
    },
    {
      label: "Total Tests Run",
      value: testsRun.toString(),
      icon: Activity,
      color: "text-emerald-500",
    },
    {
      label: "Plan Status",
      value: user.subscription.plan,
      icon: Clock,
      color: "text-orange-500",
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-8 pb-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BrainCircuit className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                {hasNoData ? "Agentic AI Active" : "Insight Lab Powered"}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {hasNoData ? "Dashboard Overview" : "Strategic Launch Audit"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              {hasNoData
                ? `Welcome, ${user.username}! Initialize your first audit to see the "Harsh Reality."`
                : `Auditing Infrastructure & Browser Profile for: ${latestData?.url}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading} className="gap-2 border-2 hover:bg-primary/5">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Sync Data
            </Button>
            <Button size="sm" className="gap-2 shadow-lg shadow-primary/25 font-bold" onClick={() => setLocation("/load-test")}>
              <Activity className="w-4 h-4" />
              Begin Launch Audit
            </Button>
          </div>
        </div>

        {/* 1️⃣ BUSINESS IMPACT CARDS - THE "$$ CONVERSION" */}
        {!hasNoData && business && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                Business & Revenue Risk Mapping
              </span>
            </div>
            <BusinessImpactCards business={business} />
          </div>
        )}

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="group hover:border-primary/50 transition-all bg-background/50 backdrop-blur-sm border-2 duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-background border-2 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ANALYSIS GRID - CORE CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <SystemHealthChart
              metrics={m}
              github={g}
            />

            {/* 4️⃣ KILLER VISUAL: ARCHITECTURE COLLAPSE POINT */}
            {!hasNoData && business && (
              <CollapsePointChart
                metrics={m}
                business={business}
              />
            )}

            <ThroughputChart data={throughputData} />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <SecurityRadarChart data={securityData} />
            <ScalabilityChart data={scalabilityData} />

            {/* SMALL AI VERDICT SUMMARY BOX */}
            {!hasNoData && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                    {ai?.message?.split('\n\n')[0] || "Audit complete. View the full SynthMind AI Verdict below."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* AGENTIC AI & CHAT INTERFACE */}
        {!hasNoData && (
          <div className="grid grid-cols-1 gap-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <DashboardChat sessionId={latestData?.id} initialInsight={ai?.message} />
            </div>
          </div>
        )}

        {/* FULL DATA MATRIX */}
        {!hasNoData && (
          <div className="animate-in fade-in duration-1000">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                Detailed Telemetry Matrix
              </span>
            </div>
            <SummaryMatrixTable metrics={m} github={g} />
          </div>
        )}
      </div>
    </Layout>
  );
}
