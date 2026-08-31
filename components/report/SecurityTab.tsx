"use client";

import React from "react";
import { ShieldCheck, CheckCircle, Warning } from "@phosphor-icons/react";
import { ParsedLighthouseReport } from "@/lib/report-parser";
import { FormattedDescription } from "./FormattedDescription";

interface SecurityTabProps {
  securityChecks: ParsedLighthouseReport["securityChecks"];
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ securityChecks }) => {
  const passedCount = securityChecks.filter(
    (c) => c.score === 1 || c.score == null,
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-0 border border-border rounded-xl p-4.5 px-6 shadow-xs">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <ShieldCheck weight="fill" className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            Security & Best Practices Audit
          </h3>
          <p className="text-xs text-text-secondary">
            HTTPS enforcement, TLS configuration, CSP protections, and vulnerability checks
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full score-badge-good">
          <span className="w-1.5 h-1.5 rounded-full bg-score-good" />
          {passedCount} of {securityChecks.length} checks passing
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityChecks.map((check) => {
          const isPassed = check.score === 1 || check.score == null;
          return (
            <div
              key={check.id}
              className={`rounded-xl p-5 border shadow-xs transition-all flex flex-col justify-between gap-3 bg-surface-0 ${
                isPassed
                  ? "border-border hover:border-brand-200 dark:hover:border-brand-500/30"
                  : "border-score-warn/40 hover:border-score-warn"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg border ${
                        isPassed
                          ? "bg-score-good/10 text-score-good border-score-good/20"
                          : "bg-score-warn/10 text-score-warn border-score-warn/20"
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle weight="fill" className="h-4 w-4" />
                      ) : (
                        <Warning weight="fill" className="h-4 w-4" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-text-primary leading-tight">
                      {check.title}
                    </h4>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                      isPassed ? "score-badge-good" : "score-badge-warn"
                    }`}
                  >
                    {isPassed ? "Compliant" : "Warning"}
                  </span>
                </div>

                <FormattedDescription
                  text={check.description}
                  className="text-xs text-text-secondary leading-relaxed"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

