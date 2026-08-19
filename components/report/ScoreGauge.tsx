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
    if (val >= 90) return "#00875a"; // Good (green)
    if (val >= 50) return "#b76e00"; // Needs work (amber)
    return "#de350b"; // Poor (red)
  };

  const strokeColor = getScoreColor(clampedScore);

  const getIcon = () => {
    switch (label.toLowerCase()) {
      case "performance":
        return <Zap className="h-4 w-4 text-[#635bff] fill-[#635bff]" />;
      case "accessibility":
        return <Eye className="h-4 w-4 text-[#635bff]" />;
      case "best practices":
        return <ShieldCheck className="h-4 w-4 text-[#635bff]" />;
      case "seo":
        return <Search className="h-4 w-4 text-[#635bff]" />;
      default:
        return <Zap className="h-4 w-4 text-[#635bff]" />;
    }
  };

  return (
    <div
      className={`rounded-xl bg-white border border-[#e3e8ee] p-5 shadow-sm hover:border-brand-200 hover:shadow-[0_6px_12px_-2px_rgba(50,50,93,0.1)] transition-all flex flex-col justify-between ${className}`}
    >
      {/* Header — clean icon and title without redundant status pills */}
      <div className="flex items-center gap-2.5 w-full">
        <div className="p-2 rounded-lg bg-[#f0f2ff] border border-brand-200">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0a2540] font-sans tracking-tight">
            {label}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-[#8898aa] line-clamp-1">{subtitle}</p>
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
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
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
          <span className="text-4xl font-extrabold font-mono text-[#0a2540] tracking-tight">
            {clampedScore}
          </span>
          <span className="text-[10px] font-mono font-semibold text-[#8898aa] uppercase mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Footer: Production Passing Threshold */}
      <div className="w-full pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#8898aa] font-medium">Passing Threshold</span>
        <span className="text-[11px] font-mono font-bold text-[#0a2540] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#e3e8ee]">
          90–100 pts
        </span>
      </div>
    </div>
  );
};
