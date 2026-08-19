"use client";

import React from "react";
import { HardDrive, Globe, BarChart3, Layers, Zap } from "lucide-react";
import {
  formatBytes,
  formatMilliseconds,
  ParsedLighthouseReport,
} from "@/lib/report-parser";

interface NetworkPayloadTabProps {
  resourceSummary: ParsedLighthouseReport["resourceSummary"];
  totalByteWeight: number;
  thirdParties: ParsedLighthouseReport["thirdParties"];
}

export const NetworkPayloadTab: React.FC<NetworkPayloadTabProps> = ({
  resourceSummary,
  totalByteWeight,
  thirdParties,
}) => {
  const totalRequests = resourceSummary.reduce(
    (acc, cur) => acc + cur.requestCount,
    0,
  );

  // Asset type color mapping
  const getResourceColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "script":
        return {
          bar: "bg-amber-500",
          text: "text-amber-600",
          bg: "bg-amber-500/10",
        };
      case "image":
        return {
          bar: "bg-blue-500",
          text: "text-blue-600",
          bg: "bg-blue-500/10",
        };
      case "stylesheet":
        return {
          bar: "bg-indigo-500",
          text: "text-indigo-600",
          bg: "bg-indigo-500/10",
        };
      case "font":
        return {
          bar: "bg-purple-500",
          text: "text-purple-600",
          bg: "bg-purple-500/10",
        };
      case "document":
        return {
          bar: "bg-emerald-500",
          text: "text-emerald-600",
          bg: "bg-emerald-500/10",
        };
      case "media":
        return {
          bar: "bg-rose-500",
          text: "text-rose-600",
          bg: "bg-rose-500/10",
        };
      default:
        return {
          bar: "bg-slate-400",
          text: "text-slate-600",
          bg: "bg-slate-500/10",
        };
    }
  };

  return (
    <div className="space-y-5">
      {/* Top 3 Stat Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Page Weight */}
        <div className="bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
              Total Page Weight
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-black text-text-primary">
              {formatBytes(totalByteWeight)}
            </p>
            <p className="text-[11px] font-sans text-text-secondary">
              {totalByteWeight <= 1600 * 1024
                ? "Optimal payload (<1.6MB target)"
                : "Consider asset compression"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-brand-50 text-brand-600 border border-brand-200">
            <HardDrive className="h-5 w-5" />
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
              HTTP Requests
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-black text-text-primary">
              {totalRequests}
            </p>
            <p className="text-[11px] font-sans text-text-secondary">
              Across {resourceSummary.length} resource categories
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>

        {/* Third-Party Scripts */}
        <div className="bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
              Third-Party Scripts
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-black text-text-primary">
              {thirdParties.length}
            </p>
            <p className="text-[11px] font-sans text-text-secondary">
              External tracking & telemetry vendors
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Globe className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Multi-segment Distribution Bar */}
      {totalByteWeight > 0 && (
        <div className="bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
              Bandwidth Distribution by Resource Type
            </h4>
            <span className="text-xs font-mono text-text-tertiary">
              100% Normalized
            </span>
          </div>

          <div className="h-3.5 w-full bg-surface-2 rounded-full overflow-hidden flex shadow-inner">
            {resourceSummary.map((res) => {
              const pct = (res.transferSize / totalByteWeight) * 100;
              if (pct < 1) return null;
              const color = getResourceColor(res.resourceType);
              return (
                <div
                  key={res.resourceType}
                  style={{ width: `${pct}%` }}
                  className={`${color.bar} transition-all`}
                  title={`${res.label}: ${formatBytes(res.transferSize)} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
            {resourceSummary.map((res) => {
              const color = getResourceColor(res.resourceType);
              const pct = ((res.transferSize / totalByteWeight) * 100).toFixed(1);
              return (
                <div
                  key={res.resourceType}
                  className="flex items-center gap-1.5 font-sans text-text-secondary"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${color.bar}`} />
                  <span className="font-semibold text-text-primary">{res.label}:</span>
                  <span className="font-mono font-bold text-text-primary">
                    {formatBytes(res.transferSize)}
                  </span>
                  <span className="text-text-tertiary font-mono">({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Resource Breakdown Table */}
        <div className="bg-surface-0 border border-surface-3 rounded-2xl overflow-hidden shadow-xs lg:col-span-6 flex flex-col justify-between">
          <div className="py-3.5 px-5 border-b border-surface-3 bg-surface-1/40">
            <h4 className="text-sm font-bold text-text-primary font-sans">
              Payload Breakdown by Asset Type
            </h4>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-1 text-text-secondary font-mono font-semibold border-b border-surface-3">
                <tr>
                  <th className="py-2.5 px-4">Resource Type</th>
                  <th className="py-2.5 px-4 text-center">Requests</th>
                  <th className="py-2.5 px-4 text-right">Transfer Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-2">
                {resourceSummary.map((item) => (
                  <tr key={item.resourceType} className="hover:bg-surface-1/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-text-primary font-sans">
                      {item.label}
                    </td>
                    <td className="py-3 px-4 text-center text-text-secondary font-mono">
                      {item.requestCount}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-text-primary font-mono">
                      {formatBytes(item.transferSize)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Third-Party Scripts Breakdown */}
        <div className="bg-surface-0 border border-surface-3 rounded-2xl overflow-hidden shadow-xs lg:col-span-6 flex flex-col justify-between">
          <div className="py-3.5 px-5 border-b border-surface-3 bg-surface-1/40 flex items-center justify-between">
            <h4 className="text-sm font-bold text-text-primary font-sans">
              Third-Party Vendor Overhead
            </h4>
            <span className="text-xs font-mono text-text-tertiary">
              {thirdParties.length} vendors detected
            </span>
          </div>
          <div className="p-0 overflow-x-auto">
            {thirdParties.length === 0 ? (
              <div className="p-8 text-center text-text-secondary text-xs font-sans">
                No third-party scripts detected. Zero external blocking overhead!
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-1 text-text-secondary font-mono font-semibold border-b border-surface-3">
                  <tr>
                    <th className="py-2.5 px-4">Provider / Vendor</th>
                    <th className="py-2.5 px-4 text-right">Transfer Size</th>
                    <th className="py-2.5 px-4 text-right">Blocking Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-2 font-mono">
                  {thirdParties.map((tp, idx) => (
                    <tr key={idx} className="hover:bg-surface-1/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-text-primary font-sans">
                        {tp.entity}
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {formatBytes(tp.transferSize)}
                      </td>
                      <td className="py-3 px-4 text-right text-rose-600 font-bold">
                        {formatMilliseconds(tp.blockingTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
