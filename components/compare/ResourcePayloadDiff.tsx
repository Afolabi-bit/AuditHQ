"use client";

import React from "react";
import {
  Code,
  FileCode,
  Image as ImageIcon,
  TextT,
  FileText,
  Stack,
  TrendDown,
  TrendUp,
  Minus,
} from "@phosphor-icons/react";
import { ResourceTypeDiff } from "@/lib/comparison/types";

interface ResourcePayloadDiffProps {
  resourceDiffs: ResourceTypeDiff[];
}

export const ResourcePayloadDiff: React.FC<ResourcePayloadDiffProps> = ({
  resourceDiffs,
}) => {
  const getResourceIcon = (type: ResourceTypeDiff["resourceType"]) => {
    switch (type) {
      case "script":
        return <Code weight="bold" className="h-4 w-4 text-amber-500" />;
      case "stylesheet":
        return <FileCode weight="bold" className="h-4 w-4 text-blue-500" />;
      case "image":
        return <ImageIcon weight="bold" className="h-4 w-4 text-emerald-500" />;
      case "font":
        return <TextT weight="bold" className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />;
      case "document":
        return <FileText weight="bold" className="h-4 w-4 text-sky-500" />;
      default:
        return <Stack weight="bold" className="h-4 w-4 text-text-tertiary" />;
    }
  };

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2.5">
          <Stack weight="bold" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          Network Resource Payload & Bundle Bloat Analysis
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary">
          Transfer weight changes across asset types between base and target executions
        </p>
      </div>

      <div className="bg-surface-0/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-2xl shadow-xs overflow-hidden p-2 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/50 dark:border-white/[0.07] bg-surface-1/70 dark:bg-white/[0.03] text-text-tertiary uppercase font-bold text-[11px] tracking-wider">
                <th className="py-4 px-5">Resource Category</th>
                <th className="py-4 px-5 text-right">Base Run</th>
                <th className="py-4 px-5 text-right">Target Run</th>
                <th className="py-4 px-5 text-right">Net Weight Delta</th>
                <th className="py-4 px-5 text-right">Change %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 dark:divide-white/[0.05] font-mono">
              {resourceDiffs.map((item) => {
                const isTotal = item.resourceType === "total";
                const isImproved = item.status === "improved";
                const isRegressed = item.status === "regressed";

                return (
                  <tr
                    key={item.resourceType}
                    className={`hover:bg-surface-1/50 dark:hover:bg-white/[0.02] transition-colors ${
                      isTotal ? "bg-surface-1/40 dark:bg-white/[0.02] font-bold border-t border-border/60 dark:border-white/[0.07]" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 flex items-center gap-3 font-sans font-semibold text-text-primary">
                      <div className="h-8 w-8 rounded-xl bg-surface-1/80 dark:bg-white/[0.04] border border-border/50 dark:border-white/[0.07] flex items-center justify-center shrink-0 shadow-2xs">
                        {getResourceIcon(item.resourceType)}
                      </div>
                      <span>{item.label}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-text-secondary">
                      {item.baseFormatted}
                    </td>

                    <td className="py-3.5 px-4 text-right text-text-primary font-bold">
                      {item.targetFormatted}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-[11px] border ${
                          isImproved
                            ? "score-badge-good border-emerald-500/20"
                            : isRegressed
                            ? "score-badge-poor border-red-500/20"
                            : "bg-surface-2/60 dark:bg-white/[0.04] text-text-secondary border-border/50 dark:border-white/[0.07]"
                        }`}
                      >
                        {isImproved ? (
                          <TrendDown weight="bold" className="h-3 w-3" />
                        ) : isRegressed ? (
                          <TrendUp weight="bold" className="h-3 w-3" />
                        ) : (
                          <Minus weight="bold" className="h-3 w-3" />
                        )}
                        {item.deltaFormatted}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-semibold ${
                          isImproved
                            ? "text-score-good"
                            : isRegressed
                            ? "text-score-poor"
                            : "text-text-tertiary"
                        }`}
                      >
                        {item.percentChange > 0 ? `+${item.percentChange}%` : `${item.percentChange}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

