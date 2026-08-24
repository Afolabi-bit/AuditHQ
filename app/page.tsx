import { buttonVariants } from "@/components/ui/button";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Activity,
  Globe,
  FileText,
  Clock,
  Sparkles,
  Layers,
  ShieldCheck,
} from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-600/20 selection:text-brand-500">
      {/* ── 1. Top Navigation Bar ─────────────────────────────────────────── */}
      <nav className="border-b border-border bg-surface-0/90 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8.5 w-8.5 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs">
                <Zap className="h-4.5 w-4.5 fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-text-primary">
                AuditHQ
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-text-secondary">
              <a
                href="#features"
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                How It Works
              </a>
            </div>

            {/* CTAs */}
            <div className="flex items-center space-x-3">
              <LoginLink
                className={`text-sm font-semibold text-text-secondary hover:text-text-primary ${buttonVariants(
                  {
                    variant: "ghost",
                    size: "sm",
                  },
                )}`}
              >
                Log In
              </LoginLink>
              <RegisterLink className="inline-flex items-center justify-center gap-1.5 rounded-xl text-xs sm:text-sm font-semibold h-9 px-4 text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-xs shadow-brand-500/20 transition-all active:scale-[0.98]">
                <span>Start Free</span>
                <ArrowRight className="h-4 w-4" />
              </RegisterLink>
            </div>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 border border-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/30">
            <Activity className="h-3.5 w-3.5" />
            <span>Autonomous Web Performance Intelligence</span>
            <span className="text-text-tertiary">|</span>
            <span className="text-text-secondary font-medium">
              Lighthouse 12.0
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.1] text-text-primary">
            Automate Your{" "}
            <span className="text-brand-600 dark:text-brand-400">Lighthouse Audits</span>{" "}
            <br className="hidden sm:inline" />
            at Production Scale
          </h1>

          {/* Simple Explanation */}
          <p className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            We test your website in the cloud under real mobile network conditions, diagnose what&apos;s slowing it down, and provide actionable framework fixes.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-3">
            <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-xl text-sm sm:text-base font-semibold h-12 px-8 text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-xs shadow-brand-500/25 transition-all active:scale-[0.98]">
              <span>Audit Your Site Free (20s)</span>
              <ArrowRight className="h-4 w-4" />
            </RegisterLink>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-xl text-sm sm:text-base font-semibold h-12 px-6 text-text-primary bg-surface-0 hover:bg-surface-1 border border-border transition-colors shadow-2xs"
            >
              <span>See How It Works</span>
            </a>
          </div>

          {/* Friction-Free Reassurance */}
          <p className="text-xs text-text-tertiary font-medium">
            100 free audits/month · No credit card required · Instant results
          </p>

          {/* Clean Metric Card Preview */}
          <div className="pt-6 max-w-3xl mx-auto text-left">
            <div className="bg-surface-0 border border-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3 text-xs">
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="w-2 h-2 rounded-full bg-score-good animate-pulse" />
                  <span className="font-semibold text-text-primary">
                    yourwebsite.com
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold score-badge-good">
                  Performance: 99/100
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-surface-1 rounded-xl border border-border">
                  <p className="text-[11px] text-text-tertiary uppercase font-semibold">
                    Speed Score
                  </p>
                  <p className="text-2xl font-bold font-mono text-score-good mt-0.5">
                    99/100
                  </p>
                  <p className="text-[11px] text-score-good font-medium">
                    Optimal
                  </p>
                </div>
                <div className="p-3.5 bg-surface-1 rounded-xl border border-border">
                  <p className="text-[11px] text-text-tertiary uppercase font-semibold">
                    Load Time
                  </p>
                  <p className="text-2xl font-bold font-mono text-text-primary mt-0.5">
                    0.8s
                  </p>
                  <p className="text-[11px] text-score-good font-medium">Fast</p>
                </div>
                <div className="p-3.5 bg-surface-1 rounded-xl border border-border">
                  <p className="text-[11px] text-text-tertiary uppercase font-semibold">
                    Input Lag
                  </p>
                  <p className="text-2xl font-bold font-mono text-text-primary mt-0.5">
                    0ms
                  </p>
                  <p className="text-[11px] text-score-good font-medium">
                    Instant
                  </p>
                </div>
                <div className="p-3.5 bg-surface-1 rounded-xl border border-border">
                  <p className="text-[11px] text-text-tertiary uppercase font-semibold">
                    Layout Shift
                  </p>
                  <p className="text-2xl font-bold font-mono text-text-primary mt-0.5">
                    0.00
                  </p>
                  <p className="text-[11px] text-score-good font-medium">
                    Stable
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-text-tertiary uppercase tracking-wider font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-score-good" />
              10,000+ AUDITS RUN
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-score-good" />
              REAL MOBILE TESTING
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-score-good" />
              ZERO SETUP NEEDED
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. Bento Grid Section ─────────────────────────────────────────── */}
      <section
        id="features"
        className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center space-y-2 mb-12">
          <p className="text-xs font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Why AuditHQ
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Stop guessing why your site is slow
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto">
            High-speed dev laptops hide lag. We test in the cloud under
            real-world mobile conditions to show what your users actually
            experience.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Cloud Precision (2/3 width) */}
          <div className="md:col-span-2 rounded-2xl bg-surface-0 border border-border p-6 sm:p-8 shadow-xs hover:border-brand-200 dark:hover:border-brand-500/30 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Real Mobile Testing. Zero False Positives.
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-lg">
                We simulate real mobile devices and network throttling in the
                cloud so you get consistent, reproducible benchmarks every
                single run.
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-surface-1 border border-border p-4 text-xs space-y-2 text-text-secondary">
              <div className="text-score-good font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Uncovers oversized images & render-blocking scripts</span>
              </div>
              <div className="text-text-primary font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" />
                <span>Measures real Core Web Vitals metrics (LCP, TBT, CLS)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Ranked Action Plan (1/3 width) */}
          <div className="rounded-2xl bg-surface-0 border border-border p-6 sm:p-8 shadow-xs hover:border-brand-200 dark:hover:border-brand-500/30 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                Ranked Fixes
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                See the exact code changes that save the most milliseconds,
                ordered by impact.
              </p>
            </div>

            <div className="mt-5 rounded-xl bg-surface-1 p-3.5 text-xs text-text-primary border border-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary truncate">
                  Compress Hero Assets
                </span>
                <span className="text-score-good font-bold font-mono">+1.4s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary truncate">
                  Defer Unused JS
                </span>
                <span className="text-score-good font-bold font-mono">+680ms</span>
              </div>
            </div>
          </div>

          {/* Card 3: Executive PDF Reports (1/3 width) */}
          <div className="rounded-2xl bg-surface-0 border border-border p-6 sm:p-8 shadow-xs hover:border-brand-200 dark:hover:border-brand-500/30 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                Export PDF Reports
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Generate clean, professional PDF summaries for clients,
                executives, or team reviews in one click.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-border flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 gap-1.5">
              <span>Instant PDF Export</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 4: Shareable Links (2/3 width) */}
          <div className="md:col-span-2 rounded-2xl bg-surface-0 border border-border p-6 sm:p-8 shadow-xs hover:border-brand-200 dark:hover:border-brand-500/30 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Shareable Live Reports
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-lg">
                Share interactive audit dashboards with teammates or clients.
                Viewers don&apos;t need an account.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-text-tertiary">
              <span className="text-text-secondary font-medium">
                Built for engineers, agencies, and founders
              </span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                Zero friction for viewers →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. How It Works: 3 Steps ─────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-20 bg-surface-0 border-y border-border"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <p className="text-xs font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
              How It Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Three steps to a faster website
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-surface-1 border border-border space-y-3">
              <div className="h-9 w-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                01
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Paste Any Live URL
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Enter your site and choose Mobile or Desktop testing.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-surface-1 border border-border space-y-3">
              <div className="h-9 w-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                02
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Instant Cloud Audit
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Automated tests measure real load times and pinpoint exact
                bottlenecks.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-surface-1 border border-border space-y-3">
              <div className="h-9 w-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                03
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Apply Fixes & Share
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Follow millisecond-ranked fixes and export clean PDF reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Final CTA Section ────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-brand-600 via-brand-700 to-indigo-800 dark:bg-surface-0 dark:from-surface-0 dark:to-surface-0 border border-border rounded-3xl p-8 sm:p-14 text-center text-white space-y-5 shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to make your website faster?
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-md mx-auto leading-relaxed">
              Run your first audit in 20 seconds. 100 free tests every month, no
              credit card required.
            </p>
            <div className="pt-2 flex justify-center">
              <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-xl text-base font-semibold h-12 px-8 bg-white text-zinc-950 hover:bg-zinc-100 shadow-xl transition-all active:scale-[0.98] cursor-pointer">
                <span>Start Auditing Free</span>
                <ArrowRight className="h-4 w-4" />
              </RegisterLink>
            </div>
            <p className="text-xs text-white/70">
              ✓ Ready in 10 seconds · ✓ No credit card · ✓ 100 free monthly audits
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. Minimal Footer ─────────────────────────────────────────────── */}
      <footer className="bg-surface-0 border-t border-border text-text-secondary py-10 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-6 w-6 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Zap className="h-3.5 w-3.5 fill-white" />
            </div>
            <span className="font-bold text-text-primary">AuditHQ</span>
            <span className="text-text-tertiary">·</span>
            <span className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-text-tertiary">
            <span>Automated Web Performance</span>
            <span>·</span>
            <span>Cloud Audits</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
