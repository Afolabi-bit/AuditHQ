"use client";

import React from "react";
import { Activity, Gauge, Timer, Layers, Zap, Server, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ParsedLighthouseReport } from "@/lib/report-parser";

interface CoreWebVitalsGridProps {
  metrics: ParsedLighthouseReport["metrics"];
}

interface MetricCardConfig {
  id: string;
  name: string;
  acronym: string;
  value: number | null;
  displayValue: string;
  unit: string;
  rawValueFormatted: string;
  rating: "good" | "needs-improvement" | "poor";
  target: string;
  goodMax: number;
  warnMax: number;
  description: string;
  icon: React.ReactNode;
  weight: string;
  isCoreVital: boolean;
}

export const CoreWebVitalsGrid: React.FC<CoreWebVitalsGridProps> = ({ metrics }) => {
  const getRatingTheme = (rating: "good" | "needs-improvement" | "poor") => {
    switch (rating) {
      case "good":
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
          text: "text-emerald-600",
          dot: "bg-emerald-500",
          label: "Good",
        };
      case "needs-improvement":
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-200",
          text: "text-amber-600",
          dot: "bg-amber-500",
          label: "Needs Work",
        };
      case "poor":
        return {
          pill: "bg-rose-50 text-rose-700 border-rose-200",
          text: "text-rose-600",
          dot: "bg-rose-500",
          label: "Poor",
        };
    }
  };

  // Helper to split raw string like "0.4 s" or "150 ms" into value and unit
  const formatDisplay = (rawDisplay: string, fallbackVal: number | null, defaultUnit: string) => {
    const cleaned = rawDisplay.replace(/^Root document took /i, "").trim();
    const parts = cleaned.split(" ");
    if (parts.length >= 2) {
      return { num: parts[0], unit: parts.slice(1).join(" ") };
    }
    if (fallbackVal != null) {
      return { num: String(fallbackVal), unit: defaultUnit };
    }
    return { num: cleaned || "—", unit: "" };
  };

  const lcpParts = formatDisplay(metrics.lcp.displayValue, metrics.lcp.value, "s");
  const fcpParts = formatDisplay(metrics.fcp.displayValue, metrics.fcp.value, "s");
  const tbtParts = formatDisplay(metrics.tbt.displayValue, metrics.tbt.value, "ms");
  const clsParts = formatDisplay(metrics.cls.displayValue, metrics.cls.value, "");
  const siParts = formatDisplay(metrics.speedIndex.displayValue, metrics.speedIndex.value, "s");
  const ttfbParts = formatDisplay(metrics.ttfb.displayValue, metrics.ttfb.value, "ms");

  const cards: MetricCardConfig[] = [
    {
      id: "lcp",
      name: "Largest Contentful Paint",
      acronym: "LCP",
      value: metrics.lcp.value,
      displayValue: metrics.lcp.displayValue,
      rawValueFormatted: lcpParts.num,
      unit: lcpParts.unit,
      rating: metrics.lcp.rating,
      target: "≤ 2.5s",
      goodMax: 2500,
      warnMax: 4000,
      description: "Measures loading performance. Marks when the main content of the page has likely loaded.",
      icon: <Activity className="h-4 w-4 text-brand-600" />,
      weight: "25% Weight",
      isCoreVital: true,
    },
    {
      id: "tbt",
      name: "Total Blocking Time",
      acronym: "TBT",
      value: metrics.tbt.value,
      displayValue: metrics.tbt.displayValue,
      rawValueFormatted: tbtParts.num,
      unit: tbtParts.unit,
      rating: metrics.tbt.rating,
      target: "≤ 200ms",
      goodMax: 200,
      warnMax: 600,
      description: "Measures user responsiveness and main-thread execution delays between FCP and TTI.",
      icon: <Gauge className="h-4 w-4 text-brand-600" />,
      weight: "30% Weight",
      isCoreVital: true,
    },
    {
      id: "cls",
      name: "Cumulative Layout Shift",
      acronym: "CLS",
      value: metrics.cls.value,
      displayValue: metrics.cls.displayValue,
      rawValueFormatted: clsParts.num,
      unit: clsParts.unit,
      rating: metrics.cls.rating,
      target: "≤ 0.1",
      goodMax: 0.1,
      warnMax: 0.25,
      description: "Measures visual stability. Quantifies unexpected layout shifts during initial render.",
      icon: <Layers className="h-4 w-4 text-brand-600" />,
      weight: "25% Weight",
      isCoreVital: true,
    },
    {
      id: "fcp",
      name: "First Contentful Paint",
      acronym: "FCP",
      value: metrics.fcp.value,
      displayValue: metrics.fcp.displayValue,
      rawValueFormatted: fcpParts.num,
      unit: fcpParts.unit,
      rating: metrics.fcp.rating,
      target: "≤ 1.8s",
      goodMax: 1800,
      warnMax: 3000,
      description: "Marks the time at which the browser renders the first DOM content (text, image, svg).",
      icon: <Zap className="h-4 w-4 text-brand-600" />,
      weight: "10% Weight",
      isCoreVital: false,
    },
    {
      id: "speedIndex",
      name: "Speed Index",
      acronym: "SI",
      value: metrics.speedIndex.value,
      displayValue: metrics.speedIndex.displayValue,
      rawValueFormatted: siParts.num,
      unit: siParts.unit,
      rating: metrics.speedIndex.rating,
      target: "≤ 3.4s",
      goodMax: 3400,
      warnMax: 5800,
      description: "Measures how quickly contents are visibly populated during page progression.",
      icon: <Timer className="h-4 w-4 text-brand-600" />,
      weight: "10% Weight",
      isCoreVital: false,
    },
    {
      id: "ttfb",
      name: "Time to First Byte",
      acronym: "TTFB",
      value: metrics.ttfb.value,
      displayValue: metrics.ttfb.displayValue,
      rawValueFormatted: ttfbParts.num,
      unit: ttfbParts.unit,
      rating: metrics.ttfb.rating,
      target: "≤ 800ms",
      goodMax: 800,
      warnMax: 1800,
      description: "Measures server responsiveness and TLS connection overhead for initial request.",
      icon: <Server className="h-4 w-4 text-brand-600" />,
      weight: "Diagnostic",
      isCoreVital: false,
    },
  ];

  // Helper to compute pin percentage position on 3-zone threshold bar
  const computePinPercentage = (val: number | null, goodMax: number, warnMax: number) => {
    if (val == null || val <= 0) return 12;
    if (val <= goodMax) {
      // 0% to 33% range
      return Math.max(6, Math.min(30, (val / goodMax) * 33));
    }
    if (val <= warnMax) {
      // 33% to 66% range
      const ratio = (val - goodMax) / (warnMax - goodMax);
      return 33 + ratio * 33;
    }
    // 66% to 94% range
    return Math.min(94, 66 + ((val - warnMax) / warnMax) * 28);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2 font-sans">
            <Activity className="h-4 w-4 text-brand-600" />
            Core Web Vitals & Diagnostic Timings
          </h3>
          <p className="text-xs text-text-secondary">
            Official Google Search performance benchmarks calibrated for desktop and mobile environments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const theme = getRatingTheme(card.rating);
          const pinPercent = computePinPercentage(card.value, card.goodMax, card.warnMax);

          return (
            <div
              key={card.id}
              className="bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs hover:border-brand-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-surface-1 border border-surface-3 group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors">
                      {card.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-text-primary font-sans">
                          {card.acronym}
                        </h4>
                        {card.isCoreVital && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                            Core Vital
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-1">
                        {card.name}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${theme.pill}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                    {theme.label}
                  </span>
                </div>

                {/* Numerical Metric Display */}
                <div className="pt-1 flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-extrabold tracking-tight font-sans ${theme.text}`}>
                      {card.rawValueFormatted}
                    </span>
                    {card.unit && (
                      <span className="text-sm font-semibold text-text-secondary">
                        {card.unit}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-text-tertiary bg-surface-1 px-2 py-0.5 rounded-md border border-surface-3">
                    Target: {card.target}
                  </span>
                </div>

                {/* 3-Zone Threshold Spectrum Bar */}
                <div className="space-y-1">
                  <div className="relative h-2 w-full bg-surface-2 rounded-full overflow-hidden flex">
                    <div className="w-1/3 h-full bg-emerald-500/80" />
                    <div className="w-1/3 h-full bg-amber-500/80" />
                    <div className="w-1/3 h-full bg-rose-500/80" />
                  </div>

                  {/* Marker Pin */}
                  <div className="relative w-full h-2">
                    <div
                      className="absolute top-0 transform -translate-x-1/2 -mt-2.5 transition-all duration-700"
                      style={{ left: `${pinPercent}%` }}
                    >
                      <div className="w-2.5 h-2.5 bg-slate-900 border-2 border-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Metric Summary */}
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {card.description}
                </p>
              </div>

              {/* Footer Weight */}
              <div className="mt-4 pt-3 border-t border-surface-2 flex items-center justify-between text-xs text-text-tertiary">
                <span className="font-medium">Lighthouse Weight</span>
                <span className="font-semibold text-text-primary font-mono">{card.weight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
