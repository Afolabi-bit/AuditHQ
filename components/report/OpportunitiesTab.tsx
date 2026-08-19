"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  HardDrive,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { FormattedDescription } from "./FormattedDescription";
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
        badge: "bg-[#ffebe6] text-[#de350b] border-[#ffbdad]",
      };
    }
    if ((savingsMs && savingsMs >= 150) || (savingsBytes && savingsBytes >= 100 * 1024)) {
      return {
        label: "Medium Impact",
        badge: "bg-[#fff8e5] text-[#b76e00] border-[#ffe380]",
      };
    }
    return {
      label: "Low Impact",
      badge: "bg-[#f0f2ff] text-[#635bff] border-brand-200",
    };
  };

  return (
    <div className="space-y-5">
      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e3e8ee]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
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
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-sans ${
                filter === tab.id
                  ? "bg-[#635bff] text-white shadow-xs"
                  : "bg-white text-[#425466] hover:bg-[#f8fafc] border border-[#e3e8ee]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#8898aa]">
          {filteredOpportunities.length} actionable {filteredOpportunities.length === 1 ? "audit" : "audits"}
        </span>
      </div>

      {/* Opportunities List */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-10 text-center text-[#425466] space-y-2 shadow-[0_1px_3px_rgba(50,50,93,0.08)]">
          <CheckCircle2 className="h-10 w-10 text-[#00875a] mx-auto" />
          <h4 className="text-base font-bold text-[#0a2540]">
            No Optimization Opportunities Found
          </h4>
          <p className="text-xs text-[#8898aa] max-w-md mx-auto">
            Great work! All resources in this category meet Google Lighthouse efficiency standards.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOpportunities.map((opp) => {
            const isExpanded = expandedId === opp.id;
            const impact = getImpactBadge(opp.overallSavingsMs, opp.overallSavingsBytes);

            return (
              <div
                key={opp.id}
                className="bg-white border border-[#e3e8ee] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(50,50,93,0.08)] hover:border-brand-200 transition-all"
              >
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => toggleExpand(opp.id)}
                  className="w-full p-4.5 sm:p-5 flex items-start justify-between gap-4 text-left cursor-pointer hover:bg-[#f8fafc] transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-[#f0f2ff] border border-brand-200 text-[#635bff] shrink-0 mt-0.5">
                      <Zap className="h-4 w-4 fill-[#635bff]" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[#0a2540] font-sans">
                          {opp.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${impact.badge}`}>
                          {impact.label}
                        </span>
                      </div>
                      <FormattedDescription
                        text={opp.description}
                        className="text-xs text-[#425466] line-clamp-1 block"
                        isTruncatedPreview={true}
                      />
                    </div>
                  </div>

                  {/* Savings Figures & Toggle */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right font-mono hidden sm:block">
                      {opp.overallSavingsMs != null && opp.overallSavingsMs > 0 && (
                        <p className="text-sm font-bold text-[#de350b]">
                          -{formatMilliseconds(opp.overallSavingsMs)}
                        </p>
                      )}
                      {opp.overallSavingsBytes != null && opp.overallSavingsBytes > 0 && (
                        <p className="text-xs text-[#8898aa]">
                          Save {formatBytes(opp.overallSavingsBytes)}
                        </p>
                      )}
                    </div>

                    <div className="p-1.5 rounded-md bg-[#f8fafc] border border-[#e3e8ee] text-[#8898aa]">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-[#f1f5f9] bg-[#f8fafc] space-y-4 text-xs">
                    <FormattedDescription
                      text={opp.description}
                      className="text-xs text-[#425466] leading-relaxed"
                    />

                    {/* Table of Offending Resources */}
                    {opp.items && opp.items.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-bold text-[#0a2540] uppercase tracking-wider text-[11px]">
                          Identified Assets ({opp.items.length})
                        </p>
                        <div className="border border-[#e3e8ee] rounded-lg overflow-x-auto bg-white">
                          <table className="w-full text-left border-collapse text-xs font-mono">
                            <thead>
                              <tr className="bg-[#f8fafc] border-b border-[#e3e8ee] text-[#8898aa] text-[11px]">
                                <th className="p-2.5 px-3">URL / Resource</th>
                                <th className="p-2.5 px-3 text-right">Transfer Size</th>
                                <th className="p-2.5 px-3 text-right">Potential Savings</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                              {opp.items.slice(0, 10).map((item, idx) => (
                                <tr key={idx} className="hover:bg-[#f8fafc]">
                                  <td className="p-2.5 px-3 truncate max-w-xs text-[#0a2540]">
                                    {item.url || item.label || item.node?.snippet || "Inline Element"}
                                  </td>
                                  <td className="p-2.5 px-3 text-right text-[#8898aa]">
                                    {item.totalBytes ? formatBytes(item.totalBytes) : "—"}
                                  </td>
                                  <td className="p-2.5 px-3 text-right text-[#de350b] font-bold">
                                    {item.wastedBytes
                                      ? formatBytes(item.wastedBytes)
                                      : item.wastedMs
                                      ? `${item.wastedMs}ms`
                                      : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
