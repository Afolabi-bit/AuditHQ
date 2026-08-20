import { buttonVariants } from "@/components/ui/button";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Activity,
  Terminal,
  Share2,
  Globe,
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
      <nav className="border-b border-border bg-surface-0/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8.5 w-8.5 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
                <Zap className="h-4.5 w-4.5 fill-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-text-primary font-sans">
                AuditHQ
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-text-secondary">
              <a
                href="#features"
                className="hover:text-brand-500 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-brand-500 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#bento"
                className="hover:text-brand-500 transition-colors"
              >
                Architecture
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
              <RegisterLink className="inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold h-9 px-4 text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-900 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </RegisterLink>
            </div>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 border border-brand-200 text-brand-500">
            <Activity className="h-3.5 w-3.5" />
            <span>Autonomous Web Performance Intelligence</span>
            <span className="text-text-tertiary">|</span>
            <span className="font-mono text-[11px] text-text-secondary">Lighthouse 12.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight font-sans leading-[1.1] text-text-primary">
            Automate Your{" "}
            <span className="text-brand-500">
              Lighthouse Audits
            </span>{" "}
            <br className="hidden sm:inline" />
            at Production Scale
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-normal leading-relaxed">
            Run automated Google Lighthouse audits in the cloud. Continuously measure Core Web Vitals, identify performance bottlenecks, and export executive whitepapers in seconds.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-lg text-base font-semibold h-12 px-7 text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-900 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]">
              <span>Run Audit Free</span>
              <ArrowRight className="h-4 w-4" />
            </RegisterLink>

            <a
              href="#bento"
              className="inline-flex items-center justify-center gap-2 rounded-lg text-base font-semibold h-12 px-7 text-text-primary bg-surface-0 hover:bg-surface-2 border border-border shadow-xs transition-colors"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Telemetry Preview Card */}
          <div className="pt-6 max-w-4xl mx-auto text-left">
            <div className="bg-surface-0 border border-border rounded-xl p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="w-2 h-2 rounded-full bg-score-good" />
                  <span className="font-semibold">Target: https://swiftaudithq.vercel.app</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e3fcf7] text-[#00875a] border border-[#abf5d1] dark:bg-[#00875a]/15 dark:text-[#4de7b4] dark:border-[#00875a]/30">
                  Audit Complete
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 bg-surface-1 rounded-lg border border-border">
                  <p className="text-[10px] text-text-tertiary uppercase font-semibold">Performance</p>
                  <p className="text-2xl font-bold text-score-good mt-0.5">99/100</p>
                </div>
                <div className="p-3 bg-surface-1 rounded-lg border border-border">
                  <p className="text-[10px] text-text-tertiary uppercase font-semibold">LCP (Load)</p>
                  <p className="text-2xl font-bold text-text-primary mt-0.5">0.8s</p>
                </div>
                <div className="p-3 bg-surface-1 rounded-lg border border-border">
                  <p className="text-[10px] text-text-tertiary uppercase font-semibold">TBT (Block)</p>
                  <p className="text-2xl font-bold text-text-primary mt-0.5">0ms</p>
                </div>
                <div className="p-3 bg-surface-1 rounded-lg border border-border">
                  <p className="text-[10px] text-text-tertiary uppercase font-semibold">CLS (Shift)</p>
                  <p className="text-2xl font-bold text-text-primary mt-0.5">0.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Monospace Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-[11px] font-mono tracking-widest text-text-tertiary uppercase">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-score-good" />
              2,400+ AUDITS EXECUTED
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-score-good" />
              POWERED BY LIGHTHOUSE 12.0
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-score-good" />
              ZERO SIGNUP FRICTION
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. Bento Grid Section ─────────────────────────────────────────── */}
      <section
        id="bento"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center space-y-3 mb-14">
          <p className="text-xs font-mono font-semibold tracking-widest text-brand-500 uppercase">
            Engine Architecture
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary font-sans">
            Built for Modern Engineering Teams
          </h2>
          <p className="text-base text-text-secondary max-w-2xl mx-auto">
            Everything required to debug load times, improve SEO rankings, and deliver instant-loading web experiences.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Large Card (2/3 width) */}
          <div className="md:col-span-2 rounded-xl bg-surface-0 border border-border p-8 shadow-xs hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-500">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
                Real-Time Lighthouse Cloud Engine
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                Audit any production domain through isolated cloud nodes with custom device emulation (Mobile / Desktop) and synthetic network throttling.
              </p>
            </div>

            <div className="mt-8 rounded-lg bg-surface-1 border border-border p-4 font-mono text-xs space-y-2 text-text-secondary">
              <div className="text-score-good">✔ DOM Navigation & Layout tree resolved in 420ms</div>
              <div className="text-text-primary">✔ Largest Contentful Paint (LCP) triggered at 0.82s</div>
              <div className="text-text-tertiary">✔ Cumulative Layout Shift (CLS) measured: 0.000</div>
            </div>
          </div>

          {/* Bento 2: Instant Command-Bar Execution */}
          <div className="rounded-xl bg-surface-0 border border-border p-8 shadow-xs hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-500">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-text-primary tracking-tight font-sans">
                Instant Execution
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Paste any URL and fire tests through background Next.js workers with zero rate-limit drops.
              </p>
            </div>

            <div className="mt-6 rounded-lg bg-surface-1 p-3 font-mono text-xs text-text-primary border border-border">
              <span className="text-brand-500">POST</span> /api/test/submit
              <div className="text-[11px] text-score-good mt-1">202 Accepted · Queued</div>
            </div>
          </div>

          {/* Bento 3: Client-Ready PDF Reports */}
          <div className="rounded-xl bg-surface-0 border border-border p-8 shadow-xs hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-500">
                <Share2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-text-primary tracking-tight font-sans">
                Executive PDF Reports
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Generate structured, vector-sharp PDF whitepapers with category score gauges and remediation lists.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-semibold text-brand-500 gap-1.5">
              <span>Vector Score Gauges</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Bento 4: Large Card (2/3 width) */}
          <div className="md:col-span-2 rounded-xl bg-surface-0 border border-border p-8 shadow-xs hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-500">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
                Instant Shareable Public URLs
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                Every test generates a dedicated read-only public URL at{" "}
                <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded text-text-primary border border-border">
                  /report/[id]
                </code>{" "}
                that you can share with stakeholders, agencies, and engineering teammates.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-tertiary">
              <span className="font-mono">Zero login friction for guest viewers</span>
              <span className="font-semibold text-brand-500">
                Explore Public Reports →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. How It Works: 3-Step Horizontal Timeline ──────────────────── */}
      <section
        id="how-it-works"
        className="py-20 bg-surface-0 border-y border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <p className="text-xs font-mono font-semibold tracking-widest text-brand-500 uppercase">
              Three-Step Workflow
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary font-sans">
              From URL to Optimization Roadmap in Seconds
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-7 rounded-xl bg-surface-1 border border-border space-y-4">
              <div className="h-11 w-11 rounded-lg bg-brand-600 text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-text-primary font-sans">
                Enter Your Website URL
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Paste any live URL and select testing parameters — Desktop or Mobile emulation, with synthetic network throttling.
              </p>
            </div>

            <div className="p-7 rounded-xl bg-surface-1 border border-border space-y-4">
              <div className="h-11 w-11 rounded-lg bg-brand-600 text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-text-primary font-sans">
                Cloud Lighthouse Analysis
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Headless auditing workers execute the full Lighthouse 12 suite, measuring FCP, LCP, TBT, CLS, and image payloads.
              </p>
            </div>

            <div className="p-7 rounded-xl bg-surface-1 border border-border space-y-4">
              <div className="h-11 w-11 rounded-lg bg-brand-600 text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-text-primary font-sans">
                Take Action & Share
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Review quantified time-saving opportunities, download structured PDF reports, and track improvements over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. High-Impact CTA Section ────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-brand-600 via-brand-700 to-indigo-800 dark:from-[#1e1b38] dark:via-surface-0 dark:to-surface-0 dark:border dark:border-brand-500/30 rounded-2xl p-10 sm:p-14 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans text-white dark:text-text-primary">
              Ready to Accelerate Your Web Performance?
            </h2>
            <p className="text-base sm:text-lg text-white/90 dark:text-text-secondary max-w-xl mx-auto">
              Free forever tier includes 100 audits/month. No credit card required.
            </p>
            <div className="pt-2 flex justify-center">
              <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-lg text-base font-extrabold h-12 px-8 bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-brand-500 dark:text-white dark:hover:bg-brand-600 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </RegisterLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Minimal Footer ─────────────────────────────────────────────── */}
      <footer className="bg-surface-0 border-t border-border text-text-secondary py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-6 w-6 rounded-md bg-brand-600 flex items-center justify-center text-white">
              <Zap className="h-3.5 w-3.5 fill-white" />
            </div>
            <span className="font-bold text-text-primary">AuditHQ</span>
            <span className="text-text-tertiary">·</span>
            <span className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-text-tertiary font-mono">
            <span>Powered by Google Lighthouse</span>
            <span>·</span>
            <span>Next.js 16</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
