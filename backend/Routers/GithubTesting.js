import express from "express";
import { analyzeGithubRepo } from "../Utils/githubAnalyzer.js";

const router = express.Router();

router.post("/github-test", async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl || !repoUrl.startsWith("https://github.com")) {
    return res.status(400).json({ error: "Valid GitHub repoUrl required" });
  }

  try {
    const metrics = await analyzeGithubRepo(repoUrl);
    res.json({ success: true, metrics });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

export default router;
