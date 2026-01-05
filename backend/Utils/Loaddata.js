/**
 * loaddata.js
 * Single data-adapter for load testing outputs
 * - k6: ACTIVE
 * - Azure Load Testing: COMMENTED (ready for switch)
 */

export const parseK6Data = (raw) => {
  if (!raw || !raw.metrics || Object.keys(raw.metrics).length === 0) {
    return {
      throughput: 0,
      failureRateUnderTest: 0,
      latency: { p50: null, p95: null, p99: null, avg: null, max: null },
      vus: 0,
      totalRequests: 0,
      duration: null,
    };
  }

  // Normalize metric access (k6 versions differ)
  const getMetric = (name) =>
    raw.metrics[name]?.values || raw.metrics[name] || {};

  const http = getMetric("http_req_duration");
  const reqs = getMetric("http_reqs");
  const failed = getMetric("http_req_failed");
  const vus = getMetric("vus");

  const totalRequests = reqs.count || 0;

  // ---------------------------------------------------------
  // FAILURE RATE (SINGLE SOURCE OF TRUTH)
  // http_req_failed includes:
  // - HTTP 4xx / 5xx
  // - Network / timeout / blocked failures
  // ---------------------------------------------------------
  let failureRateUnderTest = 0;

  if (typeof failed.rate === "number") {
    failureRateUnderTest = failed.rate;
  } else if (typeof failed.count === "number" && totalRequests > 0) {
    failureRateUnderTest = failed.count / totalRequests;
  }

  return {
    latency: {
      avg: Number.isFinite(http.avg) ? http.avg : null,
      p50: http["p(50)"] ?? http.med ?? null,
      p95: http["p(95)"] ?? null,
      p99: http["p(99)"] ?? null,
      max: Number.isFinite(http.max) ? http.max : null,
    },

    throughput: Number.isFinite(reqs.rate) ? reqs.rate : 0,
    totalRequests,

    // IMPORTANT:
    // This represents *any* request failure under load
    failureRateUnderTest,

    // Frontend compatibility helpers (Flattened)
    p50: http["p(50)"] ?? http.med ?? 0,
    p95: http["p(95)"] ?? 0,
    errorRate: `${(failureRateUnderTest * 100).toFixed(2)}%`,

    vus: vus.value ?? vus.max ?? 0,
    duration: raw.state?.testRunDurationMs ?? null,
  };
};

/* ===========================
   AZURE PARSER (COMMENTED)
   =========================== */
/*
export const parseAzureData = (azureResult) => {
  return {
    latency: {
      p50: azureResult.metrics.latency.p50,
      p95: azureResult.metrics.latency.p95,
      p99: azureResult.metrics.latency.p99,
    },
    throughput: azureResult.metrics.throughput,
    failureRateUnderTest: azureResult.metrics.errorRate,
    vus: azureResult.metrics.virtualUsers,
    duration: azureResult.testDuration,
  };
};
*/

/* ===========================
   CHART FORMATTER
   =========================== */
export const buildChartResponse = (metrics) => {
  const labels = [];
  const data = [];

  if (metrics.latency.p50 != null) {
    labels.push("p50");
    data.push(metrics.latency.p50);
  }

  if (metrics.latency.p95 != null) {
    labels.push("p95");
    data.push(metrics.latency.p95);
  }

  if (metrics.latency.p99 != null) {
    labels.push("p99");
    data.push(metrics.latency.p99);
  }

  return {
    labels,
    datasets: [
      {
        label: "Latency (ms)",
        data,
      },
    ],
  };
};

/* ===========================
   PIE CHART FORMATTER (Health)
   =========================== */
export const buildPieChartData = (metrics) => {
  const failRate = metrics.failureRateUnderTest || 0;
  const successRate = 1 - failRate;

  return [
    { name: "Successful Responses (2xx)", value: Number((successRate * 100).toFixed(2)), color: "#2563eb" },
    { name: "Failed Requests (Blocked / Rejected / 5xx)", value: Number((failRate * 100).toFixed(2)), color: "#f59e0b" },
    { name: "Server Errors (5xx)", value: 0, color: "#ef4444" }, // Detailed split requires more k6 tags
  ];
};

/* ===========================
   AI CONTEXT BUILDER
   =========================== */
export const buildAIContext = (metrics) => {
  const safeNumber = (value, fallback = "N/A") =>
    Number.isFinite(value) ? value : fallback;

  const safePercent = (value) =>
    Number.isFinite(value) ? (value * 100).toFixed(2) : "0.00";

  const p95 = safeNumber(metrics?.latency?.p95);
  const failureRatePct = safePercent(metrics?.failureRateUnderTest);

  return {
    summary: `Load test completed with p95 latency of ${p95} ms and failure rate of ${failureRatePct}%.`,

    // Do NOT prefill AI output
    message: null,

    context: `System Analysis (Observed Runtime Metrics):
- Throughput: ${safeNumber(metrics?.throughput)} req/s
- Failure Rate: ${failureRatePct}%
- p95 Latency: ${p95} ms
- Note: Latency and throughput reflect response timing, not request success`,

    duration: metrics?.duration ?? null,
  };
};
