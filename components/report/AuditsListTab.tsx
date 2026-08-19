"use client";

import React, { useState } from "react";
import {
  Eye,
  Search,
  CheckCircle2,
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
    <div className="space-y-5">
      {/* Section Selector */}
      <div className="flex items-center gap-2 border-b border-[#e3e8ee] pb-3">
        <button
          onClick={() => {
            setSection("a11y");
            setExpandedId(null);
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer font-sans ${
            section === "a11y"
              ? "bg-[#635bff] text-white shadow-xs"
              : "bg-white text-[#425466] hover:bg-[#f8fafc] border border-[#e3e8ee]"
          }`}
        >
          <Eye className="h-4 w-4" />
          Accessibility Inspector ({accessibilityIssues.length})
        </button>

        <button
          onClick={() => {
            setSection("seo");
            setExpandedId(null);
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer font-sans ${
            section === "seo"
              ? "bg-[#635bff] text-white shadow-xs"
              : "bg-white text-[#425466] hover:bg-[#f8fafc] border border-[#e3e8ee]"
          }`}
        >
          <Search className="h-4 w-4" />
          SEO & Crawlability ({seoIssues.length})
        </button>
      </div>

      {/* Issues List */}
      {activeIssues.length === 0 ? (
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-10 text-center space-y-2 shadow-[0_1px_3px_rgba(50,50,93,0.08)]">
          <div className="h-10 w-10 rounded-full bg-[#e3fcf7] text-[#00875a] flex items-center justify-center mx-auto border border-[#abf5d1]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-[#0a2540] font-sans">
            All {section === "a11y" ? "Accessibility" : "SEO"} checks passed!
          </h4>
          <p className="text-xs text-[#8898aa] max-w-md mx-auto">
            Your website meets Google's standard accessibility contrast and search crawler indexability requirements.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeIssues.map((issue) => {
            const isExpanded = expandedId === issue.id;
            const items = "items" in issue && Array.isArray(issue.items) ? issue.items : undefined;

            return (
              <div
                key={issue.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all shadow-[0_1px_3px_rgba(50,50,93,0.08)] ${
                  isExpanded ? "border-brand-200" : "border-[#e3e8ee] hover:border-brand-200"
                }`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-colors gap-4"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-md bg-[#ffebe6] text-[#de350b] border border-[#ffbdad] shrink-0">
                      <XCircle className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#0a2540] font-sans">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-[#425466] line-clamp-1">
                        {issue.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {items && items.length > 0 && (
                      <span className="text-[11px] font-mono text-[#8898aa] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#e3e8ee]">
                        {items.length} nodes
                      </span>
                    )}
                    <div className="p-1 rounded bg-[#f8fafc] border border-[#e3e8ee] text-[#8898aa]">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-[#f1f5f9] bg-[#f8fafc] space-y-4 text-xs">
                    <p className="text-xs text-[#425466] leading-relaxed">
                      {issue.description}
                    </p>

                    {items && items.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-bold text-[#0a2540] uppercase tracking-wider text-[11px]">
                          Failing Elements ({items.length})
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {items.map((node: any, nIdx: number) => (
                            <div
                              key={nIdx}
                              className="p-3 bg-white rounded-lg border border-[#e3e8ee] space-y-1 font-mono text-[11px]"
                            >
                              <div className="text-[#0a2540] font-semibold">
                                {node.node?.selector || node.selector || "DOM Node"}
                              </div>
                              {(node.node?.snippet || node.snippet) && (
                                <code className="block text-[#635bff] bg-[#f0f2ff] p-1.5 rounded border border-brand-200 truncate">
                                  {node.node?.snippet || node.snippet}
                                </code>
                              )}
                              {node.node?.explanation && (
                                <p className="text-[#8898aa] font-sans text-xs">
                                  {node.node.explanation}
                                </p>
                              )}
                            </div>
                          ))}
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
