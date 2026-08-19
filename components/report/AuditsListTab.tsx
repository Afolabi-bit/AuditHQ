"use client";

import React, { useState } from "react";
import {
  Eye,
  Search,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Code2,
  Layers,
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
      <div className="flex items-center gap-2.5 border-b border-surface-3 pb-3">
        <button
          onClick={() => {
            setSection("a11y");
            setExpandedId(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans ${
            section === "a11y"
              ? "bg-brand-600 text-white shadow-brand"
              : "bg-surface-1 text-text-secondary hover:bg-surface-2 border border-surface-3"
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
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans ${
            section === "seo"
              ? "bg-brand-600 text-white shadow-brand"
              : "bg-surface-1 text-text-secondary hover:bg-surface-2 border border-surface-3"
          }`}
        >
          <Search className="h-4 w-4" />
          SEO & Crawlability Audits ({seoIssues.length})
        </button>
      </div>

      {/* Issues List */}
      {activeIssues.length === 0 ? (
        <div className="bg-surface-0 border border-surface-3 rounded-2xl p-10 text-center space-y-2 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-text-primary font-sans">
            All {section === "a11y" ? "Accessibility" : "SEO"} checks passed!
          </h4>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Your website meets Google's standard accessibility contrast and search crawler indexability requirements.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeIssues.map((issue) => {
            const isExpanded = expandedId === issue.id;
            return (
              <div
                key={issue.id}
                className={`bg-surface-0 border rounded-2xl overflow-hidden transition-all duration-200 shadow-xs ${
                  isExpanded ? "border-brand-300 shadow-sm" : "border-surface-3 hover:border-brand-200"
                }`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-surface-1/40 transition-colors gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                      <XCircle className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-text-primary font-sans">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-text-secondary line-clamp-1">
                        {issue.description.replace(/\[(.*?)\]\(.*?\)/g, "$1")}
                      </p>
                    </div>
                  </div>

                  <div className="text-text-tertiary p-1 rounded-lg hover:bg-surface-2 transition-colors shrink-0">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 py-4 border-t border-surface-3 bg-surface-1/50 text-xs space-y-3.5">
                    <p className="text-text-secondary leading-relaxed font-sans">
                      {issue.description.replace(/\[(.*?)\]\((.*?)\)/g, "$1")}
                    </p>

                    {(issue as any).items && (issue as any).items.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-surface-0 border border-surface-3 space-y-2.5">
                        <p className="text-[11px] font-bold text-text-primary font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-brand-600" />
                          Offending DOM Selectors / HTML Nodes
                        </p>
                        <div className="space-y-2 font-mono text-[11px] text-text-secondary">
                          {(issue as any).items.map((nodeItem: any, nIdx: number) => (
                            <div
                              key={nIdx}
                              className="p-2.5 rounded-lg bg-surface-1 border border-surface-3 break-all text-text-primary"
                            >
                              <code>
                                {nodeItem.node?.snippet ||
                                  nodeItem.node?.selector ||
                                  JSON.stringify(nodeItem)}
                              </code>
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
