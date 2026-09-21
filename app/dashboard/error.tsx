"use client";

import React, { useEffect } from "react";
import { WarningOctagon, ArrowClockwise, House } from "@phosphor-icons/react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-card/80 dark:bg-[#0c0e14]/90 backdrop-blur-xl border border-border/60 dark:border-white/[0.07] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-center">
        {/* Error icon wrapper */}
        <div className="h-14 w-14 rounded-2xl bg-score-poor/10 text-score-poor border border-score-poor/20 flex items-center justify-center mx-auto shadow-xs">
          <WarningOctagon weight="fill" className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-text-primary">
            Dashboard Execution Failed
          </h2>
          <p className="text-xs text-text-secondary">
            An unexpected error occurred while compiling performance analytics metrics.
          </p>
        </div>

        {/* Monospace Error Detail Console */}
        <div className="text-left bg-surface-1/60 dark:bg-white/[0.03] border border-border/60 dark:border-white/[0.07] rounded-2xl p-4 font-mono text-[11px] text-text-secondary overflow-x-auto space-y-1.5 max-h-36">
          <div className="text-score-poor font-bold">Error: {error.message || "Unknown error"}</div>
          {error.digest && <div className="opacity-75">Digest ID: {error.digest}</div>}
          <div className="opacity-60">Source: dashboard/page.tsx</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all cursor-pointer shadow-sm hover:shadow-brand-500/20"
          >
            <ArrowClockwise weight="bold" className="h-3.5 w-3.5" />
            Retry Request
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-semibold text-text-primary bg-surface-0/60 dark:bg-white/[0.03] hover:bg-surface-1/60 dark:hover:bg-white/[0.06] border border-border/60 dark:border-white/[0.07] transition-all cursor-pointer"
          >
            <House weight="bold" className="h-3.5 w-3.5" />
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
