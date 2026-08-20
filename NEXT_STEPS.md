# 🚀 AuditHQ — Product Roadmap & Next Steps

This document tracks progress, implemented milestones, and actionable next steps to scale **AuditHQ** into an enterprise-grade autonomous web performance intelligence platform.

---

## 📊 Progress & Milestones Completed

| Milestone | Status | Key Deliverables & Architecture |
| :--- | :---: | :--- |
| **🤖 AI Performance Diagnostics & Remediation** | ✅ **Shipped** | Implemented Google Gemini 3.1 Flash Lite diagnostics (`AiInsightsCard`), executive summaries, speed verdicts, quantified time impact (`-1.4s`), and copyable framework code fixes (Next.js `next/image`, `next/script`, `font-display`). Background pre-generation & single-write database cache lock. |
| **⚡ Zero-Lag State & Persistence Architecture** | ✅ **Shipped** | Built unified Zustand store (`useAppStore`) with `localStorage` persistence. Synchronous 0ms local hydration across page navigations with SWR background revalidation. |
| **🗄️ Database & Query Optimization** | ✅ **Shipped** | Cut query payloads by **99.9%** (from 15MB down to ~4KB) via lean column projections on `getRecentTests` and `getDashboardStats`. Added PostgreSQL composite index `@@index([domainId, status, createdAt(sort: Desc)])`. |
| **🌓 Theme-Aware Micro-Interactions & Copy** | ✅ **Shipped** | Full dark-mode Sonner toast integration, Tailwind CSS v4 semantic palette, sanitized error fallbacks, and developer-focused landing copy. |

---

## 🗺️ Updated Product Roadmap

```
Phase 1: Deep Analytics & Regression Engine (Immediate Impact)
  ├── ⚖️ Audit Comparison & Regression Diff View (Side-by-Side)
  └── 📊 Domain-Level Multi-Route Health Matrix

Phase 2: Continuous Observability & Automation
  ├── ⏰ Automated Synthetic Audits (Cron / Scheduled Queue)
  └── 🚨 Multi-Channel Regression Alerts (Slack, Discord, Email Webhooks)

Phase 3: Developer Ecosystem & CI/CD
  ├── 🐙 GitHub Actions Pull Request Quality Gate
  ├── 💻 CLI Tool (`npx audithq-cli audit <url>`)
  └── 📄 Executive PDF Export & Team Sharing
```

---

## 📋 Detailed Next Step Suggestions

### 1. ⚖️ Audit Comparison & Regression Diff View
* **Why it matters**: Developers need to verify if a pull request, package upgrade, or infrastructure migration made their app faster or introduced a regression.
* **Key Capabilities**:
  * **Visual Score & Metric Deltas**: Direct comparison of Score ($\Delta +12$), LCP ($\Delta -650\text{ms}$), TBT ($\Delta -140\text{ms}$), and CLS ($\Delta -0.04$).
  * **Side-by-Side Filmstrip Progression**: Visual comparison of rendering progression frames at 500ms intervals.
  * **Asset Payload Diffing**: Automatically flags which JavaScript bundles, stylesheets, or images grew or were introduced between runs.
* **Suggested Route**: `/dashboard/compare?base={testId1}&target={testId2}`

---

### 2. 📊 Domain-Level Multi-Route Health Matrix
* **Why it matters**: Production websites are more than just homepages. Teams need to monitor multiple critical routes (`/`, `/pricing`, `/docs`, `/checkout`, `/dashboard`).
* **Key Capabilities**:
  * Track and aggregate scores across multiple URL paths per domain.
  * Worst-performing route leaderboard to identify urgent optimization targets.
  * Historical Core Web Vitals health trajectory per route.

---

### 3. ⏰ Automated Synthetic Monitoring (Cron Engine)
* **Why it matters**: Performance changes constantly due to third-party scripts, ad networks, and server loads. Automated recurring audits keep data fresh 24/7 without manual user triggers.
* **Key Capabilities**:
  * Configurable schedules: Hourly, Daily, or Weekly.
  * Multi-Device execution: Run concurrent Mobile (throttled 4G) and Desktop passes.
  * Implementation: Secure Route Handler (`/api/cron/scheduled-audits`) triggered via Vercel Cron or QStash.

---

### 4. 🚨 Multi-Channel Alerting & Performance Budgets
* **Why it matters**: Immediate notifications when performance breaches team SLA thresholds before real users drop off.
* **Key Capabilities**:
  * **Performance Budget Rules**:
    * Score drop $> 5\text{ pts}$
    * LCP exceeds $2.5\text{s}$ (Google "Poor" threshold)
    * Total JS payload exceeds $500\text{KB}$
  * **Notification Channels**:
    * Slack Incoming Webhooks & Discord Channels
    * Email summary digests (via Resend)

---

### 5. 🐙 GitHub Actions CI/CD Quality Gate & CLI
* **Why it matters**: "Shift-Left" performance testing — catch regressions in PRs before code is merged into production.
* **Key Capabilities**:
  * Audit PR preview URLs (Vercel, Netlify, Cloudflare Pages).
  * Post markdown audit comparison tables directly as PR comments.
  * Fail CI checks if performance budgets are violated.

---

## 🎯 Recommended Priority Queue

| Priority | Feature | Effort | ROI / Impact |
| :--- | :--- | :---: | :--- |
| **P1** | **⚖️ Audit Comparison & Regression Diff View** | Medium (1–2 days) | **Highest** (Core developer utility for before/after deploys) |
| **P2** | **⏰ Automated Scheduled Audits (Cron Engine)** | Low-Medium (1 day) | **High** (Continuous data without manual clicks) |
| **P3** | **🚨 Slack / Discord Webhook Alerting** | Low (1 day) | **High** (Real-time alerting & team engagement) |
| **P4** | **📊 Domain-Level Multi-Route Dashboard** | Medium (2 days) | **Medium-High** (Full-site performance visibility) |
| **P5** | **🐙 GitHub Actions CI/CD Action** | Medium (2 days) | **High** (Enterprise & developer team stickiness) |
