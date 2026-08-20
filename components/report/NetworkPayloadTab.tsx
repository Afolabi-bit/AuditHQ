"use client";

import React from "react";
import { HardDrive, Globe, BarChart3 } from "lucide-react";
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
          bar: "bg-[#b76e00]",
          text: "text-score-warn",
          bg: "bg-[#fff8e5] dark:bg-[#b76e00]/15",
        };
      case "image":
        return {
          bar: "bg-[#00875a]",
          text: "text-score-good",
          bg: "bg-[#e3fcf7] dark:bg-[#00875a]/15",
        };
      case "stylesheet":
        return {
          bar: "bg-brand-600",
          text: "text-brand-500",
          bg: "bg-brand-50",
        };
      case "font":
        return {
          bar: "bg-[#8b5cf6]",
          text: "text-[#8b5cf6]",
          bg: "bg-[#f5f3ff] dark:bg-[#8b5cf6]/15",
        };
      case "document":
        return {
          bar: "bg-[#0284c7]",
          text: "text-[#0284c7]",
          bg: "bg-[#f0f9ff] dark:bg-[#0284c7]/15",
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
          <div className="p-3 rounded-lg bg-brand-50 text-brand-500 border border-brand-200">
            <HardDrive className="h-5 w-5" />
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
            <BarChart3 className="h-5 w-5" />
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
            <Globe className="h-5 w-5" />
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
