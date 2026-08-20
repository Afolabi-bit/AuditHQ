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
  const size = 136;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score || 0));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 90) return "#00875a"; // Good
    if (val >= 50) return "#b76e00"; // Needs work
    return "#de350b"; // Poor
  };

  const strokeColor = getScoreColor(clampedScore);

  const getIcon = () => {
    switch (label.toLowerCase()) {
      case "performance":
        return <Zap className="h-4.5 w-4.5 text-brand-500 fill-brand-500" />;
      case "accessibility":
        return <Eye className="h-4.5 w-4.5 text-brand-500" />;
      case "best practices":
        return <ShieldCheck className="h-4.5 w-4.5 text-brand-500" />;
      case "seo":
        return <Search className="h-4.5 w-4.5 text-brand-500" />;
      default:
        return <Zap className="h-4.5 w-4.5 text-brand-500" />;
    }
  };

  return (
    <div
      className={`rounded-2xl bg-surface-0 border border-border p-6 sm:p-7 shadow-xs hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between ${className}`}
    >
      {/* Header — clean icon and title */}
      <div className="flex items-center gap-3 w-full">
        <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-500 shadow-2xs">
          {getIcon()}
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm sm:text-base font-bold text-text-primary font-sans tracking-tight">
            {label}
          </h3>
          {subtitle && (
            <p className="text-xs text-text-tertiary line-clamp-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative flex items-center justify-center my-6">
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

        {/* Center Score Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3.5xl sm:text-4xl font-bold font-mono text-text-primary tracking-tight">
            {clampedScore}
          </span>
          <span className="text-[11px] font-mono text-text-tertiary">/100</span>
        </div>
      </div>

      {/* Status Pill Footer */}
      <div className="flex items-center justify-center pt-2">
        <span
          className={`text-xs font-bold font-mono px-3.5 py-1 rounded-full border shadow-2xs ${
            clampedScore >= 90
              ? "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/15 dark:text-[#4de7b4] dark:border-[#00875a]/30"
              : clampedScore >= 50
              ? "bg-[#fff8e5] text-[#b76e00] border-[#ffe380] dark:bg-[#b76e00]/15 dark:text-[#ffc400] dark:border-[#b76e00]/30"
              : "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/15 dark:text-[#ff7452] dark:border-[#de350b]/30"
          }`}
        >
          {clampedScore >= 90 ? "Good (90–100)" : clampedScore >= 50 ? "Needs Work (50–89)" : "Poor (0–49)"}
        </span>
      </div>
    </div>
  );
};
