"use client";

import React from "react";
import { Zap, Eye, ShieldCheck, Search, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

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
  categoryKey,
  className = "",
}) => {
  const size = 144;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score || 0));
  const offset = circumference - (clampedScore / 100) * circumference;

  // Grade rating
  const getScoreData = (val: number) => {
    if (val >= 90) {
      return {
        strokeGradient: ["#10b981", "#059669"],
        glow: "rgba(16, 185, 129, 0.25)",
        badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        badgeGlow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
        statusText: "Exceptional",
        benchmark: "Top 5% Web Benchmark",
        dotColor: "bg-emerald-500",
        textColor: "text-emerald-600 dark:text-emerald-400",
      };
    }
    if (val >= 50) {
      return {
        strokeGradient: ["#f59e0b", "#d97706"],
        glow: "rgba(245, 158, 11, 0.25)",
        badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        badgeGlow: "shadow-[0_0_12px_rgba(245,158,11,0.25)]",
        statusText: "Needs Work",
        benchmark: "Standard Web Range",
        dotColor: "bg-amber-500",
        textColor: "text-amber-600 dark:text-amber-400",
      };
    }
    return {
      strokeGradient: ["#ef4444", "#dc2626"],
      glow: "rgba(239, 68, 68, 0.25)",
      badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      badgeGlow: "shadow-[0_0_12px_rgba(239,68,68,0.25)]",
      statusText: "Poor / Critical",
      benchmark: "Below P75 Target",
      dotColor: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
    };
  };

  const data = getScoreData(clampedScore);
  const gradId = `gauge-grad-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const glowFilterId = `glow-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

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
      className={`group relative overflow-hidden rounded-3xl bg-surface-0/90 dark:bg-surface-0/40 backdrop-blur-xl border border-surface-3/80 hover:border-brand-500/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 ${className}`}
    >
      {/* Top ambient radial light behind the gauge */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full pointer-events-none opacity-40 group-hover:opacity-75 blur-2xl transition-opacity duration-500"
        style={{ background: data.glow }}
      />

      {/* Card Header with Icon & Category Name */}
      <div className="flex items-center justify-between w-full relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-surface-1 border border-surface-3/80 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/30 group-hover:border-brand-300 transition-colors">
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

        {/* Status Chip */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${data.badgeBg} ${data.badgeGlow}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${data.dotColor} animate-pulse`} />
          {data.statusText}
        </span>
      </div>

      {/* Central High-Fidelity SVG Radial Gauge */}
      <div className="relative flex items-center justify-center my-5 z-10">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={data.strokeGradient[0]} />
              <stop offset="100%" stopColor={data.strokeGradient[1]} />
            </linearGradient>

            <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="3"
                floodColor={data.strokeGradient[0]}
                floodOpacity="0.4"
              />
            </filter>
          </defs>

          {/* Background Outer Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--surface-2)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray="2 3"
            opacity="0.7"
          />

          {/* Primary Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter={`url(#${glowFilterId})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score & Scale */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-baseline">
            <span
              className={`text-4xl sm:text-5xl font-black font-sans tracking-tight ${data.textColor} drop-shadow-xs`}
            >
              {clampedScore}
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-text-tertiary tracking-widest uppercase mt-0.5">
            SCORE / 100
          </span>
        </div>
      </div>

      {/* Card Footer: Benchmark Position */}
      <div className="w-full pt-3.5 border-t border-surface-2 relative z-10 flex items-center justify-between text-xs">
        <span className="text-text-tertiary text-[11px] font-medium font-sans">
          Google Target
        </span>
        <span className="font-mono text-[11px] font-semibold text-text-secondary">
          {data.benchmark}
        </span>
      </div>
    </div>
  );
};
