"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  CaretDown,
  CaretUp,
  Lightning,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { FormattedDescription } from "./FormattedDescription";
import { formatBytes, formatMilliseconds, ParsedLighthouseReport } from "@/lib/report-parser";
import { DiagnosticItemDetail } from "./DiagnosticInspectorDrawer";

interface OpportunitiesTabProps {
  opportunities: ParsedLighthouseReport["opportunities"];
  diagnostics?: ParsedLighthouseReport["diagnostics"];
  onInspectItem?: (item: DiagnosticItemDetail) => void;
}

export const OpportunitiesTab: React.FC<OpportunitiesTabProps> = ({
  opportunities,
  onInspectItem,
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
        badge: "score-badge-poor",
      };
    }
    if ((savingsMs && savingsMs >= 150) || (savingsBytes && savingsBytes >= 100 * 1024)) {
      return {
        label: "Medium Impact",
        badge: "score-badge-warn",
      };
    }
    return {
      label: "Low Impact",
      badge: "score-badge-good",
    };
  };

  return (
    <div className="space-y-5">
      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-surface-0 text-text-secondary hover:text-text-primary hover:bg-surface-1 border border-border"
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
        <div className="bg-surface-0 border border-border rounded-2xl p-10 text-center text-text-secondary space-y-2 shadow-xs">
          <CheckCircle weight="fill" className="h-10 w-10 text-score-good mx-auto" />
          <h4 className="text-base font-bold text-text-primary">
            No Optimization Opportunities Found
          </h4>
          <p className="text-xs text-text-tertiary max-w-md mx-auto">
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
                className="bg-surface-0 border border-border rounded-2xl overflow-hidden shadow-xs hover:border-brand-200 dark:hover:border-brand-500/30 transition-all"
              >
                {/* Header Row */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExpand(opp.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExpand(opp.id);
                    }
                  }}
                  className="w-full p-4.5 sm:p-5 flex items-start justify-between gap-4 text-left cursor-pointer hover:bg-surface-1 transition-colors select-none"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 shrink-0 mt-0.5 shadow-2xs">
                      <Lightning weight="fill" className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-text-primary">
                          {opp.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${impact.badge}`}>
                          {impact.label}
                        </span>
                      </div>
                      <FormattedDescription
                        text={opp.description}
                        className="text-xs text-text-secondary line-clamp-1 block"
                        isTruncatedPreview={true}
                      />
                    </div>
                  </div>

                  {/* Savings Figures & Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right font-mono hidden sm:block">
                      {opp.overallSavingsMs != null && opp.overallSavingsMs > 0 && (
                        <p className="text-sm font-bold text-score-poor">
                          -{formatMilliseconds(opp.overallSavingsMs)}
                        </p>
                      )}
                      {opp.overallSavingsBytes != null && opp.overallSavingsBytes > 0 && (
                        <p className="text-xs text-text-tertiary">
                          Save {formatBytes(opp.overallSavingsBytes)}
                        </p>
                      )}
                    </div>

                    {onInspectItem && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectItem(opp as any);
                        }}
                        className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-text-secondary hover:text-brand-600 dark:hover:text-brand-300 transition-colors cursor-pointer"
                        title="Open Drawer Inspector"
                      >
                        <SlidersHorizontal weight="bold" className="h-3 w-3" />
                        <span>Inspect</span>
                      </button>
                    )}

                    <div className="p-1.5 rounded-lg bg-surface-1 border border-border text-text-tertiary">
                      {isExpanded ? (
                        <CaretUp weight="bold" className="h-4 w-4" />
                      ) : (
                        <CaretDown weight="bold" className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-border bg-surface-1 space-y-4 text-xs">
                    <FormattedDescription
                      text={opp.description}
                      className="text-xs text-text-secondary leading-relaxed"
                    />

                    {/* Table of Offending Resources */}
                    {opp.items && opp.items.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-text-primary uppercase tracking-wider text-[11px]">
                            Identified Assets ({opp.items.length})
                          </p>
                          {onInspectItem && (
                            <button
                              onClick={() => onInspectItem(opp as any)}
                              className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                            >
                              Open in Side Inspector →
                            </button>
                          )}
                        </div>

                        <div className="border border-border rounded-xl overflow-x-auto bg-surface-0">
                          <table className="w-full text-left border-collapse text-xs font-mono">
                            <thead>
                              <tr className="bg-surface-1 border-b border-border text-text-tertiary text-[11px]">
                                <th className="p-2.5 px-3">URL / Resource</th>
                                <th className="p-2.5 px-3 text-right">Potential Savings</th>
                                <th className="p-2.5 px-3 text-right">Total Size</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {opp.items.slice(0, 10).map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-surface-1/50 transition-colors">
                                  <td className="p-2.5 px-3 max-w-md truncate text-text-primary" title={row.url}>
                                    {row.url || "Resource Asset"}
                                  </td>
                                  <td className="p-2.5 px-3 text-right text-score-poor font-bold">
                                    {row.wastedMs != null
                                      ? formatMilliseconds(row.wastedMs)
                                      : row.wastedBytes != null
                                      ? formatBytes(row.wastedBytes)
                                      : "—"}
                                  </td>
                                  <td className="p-2.5 px-3 text-right text-text-tertiary">
                                    {row.totalBytes != null ? formatBytes(row.totalBytes) : "—"}
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

