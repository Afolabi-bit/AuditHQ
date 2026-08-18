"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  Sparkles,
  Clock,
  HardDrive,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ExternalLink,
  Code,
  Filter,
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

  return (
    <div className="space-y-6">
      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "All Opportunities" },
            { id: "images", label: "Images & Media" },
            { id: "js", label: "JavaScript" },
            { id: "css", label: "CSS & Render-Blocking" },
            { id: "server", label: "Server & Caching" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500">
          Showing {filteredOpportunities.length} opportunities
        </span>
      </div>

      {/* Opportunities List */}
      {filteredOpportunities.length === 0 ? (
        <Card className="border-slate-200 bg-slate-50/50">
          <CardContent className="p-8 text-center text-slate-500 text-sm">
            <Sparkles className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No major issues detected in this category!</p>
            <p className="text-xs text-slate-400 mt-1">Your website is following performance best practices here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOpportunities.map((item) => {
            const isExpanded = expandedId === item.id;
            const hasSavings = item.overallSavingsMs || item.overallSavingsBytes;

            return (
              <Card
                key={item.id}
                className={`border transition-all duration-200 overflow-hidden ${
                  isExpanded ? "border-blue-300 shadow-sm" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5 p-1.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200">
                      <AlertTriangle className="h-4 w-4" />
                    </div>

                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {item.description.replace(/\[(.*?)\]\(.*?\)/g, "$1")}
                      </p>
                    </div>
                  </div>

                  {/* Savings Pills */}
                  <div className="flex items-center gap-3 ml-4">
                    {item.overallSavingsMs != null && item.overallSavingsMs > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Clock className="h-3 w-3" />
                        Save {formatMilliseconds(item.overallSavingsMs)}
                      </span>
                    )}

                    {item.overallSavingsBytes != null && item.overallSavingsBytes > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <HardDrive className="h-3 w-3" />
                        Save {formatBytes(item.overallSavingsBytes)}
                      </span>
                    )}

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs">
                    <p className="text-slate-600 leading-relaxed">
                      {item.description.replace(/\[(.*?)\]\((.*?)\)/g, "$1")}
                    </p>

                    {item.items && item.items.length > 0 && (
                      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="py-2 px-3">Resource / URL</th>
                              {item.items.some((i) => i.totalBytes != null) && (
                                <th className="py-2 px-3 text-right">Size</th>
                              )}
                              {item.items.some((i) => i.wastedBytes != null) && (
                                <th className="py-2 px-3 text-right">Potential Savings</th>
                              )}
                              {item.items.some((i) => i.wastedMs != null) && (
                                <th className="py-2 px-3 text-right">Delay</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
                            {item.items.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="py-2 px-3 truncate max-w-md" title={row.url || row.label}>
                                  {row.url || row.label || "Resource item"}
                                </td>
                                {row.totalBytes != null && (
                                  <td className="py-2 px-3 text-right whitespace-nowrap">
                                    {formatBytes(row.totalBytes)}
                                  </td>
                                )}
                                {row.wastedBytes != null && (
                                  <td className="py-2 px-3 text-right text-rose-600 font-bold whitespace-nowrap">
                                    {formatBytes(row.wastedBytes)}
                                  </td>
                                )}
                                {row.wastedMs != null && (
                                  <td className="py-2 px-3 text-right text-rose-600 font-bold whitespace-nowrap">
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
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
