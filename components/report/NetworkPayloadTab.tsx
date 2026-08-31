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
        <div className="bg-surface-0 border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
              Total Page Weight
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-text-primary">
              {formatBytes(totalByteWeight)}
            </p>
            <p className="text-[11px] font-sans text-text-secondary">
              {totalByteWeight <= 1600 * 1024
                ? "Optimal payload (<1.6MB target)"
                : "Consider asset compression"}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
            <HardDrives weight="fill" className="h-5 w-5" />
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-surface-0 border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
              Network Requests
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-text-primary">
              {totalRequests}
            </p>
            <p className="text-[11px] font-sans text-text-secondary">
              {totalRequests <= 50 ? "Minimal HTTP requests" : "Consider asset bundling"}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-score-good/10 text-score-good border border-score-good/30">
            <ChartBar weight="fill" className="h-5 w-5" />
          </div>
        </div>

        {/* Third-Party Payloads */}
        <div className="bg-surface-0 border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
              Third-Party Entities
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-text-primary">
              {thirdParties.length}
            </p>
            <p className="text-[11px] font-sans text-text-secondary">
              External scripts & analytics
            </p>
          </div>
          <div className="p-3 rounded-lg bg-score-warn/10 text-score-warn border border-score-warn/30">
            <Globe weight="bold" className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Asset Type Breakdown */}
      <div className="bg-surface-0 border border-border rounded-xl p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-text-primary font-sans">
          Resource Type Breakdown
        </h4>

        {/* Segmented Bar */}
        <div className="h-3 w-full bg-surface-2 rounded-full overflow-hidden flex">
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
        <div className="border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-surface-1 border-b border-border text-text-tertiary text-[11px]">
                <th className="p-2.5 px-3">Resource Type</th>
                <th className="p-2.5 px-3 text-right">Requests</th>
                <th className="p-2.5 px-3 text-right">Transfer Size</th>
                <th className="p-2.5 px-3 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {resourceSummary.map((res, idx) => {
                const percent = totalByteWeight > 0 ? ((res.transferSize / totalByteWeight) * 100).toFixed(1) : "0";
                const color = getResourceColor(res.resourceType);
                return (
                  <tr key={idx} className="hover:bg-surface-2">
                    <td className="p-2.5 px-3 font-sans font-semibold text-text-primary flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${color.bar}`} />
                      {res.label}
                    </td>
                    <td className="p-2.5 px-3 text-right text-text-tertiary">
                      {res.requestCount}
                    </td>
                    <td className="p-2.5 px-3 text-right font-bold text-text-primary">
                      {formatBytes(res.transferSize)}
                    </td>
                    <td className="p-2.5 px-3 text-right text-text-tertiary">
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
        <div className="bg-surface-0 border border-border rounded-xl p-6 shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-text-primary font-sans">
            Third-Party Code Impact ({thirdParties.length})
          </h4>
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-surface-1 border-b border-border text-text-tertiary text-[11px]">
                  <th className="p-2.5 px-3">Third-Party Entity</th>
                  <th className="p-2.5 px-3 text-right">Transfer Size</th>
                  <th className="p-2.5 px-3 text-right">Blocking Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {thirdParties.map((tp, idx) => (
                  <tr key={idx} className="hover:bg-surface-2">
                    <td className="p-2.5 px-3 font-sans font-semibold text-text-primary">
                      {tp.entity}
                    </td>
                    <td className="p-2.5 px-3 text-right text-text-tertiary">
                      {formatBytes(tp.transferSize)}
                    </td>
                    <td className="p-2.5 px-3 text-right text-score-warn font-bold">
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

