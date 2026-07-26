import { chromium } from "playwright";

/**
 * Runs a real Playwright "Audit" (Performance, SEO, Best Practices)
 * @param {string} testURL - target URL
 */
export const runPlaywrightAudit = async (testURL, { forceSimulation = false } = {}) => {
    const mode = process.env.EXECUTION_MODE;
    const isDemo = mode === "demo" || forceSimulation === true;

    if (isDemo) {
        const mockResult = {
            performance: 82,
            accessibility: 92,
            bestPractices: 88,
            seo: 95,
            interactivity: 78,
            source: "demo",
            loadTimeMs: null,
        };
        return new Promise(resolve => setTimeout(() => resolve(mockResult), 1000));
    }

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();


        // console.log(`🚀 Starting real Playwright Audit for: ${testURL}`);

        // Performance measurement
        const startTime = Date.now();
        await page.goto(testURL, { waitUntil: "networkidle", timeout: 30000 });
        const loadTime = Date.now() - startTime;

        // Extract performance metrics
        const performanceMetrics = await page.evaluate(() => {
            const timing = window.performance.timing;
            return {
                domContentLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
                fullLoad: timing.loadEventEnd - timing.navigationStart,
            };
        });

        // Heuristic Audits
        const auditResults = await page.evaluate(() => {
            const getScore = (condition) => (condition ? 100 : 0);

            // 1. Accessibility Heuristics
            const images = Array.from(document.querySelectorAll("img"));
            const imagesWithAlt = images.filter(img => img.alt).length;
            const accessibilityScore = images.length > 0 ? (imagesWithAlt / images.length) * 100 : 100;

            // 2. SEO Heuristics
            const hasTitle = !!document.title;
            const hasMetaDesc = !!document.querySelector('meta[name="description"]');
            const seoScore = (getScore(hasTitle) + getScore(hasMetaDesc)) / 2;

            // 3. Best Practices
            const isHttps = window.location.protocol === "https:";
            const noConsoleErrors = true; // Placeholder for actual console log checking
            const bestPracticesScore = (getScore(isHttps) + 100) / 2; // Defaulting one to 100 for now

            return {
                accessibility: accessibilityScore,
                seo: seoScore,
                bestPractices: bestPracticesScore
            };
        });

        // Calculate Final Performance Score (Inverse mapping: lower load time -> higher score)
        // 0ms -> 100, 2000ms -> 80, 5000ms -> 40, 10000ms+ -> 0
        const performanceScore = Math.max(0, 100 - (loadTime / 100));
        const interactivityScore = Math.min(100, performanceScore + 5); // Simple proxy

        await browser.close();

        const finalResult = {
            performance: Number(performanceScore.toFixed(0)),
            accessibility: Number(auditResults.accessibility.toFixed(0)),
            bestPractices: Number(auditResults.bestPractices.toFixed(0)),
            seo: Number(auditResults.seo.toFixed(0)),
            interactivity: Number(interactivityScore.toFixed(0)),
            loadTimeMs: loadTime,
            source: "real"
        };


        // console.log("✅ Playwright Audit Complete:", finalResult);
        return finalResult;

    } catch (error) {
        console.error("❌ Playwright Audit Failed:", error.message);
        if (browser) await browser.close();
        return null;
    }
};
