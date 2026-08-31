"use client";

import React, { useState } from "react";
import {
  Eye,
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { FormattedDescription } from "./FormattedDescription";
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
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => {
            setSection("a11y");
            setExpandedId(null);
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            section === "a11y"
              ? "bg-brand-600 text-white shadow-xs"
              : "bg-surface-0 text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-border"
          }`}
        >
          <Eye weight="bold" className="h-4 w-4" />
          Accessibility Inspector ({accessibilityIssues.length})
        </button>

        <button
          onClick={() => {
            setSection("seo");
            setExpandedId(null);
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            section === "seo"
              ? "bg-brand-600 text-white shadow-xs"
              : "bg-surface-0 text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-border"
          }`}
        >
          <MagnifyingGlass weight="bold" className="h-4 w-4" />
          SEO & Crawlability ({seoIssues.length})
        </button>
      </div>

      {/* Issues List */}
      {activeIssues.length === 0 ? (
        <div className="bg-surface-0 border border-border rounded-xl p-10 text-center space-y-2 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-score-good/10 text-score-good flex items-center justify-center mx-auto border border-score-good/30">
            <CheckCircle weight="fill" className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-text-primary">
            All {section === "a11y" ? "Accessibility" : "SEO"} checks passed!
          </h4>
          <p className="text-xs text-text-tertiary max-w-md mx-auto">
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
                className={`bg-surface-0 border rounded-xl overflow-hidden transition-all shadow-xs ${
                  isExpanded ? "border-brand-200 dark:border-brand-500/30" : "border-border hover:border-brand-200 dark:hover:border-brand-500/30"
                }`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-surface-2 transition-colors gap-4"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-md bg-score-poor/10 text-score-poor border border-score-poor/20 shrink-0">
                      <XCircle weight="fill" className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-text-primary">
                        {issue.title}
                      </h4>
                      <FormattedDescription
                        text={issue.description}
                        className="text-xs text-text-secondary line-clamp-1 block"
                        isTruncatedPreview={true}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {items && items.length > 0 && (
                      <span className="text-[11px] font-mono text-text-tertiary bg-surface-1 px-2 py-0.5 rounded border border-border">
                        {items.length} nodes
                      </span>
                    )}
                    <div className="p-1 rounded bg-surface-1 border border-border text-text-tertiary">
                      {isExpanded ? (
                        <CaretUp weight="bold" className="h-4 w-4" />
                      ) : (
                        <CaretDown weight="bold" className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-border bg-surface-1 space-y-4 text-xs">
                    <FormattedDescription
                      text={issue.description}
                      className="text-xs text-text-secondary leading-relaxed"
                    />

                    {items && items.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-bold text-text-primary uppercase tracking-wider text-[11px]">
                          Failing Elements ({items.length})
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {items.map((node: any, nIdx: number) => (
                            <div
                              key={nIdx}
                              className="p-3 bg-surface-0 rounded-lg border border-border space-y-1 font-mono text-[11px]"
                            >
                              <div className="text-text-primary font-semibold">
                                {node.node?.selector || node.selector || "DOM Node"}
                              </div>
                              {(node.node?.snippet || node.snippet) && (
                                <code className="block text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 p-1.5 rounded border border-brand-200 dark:border-brand-500/30 truncate">
                                  {node.node?.snippet || node.snippet}
                                </code>
                              )}
                              {node.node?.explanation && (
                                <p className="text-text-tertiary font-sans text-xs">
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

