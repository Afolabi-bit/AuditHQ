<div align="center">

# ⚡ AuditHQ

**Autonomous Web Performance Engineering Console & Lighthouse 12.0 Telemetry Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.1-2D3748?logo=prisma)](https://www.prisma.io/)
[![Google Lighthouse](https://img.shields.io/badge/Lighthouse-12.0-F44B21?logo=lighthouse)](https://developer.chrome.com/docs/lighthouse/)

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#design-system">Design System</a>
</p>

</div>

---

## 📌 Overview

**AuditHQ** is a developer-centric web performance platform built to automate **Google Lighthouse 12.0 audits**, continuously track **Core Web Vitals**, and generate executive-grade PDF whitepapers.

Styled with a refined **Stripe-inspired Developer Console aesthetic**, AuditHQ provides immediate visual telemetry without bloated dashboards or sluggish full-page skeleton flickers.

---

## ✨ Key Features

- **⚡ Lighthouse 12.0 Cloud Engine**: Trigger real-time, isolated performance, accessibility, SEO, and security audits with custom device emulation (Mobile & Desktop) and synthetic network throttling.
- **🎯 Precision Core Web Vitals Telemetry**: Measure Largest Contentful Paint (LCP), Total Blocking Time (TBT), Cumulative Layout Shift (CLS), First Contentful Paint (FCP), Speed Index (SI), and Time to First Byte (TTFB) calibrated to 1 decimal place with 3-tier target spectrum indicators.
- **📈 Sequential Performance Trajectory**: Track historical performance trends and regression variations across recent audit runs using smooth SVG trajectory curves.
- **📄 Executive PDF Whitepapers**: Generate vector-sharp, structured multi-page PDF audit reports with dynamic score dials, metric tables, and remediation roadmaps using client-side `jsPDF`.
- **🔗 Instant Shareable Public Snapshots**: Every audit generates a dedicated read-only public URL (`/report/[id]`) for effortless sharing with clients, agencies, and stakeholders.
- **⚡ Swift 0ms Navigation**: Built with persistent layout shells, zero-latency top progress bars, and scoped inline skeletons so static UI elements mount instantly without full-page loading flashes.
- **🔒 Enterprise Auth**: Powered by Kinde Auth for passwordless, secure user sessions.

---

## 🛠️ Tech Stack

| Layer              | Technology                                                                         |
| :----------------- | :--------------------------------------------------------------------------------- |
| **Framework**      | [Next.js 16 (App Router)](https://nextjs.org/) + [Turbopack](https://turbo.build/) |
| **UI & Runtime**   | [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)   |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com/) (Custom Stripe Sail Design Tokens)     |
| **Data Fetching**  | [SWR](https://swr.vercel.app/) (Event-driven mutation & focus revalidation)        |
| **Database & ORM** | [Prisma ORM 7.1](https://www.prisma.io/) + PostgreSQL / Neon / MongoDB             |
| **Authentication** | [Kinde Auth Next.js SDK](https://kinde.com/)                                       |
| **PDF Engine**     | [jsPDF](https://github.com/parallax/jsPDF)                                         |
| **Icons & Toasts** | [Lucide React](https://lucide.dev/) + [Sonner](https://sonner.emilkowal.ski/)      |

---

## 🏛️ Project Architecture

```
├── app/
│   ├── api/
│   │   ├── auth/[kindeAuth]/     # Kinde Authentication Endpoints
│   │   ├── dashboard/stats/       # Dynamic aggregate statistics & telemetry API
│   │   ├── lighthouse/            # Headless Google PageSpeed / Lighthouse engine
│   │   ├── test/[id]/status/      # Single-test polling status endpoint
│   │   ├── test/submit/           # Test submission and job queue handler
│   │   └── tests/recent/          # Recent domain audits fetcher
│   ├── dashboard/
│   │   ├── layout.tsx             # Persistent dashboard navigation shell
│   │   ├── page.tsx               # Instant-mount dashboard canvas
│   │   └── test/[id]/page.tsx     # Private audit report view with Suspense streaming
│   ├── report/[id]/page.tsx       # Public read-only report snapshot view
│   ├── globals.css                # Stripe Sail tokens & utility variables
│   ├── layout.tsx                 # Root layout with TopProgressBar & font configurations
│   └── page.tsx                   # High-contrast Stripe-style landing page
├── components/
│   ├── dashboard/                 # Welcome, StatsCards, NewTest, Trajectory, RecentTests
│   ├── report/                    # ScoreGauge, VitalsGrid, VisualExperience, ReportTabs
│   └── ui/                        # Button, Input, Tabs, TopProgressBar, Toaster
├── lib/
│   ├── auth.ts                    # Kinde session helper
│   ├── db.ts                      # Prisma client singleton
│   ├── generate-report-pdf.ts     # Multi-page vector PDF generation engine
│   └── report-parser.ts           # Strongly-typed Lighthouse LHR extraction & formatting
└── prisma/
    └── schema.prisma              # Database schema for Users, Domains, and Tests
```

---

### Prerequisites

- [Node.js](https://nodejs.org/) v18.18+ or v20+
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A free [Kinde Auth](https://kinde.com/) account
- A free [Google PageSpeed Insights API key](https://developers.google.com/speed/docs/insights/v5/get-started) (optional but recommended for high rate limits)

## 🎨 Design System: Stripe Sail Tokens

AuditHQ follows the **Stripe Developer Console** aesthetic:

- **Canvas**: Cool off-white (`#f6f9fc`)
- **Surfaces**: Crisp white (`#ffffff`) with hairline borders (`#e3e8ee`)
- **Typography**: Midnight navy headings (`#0a2540`), slate body (`#425466`), and muted captions (`#8898aa`)
- **Primary Accent**: Stripe Blurple (`#635bff`) with hover (`#5851ea`) and active (`#4b45d0`) states
- **Semantic Badges**:
  - **Good ($\ge 90$)**: Pastel mint (`bg-[#e3fcf7] text-[#00875a] border-[#abf5d1]`)
  - **Needs Work ($50–89$)**: Pastel amber (`bg-[#fff8e5] text-[#b76e00] border-[#ffe380]`)
  - **Poor ($< 50$)**: Pastel rose (`bg-[#ffebe6] text-[#de350b] border-[#ffbdad]`)

---

## 📦 Scripts

| Command             | Action                                                 |
| :------------------ | :----------------------------------------------------- |
| `npm run dev`       | Starts the Next.js development server with Turbopack   |
| `npm run build`     | Generates Prisma client and compiles production bundle |
| `npm run start`     | Starts the optimized production server                 |
| `npx tsc --noEmit`  | Runs full static TypeScript type-checking              |
| `npx prisma studio` | Opens interactive GUI database viewer                  |

---

## 📄 License

This project is licensed under the MIT License.
