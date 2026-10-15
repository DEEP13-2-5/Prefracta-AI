import lighthouse from "lighthouse";
import { launch as launchChrome } from "chrome-launcher";
import { chromium } from "playwright";

export const runLighthouseAudit = async (url) => {
  let chrome;
  try {
    chrome = await launchChrome({
      chromePath: chromium.executablePath(),
      chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
    });
    const result = await lighthouse(url, { port: chrome.port, output: "json", onlyCategories: ["performance", "accessibility", "best-practices", "seo"], formFactor: "desktop", screenEmulation: { disabled: true } });
    const audits = result?.lhr?.audits || {};
    const score = (id) => Math.round((result?.lhr?.categories?.[id]?.score ?? 0) * 100);
    const metric = (id) => audits[id]?.numericValue ?? null;
    const findings = Object.values(audits).filter((item) => item.scoreDisplayMode === "numeric" && typeof item.score === "number" && item.score < .9).sort((a, b) => a.score - b.score).slice(0, 8).map((item) => ({ id: item.id, title: item.title, score: Math.round(item.score * 100), detail: item.displayValue || item.description }));
    return { source: "lighthouse", status: "complete", scores: { performance: score("performance"), accessibility: score("accessibility"), bestPractices: score("best-practices"), seo: score("seo") }, webVitals: { fcpMs: metric("first-contentful-paint"), lcpMs: metric("largest-contentful-paint"), cls: metric("cumulative-layout-shift"), tbtMs: metric("total-blocking-time") }, findings };
  } catch (error) {
    console.warn("Lighthouse unavailable:", error.message);
    return { source: "lighthouse", status: "unavailable", reason: "Lighthouse could not run in this environment.", findings: [] };
  } finally { if (chrome) await chrome.kill(); }
};
