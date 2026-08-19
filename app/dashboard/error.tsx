"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
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
    <div className="min-h-screen bg-surface-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface-0 border border-surface-3 rounded-2xl p-6 shadow-sm space-y-6 text-center">
        {/* Error icon wrapper */}
        <div className="h-12 w-12 rounded-full bg-score-poor/10 text-score-poor border border-score-poor/20 flex items-center justify-center mx-auto">
          <AlertOctagon className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-text-primary font-sans">
            Dashboard Execution Failed
          </h2>
          <p className="text-xs text-text-secondary">
            An unexpected error occurred while compiling performance analytics metrics.
          </p>
        </div>

        {/* Monospace Error Detail Console */}
        <div className="text-left bg-surface-1 border border-surface-3 rounded-xl p-3.5 font-mono text-[10px] text-text-secondary overflow-x-auto space-y-1 max-h-32">
          <div className="text-score-poor font-bold">Error: {error.message || "Unknown error"}</div>
          {error.digest && <div className="opacity-75">Digest ID: {error.digest}</div>}
          <div className="opacity-60">Source: dashboard/page.tsx</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors cursor-pointer shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry Request
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold text-text-primary bg-surface-0 hover:bg-surface-2 border border-surface-3 transition-colors cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
