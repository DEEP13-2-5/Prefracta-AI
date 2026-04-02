# Prefracta AI — Launch Intelligence Platform

**Prefracta AI** is a **B2B SaaS launch‑intelligence platform** that helps engineering teams and startups answer a single question:

> **“Is this product safe to launch — yes or no?”**

It combines **load testing (k6)**, **real‑browser audits (Playwright)**, infra/cost signals, and an **orchestration layer** to produce a clear launch‑readiness verdict.

## 🔗 Live Demo
- https://prefracta-ai.vercel.app

---

## 🧩 What Problem It Solves

Most production incidents happen because teams ship with unknown limits:
- Scalability and concurrency breakpoints
- Latency spikes under realistic traffic
- Frontend UX/accessibility regressions
- Infrastructure cost blowups at scale

Traditional tools analyze **parts** of a system.  
Prefracta AI evaluates the **launch surface end‑to‑end** and summarizes risk as a launch verdict.

---

## 🖼️ Screenshots

### Landing
![Landing](docs/WhatsApp%20Image%202026-03-26%20at%2021.32.51.jpeg)

Shows the product positioning and entry point for starting performance audits.

### Dashboard
![Dashboard](docs/WhatsApp%20Image%202026-03-26%20at%2021.33.35.jpeg)

Central view for audits, credits/usage, and navigating to load tests and reports.

### Metrics
![Metrics](docs/WhatsApp%20Image%202026-03-26%20at%2021.33.50.jpeg)

Displays audit outputs like latency distribution, throughput, stability signals, and readiness scoring.

### Pricing / Payment
![Pricing](docs/WhatsApp%20Image%202026-03-26%20at%2021.34.03.jpeg)

Shows plan tiers and subscription flow (Razorpay in test mode).

### Weekly Countdown
![Countdown](docs/WhatsApp%20Image%202026-03-26%20at%2021.34.58.jpeg)

Shows plan usage/retention window and credit lifecycle for repeated audits.

---

## 🧠 How It Works (High Level)

1. User provides a **target URL** and/or connects a **GitHub repository** (read‑only).
2. Prefracta creates a **temporary execution environment** (cloud workspace).
3. Runs **k6 load tests** to simulate real traffic patterns.
4. Runs **Playwright browser audits** to measure real UX/performance signals.
5. Collects backend + frontend + cost/stability metrics.
6. An orchestration layer aggregates signals into a **Launch Readiness Score** + **verdict**.
7. Temporary infrastructure is destroyed (no long‑term environment kept).

---

## 🤖 Orchestration Layer (No Buzzwords)

The orchestration layer applies **weighted scoring** across key signals (latency, error rate, throughput, and cost indicators) to generate a final **launch‑readiness verdict** and highlight the biggest risks.

---

## 📊 Metrics Produced

- Latency (p50 / p95 / p99)
- Error rate / failure rate
- Throughput (req/sec)
- Max sustainable concurrency estimate
- Browser performance signals (Playwright)
- Accessibility / best‑practice audit signals
- Estimated infrastructure cost impact
- Overall **Launch Readiness Score**

---

## ✅ Real Test Results (Replace with your real numbers)

> Add results from one real audit run. Even approximate numbers build huge credibility.

- Sustained throughput: **<e.g., 800 req/sec>**
- Stable concurrency: **<e.g., ~900 concurrent users>**
- p95 latency spike beyond: **<e.g., 750 users>**
- Error rate exceeded **<e.g., 5%>** at: **<e.g., 1100 users>**

📁 If you have exported reports/screenshots/logs, link them here:
- `docs/` (add `k6-results/` and `playwright-reports/` folders if available)

---

## 🔐 Security & Privacy (Current Design)

- ✅ Read-only GitHub access
- ❌ No AI model access to raw source code (as designed)
- 🧨 Temporary cloud environment (auto-destroyed)
- 🔒 No long-term source retention

> If any of these points depend on current implementation, mention “planned” vs “implemented”.

---

## 🛠 Tech Stack

- **Frontend:** React, Chart.js
- **Backend:** Node.js
- **Database:** MongoDB
- **Load Testing:** k6
- **Browser Audits:** Playwright
- **Cloud:** Azure (temporary workspace)
- **Payments:** Razorpay (test mode)
- **Deployment:** Vercel (frontend)

---

## 🚧 Project Status / Limitations

- Core architecture: ✅
- Dashboard & analytics: ✅
- GitHub OAuth integration: ✅
- Load testing engine (k6): ✅
- Browser audits (Playwright): ✅
- Orchestration logic: ✅
- Full automation engine: 🚧 *(some orchestration steps are manual today)*

---

## 🗺️ Roadmap

- [ ] Fully automated end‑to‑end audit pipeline (one-click)
- [ ] Store/share audit history per project
- [ ] Exportable reports (PDF/JSON)
- [ ] CI/CD integration (run audits on release branches)

---

## 📄 License

Shared for **educational, research, and demonstration** purposes.
