"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  AlertTriangle,
  Minus,
  Layers,
  Sparkles,
} from "lucide-react";
import { ComparisonReport } from "@/lib/comparison/types";

interface ExecutiveDeltaBannerProps {
  report: ComparisonReport;
}

export const ExecutiveDeltaBanner: React.FC<ExecutiveDeltaBannerProps> = ({ report }) => {
  const { overallVerdict, scoreDelta, metrics, resourceDiffs } = report;
  const totalByteDiff = resourceDiffs.find((r) => r.resourceType === "total");

  const isPositive = overallVerdict.type === "positive";
  const isNegative = overallVerdict.type === "negative";

  const getContainerStyle = () => {
    if (isPositive) {
      return "border-[#abf5d1] bg-linear-to-br from-[#e3fcf7]/80 to-surface-0 dark:from-[#00875a]/15 dark:to-surface-0 dark:border-[#00875a]/30";
    }
    if (isNegative) {
      return "border-[#ffbdad] bg-linear-to-br from-[#ffebe6]/80 to-surface-0 dark:from-[#de350b]/15 dark:to-surface-0 dark:border-[#de350b]/30";
    }
    return "border-border bg-linear-to-br from-surface-1 to-surface-0";
  };

  const getScoreDeltaBadge = () => {
    const raw = scoreDelta.delta ?? 0;
    if (raw > 0) {
      return {
        bg: "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/25 dark:text-[#4de7b4] dark:border-[#00875a]/40",
        icon: <TrendingUp className="h-5 w-5 shrink-0" />,
        text: `+${raw} pts`,
      };
    }
    if (raw < 0) {
      return {
        bg: "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/25 dark:text-[#ff7452] dark:border-[#de350b]/40",
        icon: <TrendingDown className="h-5 w-5 shrink-0" />,
        text: `${raw} pts`,
      };
    }
    return {
      bg: "bg-surface-2 text-text-tertiary border-border",
      icon: <Minus className="h-5 w-5 shrink-0" />,
      text: "0 pts",
    };
  };

  const badge = getScoreDeltaBadge();

  return (
    <div className={`rounded-2xl border p-6 sm:p-7 shadow-xs space-y-6 transition-all ${getContainerStyle()}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Overall Verdict Title & Subtitle */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider border flex items-center gap-1.5 ${
                isPositive
                  ? "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/25 dark:text-[#4de7b4] dark:border-[#00875a]/40"
                  : isNegative
                  ? "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/25 dark:text-[#ff7452] dark:border-[#de350b]/40"
                  : "bg-surface-2 text-text-secondary border-border"
              }`}
            >
              {isPositive ? (
                <Zap className="h-3.5 w-3.5 fill-current" />
              ) : isNegative ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
              {overallVerdict.badge}
            </span>
            <span className="text-xs font-semibold text-text-tertiary">
              Comparative Analysis
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-sans">
            {overallVerdict.title}
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {overallVerdict.subtitle}
          </p>
        </div>

        {/* Right: Net Score Shift Hero Card */}
        <div className="flex items-center gap-4 bg-surface-0/80 dark:bg-surface-0 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-border shrink-0">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary font-sans">
              Score Delta
            </p>
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-text-primary tracking-tight">
                {report.base.score}
              </span>
              <span className="text-text-tertiary text-lg font-light">→</span>
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
                  (scoreDelta.delta ?? 0) > 0
                    ? "text-score-good"
                    : (scoreDelta.delta ?? 0) < 0
                    ? "text-score-poor"
                    : "text-text-primary"
                }`}
              >
                {report.target.score}
              </span>
            </div>
          </div>

          <div
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 font-mono font-bold text-sm sm:text-base ${badge.bg}`}
          >
            {badge.icon}
            {badge.text}
          </div>
        </div>
      </div>

      {/* 4 Key Performance Highlights Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60">
        {/* LCP Speed Gain */}
        <div className="p-3 bg-surface-0/60 rounded-xl border border-border/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5" />
            LCP Render Delta
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-lg font-extrabold font-mono ${
                metrics.lcp.status === "improved"
                  ? "text-score-good"
                  : metrics.lcp.status === "regressed"
                  ? "text-score-poor"
                  : "text-text-primary"
              }`}
            >
              {metrics.lcp.deltaDisplay}
            </span>
            <span className="text-[11px] text-text-tertiary font-mono">
              ({metrics.lcp.targetDisplay})
            </span>
          </div>
        </div>

        {/* TBT Main Thread */}
        <div className="p-3 bg-surface-0/60 rounded-xl border border-border/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5" />
            TBT Blocking Delta
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-lg font-extrabold font-mono ${
                metrics.tbt.status === "improved"
                  ? "text-score-good"
                  : metrics.tbt.status === "regressed"
                  ? "text-score-poor"
                  : "text-text-primary"
              }`}
            >
              {metrics.tbt.deltaDisplay}
            </span>
            <span className="text-[11px] text-text-tertiary font-mono">
              ({metrics.tbt.targetDisplay})
            </span>
          </div>
        </div>

        {/* Cumulative Layout Shift */}
        <div className="p-3 bg-surface-0/60 rounded-xl border border-border/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5" />
            CLS Visual Stability
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-lg font-extrabold font-mono ${
                metrics.cls.status === "improved"
                  ? "text-score-good"
                  : metrics.cls.status === "regressed"
                  ? "text-score-poor"
                  : "text-text-primary"
              }`}
            >
              {metrics.cls.deltaDisplay}
            </span>
            <span className="text-[11px] text-text-tertiary font-mono">
              ({metrics.cls.targetDisplay})
            </span>
          </div>
        </div>

        {/* Total Page Weight */}
        <div className="p-3 bg-surface-0/60 rounded-xl border border-border/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Transfer Size Delta
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-lg font-extrabold font-mono ${
                totalByteDiff?.status === "improved"
                  ? "text-score-good"
                  : totalByteDiff?.status === "regressed"
                  ? "text-score-poor"
                  : "text-text-primary"
              }`}
            >
              {totalByteDiff?.deltaFormatted || "0 KB"}
            </span>
            <span className="text-[11px] text-text-tertiary font-mono">
              ({totalByteDiff?.targetFormatted || "0 KB"})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
