# Prefracta AI 🚀

**Production-Grade DevOps Testing & AI Analysis Platform**

Prefracta AI is a **DevOps-focused SaaS platform** designed to simulate real-world traffic, validate frontend reliability, and generate **AI-driven performance insights** for modern applications before production deployment.

This is not a demo system — it is built with **production constraints, scalability, and monetization in mind.**

---

## 🧠 Problem Statement

Modern applications fail in production due to:

* Unpredictable load spikes
* Poor frontend reliability under real user conditions
* Lack of actionable performance insights

Existing tools (K6, Playwright) generate raw data — but **developers still need to interpret everything manually.**

👉 Prefracta AI solves this by **automating testing + analysis + recommendations** in one pipeline.

---

## ⚡ Core Capabilities

### 1. Load Testing Engine

* Executes **K6-based distributed load tests**
* Captures:

  * p95 / p99 latency
  * Throughput (RPS)
  * Error rates

### 2. Browser Testing Engine

* Uses **Playwright** for:

  * UI validation
  * Workflow simulation
  * Failure trace capture

### 3. AI Analysis Pipeline

* Converts raw logs → structured insights
* Detects:

  * Bottlenecks
  * Latency spikes
  * Failure patterns
* Generates **actionable DevOps recommendations**

### 4. SaaS Monetization System

* Credit-based usage model
* Tiered pricing:

  * ₹499/week
  * ₹1499/month
* Integrated **Razorpay APIs**:

  * Subscription lifecycle
  * Payment capture
  * Access control

---

## 🏗️ System Architecture

```
User Request
     ↓
API Gateway (Node.js / Express)
     ↓
Test Orchestrator
 ├── K6 Load Testing Engine
 ├── Playwright Browser Engine
     ↓
Metrics Aggregation Layer
     ↓
AI Processing Pipeline
     ↓
Report Generator (Insights + Recommendations)
     ↓
Frontend Dashboard (React)
```

---

## ⚙️ Tech Stack

**Backend:** Node.js, Express.js
**Frontend:** React.js
**Testing Engines:** K6, Playwright
**Database:** MongoDB
**DevOps:** Docker, GitHub Actions CI/CD
**Cloud:** Render (backend), Vercel (frontend)
**Payments:** Razorpay

---

## 🚀 Engineering Highlights

* Designed a **test orchestration system** handling multiple test workflows
* Implemented **rate limiting + quota enforcement** for SaaS scaling
* Built **end-to-end payment integration** with subscription control
* Containerized services using **Docker for portability**
* Automated deployment pipeline using **GitHub Actions**

---

## 📊 Performance Metrics (Real Observations)

* Sustained load: **84 req/sec**
* p95 latency: **~1300ms under stress**
* Identified **Node.js event-loop bottleneck** under concurrency
* Optimized using:

  * Debounced handlers
  * Frontend re-render control (React.memo)

👉 Result: **Stabilized throughput without changing core architecture**

---

## 🧪 Example Output

Prefracta AI generates:

* Latency distribution graphs
* Error breakdown
* Performance bottleneck identification
* Clear, human-readable recommendations

---

## 🎯 Use Cases

* Pre-production stress testing
* DevOps pipeline validation
* SaaS reliability benchmarking
* Startup MVP performance validation

---

## 🔮 Future Scope

* Distributed load testing (multi-region)
* Horizontal scaling of test runners
* Advanced AI root-cause analysis
* Historical analytics dashboard

---

## 📦 Setup

```bash id="clone123"
git clone https://github.com/DEEP13-2-5/Prefracta-AI.git
cd Prefracta-AI
npm install
npm run dev
```

---

## 🌍 Live Links

* 🔗 https://prefracta-ai.vercel.app
* 💻 https://github.com/DEEP13-2-5/Prefracta-AI

---

## 🧩 Why This Project Stands Out

* Combines **DevOps + AI + SaaS monetization**
* Built with **real constraints (scaling, payments, infra)**
* Focused on **actionable insights, not just raw metrics**
* Demonstrates **system design + backend depth + product thinking**

---

## 📄 License

MIT (recommended)

---

**Built to solve real production problems — not just showcase code.**
