import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { runGitleaksScan } from "../Runners/securityRunner.js";

function execPromise(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) reject(stderr || err.message);
      else resolve(stdout);
    });
  });
}

export const analyzeGithubRepo = async (repoUrl) => {
  const tempDir = path.join(os.tmpdir(), `repo-${Date.now()}`);

  const metrics = {
    repository: { name: path.basename(repoUrl.replace(/\.git$/, "").replace(/\/$/, "")), branch: "default" },
    project: { languages: [], sourceFileCount: 0, testFileCount: 0, documentationPresent: false, licensePresent: false },
    framework: "Unknown",
    hasStartScript: false,
    database: "None",
    dependencyCount: 0,

    docker: { present: false, hasCMD: false, exposesPort: false },
    kubernetes: { present: false, type: null },
    cicd: { present: false },
    security: {
      gitignorePresent: false,
      envFileTracked: false,
      dependencyLockPresent: false,
      securityMiddlewareDetected: false,
      exposedSecretPatterns: 0,
      securityPolicyPresent: false,
    },
    quality: {
      testsPresent: false,
      testScriptPresent: false,
      lintScriptPresent: false,
      formatScriptPresent: false,
      typecheckScriptPresent: false,
      buildScriptPresent: false,
      healthCheckPresent: false,
      observabilityPresent: false,
      envExamplePresent: false,
      configExternalized: false,
      readmePresent: false,
      lockfilePresent: false,
      licensePresent: false,
    },
    deployment: {
      dockerComposePresent: false,
      deploymentConfigPresent: false,
      infrastructureAsCodePresent: false,
      healthcheckPresent: false,
    },

    issues: [],
    summary: {
      productionReady: false,
      devOpsScore: 0,
      riskLevel: "high",
    },
  };

  try {
    let retries = 2;
    while (retries > 0) {
      try {
        await execPromise(
          `git clone --depth 1 --filter=blob:none ${repoUrl} ${tempDir}`
        );
        break;
      } catch (e) {
        retries--;
        if (retries === 0) throw e;
        // console.log(`🔄 [Analyzer] Clone failed, retrying... (${retries} left)`);
        await new Promise(r => setTimeout(r, 2000)); // wait 2s
      }
    }

    // --- SEARCH HELPERS ---
    const findFile = (name) => {
      // Check root first
      let rootPath = path.join(tempDir, name);
      if (fs.existsSync(rootPath)) return rootPath;

      // Look in subdirectories (1 level deep)
      const subdirs = fs.readdirSync(tempDir).filter(f => {
        try {
          return fs.statSync(path.join(tempDir, f)).isDirectory() && !f.startsWith('.');
        } catch (e) { return false; }
      });
      for (const dir of subdirs) {
        let subPath = path.join(tempDir, dir, name);
        if (fs.existsSync(subPath)) {
          // console.log(`🔍 [Analyzer] Found ${name} in ${dir}/`);
          return subPath;
        }
      }
      // console.log(`⚠️ [Analyzer] ${name} NOT found in root or 1st-level subdirs.`);
      return null;
    };

    const gitleaks = await runGitleaksScan(tempDir);
    metrics.security.gitleaks = gitleaks;
    if (gitleaks.status === "complete" && gitleaks.findings.length > 0) {
      metrics.issues.push(`Gitleaks detected ${gitleaks.findings.length} potential secret(s)`);
    }

    const pkgPath = findFile("package.json");
    if (pkgPath) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

      metrics.dependencyCount = Object.keys(deps).length;
      metrics.hasStartScript = Boolean(pkg.scripts?.start || pkg.scripts?.dev);
      metrics.quality.testScriptPresent = Boolean(pkg.scripts?.test);
      metrics.quality.lintScriptPresent = Boolean(pkg.scripts?.lint);
      metrics.quality.formatScriptPresent = Boolean(pkg.scripts?.format || pkg.scripts?.prettier);
      metrics.quality.typecheckScriptPresent = Boolean(pkg.scripts?.typecheck || pkg.scripts?.["type-check"] || pkg.scripts?.check);
      metrics.quality.buildScriptPresent = Boolean(pkg.scripts?.build);

      if (deps.express) metrics.framework = "Express";
      else if (deps.next) metrics.framework = "Next.js";
      else if (deps["@nestjs/core"]) metrics.framework = "NestJS";

      if (deps.mongoose) metrics.database = "MongoDB";
      else if (deps.pg) metrics.database = "Postgres";
      else if (deps.mysql2) metrics.database = "MySQL";

      if (!metrics.hasStartScript) metrics.issues.push("Missing start/dev script");
      if (!metrics.quality.testScriptPresent && !metrics.quality.testsPresent) metrics.issues.push("No automated tests or test script detected");
      if (!metrics.quality.buildScriptPresent) metrics.issues.push("Build script missing");
    } else {
      metrics.issues.push("package.json missing");
    }

    // Baseline repository security signals. This is intentionally a lightweight
    // configuration review, not a penetration test or a secrets-management scan.
    const rootEntries = fs.readdirSync(tempDir);
    const allFiles = [];
    const collectAllFiles = (dir, depth = 0) => {
      if (depth > 4) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) collectAllFiles(fullPath, depth + 1);
        else allFiles.push(fullPath);
      }
    };
    collectAllFiles(tempDir);
    const fileNames = allFiles.map(file => path.relative(tempDir, file).replaceAll(path.sep, "/"));
    metrics.security.gitignorePresent = fs.existsSync(path.join(tempDir, ".gitignore"));
    metrics.security.dependencyLockPresent = rootEntries.some(name =>
      ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb"].includes(name)
    );
    metrics.security.envFileTracked = rootEntries.some(name => /^\.env($|\.)/.test(name));
    metrics.security.securityPolicyPresent = fileNames.some(name => /(^|\/)(SECURITY|security)\.(md|txt)$/i.test(name));
    metrics.quality.readmePresent = fileNames.some(name => /(^|\/)readme(\.md|\.txt)?$/i.test(name));
    metrics.quality.licensePresent = fileNames.some(name => /(^|\/)license(\.|$)/i.test(name));
    metrics.quality.envExamplePresent = fileNames.some(name => /(^|\/)\.env\.(example|sample|template)$/i.test(name));
    metrics.quality.lockfilePresent = metrics.security.dependencyLockPresent;
    metrics.quality.documentationPresent = metrics.quality.readmePresent;
    metrics.quality.configExternalized = fileNames.some(name => /(config|settings|\.env)/i.test(name));
    metrics.deployment.dockerComposePresent = fileNames.some(name => /(^|\/)(docker-compose|compose)(\.[^/]+)?\.ya?ml$/i.test(name));
    metrics.deployment.deploymentConfigPresent = fileNames.some(name => /(^|\/)(render|vercel|netlify|fly|railway|Procfile)/i.test(name));
    metrics.deployment.infrastructureAsCodePresent = fileNames.some(name => /\.(tf|bicep|tfvars)$/i.test(name) || /(^|\/)(terraform|infra|infrastructure|iac)\//i.test(name));

    if (!metrics.security.gitignorePresent) metrics.issues.push(".gitignore missing");
    if (!metrics.security.dependencyLockPresent) metrics.issues.push("Dependency lockfile missing");
    if (metrics.security.envFileTracked) metrics.issues.push("Environment file found in repository");
    if (!metrics.quality.readmePresent) metrics.issues.push("README documentation missing");
    if (!metrics.quality.licensePresent) metrics.issues.push("License file missing");
    if (!metrics.quality.envExamplePresent) metrics.issues.push("No .env.example or configuration template found");

    const sourceFiles = [];
    const collectSourceFiles = (dir, depth = 0) => {
      if (depth > 2) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) collectSourceFiles(fullPath, depth + 1);
        else if (/\.(js|jsx|ts|tsx|mjs|cjs)$/i.test(entry.name)) sourceFiles.push(fullPath);
      }
    };
    collectSourceFiles(tempDir);
    metrics.project.sourceFileCount = sourceFiles.length;
    metrics.project.testFileCount = sourceFiles.filter(file => /(^|\/)(__tests__|test|tests|spec)(\/|\.|$)|\.(test|spec)\./i.test(file)).length;
    metrics.quality.testsPresent = metrics.project.testFileCount > 0;
    metrics.project.languages = [...new Set(sourceFiles.map(file => path.extname(file).slice(1).toLowerCase()).filter(Boolean))];
    const secretPattern = /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"'\s]{8,}["']/ig;
    for (const file of sourceFiles.slice(0, 250)) {
      const content = fs.readFileSync(file, "utf-8");
      if (/\bhelmet\s*\(/.test(content) || /content-security-policy/i.test(content)) {
        metrics.security.securityMiddlewareDetected = true;
      }
      metrics.security.exposedSecretPatterns += (content.match(secretPattern) || []).length;
    }
    if (metrics.security.exposedSecretPatterns > 0) {
      metrics.issues.push(`Potential hard-coded credential patterns found (${metrics.security.exposedSecretPatterns})`);
    }

    const dockerfilePath = findFile("Dockerfile");
    if (dockerfilePath) {
      metrics.docker.present = true;
      const dockerfile = fs.readFileSync(dockerfilePath, "utf-8");

      if (/CMD|ENTRYPOINT/i.test(dockerfile)) metrics.docker.hasCMD = true;
      else metrics.issues.push("Dockerfile missing CMD/ENTRYPOINT");

      if (/EXPOSE\s+\d+/i.test(dockerfile)) metrics.docker.exposesPort = true;
      else metrics.issues.push("Dockerfile missing EXPOSE");
      metrics.deployment.healthcheckPresent = /HEALTHCHECK/i.test(dockerfile);
    }

    metrics.quality.healthCheckPresent = sourceFiles.some(file => /health|readiness|liveness|actuator/i.test(file));
    metrics.quality.observabilityPresent = sourceFiles.some(file => /logger|logging|telemetry|opentelemetry|applicationinsights|sentry|prometheus/i.test(file));
    if (!metrics.quality.healthCheckPresent && !metrics.deployment.healthcheckPresent) metrics.issues.push("Health/readiness check not detected");
    if (!metrics.quality.observabilityPresent) metrics.issues.push("Observability or structured logging signals not detected");
    if (!metrics.quality.testScriptPresent && metrics.quality.testsPresent) metrics.issues.push("Tests detected but no test script found");
    if (!metrics.quality.lintScriptPresent) metrics.issues.push("Lint script missing");
    if (!metrics.security.securityMiddlewareDetected) metrics.issues.push("Security middleware or CSP signal not detected");

    // Check for workflows anywhere
    const findDir = (name) => {
      if (fs.existsSync(path.join(tempDir, ".github", name))) return true;
      const subdirs = fs.readdirSync(tempDir).filter(f => {
        try {
          return fs.statSync(path.join(tempDir, f)).isDirectory() && !f.startsWith('.');
        } catch (e) { return false; }
      });
      for (const dir of subdirs) {
        if (fs.existsSync(path.join(tempDir, dir, ".github", name))) return true;
      }
      return false;
    };

    if (findDir("workflows")) {
      metrics.cicd.present = true;
    } else {
      metrics.issues.push("CI/CD pipeline missing");
    }

    const k8sDirs = ["k8s", "manifests", "deploy", "deployment"];
    const hasK8s = k8sDirs.some(dir => {
      if (fs.existsSync(path.join(tempDir, dir))) return true;
      const subdirs = fs.readdirSync(tempDir).filter(f => {
        try {
          return fs.statSync(path.join(tempDir, f)).isDirectory() && !f.startsWith('.');
        } catch (e) { return false; }
      });
      return subdirs.some(sd => fs.existsSync(path.join(tempDir, sd, dir)));
    });

    if (hasK8s) {
      metrics.kubernetes.present = true;
      metrics.kubernetes.type = "raw";
    }

    if (fs.existsSync(path.join(tempDir, "Chart.yaml"))) {
      metrics.kubernetes.present = true;
      metrics.kubernetes.type = "helm";
    }

    metrics.summary.devOpsScore =
      (metrics.docker.present ? 30 : 0) +
      (metrics.cicd.present ? 30 : 0) +
      (metrics.kubernetes.present ? 20 : 0) +
      (metrics.hasStartScript ? 20 : 0);

    metrics.summary.productionReady =
      metrics.hasStartScript && metrics.docker.present && metrics.cicd.present;

    metrics.summary.riskLevel =
      metrics.summary.devOpsScore >= 70
        ? "low"
        : metrics.summary.devOpsScore >= 40
          ? "medium"
          : "high";

    return metrics;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
};
