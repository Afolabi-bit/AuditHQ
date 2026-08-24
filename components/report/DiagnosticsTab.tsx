"use client";

import React, { useState } from "react";
import {
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Activity,
  SlidersHorizontal,
} from "lucide-react";
import { ParsedLighthouseReport } from "@/lib/report-parser";
import { FormattedDescription } from "./FormattedDescription";
import { DiagnosticItemDetail } from "./DiagnosticInspectorDrawer";

interface DiagnosticsTabProps {
  diagnostics: ParsedLighthouseReport["diagnostics"];
  onInspectItem?: (item: DiagnosticItemDetail) => void;
}

export const DiagnosticsTab: React.FC<DiagnosticsTabProps> = ({
  diagnostics,
  onInspectItem,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    diagnostics[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!diagnostics || diagnostics.length === 0) {
    return (
      <div className="bg-surface-0 border border-border rounded-2xl p-10 text-center text-text-secondary space-y-2 shadow-xs">
        <CheckCircle2 className="h-10 w-10 text-score-good mx-auto" />
        <h4 className="text-base font-bold text-text-primary">
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
      {/* Diagnostics List */}
      <div className="space-y-3">
        {diagnostics.map((diag) => {
          const isExpanded = expandedId === diag.id;
          const items: any[] = diag.details?.items || [];
          const headings: any[] = diag.details?.headings || [];

          return (
            <div
              key={diag.id}
              className={`bg-surface-0 border rounded-2xl overflow-hidden shadow-xs transition-all ${
                isExpanded ? "border-brand-200 dark:border-brand-500/30" : "border-border hover:border-brand-200 dark:hover:border-brand-500/30"
              }`}
            >
              {/* Header Container (div with role=button to prevent nested button errors) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(diag.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpand(diag.id);
                  }
                }}
                className="w-full p-4.5 sm:p-5 flex items-start justify-between gap-4 text-left cursor-pointer hover:bg-surface-1 transition-colors select-none"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 p-2 rounded-xl bg-surface-1 text-text-secondary border border-border shrink-0 shadow-2xs">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-text-primary">
                        {diag.title}
                      </h4>
                      {diag.displayValue && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold score-badge-warn">
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
                  {onInspectItem && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectItem({
                          id: diag.id,
                          title: diag.title,
                          description: diag.description,
                          displayValue: diag.displayValue,
                          items: diag.details?.items,
                        });
                      }}
                      className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-text-secondary hover:text-brand-600 dark:hover:text-brand-300 transition-colors cursor-pointer"
                      title="Open in Drawer"
                    >
                      <SlidersHorizontal className="h-3 w-3" />
                      <span>Inspect</span>
                    </button>
                  )}

                  <div className="p-1.5 rounded-lg bg-surface-1 border border-border text-text-tertiary">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-5 border-t border-border bg-surface-1 space-y-4 text-xs">
                  <FormattedDescription
                    text={diag.description}
                    className="text-xs text-text-secondary leading-relaxed"
                  />

                  {items.length > 0 && headings.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-text-primary uppercase tracking-wider text-[11px]">
                          Report Breakdown ({items.length})
                        </p>
                        {onInspectItem && (
                          <button
                            onClick={() => onInspectItem({
                              id: diag.id,
                              title: diag.title,
                              description: diag.description,
                              displayValue: diag.displayValue,
                              items: diag.details?.items,
                            })}
                            className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold cursor-pointer"
                          >
                            Open in Side Inspector →
                          </button>
                        )}
                      </div>

                      <div className="border border-border rounded-xl overflow-x-auto bg-surface-0">
                        <table className="w-full text-left border-collapse text-xs font-mono">
                          <thead>
                            <tr className="bg-surface-1 border-b border-border text-text-tertiary text-[11px]">
                              {headings.map((h, hIdx) => (
                                <th key={hIdx} className="p-2.5 px-3 whitespace-nowrap">
                                  {h.label || h.text || h.key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {items.slice(0, 15).map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-surface-1/50 transition-colors">
                                {headings.map((h, hIdx) => {
                                  const cellVal = row[h.key];
                                  const displayVal =
                                    typeof cellVal === "object" && cellVal !== null
                                      ? cellVal.url || cellVal.snippet || JSON.stringify(cellVal)
                                      : String(cellVal ?? "—");

                                  return (
                                    <td key={hIdx} className="p-2.5 px-3 max-w-xs truncate text-text-primary">
                                      {displayVal}
                                    </td>
                                  );
                                })}
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
    </div>
  );
};
