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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-0/70 dark:bg-white/3 backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-2xl p-5 px-6 shadow-xs">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2 tracking-tight">
            <ShieldCheck weight="fill" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            Security & Best Practices Audit
          </h3>
          <p className="text-xs text-text-secondary">
            HTTPS enforcement, TLS configuration, CSP protections, and vulnerability checks
          </p>
        </div>

        <span className="inline-flex items-center gap-2 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full score-badge-good border border-emerald-500/20 shadow-2xs self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-score-good animate-pulse" />
          {passedCount} of {securityChecks.length} checks passing
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityChecks.map((check) => {
          const isPassed = check.score === 1 || check.score == null;
          return (
            <div
              key={check.id}
              className={`rounded-2xl p-5.5 border shadow-xs transition-all flex flex-col justify-between gap-3.5 bg-surface-0/70 dark:bg-white/3 backdrop-blur-xl ${
                isPassed
                  ? "border-border/60 dark:border-white/[0.07] hover:border-border dark:hover:border-white/15"
                  : "border-amber-500/30 hover:border-amber-500/50 bg-amber-500/2"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl border shrink-0 shadow-2xs ${
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
                    <h4 className="text-sm font-bold text-text-primary leading-snug">
                      {check.title}
                    </h4>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 border ${
                      isPassed ? "score-badge-good border-emerald-500/20" : "score-badge-warn border-amber-500/20"
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

