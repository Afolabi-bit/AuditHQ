import { buttonVariants } from "@/components/ui/button";
import {
  Zap,
  BarChart3,
  Shield,
  Clock,
  Share2,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Activity,
  Terminal,
  Gauge,
  Layers,
} from "lucide-react";
import Link from "next/link";
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
    <div className="min-h-screen bg-surface-1 text-text-primary selection:bg-brand-600 selection:text-white">
      {/* ── 1. Top Navigation Bar ─────────────────────────────────────────── */}
      <nav className="border-b border-brand-200/40 bg-white/75 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-brand">
                <Zap className="h-5 w-5 fill-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-text-primary font-sans">
                AuditHQ
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-text-secondary">
              <a
                href="#features"
                className="hover:text-brand-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-brand-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#bento"
                className="hover:text-brand-600 transition-colors"
              >
                Engine Architecture
              </a>
            </div>

            {/* CTAs */}
            <div className="flex items-center space-x-3">
              <LoginLink
                className={`text-sm font-medium text-text-secondary hover:text-text-primary ${buttonVariants(
                  {
                    variant: "ghost",
                    size: "sm",
                  },
                )}`}
              >
                Log In
              </LoginLink>
              <RegisterLink className="inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold h-9 px-4 text-white bg-brand-600 hover:bg-brand-700 shadow-brand transition-all hover:scale-[1.02] active:scale-[0.98]">
                Sign Up Free
                <ArrowRight className="h-4 w-4" />
              </RegisterLink>
            </div>
          </div>
        </div>
      </nav>

      {/* ── 2. Dark Hero Section with Animated Mesh Gradient ─────────────── */}
      <section className="relative overflow-hidden bg-[hsl(222,47%,8%)] text-white pt-24 pb-28 sm:pt-32 sm:pb-36">
        {/* Ambient Gradient Mesh Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-180 h-120 bg-brand-600/20 blur-[130px] rounded-full animate-mesh-1" />
          <div className="absolute top-48 -left-20 w-105 h-90 bg-indigo-600/15 blur-[120px] rounded-full animate-mesh-2" />
          <div className="absolute bottom-0 right-10 w-130 h-80 bg-emerald-500/10 blur-[140px] rounded-full" />
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415512_1px,transparent_1px),linear-gradient(to_bottom,#33415512_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-brand-200 backdrop-blur-md">
            <Activity className="h-3.5 w-3.5 text-brand-500" />
            <span>Autonomous Web Performance Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-tight font-sans leading-[1.08]">
            Automate Your{" "}
            <span className="bg-linear-to-r from-blue-400 via-brand-500 to-indigo-300 bg-clip-text text-transparent">
              Lighthouse
            </span>{" "}
            Audits <br className="hidden sm:inline" />
            at Production Scale
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto font-normal leading-relaxed">
            Run automated Google Lighthouse audits in the cloud. Continuously
            measure Core Web Vitals, identify performance bottlenecks, and
            export executive-ready reports in seconds.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-xl text-base font-semibold h-13 px-8 text-slate-950 bg-white hover:bg-slate-100 shadow-brand transition-all hover:scale-[1.02] active:scale-[0.98]">
              Run Audit Free
              <Zap className="h-4 w-4 fill-slate-950 text-slate-950" />
            </RegisterLink>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl text-base font-medium h-13 px-7 text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-colors"
            >
              View Demo Report
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>

          {/* Social Proof Monospace Strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              2,400+ AUDITS EXECUTED
            </span>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              POWERED BY GOOGLE LIGHTHOUSE
            </span>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ZERO SIGNUP FRICTION
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. Bento Grid Section ─────────────────────────────────────────── */}
      <section
        id="bento"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs font-mono font-semibold tracking-widest text-brand-600 uppercase">
            Precision Architecture
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary font-sans">
            Built for High-Velocity Engineering Teams
          </h2>
          <p className="text-base text-text-secondary max-w-2xl mx-auto">
            Everything required to debug load times, improve SEO rankings, and
            deliver instant-loading web experiences.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Large Card (2/3 width) — Live Lighthouse Engine */}
          <div className="md:col-span-2 rounded-2xl bg-surface-0 border border-surface-3 p-8 shadow-xs hover:shadow-sm hover:border-brand-200 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-11 w-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
                Real-Time Lighthouse Cloud Engine
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                Audit any production domain through Google&apos;s headless
                auditing nodes with custom device emulation (Mobile Moto G4 /
                Desktop Chrome) and synthetic network throttling.
              </p>
            </div>

            {/* Live Visualization Mockup */}
            <div className="mt-8 rounded-xl bg-surface-1 border border-surface-3 p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-surface-3 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-text-primary font-semibold">
                    https://swiftaudithq.vercel.app
                  </span>
                </div>
                <span className="text-brand-600 font-semibold uppercase text-[10px] tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  Audit Completed
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-2.5 rounded-lg bg-surface-0 border border-surface-3">
                  <p className="text-[10px] text-text-tertiary uppercase">
                    Performance
                  </p>
                  <p className="text-lg font-bold text-score-good">98/100</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-0 border border-surface-3">
                  <p className="text-[10px] text-text-tertiary uppercase">
                    LCP (Load)
                  </p>
                  <p className="text-lg font-bold text-score-good">1.1s</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-0 border border-surface-3">
                  <p className="text-[10px] text-text-tertiary uppercase">
                    CLS (Shift)
                  </p>
                  <p className="text-lg font-bold text-score-good">0.00</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-0 border border-surface-3">
                  <p className="text-[10px] text-text-tertiary uppercase">
                    TBT (Block)
                  </p>
                  <p className="text-lg font-bold text-score-good">0ms</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bento 2: Instant Command-Bar Execution */}
          <div className="rounded-2xl bg-surface-0 border border-surface-3 p-8 shadow-xs hover:shadow-sm hover:border-brand-200 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-11 w-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary tracking-tight font-sans">
                One URL, Instant Execution
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Paste any URL and select device throttling settings. Our
                background runtime executes without rate limit drops.
              </p>
            </div>

            {/* Input simulation */}
            <div className="mt-6 rounded-xl bg-slate-900 p-3.5 font-mono text-xs text-slate-300 space-y-1.5 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">❯</span>
                <span>audithq run https://stripe.com</span>
                <span className="inline-block w-1.5 h-3.5 bg-brand-500 animate-pulse ml-0.5" />
              </div>
              <p className="text-[11px] text-slate-400">
                ✔ Lighthouse 12.0 node initialized
              </p>
            </div>
          </div>

          {/* Bento 3: Client-Ready PDF Reports */}
          <div className="rounded-2xl bg-surface-0 border border-surface-3 p-8 shadow-xs hover:shadow-sm hover:border-brand-200 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary tracking-tight font-sans">
                Executive PDF Documents
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Download structured, client-ready performance audits with score
                badges, Core Web Vitals tables, and quantified time savings.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-2 flex items-center text-xs font-semibold text-brand-600 gap-1.5">
              <span>Vector Score Gauges & Quick Wins</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Bento 4: Large Card (2/3 width) — Shareable Public Reports */}
          <div className="md:col-span-2 rounded-2xl bg-surface-0 border border-surface-3 p-8 shadow-xs hover:shadow-sm hover:border-brand-200 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <ExternalLink className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
                Instant Shareable Public URLs
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                Every test generates a dedicated read-only public URL at{" "}
                <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded text-text-primary">
                  /report/[id]
                </code>{" "}
                that you can share with stakeholders, agencies, and engineering
                teammates with zero login barrier.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-2 flex items-center justify-between text-xs text-text-secondary">
              <span className="font-mono">
                No authentication required for client viewers
              </span>
              <span className="font-semibold text-brand-600">
                Explore Public Reports →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. How It Works: 3-Step Horizontal Timeline ──────────────────── */}
      <section
        id="how-it-works"
        className="py-24 bg-surface-0 border-y border-surface-3"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <p className="text-xs font-mono font-semibold tracking-widest text-brand-600 uppercase">
              Three-Step Workflow
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary font-sans">
              From URL to Optimization Roadmap in Seconds
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-7 rounded-2xl bg-surface-1 border border-surface-3 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-brand">
                01
              </div>
              <h3 className="text-lg font-bold text-text-primary font-sans">
                Enter Your Website URL
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Paste any live URL and select your testing preferences — Desktop
                or Mobile emulation, with synthetic network throttling.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-7 rounded-2xl bg-surface-1 border border-surface-3 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-brand">
                02
              </div>
              <h3 className="text-lg font-bold text-text-primary font-sans">
                Cloud Lighthouse Analysis
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Headless auditing workers execute the full Lighthouse 12 suite,
                measuring FCP, LCP, TBT, CLS, render blocking, and image
                payloads.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-7 rounded-2xl bg-surface-1 border border-surface-3 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-brand">
                03
              </div>
              <h3 className="text-lg font-bold text-text-primary font-sans">
                Take Action & Share
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Review quantified time-saving opportunities, download structured
                PDF reports, and track your performance improvements over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. High-Impact CTA Section ────────────────────────────────────── */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 bg-brand-600/20 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-sans">
            Ready to Accelerate Your Web Performance?
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Free forever tier includes 100 audits/month. No credit card
            required.
          </p>
          <div className="pt-2 flex justify-center">
            <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-xl text-base font-semibold h-13 px-8 text-slate-950 bg-white hover:bg-slate-100 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
              Create Free Account
              <Zap className="h-4 w-4 fill-slate-950 text-slate-950" />
            </RegisterLink>
          </div>
        </div>
      </section>

      {/* ── 6. Clean Minimal Footer ───────────────────────────────────────── */}
      <footer className="bg-surface-0 border-t border-surface-3 text-text-secondary py-12 text-sm">
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

          <div className="flex items-center space-x-6 text-xs text-text-tertiary">
            <span>Powered by Google Lighthouse</span>
            <span>·</span>
            <span>Next.js 16</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
