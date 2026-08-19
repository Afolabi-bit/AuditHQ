"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { HardDrive, Globe, ShieldAlert, Cpu, BarChart3 } from "lucide-react";
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
    switch (type) {
      case "script":
        return {
          bar: "bg-amber-500",
          text: "text-amber-600",
          border: "border-amber-200",
          bg: "bg-amber-50",
        };
      case "image":
        return {
          bar: "bg-blue-500",
          text: "text-blue-600",
          border: "border-blue-200",
          bg: "bg-blue-50",
        };
      case "stylesheet":
        return {
          bar: "bg-indigo-500",
          text: "text-indigo-600",
          border: "border-indigo-200",
          bg: "bg-indigo-50",
        };
      case "font":
        return {
          bar: "bg-purple-500",
          text: "text-purple-600",
          border: "border-purple-200",
          bg: "bg-purple-50",
        };
      case "document":
        return {
          bar: "bg-emerald-500",
          text: "text-emerald-600",
          border: "border-emerald-200",
          bg: "bg-emerald-50",
        };
      case "media":
        return {
          bar: "bg-rose-500",
          text: "text-rose-600",
          border: "border-rose-200",
          bg: "bg-rose-50",
        };
      default:
        return {
          bar: "bg-slate-400",
          text: "text-slate-600",
          border: "border-slate-200",
          bg: "bg-slate-50",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Total Page Weight
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatBytes(totalByteWeight)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {totalByteWeight <= 1600 * 1024
                  ? "🟢 Optimal weight (<1.6MB)"
                  : "🟡 Consider reducing payload"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <HardDrive className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Total HTTP Requests
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {totalRequests}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Across {resourceSummary.length} resource types
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <BarChart3 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Third-Party Scripts
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {thirdParties.length}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                External tracking & analytics
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Globe className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-segment Distribution Bar */}
      {totalByteWeight > 0 && (
        <Card className="border-slate-200 p-5 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Resource Weight Distribution
          </h4>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
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

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
            {resourceSummary.map((res) => {
              const color = getResourceColor(res.resourceType);
              const pct = ((res.transferSize / totalByteWeight) * 100).toFixed(
                1,
              );
              return (
                <div
                  key={res.resourceType}
                  className="flex items-center gap-1.5 font-medium text-slate-600"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${color.bar}`} />
                  <span>{res.label}:</span>
                  <span className="font-bold text-slate-900">
                    {formatBytes(res.transferSize)}
                  </span>
                  <span className="text-slate-400">({pct}%)</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Resource Table & Third Party Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resource Breakdown Table */}
        <Card className="border-slate-200 lg:col-span-6 shadow-2xs">
          <CardHeader className="py-4 px-5 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-900">
              Payload by Asset Type
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4">Resource Type</th>
                  <th className="py-2.5 px-4 text-center">Requests</th>
                  <th className="py-2.5 px-4 text-right">Transfer Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resourceSummary.map((item) => (
                  <tr key={item.resourceType} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {item.label}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">
                      {item.requestCount}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                      {formatBytes(item.transferSize)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Third-Party Scripts Breakdown */}
        <Card className="border-slate-200 lg:col-span-6 shadow-2xs">
          <CardHeader className="py-4 px-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900">
              Third-Party Impact
            </CardTitle>
            <span className="text-xs text-slate-400 font-normal">
              {thirdParties.length} services detected
            </span>
          </CardHeader>
          <CardContent className="p-0">
            {thirdParties.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No third-party scripts detected. Fast & clean!
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4">Provider / Entity</th>
                    <th className="py-2.5 px-4 text-right">Transfer Size</th>
                    <th className="py-2.5 px-4 text-right">Blocking Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {thirdParties.map((tp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-800 truncate max-w-45">
                        {tp.entity}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        {formatBytes(tp.transferSize)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-600 font-semibold">
                        {tp.blockingTime > 0
                          ? formatMilliseconds(tp.blockingTime)
                          : "0 ms"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
