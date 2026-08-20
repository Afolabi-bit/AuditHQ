"use client";

import React, { useState } from "react";
import {
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { ParsedLighthouseReport } from "@/lib/report-parser";
import { FormattedDescription } from "./FormattedDescription";

interface DiagnosticsTabProps {
  diagnostics: ParsedLighthouseReport["diagnostics"];
}

export const DiagnosticsTab: React.FC<DiagnosticsTabProps> = ({ diagnostics }) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    diagnostics[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!diagnostics || diagnostics.length === 0) {
    return (
      <div className="bg-surface-0 border border-border rounded-xl p-10 text-center text-text-secondary space-y-2 shadow-xs">
        <CheckCircle2 className="h-10 w-10 text-score-good mx-auto" />
        <h4 className="text-base font-bold text-text-primary font-sans">
          All Diagnostic Health Checks Passed
        </h4>
        <p className="text-xs text-text-tertiary max-w-md mx-auto">
          No critical diagnostic bottlenecks or rendering thread stalls were identified during this audit run.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-0 border border-border rounded-xl p-4.5 px-6 shadow-xs">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2 font-sans">
            <Layers className="h-4 w-4 text-brand-500" />
            Deep Engine Diagnostics
          </h3>
          <p className="text-xs text-text-secondary">
            Technical runtime analysis of DOM complexity, layout shifts, main-thread work, and rendering tasks
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-500 border border-brand-200">
          <Activity className="h-3.5 w-3.5" />
          {diagnostics.length} {diagnostics.length === 1 ? "diagnostic" : "diagnostics"} flagged
        </span>
      </div>

      {/* Diagnostics List */}
      <div className="space-y-3">
        {diagnostics.map((diag) => {
          const isExpanded = expandedId === diag.id;
          const items: any[] = diag.details?.items || [];
          const headings: any[] = diag.details?.headings || [];

          return (
            <div
              key={diag.id}
              className={`bg-surface-0 border rounded-xl overflow-hidden shadow-xs transition-all ${
                isExpanded ? "border-brand-200" : "border-border hover:border-brand-200"
              }`}
            >
              {/* Header Button */}
              <button
                type="button"
                onClick={() => toggleExpand(diag.id)}
                className="w-full p-4.5 sm:p-5 flex items-start justify-between gap-4 text-left cursor-pointer hover:bg-surface-2 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 p-2 rounded-lg bg-brand-50 text-brand-500 border border-brand-200 shrink-0">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-text-primary font-sans">
                        {diag.title}
                      </h4>
                      {diag.displayValue && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#fff8e5] text-[#b76e00] border border-[#ffe380] dark:bg-[#b76e00]/15 dark:text-[#ffc400] dark:border-[#b76e00]/30">
                          {diag.displayValue}
                        </span>
                      )}
                    </div>
                    <FormattedDescription
                      text={diag.description}
                      className="text-xs text-text-secondary line-clamp-1 block"
                      isTruncatedPreview={true}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {items.length > 0 && (
                    <span className="text-[11px] font-mono text-text-tertiary bg-surface-1 px-2 py-0.5 rounded border border-border hidden sm:inline">
                      {items.length} records
                    </span>
                  )}
                  <div className="p-1.5 rounded-md bg-surface-1 border border-border text-text-tertiary">
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
                <div className="p-5 border-t border-border bg-surface-1 space-y-4 text-xs">
                  <FormattedDescription
                    text={diag.description}
                    className="text-xs text-text-secondary leading-relaxed"
                  />

                  {/* Diagnostic Data Table */}
                  {items.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-bold text-text-primary uppercase tracking-wider text-[11px] font-sans">
                        Diagnostic Data ({items.length})
                      </p>
                      <div className="border border-border rounded-lg overflow-x-auto bg-surface-0">
                        <table className="w-full text-left border-collapse text-xs font-mono">
                          {headings.length > 0 && (
                            <thead>
                              <tr className="bg-surface-1 border-b border-border text-text-tertiary text-[11px]">
                                {headings.slice(0, 4).map((h, hIdx) => (
                                  <th key={hIdx} className="p-2.5 px-3">
                                    {h.text || h.label || h.key || "Metric"}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody className="divide-y divide-border">
                            {items.slice(0, 10).map((item, rowIdx) => {
                              return (
                                <tr key={rowIdx} className="hover:bg-surface-2">
                                  {headings.length > 0 ? (
                                    headings.slice(0, 4).map((h, colIdx) => {
                                      const key = h.key || Object.keys(item)[colIdx];
                                      const cellVal = item[key];
                                      const renderedVal =
                                        typeof cellVal === "object" && cellVal !== null
                                          ? cellVal.snippet || cellVal.url || cellVal.text || JSON.stringify(cellVal)
                                          : String(cellVal ?? "—");

                                      return (
                                        <td
                                          key={colIdx}
                                          className="p-2.5 px-3 truncate max-w-xs text-text-primary"
                                        >
                                          {renderedVal}
                                        </td>
                                      );
                                    })
                                  ) : (
                                    <td className="p-2.5 px-3 text-text-primary">
                                      {item.url || item.label || item.statistic || JSON.stringify(item)}
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
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
    </div>
  );
};
