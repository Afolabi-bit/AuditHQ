"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Warning,
  TrendDown,
  TrendUp,
  Minus,
  Lightning,
} from "@phosphor-icons/react";
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
        return "score-badge-good";
      case "new_issue":
        return "score-badge-poor";
      case "worsened":
        return "score-badge-warn";
      case "improved":
        return "score-badge-good";
      default:
        return "bg-surface-2 text-text-secondary border border-border";
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
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2.5">
            <Lightning weight="fill" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            Opportunity Changes
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Fixes resolved, introduced, or worsened between these two runs
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1.5 bg-surface-1/70 dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-border/60 dark:border-white/[0.07] shadow-2xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-surface-0/90 dark:bg-[#121620] text-brand-600 dark:text-brand-300 shadow-2xs border border-border/50 dark:border-white/[0.08]"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-2/60 dark:hover:bg-white/[0.04]"
            }`}
          >
            All ({transitions.length})
          </button>
          {countNew > 0 && (
            <button
              onClick={() => setFilter("new_issue")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "new_issue"
                  ? "bg-surface-0/90 dark:bg-[#121620] text-score-poor shadow-2xs border border-border/50 dark:border-white/[0.08]"
                  : "text-text-secondary hover:text-score-poor hover:bg-surface-2/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              New Issues ({countNew})
            </button>
          )}
          {countResolved > 0 && (
            <button
              onClick={() => setFilter("resolved")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "resolved"
                  ? "bg-surface-0/90 dark:bg-[#121620] text-score-good shadow-2xs border border-border/50 dark:border-white/[0.08]"
                  : "text-text-secondary hover:text-score-good hover:bg-surface-2/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              Resolved ({countResolved})
            </button>
          )}
          {countWorsened > 0 && (
            <button
              onClick={() => setFilter("worsened")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "worsened"
                  ? "bg-surface-0/90 dark:bg-[#121620] text-score-warn shadow-2xs border border-border/50 dark:border-white/[0.08]"
                  : "text-text-secondary hover:text-score-warn hover:bg-surface-2/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              Degraded ({countWorsened})
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface-0/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-3xl p-10 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-score-good/10 text-score-good flex items-center justify-center mx-auto border border-score-good/20 shadow-xs">
            <CheckCircle weight="fill" className="h-6 w-6" />
          </div>
          <p className="text-base font-bold text-text-primary tracking-tight">
            No diagnostic changes found in this category
          </p>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            Lighthouse opportunity states remained identical across baseline runs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-surface-0/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 hover:border-border dark:hover:border-white/[0.15] transition-all flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyle(
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

                <h3 className="text-xs sm:text-sm font-bold text-text-primary tracking-tight">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {item.description.replace(/\[Learn more\].*$/i, "").replace(/\[.*?\]\(.*?\)/g, "")}
                  </p>
                )}
              </div>

              {/* Base vs Target Savings Comparison */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40 dark:border-white/[0.05] text-[11px] font-mono bg-surface-1/60 dark:bg-[#0c0e14]/90 p-3 rounded-xl border border-border/50 dark:border-white/[0.07] shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">
                    Base Savings
                  </span>
                  <span className="text-text-secondary">
                    {item.baseSavingsMs > 0 ? `${item.baseSavingsMs}ms` : item.baseSavingsBytes > 0 ? formatBytes(item.baseSavingsBytes) : "Passed / 0ms"}
                  </span>
                </div>
                <div className="border-s border-border/50 dark:border-white/[0.07] ps-3">
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

