"use client";

import React, { useState } from "react";
import {
  TrendUp,
  TrendDown,
  Minus,
  Pulse,
} from "@phosphor-icons/react";

interface TrendPoint {
  id?: string | number;
  date: string;
  time?: string;
  url?: string;
  device?: string;
  score: number;
}

interface PerformanceTrajectoryChartProps {
  data: TrendPoint[];
  avgScore?: number | null;
}

function getPointColor(score: number): {
  stroke: string;
  fill: string;
  badge: string;
  label: string;
} {
  if (score >= 90) {
    return {
      stroke: "#059669",
      fill: "rgba(5, 150, 105, 0.15)",
      badge: "score-badge-good",
      label: "Good (90-100)",
    };
  }
  if (score >= 50) {
    return {
      stroke: "#d97706",
      fill: "rgba(217, 119, 6, 0.15)",
      badge: "score-badge-warn",
      label: "Needs Work (50-89)",
    };
  }
  return {
    stroke: "#dc2626",
    fill: "rgba(220, 38, 38, 0.15)",
    badge: "score-badge-poor",
    label: "Poor (<50)",
  };
}

export const PerformanceTrajectoryChart: React.FC<
  PerformanceTrajectoryChartProps
> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-60 flex flex-col items-center justify-center text-center text-text-tertiary bg-surface-1/40 rounded-xl border border-dashed border-border">
        <Pulse weight="bold" className="h-8 w-8 mb-2 text-text-tertiary" />
        <p className="text-xs font-bold text-text-primary">
          No audit trajectory recorded yet
        </p>
        <p className="text-[11px] text-text-tertiary mt-0.5 max-w-sm">
          Run tests above to generate chronological performance trend lines and variation tracking.
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

    const clampedScore = Math.max(0, Math.min(100, item.score));
    const y = paddingTop + ((100 - clampedScore) / 100) * plotHeight;

    return { ...item, x, y, originalIdx: idx };
  });

  // Calculate trajectory delta
  const firstScore = data[0]?.score ?? 0;
  const lastScore = data[data.length - 1]?.score ?? 0;
  const delta = lastScore - firstScore;

  // Build SVG path
  const linePath = points.reduce((acc, point, idx) => {
    if (idx === 0) return `M ${point.x},${point.y}`;
    const prev = points[idx - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, "");

  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const y0 = paddingTop + plotHeight;

  const areaPath =
    points.length === 1
      ? ""
      : `${linePath} L ${lastPt.x},${y0} L ${firstPt.x},${y0} Z`;

  const y90 = paddingTop + ((100 - 90) / 100) * plotHeight;
  const y50 = paddingTop + ((100 - 50) / 100) * plotHeight;
  const y100 = paddingTop;

  // Smart boundary collision detection for the active tooltip
  const activePt = hoveredIdx !== null ? points[hoveredIdx] : null;
  const isNearLeft = activePt ? activePt.x / svgWidth < 0.22 : false;
  const isNearRight = activePt ? activePt.x / svgWidth > 0.78 : false;
  const isNearTop = activePt ? activePt.y / svgHeight < 0.4 : false;

  const getTransformClasses = () => {
    const xClass = isNearLeft
      ? "translate-x-0"
      : isNearRight
      ? "-translate-x-full"
      : "-translate-x-1/2";
    const yClass = isNearTop
      ? "translate-y-3"
      : "-translate-y-full -translate-y-3";
    return `${xClass} ${yClass}`;
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          {delta !== 0 ? (
            delta > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold score-badge-good px-2.5 py-1 rounded-md">
                <TrendUp weight="bold" className="h-3.5 w-3.5" />+{delta} pts trajectory
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold score-badge-poor px-2.5 py-1 rounded-md">
                <TrendDown weight="bold" className="h-3.5 w-3.5" />
                {delta} pts trajectory
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-text-secondary bg-surface-1 px-2.5 py-1 rounded-md border border-border">
              <Minus weight="bold" className="h-3.5 w-3.5" />
              Consistent Performance
            </span>
          )}
        </div>

        {/* Legend Reference */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-text-tertiary">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-score-good" /> ≥90 Good
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-score-warn" /> 50-89 Warn
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-score-poor" /> &lt;50 Poor
          </span>
        </div>
      </div>

      {/* SVG Canvas Container with overflow-visible to prevent tooltip clipping */}
      <div className="relative bg-surface-1/40 dark:bg-surface-1/60 border border-border/80 rounded-xl p-4 overflow-visible shadow-xs">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="techTrajectoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.20" />
              <stop offset="80%" stopColor="var(--primary)" stopOpacity="0.03" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Reference Line: 100 */}
          <line
            x1={paddingLeft}
            y1={y100}
            x2={svgWidth - paddingRight}
            y2={y100}
            stroke="currentColor"
            strokeDasharray="4 4"
            className="text-border dark:text-white/10"
          />
          <text
            x={paddingLeft - 10}
            y={y100 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-text-tertiary font-mono"
          >
            100
          </text>

          {/* Reference Line: 90 (Good) */}
          <line
            x1={paddingLeft}
            y1={y90}
            x2={svgWidth - paddingRight}
            y2={y90}
            stroke="currentColor"
            strokeDasharray="4 4"
            className="text-score-good/30"
          />
          <text
            x={paddingLeft - 10}
            y={y90 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-score-good font-mono font-semibold"
          >
            90
          </text>

          {/* Reference Line: 50 (Needs Work) */}
          <line
            x1={paddingLeft}
            y1={y50}
            x2={svgWidth - paddingRight}
            y2={y50}
            stroke="currentColor"
            strokeDasharray="4 4"
            className="text-score-warn/30"
          />
          <text
            x={paddingLeft - 10}
            y={y50 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-score-warn font-mono font-semibold"
          >
            50
          </text>

          {/* Bottom Baseline 0 */}
          <line
            x1={paddingLeft}
            y1={y0}
            x2={svgWidth - paddingRight}
            y2={y0}
            stroke="currentColor"
            className="text-border"
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
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#techTrajectoryGradient)"
              className="transition-all duration-500 ease-out"
            />
          )}

          {/* Curved Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-600 dark:text-brand-400"
          />

          {/* Interactive Marker Circles */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;

            return (
              <g key={idx}>
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={y100}
                    x2={p.x}
                    y2={y0}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="text-brand-600 dark:text-brand-400"
                    opacity="0.6"
                  />
                )}

                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  className="cursor-pointer transition-all duration-150 fill-brand-600 dark:fill-brand-400 stroke-surface-0"
                  strokeWidth={2}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip with Smart Boundary Collision Placement */}
        {activePt && (
          <div
            className={`absolute z-30 pointer-events-none transition-all duration-150 transform ${getTransformClasses()}`}
            style={{
              left: `${(activePt.x / svgWidth) * 100}%`,
              top: `${(activePt.y / svgHeight) * 100}%`,
            }}
          >
            <div className="bg-surface-0/95 backdrop-blur-xs border border-border rounded-xl p-3 shadow-2xl text-xs font-mono space-y-1.5 min-w-42.5 max-w-60 text-text-primary ring-1 ring-black/5 dark:ring-white/10">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-1.5">
                <span className="text-[11px] font-sans font-medium text-text-secondary">
                  {activePt.date}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getPointColor(activePt.score).badge}`}>
                  {activePt.score}/100
                </span>
              </div>
              {activePt.url && (
                <p className="text-xs text-brand-600 dark:text-brand-400 truncate block font-sans font-semibold" title={activePt.url}>
                  {activePt.url}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

