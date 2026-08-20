"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  Zap,
} from "lucide-react";
import { OpportunityTransition, OpportunityState } from "@/lib/comparison/types";
import { formatBytes } from "@/lib/comparison/diff-engine";

interface OpportunitiesDiffMatrixProps {
  transitions: OpportunityTransition[];
}

export const OpportunitiesDiffMatrix: React.FC<OpportunitiesDiffMatrixProps> = ({
  transitions,
}) => {
  const [filter, setFilter] = useState<"all" | "new_issue" | "resolved" | "worsened">("all");

  const getBadgeStyle = (state: OpportunityState) => {
    switch (state) {
      case "resolved":
        return "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/15 dark:text-[#4de7b4] dark:border-[#00875a]/30";
      case "new_issue":
        return "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/15 dark:text-[#ff7452] dark:border-[#de350b]/30";
      case "worsened":
        return "bg-[#fff8e5] text-[#b76e00] border-[#ffe380] dark:bg-[#b76e00]/15 dark:text-[#ffc400] dark:border-[#b76e00]/30";
      case "improved":
        return "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/15 dark:text-[#4de7b4] dark:border-[#00875a]/30";
      default:
        return "bg-surface-2 text-text-secondary border-border";
    }
  };

  const getStateLabel = (state: OpportunityState) => {
    switch (state) {
      case "resolved":
        return "Resolved in Target";
      case "new_issue":
        return "New Regression";
      case "worsened":
        return "Savings Degraded";
      case "improved":
        return "Savings Improved";
      default:
        return "Unchanged";
    }
  };

  const filtered = transitions.filter((t) => {
    if (filter === "all") return true;
    return t.state === filter;
  });

  const countResolved = transitions.filter((t) => t.state === "resolved").length;
  const countNew = transitions.filter((t) => t.state === "new_issue").length;
  const countWorsened = transitions.filter((t) => t.state === "worsened").length;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-text-primary font-sans flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-500" />
            Lighthouse Opportunities Transition Matrix
          </h2>
          <p className="text-xs text-text-secondary">
            Tracking diagnostic issues resolved, introduced, or modified between audits
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-1 rounded-lg border border-border">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-surface-0 text-brand-500 shadow-xs border border-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            All ({transitions.length})
          </button>
          {countNew > 0 && (
            <button
              onClick={() => setFilter("new_issue")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                filter === "new_issue"
                  ? "bg-surface-0 text-score-poor shadow-xs border border-border"
                  : "text-text-secondary hover:text-score-poor"
              }`}
            >
              New Issues ({countNew})
            </button>
          )}
          {countResolved > 0 && (
            <button
              onClick={() => setFilter("resolved")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                filter === "resolved"
                  ? "bg-surface-0 text-score-good shadow-xs border border-border"
                  : "text-text-secondary hover:text-score-good"
              }`}
            >
              Resolved ({countResolved})
            </button>
          )}
          {countWorsened > 0 && (
            <button
              onClick={() => setFilter("worsened")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                filter === "worsened"
                  ? "bg-surface-0 text-score-warn shadow-xs border border-border"
                  : "text-text-secondary hover:text-score-warn"
              }`}
            >
              Degraded ({countWorsened})
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface-0 border border-border rounded-xl p-8 text-center space-y-2 shadow-xs">
          <CheckCircle2 className="h-8 w-8 text-score-good mx-auto" />
          <p className="text-sm font-bold text-text-primary font-sans">
            No diagnostic changes found in this category
          </p>
          <p className="text-xs text-text-secondary">
            Lighthouse opportunity states remained identical across baseline runs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-surface-0 border border-border rounded-xl p-4.5 shadow-xs space-y-3 hover:border-brand-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyle(
                      item.state
                    )}`}
                  >
                    {getStateLabel(item.state)}
                  </span>

                  {(item.deltaSavingsMs !== 0 || item.deltaSavingsBytes !== 0) && (
                    <span className="text-[11px] font-mono font-bold text-text-secondary">
                      {item.deltaSavingsMs !== 0 ? `${item.deltaSavingsMs > 0 ? "+" : ""}${item.deltaSavingsMs}ms` : ""}
                      {item.deltaSavingsBytes !== 0 ? ` (${item.deltaSavingsBytes > 0 ? "+" : ""}${formatBytes(item.deltaSavingsBytes)})` : ""}
                    </span>
                  )}
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-text-primary font-sans">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {item.description.replace(/\[Learn more\].*$/i, "").replace(/\[.*?\]\(.*?\)/g, "")}
                  </p>
                )}
              </div>

              {/* Base vs Target Savings Comparison */}
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-border/60 text-[11px] font-mono bg-surface-1/60 p-2.5 rounded-lg">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">
                    Base Savings
                  </span>
                  <span className="text-text-secondary">
                    {item.baseSavingsMs > 0 ? `${item.baseSavingsMs}ms` : item.baseSavingsBytes > 0 ? formatBytes(item.baseSavingsBytes) : "Passed / 0ms"}
                  </span>
                </div>
                <div className="border-l border-border/70 pl-2.5">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">
                    Target Savings
                  </span>
                  <span className="text-text-primary font-bold">
                    {item.targetSavingsMs > 0 ? `${item.targetSavingsMs}ms` : item.targetSavingsBytes > 0 ? formatBytes(item.targetSavingsBytes) : "Passed / 0ms"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
