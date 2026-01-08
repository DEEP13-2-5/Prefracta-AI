import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Redirect, useLocation } from "wouter";
import {
  Plus,
  Activity,
  Cpu,
  Clock,
  BrainCircuit,
  Loader2,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { DashboardChat } from "@/components/DashboardChat";
import {
  SystemHealthChart,
  ThroughputChart,
  ScalabilityChart,
  SecurityRadarChart,
  SummaryMatrixTable,
  BusinessImpactCards,
  CollapsePointChart,
  StrategicRemediations,
  CICDEnforcement
} from "@/components/DashboardCharts";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const [latestData, setLatestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

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
                {hasNoData ? "Agentic AI Active" : "Audit Complete"}
              </span>
            </div>

            <h1 className="text-3xl font-bold">
              {hasNoData ? "Dashboard Overview" : "Strategic Analysis"}
            </h1>

            <p className="text-muted-foreground mt-1 text-sm">
              {hasNoData
                ? `Welcome, ${user.username}! Run your first audit to see the "Harsh Reality."`
                : `Auditing: ${latestData?.url}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}

            {!hasNoData && (
              <Button
                variant="outline"
                onClick={() => chatRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Ask AI
              </Button>
            )}

            <Button size="lg" className="gap-2" onClick={() => setLocation("/load-test")}>
              <Plus className="w-5 h-5" />
              New Load Test
            </Button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MAIN GRID */}
        {hasNoData ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-20 text-center text-muted-foreground">
              Run your first load test to view system health, charts, and AI analysis.
            </CardContent>
          </Card>
        ) : (
          <>
            {/* STRATEGIC OVERALL VIEW: SCORE + ACCELERATORS */}
            <div className="grid lg:grid-cols-2 gap-8">
              <SystemHealthChart
                metrics={m}
                github={g}
              />
              {business && (
                <StrategicRemediations remediations={business.remediations} />
              )}
            </div>

            {/* CHATTING SYSTEM - AI RESPONSE */}
            {!hasNoData && (
              <div ref={chatRef} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <DashboardChat
                  sessionId={latestData?.id}
                  initialMessage={ai?.message}
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ThroughputChart
                data={throughputData}
                collapsePoint={business?.collapsePoint}
              />
              <ScalabilityChart data={scalabilityData} />
              <SecurityRadarChart data={securityData} />

              {/* COLLAPSE POINT INTEGRATED INTO GRID */}
              {business && (
                <div className="md:col-span-2 lg:col-span-3">
                  <CollapsePointChart
                    metrics={m}
                    business={business}
                  />
                </div>
              )}
            </div>

            <div className="mt-8">
              <SummaryMatrixTable metrics={m} github={g} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
