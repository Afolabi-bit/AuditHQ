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
  Cpu,
  Globe,
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
    <div className="min-h-screen bg-surface-1 text-[#0a2540] selection:bg-[#635bff]/15 selection:text-[#635bff]">
      {/* ── 1. Top Navigation Bar ─────────────────────────────────────────── */}
      <nav className="border-b border-[#e3e8ee] bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8.5 w-8.5 rounded-lg bg-[#635bff] flex items-center justify-center text-white shadow-sm">
                <Zap className="h-4.5 w-4.5 fill-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#0a2540] font-sans">
                AuditHQ
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#425466]">
              <a
                href="#features"
                className="hover:text-[#635bff] transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-[#635bff] transition-colors"
              >
                How It Works
              </a>
              <a
                href="#bento"
                className="hover:text-[#635bff] transition-colors"
              >
                Architecture
              </a>
            </div>

            {/* CTAs */}
            <div className="flex items-center space-x-3">
              <LoginLink
                className={`text-sm font-semibold text-[#425466] hover:text-[#0a2540] ${buttonVariants(
                  {
                    variant: "ghost",
                    size: "sm",
                  },
                )}`}
              >
                Log In
              </LoginLink>
              <RegisterLink className="inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold h-9 px-4 text-white bg-[#635bff] hover:bg-brand-700 active:bg-[#4b45d0] shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </RegisterLink>
            </div>
          </div>
        </div>
      </nav>

      {/* ── 2. Stripe Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#f0f2ff] border border-brand-200 text-[#635bff]">
            <Activity className="h-3.5 w-3.5" />
            <span>Autonomous Web Performance Intelligence</span>
            <span className="text-[#8898aa]">|</span>
            <span className="font-mono text-[11px] text-[#425466]">Lighthouse 12.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight font-sans leading-[1.1] text-[#0a2540]">
            Automate Your{" "}
            <span className="text-[#635bff]">
              Lighthouse Audits
            </span>{" "}
            <br className="hidden sm:inline" />
            at Production Scale
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#425466] max-w-2xl mx-auto font-normal leading-relaxed">
            Run automated Google Lighthouse audits in the cloud. Continuously measure Core Web Vitals, identify performance bottlenecks, and export executive whitepapers in seconds.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-lg text-base font-semibold h-12 px-7 text-white bg-[#635bff] hover:bg-brand-700 active:bg-[#4b45d0] shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]">
              <span>Run Audit Free</span>
              <ArrowRight className="h-4 w-4" />
            </RegisterLink>

            <a
              href="#bento"
              className="inline-flex items-center justify-center gap-2 rounded-lg text-base font-semibold h-12 px-7 text-[#0a2540] bg-white hover:bg-[#f8fafc] border border-[#e3e8ee] shadow-xs transition-colors"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Telemetry Preview Card */}
          <div className="pt-6 max-w-4xl mx-auto text-left">
            <div className="bg-white border border-[#e3e8ee] rounded-xl p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#425466]">
                  <span className="w-2 h-2 rounded-full bg-[#00875a]" />
                  <span className="font-semibold">Target: https://swiftaudithq.vercel.app</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e3fcf7] text-[#00875a] border border-[#abf5d1]">
                  Audit Complete
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e3e8ee]">
                  <p className="text-[10px] text-[#8898aa] uppercase font-semibold">Performance</p>
                  <p className="text-2xl font-bold text-[#00875a] mt-0.5">99/100</p>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e3e8ee]">
                  <p className="text-[10px] text-[#8898aa] uppercase font-semibold">LCP (Load)</p>
                  <p className="text-2xl font-bold text-[#0a2540] mt-0.5">0.8s</p>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e3e8ee]">
                  <p className="text-[10px] text-[#8898aa] uppercase font-semibold">TBT (Block)</p>
                  <p className="text-2xl font-bold text-[#0a2540] mt-0.5">0ms</p>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e3e8ee]">
                  <p className="text-[10px] text-[#8898aa] uppercase font-semibold">CLS (Shift)</p>
                  <p className="text-2xl font-bold text-[#0a2540] mt-0.5">0.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Monospace Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-[11px] font-mono tracking-widest text-[#8898aa] uppercase">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#00875a]" />
              2,400+ AUDITS EXECUTED
            </span>
            <span className="text-[#e3e8ee] hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#00875a]" />
              POWERED BY LIGHTHOUSE 12.0
            </span>
            <span className="text-[#e3e8ee] hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#00875a]" />
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
          <p className="text-xs font-mono font-semibold tracking-widest text-[#635bff] uppercase">
            Engine Architecture
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a2540] font-sans">
            Built for Modern Engineering Teams
          </h2>
          <p className="text-base text-[#425466] max-w-2xl mx-auto">
            Everything required to debug load times, improve SEO rankings, and deliver instant-loading web experiences.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Large Card (2/3 width) */}
          <div className="md:col-span-2 rounded-xl bg-white border border-[#e3e8ee] p-8 shadow-[0_1px_3px_rgba(50,50,93,0.08)] hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-[#f0f2ff] border border-brand-200 flex items-center justify-center text-[#635bff]">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#0a2540] tracking-tight font-sans">
                Real-Time Lighthouse Cloud Engine
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed max-w-xl">
                Audit any production domain through isolated cloud nodes with custom device emulation (Mobile / Desktop) and synthetic network throttling.
              </p>
            </div>

            <div className="mt-8 rounded-lg bg-[#f8fafc] border border-[#e3e8ee] p-4 font-mono text-xs space-y-2 text-[#425466]">
              <div className="text-[#00875a]">✔ DOM Navigation & Layout tree resolved in 420ms</div>
              <div className="text-[#0a2540]">✔ Largest Contentful Paint (LCP) triggered at 0.82s</div>
              <div className="text-[#8898aa]">✔ Cumulative Layout Shift (CLS) measured: 0.000</div>
            </div>
          </div>

          {/* Bento 2: Instant Command-Bar Execution */}
          <div className="rounded-xl bg-white border border-[#e3e8ee] p-8 shadow-[0_1px_3px_rgba(50,50,93,0.08)] hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-[#f0f2ff] border border-brand-200 flex items-center justify-center text-[#635bff]">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-[#0a2540] tracking-tight font-sans">
                Instant Execution
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed">
                Paste any URL and fire tests through background Next.js workers with zero rate-limit drops.
              </p>
            </div>

            <div className="mt-6 rounded-lg bg-[#f8fafc] p-3 font-mono text-xs text-[#0a2540] border border-[#e3e8ee]">
              <span className="text-[#635bff]">POST</span> /api/test/submit
              <div className="text-[11px] text-[#00875a] mt-1">202 Accepted · Queued</div>
            </div>
          </div>

          {/* Bento 3: Client-Ready PDF Reports */}
          <div className="rounded-xl bg-white border border-[#e3e8ee] p-8 shadow-[0_1px_3px_rgba(50,50,93,0.08)] hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-[#f0f2ff] border border-brand-200 flex items-center justify-center text-[#635bff]">
                <Share2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-[#0a2540] tracking-tight font-sans">
                Executive PDF Reports
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed">
                Generate structured, vector-sharp PDF whitepapers with category score gauges and remediation lists.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f1f5f9] flex items-center text-xs font-semibold text-[#635bff] gap-1.5">
              <span>Vector Score Gauges</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Bento 4: Large Card (2/3 width) */}
          <div className="md:col-span-2 rounded-xl bg-white border border-[#e3e8ee] p-8 shadow-[0_1px_3px_rgba(50,50,93,0.08)] hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-[#f0f2ff] border border-brand-200 flex items-center justify-center text-[#635bff]">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#0a2540] tracking-tight font-sans">
                Instant Shareable Public URLs
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed max-w-xl">
                Every test generates a dedicated read-only public URL at{" "}
                <code className="font-mono text-xs bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[#0a2540] border border-[#e3e8ee]">
                  /report/[id]
                </code>{" "}
                that you can share with stakeholders, agencies, and engineering teammates.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#8898aa]">
              <span className="font-mono">Zero login friction for guest viewers</span>
              <span className="font-semibold text-[#635bff]">
                Explore Public Reports →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. How It Works: 3-Step Horizontal Timeline ──────────────────── */}
      <section
        id="how-it-works"
        className="py-20 bg-white border-y border-[#e3e8ee]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <p className="text-xs font-mono font-semibold tracking-widest text-[#635bff] uppercase">
              Three-Step Workflow
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a2540] font-sans">
              From URL to Optimization Roadmap in Seconds
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-7 rounded-xl bg-[#f8fafc] border border-[#e3e8ee] space-y-4">
              <div className="h-11 w-11 rounded-lg bg-[#635bff] text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-[#0a2540] font-sans">
                Enter Your Website URL
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed">
                Paste any live URL and select testing parameters — Desktop or Mobile emulation, with synthetic network throttling.
              </p>
            </div>

            <div className="p-7 rounded-xl bg-[#f8fafc] border border-[#e3e8ee] space-y-4">
              <div className="h-11 w-11 rounded-lg bg-[#635bff] text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-[#0a2540] font-sans">
                Cloud Lighthouse Analysis
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed">
                Headless auditing workers execute the full Lighthouse 12 suite, measuring FCP, LCP, TBT, CLS, and image payloads.
              </p>
            </div>

            <div className="p-7 rounded-xl bg-[#f8fafc] border border-[#e3e8ee] space-y-4">
              <div className="h-11 w-11 rounded-lg bg-[#635bff] text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-[#0a2540] font-sans">
                Take Action & Share
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed">
                Review quantified time-saving opportunities, download structured PDF reports, and track improvements over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. High-Impact Stripe CTA Section ────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#635bff] rounded-2xl p-10 sm:p-14 text-center text-white space-y-6 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
              Ready to Accelerate Your Web Performance?
            </h2>
            <p className="text-base sm:text-lg text-white/85 max-w-xl mx-auto">
              Free forever tier includes 100 audits/month. No credit card required.
            </p>
            <div className="pt-2 flex justify-center">
              <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-lg text-base font-bold h-12 px-8 text-[#635bff] bg-white hover:bg-[#f0f2ff] shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]">
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </RegisterLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Minimal Footer ─────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#e3e8ee] text-[#425466] py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-6 w-6 rounded-md bg-[#635bff] flex items-center justify-center text-white">
              <Zap className="h-3.5 w-3.5 fill-white" />
            </div>
            <span className="font-bold text-[#0a2540]">AuditHQ</span>
            <span className="text-[#8898aa]">·</span>
            <span className="text-xs text-[#8898aa]">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-[#8898aa] font-mono">
            <span>Powered by Google Lighthouse</span>
            <span>·</span>
            <span>Next.js 16</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
