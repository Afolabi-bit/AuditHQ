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
          pill: "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1]",
          text: "text-[#00875a]",
          dot: "bg-[#00875a]",
          label: "Good",
        };
      case "needs-improvement":
        return {
          pill: "bg-[#fff8e5] text-[#b76e00] border-[#ffe380]",
          text: "text-[#b76e00]",
          dot: "bg-[#b76e00]",
          label: "Needs Work",
        };
      case "poor":
        return {
          pill: "bg-[#ffebe6] text-[#de350b] border-[#ffbdad]",
          text: "text-[#de350b]",
          dot: "bg-[#de350b]",
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
    return { num: "0.00", unit: "" };
  };

  const lcpParts = formatSeconds(metrics.lcp.displayValue, metrics.lcp.value);
  const fcpParts = formatSeconds(metrics.fcp.displayValue, metrics.fcp.value);
  const siParts = formatSeconds(metrics.speedIndex.displayValue, metrics.speedIndex.value);
  const tbtParts = formatMilliseconds(metrics.tbt.displayValue, metrics.tbt.value);
  const ttfbParts = formatMilliseconds(metrics.ttfb.displayValue, metrics.ttfb.value);
  const clsParts = formatCls(metrics.cls.displayValue, metrics.cls.value);

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
      icon: <Activity className="h-4 w-4 text-[#635bff]" />,
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
      icon: <Gauge className="h-4 w-4 text-[#635bff]" />,
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
      icon: <Layers className="h-4 w-4 text-[#635bff]" />,
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
      icon: <Zap className="h-4 w-4 text-[#635bff]" />,
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
      icon: <Timer className="h-4 w-4 text-[#635bff]" />,
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
      icon: <Server className="h-4 w-4 text-[#635bff]" />,
      weight: "Diagnostic",
      isCoreVital: false,
    },
  ];

  const computePinPercentage = (val: number | null, goodMax: number, warnMax: number) => {
    if (val == null || val <= 0) return 12;
    if (val <= goodMax) {
      return Math.max(6, Math.min(30, (val / goodMax) * 33));
    }
    if (val <= warnMax) {
      const ratio = (val - goodMax) / (warnMax - goodMax);
      return 33 + ratio * 33;
    }
    return Math.min(94, 66 + ((val - warnMax) / warnMax) * 28);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-[#0a2540] flex items-center gap-2 font-sans">
            <Activity className="h-4 w-4 text-[#635bff]" />
            Core Web Vitals & Diagnostic Timings
          </h3>
          <p className="text-xs text-[#425466]">
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
              className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] hover:border-[#c7cefe] hover:shadow-[0_6px_12px_-2px_rgba(50,50,93,0.1)] transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                {/* Header */}
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
                        {card.isCoreVital && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#f0f2ff] text-[#635bff] border border-[#c7cefe]">
                            Core Vital
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8898aa] line-clamp-1">
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
                    <span className={`text-3xl font-extrabold tracking-tight font-mono ${theme.text}`}>
                      {card.rawValueFormatted}
                    </span>
                    {card.unit && (
                      <span className="text-sm font-semibold text-[#8898aa]">
                        {card.unit}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-[#8898aa] bg-[#f8fafc] px-2 py-0.5 rounded-md border border-[#e3e8ee]">
                    Target: {card.target}
                  </span>
                </div>

                {/* 3-Zone Threshold Spectrum Bar */}
                <div className="space-y-1">
                  <div className="relative h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden flex">
                    <div className="w-1/3 h-full bg-[#abf5d1]" />
                    <div className="w-1/3 h-full bg-[#ffe380]" />
                    <div className="w-1/3 h-full bg-[#ffbdad]" />
                  </div>

                  {/* Marker Pin */}
                  <div className="relative w-full h-2">
                    <div
                      className="absolute top-0 transform -translate-x-1/2 -mt-2 transition-all duration-500"
                      style={{ left: `${pinPercent}%` }}
                    >
                      <div className="w-2 h-2 bg-[#0a2540] border-2 border-white rounded-full shadow-xs" />
                    </div>
                  </div>
                </div>

                {/* Metric Summary */}
                <p className="text-xs text-[#425466] leading-relaxed line-clamp-2">
                  {card.description}
                </p>
              </div>

              {/* Footer Weight */}
              <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#8898aa]">
                <span className="font-medium">Lighthouse Weight</span>
                <span className="font-semibold text-[#0a2540] font-mono">{card.weight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
