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
  const size = 132;
  const strokeWidth = 8;
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
        return <Zap className="h-4 w-4 text-brand-500 fill-brand-500" />;
      case "accessibility":
        return <Eye className="h-4 w-4 text-brand-500" />;
      case "best practices":
        return <ShieldCheck className="h-4 w-4 text-brand-500" />;
      case "seo":
        return <Search className="h-4 w-4 text-brand-500" />;
      default:
        return <Zap className="h-4 w-4 text-brand-500" />;
    }
  };

  return (
    <div
      className={`rounded-xl bg-surface-0 border border-border p-5 shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between ${className}`}
    >
      {/* Header — clean icon and title */}
      <div className="flex items-center gap-2.5 w-full">
        <div className="p-2 rounded-lg bg-brand-50 border border-brand-200">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary font-sans tracking-tight">
            {label}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-text-tertiary line-clamp-1">{subtitle}</p>
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
          <span className="text-4xl font-extrabold font-mono text-text-primary tracking-tight">
            {clampedScore}
          </span>
          <span className="text-[10px] font-mono font-semibold text-text-tertiary uppercase mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Footer: Production Passing Threshold */}
      <div className="w-full pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-[11px] text-text-tertiary font-medium">Passing Threshold</span>
        <span className="text-[11px] font-mono font-bold text-text-primary bg-surface-1 px-2 py-0.5 rounded border border-border">
          90–100 pts
        </span>
      </div>
    </div>
  );
};
