"use client";

import React from "react";
import { Activity, Gauge, Timer, Layers, Zap, Server } from "lucide-react";
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
          pill: "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/15 dark:text-[#4de7b4] dark:border-[#00875a]/30",
          text: "text-score-good",
          dot: "bg-[#00875a] dark:bg-[#4de7b4]",
          label: "Good",
        };
      case "needs-improvement":
        return {
          pill: "bg-[#fff8e5] text-[#b76e00] border-[#ffe380] dark:bg-[#b76e00]/15 dark:text-[#ffc400] dark:border-[#b76e00]/30",
          text: "text-score-warn",
          dot: "bg-[#b76e00] dark:bg-[#ffc400]",
          label: "Needs Work",
        };
      case "poor":
        return {
          pill: "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/15 dark:text-[#ff7452] dark:border-[#de350b]/30",
          text: "text-score-poor",
          dot: "bg-[#de350b] dark:bg-[#ff7452]",
          label: "Poor",
        };
    }
  };

  // Format seconds-based metrics (LCP, FCP, Speed Index)
  const formatSeconds = (rawDisplay: string, numericValMs: number | null) => {
    if (numericValMs != null && !isNaN(numericValMs)) {
      const sec = numericValMs / 1000;
      return { num: sec.toFixed(1), unit: "s" };
    }
    if (rawDisplay) {
      const cleaned = rawDisplay.trim().toLowerCase();
      if (cleaned.endsWith("ms")) {
        const msVal = parseFloat(cleaned.replace(/ms$/, "").replace(/,/g, "").trim());
        if (!isNaN(msVal)) return { num: (msVal / 1000).toFixed(1), unit: "s" };
      } else if (cleaned.endsWith("s")) {
        const sVal = parseFloat(cleaned.replace(/s$/, "").replace(/,/g, "").trim());
        if (!isNaN(sVal)) return { num: sVal.toFixed(1), unit: "s" };
      }
    }
    return { num: "—", unit: "s" };
  };

  // Format millisecond-based metrics (TBT, TTFB)
  const formatMilliseconds = (rawDisplay: string, numericValMs: number | null) => {
    if (numericValMs != null && !isNaN(numericValMs)) {
      return { num: Math.round(numericValMs).toString(), unit: "ms" };
    }
    if (rawDisplay) {
      const cleaned = rawDisplay.replace(/^Root document took /i, "").trim().toLowerCase();
      if (cleaned.endsWith("ms")) {
        const msVal = parseFloat(cleaned.replace(/ms$/, "").replace(/,/g, "").trim());
        if (!isNaN(msVal)) return { num: Math.round(msVal).toString(), unit: "ms" };
      } else if (cleaned.endsWith("s")) {
        const sVal = parseFloat(cleaned.replace(/s$/, "").replace(/,/g, "").trim());
        if (!isNaN(sVal)) return { num: Math.round(sVal * 1000).toString(), unit: "ms" };
      }
    }
    return { num: "—", unit: "ms" };
  };

  // Format unitless CLS (2 decimal places)
  const formatCls = (rawDisplay: string, numericVal: number | null) => {
    if (numericVal != null && !isNaN(numericVal)) {
      return { num: numericVal.toFixed(2), unit: "" };
    }
    if (rawDisplay) {
      const parsed = parseFloat(rawDisplay.replace(/,/g, "").trim());
      if (!isNaN(parsed)) return { num: parsed.toFixed(2), unit: "" };
    }
    return { num: "—", unit: "" };
  };

  const lcpParsed = formatSeconds(metrics.lcp.displayValue, metrics.lcp.value);
  const fcpParsed = formatSeconds(metrics.fcp.displayValue, metrics.fcp.value);
  const tbtParsed = formatMilliseconds(metrics.tbt.displayValue, metrics.tbt.value);
  const clsParsed = formatCls(metrics.cls.displayValue, metrics.cls.value);
  const siParsed = formatSeconds(metrics.speedIndex?.displayValue || "", metrics.speedIndex?.value || null);
  const ttfbParsed = formatMilliseconds(metrics.ttfb?.displayValue || "", metrics.ttfb?.value || null);

  const cards: MetricCardConfig[] = [
    {
      id: "lcp",
      name: "Largest Contentful Paint",
      acronym: "LCP",
      value: metrics.lcp.value,
      displayValue: metrics.lcp.displayValue,
      unit: lcpParsed.unit,
      rawValueFormatted: lcpParsed.num,
      rating: metrics.lcp.rating,
      target: "≤ 2.5s",
      goodMax: 2500,
      warnMax: 4000,
      description: "Measures render time of the largest visible content element on the screen.",
      icon: <Layers className="h-4 w-4 text-brand-500" />,
      weight: "25% Weight",
      isCoreVital: true,
    },
    {
      id: "tbt",
      name: "Total Blocking Time",
      acronym: "TBT",
      value: metrics.tbt.value,
      displayValue: metrics.tbt.displayValue,
      unit: tbtParsed.unit,
      rawValueFormatted: tbtParsed.num,
      rating: metrics.tbt.rating,
      target: "≤ 200ms",
      goodMax: 200,
      warnMax: 600,
      description: "Sum of time between FCP and Time to Interactive where CPU tasks blocked input.",
      icon: <Timer className="h-4 w-4 text-brand-500" />,
      weight: "30% Weight",
      isCoreVital: true,
    },
    {
      id: "cls",
      name: "Cumulative Layout Shift",
      acronym: "CLS",
      value: metrics.cls.value,
      displayValue: metrics.cls.displayValue,
      unit: clsParsed.unit,
      rawValueFormatted: clsParsed.num,
      rating: metrics.cls.rating,
      target: "≤ 0.10",
      goodMax: 0.1,
      warnMax: 0.25,
      description: "Quantifies unexpected visual layout movements that disrupt user reading flow.",
      icon: <Activity className="h-4 w-4 text-brand-500" />,
      weight: "25% Weight",
      isCoreVital: true,
    },
    {
      id: "fcp",
      name: "First Contentful Paint",
      acronym: "FCP",
      value: metrics.fcp.value,
      displayValue: metrics.fcp.displayValue,
      unit: fcpParsed.unit,
      rawValueFormatted: fcpParsed.num,
      rating: metrics.fcp.rating,
      target: "≤ 1.8s",
      goodMax: 1800,
      warnMax: 3000,
      description: "Marks the time when the browser first renders any text, image, or canvas element.",
      icon: <Zap className="h-4 w-4 text-brand-500" />,
      weight: "10% Weight",
      isCoreVital: false,
    },
    {
      id: "si",
      name: "Speed Index",
      acronym: "SI",
      value: metrics.speedIndex?.value || null,
      displayValue: metrics.speedIndex?.displayValue || "—",
      unit: siParsed.unit,
      rawValueFormatted: siParsed.num,
      rating: metrics.speedIndex?.rating || "good",
      target: "≤ 3.4s",
      goodMax: 3400,
      warnMax: 5800,
      description: "Measures how quickly the visual contents of a page are populated.",
      icon: <Gauge className="h-4 w-4 text-brand-500" />,
      weight: "10% Weight",
      isCoreVital: false,
    },
    {
      id: "ttfb",
      name: "Time to First Byte",
      acronym: "TTFB",
      value: metrics.ttfb?.value || null,
      displayValue: metrics.ttfb?.displayValue || "—",
      unit: ttfbParsed.unit,
      rawValueFormatted: ttfbParsed.num,
      rating: metrics.ttfb?.rating || "good",
      target: "≤ 800ms",
      goodMax: 800,
      warnMax: 1800,
      description: "Measures origin server response responsiveness and SSL handshake speed.",
      icon: <Server className="h-4 w-4 text-brand-500" />,
      weight: "Diagnostic",
      isCoreVital: false,
    },
  ];

  // Helper to compute pin percentage position on 3-zone bar
  const computePinPercentage = (val: number | null, goodMax: number, warnMax: number) => {
    if (val == null || isNaN(val)) return 15;
    if (val <= goodMax) {
      return (val / goodMax) * 33.3;
    } else if (val <= warnMax) {
      return 33.3 + ((val - goodMax) / (warnMax - goodMax)) * 33.3;
    } else {
      const overRatio = Math.min(1, (val - warnMax) / (warnMax * 1.5));
      return 66.6 + overRatio * 33.3;
    }
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-text-primary font-sans">
            Core Web Vitals & Diagnostics
          </h3>
          <p className="text-xs text-text-secondary">
            Standard Google Lighthouse 12.0 performance metrics and official ranking thresholds
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-score-good" />
            Good
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-score-warn" />
            Needs Work
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-score-poor" />
            Poor
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {cards.map((card) => {
          const theme = getRatingTheme(card.rating);
          const pinPercent = computePinPercentage(card.value, card.goodMax, card.warnMax);

          return (
            <div
              key={card.id}
              className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-7 shadow-xs hover:border-brand-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-500 shadow-2xs">
                      {card.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-text-primary font-sans">
                          {card.acronym}
                        </h4>
                        {card.isCoreVital && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-500 border border-brand-200">
                            Core Vital
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-tertiary line-clamp-1">
                        {card.name}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${theme.pill}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                    {theme.label}
                  </span>
                </div>

                {/* Numerical Metric Display */}
                <div className="pt-1 flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3.5xl sm:text-4xl font-extrabold tracking-tight font-mono ${theme.text}`}>
                      {card.rawValueFormatted}
                    </span>
                    {card.unit && (
                      <span className="text-sm font-semibold text-text-tertiary">
                        {card.unit}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-text-tertiary bg-surface-1 px-2.5 py-1 rounded-lg border border-border">
                    Target: {card.target}
                  </span>
                </div>

                {/* 3-Zone Threshold Spectrum Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="relative h-2 w-full bg-surface-2 rounded-full overflow-hidden flex">
                    <div className="w-1/3 h-full bg-[#abf5d1] dark:bg-[#00875a]/40" />
                    <div className="w-1/3 h-full bg-[#ffe380] dark:bg-[#b76e00]/40" />
                    <div className="w-1/3 h-full bg-[#ffbdad] dark:bg-[#de350b]/40" />
                  </div>

                  {/* Marker Pin */}
                  <div className="relative w-full h-2">
                    <div
                      className="absolute top-0 transform -translate-x-1/2 -mt-2.5 transition-all duration-500"
                      style={{ left: `${pinPercent}%` }}
                    >
                      <div className="w-2.5 h-2.5 bg-text-primary border-2 border-surface-0 rounded-full shadow-xs" />
                    </div>
                  </div>
                </div>

                {/* Metric Summary */}
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 pt-1">
                  {card.description}
                </p>
              </div>

              {/* Footer Weight */}
              <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between text-xs text-text-tertiary">
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
