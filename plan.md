# 🏗️ Engineering Design Document: Audit Comparison & Regression Diff Engine

**Author**: Senior Software Engineer  
**Status**: Ready for Implementation  
**Branch**: `diff`  
**Target Delivery**: Enterprise Web Performance Intelligence Suite  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problem
Web performance engineering is fundamentally comparative. Developers, tech leads, and site reliability engineers rarely ask *"What is my score today in isolation?"*; they ask:
1. *"Did yesterday’s production deployment improve or regress our Core Web Vitals?"*
2. *"Did updating our UI library or third-party analytics bloat our JavaScript payload?"*
3. *"Why is our staging environment rendering 400ms slower than production?"*

Currently, AuditHQ provides rich single-audit reports, but users must open two separate browser tabs and manually cross-reference numbers, filmstrips, and opportunities.

### 1.2 The Solution
Build a high-performance, enterprise-grade **Audit Comparison & Regression Diff Engine** (`/dashboard/compare?base={id1}&target={id2}` and public `/compare?base={id1}&target={id2}`).

This engine takes any two historical audit telemetry payloads (from the same domain across different commits/dates, or across different environments) and computes an instant, mathematically rigorous regression diff covering:
- **Executive Speed & Score Delta Matrix** ($\Delta\text{Score}$, $\Delta\text{LCP}$, $\Delta\text{TBT}$, $\Delta\text{CLS}$, $\Delta\text{TTFB}$).
- **Synchronized Frame-by-Frame Filmstrip Player** with visual perceptual diffing.
- **Resource Payload Breakdown & Bloat Analysis** ($\Delta\text{JS}$, $\Delta\text{CSS}$, $\Delta\text{Images}$, $\Delta\text{Fonts}$).
- **Opportunities & Diagnostics Matrix** (Audits newly passed, newly failed, or regressed).
- **AI Regression Explainer** (Powered by Gemini 3.1 Flash Lite to generate stakeholder-ready changelog summaries).

---

## 2. System Architecture & Component Hierarchy

```
                                  [ User Entrypoints ]
                                           │
          ┌────────────────────────────────┼────────────────────────────────┐
          ▼                                ▼                                ▼
  [ Test Report Header ]         [ Dashboard Test Cards ]        [ Direct URL / Compare ]
  "Compare with Previous"        "Select to Compare" (2 tests)    /dashboard/compare?base=..&target=..
          │                                │                                │
          └────────────────────────────────┴────────────────────────────────┘
                                           │
                                           ▼
                       [ Page: app/dashboard/compare/page.tsx ]
                         (Server Component - Parallel DB Fetch)
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             [ Test A (Base Record) ]              [ Test B (Target Record) ]
                        │                                     │
                        └──────────────────┬──────────────────┘
                                           │
                                           ▼
                       [ lib/comparison/diff-engine.ts ]
                         (Deterministic Pure Function)
                         - Metric Deltas & Severity Grading
                         - Visual Frame Synchronization
                         - Byte Weight & Network Bloat Diff
                         - Opportunities State Transition Matrix
                                           │
                                           ▼
             ┌─────────────────────────────────────────────────────────┐
             │            [ CompareReportView (Client UI) ]            │
             ├─────────────────────────────────────────────────────────┤
             │ 1. CompareHeader (Swap Base/Target, Date & Env Badges)  │
             │ 2. ExecutiveDeltaBanner (Net Score & Speed Verdict)     │
             │ 3. CoreWebVitalsDeltaGrid (6 Visual Comparison Cards)   │
             │ 4. AiRegressionSummary (Gemini Diff Reasoning)          │
             │ 5. SynchronizedFilmstripDiff (Frame Timeline Matcher)   │
             │ 6. ResourcePayloadDiffTable (JS/CSS/Image Bloat Diffs)  │
             │ 7. AuditOpportunitiesTransitionMatrix (Fixes/New Bugs)  │
             └─────────────────────────────────────────────────────────┘
```

---

## 3. Mathematical & Algorithmic Foundations

### 3.1 Delta Formulae & Polarity Normalization
For each metric $M$, delta is defined as:
$$\Delta M = M_{\text{target}} - M_{\text{base}}$$
$$\% \Delta M = \left(\frac{M_{\text{target}} - M_{\text{base}}}{M_{\text{base}}}\right) \times 100$$

#### Polarity Normalization:
* **Higher is Better** (e.g., Performance Score, Accessibility, SEO):
  * $\Delta > 0 \implies \text{Positive (Green)}$
  * $\Delta < 0 \implies \text{Regression (Red)}$
* **Lower is Better** (e.g., LCP, FCP, TBT, CLS, TTFB, Total Byte Weight):
  * $\Delta < 0 \implies \text{Improvement (Green - Faster / Leaner)}$
  * $\Delta > 0 \implies \text{Regression (Red - Slower / Heavier)}$

### 3.2 Filmstrip Frame Interpolation & Alignment
Lighthouse captures filmstrip screenshots at non-uniform millisecond intervals (e.g., Run A at $320\text{ms}, 850\text{ms}, 1400\text{ms}$; Run B at $290\text{ms}, 600\text{ms}, 1200\text{ms}$).

**Algorithm**:
Normalize both timelines into a unified quantized time series at $250\text{ms}$ or $500\text{ms}$ intervals:
$$T = \{0, 500, 1000, 1500, 2000, 2500, 3000, \dots\}$$
For any quantized point $t_k$, select the latest captured frame where $\text{timestamp} \le t_k$.

---

## 4. Detailed Implementation Blueprint

### Phase 1: Core Comparison Engine (`lib/comparison/`)

#### 1.1 Type Definitions (`lib/comparison/types.ts`)
```typescript
export interface MetricDelta {
  baseValue: number | null;
  targetValue: number | null;
  baseDisplay: string;
  targetDisplay: string;
  delta: number | null;
  deltaDisplay: string;
  percentChange: number | null;
  status: "improved" | "regressed" | "neutral" | "unchanged";
  isLowerBetter: boolean;
}

export interface ResourceDiff {
  resourceType: "script" | "stylesheet" | "image" | "font" | "document" | "other";
  baseBytes: number;
  targetBytes: number;
  deltaBytes: number;
  percentChange: number;
}

export interface OpportunityTransition {
  id: string;
  title: string;
  baseSavingsMs: number;
  targetSavingsMs: number;
  deltaSavingsMs: number;
  state: "resolved" | "worsened" | "improved" | "new_issue" | "unchanged";
}

export interface ComparisonReport {
  base: {
    id: string;
    url: string;
    device: string;
    createdAt: Date;
    score: number;
  };
  target: {
    id: string;
    url: string;
    device: string;
    createdAt: Date;
    score: number;
  };
  scoreDelta: number;
  verdict: "Significant Improvement" | "Moderate Improvement" | "Neutral" | "Regression" | "Severe Regression";
  metrics: {
    score: MetricDelta;
    lcp: MetricDelta;
    fcp: MetricDelta;
    tbt: MetricDelta;
    cls: MetricDelta;
    speedIndex: MetricDelta;
    ttfb: MetricDelta;
  };
  resourceDiffs: ResourceDiff[];
  filmstripComparison: Array<{
    timestampMs: number;
    baseFrame: string | null;
    targetFrame: string | null;
  }>;
  opportunityTransitions: OpportunityTransition[];
}
```

#### 1.2 Diff Engine (`lib/comparison/diff-engine.ts`)
* Pure, zero-side-effect computational module.
* Parses raw Lighthouse LHR objects from `Test.fullReport` using existing `parseLighthouseReport`.
* Computes all metric deltas, quantizes filmstrip frames, and aggregates network resource diffs.

---

### Phase 2: AI Regression Diagnosis (`lib/ai/compare-summary.ts`)

#### 2.1 Prompt & Schema Specification
* Model: Google Gemini 3.1 Flash Lite (`@ai-sdk/google`).
* Input: Metric deltas, resource bloat deltas, resolved/introduced opportunities.
* Output (Structured JSON via Zod):
  1. `headline`: One-sentence punchy verdict (e.g., *"Deployment cut LCP by 650ms through image WebP compression, but introduced 180ms of new main-thread blocking time"*).
  2. `executiveSummary`: 2–3 sentences explaining the root cause of the regression/improvement for non-technical stakeholders.
  3. `rootCauses`: Array of top 3 architectural factors explaining the score shift.
  4. `suggestedRollbackAction`: Urgent recommendations if regression is severe.

---

### Phase 3: UI Component Architecture (`components/compare/`)

#### 3.1 `CompareHeader.tsx`
* Side-by-side URL and execution timestamp breadcrumbs.
* Interactive **Swap Button** ($\rightleftarrows$) that inverts Base and Target with 0ms client transition (`router.push('/dashboard/compare?base=B&target=A')`).
* Device and network compatibility validation pills.

#### 3.2 `ExecutiveDeltaBanner.tsx`
* Giant score delta badge:
  * Green gradient pill for score lift ($\Delta +15\text{ pts}$).
  * Red / Amber gradient pill for regression ($\Delta -8\text{ pts}$).
* Time-saved estimate banner (e.g., *"Users experience 34% faster page loads on Commit B"*).

#### 3.3 `CoreWebVitalsDeltaGrid.tsx`
* 6 cards (LCP, FCP, TBT, CLS, Speed Index, TTFB).
* Displays Base Value $\rightarrow$ Target Value, with large highlighted Delta badge and micro progress bar indicating rating shifts (`Good` $\rightarrow$ `Poor`).

#### 3.4 `SynchronizedFilmstripDiff.tsx`
* Interactive timeline scrubber with side-by-side synchronized viewports.
* Visual difference highlighter showing exactly which frame content painted first (e.g., *"Target painted Hero Banner 450ms earlier"*).

#### 3.5 `ResourcePayloadDiffTable.tsx`
* Stacked bar chart and breakdown table comparing JavaScript, CSS, Image, Font, and Document payloads before vs. after.
* Flags newly added bundle chunks exceeding $100\text{KB}$.

#### 3.6 `OpportunitiesDiffMatrix.tsx`
* Categorizes Lighthouse audits into:
  - 🟢 **Resolved Issues** (Existed in Base, fixed in Target).
  - 🔴 **New Regressions** (Passed in Base, failed in Target).
  - 🟡 **Partial Improvements / Degradations**.

---

### Phase 4: Selection UX & Navigation Integration

#### 4.1 Dashboard Test Card Multi-Select (`components/dashboard/RecentTests.tsx`)
* Add a lightweight comparison selector bar at the top of Recent Audits.
* Clicking "Compare" on a TestCard opens a selector dropdown or selects checkbox.
* When 2 tests are selected, a floating action dock appears:
  `[ ⚖️ Compare 2 Audits ]` $\rightarrow$ navigates to `/dashboard/compare?base={id1}&target={id2}`.

#### 4.2 Single Test Report Action Bar (`components/report/ReportHeader.tsx`)
* Add a `"Compare"` action button next to PDF Export & Share.
* One-click compares the current audit with the **immediately preceding audit** on the same domain.

---

## 5. File Structure Plan

```
c:/dev/zynex/
├── app/
│   ├── dashboard/
│   │   └── compare/
│   │       └── page.tsx              # Authenticated Compare Server Component
│   ├── compare/
│   │   └── page.tsx                  # Public Shareable Compare Route
│   └── api/
│       └── test/
│           └── compare/
│               └── ai-summary/
│                   └── route.ts      # AI Regression Analysis Route Handler
├── lib/
│   └── comparison/
│       ├── types.ts                  # Delta & Comparison Types
│       ├── diff-engine.ts            # Mathematical Delta & Frame Alignment
│       └── schema.ts                 # Zod schema for AI Compare Summary
└── components/
    └── compare/
        ├── CompareHeader.tsx         # Header with Swap Action & Metadata
        ├── ExecutiveDeltaBanner.tsx  # Hero Score Delta & Speed Verdict
        ├── CoreWebVitalsDeltaGrid.tsx# 6 CWV Side-by-Side Delta Cards
        ├── SynchronizedFilmstrip.tsx # Visual Frame Matcher Timeline
        ├── ResourcePayloadDiff.tsx   # JS/CSS/Image Bloat Comparison
        ├── OpportunitiesDiffMatrix.tsx# Resolved vs New Diagnostic Audits
        ├── AiRegressionCard.tsx      # Gemini Regression Explainer
        └── CompareSelectorModal.tsx  # Dropdown / Modal to pick 2nd test
```

---

## 6. Performance, Reliability & Edge Cases

1. **Different Device Profiles**:
   - If user compares Mobile vs. Desktop, display an informational warning banner (`"Comparing Mobile vs Desktop baseline — network and CPU throttling parameters differ"`).
2. **Missing Filmstrips / Partial Failures**:
   - Fall back gracefully to metric-only diff if one test lacks full screenshot data.
3. **Database Efficiency**:
   - Query both tests concurrently via `Promise.all([prisma.test.findUnique(...), prisma.test.findUnique(...)])` using lean field selection.
4. **Instant Client-Side Navigation**:
   - Integrate with `useAppStore` so previously cached test records render in **0ms** while server validation runs.

---

## 7. Verification & Acceptance Criteria

- [ ] Selecting any two tests loads the comparison report in $< 200\text{ms}$.
- [ ] Metric polarities are 100% accurate (e.g. $-\text{LCP}$ is Green, $-\text{Score}$ is Red).
- [ ] Swapping Base $\leftrightarrows$ Target dynamically flips all deltas instantaneously.
- [ ] Filmstrip frames align accurately to equivalent timestamp increments.
- [ ] Responsive design functions flawlessly across Desktop and Mobile viewports.
- [ ] `npx tsc --noEmit` and production build pass with 0 warnings or errors.
