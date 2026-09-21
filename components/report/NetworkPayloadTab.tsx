"use client";

import React from "react";
import { HardDrives, Globe, ChartBar } from "@phosphor-icons/react";
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

  const getResourceColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "script":
        return {
          bar: "bg-score-warn",
          text: "text-score-warn",
          bg: "bg-score-warn/10",
        };
      case "image":
        return {
          bar: "bg-score-good",
          text: "text-score-good",
          bg: "bg-score-good/10",
        };
      case "stylesheet":
        return {
          bar: "bg-brand-600",
          text: "text-brand-600 dark:text-brand-400",
          bg: "bg-brand-50 dark:bg-brand-500/10",
        };
      case "font":
        return {
          bar: "bg-cyan-600",
          text: "text-cyan-600 dark:text-cyan-400",
          bg: "bg-cyan-50 dark:bg-cyan-500/10",
        };
      case "document":
        return {
          bar: "bg-sky-600",
          text: "text-sky-600 dark:text-sky-400",
          bg: "bg-sky-50 dark:bg-sky-500/10",
        };
      default:
        return {
          bar: "bg-surface-3",
          text: "text-text-tertiary",
          bg: "bg-surface-2",
        };
    }
  };

  return (
    <div className="space-y-5">
      {/* Top 3 Stat Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Page Weight */}
        <div className="bg-surface-0/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
              Total Page Weight
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-text-primary tracking-tight">
              {formatBytes(totalByteWeight)}
            </p>
            <p className="text-[11px] font-sans text-text-secondary">
              {totalByteWeight <= 1600 * 1024
                ? "Optimal payload (<1.6MB target)"
                : "Consider asset compression"}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-2xs">
            <HardDrives weight="fill" className="h-5 w-5" />
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-surface-0/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
              Network Requests
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-text-primary tracking-tight">
              {totalRequests}
            </p>
            <p className="text-[11px] font-sans text-text-secondary">
              {totalRequests <= 50 ? "Minimal HTTP requests" : "Consider asset bundling"}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-score-good/10 text-score-good border border-score-good/20 shadow-2xs">
            <ChartBar weight="fill" className="h-5 w-5" />
          </div>
        </div>

        {/* Third-Party Payloads */}
        <div className="bg-surface-0/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
              Third-Party Entities
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-text-primary tracking-tight">
              {thirdParties.length}
            </p>
            <p className="text-[11px] font-sans text-text-secondary">
              External scripts & analytics
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-score-warn/10 text-score-warn border border-score-warn/20 shadow-2xs">
            <Globe weight="bold" className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Asset Type Breakdown */}
      <div className="bg-surface-0/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-text-primary font-sans">
          Resource Type Breakdown
        </h4>

        {/* Segmented Bar */}
        <div className="h-3 w-full bg-surface-2/80 dark:bg-white/[0.05] rounded-full overflow-hidden flex border border-border/40 dark:border-white/[0.05]">
          {resourceSummary.map((res, idx) => {
            const percent = totalByteWeight > 0 ? (res.transferSize / totalByteWeight) * 100 : 0;
            const color = getResourceColor(res.resourceType);
            return (
              <div
                key={idx}
                className={`h-full ${color.bar}`}
                style={{ width: `${percent}%` }}
                title={`${res.label}: ${formatBytes(res.transferSize)} (${percent.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Table of Resource Types */}
        <div className="border border-border/60 dark:border-white/[0.07] rounded-2xl overflow-x-auto bg-surface-0/60 dark:bg-[#0c0e14]/80 shadow-2xs">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-surface-1/70 dark:bg-white/[0.03] border-b border-border/50 dark:border-white/[0.07] text-text-tertiary text-[11px]">
                <th className="p-3 px-3.5 font-semibold">Resource Type</th>
                <th className="p-3 px-3.5 text-right font-semibold">Requests</th>
                <th className="p-3 px-3.5 text-right font-semibold">Transfer Size</th>
                <th className="p-3 px-3.5 text-right font-semibold">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 dark:divide-white/[0.05]">
              {resourceSummary.map((res, idx) => {
                const percent = totalByteWeight > 0 ? ((res.transferSize / totalByteWeight) * 100).toFixed(1) : "0";
                const color = getResourceColor(res.resourceType);
                return (
                  <tr key={idx} className="hover:bg-surface-1/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 px-3.5 font-sans font-semibold text-text-primary flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${color.bar}`} />
                      {res.label}
                    </td>
                    <td className="p-3 px-3.5 text-right text-text-tertiary">
                      {res.requestCount}
                    </td>
                    <td className="p-3 px-3.5 text-right font-bold text-text-primary">
                      {formatBytes(res.transferSize)}
                    </td>
                    <td className="p-3 px-3.5 text-right text-text-tertiary">
                      {percent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Third Parties List */}
      {thirdParties.length > 0 && (
        <div className="bg-surface-0/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-text-primary font-sans">
            Third-Party Code Impact ({thirdParties.length})
          </h4>
          <div className="border border-border/60 dark:border-white/[0.07] rounded-2xl overflow-x-auto bg-surface-0/60 dark:bg-[#0c0e14]/80 shadow-2xs">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-surface-1/70 dark:bg-white/[0.03] border-b border-border/50 dark:border-white/[0.07] text-text-tertiary text-[11px]">
                  <th className="p-3 px-3.5 font-semibold">Third-Party Entity</th>
                  <th className="p-3 px-3.5 text-right font-semibold">Transfer Size</th>
                  <th className="p-3 px-3.5 text-right font-semibold">Blocking Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 dark:divide-white/[0.05]">
                {thirdParties.map((tp, idx) => (
                  <tr key={idx} className="hover:bg-surface-1/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 px-3.5 font-sans font-semibold text-text-primary">
                      {tp.entity}
                    </td>
                    <td className="p-3 px-3.5 text-right text-text-tertiary">
                      {formatBytes(tp.transferSize)}
                    </td>
                    <td className="p-3 px-3.5 text-right text-score-warn font-bold">
                      {tp.blockingTime > 0 ? formatMilliseconds(tp.blockingTime) : "0ms"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

