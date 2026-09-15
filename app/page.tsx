import { buttonVariants } from "@/components/ui/button";
import {
  Lightning,
  ArrowRight,
  CheckCircle,
  DeviceMobile,
  Globe,
  FileText,
  Clock,
  Code,
  ShieldCheck,
  Cpu,
  Gauge,
  TerminalWindow,
  ChartLineUp,
  ArrowsLeftRight,
} from "@phosphor-icons/react/dist/ssr";
import {
  KindeUser,
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs";
import getSessionUser from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const user = (await getSessionUser()) as KindeUser | null;

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-600/20 selection:text-brand-500 font-sans">
      {/* ── Top Navigation Console ─────────────────────────────────────── */}
      <header className="border-b border-border/80 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo & Engine Badge */}
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2.5 group">
                <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-500 transition-colors">
                  <Lightning weight="fill" className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold font-display tracking-tight text-foreground">
                  AuditHQ
                </span>
              </a>

              <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-md border border-border/70 bg-surface-1 text-[11px] font-mono text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-score-good animate-pulse" />
                <span>Chromium 128 / LH 12.0</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-text-secondary">
              <a
                href="#capabilities"
                className="hover:text-foreground transition-colors"
              >
                Capabilities
              </a>
              <a
                href="#pipeline"
                className="hover:text-foreground transition-colors"
              >
                Architecture
              </a>
              <a
                href="#specifications"
                className="hover:text-foreground transition-colors"
              >
                Specifications
              </a>
            </nav>

            {/* Access CTAs */}
            <div className="flex items-center space-x-3">
              <LoginLink
                className={`text-sm font-semibold text-text-secondary hover:text-foreground ${buttonVariants(
                  {
                    variant: "ghost",
                    size: "sm",
                  },
                )}`}
              >
                Sign in
              </LoginLink>
              <RegisterLink className="inline-flex items-center justify-center gap-1.5 rounded-lg text-xs sm:text-sm font-medium h-9 px-4 text-white bg-brand-600 hover:bg-brand-500 active:bg-brand-700 transition-colors cursor-pointer shadow-xs">
                <span>Start auditing</span>
                <ArrowRight weight="bold" className="h-3.5 w-3.5" />
              </RegisterLink>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero: Telemetry Console ────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Authoritative Technical Pitch */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Telemetry Status Flag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono bg-surface-1 border border-border text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-score-good" />
                <span>Cloud runner active</span>
                <span className="text-border">/</span>
                <span>Deterministic mobile profiles</span>
              </div>

              {/* Main Headline (Space Grotesk, Unified Block) */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bold font-display tracking-tight leading-[1.12] text-foreground">
                Autonomous cloud Lighthouse audits under real 4G throttling.
              </h1>

              {/* Precise Engineering Rationale */}
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
                Developer laptops mask real mobile latency, cold caches, and CPU thermal throttling. AuditHQ runs standardized headless Chrome instances in the cloud to capture sub-second Core Web Vitals, main-thread blocking time, and client-ready dossiers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-lg text-sm sm:text-base font-semibold h-11 px-6 text-white bg-brand-600 hover:bg-brand-500 active:bg-brand-700 transition-colors shadow-xs">
                  <Lightning weight="fill" className="h-4 w-4" />
                  <span>Run free cloud audit</span>
                </RegisterLink>

                <a
                  href="#capabilities"
                  className="inline-flex items-center justify-center gap-2 rounded-lg text-sm sm:text-base font-medium h-11 px-5 text-text-primary bg-surface-1 hover:bg-surface-2 border border-border transition-colors"
                >
                  <span>Explore capabilities</span>
                </a>
              </div>

              {/* Technical Specifications Bar */}
              <div className="pt-3 border-t border-border/70 grid grid-cols-3 gap-4 text-xs font-mono text-text-tertiary">
                <div>
                  <p className="text-text-primary font-semibold">100 audits</p>
                  <p className="text-[11px]">Free every month</p>
                </div>
                <div>
                  <p className="text-text-primary font-semibold">Moto G Power</p>
                  <p className="text-[11px]">Standardized viewport</p>
                </div>
                <div>
                  <p className="text-text-primary font-semibold">CDP Tracing</p>
                  <p className="text-[11px]">Sub-millisecond logs</p>
                </div>
              </div>
            </div>

            {/* Right Column: Live-Style Lighthouse Execution Monitor */}
            <div className="lg:col-span-6">
              <div className="rounded-xl border border-border bg-surface-0 shadow-lg overflow-hidden">
                {/* Console Topbar */}
                <div className="px-4 py-3 border-b border-border bg-surface-1 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-border" />
                    <span className="w-2.5 h-2.5 rounded-full bg-border" />
                    <span className="w-2.5 h-2.5 rounded-full bg-border" />
                    <span className="ml-2 text-xs font-mono text-text-secondary truncate">
                      target: https://production.app
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium score-badge-good">
                      Score: 99/100
                    </span>
                  </div>
                </div>

                {/* Execution Profile Header */}
                <div className="p-4 sm:p-5 border-b border-border/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-text-secondary">
                    <span className="text-text-primary font-semibold">Emulation Profile</span>
                    <span>Moto G Power / 4G Fast (150ms RTT, 1.6 Mbps)</span>
                  </div>

                  {/* Core Web Vitals Gauge Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="p-3 rounded-lg bg-surface-1 border border-border">
                      <p className="text-[11px] font-medium text-text-tertiary">LCP (Load)</p>
                      <p className="text-2xl font-bold font-mono text-score-good mt-0.5">0.8s</p>
                      <p className="text-[10px] font-mono text-text-secondary">Spec ≤ 2.5s</p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-1 border border-border">
                      <p className="text-[11px] font-medium text-text-tertiary">TBT (Block)</p>
                      <p className="text-2xl font-bold font-mono text-score-good mt-0.5">0ms</p>
                      <p className="text-[10px] font-mono text-text-secondary">Spec ≤ 200ms</p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-1 border border-border">
                      <p className="text-[11px] font-medium text-text-tertiary">CLS (Shift)</p>
                      <p className="text-2xl font-bold font-mono text-score-good mt-0.5">0.00</p>
                      <p className="text-[10px] font-mono text-text-secondary">Spec ≤ 0.10</p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-1 border border-border">
                      <p className="text-[11px] font-medium text-text-tertiary">FCP (Paint)</p>
                      <p className="text-2xl font-bold font-mono text-score-good mt-0.5">0.4s</p>
                      <p className="text-[10px] font-mono text-text-secondary">Spec ≤ 1.8s</p>
                    </div>
                  </div>
                </div>

                {/* Real Filmstrip Timeline Scrub */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-primary">Filmstrip Progression</span>
                    <span className="font-mono text-[11px] text-text-secondary">0.0s to 1.4s complete</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {/* Frame 1 */}
                    <div className="space-y-1">
                      <div className="h-20 sm:h-24 rounded-md border border-border bg-surface-1 flex flex-col items-center justify-center p-2 text-center">
                        <span className="w-8 h-1 bg-border rounded-full mb-1 opacity-40" />
                        <span className="w-12 h-1 bg-border rounded-full opacity-20" />
                      </div>
                      <p className="text-[11px] font-mono text-text-tertiary text-center">0.0s</p>
                    </div>

                    {/* Frame 2 */}
                    <div className="space-y-1">
                      <div className="h-20 sm:h-24 rounded-md border border-border bg-surface-1 flex flex-col items-start justify-start p-2 text-left">
                        <div className="w-6 h-1.5 bg-brand-500/60 rounded mb-2" />
                        <div className="w-full h-1 bg-border rounded mb-1" />
                        <div className="w-3/4 h-1 bg-border rounded" />
                      </div>
                      <p className="text-[11px] font-mono text-text-secondary text-center">0.4s FCP</p>
                    </div>

                    {/* Frame 3 */}
                    <div className="space-y-1">
                      <div className="h-20 sm:h-24 rounded-md border border-brand-500/40 bg-surface-1 flex flex-col items-start justify-start p-2 text-left shadow-2xs">
                        <div className="w-6 h-1.5 bg-brand-500 rounded mb-1.5" />
                        <div className="w-full h-5 bg-brand-500/10 border border-brand-500/20 rounded mb-1 flex items-center justify-center">
                          <span className="text-[8px] font-mono text-brand-600 font-bold">HERO LCP</span>
                        </div>
                        <div className="w-4/5 h-1 bg-border rounded" />
                      </div>
                      <p className="text-[11px] font-mono text-score-good font-semibold text-center">0.8s LCP</p>
                    </div>

                    {/* Frame 4 */}
                    <div className="space-y-1">
                      <div className="h-20 sm:h-24 rounded-md border border-border bg-surface-1 flex flex-col items-start justify-between p-2 text-left">
                        <div className="w-full">
                          <div className="w-6 h-1.5 bg-brand-500 rounded mb-1" />
                          <div className="w-full h-4 bg-surface-2 rounded mb-1" />
                          <div className="w-full h-1 bg-border rounded mb-0.5" />
                          <div className="w-2/3 h-1 bg-border rounded" />
                        </div>
                        <span className="text-[8px] font-mono text-score-good">Hydrated</span>
                      </div>
                      <p className="text-[11px] font-mono text-text-secondary text-center">1.4s TTI</p>
                    </div>
                  </div>
                </div>

                {/* Console Footer Telemetry Summary */}
                <div className="px-4 py-2.5 bg-surface-1 border-t border-border flex items-center justify-between text-xs font-mono text-text-tertiary">
                  <span>Main thread quiet: 820ms</span>
                  <span>Payload: 412 KB uncompressed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture: Pipeline Trace Flow ──────────────────────────── */}
      <section id="pipeline" className="py-16 sm:py-20 bg-surface-1 border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 mb-10 max-w-2xl">
            <p className="text-xs font-mono text-brand-600 dark:text-brand-400">
              ARCHITECTURE OVERVIEW
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
              Deterministic cloud audit lifecycle
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Every audit follows an immutable pipeline isolated from developer workstation interference.
            </p>
          </div>

          {/* Horizontal Trace Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Step 1 */}
            <div className="p-4 rounded-lg bg-surface-0 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold">STAGE 01</span>
                <Globe weight="bold" className="h-4 w-4 text-text-tertiary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">URL Ingestion</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Pre-flight DNS validation, SSL handshake inspection, and crawl boundary checks.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-lg bg-surface-0 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold">STAGE 02</span>
                <Cpu weight="bold" className="h-4 w-4 text-text-tertiary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Container Sandbox</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ephemeral headless Chromium container booted with pinned memory and CPU quotas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-lg bg-surface-0 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold">STAGE 03</span>
                <TerminalWindow weight="bold" className="h-4 w-4 text-text-tertiary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">CDP Emulation</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Deterministic 4G network throttle applied alongside 4x mobile CPU slowdown factor.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-lg bg-surface-0 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold">STAGE 04</span>
                <Gauge weight="bold" className="h-4 w-4 text-text-tertiary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Lighthouse 12.0</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Core Web Vitals computation, render-blocking JS identification, and asset treemap extraction.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-lg bg-surface-0 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold">STAGE 05</span>
                <FileText weight="bold" className="h-4 w-4 text-text-tertiary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Diagnostic Dossier</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Root cause AI diagnostics, shareable audit URLs, and vector PDF whitepapers generated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities: Technical Specification Matrix ───────────────── */}
      <section id="capabilities" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mb-12 max-w-2xl text-left">
          <p className="text-xs font-mono text-brand-600 dark:text-brand-400">
            DIAGNOSTIC CAPABILITIES
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-foreground">
            Precision instrumentation for engineering teams
          </h2>
          <p className="text-base text-text-secondary leading-relaxed">
            Eliminate subjective performance opinions with reproducible metrics, millisecond savings estimates, and exportable artifacts.
          </p>
        </div>

        {/* 3 Technical Capability Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel 1: Deterministic Emulation */}
          <div className="p-6 rounded-xl bg-surface-0 border border-border space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-lg bg-surface-1 border border-border flex items-center justify-center text-brand-600 dark:text-brand-400">
                <DeviceMobile weight="bold" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Deterministic mobile emulation
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Simulate standardized mobile devices under calibrated 4G network throttling and CPU downclocking to produce consistent runs without local hardware bias.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-1 border border-border/80 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Latency (RTT):</span>
                <span className="text-text-primary font-semibold">150 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Throughput:</span>
                <span className="text-text-primary font-semibold">1.638 Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">CPU Slowdown:</span>
                <span className="text-text-primary font-semibold">4x mobile scale</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Ranked Code Fixes */}
          <div className="p-6 rounded-xl bg-surface-0 border border-border space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-lg bg-surface-1 border border-border flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Code weight="bold" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Ranked opportunity analysis
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Actionable engineering recommendations ranked by estimated load time savings, identifying render-blocking scripts and oversized payloads.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-1 border border-border/80 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary truncate pr-2">Compress Hero Assets</span>
                <span className="text-score-good font-semibold shrink-0">+1.4s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary truncate pr-2">Defer Unused Bundle JS</span>
                <span className="text-score-good font-semibold shrink-0">+680ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary truncate pr-2">Eliminate Render Blocking</span>
                <span className="text-score-good font-semibold shrink-0">+320ms</span>
              </div>
            </div>
          </div>

          {/* Panel 3: Whitepaper PDFs & Sharing */}
          <div className="p-6 rounded-xl bg-surface-0 border border-border space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-lg bg-surface-1 border border-border flex items-center justify-center text-brand-600 dark:text-brand-400">
                <FileText weight="bold" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Vector dossiers & public links
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Generate clean, publication-ready vector PDF dossiers for stakeholders, or distribute immutable public audit links for friction-free peer review.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-1 border border-border/80 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Vector format:</span>
                <span className="text-text-primary font-semibold">Lossless PDF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Public URL:</span>
                <span className="text-text-primary font-semibold">Zero-auth read access</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Data retention:</span>
                <span className="text-text-primary font-semibold">Persistent history</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison Specifications ──────────────────────────────────── */}
      <section id="specifications" className="py-16 sm:py-20 bg-surface-1 border-y border-border/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 mb-10 text-left">
            <p className="text-xs font-mono text-brand-600 dark:text-brand-400">
              SPECIFICATION MATRIX
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
              Local DevTools vs. AuditHQ Cloud Runner
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-surface-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-1 text-xs font-mono text-text-secondary">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6 font-semibold">Dimension</th>
                  <th className="py-3.5 px-4 sm:px-6 font-semibold">Local Chrome DevTools</th>
                  <th className="py-3.5 px-4 sm:px-6 font-semibold text-brand-600 dark:text-brand-400">AuditHQ Cloud Sandbox</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 text-xs sm:text-sm font-sans">
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-text-primary">Execution Host</td>
                  <td className="py-3.5 px-4 sm:px-6 text-text-secondary">Developer workstation (variable CPU load)</td>
                  <td className="py-3.5 px-4 sm:px-6 text-foreground font-medium">Standardized cloud container</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-text-primary">Network Throttling</td>
                  <td className="py-3.5 px-4 sm:px-6 text-text-secondary">Application-level simulation</td>
                  <td className="py-3.5 px-4 sm:px-6 text-foreground font-medium">Deterministic CDP traffic shaping</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-text-primary">Historical Tracking</td>
                  <td className="py-3.5 px-4 sm:px-6 text-text-secondary">Lost upon tab close</td>
                  <td className="py-3.5 px-4 sm:px-6 text-foreground font-medium">Persistent timeline & regression deltas</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-text-primary">Collaboration</td>
                  <td className="py-3.5 px-4 sm:px-6 text-text-secondary">Manual screenshot / HTML export</td>
                  <td className="py-3.5 px-4 sm:px-6 text-foreground font-medium">Public URL & vector PDF dossier</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Pre-Footer Action Callout ──────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-surface-0 p-8 sm:p-12 text-left space-y-6 shadow-md">
            <div className="space-y-2">
              <span className="text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold">
                EXECUTION ACCESS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
                Begin benchmarking your web applications.
              </h2>
              <p className="text-sm sm:text-base text-text-secondary max-w-xl leading-relaxed">
                Run automated cloud audits in 20 seconds. 100 free tests every month with zero credit card setup.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-lg text-sm sm:text-base font-semibold h-11 px-6 text-white bg-brand-600 hover:bg-brand-500 active:bg-brand-700 transition-colors shadow-xs">
                <span>Start auditing free</span>
                <ArrowRight weight="bold" className="h-4 w-4" />
              </RegisterLink>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-text-tertiary">
              <span>Ready in 20 seconds</span>
              <span className="text-border">/</span>
              <span>No credit card required</span>
              <span className="text-border">/</span>
              <span>100 free audits monthly</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Minimalist Engineering Footer ─────────────────────────────── */}
      <footer className="border-t border-border bg-surface-0 py-8 text-xs font-mono text-text-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 rounded bg-brand-600 flex items-center justify-center text-white">
              <Lightning weight="fill" className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-foreground font-display text-sm">AuditHQ</span>
            <span className="text-border">|</span>
            <span>Web Performance Telemetry</span>
          </div>

          <div className="flex items-center space-x-6 text-text-secondary">
            <span>Chromium 128</span>
            <span>Lighthouse 12.0</span>
            <span>© {new Date().getFullYear()} AuditHQ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
