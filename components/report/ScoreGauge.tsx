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

  const getScoreData = (val: number) => {
    if (val >= 90) {
      return {
        stroke: "#00875a",
        badge: "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1]",
        statusText: "Good",
        benchmark: "Top 10% Benchmark",
        dotColor: "bg-[#00875a]",
        textColor: "text-[#00875a]",
      };
    }
    if (val >= 50) {
      return {
        stroke: "#b76e00",
        badge: "bg-[#fff8e5] text-[#b76e00] border-[#ffe380]",
        statusText: "Needs Work",
        benchmark: "Standard Range",
        dotColor: "bg-[#b76e00]",
        textColor: "text-[#b76e00]",
      };
    }
    return {
      stroke: "#de350b",
      badge: "bg-[#ffebe6] text-[#de350b] border-[#ffbdad]",
      statusText: "Poor",
      benchmark: "Below P75 Target",
      dotColor: "bg-[#de350b]",
      textColor: "text-[#de350b]",
    };
  };

  const data = getScoreData(clampedScore);

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
      className={`rounded-xl bg-white border border-[#e3e8ee] p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08),0_1px_1px_rgba(0,0,0,0.04)] hover:border-[#c7cefe] hover:shadow-[0_6px_12px_-2px_rgba(50,50,93,0.1)] transition-all flex flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#f0f2ff] border border-[#c7cefe]">
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

        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${data.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${data.dotColor}`} />
          {data.statusText}
        </span>
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
            stroke={data.stroke}
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

      {/* Footer: Benchmark */}
      <div className="w-full pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
        <span className="text-[#8898aa] text-[11px] font-sans">
          Google Target
        </span>
        <span className="font-mono text-[11px] font-semibold text-[#425466]">
          {data.benchmark}
        </span>
      </div>
    </div>
  );
};
