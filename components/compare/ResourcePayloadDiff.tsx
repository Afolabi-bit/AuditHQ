"use client";

import React from "react";
import {
  Code2,
  FileCode,
  Image as ImageIcon,
  Type,
  FileText,
  Layers,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
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
        return <Code2 className="h-4 w-4 text-amber-500" />;
      case "stylesheet":
        return <FileCode className="h-4 w-4 text-blue-500" />;
      case "image":
        return <ImageIcon className="h-4 w-4 text-emerald-500" />;
      case "font":
        return <Type className="h-4 w-4 text-purple-500" />;
      case "document":
        return <FileText className="h-4 w-4 text-cyan-500" />;
      default:
        return <Layers className="h-4 w-4 text-text-tertiary" />;
    }
  };

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary font-sans flex items-center gap-2.5">
          <Layers className="h-5 w-5 text-brand-500" />
          Network Resource Payload & Bundle Bloat Analysis
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary">
          Transfer weight changes across asset types between base and target executions
        </p>
      </div>

      <div className="bg-surface-0 border border-border rounded-2xl shadow-xs overflow-hidden p-2 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-1/80 text-text-tertiary font-sans uppercase font-bold text-[11px] tracking-wider">
                <th className="py-4 px-5">Resource Category</th>
                <th className="py-4 px-5 text-right">Base Run</th>
                <th className="py-4 px-5 text-right">Target Run</th>
                <th className="py-4 px-5 text-right">Net Weight Delta</th>
                <th className="py-4 px-5 text-right">Change %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {resourceDiffs.map((item) => {
                const isTotal = item.resourceType === "total";
                const isImproved = item.status === "improved";
                const isRegressed = item.status === "regressed";

                return (
                  <tr
                    key={item.resourceType}
                    className={`hover:bg-surface-1/50 transition-colors ${
                      isTotal ? "bg-surface-1/40 font-bold border-t-2 border-border" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 flex items-center gap-2.5 font-sans font-semibold text-text-primary">
                      <div className="h-7 w-7 rounded-lg bg-surface-1 border border-border flex items-center justify-center shrink-0">
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
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[11px] border ${
                          isImproved
                            ? "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/15 dark:text-[#4de7b4] dark:border-[#00875a]/30"
                            : isRegressed
                            ? "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/15 dark:text-[#ff7452] dark:border-[#de350b]/30"
                            : "bg-surface-2 text-text-secondary border-border"
                        }`}
                      >
                        {isImproved ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : isRegressed ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
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
