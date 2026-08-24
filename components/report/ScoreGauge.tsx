"use client";

import React from "react";
import { Zap, Eye, ShieldCheck, Search } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
  label: string;
  subtitle?: string;
  categoryKey?: string;
  className?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label,
  subtitle,
  className = "",
}) => {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score || 0));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 90) return "var(--score-good)";
    if (val >= 50) return "var(--score-warn)";
    return "var(--score-poor)";
  };

  const getStatusBadge = (val: number) => {
    if (val >= 90) return { label: "Good", cls: "score-badge-good" };
    if (val >= 50) return { label: "Needs Work", cls: "score-badge-warn" };
    return { label: "Poor", cls: "score-badge-poor" };
  };

  const status = getStatusBadge(clampedScore);
  const strokeColor = getScoreColor(clampedScore);

  const getIcon = () => {
    switch (label.toLowerCase()) {
      case "performance":
        return <Zap className="h-4 w-4 text-brand-600 dark:text-brand-400 fill-current" />;
      case "accessibility":
        return <Eye className="h-4 w-4 text-brand-600 dark:text-brand-400" />;
      case "best practices":
        return <ShieldCheck className="h-4 w-4 text-brand-600 dark:text-brand-400" />;
      case "seo":
        return <Search className="h-4 w-4 text-brand-600 dark:text-brand-400" />;
      default:
        return <Zap className="h-4 w-4 text-brand-600 dark:text-brand-400" />;
    }
  };

  return (
    <div
      className={`rounded-2xl bg-surface-0 border border-border p-5 sm:p-6 shadow-xs hover:border-brand-200 dark:hover:border-brand-500/30 hover:shadow-md transition-all flex flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 w-full">
        <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 shadow-2xs">
          {getIcon()}
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-text-primary">
            {label}
          </h3>
          {subtitle && (
            <p className="text-xs text-text-tertiary line-clamp-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative flex items-center justify-center my-5">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background Outer Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-surface-2 dark:text-white/10"
          />

          {/* Primary Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-text-primary tracking-tight">
            {clampedScore}
          </span>
          <span className="text-[10px] text-text-tertiary">/100</span>
        </div>
      </div>

      {/* Status Pill Footer */}
      <div className="flex items-center justify-center pt-1">
        <span className={`text-xs font-semibold px-3 py-0.5 rounded-full ${status.cls}`}>
          {status.label}
        </span>
      </div>
    </div>
  );
};
