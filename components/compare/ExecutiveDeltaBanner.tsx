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
        icon: <TrendingUp className="h-6 w-6 shrink-0" />,
        text: `+${raw} pts`,
      };
    }
    if (raw < 0) {
      return {
        bg: "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/25 dark:text-[#ff7452] dark:border-[#de350b]/40",
        icon: <TrendingDown className="h-6 w-6 shrink-0" />,
        text: `${raw} pts`,
      };
    }
    return {
      bg: "bg-surface-2 text-text-tertiary border-border",
      icon: <Minus className="h-6 w-6 shrink-0" />,
      text: "0 pts",
    };
  };

  const badge = getScoreDeltaBadge();

  return (
    <div className={`rounded-2xl border p-7 sm:p-9 shadow-xs space-y-8 transition-all ${getContainerStyle()}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left: Overall Verdict Title & Subtitle */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider border flex items-center gap-2 shadow-2xs ${
                isPositive
                  ? "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/25 dark:text-[#4de7b4] dark:border-[#00875a]/40"
                  : isNegative
                  ? "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/25 dark:text-[#ff7452] dark:border-[#de350b]/40"
                  : "bg-surface-2 text-text-secondary border-border"
              }`}
            >
              {isPositive ? (
                <Zap className="h-4 w-4 fill-current" />
              ) : isNegative ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
              {overallVerdict.badge}
            </span>
            <span className="text-xs font-semibold text-text-tertiary font-mono">
              Comparative Analysis
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold text-text-primary tracking-tight font-sans">
            {overallVerdict.title}
          </h2>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
            {overallVerdict.subtitle}
          </p>
        </div>

        {/* Right: Score Shift Hero Box */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3.5 shrink-0 bg-surface-0/80 p-5 rounded-2xl border border-border/80 shadow-2xs">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary">
            Net Performance Shift
          </span>

          <div
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-2xl sm:text-3xl font-mono font-extrabold shadow-sm ${badge.bg}`}
          >
            {badge.icon}
            <span>{badge.text}</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
            <span>Base: {report.base.score ?? "—"}/100</span>
            <span>➔</span>
            <span className="text-text-primary font-bold">Target: {report.target.score ?? "—"}/100</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Impact Highlight Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-2">
        {/* 1. LCP Delta */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-0/90 border border-border shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span className="font-semibold text-text-primary font-sans">LCP Delta</span>
            <Clock className="h-4 w-4 text-brand-500" />
          </div>
          <p
            className={`text-xl sm:text-2xl font-mono font-extrabold ${
              metrics.lcp.status === "improved"
                ? "text-score-good"
                : metrics.lcp.status === "regressed"
                ? "text-score-poor"
                : "text-text-primary"
            }`}
          >
            {metrics.lcp.deltaDisplay}
          </p>
          <p className="text-xs text-text-secondary font-mono">
            {metrics.lcp.baseDisplay} ➔ {metrics.lcp.targetDisplay}
          </p>
        </div>

        {/* 2. TBT Delta */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-0/90 border border-border shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span className="font-semibold text-text-primary font-sans">TBT Delta</span>
            <Zap className="h-4 w-4 text-brand-500" />
          </div>
          <p
            className={`text-xl sm:text-2xl font-mono font-extrabold ${
              metrics.tbt.status === "improved"
                ? "text-score-good"
                : metrics.tbt.status === "regressed"
                ? "text-score-poor"
                : "text-text-primary"
            }`}
          >
            {metrics.tbt.deltaDisplay}
          </p>
          <p className="text-xs text-text-secondary font-mono">
            {metrics.tbt.baseDisplay} ➔ {metrics.tbt.targetDisplay}
          </p>
        </div>

        {/* 3. CLS Delta */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-0/90 border border-border shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span className="font-semibold text-text-primary font-sans">CLS Delta</span>
            <Layers className="h-4 w-4 text-brand-500" />
          </div>
          <p
            className={`text-xl sm:text-2xl font-mono font-extrabold ${
              metrics.cls.status === "improved"
                ? "text-score-good"
                : metrics.cls.status === "regressed"
                ? "text-score-poor"
                : "text-text-primary"
            }`}
          >
            {metrics.cls.deltaDisplay}
          </p>
          <p className="text-xs text-text-secondary font-mono">
            {metrics.cls.baseDisplay} ➔ {metrics.cls.targetDisplay}
          </p>
        </div>

        {/* 4. Total Byte Shift */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-0/90 border border-border shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span className="font-semibold text-text-primary font-sans">Weight Shift</span>
            <Sparkles className="h-4 w-4 text-brand-500" />
          </div>
          <p
            className={`text-xl sm:text-2xl font-mono font-extrabold ${
              (totalByteDiff?.deltaBytes ?? 0) < 0
                ? "text-score-good"
                : (totalByteDiff?.deltaBytes ?? 0) > 0
                ? "text-score-poor"
                : "text-text-primary"
            }`}
          >
            {totalByteDiff ? totalByteDiff.deltaFormatted : "0 KB"}
          </p>
          <p className="text-xs text-text-secondary font-mono">
            {totalByteDiff ? `${totalByteDiff.baseFormatted} ➔ ${totalByteDiff.targetFormatted}` : "No byte data"}
          </p>
        </div>
      </div>
    </div>
  );
};
