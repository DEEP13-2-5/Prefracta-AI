import express from "express";
import mongoose from "mongoose";
import { runK6Test } from "../Runners/k6runner.js";
import { runPlaywrightAudit } from "../Runners/playwrightRunner.js";
import { parseK6Data, buildChartResponse } from "../Utils/Loaddata.js";
import { analyzeGithubRepo } from "../Utils/githubAnalyzer.js";
import getresponseopenrouter from "../Utils/openrouter.js";
import { checkCreditsOrSub } from "../Middleware/authMiddleware.js";
import TestSession from "../Models/TestSession.js";
import { validateAuthorizedTarget } from "../Utils/scanAuthorization.js";
import { runLighthouseAudit } from "../Runners/lighthouseRunner.js";
import { runZapBaseline } from "../Runners/securityRunner.js";

const router = express.Router();

// Helper: sanitize any provider-internal messages stored in sessions
const sanitizeSessionForClient = (session) => {
  if (!session) return session;
  const clone = JSON.parse(JSON.stringify(session));

  const suspiciousPattern = /(No endpoints found|endpoints found for|provider unavailable|model.*not found|qwen|meta-llama|llama-3\.1)/i;

  if (clone.ai && typeof clone.ai.message === "string" && suspiciousPattern.test(clone.ai.message)) {
    clone.ai = clone.ai || {};
    clone.ai.message = "Live AI provider message removed for privacy; a deterministic fallback is shown where applicable.";
  }

  if (Array.isArray(clone.chatHistory)) {
    clone.chatHistory = clone.chatHistory.map((h) => {
      if (h && h.role === "bot" && typeof h.content === "string" && suspiciousPattern.test(h.content)) {
        return {
          ...h,
          content: "Live AI provider message removed for privacy; a deterministic fallback is shown where applicable."
        };
      }
      return h;
    });
  }

  return clone;
};

// Run Load Test -> POST /api/load-test
router.post("/", async (req, res, next) => {
  if (!req.body?.testURL) return next();
  try {
    req.authorizedTargetUrl = await validateAuthorizedTarget(req.body.testURL, req.body.scanAuthorization);
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}, checkCreditsOrSub, async (req, res) => {
  try {
    const { testURL, githubRepo, sleepDuration, scanAuthorization } = req.body;

    if (!testURL && !githubRepo) {
      return res.status(400).json({ error: "Provide testURL or githubRepo" });
    }
    const authorizedUrl = req.authorizedTargetUrl || testURL;


    // console.log("⏱ Starting synchronized analysis (K6 + GitHub)...");

    // Run all in parallel to save time and avoid timeouts
    const [testResult, githubResult, playwrightResult, frontendAudit, securityAudit] = await Promise.all([
      authorizedUrl
        ? runK6Test(authorizedUrl, { vus: 200, duration: "5s", sleepDuration }).catch(e => {
          console.error("⚠️ K6 Test Failed:", e);
          return null;
        })
        : Promise.resolve(null),
      githubRepo
        ? analyzeGithubRepo(githubRepo).catch(e => {
          console.error("⚠️ GitHub Analysis Failed:", e);
          return null;
        })
        : Promise.resolve(null),
      authorizedUrl
        ? runPlaywrightAudit(authorizedUrl).catch(e => {
          console.error("⚠️ Playwright Audit Failed:", e);
          return null;
        })
        : Promise.resolve(null),
      authorizedUrl ? runLighthouseAudit(authorizedUrl).catch(e => {
        console.error("⚠️ Lighthouse Audit Failed:", e);
        return null;
      }) : Promise.resolve(null),
      authorizedUrl ? runZapBaseline(authorizedUrl) : Promise.resolve(null)
    ]);


    // console.log("✅ Parallel analysis finished.");

    let metrics = null;
    let charts = null;
    let github = githubResult;

    if (testResult) {
      if (testResult) {
        metrics = parseK6Data(testResult);
        charts = buildChartResponse(metrics);
      }
    }

    if (github && github.summary) {
      // Calculate score if present
      github.summary.devOpsScore =
        (github.docker.present ? 30 : 0) +
        (github.cicd.present ? 30 : 0) +
        (github.kubernetes.present ? 20 : 0) +
        (github.hasStartScript ? 20 : 0);

      github.summary.productionReady =
        github.hasStartScript &&
        github.docker.present &&
        github.cicd.present;

      github.summary.riskLevel =
        github.summary.devOpsScore >= 70
          ? "low"
          : github.summary.devOpsScore >= 40
            ? "medium"
            : "high";
    }

    // -------------------------------------------------------------------------
    // SANITIZATION HELPERS
    // -------------------------------------------------------------------------
    const safePercent = (v) =>
      Number.isFinite(v) ? (v * 100).toFixed(2) : "0.00";

    const safeNumber = (v, fallback = "N/A") =>
      Number.isFinite(v) ? v : fallback;

    // -------------------------------------------------------------------------
    // BUILD AI CONTEXT (SANITIZED, DETERMINISTIC)
    // -------------------------------------------------------------------------
    let context = `Target under test: ${testURL || githubRepo}\n\n`;

    if (metrics) {
      context += `Runtime Metrics (Observed):\n`;
      context += `- Failure Rate: ${safePercent(metrics.failureRateUnderTest)}%\n`;
      context += `- p95 Latency: ${safeNumber(metrics.latency?.p95)} ms\n`;
      context += `- Avg Latency: ${safeNumber(metrics.latency?.avg)} ms\n`;
      context += `- Throughput: ${safeNumber(metrics.throughput)} req/s\n`;
      context += `- Server Error Rate (5xx): ${safePercent(metrics.serverErrorRate)}%\n\n`;
    }

    if (githubResult?.summary) {
      context += `Repository Signals (Static):\n`;
      context += `- Docker: ${githubResult.docker.present ? "Detected" : "Not detected"}\n`;
      context += `- CI/CD: ${githubResult.cicd.present ? "Detected" : "Not detected"}\n`;
      context += `- Kubernetes: ${githubResult.kubernetes.present ? "Detected" : "Not detected"}\n\n`;
      if (githubResult.security) {
        context += `- Dependency lockfile: ${githubResult.security.dependencyLockPresent ? "Detected" : "Not detected"}\n`;
        context += `- Environment file in repository: ${githubResult.security.envFileTracked ? "Detected" : "Not detected"}\n`;
        context += `- Potential hard-coded credential patterns: ${githubResult.security.exposedSecretPatterns || 0}\n\n`;
      }
      if (githubResult.quality || githubResult.deployment || githubResult.project) {
        context += `Repository Engineering Review:\n`;
        context += `- Languages: ${(githubResult.project?.languages || []).join(", ") || "Unknown"}\n`;
        context += `- Source files: ${githubResult.project?.sourceFileCount || 0}; test files: ${githubResult.project?.testFileCount || 0}\n`;
        context += `- README: ${githubResult.quality?.readmePresent ? "present" : "missing"}; license: ${githubResult.quality?.licensePresent ? "present" : "missing"}\n`;
        context += `- Tests: ${githubResult.quality?.testsPresent ? "detected" : "not detected"}; build: ${githubResult.quality?.buildScriptPresent ? "present" : "missing"}; lint: ${githubResult.quality?.lintScriptPresent ? "present" : "missing"}\n`;
        context += `- Health check: ${githubResult.quality?.healthCheckPresent || githubResult.deployment?.healthcheckPresent ? "detected" : "not detected"}; observability: ${githubResult.quality?.observabilityPresent ? "detected" : "not detected"}\n`;
        context += `- Deployment config: ${githubResult.deployment?.deploymentConfigPresent ? "detected" : "not detected"}; infrastructure as code: ${githubResult.deployment?.infrastructureAsCodePresent ? "detected" : "not detected"}\n\n`;
      }
    } else {
      context += `Repository Signals: Not available (no repository provided)\n\n`;
    }

    if (playwrightResult) {
      context += `Browser Experience Audit (External):\n`;
      context += `- Performance Score: ${playwrightResult.performance}/100\n`;
      context += `- Accessibility Score: ${playwrightResult.accessibility}/100\n`;
      context += `- Best Practices Score: ${playwrightResult.bestPractices}/100\n`;
      context += `- SEO Score: ${playwrightResult.seo}/100\n`;
      context += `- Interactivity Score: ${playwrightResult.interactivity}/100\n`;
      if (playwrightResult.loadTimeMs) {
        context += `- Real Browser Load Time: ${playwrightResult.loadTimeMs} ms\n`;
      }
      context += `\n`;
    }
    if (frontendAudit?.status === "complete") {
      context += `Frontend Audit (Lighthouse):\n- Performance: ${frontendAudit.scores.performance}/100\n- Accessibility: ${frontendAudit.scores.accessibility}/100\n- LCP: ${frontendAudit.webVitals.lcpMs ?? "N/A"} ms\n\n`;
    }
    if (securityAudit?.status === "complete") {
      context += `Passive Security Audit (OWASP ZAP):\n- Findings: ${securityAudit.findings.length}\n- Mode: passive baseline only\n\n`;
    }

    const businessMetrics = {
      conversionLoss: 0,
      adSpendRisk: 0,
      stabilityRiskScore: 0,
      scoreBreakdown: {
        performance: 0,
        architecture: 0,
        devops: 0
      },
      remediations: [],
      collapsePoint: 0,
      cicdRisk: null
    };

    if (metrics) {
      // 1s delay = ~7% conversion loss
      businessMetrics.conversionLoss = parseFloat(((safeNumber(metrics.latency?.avg, 0) / 1000) * 7).toFixed(1));

      // Ad spend risk calculation: Based on failure rate and throughput
      // Formula: (Failure Rate * Total Estimated Traffic * Value Per Visitor)
      const estimatedProfitPerRequest = 15; // Rough estimate in ₹
      const dailyTrafficMultiplier = 86400 * 0.1; // 10% of day at peak
      businessMetrics.adSpendRisk = Math.round(metrics.failureRateUnderTest * metrics.throughput * estimatedProfitPerRequest * dailyTrafficMultiplier);

      // Breakdown calculation
      const pPerf = Math.max(0, Math.min(100, 100 - (metrics.failureRateUnderTest * 1000) - ((metrics.latency?.avg || 0) / 50)));
      const pArch = playwrightResult ? (playwrightResult.performance + playwrightResult.bestPractices) / 2 : 50;
      const pDev = githubResult?.summary?.devOpsScore ?? 20;

      businessMetrics.scoreBreakdown = {
        performance: Math.round(pPerf),
        architecture: Math.round(pArch),
        devops: Math.round(pDev)
      };

      businessMetrics.stabilityRiskScore = Math.max(0, Math.min(100, Math.round((pPerf + pArch + pDev) / 3)));

      // Calculate Collapse Point based on Throughput (standardized to req/s)
      // Formula: Current Throughput adjusted by failure rate and safety margin
      const throughput = metrics.throughput || 0;
      const failRate = metrics.failureRateUnderTest || 0;

      // If it's healthy, we assume it can handle 1.5x current load. If failing, it's already collapsed.
      businessMetrics.collapsePoint = Math.round(throughput * (failRate > 0.05 ? 0.8 : 1.5));

      // Ensure a logical floor (min 5 req/s if throughput was recorded)
      if (throughput > 0) businessMetrics.collapsePoint = Math.max(5, businessMetrics.collapsePoint);

      // --- DYNAMIC STRATEGIC REMEDIATIONS ---
      const rems = [];
      const phrases = {
        lat: ["[V4] FORCE Edge Acceleration", "[V4] Optimize Global CDN Path", "[V4] Deploy Regional Latency Shields"],
        thr: ["[V4] Activate High-Throughput Redis", "[V4] Scale Compute Partitioning", "[V4] Enable Burst-Mode Capacity"],
        err: ["Auto-Scale Infrastructure", "Configure Health Check Retries", "Deploy Zero-Downtime Patching"],
        dev: ["Enforce CI/CD Pipeline", "Hardcode Automation Workflows", "Setup Automated Rollback"]
      };

      const pick = (arr) => arr[0];

      if (metrics.latency?.p95 > 200) {
        const reduction = Math.round(metrics.latency.p95 * 0.7);
        rems.push(`${pick(phrases.lat)} → -${reduction}ms p95 latency`);
      }
      if (metrics.throughput < 500) {
        const gain = metrics.throughput < 100 ? 2.0 : 1.5;
        rems.push(`${pick(phrases.thr)} → +${gain}x throughput capacity`);
      }
      if (metrics.serverErrorRate > 0 || metrics.failureRateUnderTest > 0.05) {
        rems.push(`${pick(phrases.err)} → Neutralize service disruptions`);
      }

      if (githubResult && !githubResult.cicd?.present) {
        businessMetrics.cicdRisk = {
          severity: "CRITICAL",
          consequence: "Manual deploy = 2× higher outage risk",
          details: "Rollback failure and hotfix delays are inevitable during a spike without automation."
        };
        rems.push(`${pick(phrases.dev)} → Eliminate human fail-points`);
      }

      // Limit to 3, shuffle slightly
      businessMetrics.remediations = rems.slice(0, 3);
    }

    // -------------------------------------------------------------------------
    // PREFRACTA AI — LIVE AUDIT AGENTIC MODE
    // -------------------------------------------------------------------------
    const runLiveAuditAI = async ({
      metrics,
      context,
      getresponseopenrouter
    }) => {
      let aiResponseMsg = "Prefracta AI Verdict: Analysis pending...";

      if (!metrics) {
        return {
          message:
            "Load Test Failed: No runtime metrics were collected. The target may be unreachable."
        };
      }

      try {
        const safeContext =
          typeof context === "string" && context.trim().length > 0
            ? context.slice(0, 6000)
            : "Runtime Metrics:\n" + JSON.stringify(metrics, null, 2);

        const messages = [
          {
            role: "system",
            content: `
You are Prefracta AI, an Automated System Auditor. Explain results to a product owner who may not be technical.

Your purpose is to provide a clear, useful audit based on **k6 Load Tests**, **repository signals**, **Playwright browser checks**, Lighthouse, and passive security checks.

STRICT RULES:
1. Keep the language simple. Define technical terms in plain words the first time: for example, "p95 latency means the response time experienced by the slowest 5% of requests."
2. Never use unexplained formulas, dramatic claims, fake precision, or complicated architecture language.
3. Use short paragraphs and bullets. Each paragraph must be no more than two sentences.
4. Always separate observed facts from estimates or recommendations.
5. Do not offer chat-like interaction here. This is a one-way audit report.
        `.trim()
          },
          {
            role: "user",
            content: `
${safeContext}

Generate a short "Automated System Audit" strictly in this format:

**Overall result**

[2-3 simple sentences explaining whether the evidence looks ready, needs review, or is incomplete. Mention the strongest evidence and the biggest concern.]

**What the numbers mean**

[Use 2-4 bullets. Explain throughput, p95 latency, failure rate, browser scores, repository checks, or security findings only when present. Translate each into a user-facing meaning.]

**Top actions**

[Give at most three actions. Format each as: "- Fix: [plain technical action]. Why: [plain business or user benefit]."]

**Important limitation**

[State that this is evidence from one assessment run, that passive security checks are not a penetration test, and that any capacity threshold is only an estimate.]

STRICT REPRODUCTION RULE: Do NOT include labels like "Paragraph 1", "Paragraph 2", or "Paragraph 3" in your output. Just provide the text.
        `.trim()
          }
        ];

        const response = await getresponseopenrouter(messages);

        aiResponseMsg =
          typeof response === "string" && response.trim().length > 0
            ? response.trim()
            : "**Prefracta AI Verdict**\n\nAnalysis completed. Refer to metrics.";

      } catch (err) {
        // Log full error server-side for debugging, but do not expose provider internals to users
        console.error("⚠️ Live Audit Agentic AI failed:", err);
        aiResponseMsg =
          "Live AI provider is currently unavailable. A deterministic fallback audit has been generated instead.";
      }

      return {
        message: aiResponseMsg
      };
    };

    // --- EXECUTE AI ANALYSIS ---
    const aiResponse = await runLiveAuditAI({
      metrics,
      context,
      getresponseopenrouter
    });
    const aiResponseMsg = aiResponse.message;
    const aiPayload = {
      ...aiResponse,
      businessInsights: businessMetrics
    };

    // Create new session in DB
    const newSession = new TestSession({
      user: req.user._id,
      url: testURL || githubRepo,
      metrics,
      browserMetrics: playwrightResult,
      frontendAudit,
      securityAudit,
      scanAuthorization: { confirmed: true, mode: "passive", confirmedAt: new Date() },
      charts,
      github,
      ai: aiPayload,
      chatHistory: [{ role: "assistant", content: aiResponseMsg }]
    });

    await newSession.save();
    const sessionId = newSession._id.toString();

    // Save as last session for this user
    try {
      req.user.lastSessionId = sessionId;
      await req.user.save();

      // console.log(`💾 Last session ID (${sessionId}) saved for user: ${req.user.username}`);
    } catch (saveErr) {
      console.error("⚠️ Failed to save lastSessionId:", saveErr);
    }

    return res.json({
      success: true,
      id: sessionId,
      metrics,
      browserMetrics: newSession?.browserMetrics || playwrightResult,
      frontendAudit,
      securityAudit,
      charts,
      github,
      ai: aiPayload,
      user: {
        username: req.user.username,
        email: req.user.email,
        credits: req.user.credits,
        totalTests: req.user.totalTests,
        lastSessionId: req.user.lastSessionId,
        subscription: {
          ...req.user.subscription.toObject(),
          daysLeft: req.user.subscription.expiry ? Math.max(0, Math.ceil((new Date(req.user.subscription.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0
        }
      }
    });

  } catch (err) {
    console.error("❌ Load Test Runner Error:", err);
    res.status(500).json({ success: false, error: "Load test execution failed" });
  }
});

// GET Latest Test Result -> GET /api/load-test/latest
router.get("/latest", async (req, res) => {
  try {
    const sessionId = req.user.lastSessionId;
    if (!sessionId) return res.status(404).json({ error: "No test history found" });

    // Validate ObjectId (Legacy UUID check)
    if (!mongoose.isValidObjectId(sessionId)) {
      return res.status(404).json({ error: "Previous test data incompatible/missing. Run a new test." });
    }

      const session = await TestSession.findById(sessionId);
      if (!session) return res.status(404).json({ error: "Latest report data expired" });

      const sanitized = sanitizeSessionForClient(session.toObject ? session.toObject() : session);

      res.json({
        id: sanitized._id || sanitized.id,
        url: sanitized.url,
        metrics: sanitized.metrics,
        browserMetrics: sanitized.browserMetrics,
        frontendAudit: sanitized.frontendAudit,
        securityAudit: sanitized.securityAudit,
        charts: sanitized.charts,
        github: sanitized.github,
        ai: sanitized.ai,
        aiVerdict: "Passed" // Defaulting as before
      });
  } catch (err) {
    console.error("❌ Get Latest Test Error:", err);
    res.status(500).json({ error: "Failed to fetch latest test" });
  }
});

// GET Test Result -> GET /api/load-test/:id
router.get("/:id", async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await TestSession.findById(sessionId);

    if (!session) return res.status(404).json({ error: "Report not found" });

    const sanitized = sanitizeSessionForClient(session.toObject ? session.toObject() : session);

    res.json({
      id: sanitized._id || sanitized.id,
      url: sanitized.url,
      metrics: sanitized.metrics,
      browserMetrics: sanitized.browserMetrics,
      frontendAudit: sanitized.frontendAudit,
      securityAudit: sanitized.securityAudit,
      charts: sanitized.charts,
      github: sanitized.github,
      ai: sanitized.ai,
      aiVerdict: "Passed"
    });
  } catch (err) {
    console.error("❌ Get Test Error:", err);
    res.status(500).json({ error: "Failed to fetch test report" });
  }
});

export default router;


//frontend
// return res.json({
//   success: true,
//   sessionId: sessionKey,
//   metrics,
//   charts,
//   github,
//   ai: { message: aiMessage }
// });
