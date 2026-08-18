"use client";

import React from "react";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  subtitle?: string;
  className?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label,
  size = 140,
  strokeWidth = 10,
  subtitle,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score || 0));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getScoreTheme = (val: number) => {
    if (val >= 90) {
      return {
        gradientId: `gauge-green-${label.replace(/\s+/g, "-")}`,
        startColor: "#10B981", // emerald-500
        stopColor: "#059669",  // emerald-600
        textColor: "text-emerald-600",
        bgColor: "bg-emerald-50",
        badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
        trackColor: "#E2E8F0", // slate-200
        glowColor: "rgba(16, 185, 129, 0.2)",
        status: "Good",
      };
    }
    if (val >= 50) {
      return {
        gradientId: `gauge-amber-${label.replace(/\s+/g, "-")}`,
        startColor: "#F59E0B", // amber-500
        stopColor: "#D97706",  // amber-600
        textColor: "text-amber-600",
        bgColor: "bg-amber-50",
        badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
        trackColor: "#E2E8F0",
        glowColor: "rgba(245, 158, 11, 0.2)",
        status: "Needs Work",
      };
    }
    return {
      gradientId: `gauge-rose-${label.replace(/\s+/g, "-")}`,
      startColor: "#EF4444", // rose-500
      stopColor: "#DC2626",  // rose-600
      textColor: "text-rose-600",
      bgColor: "bg-rose-50",
      badgeBg: "bg-rose-100 text-rose-800 border-rose-200",
      trackColor: "#E2E8F0",
      glowColor: "rgba(239, 68, 68, 0.2)",
      status: "Poor",
    };
  };

  const theme = getScoreTheme(clampedScore);

  return (
    <div
      className={`flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={theme.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.startColor} />
              <stop offset="100%" stopColor={theme.stopColor} />
            </linearGradient>
            <filter id={`glow-${theme.gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={theme.startColor} floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />

          {/* Foreground Animated Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${theme.gradientId})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter={`url(#glow-${theme.gradientId})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score & Percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-3xl font-extrabold tracking-tight ${theme.textColor}`}>
            {clampedScore}
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${theme.badgeBg}`}
          >
            {theme.status}
          </span>
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1 max-w-[130px]">{subtitle}</p>}
      </div>
    </div>
  );
};
