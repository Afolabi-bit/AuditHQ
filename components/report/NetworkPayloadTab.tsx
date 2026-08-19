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
          text: "text-[#b76e00]",
          bg: "bg-[#fff8e5]",
        };
      case "image":
        return {
          bar: "bg-[#00875a]",
          text: "text-[#00875a]",
          bg: "bg-[#e3fcf7]",
        };
      case "stylesheet":
        return {
          bar: "bg-[#635bff]",
          text: "text-[#635bff]",
          bg: "bg-[#f0f2ff]",
        };
      case "font":
        return {
          bar: "bg-[#8b5cf6]",
          text: "text-[#8b5cf6]",
          bg: "bg-[#f5f3ff]",
        };
      case "document":
        return {
          bar: "bg-[#0284c7]",
          text: "text-[#0284c7]",
          bg: "bg-[#f0f9ff]",
        };
      default:
        return {
          bar: "bg-[#8898aa]",
          text: "text-[#8898aa]",
          bg: "bg-[#f1f5f9]",
        };
    }
  };

  return (
    <div className="space-y-5">
      {/* Top 3 Stat Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Page Weight */}
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#8898aa] uppercase tracking-wider font-mono">
              Total Page Weight
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#0a2540]">
              {formatBytes(totalByteWeight)}
            </p>
            <p className="text-[11px] font-sans text-[#425466]">
              {totalByteWeight <= 1600 * 1024
                ? "Optimal payload (<1.6MB target)"
                : "Consider asset compression"}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#f0f2ff] text-[#635bff] border border-brand-200">
            <HardDrive className="h-5 w-5" />
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#8898aa] uppercase tracking-wider font-mono">
              Network Requests
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#0a2540]">
              {totalRequests}
            </p>
            <p className="text-[11px] font-sans text-[#425466]">
              {totalRequests <= 50 ? "Minimal HTTP requests" : "Consider asset bundling"}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#e3fcf7] text-[#00875a] border border-[#abf5d1]">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>

        {/* Third-Party Payloads */}
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#8898aa] uppercase tracking-wider font-mono">
              Third-Party Entities
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#0a2540]">
              {thirdParties.length}
            </p>
            <p className="text-[11px] font-sans text-[#425466]">
              External scripts & analytics
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#fff8e5] text-[#b76e00] border border-[#ffe380]">
            <Globe className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Asset Type Breakdown */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 shadow-[0_1px_3px_rgba(50,50,93,0.08)] space-y-4">
        <h4 className="text-sm font-bold text-[#0a2540] font-sans">
          Resource Type Breakdown
        </h4>

        {/* Segmented Bar */}
        <div className="h-3 w-full bg-[#f1f5f9] rounded-full overflow-hidden flex">
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
        <div className="border border-[#e3e8ee] rounded-lg overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e3e8ee] text-[#8898aa] text-[11px]">
                <th className="p-2.5 px-3">Resource Type</th>
                <th className="p-2.5 px-3 text-right">Requests</th>
                <th className="p-2.5 px-3 text-right">Transfer Size</th>
                <th className="p-2.5 px-3 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {resourceSummary.map((res, idx) => {
                const percent = totalByteWeight > 0 ? ((res.transferSize / totalByteWeight) * 100).toFixed(1) : "0";
                const color = getResourceColor(res.resourceType);
                return (
                  <tr key={idx} className="hover:bg-[#f8fafc]">
                    <td className="p-2.5 px-3 font-sans font-semibold text-[#0a2540] flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${color.bar}`} />
                      {res.label}
                    </td>
                    <td className="p-2.5 px-3 text-right text-[#8898aa]">
                      {res.requestCount}
                    </td>
                    <td className="p-2.5 px-3 text-right font-bold text-[#0a2540]">
                      {formatBytes(res.transferSize)}
                    </td>
                    <td className="p-2.5 px-3 text-right text-[#8898aa]">
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
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 shadow-[0_1px_3px_rgba(50,50,93,0.08)] space-y-3">
          <h4 className="text-sm font-bold text-[#0a2540] font-sans">
            Third-Party Code Impact ({thirdParties.length})
          </h4>
          <div className="border border-[#e3e8ee] rounded-lg overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e3e8ee] text-[#8898aa] text-[11px]">
                  <th className="p-2.5 px-3">Third-Party Entity</th>
                  <th className="p-2.5 px-3 text-right">Transfer Size</th>
                  <th className="p-2.5 px-3 text-right">Blocking Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {thirdParties.map((tp, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafc]">
                    <td className="p-2.5 px-3 font-sans font-semibold text-[#0a2540]">
                      {tp.entity}
                    </td>
                    <td className="p-2.5 px-3 text-right text-[#8898aa]">
                      {formatBytes(tp.transferSize)}
                    </td>
                    <td className="p-2.5 px-3 text-right text-[#b76e00] font-bold">
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
