"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  HardDrive,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ExternalLink,
  Code,
  Filter,
  Zap,
  ArrowRight,
} from "lucide-react";
import { formatBytes, formatMilliseconds, ParsedLighthouseReport } from "@/lib/report-parser";

interface OpportunitiesTabProps {
  opportunities: ParsedLighthouseReport["opportunities"];
  diagnostics: ParsedLighthouseReport["diagnostics"];
}

export const OpportunitiesTab: React.FC<OpportunitiesTabProps> = ({
  opportunities,
  diagnostics,
}) => {
  const [filter, setFilter] = useState<"all" | "images" | "js" | "css" | "server">("all");
  const [expandedId, setExpandedId] = useState<string | null>(opportunities[0]?.id || null);

  const filteredOpportunities = opportunities.filter((item) => {
    if (filter === "all") return true;
    const lowerId = item.id.toLowerCase();
    if (filter === "images") return lowerId.includes("image") || lowerId.includes("format");
    if (filter === "js") return lowerId.includes("javascript") || lowerId.includes("script");
    if (filter === "css") return lowerId.includes("css") || lowerId.includes("render-blocking");
    if (filter === "server") return lowerId.includes("cache") || lowerId.includes("server") || lowerId.includes("redirect");
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getImpactBadge = (savingsMs?: number, savingsBytes?: number) => {
    if ((savingsMs && savingsMs >= 500) || (savingsBytes && savingsBytes >= 500 * 1024)) {
      return {
        label: "High Impact",
        beacon: "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
        badge: "bg-rose-50 text-rose-700 border-rose-200",
      };
    }
    if ((savingsMs && savingsMs >= 150) || (savingsBytes && savingsBytes >= 100 * 1024)) {
      return {
        label: "Medium Impact",
        beacon: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
      };
    }
    return {
      label: "Low Impact",
      beacon: "bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.5)]",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
    };
  };

  return (
    <div className="space-y-5">
      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "all", label: "All Priorities" },
            { id: "images", label: "Images & Media" },
            { id: "js", label: "JavaScript" },
            { id: "css", label: "CSS & Styles" },
            { id: "server", label: "Server & Caching" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap font-sans ${
                filter === tab.id
                  ? "bg-brand-600 text-white shadow-brand"
                  : "bg-surface-1 text-text-secondary hover:bg-surface-2 border border-surface-3"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-text-tertiary">
          {filteredOpportunities.length} actionable {filteredOpportunities.length === 1 ? "audit" : "audits"}
        </span>
      </div>

      {/* Opportunities List */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-surface-0 border border-surface-3 rounded-2xl p-10 text-center text-text-secondary space-y-2 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-text-primary font-sans">
            No optimization bottlenecks found
          </h4>
          <p className="text-xs text-text-tertiary max-w-md mx-auto">
            Your website satisfies Google's performance best practices in this category with zero major regressions.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOpportunities.map((item) => {
            const isExpanded = expandedId === item.id;
            const impact = getImpactBadge(item.overallSavingsMs, item.overallSavingsBytes);

            return (
              <div
                key={item.id}
                className={`bg-surface-0 border rounded-2xl overflow-hidden transition-all duration-200 shadow-xs ${
                  isExpanded ? "border-brand-300 shadow-sm" : "border-surface-3 hover:border-brand-200"
                }`}
              >
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-surface-1/40 transition-colors gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="mt-1 flex items-center justify-center">
                      <span className={`w-2.5 h-2.5 rounded-full ${impact.beacon}`} />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-text-primary font-sans leading-tight">
                          {item.title}
                        </h4>
                        <span className={`px-2 py-0.2 rounded-md text-[10px] font-mono font-bold border uppercase tracking-wider ${impact.badge}`}>
                          {impact.label}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-1">
                        {item.description.replace(/\[(.*?)\]\(.*?\)/g, "$1")}
                      </p>
                    </div>
                  </div>

                  {/* Savings Badges in JetBrains Mono */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    {item.overallSavingsMs != null && item.overallSavingsMs > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Clock className="h-3 w-3" />
                        Save ~{formatMilliseconds(item.overallSavingsMs)}
                      </span>
                    )}

                    {item.overallSavingsBytes != null && item.overallSavingsBytes > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <HardDrive className="h-3 w-3" />
                        Save ~{formatBytes(item.overallSavingsBytes)}
                      </span>
                    )}

                    <div className="text-text-tertiary p-1 rounded-lg hover:bg-surface-2 transition-colors">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-5 py-4 border-t border-surface-3 bg-surface-1/50 space-y-3.5 text-xs">
                    <p className="text-text-secondary leading-relaxed font-sans">
                      {item.description.replace(/\[(.*?)\]\((.*?)\)/g, "$1")}
                    </p>

                    {item.items && item.items.length > 0 && (
                      <div className="overflow-hidden rounded-xl border border-surface-3 bg-surface-0 shadow-2xs">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-surface-1 text-text-secondary font-mono font-semibold border-b border-surface-3">
                            <tr>
                              <th className="py-2.5 px-3.5">Resource / Asset URL</th>
                              {item.items.some((i) => i.totalBytes != null) && (
                                <th className="py-2.5 px-3.5 text-right">Transfer Size</th>
                              )}
                              {item.items.some((i) => i.wastedBytes != null) && (
                                <th className="py-2.5 px-3.5 text-right">Potential Savings</th>
                              )}
                              {item.items.some((i) => i.wastedMs != null) && (
                                <th className="py-2.5 px-3.5 text-right">Execution Delay</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-surface-2 font-mono text-text-secondary">
                            {item.items.map((row, idx) => (
                              <tr key={idx} className="hover:bg-surface-1/60 transition-colors">
                                <td className="py-2.5 px-3.5 truncate max-w-md" title={row.url || row.label}>
                                  <span className="text-text-primary font-medium">{row.url || row.label || "Resource item"}</span>
                                </td>
                                {row.totalBytes != null && (
                                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap text-text-tertiary">
                                    {formatBytes(row.totalBytes)}
                                  </td>
                                )}
                                {row.wastedBytes != null && (
                                  <td className="py-2.5 px-3.5 text-right text-rose-600 font-bold whitespace-nowrap">
                                    {formatBytes(row.wastedBytes)}
                                  </td>
                                )}
                                {row.wastedMs != null && (
                                  <td className="py-2.5 px-3.5 text-right text-rose-600 font-bold whitespace-nowrap">
                                    {formatMilliseconds(row.wastedMs)}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
