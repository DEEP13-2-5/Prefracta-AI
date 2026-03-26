# Prefracta AI

> **Launch-intelligence for engineering teams.**
> Connect your repo → stress-test with real traffic → get a precise AI verdict on whether your product is safe to ship.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-prefracta--ai.vercel.app-blue?style=flat-square&logo=vercel)](https://prefracta-ai.vercel.app)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20k6%20%7C%20Playwright-informational?style=flat-square)
![License](https://img.shields.io/badge/License-Educational%20%2F%20Demo-lightgrey?style=flat-square)

---

## Overview

Prefracta AI is a **B2B SaaS launch-intelligence platform** that answers one question for engineering teams:

> *"Is this product truly ready to go live — or will it collapse under real users?"*

Most software failures happen not because of missing features, but because of:
- Unknown scalability limits that only appear under load
- Latency spikes that slip past unit tests
- Hidden frontend performance and accessibility issues
- Unexpected infrastructure cost explosions at scale

Traditional tools inspect **one signal at a time**. Prefracta AI evaluates the **entire launch surface** — backend stress, browser UX, accessibility, cost impact — and fuses all signals through an AI orchestration layer into a single, actionable verdict.

---

## Demo

**Live platform:** [https://prefracta-ai.vercel.app](https://prefracta-ai.vercel.app)

![Prefracta AI – Platform overview](WhatsApp%20Image%202026-01-09%20at%2016.18.09.jpeg)

| Dashboard | Load Test Results | AI Verdict |
|:---------:|:-----------------:|:----------:|
| ![Dashboard](docs/screenshot-dashboard.png) | ![Load Test](docs/screenshot-loadtest.png) | ![Verdict](docs/screenshot-verdict.png) |

> **Note:** Place `screenshot-dashboard.png`, `screenshot-loadtest.png`, and `screenshot-verdict.png` in the `docs/` folder to populate the table above.

---

## Features

- **GitHub OAuth integration** – connect any repo in seconds with read-only access
- **k6 load testing** – simulates real concurrent user traffic against your live endpoints
- **Playwright browser audits** – real Chromium sessions measuring Core Web Vitals, accessibility, and SEO
- **AI orchestration** – correlates backend stress, frontend UX, cost amplification, and collapse thresholds into one verdict
- **Launch Readiness Score** – a single numeric confidence score with plain-language explanations
- **Freemium billing** – Razorpay integration (test mode) with free and paid tiers
- **Zero retention** – temporary cloud workspace is spun up, used, and destroyed automatically

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Framer Motion, Recharts |
| Backend | Node.js, Express 5, MongoDB (Mongoose), JWT auth |
| Load Testing | [k6](https://k6.io/) |
| Browser Audits | [Playwright](https://playwright.dev/) |
| AI Orchestration | OpenRouter API (agentic pipeline) |
| Payments | Razorpay (test mode) |
| Cloud Workspace | Azure (ephemeral, auto-destroyed) |
| Deployment | Vercel (frontend) · Docker-ready backend |

---

## Architecture — How It Works

```
User
 │
 ├─ 1. GitHub OAuth  →  read-only repo access
 │
 ├─ 2. Spin up temporary Azure environment
 │        ↓
 ├─ 3. k6 runner         (load / stress / spike tests)
 ├─ 4. Playwright runner  (browser UX, a11y, SEO audits)
 │        ↓
 ├─ 5. Metric collector  (latency p50/p95/p99, error rate,
 │                        max concurrent users, perf scores,
 │                        infra cost estimate)
 │        ↓
 ├─ 6. AI Orchestration Layer
 │        – correlates all signals
 │        – identifies collapse points
 │        – generates Launch Readiness Score + plain-language report
 │        ↓
 ├─ 7. Destroy temporary environment (zero retention)
 │        ↓
 └─ 8. Dashboard – verdict, charts, risk breakdown
```

**Key insight:** The AI layer performs *decision intelligence*, not Q&A. It reasons across multiple independent data streams simultaneously to surface failure patterns that no single metric would reveal alone.

---

## Local Setup

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- OpenRouter API key
- Razorpay test-mode keys (optional for billing features)

### 1 — Clone & install

```bash
git clone https://github.com/DEEP13-2-5/Prefracta-AI.git
cd Prefracta-AI
```

**Backend:**

```bash
cd backend
npm install
cp .env.example .env        # fill in your values
npm run dev                  # nodemon server.js → http://localhost:8080
```

**Frontend:**

```bash
cd Frontend
npm install
cp .env.example .env        # fill in your values
npm run dev                  # Vite dev server → http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `8080`) |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `https://prefracta-ai.vercel.app`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI orchestration |
| `RAZORPAY_KEY_ID` | Razorpay test-mode key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay test-mode key secret |
| `EXECUTION_MODE` | `demo` skips real Azure spin-up; `normal` runs the full pipeline |

See [`backend/.env.example`](backend/.env.example) for a ready-to-copy template.

### Frontend (`Frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:8080/api`) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key ID (public, safe to expose) |

See [`Frontend/.env.example`](Frontend/.env.example) for the template.

---

## Deployment

### Frontend — Vercel

The `Frontend/` directory is configured for Vercel out of the box (`vercel.json` is present).

```bash
cd Frontend
npm run build       # output: dist/
# Deploy dist/ to Vercel, or run `vercel --prod`
```

Set the environment variables listed above in your Vercel project settings.

### Backend — Docker / any Node host

```bash
cd backend
docker build -t prefracta-backend .
docker run -p 8080:8080 --env-file .env prefracta-backend
```

Or deploy the `backend/` folder directly to Render, Railway, or any Node.js host and configure the environment variables in the host dashboard.

---

## Security & Privacy

| Guarantee | Status |
|---|---|
| GitHub access is read-only | ✅ |
| AI layer never sees source code | ✅ |
| No static code scanning or storage | ✅ |
| Cloud environment auto-destroyed after audit | ✅ |
| Zero source-code retention | ✅ |

---

## Project Status & Limitations

| Feature | Status |
|---|---|
| Core architecture | ✅ Complete |
| Dashboard & analytics UI | ✅ Complete |
| GitHub OAuth login | ✅ Complete |
| k6 load testing engine | ✅ Complete |
| Playwright browser audits | ✅ Complete |
| AI orchestration & verdict | ✅ Complete |
| Freemium billing (Razorpay test mode) | ✅ Complete |
| Full end-to-end automation (Azure orchestration) | 🚧 Partially manual |

**Current limitations:**

- The Azure workspace spin-up/tear-down is partially manual. Set `EXECUTION_MODE=demo` in `.env` to run the platform in demo mode, skipping real cloud provisioning.
- Razorpay is configured in test mode — no real payments are processed.
- k6 tests run against URLs provided by the user; the platform does not yet auto-discover endpoints from the repo.

---

## Roadmap

- [ ] Fully automated Azure workspace provisioning and teardown
- [ ] Endpoint auto-discovery from repository analysis
- [ ] CI/CD webhook integration (trigger audits on every push)
- [ ] Team and organization accounts
- [ ] PDF / shareable audit reports
- [ ] Slack / email notifications for verdict delivery
- [ ] Support for AWS and GCP workspaces

---

## License

This project is released for **educational, research, and demonstration purposes**.
For commercial licensing or collaboration inquiries, open an issue or reach out via GitHub.
