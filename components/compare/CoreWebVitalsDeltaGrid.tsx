"use client";

import React from "react";
import {
  TrendingDown,
  TrendingUp,
  Clock,
  Zap,
  Layers,
  Activity,
  Gauge,
} from "lucide-react";
import { ComparisonReport, MetricDelta } from "@/lib/comparison/types";

interface CoreWebVitalsDeltaGridProps {
  metrics: ComparisonReport["metrics"];
}

interface CWVConfig {
  id: keyof ComparisonReport["metrics"];
  title: string;
  shortDesc: string;
  targetThreshold: string;
  icon: React.ReactNode;
}

const cwvConfigs: CWVConfig[] = [
  {
    id: "lcp",
    title: "Largest Contentful Paint (LCP)",
    shortDesc: "Main viewport content rendering speed",
    targetThreshold: "Target: ≤ 2.5s",
    icon: <Clock className="h-4.5 w-4.5" />,
  },
  {
    id: "fcp",
    title: "First Contentful Paint (FCP)",
    shortDesc: "First visual DOM element painted",
    targetThreshold: "Target: ≤ 1.8s",
    icon: <Activity className="h-4.5 w-4.5" />,
  },
  {
    id: "tbt",
    title: "Total Blocking Time (TBT)",
    shortDesc: "Main thread script task responsiveness",
    targetThreshold: "Target: ≤ 200ms",
    icon: <Zap className="h-4.5 w-4.5" />,
  },
  {
    id: "cls",
    title: "Cumulative Layout Shift (CLS)",
    shortDesc: "Visual stability and unexpected layout shifts",
    targetThreshold: "Target: ≤ 0.10",
    icon: <Layers className="h-4.5 w-4.5" />,
  },
  {
    id: "speedIndex",
    title: "Speed Index",
    shortDesc: "Visual progression speed during page load",
    targetThreshold: "Target: ≤ 3.4s",
    icon: <Gauge className="h-4.5 w-4.5" />,
  },
  {
    id: "ttfb",
    title: "Time to First Byte (TTFB)",
    shortDesc: "Initial server response and TLS handshake latency",
    targetThreshold: "Target: ≤ 800ms",
    icon: <Clock className="h-4.5 w-4.5" />,
  },
];

export const CoreWebVitalsDeltaGrid: React.FC<CoreWebVitalsDeltaGridProps> = ({ metrics }) => {
  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2.5">
            <Gauge className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            Core Web Vitals & Diagnostic Metrics Comparison
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Comparative performance telemetry measured across identical synthetic conditions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cwvConfigs.map((cfg) => {
          const item: MetricDelta = metrics[cfg.id];
          const isImproved = item.status === "improved";
          const isRegressed = item.status === "regressed";

          return (
            <div
              key={cfg.id}
              className="bg-surface-0 border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 hover:border-brand-200 dark:hover:border-brand-500/30 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-text-primary">
                    {cfg.title}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {cfg.shortDesc}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-surface-1 border border-border flex items-center justify-center text-text-secondary shrink-0 shadow-2xs">
                  {cfg.icon}
                </div>
              </div>

              {/* Side by side Values */}
              <div className="grid grid-cols-2 gap-3 bg-surface-1 p-3.5 rounded-xl border border-border/70">
                {/* Base Value */}
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-semibold text-text-tertiary">
                    Base Run
                  </span>
                  <p className="text-base sm:text-lg font-bold font-mono text-text-secondary">
                    {item.baseDisplay}
                  </p>
                </div>

                {/* Target Value */}
                <div className="space-y-0.5 border-l border-border/70 pl-3">
                  <span className="text-[10px] uppercase font-semibold text-text-tertiary">
                    Target Run
                  </span>
                  <p className="text-base sm:text-lg font-bold font-mono text-text-primary">
                    {item.targetDisplay}
                  </p>
                </div>
              </div>

              {/* Delta & Percent Shift */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-text-tertiary">
                    Net Delta:
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-mono font-bold px-2.5 py-0.5 rounded-full text-xs ${
                      isImproved
                        ? "score-badge-good"
                        : isRegressed
                        ? "score-badge-poor"
                        : "score-badge-neutral"
                    }`}
                  >
                    {isImproved ? (
                      <TrendingDown className="h-3.5 w-3.5" />
                    ) : isRegressed ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : null}
                    {item.deltaDisplay}
                    {item.percentChange != null && (
                      <span className="opacity-80">({item.percentChange > 0 ? `+${item.percentChange}%` : `${item.percentChange}%`})</span>
                    )}
                  </span>
                </div>

                <span className="text-[11px] text-text-tertiary">
                  {cfg.targetThreshold}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
