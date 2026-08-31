"use client";

import React from "react";
import {
  TrendUp,
  TrendDown,
  Clock,
  Lightning,
  Warning,
  Minus,
  Pulse,
  HardDrives,
} from "@phosphor-icons/react";
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
      return "border-emerald-500/30 bg-emerald-500/5";
    }
    if (isNegative) {
      return "border-rose-500/30 bg-rose-500/5";
    }
    return "border-border bg-surface-1/50";
  };

  const getScoreDeltaBadge = () => {
    const raw = scoreDelta.delta ?? 0;
    if (raw > 0) {
      return {
        bg: "score-badge-good",
        icon: <TrendUp weight="bold" className="h-6 w-6 shrink-0" />,
        text: `+${raw} pts`,
      };
    }
    if (raw < 0) {
      return {
        bg: "score-badge-poor",
        icon: <TrendDown weight="bold" className="h-6 w-6 shrink-0" />,
        text: `${raw} pts`,
      };
    }
    return {
      bg: "bg-surface-2 text-text-tertiary border-border",
      icon: <Minus weight="bold" className="h-6 w-6 shrink-0" />,
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
                  ? "score-badge-good"
                  : isNegative
                  ? "score-badge-poor"
                  : "bg-surface-2 text-text-secondary border border-border"
              }`}
            >
              {isPositive ? (
                <Lightning weight="fill" className="h-4 w-4" />
              ) : isNegative ? (
                <Warning weight="fill" className="h-4 w-4" />
              ) : (
                <Minus weight="bold" className="h-4 w-4" />
              )}
              {overallVerdict.badge}
            </span>
            <span className="text-xs font-semibold text-text-tertiary font-mono">
              Comparative Analysis
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold text-text-primary tracking-tight">
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
            <span className="font-semibold text-text-primary">LCP Delta</span>
            <Clock weight="bold" className="h-4 w-4 text-brand-600 dark:text-brand-400" />
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
            <span className="font-semibold text-text-primary">TBT Delta</span>
            <Lightning weight="fill" className="h-4 w-4 text-brand-600 dark:text-brand-400" />
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
            <span className="font-semibold text-text-primary">CLS Delta</span>
            <Pulse weight="bold" className="h-4 w-4 text-brand-600 dark:text-brand-400" />
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
            <span className="font-semibold text-text-primary">Weight Shift</span>
            <HardDrives weight="fill" className="h-4 w-4 text-brand-600 dark:text-brand-400" />
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

