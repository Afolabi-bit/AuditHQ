"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Lock, AlertTriangle } from "lucide-react";
import { ParsedLighthouseReport } from "@/lib/report-parser";

interface SecurityTabProps {
  securityChecks: ParsedLighthouseReport["securityChecks"];
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ securityChecks }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Security & Best Practices Audit
          </h3>
          <p className="text-xs text-slate-500">
            HTTPS trust, browser security headers, XSS protections, and modern API standards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityChecks.map((check) => {
          const isPassed = check.score === 1 || check.score == null;
          return (
            <Card
              key={check.id}
              className={`border transition-colors ${
                isPassed ? "border-slate-200 bg-white" : "border-amber-200 bg-amber-50/20"
              }`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="mt-0.5">
                  {isPassed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{check.title}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPassed
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {isPassed ? "Passed" : "Warning"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {check.description.replace(/\[(.*?)\]\(.*?\)/g, "$1")}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
