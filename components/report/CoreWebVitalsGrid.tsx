"use client";

import React from "react";
import {
  Pulse,
  Gauge,
  Timer,
  Stack,
  Lightning,
  HardDrives,
} from "@phosphor-icons/react";
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
          pill: "score-badge-good",
          text: "text-score-good",
          dot: "bg-score-good",
          label: "Good",
        };
      case "needs-improvement":
        return {
          pill: "score-badge-warn",
          text: "text-score-warn",
          dot: "bg-score-warn",
          label: "Needs Work",
        };
      case "poor":
        return {
          pill: "score-badge-poor",
          text: "text-score-poor",
          dot: "bg-score-poor",
          label: "Poor",
        };
    }
  };

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

  const formatCls = (rawDisplay: string, numericVal: number | null) => {
    if (numericVal != null && !isNaN(numericVal)) {
      return { num: numericVal.toFixed(2), unit: "" };
    }
    if (rawDisplay) {
      const parsed = parseFloat(rawDisplay.replace(/,/g, "").trim());
      if (!isNaN(parsed)) return { num: parsed.toFixed(2), unit: "" };
    }
    return { num: "0.00", unit: "" };
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
      description: "Measures when the main content of the web page is completely rendered.",
      icon: <Stack weight="fill" className="h-4 w-4 text-brand-600 dark:text-brand-400" />,
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
      description: "Total time where the main thread was blocked from responding to user inputs.",
      icon: <Timer weight="bold" className="h-4 w-4 text-brand-600 dark:text-brand-400" />,
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
      description: "Quantifies unexpected visual layout shifts during page loading.",
      icon: <Pulse weight="bold" className="h-4 w-4 text-brand-600 dark:text-brand-400" />,
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
      description: "Time when the browser first renders any text, image, or canvas element.",
      icon: <Lightning weight="fill" className="h-4 w-4 text-brand-600 dark:text-brand-400" />,
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
      description: "Measures how quickly the visual contents of a page are fully populated.",
      icon: <Gauge weight="bold" className="h-4 w-4 text-brand-600 dark:text-brand-400" />,
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
      description: "Measures origin server response time and initial SSL handshake latency.",
      icon: <HardDrives weight="fill" className="h-4 w-4 text-brand-600 dark:text-brand-400" />,
      weight: "Diagnostic",
      isCoreVital: false,
    },
  ];

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const theme = getRatingTheme(card.rating);
          const pinPercent = computePinPercentage(card.value, card.goodMax, card.warnMax);

          return (
            <div
              key={card.id}
              className="bg-surface-0 border border-border rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-surface-1 border border-border text-brand-600 dark:text-brand-400 shrink-0">
                      {card.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm font-bold text-text-primary">
                          {card.acronym}
                        </h4>
                        {card.isCoreVital && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 whitespace-nowrap">
                            Core Vital
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-tertiary truncate">
                        {card.name}
                      </p>
                    </div>
                  </div>

                  {/* Rating Badge: nowrap & shrink-0 to prevent wrapping */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap ${theme.pill}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dot}`} />
                    <span>{theme.label}</span>
                  </span>
                </div>

                {/* Numerical Value with standard Score Color */}
                <div className="pt-1 flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3.5xl font-bold tracking-tight font-mono ${theme.text}`}>
                      {card.rawValueFormatted}
                    </span>
                    {card.unit && (
                      <span className="text-xs font-medium text-text-tertiary">
                        {card.unit}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-text-tertiary font-mono">
                    Target: {card.target}
                  </span>
                </div>

                {/* 3-Zone Threshold Spectrum Bar */}
                <div className="space-y-1 pt-1">
                  <div className="relative h-1.5 w-full bg-surface-2 rounded-full overflow-hidden flex">
                    <div className="w-1/3 h-full bg-emerald-500/30" />
                    <div className="w-1/3 h-full bg-amber-500/30" />
                    <div className="w-1/3 h-full bg-rose-500/30" />
                  </div>

                  {/* Marker Pin */}
                  <div className="relative w-full h-1.5">
                    <div
                      className="absolute top-0 transform -translate-x-1/2 -mt-2 transition-all duration-300"
                      style={{ left: `${pinPercent}%` }}
                    >
                      <div className="w-2 h-2 bg-text-primary border border-surface-0 rounded-full shadow-2xs" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-text-secondary leading-relaxed pt-0.5">
                  {card.description}
                </p>
              </div>

              {/* Footer Weight */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-tertiary">
                <span>Lighthouse Weight</span>
                <span className="font-mono text-text-secondary">{card.weight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

