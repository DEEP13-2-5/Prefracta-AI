import express from "express";
import mongoose from "mongoose";
import { runK6Test } from "../Runners/k6runner.js";
import { runPlaywrightAudit } from "../Runners/playwrightRunner.js";
import { parseK6Data, buildChartResponse } from "../Utils/Loaddata.js";
import { analyzeGithubRepo } from "../Utils/githubAnalyzer.js";
import getresponseopenrouter from "../Utils/openrouter.js";
import { checkCreditsOrSub } from "../Middleware/authMiddleware.js";
import TestSession from "../Models/TestSession.js";

const router = express.Router();

// Run Load Test -> POST /api/load-test
router.post("/", checkCreditsOrSub, async (req, res) => {
  try {
    const { testURL, githubRepo } = req.body;

    if (!testURL && !githubRepo) {
      return res.status(400).json({ error: "Provide testURL or githubRepo" });
    }


    // console.log("⏱ Starting synchronized analysis (K6 + GitHub)...");

    // Run all in parallel to save time and avoid timeouts
    const [testResult, githubResult, playwrightResult] = await Promise.all([
      testURL
        ? runK6Test(testURL, { vus: 200, duration: "5s" }).catch(e => {
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
      testURL
        ? runPlaywrightAudit(testURL).catch(e => {
          console.error("⚠️ Playwright Audit Failed:", e);
          return null;
        })
        : Promise.resolve(null)
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
      const pPerf = Math.max(0, 100 - (metrics.failureRateUnderTest * 1000) - (metrics.latency?.avg / 50));
      const pArch = playwrightResult ? (playwrightResult.performance + playwrightResult.bestPractices) / 2 : 50;
      const pDev = githubResult?.summary?.devOpsScore || 20;

      businessMetrics.scoreBreakdown = {
        performance: Math.round(pPerf),
        architecture: Math.round(pArch),
        devops: Math.round(pDev)
      };

      businessMetrics.stabilityRiskScore = Math.round((pPerf + pArch + pDev) / 3);

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

      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

      if (metrics.latency?.p95 > 200) {
        const reduction = Math.round(metrics.latency.p95 * 0.7);
        rems.push(`${pick(phrases.lat)} → -${reduction}ms p95 latency`);
      }
      if (metrics.throughput < 500) {
        const gain = parseFloat((1.2 + Math.random() * 0.8).toFixed(1));
        rems.push(`${pick(phrases.thr)} → +${gain}x throughput capacity`);
      }
      if (metrics.serverErrorRate > 0 || metrics.failureRateUnderTest > 0.05) {
        rems.push(`${pick(phrases.err)} → Neutralize service disruptions`);
      }

      if (githubResult && !githubResult.cicd?.present) {
        businessMetrics.cicdRisk = {
          severity: "CRITICAL",
          consequence: `Manual deploy = ${Math.floor(Math.random() * 3) + 2}× higher outage risk`,
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
You are Prefracta AI, an Automated Strategic Auditor. Your tone is clinical, professional, and precise.

Your purpose is to provide a comprehensive AUTOMATED AUDIT based on **k6 Load Tests**, **DevOps Signals**, and **Playwright Audits**.

STRICT RULES:
1. IDENTITY: Always refer to this as an "Automated System Audit."
2. TONE: Objective and authoritative. 
3. FORMAT: Focus on high-level architecture and business impact.
4. LIMIT: Do not offer chat-like interaction here. This is a one-way audit report.
        `.trim()
          },
          {
            role: "user",
            content: `
${safeContext}

Generate the "Harsh Reality Executive Summary" strictly in this format:

**Prefracta AI Verdict**

[The Business Reality]
Map technical performance to conversion and revenue. Use the financial data (e.g., "At your current latency, you lose ~7% of conversions"). Tell them if they are burning money.

[The Actionable Remediation]
Provide specific technical fixes that lead to business gains. Format as: "Add [Feature] -> [Business Benefit]".

[The Collapse Point]
State exactly where the traffic breaks the system and the resulting business blackout.

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
        console.error("⚠️ Live Audit Agentic AI failed:", err);
        aiResponseMsg =
          "Prefracta AI could not generate the live audit.";
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

    // Create new session in DB
    const newSession = new TestSession({
      user: req.user._id,
      url: testURL || githubRepo,
      metrics,
      browserMetrics: playwrightResult,
      charts,
      github,
      ai: {
        ...aiResponse,
        businessInsights: businessMetrics
      },
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
      charts,
      github,
      ai: aiResponse,
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

    res.json({
      id: session._id,
      url: session.url,
      metrics: session.metrics,
      browserMetrics: session.browserMetrics,
      charts: session.charts,
      github: session.github,
      ai: session.ai,
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

    res.json({
      id: session._id,
      url: session.url,
      metrics: session.metrics,
      browserMetrics: session.browserMetrics,
      charts: session.charts,
      github: session.github,
      ai: session.ai,
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

