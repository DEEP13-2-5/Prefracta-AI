import express from "express";
import mongoose from "mongoose";
import getresponseopenrouter from "../Utils/openrouter.js";
import { checkCreditsOrSub } from "../Middleware/authMiddleware.js";
import TestSession from "../Models/TestSession.js";

const router = express.Router();

// GET History
router.get("/chat/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.isValidObjectId(sessionId)) return res.json([]);

    const session = await TestSession.findById(sessionId);
    if (!session) return res.json([]);
    res.json(session.chatHistory || []);
  } catch (err) {
    console.error("❌ Get Chat History Error:", err);
    res.json([]);
  }
});

// Post Message
router.post("/", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId) return res.status(400).json({ error: "sessionId required" });

    const session = await TestSession.findById(sessionId);
    if (!session) return res.status(400).json({ error: "Session expired or not found" });

    // 🚨 REAL DATA GUARD REMOVED FOR DEMO
    // Allow chat to proceed even if metrics are low, so the 'Ask AI' feature always works.
    /*
    if (
      !session.metrics ||
      session.metrics.throughput === 0
    ) {
      return res.json({
        reply:
          "No traffic was recorded during this test run. As a result, there is no live performance data to reason over. Please run a longer or higher-load test to enable deeper analysis."
      });
    }
    */


    // Build Conversation Context
    const systemPrompt = "You are Xiomi, an automated Agentic AI developed for reliability testing. You are NOT a Mistral model. If asked 'who are you' or 'which AI are you', you MUST reply: 'I am Xiomi Agentic AI, running on the Xiaomi Mimo V2 Flash engine.' Do NOT mention being a large language model from any other provider. For technical questions, provide actionable engineering solutions. Be concise.";

    let metricsContext = `Analyze system at URL: ${session.url}.\n`;
    if (session.metrics) {
      metricsContext += `Metrics: Latency p95=${session.metrics.latency.p95}ms, Throughput=${session.metrics.throughput}req/s, ErrorRate=${(session.metrics.errorRate * 100).toFixed(2)}%.\n`;
    }
    if (session.github) {
      metricsContext += `Architecture: DevOps Score=${session.github.summary.devOpsScore}/100, Docker=${session.github.docker.present}, CI/CD=${session.github.cicd.present}.\n`;
    }

    // Construct full message history for AI
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: "Current System Telemetry: " + metricsContext },
      // Map previous history (limit to last 10 to fit context window if needed)
      ...(session.chatHistory || []).map(msg => ({
        role: msg.role === "bot" ? "assistant" : "user", // API expects 'assistant' not 'bot'
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    // Get actual AI response
    console.log("🤖 Requesting Agentic AI Insight for chat...");
    let reply = "Processing...";

    try {
      const aiResponse = await getresponseopenrouter(messages); // Pass full history
      if (aiResponse) {
        reply = aiResponse;
      } else {
        reply = "AI returned no content. The input data might be insufficient.";
      }
    } catch (aiError) {
      console.error("⚠️ OpenRouter API Failed:", aiError);
      reply = "Error connecting to AI service. Please check server logs.";
    }

    session.chatHistory = session.chatHistory || [];
    session.chatHistory.push({ role: "user", content: message });
    session.chatHistory.push({ role: "bot", content: reply });

    await session.save(); // Save history to DB

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat API Error:", err);
    res.status(500).json({ error: "AI reasoning failed" });
  }
});

export default router;
