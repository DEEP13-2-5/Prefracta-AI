# Prefracta AI 🚀

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-81.6%25-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-UI-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-13AA52?logo=mongodb)](https://www.mongodb.com/)

**Production-Ready Launch Intelligence Platform**

Prefracta AI answers the critical question every engineering team faces:

> **"Is my system ready for production?"**

Instead of guessing, Prefracta runs **load tests + browser audits + cost analysis** in a temporary cloud environment, then uses AI to generate a **clear, actionable launch-readiness verdict** — not just raw metrics.

🔗 **[Live Demo](https://prefracta-ai.vercel.app)** | 📖 **[GitHub](https://github.com/DEEP13-2-5/Prefracta-AI)**

---

## 🎯 The Problem

Modern applications fail in production because teams ship **without knowing their limits**:

- ❌ **Unpredictable load spikes** → System crashes at 2x expected traffic
- ❌ **Poor frontend reliability** → UI breaks under real user conditions  
- ❌ **No actionable insights** → Raw metrics don't tell you *what* to fix
- ❌ **Hidden cost blowups** → Infrastructure expenses spike 10x at scale

**Existing tools (K6, Playwright, DataDog) generate data — but developers still need to interpret everything manually.**

---

## ✨ What Prefracta AI Does

Prefracta **automates the entire evaluation pipeline**:

```
Your Target URL
      ↓
  1. Load Testing (K6)    → Simulate real traffic, measure latency & throughput
  2. Browser Audits (Playwright) → Test UX, capture failures in real browsers
  3. Metrics Aggregation    → Collect backend, frontend, cost signals
  4. AI Analysis Pipeline   → Detect bottlenecks, predict breaking points
  5. Orchestration Layer    → Weight signals into a clear verdict
      ↓
  📊 Launch-Readiness Score + Actionable Recommendations
```

---

## 🏆 Core Capabilities

### 1. **Distributed Load Testing**
- K6-based engine simulating real user traffic
- Measures: **p95/p99 latency, throughput (RPS), error rates**
- Identifies breaking points under load

### 2. **Real-Browser Audits**
- Playwright-powered UI validation
- Workflow simulation with real browser rendering
- Captures failure traces and performance signals

### 3. **AI-Driven Analysis**
- Converts raw logs → structured insights
- Detects bottlenecks, latency spikes, failure patterns
- **Generates actionable DevOps recommendations** (not just "you have high latency")

### 4. **SaaS Credit System**
- Usage-based pricing: **₹499/week | ₹1499/month**
- Built-in Razorpay payment integration
- Automated subscription & access control

### 5. **Orchestration Engine**
- Weighted scoring across latency, errors, throughput, cost
- Produces final **Launch Readiness Score** (0-100)
- Clear verdict: **"Ready" | "At Risk" | "Not Ready"**

---

## 📊 Real Performance Results

From testing on a real application:

| Metric | Result |
|--------|--------|
| **Sustained Throughput** | 84 req/sec |
| **p95 Latency Under Stress** | ~1300ms |
| **Identified Bottleneck** | Node.js event-loop contention |
| **Optimization Impact** | Stabilized throughput without rewriting core logic |

**Tools Used:** Debounced handlers, React.memo re-render control

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Vite, Radix UI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Testing** | K6, Playwright |
| **Payments** | Razorpay |
| **Cloud** | Vercel (frontend), Render (backend) |
| **DevOps** | Docker, GitHub Actions, CI/CD |

---

## 🚀 Engineering Highlights

✅ **Test Orchestration System** — Coordinates multiple parallel test workflows  
✅ **Rate Limiting + Quota Enforcement** — Built for SaaS scaling from day one  
✅ **End-to-End Payment Integration** — Subscription lifecycle fully automated  
✅ **Containerized Architecture** — Docker for portable, reproducible deployments  
✅ **Automated CI/CD Pipeline** — GitHub Actions for zero-downtime deployments  
✅ **Production-Grade Monitoring** — Tracks system health, errors, and SLAs  

---

## 💡 Use Cases

- 🚀 **Pre-launch stress testing** → Know your breaking point before going live
- 🏗️ **DevOps pipeline validation** → Verify infrastructure readiness
- 📈 **SaaS scaling benchmarks** → Understand cost/performance tradeoffs
- 🔬 **Startup MVP validation** → Reduce launch risk with data
- 🛡️ **Incident prevention** → Catch problems before they hit production

---

## 🎬 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/DEEP13-2-5/Prefracta-AI.git
cd Prefracta-AI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB, Razorpay, and API keys

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 🔒 Security & Privacy

- ✅ **Read-only GitHub access** — No code modifications
- ✅ **Temporary cloud environments** — All infrastructure auto-destroyed after audit
- ✅ **No long-term retention** — Source code never stored permanently
- ✅ **Encrypted credentials** — Razorpay API keys stored securely
- ✅ **ISO-standard practices** — Payment handling via PCI-compliant provider

---

## 📈 Why Prefracta Stands Out

| vs. K6 | vs. Playwright | vs. DataDog | **Prefracta** |
|--------|---|---|---|
| Load testing only | Browser testing only | Metrics only | **End-to-end audit** |
| Raw metrics | Individual test results | Requires expertise to interpret | **AI-driven verdict** |
| DIY analysis | Manual correlation | High cost | **All-in-one launch decision** |

**Prefracta = Load Testing + Browser Audits + AI Analysis + Launch Verdict**

---

## 🗺️ Roadmap

- [ ] Multi-region distributed load testing
- [ ] Audit history & trend analysis
- [ ] Exportable PDF reports
- [ ] CI/CD pipeline integration (GitHub Actions, GitLab CI)
- [ ] Slack/Email notifications
- [ ] Custom test scenarios library
- [ ] Team collaboration & role-based access

---

## 🤝 Contributing

We welcome contributions! Areas we're actively working on:

- Performance optimizations
- Additional testing scenarios
- Documentation improvements
- UI/UX enhancements

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License — See [LICENSE](LICENSE) for details

---

## 🙋 Support & Feedback

- 🐛 [Report Issues](https://github.com/DEEP13-2-5/Prefracta-AI/issues)
- 💬 [GitHub Discussions](https://github.com/DEEP13-2-5/Prefracta-AI/discussions)
- 🌐 [Live Demo](https://prefracta-ai.vercel.app)

---

<div align="center">

**Built to solve real production problems — not just showcase code.**

**Give us a ⭐ if you find Prefracta useful!**

</div>
