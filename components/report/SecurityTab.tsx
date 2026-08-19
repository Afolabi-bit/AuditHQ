"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock } from "lucide-react";
import { ParsedLighthouseReport } from "@/lib/report-parser";

interface SecurityTabProps {
  securityChecks: ParsedLighthouseReport["securityChecks"];
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ securityChecks }) => {
  const passedCount = securityChecks.filter(
    (c) => c.score === 1 || c.score == null,
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-0 border border-surface-3 rounded-2xl p-4.5 px-6 shadow-xs">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2 font-sans">
            <ShieldCheck className="h-4 w-4 text-brand-600" />
            Security & Best Practices Audit
          </h3>
          <p className="text-xs text-text-secondary">
            HTTPS enforcement, TLS configuration, CSP protections, and vulnerability surface checks
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {passedCount} of {securityChecks.length} checks passing
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityChecks.map((check) => {
          const isPassed = check.score === 1 || check.score == null;
          return (
            <div
              key={check.id}
              className={`rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between gap-3 ${
                isPassed
                  ? "bg-surface-0 border-surface-3 hover:border-brand-200"
                  : "bg-amber-50/20 border-amber-200 hover:border-amber-300"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl border ${
                        isPassed
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-text-primary font-sans leading-tight">
                      {check.title}
                    </h4>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0 ${
                      isPassed
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}
                  >
                    {isPassed ? "Compliant" : "Warning"}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {check.description.replace(/\[(.*?)\]\(.*?\)/g, "$1")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
