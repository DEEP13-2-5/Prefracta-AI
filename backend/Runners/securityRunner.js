import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const execFileAsync = promisify(execFile);
const unavailable = (reason) => ({ tool: "OWASP ZAP Baseline", mode: "passive", status: "unavailable", reason, findings: [] });

const runHttpSecurityBaseline = async (url) => {
  const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30000) });
  const headers = response.headers;
  const requiredHeaders = [
    ["content-security-policy", "Content-Security-Policy header is missing"],
    ["strict-transport-security", "Strict-Transport-Security header is missing"],
    ["x-content-type-options", "X-Content-Type-Options header is missing"],
    ["x-frame-options", "X-Frame-Options header is missing"],
    ["referrer-policy", "Referrer-Policy header is missing"],
  ];
  const findings = requiredHeaders
    .filter(([name]) => !headers.get(name))
    .map(([name, title]) => ({
      tool: "HTTP Security Baseline",
      ruleId: `header-${name}`,
      severity: name === "content-security-policy" ? "medium" : "low",
      title,
      detail: `The target response did not include the ${name} response header.`,
      remediation: `Configure ${name} at the application, proxy, or CDN layer.`,
      instances: 1,
    }));
  return {
    tool: "HTTP Security Baseline",
    mode: "passive",
    status: "complete",
    source: "http-fallback",
    note: "Docker/ZAP was unavailable, so only response-header checks were performed.",
    findings,
  };
};

export const runZapBaseline = async (url) => {
  // The header baseline is safe and dependency-free. Enable ZAP explicitly because
  // Docker image downloads are slow and may not be available on hosted backends.
  if (process.env.SECURITY_SCANNER !== "zaproxy") {
    try {
      return await runHttpSecurityBaseline(url);
    } catch (error) {
      console.warn("HTTP security baseline unavailable:", error.message);
      return unavailable("The target could not be reached for the HTTP security baseline.");
    }
  }

  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "prefracta-zap-"));
  const reportPath = path.join(workDir, "zap.json");
  try {
    const mount = workDir + ":/zap/wrk:rw";
    try { await execFileAsync("docker", ["run", "--rm", "-v", mount, "ghcr.io/zaproxy/zaproxy:stable", "zap-baseline.py", "-t", url, "-J", "/zap/wrk/zap.json", "-m", "1"], { timeout: 180000, maxBuffer: 1024 * 1024 }); } catch (error) { console.warn("ZAP command returned:", error.message); }
    const report = JSON.parse(await fs.readFile(reportPath, "utf8"));
    const findings = (report.site?.[0]?.alerts || []).map((alert) => ({ tool: "OWASP ZAP Baseline", ruleId: alert.pluginid, severity: String(alert.riskdesc || "info").split(" ")[0].toLowerCase(), title: alert.alert, detail: alert.desc, remediation: alert.solution, instances: Number(alert.count || 0) }));
    return { tool: "OWASP ZAP Baseline", mode: "passive", status: "complete", findings };
  } catch (error) {
    console.warn("ZAP unavailable:", error.message);
    try {
      return await runHttpSecurityBaseline(url);
    } catch (fallbackError) {
      console.warn("HTTP security fallback unavailable:", fallbackError.message);
      return unavailable("Docker/ZAP and the HTTP security fallback were unavailable.");
    }
  } finally { await fs.rm(workDir, { recursive: true, force: true }); }
};

export const runGitleaksScan = async (repoDir) => {
  const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), "prefracta-gitleaks-"));
  const reportPath = path.join(outputDir, "report.json");
  try {
    try { await execFileAsync("docker", ["run", "--rm", "-v", repoDir + ":/repo:ro", "-v", outputDir + ":/out:rw", "ghcr.io/gitleaks/gitleaks:latest", "git", "--source", "/repo", "--report-format", "json", "--report-path", "/out/report.json", "--redact", "100"], { timeout: 180000, maxBuffer: 1024 * 1024 }); } catch (error) { console.warn("Gitleaks command returned:", error.message); }
    const report = JSON.parse(await fs.readFile(reportPath, "utf8"));
    return { tool: "Gitleaks", status: "complete", findings: report.map((item) => ({ tool: "Gitleaks", ruleId: item.RuleID, severity: "high", title: item.Description, file: item.File, line: item.StartLine, commit: item.Commit?.slice(0, 12) })) };
  } catch (error) {
    console.warn("Gitleaks unavailable:", error.message);
    return { tool: "Gitleaks", status: "unavailable", reason: "Docker/Gitleaks is unavailable or the scan did not complete.", findings: [] };
  } finally { await fs.rm(outputDir, { recursive: true, force: true }); }
};
