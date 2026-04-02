import express from "express";
import { analyzeGithubRepo } from "../Utils/githubAnalyzer.js";

const router = express.Router();

router.post("/github-test", async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl || !repoUrl.startsWith("https://github.com")) {
    return res.status(400).json({ error: "Valid GitHub repoUrl required" });
  }

  const isDemoMode = process.env.EXECUTION_MODE === "demo";

  if (isDemoMode) {
    console.log("🛠️ ENV: Demo Mode. Simulating GitHub analysis...");
    return res.json({
      success: true,
      metrics: {
        framework: "Express",
        hasStartScript: true,
        database: "MongoDB",
        dependencyCount: 15,
        docker: { present: true, hasCMD: true, exposesPort: true },
        kubernetes: { present: true, type: "raw" },
        cicd: { present: true },
        issues: [],
        summary: { productionReady: true, devOpsScore: 90, riskLevel: "low" }
      }
    });
  }

  try {
    const metrics = await analyzeGithubRepo(repoUrl);
    res.json({ success: true, metrics });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

export default router;
