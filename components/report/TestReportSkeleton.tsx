import React from "react";
import {
  Zap,
  Eye,
  ShieldCheck,
  Search,
  Activity,
  Gauge,
  Layers,
  Timer,
  Server,
  Film,
  HardDrive,
} from "lucide-react";

export function TestReportSkeleton({ isPublic = false }: { isPublic?: boolean }) {
  return (
    <div className="min-h-screen bg-[#f6f9fc] pb-16 w-full max-w-full overflow-x-hidden animate-in fade-in-50 duration-150">
      {/* ── 1. Static Report Header Deck (with DB data placeholders) ────── */}
      <div className="bg-white border-b border-[#e3e8ee] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8898aa]">
              <span>AuditHQ</span>
              <span>/</span>
              <span>Reports</span>
              <span>/</span>
              <div className="h-3 w-14 rounded bg-[#f1f5f9] animate-pulse" />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="h-7 w-64 max-w-full rounded-md bg-[#f1f5f9] animate-pulse" />
            </div>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <div className="h-5 w-20 rounded-full bg-[#f1f5f9] animate-pulse" />
              <div className="h-5 w-28 rounded-full bg-[#f1f5f9] animate-pulse" />
              <div className="h-5 w-32 rounded-full bg-[#f1f5f9] animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="h-9 w-32 rounded-lg bg-[#f0f2ff] border border-[#c7cefe]/60 animate-pulse" />
            <div className="h-9 w-24 rounded-lg bg-white border border-[#e3e8ee] animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── 2. Main Body ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full max-w-full overflow-x-hidden min-w-0">
        {/* Section 1: 4 Score Gauges */}
        <section className="space-y-4">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#e3e8ee] rounded-xl p-4 px-6 shadow-[0_1px_3px_rgba(50,50,93,0.08)]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#0a2540] tracking-tight font-sans">
                  Core Performance Audit
                </h2>
                <div className="h-5 w-36 rounded-full bg-[#f0f2ff] border border-[#c7cefe]/50 animate-pulse" />
              </div>
              <p className="text-xs text-[#425466]">
                Multi-dimensional evaluation based on official Google Lighthouse 12.0 scoring algorithms
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-[#425466]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00875a]" />
                90–100 Good
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#b76e00]" />
                50–89 Needs Work
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#de350b]" />
                0–49 Poor
              </span>
            </div>
          </div>

          {/* 4 Score Gauge Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            {[
              { label: "Performance", sub: "Speed & responsiveness", icon: <Zap className="h-4 w-4 text-[#635bff] fill-[#635bff]" /> },
              { label: "Accessibility", sub: "A11y compliance & contrast", icon: <Eye className="h-4 w-4 text-[#635bff]" /> },
              { label: "Best Practices", sub: "Security & modern standards", icon: <ShieldCheck className="h-4 w-4 text-[#635bff]" /> },
              { label: "SEO", sub: "Discoverability & crawling", icon: <Search className="h-4 w-4 text-[#635bff]" /> },
            ].map((g, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white border border-[#e3e8ee] p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-center gap-2.5 w-full">
                  <div className="p-2 rounded-lg bg-[#f0f2ff] border border-[#c7cefe]">
                    {g.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0a2540] font-sans tracking-tight">
                      {g.label}
                    </h3>
                    <p className="text-[11px] text-[#8898aa] line-clamp-1">{g.sub}</p>
                  </div>
                </div>

                {/* Gauge Radial Skeleton */}
                <div className="relative flex items-center justify-center my-5">
                  <div className="h-32 w-32 rounded-full border-8 border-[#f1f5f9] animate-pulse flex flex-col items-center justify-center">
                    <div className="h-8 w-14 rounded bg-[#f1f5f9] animate-pulse" />
                    <span className="text-[10px] font-mono font-semibold text-[#8898aa] uppercase mt-0.5">
                      / 100
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="w-full pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#8898aa] font-medium">Passing Threshold</span>
                  <span className="text-[11px] font-mono font-bold text-[#0a2540] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#e3e8ee]">
                    90–100 pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: 6 Core Web Vitals Cards */}
        <section className="space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-[#0a2540] flex items-center gap-2 font-sans">
              <Activity className="h-4 w-4 text-[#635bff]" />
              Core Web Vitals & Diagnostic Timings
            </h3>
            <p className="text-xs text-[#425466]">
              Official Google Search performance benchmarks calibrated for desktop and mobile environments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { acronym: "LCP", name: "Largest Contentful Paint", target: "≤ 2.5s", weight: "25% Weight", isCore: true, icon: <Activity className="h-4 w-4 text-[#635bff]" /> },
              { acronym: "TBT", name: "Total Blocking Time", target: "≤ 200ms", weight: "30% Weight", isCore: true, icon: <Gauge className="h-4 w-4 text-[#635bff]" /> },
              { acronym: "CLS", name: "Cumulative Layout Shift", target: "≤ 0.1", weight: "25% Weight", isCore: true, icon: <Layers className="h-4 w-4 text-[#635bff]" /> },
              { acronym: "FCP", name: "First Contentful Paint", target: "≤ 1.8s", weight: "10% Weight", isCore: false, icon: <Zap className="h-4 w-4 text-[#635bff]" /> },
              { acronym: "SI", name: "Speed Index", target: "≤ 3.4s", weight: "10% Weight", isCore: false, icon: <Timer className="h-4 w-4 text-[#635bff]" /> },
              { acronym: "TTFB", name: "Time to First Byte", target: "≤ 800ms", weight: "Diagnostic", isCore: false, icon: <Server className="h-4 w-4 text-[#635bff]" /> },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#f0f2ff] border border-[#c7cefe]">
                        {card.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-[#0a2540] font-sans">
                            {card.acronym}
                          </h4>
                          {card.isCore && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#f0f2ff] text-[#635bff] border border-[#c7cefe]">
                              Core Vital
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#8898aa] line-clamp-1">{card.name}</p>
                      </div>
                    </div>
                    <div className="h-5 w-16 rounded-full bg-[#f1f5f9] animate-pulse" />
                  </div>

                  {/* Metric Display Skeleton */}
                  <div className="pt-1 flex items-baseline justify-between gap-2">
                    <div className="h-8 w-20 rounded bg-[#f1f5f9] animate-pulse" />
                    <span className="text-xs font-mono text-[#8898aa] bg-[#f8fafc] px-2 py-0.5 rounded-md border border-[#e3e8ee]">
                      Target: {card.target}
                    </span>
                  </div>

                  {/* 3-Zone bar */}
                  <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden flex">
                    <div className="w-1/3 h-full bg-[#abf5d1]/60" />
                    <div className="w-1/3 h-full bg-[#ffe380]/60" />
                    <div className="w-1/3 h-full bg-[#ffbdad]/60" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#8898aa]">
                  <span className="font-medium">Lighthouse Weight</span>
                  <span className="font-semibold text-[#0a2540] font-mono">{card.weight}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Visual Progression Skeleton */}
        <section className="space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-[#0a2540] flex items-center gap-2 font-sans">
              <Film className="h-4 w-4 text-[#635bff]" />
              Visual Rendering Progression
            </h3>
            <p className="text-xs text-[#425466]">
              Sequential frame captures documenting perceived render progression
            </p>
          </div>

          <div className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)]">
            <div className="flex items-center gap-3 overflow-hidden pb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="shrink-0 flex flex-col items-center space-y-1.5">
                  <div className="w-28 h-20 bg-[#f8fafc] rounded-lg border border-[#e3e8ee] animate-pulse" />
                  <div className="h-4 w-12 rounded bg-[#f1f5f9] animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Diagnostic Tabs Skeleton */}
        <section className="space-y-4 pt-2">
          <div className="border-b border-[#e3e8ee] pb-2">
            <div className="h-10 w-96 max-w-full rounded-lg bg-[#f1f5f9] border border-[#e3e8ee] animate-pulse" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] flex items-center justify-between"
              >
                <div className="space-y-2 flex-1 max-w-md">
                  <div className="h-4 w-64 rounded bg-[#f1f5f9] animate-pulse" />
                  <div className="h-3 w-40 rounded bg-[#f1f5f9] animate-pulse" />
                </div>
                <div className="h-6 w-20 rounded bg-[#f1f5f9] animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
