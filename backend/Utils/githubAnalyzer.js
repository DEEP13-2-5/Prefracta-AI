import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

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
    framework: "Unknown",
    hasStartScript: false,
    database: "None",
    dependencyCount: 0,

    docker: { present: false, hasCMD: false, exposesPort: false },
    kubernetes: { present: false, type: null },
    cicd: { present: false },

    issues: [],
    summary: {
      productionReady: false,
      devOpsScore: 0,
      riskLevel: "high",
    },
  };

  try {
    await execPromise(
      `git clone --depth 1 --filter=blob:none ${repoUrl} ${tempDir}`
    );

    const pkgPath = path.join(tempDir, "package.json");

    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

      metrics.dependencyCount = Object.keys(deps).length;
      metrics.hasStartScript = Boolean(pkg.scripts?.start);

      if (deps.express) metrics.framework = "Express";
      else if (deps.next) metrics.framework = "Next.js";
      else if (deps["@nestjs/core"]) metrics.framework = "NestJS";

      if (deps.mongoose) metrics.database = "MongoDB";
      else if (deps.pg) metrics.database = "Postgres";
      else if (deps.mysql2) metrics.database = "MySQL";

      if (!metrics.hasStartScript) metrics.issues.push("Missing start script");
    } else {
      metrics.issues.push("package.json missing");
    }

    const dockerfilePath = path.join(tempDir, "Dockerfile");
    if (fs.existsSync(dockerfilePath)) {
      metrics.docker.present = true;
      const dockerfile = fs.readFileSync(dockerfilePath, "utf-8");

      if (/CMD|ENTRYPOINT/i.test(dockerfile)) metrics.docker.hasCMD = true;
      else metrics.issues.push("Dockerfile missing CMD/ENTRYPOINT");

      if (/EXPOSE\s+\d+/i.test(dockerfile)) metrics.docker.exposesPort = true;
      else metrics.issues.push("Dockerfile missing EXPOSE");
    }

    if (fs.existsSync(path.join(tempDir, ".github", "workflows"))) {
      metrics.cicd.present = true;
    } else {
      metrics.issues.push("CI/CD pipeline missing");
    }

    const k8sDirs = ["k8s", "manifests", "deploy", "deployment"];
    for (const dir of k8sDirs) {
      if (fs.existsSync(path.join(tempDir, dir))) {
        metrics.kubernetes.present = true;
        metrics.kubernetes.type = "raw";
        break;
      }
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
