"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Monitor,
  Smartphone,
  ExternalLink,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface TrendPoint {
  id?: number;
  date: string;
  time?: string;
  url?: string;
  device?: string;
  score: number;
}

interface PerformanceTrajectoryChartProps {
  data: TrendPoint[];
  avgScore: number | null;
}

function getPointColor(score: number): {
  stroke: string;
  fill: string;
  badge: string;
  label: string;
} {
  if (score >= 90) {
    return {
      stroke: "#10b981", // emerald-500
      fill: "rgba(16, 185, 129, 0.15)",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Good (90-100)",
    };
  }
  if (score >= 50) {
    return {
      stroke: "#f59e0b", // amber-500
      fill: "rgba(245, 158, 11, 0.15)",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Needs Work (50-89)",
    };
  }
  return {
    stroke: "#ef4444", // rose-500
    fill: "rgba(239, 68, 68, 0.15)",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    label: "Poor (<50)",
  };
}

export const PerformanceTrajectoryChart: React.FC<
  PerformanceTrajectoryChartProps
> = ({ data, avgScore }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-60 flex flex-col items-center justify-center text-center text-text-tertiary bg-surface-1/40 rounded-xl border border-dashed border-surface-3">
        <Activity className="h-8 w-8 mb-2 text-text-tertiary" />
        <p className="text-xs font-bold text-text-secondary font-sans">
          No audit trajectory recorded yet
        </p>
        <p className="text-[11px] text-text-tertiary mt-0.5 max-w-sm">
          Run tests above to generate chronological performance trend lines and
          variation tracking.
        </p>
      </div>
    );
  }

  // Chart dimensions in SVG viewBox coordinate space
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingLeft = 50;
  const paddingRight = 40;
  const paddingTop = 25;
  const paddingBottom = 40;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  // Compute (x, y) coordinates for each data point
  const points = data.map((item, idx) => {
    const x =
      data.length === 1
        ? paddingLeft + plotWidth / 2
        : paddingLeft + (idx / (data.length - 1)) * plotWidth;

    // Y scale from 0 to 100
    const clampedScore = Math.max(0, Math.min(100, item.score));
    const y = paddingTop + ((100 - clampedScore) / 100) * plotHeight;

    return { ...item, x, y };
  });

  // Build smooth Bézier SVG curve path
  const buildSmoothPath = (pts: typeof points) => {
    if (pts.length === 1) {
      return `M ${pts[0].x - 40} ${pts[0].y} L ${pts[0].x + 40} ${pts[0].y}`;
    }

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(points);

  // Closed area path for gradient fill
  const areaPath =
    points.length === 1
      ? `M ${points[0].x - 40} ${points[0].y} L ${points[0].x + 40} ${points[0].y} L ${points[0].x + 40} ${
          paddingTop + plotHeight
        } L ${points[0].x - 40} ${paddingTop + plotHeight} Z`
      : `${linePath} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${
          paddingTop + plotHeight
        } Z`;

  // Threshold Y positions
  const y100 = paddingTop;
  const y90 = paddingTop + ((100 - 90) / 100) * plotHeight;
  const y50 = paddingTop + ((100 - 50) / 100) * plotHeight;
  const y0 = paddingTop + plotHeight;

  // First vs Latest difference
  const firstScore = data[0].score;
  const latestScore = data[data.length - 1].score;
  const delta = latestScore - firstScore;

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="space-y-4">
      {/* Header Stat Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {delta !== 0 ? (
            delta > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <TrendingUp className="h-3.5 w-3.5" />+{delta} pts trajectory
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                <TrendingDown className="h-3.5 w-3.5" />
                {delta} pts trajectory
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-text-tertiary bg-surface-1 px-2.5 py-1 rounded-lg border border-surface-3">
              <Minus className="h-3.5 w-3.5" />
              Consistent Performance
            </span>
          )}

          <span className="text-xs text-text-tertiary font-mono hidden sm:inline">
            {data.length}{" "}
            {data.length === 1 ? "audit point" : "sequential audits"}
          </span>
        </div>

        {/* Legend Reference */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-text-tertiary">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> ≥90 Good
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 50-89 Warn
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> &lt;50 Poor
          </span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden select-none bg-surface-1/40 rounded-xl p-3 border border-surface-3">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-56 sm:h-64 overflow-visible"
        >
          <defs>
            {/* Area Gradient */}
            <linearGradient id="trajectoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(221, 83%, 53%)"
                stopOpacity="0.28"
              />
              <stop
                offset="70%"
                stopColor="hsl(221, 83%, 53%)"
                stopOpacity="0.05"
              />
              <stop
                offset="100%"
                stopColor="hsl(221, 83%, 53%)"
                stopOpacity="0.0"
              />
            </linearGradient>

            {/* Threshold Zone Gradients */}
            <linearGradient id="goodZone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Threshold Guidelines */}
          {/* 100 Line */}
          <line
            x1={paddingLeft}
            y1={y100}
            x2={svgWidth - paddingRight}
            y2={y100}
            stroke="var(--surface-3)"
            strokeWidth="1"
          />
          <text
            x={paddingLeft - 10}
            y={y100 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-text-tertiary font-mono"
          >
            100
          </text>

          {/* 90 Good Threshold (Green line) */}
          <line
            x1={paddingLeft}
            y1={y90}
            x2={svgWidth - paddingRight}
            y2={y90}
            stroke="#10b981"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text
            x={paddingLeft - 10}
            y={y90 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-emerald-600 font-mono font-semibold"
          >
            90
          </text>

          {/* 50 Needs Work Threshold (Amber line) */}
          <line
            x1={paddingLeft}
            y1={y50}
            x2={svgWidth - paddingRight}
            y2={y50}
            stroke="#f59e0b"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />
          <text
            x={paddingLeft - 10}
            y={y50 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-amber-600 font-mono font-semibold"
          >
            50
          </text>

          {/* 0 Line */}
          <line
            x1={paddingLeft}
            y1={y0}
            x2={svgWidth - paddingRight}
            y2={y0}
            stroke="var(--surface-3)"
            strokeWidth="1"
          />
          <text
            x={paddingLeft - 10}
            y={y0 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-text-tertiary font-mono"
          >
            0
          </text>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#trajectoryGradient)" />

          {/* Continuous Curved Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke="hsl(221, 83%, 53%)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points & Interactive Nodes */}
          {points.map((p, idx) => {
            const color = getPointColor(p.score);
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Vertical drop guide when hovered */}
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={y100}
                    x2={p.x}
                    y2={y0}
                    stroke="hsl(221, 83%, 53%)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.8"
                  />
                )}

                {/* Outer halo */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 12 : 7}
                  fill={color.stroke}
                  fillOpacity={isHovered ? 0.3 : 0.15}
                  className="transition-all duration-200"
                />

                {/* Core node dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4.5}
                  fill="#ffffff"
                  stroke={color.stroke}
                  strokeWidth="3"
                  className="transition-all duration-200 shadow-sm"
                />

                {/* Score Number Above Node */}
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-bold transition-all ${
                    isHovered
                      ? "fill-text-primary scale-110"
                      : "fill-text-secondary"
                  }`}
                >
                  {p.score}
                </text>

                {/* Date & Run Sequence Label Below Axis */}
                <text
                  x={p.x}
                  y={y0 + 18}
                  textAnchor="middle"
                  className={`text-[10px] font-mono transition-all ${
                    isHovered
                      ? "fill-brand-600 font-bold"
                      : "fill-text-tertiary"
                  }`}
                >
                  {p.date}
                </text>

                {p.time && (
                  <text
                    x={p.x}
                    y={y0 + 30}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-text-tertiary"
                  >
                    {p.time}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Card */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2.5 transition-all duration-150"
            style={{
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: `${(activePoint.y / svgHeight) * 100}%`,
            }}
          >
            <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1 min-w-42.5 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-2">
                <span className="font-mono text-[11px] text-slate-400">
                  {activePoint.date} · {activePoint.time || "Audit"}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold font-mono ${
                    activePoint.score >= 90
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : activePoint.score >= 50
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  }`}
                >
                  {activePoint.score}/100
                </span>
              </div>

              {activePoint.url && (
                <p className="font-mono text-[11px] text-slate-200 truncate max-w-47.5">
                  {activePoint.url}
                </p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 font-mono">
                <span className="flex items-center gap-1 capitalize">
                  {activePoint.device?.toLowerCase() === "mobile" ? (
                    <Smartphone className="h-3 w-3" />
                  ) : (
                    <Monitor className="h-3 w-3" />
                  )}
                  {activePoint.device || "Desktop"}
                </span>
                {activePoint.id && (
                  <span className="text-brand-300">#{activePoint.id}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
