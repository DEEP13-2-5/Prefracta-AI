# Prefracta AI — Launch Intelligence Platform

> **Is your product safe to launch?** Prefracta AI answers that question with a single, data-backed verdict.

[![GitHub stars](https://img.shields.io/github/stars/DEEP13-2-5/Prefracta-AI?style=social)](https://github.com/DEEP13-2-5/Prefracta-AI/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/DEEP13-2-5/Prefracta-AI?style=social)](https://github.com/DEEP13-2-5/Prefracta-AI/network/members)
[![Last commit](https://img.shields.io/github/last-commit/DEEP13-2-5/Prefracta-AI)](https://github.com/DEEP13-2-5/Prefracta-AI/commits/main)

If you find this useful, please ⭐ **star the repo** — it helps a lot!

---

## 🌐 Live Demo

**[https://prefracta-ai.vercel.app](https://prefracta-ai.vercel.app)**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Metrics Produced](#-metrics-produced)
- [Use Cases](#-use-cases)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Project Status & Roadmap](#-project-status--roadmap)
- [Contributing](#-contributing)
- [Security](#-security)
- [License](#-license)

---

## 🚀 Overview

**Prefracta AI** is a **B2B SaaS launch‑intelligence platform** built for engineering teams and startups who need confidence before they ship.

Most production incidents happen because teams launch with unknown limits:

| Risk Area | What Can Go Wrong |
|---|---|
| Scalability | Unknown concurrency breakpoints under real traffic |
| Latency | Spikes that only appear under realistic load |
| UX regressions | Frontend performance / accessibility bugs missed in dev |
| Cost blowups | Infrastructure costs that explode at scale |

Traditional tools analyze **parts** of a system in isolation. Prefracta AI evaluates the **entire launch surface end‑to‑end** — load, browser, infra, and cost — and summarizes the result as a clear **Launch Readiness Score** and **verdict**.

---

## ✨ Key Features

- 🔥 **k6 Load Testing** — Simulates realistic concurrent traffic patterns to find your system's breaking point (latency p50/p95/p99, error rates, throughput, max sustainable concurrency).
- 🎭 **Playwright Real‑Browser Audits** — Headless Chromium-powered checks for UX performance, accessibility, and best practices — not just synthetic metrics.
- 💰 **Infra / Cost Signal Analysis** — Estimates infrastructure cost impact at scale so you can plan before you launch.
- 🧠 **Orchestration Layer** — Aggregates all signals (load, browser, cost) into a single, actionable **Launch Readiness Score**.
- 🐙 **GitHub Integration** — Connect a repository (read‑only) and let Prefracta analyze it in a temporary, isolated cloud environment.
- 📊 **Interactive Dashboard** — Real-time charts and metrics displayed in a clean, modern interface built with React and Recharts.
- 💳 **Subscription Payments** — Razorpay‑powered billing (test mode available).
- 🔒 **Privacy‑First Architecture** — Temporary execution environments are auto-destroyed after each audit run; no long‑term source code retention.

---

## 🧠 How It Works

```
User provides Target URL / GitHub Repo
           │
           ▼
┌──────────────────────────────┐
│  Temporary Cloud Workspace   │  (auto-destroyed after run)
│  ┌──────────┐ ┌───────────┐  │
│  │ k6 Load  │ │Playwright │  │
│  │  Tests   │ │  Audits   │  │
│  └────┬─────┘ └─────┬─────┘  │
│       │             │         │
│  ┌────▼─────────────▼──────┐  │
│  │   Orchestration Layer   │  │
│  │  (signal aggregation)   │  │
│  └────────────┬────────────┘  │
└───────────────┼───────────────┘
                │
                ▼
    Launch Readiness Score
    + Verdict (Ready / At Risk)
```

1. User provides a **target URL** and/or connects a **GitHub repository** (read‑only OAuth).
2. Prefracta spins up a **temporary cloud execution environment**.
3. **k6** runs configurable load tests simulating real traffic (VUs, duration, ramp-up).
4. **Playwright** performs real-browser audits measuring UX, performance, and accessibility.
5. Backend collects and normalizes all metrics.
6. The **orchestration layer** aggregates every signal into a **Launch Readiness Score** plus a clear launch verdict.
7. The temporary environment is **destroyed** — no long‑term code or data retention.

---

## 📊 Metrics Produced

| Category | Metrics |
|---|---|
| **Load** | Latency p50 / p95 / p99, error rate, throughput (req/s), max sustainable concurrency |
| **Browser** | Real-page performance scores, accessibility signals, best-practice flags |
| **Cost / Infra** | Estimated infrastructure cost impact at target scale |
| **Summary** | Overall **Launch Readiness Score** + Pass / At Risk verdict |

---

## 💡 Use Cases

- **Pre-launch stress testing** for startups shipping their first production version.
- **Release-gate audits** before major feature launches.
- **Infrastructure cost planning** before scaling to new user tiers.
- **Accessibility compliance checks** to catch regressions before they reach users.
- **Investor/demo preparation** — show concrete launch-readiness data, not gut feel.

---

## 🖼️ Screenshots

> _Screenshots coming soon. Visit the [live demo](https://prefracta-ai.vercel.app) to explore the app._

| View | Description |
|---|---|
| Landing Page | Hero, value prop, and CTA |
| Dashboard | Real-time load & browser metrics |
| Load Test View | Charts for latency, error rate, throughput |
| Load Test Result | Full report with Launch Readiness Score |
| Pricing | Subscription tiers powered by Razorpay |

_To add screenshots: place images in `docs/screenshots/` and update this table with relative paths._

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Radix UI, Framer Motion |
| **Backend** | Node.js, Express 5, MongoDB (Mongoose) |
| **Load Testing** | k6 |
| **Browser Audits** | Playwright (Chromium) |
| **AI / LLM** | OpenRouter API |
| **Payments** | Razorpay |
| **Cloud Infra** | Azure (temporary execution workspaces) |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render (Docker) |

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) v9 or later
- [k6](https://k6.io/docs/get-started/installation/) (for running load tests locally)
- [MongoDB](https://www.mongodb.com/try/download/community) instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DEEP13-2-5/Prefracta-AI.git
   cd Prefracta-AI
   ```

2. **Install Frontend dependencies**

   ```bash
   cd Frontend
   npm install
   ```

3. **Install Backend dependencies**

   ```bash
   cd ../backend
   npm install
   ```

4. **Install Playwright browser binaries** (required for browser audits)

   ```bash
   npx playwright install chromium
   ```

---

### Configuration

#### Frontend — `Frontend/.env`

Copy the example file and fill in your values:

```bash
cp Frontend/.env.example Frontend/.env
```

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay publishable key | `rzp_test_xxxxxxxxxxxx` |

#### Backend — `backend/.env`

Create `backend/.env` and set the following variables:

```bash
# backend/.env
MONGO_URI=mongodb://localhost:27017/prefracta
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=development
```

> **Tip:** Never commit `.env` files. Both `.gitignore` files already exclude them.

---

### Running Locally

#### Start the Backend

```bash
cd backend
npm run dev          # development (auto-reload with nodemon)
# or
npm start            # production mode
```

The backend server will start on `http://localhost:8080` by default.

#### Start the Frontend

In a separate terminal:

```bash
cd Frontend
npm run dev          # starts Vite dev server
```

The frontend will be available at `http://localhost:5173`.

---

### Running Audits / Tests

#### k6 Load Test (manual run)

```bash
# Run with defaults (50 VUs, 30s duration)
k6 run backend/loadtester/k6/test.js -e TARGET_URL=https://your-target-url.com

# Custom VUs and duration
k6 run backend/loadtester/k6/test.js \
  -e TARGET_URL=https://your-target-url.com \
  -e VUS=100 \
  -e DURATION=60s
```

#### TypeScript type check (Frontend)

```bash
cd Frontend
npm run check        # runs tsc --noEmit
```

#### Build (Frontend)

```bash
cd Frontend
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

---

## 🚀 Deployment

### Frontend → Vercel

The frontend is configured for Vercel out of the box via `Frontend/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

1. Import the repository into [Vercel](https://vercel.com).
2. Set the **Root Directory** to `Frontend`.
3. Add the environment variables (`VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`) in the Vercel dashboard.
4. Deploy — Vercel handles the build automatically (`npm run build`).

### Backend → Render

The backend includes `backend/render.yaml` and a `backend/Dockerfile` for deployment on [Render](https://render.com):

1. Connect your GitHub repository to Render.
2. Render will auto-detect `render.yaml` and configure the service.
3. Add the required environment variables in the Render dashboard:
   - `MONGO_URI`
   - `OPENROUTER_API_KEY`
   - `FRONTEND_URL`
   - `JWT_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`

The Dockerfile installs **k6** and **Playwright Chromium** automatically inside the container.

---

## 🗺️ Project Status & Roadmap

### Current Status

| Feature | Status |
|---|---|
| Core architecture | ✅ Complete |
| Dashboard & analytics | ✅ Complete |
| GitHub OAuth integration | ✅ Complete |
| Load testing engine (k6) | ✅ Complete |
| Browser audits (Playwright) | ✅ Complete |
| Orchestration logic | ✅ Complete |
| Full automation pipeline | 🚧 In progress |

### Roadmap

- [ ] Fully automated end‑to‑end audit pipeline (one-click, zero manual steps)
- [ ] Persistent audit history per project
- [ ] Exportable reports (PDF / JSON)
- [ ] CI/CD integration — trigger audits automatically on release branches
- [ ] Slack / webhook notifications for audit results

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. **Fork** the repository.
2. Create a **feature branch**: `git checkout -b feat/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your fork: `git push origin feat/your-feature-name`
5. Open a **Pull Request** against `main`.

Please follow these guidelines:
- Keep PRs focused and small.
- Write clear commit messages.
- Update documentation if your change affects usage.

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold a welcoming and respectful environment.

---

## 🔐 Security

| Practice | Detail |
|---|---|
| GitHub access | Read-only OAuth scopes — Prefracta never writes to your repository |
| Source code | No AI model is given direct access to raw source code |
| Execution environment | Temporary cloud workspace, auto-destroyed after each run |
| Data retention | No long-term source code storage |

To report a security vulnerability, please open a **private security advisory** via the [Security tab](https://github.com/DEEP13-2-5/Prefracta-AI/security/advisories/new) rather than a public issue.

---

## 📄 License

This project is currently shared for **educational, research, and demonstration** purposes.

> **No formal open-source license is present in this repository.** This means the default copyright law applies — you may not copy, distribute, or create derivative works without explicit permission from the copyright holder(s).
>
> If you want to open-source this project, add a `LICENSE` file to the root of the repository. Visit [choosealicense.com](https://choosealicense.com) to pick the right license for your needs (e.g., MIT for permissive open source).

---

<div align="center">

Built with ❤️ by [DEEP13-2-5](https://github.com/DEEP13-2-5)

</div>
