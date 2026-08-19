"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
} from "lucide-react";

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
      stroke: "#00875a",
      fill: "rgba(0, 135, 90, 0.15)",
      badge: "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1]",
      label: "Good (90-100)",
    };
  }
  if (score >= 50) {
    return {
      stroke: "#b76e00",
      fill: "rgba(183, 110, 0, 0.15)",
      badge: "bg-[#fff8e5] text-[#b76e00] border-[#ffe380]",
      label: "Needs Work (50-89)",
    };
  }
  return {
    stroke: "#de350b",
    fill: "rgba(222, 53, 11, 0.15)",
    badge: "bg-[#ffebe6] text-[#de350b] border-[#ffbdad]",
    label: "Poor (<50)",
  };
}

export const PerformanceTrajectoryChart: React.FC<
  PerformanceTrajectoryChartProps
> = ({ data, avgScore }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-60 flex flex-col items-center justify-center text-center text-[#8898aa] bg-white rounded-xl border border-dashed border-[#e3e8ee]">
        <Activity className="h-8 w-8 mb-2 text-[#8898aa]" />
        <p className="text-xs font-bold text-[#425466] font-sans">
          No audit trajectory recorded yet
        </p>
        <p className="text-[11px] text-[#8898aa] mt-0.5 max-w-sm">
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

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          {delta !== 0 ? (
            delta > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#00875a] bg-[#e3fcf7] px-2.5 py-1 rounded-md border border-[#abf5d1]">
                <TrendingUp className="h-3.5 w-3.5" />+{delta} pts trajectory
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#de350b] bg-[#ffebe6] px-2.5 py-1 rounded-md border border-[#ffbdad]">
                <TrendingDown className="h-3.5 w-3.5" />
                {delta} pts trajectory
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#425466] bg-[#f1f5f9] px-2.5 py-1 rounded-md border border-[#e3e8ee]">
              <Minus className="h-3.5 w-3.5" />
              Consistent Performance
            </span>
          )}
        </div>

        {/* Legend Reference */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#8898aa]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00875a]" /> ≥90 Good
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#b76e00]" /> 50-89 Warn
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#de350b]" /> &lt;50 Poor
          </span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative bg-white border border-[#e3e8ee] rounded-xl p-4 overflow-hidden shadow-[0_1px_3px_rgba(50,50,93,0.08)]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="stripeTrajectoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#635bff" stopOpacity="0.16" />
              <stop offset="80%" stopColor="#635bff" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#635bff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Reference Line: 100 */}
          <line
            x1={paddingLeft}
            y1={y100}
            x2={svgWidth - paddingRight}
            y2={y100}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />
          <text
            x={paddingLeft - 10}
            y={y100 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-[#8898aa] font-mono"
          >
            100
          </text>

          {/* Reference Line: 90 (Good) */}
          <line
            x1={paddingLeft}
            y1={y90}
            x2={svgWidth - paddingRight}
            y2={y90}
            stroke="#abf5d1"
            strokeDasharray="4 4"
          />
          <text
            x={paddingLeft - 10}
            y={y90 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-[#00875a] font-mono font-semibold"
          >
            90
          </text>

          {/* Reference Line: 50 (Needs Work) */}
          <line
            x1={paddingLeft}
            y1={y50}
            x2={svgWidth - paddingRight}
            y2={y50}
            stroke="#ffe380"
            strokeDasharray="4 4"
          />
          <text
            x={paddingLeft - 10}
            y={y50 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-[#b76e00] font-mono font-semibold"
          >
            50
          </text>

          {/* Bottom Baseline 0 */}
          <line
            x1={paddingLeft}
            y1={y0}
            x2={svgWidth - paddingRight}
            y2={y0}
            stroke="#e3e8ee"
          />
          <text
            x={paddingLeft - 10}
            y={y0 + 3.5}
            textAnchor="end"
            className="text-[10px] fill-[#8898aa] font-mono"
          >
            0
          </text>

          {/* Area Fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#stripeTrajectoryGradient)"
              className="transition-all duration-500 ease-out"
            />
          )}

          {/* Curved Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="#635bff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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
                    stroke="#635bff"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                )}

                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill="#635bff"
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(points[hoveredIdx].x / svgWidth) * 100}%`,
              top: `${(points[hoveredIdx].y / svgHeight) * 100}%`,
            }}
          >
            <div className="bg-white border border-[#e3e8ee] rounded-lg p-2.5 shadow-[0_10px_20px_rgba(50,50,93,0.15)] text-xs font-mono space-y-1 min-w-[150px] text-[#0a2540]">
              <div className="flex items-center justify-between gap-2 border-b border-[#f1f5f9] pb-1">
                <span className="text-[10px] text-[#8898aa]">{points[hoveredIdx].date}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${getPointColor(points[hoveredIdx].score).badge}`}>
                  {points[hoveredIdx].score}/100
                </span>
              </div>
              {points[hoveredIdx].url && (
                <p className="text-[11px] text-[#635bff] truncate max-w-[180px] font-semibold">
                  {points[hoveredIdx].url}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
