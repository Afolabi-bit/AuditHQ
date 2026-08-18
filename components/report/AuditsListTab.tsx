"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  Eye,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ParsedLighthouseReport } from "@/lib/report-parser";

interface AuditsListTabProps {
  accessibilityIssues: ParsedLighthouseReport["accessibilityIssues"];
  seoIssues: ParsedLighthouseReport["seoIssues"];
}

export const AuditsListTab: React.FC<AuditsListTabProps> = ({
  accessibilityIssues,
  seoIssues,
}) => {
  const [section, setSection] = useState<"a11y" | "seo">("a11y");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeIssues = section === "a11y" ? accessibilityIssues : seoIssues;

  return (
    <div className="space-y-6">
      {/* Section Selector */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => setSection("a11y")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            section === "a11y"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Eye className="h-4 w-4" />
          Accessibility Audits ({accessibilityIssues.length} issues)
        </button>

        <button
          onClick={() => setSection("seo")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            section === "seo"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Search className="h-4 w-4" />
          SEO Audits ({seoIssues.length} issues)
        </button>
      </div>

      {/* Issues List */}
      {activeIssues.length === 0 ? (
        <Card className="border-slate-200 bg-emerald-50/40 p-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
          <h4 className="text-base font-bold text-emerald-900">
            All {section === "a11y" ? "Accessibility" : "SEO"} checks passed!
          </h4>
          <p className="text-xs text-emerald-700 mt-1">
            Your website meets Google's standard accessibility and search crawler guidelines.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeIssues.map((issue) => {
            const isExpanded = expandedId === issue.id;
            return (
              <Card
                key={issue.id}
                className="border-slate-200 overflow-hidden hover:border-slate-300 transition-colors shadow-2xs"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                  className="p-4 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5 p-1 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                      <XCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {issue.description.replace(/\[(.*?)\]\(.*?\)/g, "$1")}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-400 ml-4">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs space-y-3">
                    <p className="text-slate-600 leading-relaxed">
                      {issue.description.replace(/\[(.*?)\]\((.*?)\)/g, "$1")}
                    </p>

                    {(issue as any).items && (issue as any).items.length > 0 && (
                      <div className="mt-2 p-3 rounded-lg bg-white border border-slate-200 space-y-2">
                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Failing Elements / Nodes
                        </p>
                        <div className="space-y-1.5 font-mono text-[11px] text-slate-700">
                          {(issue as any).items.map((nodeItem: any, nIdx: number) => (
                            <div key={nIdx} className="p-2 rounded bg-slate-50 border border-slate-100 break-all">
                              {nodeItem.node?.snippet || nodeItem.node?.selector || JSON.stringify(nodeItem)}
                            </div>
                          ))}
                        </div>
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
