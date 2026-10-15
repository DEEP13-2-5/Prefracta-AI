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
  BarChart3,
  Search,
  Zap,
  CreditCard,
  ShieldCheck,
  Github,
  Globe2,
  CheckCircle2,
  AlertTriangle,
  LockKeyhole,
  Radar,
  Gauge,
  FileWarning,
  FileText,
  Info,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
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
  const throughputData = useMemo(() => m ? [
    { timestamp: "T-4s", success: m.throughput * 0.7 * (1 - m.failureRateUnderTest), errors: m.throughput * 0.7 * m.failureRateUnderTest },
    { timestamp: "T-3s", success: m.throughput * 0.8 * (1 - m.failureRateUnderTest), errors: m.throughput * 0.8 * m.failureRateUnderTest },
    { timestamp: "T-2s", success: m.throughput * 1.0 * (1 - m.failureRateUnderTest), errors: m.throughput * 1.0 * m.failureRateUnderTest },
    { timestamp: "T-1s", success: m.throughput * 1.2 * (1 - m.failureRateUnderTest), errors: m.throughput * 1.2 * m.failureRateUnderTest },
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
  ] : [], [b]);

  const tabs = [
    { id: "overview", label: "Overview", icon: BrainCircuit },
    { id: "report", label: "AI report", icon: FileText },
    { id: "metrics", label: "Load evidence", icon: BarChart3 },
    { id: "frontend", label: "Frontend audit", icon: Radar },
    { id: "playwright", label: "Playwright audit", icon: Search },
    { id: "security", label: "Security audits", icon: ShieldCheck },
    { id: "repository", label: "Repository", icon: Github },
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
          <div className="space-y-5 animate-in fade-in duration-500">
            <div className="grid gap-4 md:grid-cols-3">
              <EvidenceCard icon={Zap} label="Load test" value={m ? `${m.throughput?.toFixed?.(0) || 0} req/s` : "Not run"} detail={m ? `p95 ${toMs(m.latency?.p95)} ms · ${(m.failureRateUnderTest * 100).toFixed(2)}% errors` : "Run against a staging URL"} tone={m ? "good" : "neutral"} />
              <EvidenceCard icon={Globe2} label="Browser audit" value={b ? `${b.performance || 0}/100` : "Not run"} detail={b ? `Accessibility ${b.accessibility || 0} · Practices ${b.bestPractices || 0}` : "Performance and UX checks"} tone={b ? "good" : "neutral"} />
              <EvidenceCard icon={Github} label="Repository review" value={g ? `${g.summary?.devOpsScore || 0}/100` : "Not connected"} detail={g ? `${g.docker?.present ? "Docker" : "No Docker"} · ${g.cicd?.present ? "CI/CD detected" : "CI/CD not found"}` : "Connect GitHub for delivery checks"} tone={g?.summary?.riskLevel === "high" ? "warn" : g ? "good" : "neutral"} />
            </div>
            <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-blue-600">Release decision</p><h2 className="mt-2 text-2xl font-bold">What should you do next?</h2></div><span className={cn("rounded-full px-3 py-1 text-xs font-bold", m?.failureRateUnderTest > .05 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800")}>{m?.failureRateUnderTest > .05 ? "Review before release" : "Evidence looks stable"}</span></div><p className="mt-3 text-sm leading-6 text-slate-600">Start with the evidence cards above. Open the <Link href="/dashboard/report" className="font-semibold text-blue-700 hover:underline">AI report</Link> for the plain-English explanation and recommended actions.</p><div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-5"><div className="flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-blue-600" /><p className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">Quick interpretation</p></div><p className="mt-3 text-sm leading-7 text-slate-700">{m ? `The system handled about ${Math.round(m.throughput || 0)} requests per second with ${(Number(m.failureRateUnderTest || 0) * 100).toFixed(2)}% failures. Open the AI report for the detailed meaning.` : "Run an assessment to generate an evidence-backed release summary."}</p></div></div><SystemHealthChart metrics={m} github={g} /></div>
          </div>
        );
      case "report":
        return <div className="space-y-5 animate-in fade-in duration-500"><AuditSummary data={latestData} ai={ai} /><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Need the underlying evidence?</p><p className="mt-2 text-sm leading-6 text-slate-600">Use the Load evidence, Frontend audit, Playwright audit, Security audits, and Repository tabs for the detailed results behind this summary.</p></div></div>;
      case "security":
        return <><SecurityCoverage metrics={m} github={g} browser={b} frontendAudit={latestData?.frontendAudit} securityAudit={latestData?.securityAudit} /><SecurityFindings audit={latestData?.securityAudit} /></>;
      case "frontend":
        return <FrontendAudit audit={getFrontendAudit(latestData)} />;
      case "repository":
        return <RepositoryCoverage github={g} />;
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
                    <CardDescription>
                      {b?.source === "real"
                        ? `Real browser audit${b.loadTimeMs ? `, load time ${b.loadTimeMs}ms` : ""}`
                        : "Browser audit data unavailable for this run"}
                    </CardDescription>
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
              {hasNoData ? "Release workspace" : "Latest assessment"}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Session ID: {latestData?.id?.slice(0, 8) || "N/A"}
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tightest">
              {hasNoData ? "Your release workspace" : "Release assessment"}
            </h1>

            <p className="text-muted-foreground mt-1 text-sm font-medium">
              {hasNoData
                ? `Welcome back, ${user.username}. Ready to analyze?`
                : `Target: ${latestData?.url} · Run evidence before releasing.`}
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
              Run assessment
            </Button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        {!hasNoData && (
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl w-full">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/dashboard/${tab.id}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
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

function EvidenceCard({ icon: Icon, label, value, detail, tone }: { icon: any; label: string; value: string; detail: string; tone: "good" | "warn" | "neutral" }) {
  const styles = tone === "good" ? "bg-emerald-50 text-emerald-700" : tone === "warn" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600";
  return <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-start justify-between"><div className={`grid h-9 w-9 place-items-center rounded-lg ${styles}`}><Icon className="h-4 w-4" /></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${styles}`}>{tone === "good" ? "Evidence" : tone === "warn" ? "Review" : "Pending"}</span></div><p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-slate-400">{label}</p><p className="mt-1 text-xl font-bold text-slate-950">{value}</p><p className="mt-1 text-sm text-slate-500">{detail}</p></div>;
}

function AuditSummary({ data, ai }: { data: any; ai: any }) {
  const target = data?.url || "Target not recorded";
  const appName = (() => {
    try { return new URL(target).hostname.replace(/^www\./, ""); } catch { return target; }
  })();
  const frontend = getFrontendAudit(data);
  const browser = data?.browserMetrics;
  const security = data?.securityAudit;
  const github = data?.github;
  const metrics = data?.metrics;
  const checks = [
    {
      title: "GitHub analysis",
      icon: Github,
      status: github ? "Complete" : "Not connected",
      detail: github
        ? `${github.summary?.devOpsScore || 0}/100 DevOps posture · ${github.docker?.present ? "Docker detected" : "Docker missing"} · ${github.cicd?.present ? "CI/CD detected" : "CI/CD missing"}`
        : "Connect a repository to inspect delivery, container, Kubernetes, and credential signals.",
    },
    {
      title: "k6 load test",
      icon: Zap,
      status: metrics ? "Complete" : "Not collected",
      detail: metrics
        ? `${Number(metrics.throughput || 0).toFixed(0)} requests/sec · p95 ${Math.round(metrics.latency?.p95 || 0)} ms · ${(Number(metrics.failureRateUnderTest || 0) * 100).toFixed(2)}% failures`
        : "Measures throughput, latency percentiles, failures, and server errors under concurrent load.",
    },
    {
      title: "Playwright browser audit",
      icon: Globe2,
      status: browser ? "Complete" : "Not collected",
      detail: browser
        ? `Performance ${browser.performance || 0}/100 · accessibility ${browser.accessibility || 0}/100 · best practices ${browser.bestPractices || 0}/100 · SEO ${browser.seo || 0}/100`
        : "Checks the target in a real browser for page load, accessibility, SEO, and UX signals.",
    },
    {
      title: "Lighthouse frontend audit",
      icon: Radar,
      status: frontend?.status === "complete" ? "Complete" : "Not available",
      detail: frontend?.status === "complete"
        ? `Performance ${frontend.scores?.performance || 0}/100 · accessibility ${frontend.scores?.accessibility || 0}/100 · SEO ${frontend.scores?.seo || 0}/100`
        : frontend?.reason || "Collects Lighthouse category scores and Core Web Vitals.",
    },
    {
      title: "Security baseline",
      icon: ShieldCheck,
      status: security?.status === "complete" ? "Complete" : "Not collected",
      detail: security?.status === "complete"
        ? `${security.findings?.length || 0} passive finding(s) from ${security.tool || "security checks"} · no active exploitation`
        : security?.reason || "Checks passive security signals and response headers. It does not perform a penetration test.",
    },
  ];

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-5 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[.15em] text-blue-600">AI reviewer summary</p><h2 className="mt-2 text-2xl font-bold">{appName}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">A quick, human-readable explanation of what was checked, what it means, and what deserves attention before release.</p></div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Automated system audit</span>
    </div>
    <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5"><p className="text-xs font-bold uppercase tracking-wider text-blue-700">Reviewer conclusion</p><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{ai?.message || "The assessment is complete. Review each evidence stream below before release."}</p></div>
      <div className="rounded-lg border border-slate-100 p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessment target</p><p className="mt-3 break-all text-sm font-semibold text-slate-800">{target}</p><p className="mt-3 text-xs leading-5 text-slate-500">All results describe this target and the repository supplied for this assessment. They are evidence from this run, not a guarantee of every production state.</p></div>
    </div>
    <div className="mt-6"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Checks performed</p><p className="mt-1 text-sm text-slate-500">Each card answers: what was checked and what the result means.</p></div><span className="text-xs font-semibold text-slate-400">{checks.filter((check) => check.status === "Complete").length}/{checks.length} complete</span></div><div className="mt-3 grid gap-3 md:grid-cols-2">{checks.map(({ title, icon: Icon, status, detail }) => <div key={title} className="rounded-xl border border-slate-100 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"><div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100"><Icon className="h-4 w-4 text-slate-600" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{title}</p><span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", status === "Complete" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>{status}</span></div><p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p></div></div></div>)}</div></div>
  </section>;
}

function getFrontendAudit(data: any) {
  const audit = data?.frontendAudit;
  if (audit?.status === "complete" && audit.scores && audit.webVitals) {
    return audit;
  }

  const browser = data?.browserMetrics;
  if (browser && ["performance", "accessibility", "bestPractices", "seo"].some((key) => typeof browser[key] === "number")) {
    return {
      source: browser.source || "browser",
      status: "complete",
      scores: {
        performance: Number(browser.performance || 0),
        accessibility: Number(browser.accessibility || 0),
        bestPractices: Number(browser.bestPractices || 0),
        seo: Number(browser.seo || 0),
      },
      webVitals: {
        fcpMs: null,
        lcpMs: null,
        cls: null,
        tbtMs: null,
      },
      findings: [],
      compatibilityNote: "Lighthouse fields were missing in the saved session; browser audit evidence is shown instead.",
    };
  }

  return audit;
}

function FrontendAudit({ audit }: { audit: any }) {
  if (audit?.status !== "complete") {
    return <AuditUnavailable icon={Radar} eyebrow="Lighthouse frontend audit" title="Frontend audit unavailable" description={audit?.reason || "Run a new authorized assessment to collect Lighthouse performance, accessibility, best-practice, and SEO evidence."} />;
  }
  const scores = [["Performance", audit.scores?.performance], ["Accessibility", audit.scores?.accessibility], ["Best practices", audit.scores?.bestPractices], ["SEO", audit.scores?.seo]] as const;
  const vitals = [["FCP", audit.webVitals?.fcpMs, "ms"], ["LCP", audit.webVitals?.lcpMs, "ms"], ["CLS", audit.webVitals?.cls, ""], ["TBT", audit.webVitals?.tbtMs, "ms"]] as const;
  const average = Math.round(scores.reduce((sum, [, value]) => sum + Number(value || 0), 0) / scores.length);
  return <div className="space-y-6 animate-in fade-in duration-500">
    <div className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-blue-600">{audit.source === "lighthouse" ? "Lighthouse frontend audit" : "Browser frontend audit"} · completed</p><h2 className="mt-2 text-2xl font-bold">A visual quality report for your release</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Evidence across performance, accessibility, best practices, SEO, and Core Web Vitals.</p>{audit.compatibilityNote && <p className="mt-3 text-xs font-semibold text-amber-700">{audit.compatibilityNote}</p>}</div><ScoreDonut score={average} label="overall" /></div></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{scores.map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", scoreTone(Number(value)))}>{scoreLabel(Number(value))}</span></div><p className="mt-3 text-3xl font-black">{value ?? 0}<span className="text-sm font-semibold text-slate-400">/100</span></p><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className={cn("h-full rounded-full", scoreBar(Number(value)))} style={{ width: `${value ?? 0}%` }} /></div></div>)}</div>
    <div className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-3"><Gauge className="h-5 w-5 text-blue-600" /><div><h3 className="font-bold">Core Web Vitals</h3><p className="text-sm text-slate-500">User-perceived loading and responsiveness signals.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{vitals.map(([label, value, unit]) => <div key={label} className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-xl font-bold">{value == null ? "N/A" : `${typeof value === "number" ? Math.round(value * 100) / 100 : value}${unit}`}</p></div>)}</div></div>
    <div className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-3"><FileWarning className="h-5 w-5 text-amber-600" /><div><h3 className="font-bold">Priority opportunities</h3><p className="text-sm text-slate-500">The lowest-scoring audits from this run, ranked for remediation.</p></div></div><div className="mt-5 divide-y divide-slate-100">{audit.findings?.length ? audit.findings.map((item: any) => <div key={item.id} className="flex items-start gap-4 py-4"><span className={cn("rounded-full px-2 py-1 text-xs font-bold", scoreTone(item.score))}>{item.score}/100</span><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{item.detail}</p></div></div>) : <p className="py-4 text-sm text-slate-500">No failed Lighthouse audits were reported.</p>}</div></div>
  </div>;
}

function SecurityCoverage({ metrics, github, browser, frontendAudit, securityAudit }: { metrics: any; github: any; browser: any; frontendAudit: any; securityAudit: any }) {
  const rows = [
    ["Runtime reliability", metrics ? (metrics.failureRateUnderTest > .01 ? "Review" : "Passed") : "Not run", metrics ? `${(metrics.failureRateUnderTest * 100).toFixed(2)}% error rate under test` : "Run a load assessment", Zap],
    ["Browser quality", browser ? ((browser.bestPractices || 0) >= 80 ? "Passed" : "Review") : "Not run", browser ? `Best practices ${browser.bestPractices || 0}/100 · accessibility ${browser.accessibility || 0}/100` : "Run a browser audit", Globe2],
    ["Delivery controls", github ? (github.cicd?.present ? "Passed" : "Review") : "Not connected", github ? (github.cicd?.present ? "CI/CD workflow detected" : "No CI/CD workflow detected") : "Connect GitHub repository", Github],
    ["Container readiness", github ? (github.docker?.present ? "Passed" : "Review") : "Not connected", github ? (github.docker?.present ? "Dockerfile detected" : "Dockerfile not detected") : "Connect GitHub repository", ShieldCheck],
    ["Repository hygiene", github ? ((!github.security?.envFileTracked && (github.security?.exposedSecretPatterns || 0) === 0) ? "Passed" : "Review") : "Not connected", github ? (github.security?.envFileTracked ? "Environment file found in repository" : `${github.security?.exposedSecretPatterns || 0} potential credential patterns found`) : "Connect GitHub repository", LockKeyhole],
    ["Lighthouse quality audit", frontendAudit?.status === "complete" ? (frontendAudit.scores?.performance >= 70 ? "Passed" : "Review") : "Not run", frontendAudit?.status === "complete" ? `Performance ${frontendAudit.scores?.performance}/100 · LCP ${Math.round(frontendAudit.webVitals?.lcpMs || 0)} ms` : (frontendAudit?.reason || "Lighthouse result unavailable"), Radar],
    [securityAudit?.tool || "OWASP ZAP passive scan", securityAudit?.status === "complete" ? (securityAudit.findings?.some((item: any) => ["high", "medium"].includes(item.severity)) ? "Review" : "Passed") : "Not run", securityAudit?.status === "complete" ? `${securityAudit.findings?.length || 0} passive findings · no active attacks` : (securityAudit?.reason || "Security result unavailable"), ShieldCheck],
  ];
  return <div className="space-y-6 animate-in fade-in duration-500"><div className="rounded-xl border border-slate-200 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-blue-600">Security & release coverage</p><h2 className="mt-2 text-2xl font-bold">Checks that make release risk visible.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">These are transparent readiness signals, not a substitute for a full penetration test. Every status is tied to an observed check.</p></div><div className="overflow-hidden rounded-xl border border-slate-200 bg-white">{rows.map(([title, status, detail, Icon]: any) => <div key={title} className="flex items-center gap-4 border-b border-slate-100 p-5 last:border-0"><div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100"><Icon className="h-5 w-5 text-slate-700" /></div><div className="min-w-0 flex-1"><p className="font-semibold">{title}</p><p className="text-sm text-slate-500">{detail}</p></div><span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${status === "Passed" ? "bg-emerald-50 text-emerald-700" : status === "Review" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{status === "Passed" ? <CheckCircle2 className="h-3.5 w-3.5" /> : status === "Review" ? <AlertTriangle className="h-3.5 w-3.5" /> : null}{status}</span></div>)}</div></div>;
}

const severityStyles: Record<string, { card: string; text: string; badge: string }> = {
  high: { card: "border-rose-200 bg-rose-50", text: "text-rose-700", badge: "bg-rose-100 text-rose-700" },
  medium: { card: "border-amber-200 bg-amber-50", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
  low: { card: "border-blue-200 bg-blue-50", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  info: { card: "border-slate-200 bg-slate-50", text: "text-slate-600", badge: "bg-slate-100 text-slate-600" },
};

function SecurityFindings({ audit }: { audit: any }) {
  if (audit?.status !== "complete") {
    return <AuditUnavailable icon={ShieldAlert} eyebrow="OWASP ZAP passive scan" title="Security scan not available for this assessment" description={audit?.reason || "The passive security result was not collected for this session."} />;
  }
  const findings = audit.findings || [];
  const counts = ["high", "medium", "low", "info"].map((severity) => ({ severity, count: findings.filter((item: any) => item.severity === severity).length }));
  return <div className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-blue-600">{audit.tool || "OWASP ZAP"} · passive evidence</p><h2 className="mt-2 text-2xl font-bold">What needs attention?</h2><p className="mt-2 text-sm leading-6 text-slate-600">{audit.note || "Passive scanning does not exploit the target."}</p></div><ShieldAlert className="h-6 w-6 text-blue-600" /></div><div className="mt-6 grid gap-3 sm:grid-cols-4">{counts.map(({ severity, count }) => <div key={severity} className={cn("rounded-lg border p-4", severityStyles[severity].card)}><p className={cn("text-xs font-bold uppercase tracking-wider", severityStyles[severity].text)}>{severity}</p><p className={cn("mt-2 text-3xl font-black", severityStyles[severity].text)}>{count}</p></div>)}</div><div className="mt-6 divide-y divide-slate-100 rounded-lg border border-slate-100">{findings.length ? findings.map((finding: any, index: number) => <div key={`${finding.ruleId || "finding"}-${index}`} className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className={cn("rounded-full px-2 py-1 text-[10px] font-bold uppercase", severityStyles[finding.severity]?.badge || severityStyles.info.badge)}>{finding.severity || "info"}</span><span className="text-xs font-semibold text-slate-400">Rule {finding.ruleId || "n/a"}</span></div><span className="text-xs text-slate-500">{finding.instances || 0} instance{finding.instances === 1 ? "" : "s"}</span></div><h3 className="mt-3 font-bold">{finding.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{finding.detail}</p>{finding.remediation && <p className="mt-3 flex gap-2 text-sm leading-6 text-blue-700"><Info className="mt-1 h-4 w-4 shrink-0" /><span><strong>Recommended remediation:</strong> {finding.remediation}</span></p>}</div>) : <div className="p-8 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" /><p className="mt-3 font-semibold">No passive findings were reported</p><p className="mt-1 text-sm text-slate-500">Keep dependency, header, and authentication testing in your release process.</p></div>}</div></div>;
}

function ScoreDonut({ score, label }: { score: number; label: string }) {
  const tone = scoreBar(score);
  return <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(currentColor ${score}%, #e2e8f0 0)` }}><div className="grid h-16 w-16 place-items-center rounded-full bg-white"><span className={cn("text-xl font-black", tone.replace("bg-", "text-"))}>{score}</span><span className="text-[9px] font-bold uppercase text-slate-400">{label}</span></div></div>;
}

function AuditUnavailable({ icon: Icon, eyebrow, title, description }: { icon: any; eyebrow: string; title: string; description: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-8"><div className="mx-auto max-w-2xl text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100"><Icon className="h-7 w-7 text-slate-500" /></div><p className="mt-5 text-xs font-bold uppercase tracking-[.15em] text-blue-600">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p><div className="mt-6 grid gap-3 text-left sm:grid-cols-3">{["Check target reachability", "Run an authorized assessment", "Review evidence here"].map((step, index) => <div key={step} className="rounded-lg border border-slate-100 bg-slate-50 p-3"><span className="text-xs font-black text-blue-600">0{index + 1}</span><p className="mt-1 text-sm font-semibold text-slate-700">{step}</p></div>)}</div></div></div>;
}

function scoreTone(score: number) {
  return score >= 90 ? "bg-emerald-50 text-emerald-700" : score >= 50 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
}

function scoreBar(score: number) {
  return score >= 90 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500";
}

function scoreLabel(score: number) {
  return score >= 90 ? "Good" : score >= 50 ? "Review" : "Weak";
}

function RepositoryCoverage({ github }: { github: any }) {
  const entries = [["Start command", github?.hasStartScript], ["Docker configuration", github?.docker?.present], ["CI/CD workflow", github?.cicd?.present], ["Kubernetes manifests", github?.kubernetes?.present]];
  const quality = github?.quality || {};
  const security = github?.security || {};
  const deployment = github?.deployment || {};
  const project = github?.project || {};
  const detailedChecks = [
    ["README documentation", quality.readmePresent], ["License", quality.licensePresent], [".env.example template", quality.envExamplePresent],
    ["Dependency lockfile", quality.lockfilePresent], ["Automated tests", quality.testsPresent || quality.testScriptPresent], ["Build script", quality.buildScriptPresent],
    ["Lint script", quality.lintScriptPresent], ["Type checking", quality.typecheckScriptPresent], ["Formatting script", quality.formatScriptPresent],
    ["Health/readiness check", quality.healthCheckPresent || deployment.healthcheckPresent], ["Structured logging/observability", quality.observabilityPresent],
    ["Security middleware/CSP", security.securityMiddlewareDetected], ["Security policy", security.securityPolicyPresent], ["Docker Compose", deployment.dockerComposePresent],
    ["Deployment configuration", deployment.deploymentConfigPresent], ["Infrastructure as code", deployment.infrastructureAsCodePresent],
  ];
  return <div className="space-y-6 animate-in fade-in duration-500"><div className="rounded-xl border border-slate-200 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-blue-600">Read-only GitHub review</p><h2 className="mt-2 text-2xl font-bold">Complete repository engineering audit</h2><p className="mt-2 text-sm text-slate-600">The analyzer reviews application structure, dependencies, tests, security hygiene, deployment readiness, documentation, and operational signals. It does not modify the repository.</p><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">Framework</p><p className="mt-1 font-semibold">{github?.framework || "Unknown"}</p></div><div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">Languages</p><p className="mt-1 font-semibold">{project.languages?.join(", ") || "Unknown"}</p></div><div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">Code inventory</p><p className="mt-1 font-semibold">{project.sourceFileCount || 0} source · {project.testFileCount || 0} test files</p></div></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{entries.map(([label, detected]) => <div key={label as string} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><p className="font-semibold">{label}</p>{detected ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-amber-600" />}</div><p className="mt-3 text-sm text-slate-500">{github ? (detected ? "Detected in repository" : "Not detected — review before release") : "Connect a repository to check"}</p></div>)}</div><div className="rounded-xl border border-slate-200 bg-white p-6"><h3 className="font-bold">Detailed checks</h3><p className="mt-1 text-sm text-slate-500">Each signal is independently evaluated from repository files and configuration.</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{detailedChecks.map(([label, detected]) => <div key={label as string} className={cn("rounded-lg border p-4", detected ? "border-emerald-100 bg-emerald-50/50" : "border-amber-100 bg-amber-50/50")}><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">{label}</p>{detected ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}</div><p className={cn("mt-2 text-xs font-bold", detected ? "text-emerald-700" : "text-amber-700")}>{detected ? "Detected" : "Not detected"}</p></div>)}</div></div>{github?.issues?.length > 0 && <div className="rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="font-semibold text-amber-950">Repository findings ({github.issues.length})</p><ul className="mt-2 grid gap-1 text-sm text-amber-800 sm:grid-cols-2">{github.issues.map((issue: string) => <li key={issue}>• {issue}</li>)}</ul></div>}</div>;
}
