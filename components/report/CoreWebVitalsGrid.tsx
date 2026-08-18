"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { Activity, Gauge, Sparkles, Layers, Zap, Server, Info } from "lucide-react";
import { ParsedLighthouseReport } from "@/lib/report-parser";

interface CoreWebVitalsGridProps {
  metrics: ParsedLighthouseReport["metrics"];
}

interface MetricCardConfig {
  id: string;
  name: string;
  acronym: string;
  displayValue: string;
  rating: "good" | "needs-improvement" | "poor";
  threshold: string;
  description: string;
  icon: React.ReactNode;
  weight: string;
}

export const CoreWebVitalsGrid: React.FC<CoreWebVitalsGridProps> = ({ metrics }) => {
  const getRatingStyle = (rating: "good" | "needs-improvement" | "poor") => {
    switch (rating) {
      case "good":
        return {
          pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          textColor: "text-emerald-600",
          barColor: "bg-emerald-500",
          label: "Good",
        };
      case "needs-improvement":
        return {
          pillBg: "bg-amber-50 text-amber-700 border-amber-200",
          textColor: "text-amber-600",
          barColor: "bg-amber-500",
          label: "Needs Work",
        };
      case "poor":
        return {
          pillBg: "bg-rose-50 text-rose-700 border-rose-200",
          textColor: "text-rose-600",
          barColor: "bg-rose-500",
          label: "Poor",
        };
    }
  };

  const cards: MetricCardConfig[] = [
    {
      id: "lcp",
      name: "Largest Contentful Paint",
      acronym: "LCP",
      displayValue: metrics.lcp.displayValue,
      rating: metrics.lcp.rating,
      threshold: "Good: ≤ 2.5s",
      description: "Measures perceived loading speed. Marks when the main content of the page has likely loaded.",
      icon: <Activity className="h-4 w-4 text-blue-600" />,
      weight: "25% of Performance",
    },
    {
      id: "fcp",
      name: "First Contentful Paint",
      acronym: "FCP",
      displayValue: metrics.fcp.displayValue,
      rating: metrics.fcp.rating,
      threshold: "Good: ≤ 1.8s",
      description: "Marks the time at which the first text or image is painted to the screen.",
      icon: <Zap className="h-4 w-4 text-blue-600" />,
      weight: "10% of Performance",
    },
    {
      id: "tbt",
      name: "Total Blocking Time",
      acronym: "TBT",
      displayValue: metrics.tbt.displayValue,
      rating: metrics.tbt.rating,
      threshold: "Good: ≤ 200ms",
      description: "Measures responsiveness to user inputs before the page becomes fully interactive.",
      icon: <Gauge className="h-4 w-4 text-blue-600" />,
      weight: "30% of Performance",
    },
    {
      id: "cls",
      name: "Cumulative Layout Shift",
      acronym: "CLS",
      displayValue: metrics.cls.displayValue,
      rating: metrics.cls.rating,
      threshold: "Good: ≤ 0.1",
      description: "Measures visual stability. Quantifies how much elements unexpectedly shift on page load.",
      icon: <Layers className="h-4 w-4 text-blue-600" />,
      weight: "25% of Performance",
    },
    {
      id: "speedIndex",
      name: "Speed Index",
      acronym: "SI",
      displayValue: metrics.speedIndex.displayValue,
      rating: metrics.speedIndex.rating,
      threshold: "Good: ≤ 3.4s",
      description: "Shows how quickly the contents of a page are visibly populated over time.",
      icon: <Sparkles className="h-4 w-4 text-blue-600" />,
      weight: "10% of Performance",
    },
    {
      id: "ttfb",
      name: "Time to First Byte",
      acronym: "TTFB",
      displayValue: metrics.ttfb.displayValue,
      rating: metrics.ttfb.rating,
      threshold: "Good: ≤ 800ms",
      description: "Measures server backend responsiveness and initial network latency.",
      icon: <Server className="h-4 w-4 text-blue-600" />,
      weight: "Diagnostic Metric",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Core Web Vitals & Key Timings
          </h3>
          <p className="text-xs text-slate-500">
            Google search ranking signals and user experience thresholds
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const style = getRatingStyle(card.rating);
          return (
            <Card
              key={card.id}
              className="border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md group relative overflow-hidden"
            >
              {/* Top Accent Indicator Bar */}
              <div className={`h-1 w-full ${style.barColor}`} />

              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors">
                      {card.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                        {card.acronym}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {card.name}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${style.pillBg}`}
                  >
                    {style.label}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div className={`text-3xl font-extrabold tracking-tight ${style.textColor}`}>
                    {card.displayValue}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {card.threshold}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Weight
                  </span>
                  <span className="font-semibold text-slate-600">{card.weight}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
