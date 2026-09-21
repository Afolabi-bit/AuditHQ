# ⚡ AuditHQ — UI/UX Master Specification & Upgrade Blueprint
> **Scope:** Complete UI/UX Modernization for All Pages Barring the Landing Page  
> **Target Platform:** Next.js 16 App Router · React 19 · Tailwind CSS v4 · Phosphor Icons · Radix UI  
> **Design Intelligence Profile:** `ui-ux-pro-max` (Precision Tech / High-Density SaaS / Obsidian Slate)  
> **Source of Truth Location:** `design-system/zynex/MASTER.md`

---

## 1. Executive Summary & Design Vision

AuditHQ is a web performance intelligence and Core Web Vitals telemetry platform delivering Lighthouse 12.0 diagnostics, real-time audit regression comparisons, and AI-powered root-cause remediation.

While the landing page (`app/page.tsx`) already has its dedicated visual rhythm, the internal application pages currently exhibit:
1. **Cognitive Overload & Density Friction**: The audit report and comparison views present extensive telemetry simultaneously in heavy border-nested boxes.
2. **Ergonomic & Touch Deficits**: Critical mobile actions (e.g., "View Report" in `TestCard.tsx`, drawer dismissals) lack sufficient touch target buffers ($\ge 44\times 44\text{px}$) and contrast.
3. **Dark Mode Vibrancy Mismatch**: Dark theme surfaces require a unified Obsidian Slate scale with calibrated semi-transparent borders (`border-border/60`) and WCAG AAA compliant text contrast.

### Core Design Principles

```
   ┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
   │ Precision Tech Slate   │     │ Progressive Disclosure │     │ Ergonomic Affordance   │
   │ Obsidian Dark / Crisp  │ ──> │ Overview -> Deep-Dive  │ ──> │ ≥ 44px Touch Targets   │
   │ 4/8dp Spatial Rhythm   │     │ Slide-out Drawer Sheet │     │ High-Contrast Primary  │
   └────────────────────────┘     └────────────────────────┘     └────────────────────────┘
```

- **Archetype**: Precision Engineering / Developer Tool Console (inspired by Linear, Vercel, and Raycast).
- **Tone**: Professional, authoritative, high-efficiency, visually calm.
- **Brand Consistency**: 100% unified under **AuditHQ**.

---

## 2. Design Dials & System Foundations

Using the `ui-ux-pro-max` configuration matrix:

| Dial | Setting | Value | Implementation Rationale |
| :--- | :---: | :---: | :--- |
| **Density** | **8 / 10** | High / Compact | High-efficiency data tables, compact metrics grids, and dense technical telemetry without visual clutter. |
| **Motion** | **4 / 10** | Subtle / Functional | 100–150ms spring/ease micro-interactions. Zero gratuitous animation. Full `prefers-reduced-motion` compliance. |
| **Variance** | **6 / 10** | Structured Bento | Cohesive Bento-grid layout structures with clear visual hierarchy, soft corners, and unified surface elevations. |

---

## 3. Global Tokens & Theme System (`globals.css`)

### 3.1 Color Palette & Contrast Tokens

```css
/* ==========================================================================
   ZYNEX PRECISION TOKENS (Tailwind CSS v4 @theme inline)
   ========================================================================== */

@theme inline {
  /* Fonts */
  --font-sans: var(--font-sans), "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display: var(--font-display), "Space Grotesk", sans-serif;
  --font-mono: var(--font-mono), "JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", monospace;

  /* Surfaces & Canvas */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface-0: var(--surface-0);
  --color-surface-1: var(--surface-1);
  --color-surface-2: var(--surface-2);
  --color-surface-3: var(--surface-3);

  /* Primary Brand Scale (Precision Cobalt) */
  --color-brand-50: var(--brand-50);
  --color-brand-100: var(--brand-100);
  --color-brand-500: var(--brand-500);
  --color-brand-600: var(--brand-600);
  --color-brand-700: var(--brand-700);

  /* Lighthouse Semantic Score Scales (Calibrated for WCAG AA/AAA) */
  --color-score-good: var(--score-good);
  --color-score-warn: var(--score-warn);
  --color-score-poor: var(--score-poor);
  --color-score-neutral: var(--score-neutral);

  /* Text Hierarchies */
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);

  /* Elevation Shadows */
  --shadow-2xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-sm: 0 2px 5px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.12);
  --shadow-brand: 0 2px 8px rgba(37, 99, 235, 0.25);
}

:root {
  /* Light Mode (Crisp Minimalist Canvas) */
  --background: #f8fafc;
  --foreground: #0f172a;
  --surface-0: #ffffff;
  --surface-1: #f1f5f9;
  --surface-2: #e2e8f0;
  --surface-3: #cbd5e1;

  --card: #ffffff;
  --card-foreground: #0f172a;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #2563eb;

  --brand-50: #eff6ff;
  --brand-100: #dbeafe;
  --brand-500: #3b82f6;
  --brand-600: #2563eb;
  --brand-700: #1d4ed8;

  --score-good: #059669;
  --score-warn: #d97706;
  --score-poor: #dc2626;
  --score-neutral: #64748b;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
}

.dark {
  /* Dark Mode (Aligned with Landing Page: Deep Obsidian Black + Whisper-Soft Borders) */
  --background: #05070a;
  --foreground: #ffffff;
  --surface-0: #0c0e14;
  --surface-1: #12151d;
  --surface-2: #191d27;
  --surface-3: rgba(255, 255, 255, 0.07);

  --card: #0c0e14;
  --card-foreground: #ffffff;
  --border: rgba(255, 255, 255, 0.07);
  --input: rgba(255, 255, 255, 0.09);
  --ring: #2563eb;

  --brand-50: rgba(37, 99, 235, 0.08);
  --brand-100: rgba(37, 99, 235, 0.15);
  --brand-200: rgba(37, 99, 235, 0.25);
  --brand-500: #3b82f6;
  --brand-600: #2563eb;
  --brand-700: #1d4ed8;

  --score-good: #10b981;
  --score-warn: #f59e0b;
  --score-poor: #ef4444;
  --score-neutral: rgba(255, 255, 255, 0.45);

  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.65);
  --text-tertiary: rgba(255, 255, 255, 0.40);
}
```

### 3.2 Anti-Sharp Borders & Soft Elevation Architecture
- **No Heavy Border Outlines**: Avoid stark opaque border lines (`border-slate-700`, `border-2`, or high-contrast grey lines). Use whisper-soft translucent borders (`rgba(255, 255, 255, 0.07)`).
- **No Box-in-a-Box Clutter**: Prevent visual claustrophobia by removing redundant inner borders. Separate nested sections using subtle background contrast (`--surface-0` vs `--surface-1`) and spatial padding (`gap-4`, `p-5`) rather than nested border lines.
- **Generous Corner Radii**: Replace sharp corners (`rounded-none`, `rounded-sm`) with soft modern geometry:
  - Cards & Containers: `rounded-2xl`
  - Tiles & Inner Elements: `rounded-xl`
  - Interactive Badges & Pills: `rounded-full` (capsule geometry)

### 3.3 Spacing & Density Tokens (8/10 Density Scale)

| Token | Pixels | Application |
| :--- | :---: | :--- |
| `--space-2xs` | 4px | Micro badges, status dot offsets, pill padding |
| `--space-xs` | 8px | Button inline gaps, icon gaps, compact card padding |
| `--space-sm` | 12px | Table cell insets, compact grid gaps |
| `--space-md` | 16px | Standard card interior padding, navigation insets |
| `--space-lg` | 24px | Section dividers, header margins |
| `--space-xl` | 32px | Major container gaps, modal margins |
| `--space-2xl` | 48px | Page-level vertical flow spacers |

---

## 4. Non-Landing Pages Upgrade Blueprint

### 4.1 Global Navigation & App Shell
*Files: `components/dashboard/DashboardNav.tsx`, `app/dashboard/layout.tsx`*

#### Current Deficits
- Brand title shows `AuditHQ` instead of `Zynex`.
- Nav links lack keyboard focus ring indicators.
- User profile menu on the right does not provide a direct quick-menu dropdown for theme switching or instant log out on desktop.
- Mobile viewport navigation can wrap or push elements into tight 320px screens.

#### Upgrade Specifications
1. **Brand Identity**:
   - Retain logo text `AuditHQ` with brand symbol: Lightning glyph in high-grade cobalt rounded square (`h-8 w-8 rounded-xl bg-brand-600 text-white shadow-xs shadow-brand-500/20`).
   - Add version/environment badge `v1.2` in `text-[10px] font-mono text-text-tertiary px-1.5 py-0.5 rounded bg-surface-1`.
2. **Navigation Tabs**:
   - Active Tab: `bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-200 dark:border-brand-500/30`.
   - Inactive Tab: `text-text-secondary hover:text-text-primary hover:bg-surface-1 transition-colors`.
   - Quick command trigger chip: Add a compact `Cmd+K` / `Ctrl+K` visual chip indicating quick audit search.
3. **User Profile Dropdown**:
   - Replace simple link with a sleek popover or streamlined profile menu button with avatar fallback, email tooltip, and keyboard-navigable links to `/profile` and Sign Out.
4. **Mobile Responsiveness**:
   - Sticky top bar with `backdrop-blur-xl bg-surface-0/80 border-b border-border/80`.
   - Mobile tap targets $\ge 44\times 44\text{px}$ for all nav items.

---

### 4.2 Dashboard Console Page
*Files: `app/dashboard/page.tsx`, `components/dashboard/Welcome.tsx`, `components/dashboard/StatsOverviewCards.tsx`, `components/dashboard/NewTest.tsx`, `components/dashboard/AnalyticsAndRecentTabs.tsx`, `components/dashboard/RecentTests.tsx`, `components/dashboard/TestCard.tsx`, `components/dashboard/DomainGroupCard.tsx`, `components/dashboard/PerformanceTrajectoryChart.tsx`*

#### Current Deficits
- `Welcome.tsx` is plain text without quick-launch context.
- `StatsOverviewCards.tsx` uses plain numbers without visual delta sparklines or benchmarks.
- `NewTest.tsx` input bar has bulky borders and awkward wrapping on tablet.
- `TestCard.tsx` has a low-contrast "View Report" CTA that is easily lost on small screens, and FCP/LCP/TBT/CLS tiles use flat grey boxes.
- `PerformanceTrajectoryChart.tsx` lacks fluid tooltips and accessibility labels for screen readers.

#### Upgrade Specifications

#### A. Greeting & Platform Command (`Welcome.tsx`)
- Command-center header style: Display greeting (`Welcome back, {name}`) alongside a live status pill (`All telemetry pipelines active`).
- Show date/time in `font-mono text-xs text-text-tertiary`.

#### B. KPI Stat Overview Cards (`StatsOverviewCards.tsx`)
- 4 Bento Cards: **Total Audits**, **Average Performance Score**, **Top Audited Domain**, **Passing Core Web Vitals Rate**.
- Card Structure:
  - Top: Label (`text-xs font-semibold text-text-secondary uppercase tracking-wider`) + contextual icon in soft tinted container.
  - Middle: Big metric number in `font-mono text-2xl sm:text-3xl font-bold text-text-primary`.
  - Bottom: Delta pill (e.g., `+4.2% vs last month` in `text-score-good` or neutral trend indicator).
- Hover effect: Subtle `shadow-sm hover:border-brand-500/40 transition-all duration-150`.

#### C. Audit Launcher Bar (`NewTest.tsx`)
- **Ergonomic Command Input**:
  - Unified input capsule: Left icon `Globe`, clean URL input field, segment toggles for `Desktop / Mobile` and `Network Throttling`, and a prominent `Run Audit` button.
  - URL input auto-cleans pasted URLs (removes trailing slashes and spaces).
  - Validation: Inline error message near the field (`text-xs text-score-poor flex items-center gap-1.5`).
  - Active submission state: Animated spinner with clear contextual phase copy (`"Initiating headless Chrome trace…"`).

#### D. Recent Tests & History System (`RecentTests.tsx`, `TestCard.tsx`)
- **Prominent "View Report" CTA in `TestCard.tsx`**:
  - Move CTA into a dedicated high-contrast action slot: `h-11 sm:h-9 px-5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-xs shadow-brand-500/20 cursor-pointer flex items-center justify-center gap-2`.
  - Minimum touch target: Guarantee $44\text{px}$ minimum height on mobile.
- **Metric Tiles (FCP, LCP, TBT, CLS)**:
  - Use subtle color-coded micro status indicators (green/amber/red dots) so metric performance is legible at a glance without reading raw thresholds.
  - Font: Strict `font-mono` for numeric values (`1.2s`, `42ms`, `0.02`).
- **Domain Filter & Search**:
  - Add search input by URL and quick filter chips (`All`, `Mobile`, `Desktop`, `Good (90+)`, `Failed`).

#### E. Historical Trajectory Chart (`PerformanceTrajectoryChart.tsx`)
- SVG line chart with gradient fill under the curve.
- Interactive hover crosshair with smooth floating tooltip showing Date, URL, Device, and Lighthouse Score.
- Fallback empty state: Polished illustration + clear prompt to run the first audit.

---

### 4.3 Audit Performance & Diagnostics Report View
*Files: `app/report/[id]/page.tsx` (Public), `app/dashboard/test/[id]/page.tsx` (Private), `components/report/TestReportView.tsx`, `components/report/ReportHeader.tsx`, `components/report/CategoryScoreRings.tsx`, `components/report/CoreWebVitalsGrid.tsx`, `components/report/AiInsightsCard.tsx`, `components/report/VisualExperience.tsx`, `components/report/ReportTabs.tsx`, `components/report/OpportunitiesTab.tsx`, `components/report/DiagnosticsTab.tsx`, `components/report/NetworkPayloadTab.tsx`, `components/report/SecurityTab.tsx`, `components/report/AuditsListTab.tsx`, `components/report/DiagnosticInspectorDrawer.tsx`*

#### Current Deficits
- Executive summary is buried beneath multiple rows of buttons and cards.
- The 4 category score rings take up excessive vertical space on mobile devices.
- Visual filmstrip does not offer an enlarged lightbox preview.
- Diagnostic drawer closes abruptly without clear keyboard focus traps and smooth exit transitions.
- PDF export menu lacks visual download progress indication.

#### Upgrade Specifications

#### A. Public Announcement Banner vs Private Header (`ReportHeader.tsx`)
- **Public Banner**: Modern glassmorphic banner stating: `Public Zynex Telemetry Snapshot · Read-Only View` with an animated pulse dot and a clean CTA `Run Audit on Your Site →`.
- **Report Actions Header**:
  - Left: Back breadcrumb `← Console`, audited URL in bold with external link icon, timestamp, and device/network pill badges.
  - Right: Quick Action cluster:
    - **Compare Runs Button**: `Button variant="outline"` with `ArrowsLeftRight` icon. Opens run selector modal.
    - **Export PDF Dropdown**: Clean dropdown with 3 options: *Executive Summary (1-Page)*, *Engineering Technical Report*, *Full Audit Snapshot*. Shows spinner while generating.
    - **Share Button**: Copies public URL with toast notification and temporary checkmark icon.

#### B. Category Score Gauges (`CategoryScoreRings.tsx`, `ScoreGauge.tsx`)
- 4 Circular SVG Progress Gauges: **Performance**, **Accessibility**, **Best Practices**, **SEO**.
- Visuals:
  - Background track: `stroke-surface-2` or `rgba(255,255,255,0.06)`.
  - Foreground animated track: Color mapped to score threshold:
    - `90–100`: `stroke-score-good`
    - `50–89`: `stroke-score-warn`
    - `0–49`: `stroke-score-poor`
  - Center: Score number in `font-display text-2xl sm:text-3xl font-bold`.
  - Subtext: Clear classification badge below ring (`Good`, `Needs Improvement`, `Poor`).

#### C. Core Web Vitals Grid (`CoreWebVitalsGrid.tsx`)
- 4 Bento Cards for Key Web Vitals:
  1. **LCP (Largest Contentful Paint)**: Target $\le 2.5\text{s}$
  2. **FCP (First Contentful Paint)**: Target $\le 1.8\text{s}$
  3. **TBT (Total Blocking Time)**: Target $\le 200\text{ms}$
  4. **CLS (Cumulative Layout Shift)**: Target $\le 0.1$
- Each card displays:
  - Metric acronym + Full name.
  - Current value in big `font-mono`.
  - Benchmark gauge/scale with marker showing where this site lands relative to Google's 75th percentile threshold.
  - Brief non-technical explanation: e.g., *"Measures visual loading speed."*

#### D. AI Diagnostics & Remediation Card (`AiInsightsCard.tsx`)
- Linear-style AI card with a subtle gradient border (`border-brand-500/20 bg-surface-0`).
- Header: Sparkle/AI icon + *"Zynex AI Diagnostics & Remediation Plan"*.
- Body:
  - Structured Markdown rendering with clean hierarchy: Problem summary, Root causes, and Concrete code snippets.
  - Code blocks in `JetBrains Mono` with one-click copy button.
  - Estimated impact chips: `Saves ~1.4s LCP`, `Reduces 420KB JS`.

#### E. Filmstrip Progression Scrubber (`VisualExperience.tsx`)
- Timeline scrubber showing visual paint progress from $0\text{ms}$ to interactive state.
- Hover or drag thumb to view frame progression.
- Click to expand any frame in a modal lightbox.

#### F. Technical Deep-Dive Tabs & Inspector Drawer
- Tabs: **Opportunities**, **Diagnostics**, **Network Payloads**, **Accessibility & SEO**, **Security**, **All Audits**.
- Table improvements:
  - Sticky table headers with subtle border separators.
  - Filter by resource type (Scripts, Images, Fonts, Third-Party).
  - Search filter input to find specific requests or audit IDs.
- **Diagnostic Inspector Drawer (`DiagnosticInspectorDrawer.tsx`)**:
  - Accessible slide-over sheet (`role="dialog" aria-modal="true"`).
  - Close on `Escape` key, click outside backdrop, or `Close` button.
  - Detailed breakdown of offending DOM nodes, resource waterfall details, and Lighthouse audit suggestions.

---

### 4.4 Audit Comparison & Regression Engine
*Files: `app/compare/page.tsx` (Public), `app/dashboard/compare/page.tsx` (Private), `components/compare/CompareReportView.tsx`, `components/compare/CompareHeader.tsx`, `components/compare/CompareSelectorModal.tsx`, `components/compare/ExecutiveDeltaBanner.tsx`, `components/compare/CoreWebVitalsDeltaGrid.tsx`, `components/compare/AiRegressionCard.tsx`, `components/compare/SynchronizedFilmstrip.tsx`, `components/compare/ResourcePayloadDiff.tsx`, `components/compare/OpportunitiesDiffMatrix.tsx`*

#### Current Deficits
- Hard to distinguish Base vs Target runs when URLs are identical.
- Delta banner can be confusing if negative score changes are not immediately distinguishable from metric time changes (where a negative number is good).
- Filmstrip frames are misaligned on smaller screens.
- Opportunities matrix table overflows horizontally on screens $< 1024\text{px}$.

#### Upgrade Specifications

#### A. Run Switcher & Header (`CompareHeader.tsx`, `CompareSelectorModal.tsx`)
- **Base vs Target Card**:
  - Side-by-side run badges with clear identifiers:
    - **Base Run (Before)**: Inset blue tint badge with date/time, score, device.
    - **Target Run (After)**: Inset violet tint badge with date/time, score, device.
  - Center **Swap Button**: Circular button with `ArrowsLeftRight` icon. Clicking triggers a smooth $180^\circ$ rotation micro-interaction and swaps base $\leftrightarrow$ target parameters.
  - Change Run button: Opens a searchable modal listing historical tests for this domain.

#### B. Executive Net Delta Hero (`ExecutiveDeltaBanner.tsx`)
- Prominent net result pill:
  - If performance improved: Green banner with `TrendingUp` icon, e.g. `+16 Points Net Improvement (64 → 80)`.
  - If performance regressed: Amber/Red banner with `TrendingDown` icon, e.g. `-12 Points Regression Detected (85 → 73)`.
  - Explanatory subtitle summarizing the single biggest driver of change (e.g., *"Regression caused by 350KB uncompressed bundle addition in target run."*).

#### C. Core Web Vitals Delta Grid (`CoreWebVitalsDeltaGrid.tsx`)
- 4 Side-by-Side Comparison Cards (FCP, LCP, TBT, CLS):
  - Base Value $\rightarrow$ Target Value.
  - Net Delta Badge: Uses sensible polarity:
    - Faster time / lower shift = **Green** (e.g., `-0.8s LCP`).
    - Slower time / higher shift = **Red** (e.g., `+420ms TBT`).
  - Progress gauge showing visual movement.

#### D. AI Comparative Regression Reasoning (`AiRegressionCard.tsx`)
- Specialized AI analysis answering:
  1. *What changed between these two runs?*
  2. *Which scripts or assets introduced blocking time?*
  3. *Actionable roll-back or patch recommendations.*

#### E. Synchronized Filmstrip Player (`SynchronizedFilmstrip.tsx`)
- Dual-track filmstrip with synchronized playhead:
  - Track A (Base) and Track B (Target) running in lockstep at $100\text{ms}$ increments.
  - Side-by-side frame comparison slider.

#### F. Network Payload Bloat Diff (`ResourcePayloadDiff.tsx`)
- Segmented bar chart comparing total bytes by asset type:
  - JavaScript, CSS, Images, Fonts, Other.
  - Delta column indicating $+/-$ KB and percentage change.

#### G. Opportunities Diff Matrix (`OpportunitiesDiffMatrix.tsx`)
- 3 Tabbed/Filtered categories:
  1. **Resolved Opportunities**: Bottlenecks fixed in Target run.
  2. **New Bottlenecks**: Performance regressions introduced in Target run.
  3. **Unchanged Opportunities**: Ongoing issues present in both runs.
- Mobile table layout: Switches to stacked cards on viewports $< 768\text{px}$ to eliminate horizontal scrolling.

---

### 4.5 User Profile & Account Settings
*Files: `app/profile/page.tsx`, `components/dashboard/ProfileSettingsView.tsx`, `components/dashboard/ThemeSelector.tsx`, `components/dashboard/SignOutButton.tsx`*

#### Current Deficits
- Setting views are crammed into a generic container.
- Theme selector uses basic radio cards without visual preview chips of the actual theme palettes.
- Plan quota meters lack visual warning thresholds when approaching monthly limits.

#### Upgrade Specifications

#### A. Layout & Section Tabs
- Clean settings layout with top/left navigation tabs:
  1. **Profile & Identity** (Name, email, avatar, connected accounts).
  2. **Appearance & Display** (Theme selector, high-contrast toggle, animations toggle).
  3. **Usage & Quotas** (Monthly audit limits, storage consumption, tier upgrades).
  4. **Security & Sessions** (Session tokens, active devices, sign out).

#### B. Theme Selector Experience (`ThemeSelector.tsx`)
- 3 Visual Interactive Cards:
  - **Light Mode**: White card preview with soft grey lines.
  - **Dark Mode**: Obsidian black card preview with blue accent dot.
  - **System Default**: Half light / half dark preview.
- Active state: Distinct 2px brand ring + checkmark badge.

#### C. Quota & Usage Gauges
- Progress bar displaying: `{used} / {total} Audits Used this Month`.
- Dynamic color:
  - $< 75\%$: Brand cobalt.
  - $75\% - 90\%$: Warning amber.
  - $> 90\%$: Poor / danger red.

---

## 5. Pre-Delivery Quality Checklist (Canonical)

Every page and component must be checked against this list before shipping:

### 1. Accessibility (CRITICAL)
- [ ] Text contrast $\ge 4.5:1$ for normal text, $\ge 3:1$ for large text and non-text interactive borders.
- [ ] Focus rings (`ring-2 ring-brand-500 ring-offset-2`) visible on all interactive elements via keyboard tab navigation.
- [ ] Icon-only buttons (close, swap, copy, share) have explicit `aria-label` attributes.
- [ ] Slide-out drawers and modals have proper ARIA dialog attributes, trap focus, and close on `Escape`.
- [ ] Semantic HTML (`<main>`, `<nav>`, `<h1>`–`<h3>`, `<table>`) used throughout; no skip-level headings.

### 2. Touch & Ergonomics (CRITICAL)
- [ ] All interactive buttons and touch targets are $\ge 44\times 44\text{px}$ on touch devices.
- [ ] Touch targets have at least $8\text{px}$ spacing between adjacent targets.
- [ ] All button states provide immediate feedback ($\le 100\text{ms}$) on tap/click.
- [ ] No reliance on hover-only interactions for core features.

### 3. Performance & Stability (HIGH)
- [ ] Zero layout shift during data loading (CLS $< 0.1$); dynamic skeletons match exact card dimensions.
- [ ] Heavy data tables (e.g. audit opportunity items) virtualized or paginated if $> 50$ rows.
- [ ] SVGs optimized; no heavy uncompressed images.

### 4. Style & Consistency (HIGH)
- [ ] All pages use unified "Zynex" branding. Zero traces of "AuditHQ".
- [ ] Vector icons only (`@phosphor-icons/react` or Lucide); zero emojis used as UI icons.
- [ ] Color values use design tokens (`var(--brand-600)`, `var(--score-good)`), no ad-hoc hardcoded hex values.

### 5. Responsive Layout (HIGH)
- [ ] Tested on $375\text{px}$ (mobile), $768\text{px}$ (tablet), and $1280\text{px}$ (desktop).
- [ ] Zero horizontal page overflow on mobile devices.
- [ ] Sticky elements respect top/bottom safe-area insets.

---

## 6. Implementation Rollout Phases

```
   Phase 1: Shell & Tokens      Phase 2: Console       Phase 3: Reports        Phase 4: Compare       Phase 5: Settings
  ┌───────────────────────┐   ┌───────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
  │ • globals.css tokens  │   │ • Welcome header  │   │ • Header & Gauges│   │ • Swap Header    │   │ • Theme Selector │
  │ • DashboardNav rebrand│──>│ • Stats Bento     │──>│ • Web Vitals Grid│──>│ • Net Delta Hero │──>│ • Usage Gauges   │
  │ • Brand name purge    │   │ • NewTest bar     │   │ • AI Card        │   │ • Delta Matrix   │   │ • Profile Tabs   │
  │ • Base UI components  │   │ • TestCard CTA    │   │ • Tabs & Drawers │   │ • Dual Filmstrip │   │ • Accessibility  │
  └───────────────────────┘   └───────────────────┘   └──────────────────┘   └──────────────────┘   └──────────────────┘
```

1. **Phase 1: Global Shell & Tokens**: Update `globals.css` with calibrated Obsidian Dark and Crisp Light tokens. Rebrand `DashboardNav.tsx` and purge legacy names across non-landing routes.
2. **Phase 2: Dashboard Console**: Polish `Welcome.tsx`, Bento stat cards in `StatsOverviewCards.tsx`, command input in `NewTest.tsx`, and prominent CTA in `TestCard.tsx`.
3. **Phase 3: Audit Performance & Diagnostics Report**: Upgrade `ReportHeader.tsx`, `CategoryScoreRings.tsx`, `CoreWebVitalsGrid.tsx`, `AiInsightsCard.tsx`, and `DiagnosticInspectorDrawer.tsx`.
4. **Phase 4: Comparison & Regression Engine**: Overhaul `CompareHeader.tsx`, `ExecutiveDeltaBanner.tsx`, `CoreWebVitalsDeltaGrid.tsx`, `SynchronizedFilmstrip.tsx`, and `OpportunitiesDiffMatrix.tsx`.
5. **Phase 5: User Profile & Settings**: Modernize `ProfileSettingsView.tsx`, `ThemeSelector.tsx`, and usage quota indicators.
6. **Phase 6: Quality Control Pass**: Full validation of WCAG 2.2 AA contrast, keyboard tab order, touch targets, and zero-CLS skeleton transitions.
