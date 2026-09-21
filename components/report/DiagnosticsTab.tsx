"use client";

import React, { useState } from "react";
import {
  Stack,
  CaretDown,
  CaretUp,
  CheckCircle,
  SlidersHorizontal,
} from "@phosphor-icons/react";
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
      <div className="bg-surface-0/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-3xl p-10 text-center text-text-secondary space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-score-good/10 text-score-good border border-score-good/20 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle weight="fill" className="h-6 w-6" />
        </div>
        <h4 className="text-base font-bold text-text-primary">
          All Diagnostic Health Checks Passed
        </h4>
        <p className="text-xs text-text-tertiary max-w-md mx-auto leading-relaxed">
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
              className={`bg-surface-0/70 dark:bg-white/[0.03] backdrop-blur-xl border rounded-2xl overflow-hidden shadow-xs transition-all ${
                isExpanded
                  ? "border-brand-500/40 dark:border-brand-500/40 ring-1 ring-brand-500/20 shadow-md"
                  : "border-border/60 dark:border-white/[0.07] hover:border-border dark:hover:border-white/[0.15]"
              }`}
            >
              {/* Header Container */}
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
                className="w-full p-4.5 sm:p-5 flex items-start justify-between gap-4 text-left cursor-pointer hover:bg-surface-1/40 dark:hover:bg-white/[0.02] transition-colors select-none"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="mt-0.5 p-2.5 rounded-xl bg-surface-1/80 dark:bg-white/[0.04] text-text-secondary border border-border/50 dark:border-white/[0.07] shrink-0 shadow-2xs">
                    <Stack weight="bold" className="h-4 w-4" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-text-primary tracking-tight">
                        {diag.title}
                      </h4>
                      {diag.displayValue && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold score-badge-warn border border-amber-500/20">
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

                <div className="flex items-center gap-2.5 shrink-0">
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
                      className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-surface-1/80 dark:bg-white/[0.04] hover:bg-surface-2 dark:hover:bg-white/[0.08] border border-border/60 dark:border-white/[0.07] text-text-secondary hover:text-brand-600 dark:hover:text-brand-300 transition-all cursor-pointer shadow-2xs"
                      title="Open in Drawer"
                    >
                      <SlidersHorizontal weight="bold" className="h-3.5 w-3.5" />
                      <span>Inspect</span>
                    </button>
                  )}

                  <div className="p-2 rounded-xl bg-surface-1/80 dark:bg-white/[0.04] border border-border/50 dark:border-white/[0.07] text-text-tertiary">
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
                <div className="p-5 border-t border-border/50 dark:border-white/[0.07] bg-surface-1/30 dark:bg-black/30 space-y-4 text-xs">
                  <FormattedDescription
                    text={diag.description}
                    className="text-xs text-text-secondary leading-relaxed"
                  />

                  {items.length > 0 && headings.length > 0 && (
                    <div className="space-y-2.5 pt-1">
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
                            className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-500 font-semibold cursor-pointer transition-colors"
                          >
                            Open in Side Inspector →
                          </button>
                        )}
                      </div>

                      <div className="border border-border/60 dark:border-white/[0.07] rounded-2xl overflow-x-auto bg-surface-0/80 dark:bg-[#0c0e14]/90 shadow-2xs">
                        <table className="w-full text-left border-collapse text-xs font-mono">
                          <thead>
                            <tr className="bg-surface-1/70 dark:bg-white/[0.03] border-b border-border/50 dark:border-white/[0.07] text-text-tertiary text-[11px]">
                              {headings.map((h, hIdx) => (
                                <th key={hIdx} className="p-3 px-3.5 whitespace-nowrap font-semibold">
                                  {h.label || h.text || h.key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40 dark:divide-white/[0.05]">
                            {items.slice(0, 15).map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-surface-1/50 dark:hover:bg-white/[0.02] transition-colors">
                                {headings.map((h, hIdx) => {
                                  const cellVal = row[h.key];
                                  const displayVal =
                                    typeof cellVal === "object" && cellVal !== null
                                      ? cellVal.url || cellVal.snippet || JSON.stringify(cellVal)
                                      : String(cellVal ?? "—");

                                  return (
                                    <td key={hIdx} className="p-3 px-3.5 max-w-xs truncate text-text-primary">
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

