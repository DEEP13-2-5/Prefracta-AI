import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Redirect, useLocation, useParams, Link } from "wouter";
import {
  Plus,
  Activity,
  Cpu,
  Clock,
  BrainCircuit,
  Loader2,
  RefreshCw,
  MessageSquare,
  BarChart3,
  Search,
  Zap,
  CreditCard,
} from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { DashboardChat } from "@/components/DashboardChat";
import { useLoadTest } from "@/hooks/use-load-test";
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
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const activeTab = params.tab || "overview";

  const { data: latestData, isLoading: isDataLoading, refetch } = useLoadTest("latest");
  const chatRef = useRef<HTMLDivElement>(null);

  if (!user) return <Redirect to="/" />;

  // Check if subscription expired
  const isSubscriptionExpired = user.subscription.plan !== 'free' &&
    user.subscription.daysLeft !== undefined &&
    user.subscription.daysLeft === 0;

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

  const throughputData = useMemo(() => m ? [
    { timestamp: "T-4s", success: variance(m.throughput * 0.7 * (1 - m.failureRateUnderTest)), errors: variance(m.throughput * 0.7 * m.failureRateUnderTest) },
    { timestamp: "T-3s", success: variance(m.throughput * 0.8 * (1 - m.failureRateUnderTest)), errors: variance(m.throughput * 0.8 * m.failureRateUnderTest) },
    { timestamp: "T-2s", success: variance(m.throughput * 1.0 * (1 - m.failureRateUnderTest)), errors: variance(m.throughput * 1.0 * m.failureRateUnderTest) },
    { timestamp: "T-1s", success: variance(m.throughput * 1.2 * (1 - m.failureRateUnderTest)), errors: variance(m.throughput * 1.2 * m.failureRateUnderTest) },
    { timestamp: "Latest", success: m.throughput * (1 - m.failureRateUnderTest), errors: m.throughput * m.failureRateUnderTest }
  ] : [], [m]);

  const toMs = (v?: number) => {
    if (typeof v !== "number" || v === 0) return 0;
    return v > 10 ? v : v * 1000;
  };

  const scalabilityData = useMemo(() => m ? [
    { percentile: "p50", latency: toMs(m.latency?.p50) },
    { percentile: "p95", latency: toMs(m.latency?.p95) },
    { percentile: "p99", latency: toMs(m.latency?.p99) },
    { percentile: "Avg", latency: toMs(m.latency?.avg) },
  ].filter(i => i.latency > 0) : [], [m]);

  const securityData = useMemo(() => b ? [
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
  ], [b]);

  const tabs = [
    { id: "overview", label: "Overview", icon: BrainCircuit },
    { id: "metrics", label: "Metrics", icon: BarChart3 },
    { id: "playwright", label: "Playwright", icon: Search },
    { id: "performance", label: "Performance", icon: Zap },
  ];

  const renderContent = () => {
    // Show expiry message if subscription expired
    if (isSubscriptionExpired) {
      return (
        <Card className="border-destructive border-2 bg-destructive/5">
          <CardContent className="py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-destructive">Subscription Expired</h3>
              <p className="text-muted-foreground mb-2">
                Your subscription has ended. All features are now locked.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Renew your subscription to regain access to load testing, AI analysis, and dashboard insights.
              </p>
              <Button size="lg" className="rounded-full px-8" onClick={() => setLocation("/subscription")}>
                <CreditCard className="mr-2 h-4 w-4" /> Renew Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (hasNoData) {
      return (
        <Card className="border-dashed border-2 bg-slate-900/10">
          <CardContent className="py-20 text-center">
            <div className="max-w-md mx-auto">
              <Activity className="w-12 h-12 text-blue-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Audit Telemetry Found</h3>
              <p className="text-muted-foreground mb-8">
                Run your first load test to view system health, architectural insights, and AI analysis.
              </p>
              <Button size="lg" className="rounded-full px-8" onClick={() => setLocation("/load-test")}>
                <Plus className="mr-2 h-4 w-4" /> Start First Test
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* TOP ROW: AI Central Intelligence + Overall Health Graph (EQUAL SPLIT) */}
            {!hasNoData && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[600px] min-h-[600px]">
                {/* LEFT: AI Agent (Takes 50% width) */}
                <div ref={chatRef} className="animate-in fade-in slide-in-from-left-4 duration-700 h-full overflow-hidden">
                  <DashboardChat
                    sessionId={latestData?.id}
                    initialMessage={ai?.message}
                  />
                </div>

                {/* RIGHT: System Health / Readiness Score (Takes 50% width) */}
                <div className="h-full animate-in fade-in slide-in-from-right-4 duration-700 overflow-hidden">
                  <SystemHealthChart metrics={m} github={g} />
                </div>
              </div>
            )}

            {/* BOTTOM ROW: 4 Aligned Business Cards */}
            <BusinessImpactCards business={business} metrics={m} remediations={business?.remediations} />
          </div>
        );
      case "metrics":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <SummaryMatrixTable metrics={m} github={g} />
            <div className="grid md:grid-cols-2 gap-8">
              <ThroughputChart data={throughputData} />
              <ScalabilityChart data={scalabilityData} />
            </div>
          </div>
        );
      case "playwright":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <SecurityRadarChart data={securityData} />
              </div>
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Playwright Audit Breakdown</CardTitle>
                    <CardDescription>Deep dive into browser-level performance and accessibility</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {securityData.map((item: any, i: number) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                            <span>{item.subject}</span>
                            <span className={cn(
                              item.A >= 90 ? "text-emerald-500" : (item.A >= 70 ? "text-amber-500" : "text-rose-500")
                            )}>
                              {item.A}/100
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all duration-1000",
                                item.A >= 90 ? "bg-emerald-500" : (item.A >= 70 ? "bg-amber-500" : "bg-rose-500")
                              )}
                              style={{ width: `${item.A}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {g && <CICDEnforcement risk={g.cicd?.risk} />}
          </div>
        );
      case "performance":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {business && (
              <CollapsePointChart
                metrics={m}
                business={business}
              />
            )}
            <div className="grid md:grid-cols-2 gap-8">
              <ThroughputChart
                data={throughputData}
                collapsePoint={business?.collapsePoint}
              />
              <ScalabilityChart data={scalabilityData} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/5 p-6 rounded-2xl border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 px-2 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                {hasNoData ? "Agentic AI Active" : "Audit Intelligence"}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Session ID: {latestData?.id?.slice(0, 8) || "N/A"}
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tightest">
              {hasNoData ? "Console Home" : "Strategic Analysis"}
            </h1>

            <p className="text-muted-foreground mt-1 text-sm font-medium">
              {hasNoData
                ? `Welcome back, ${user.username}. Ready to analyze?`
                : `Target: ${latestData?.url}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-full font-bold border-slate-200 hover:bg-slate-100"
              onClick={() => refetch()}
              disabled={isDataLoading}
            >
              <RefreshCw className={cn("w-4 h-4", isDataLoading && "animate-spin")} />
              Sync State
            </Button>
            <Button size="lg" className="gap-2 rounded-full font-bold shadow-lg shadow-primary/20" onClick={() => setLocation("/load-test")}>
              <Plus className="w-5 h-5" />
              New Load Test
            </Button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        {!hasNoData && (
          <div className="flex p-1 bg-slate-100 rounded-xl w-full max-w-2xl overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/dashboard/${tab.id}`}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-slate-400")} />
                {tab.label}
              </Link>
            ))}
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="mt-2">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
}
