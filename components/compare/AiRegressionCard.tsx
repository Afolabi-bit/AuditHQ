"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Lightning,
  Warning,
  CheckCircle,
  ArrowsClockwise,
  ShieldCheck,
} from "@phosphor-icons/react";
import { CompareAiSummaryData } from "@/lib/comparison/schema";
import { Button } from "@/components/ui/button";

interface AiRegressionCardProps {
  baseId: string;
  targetId: string;
}

export const AiRegressionCard: React.FC<AiRegressionCardProps> = ({
  baseId,
  targetId,
}) => {
  const [summary, setSummary] = useState<CompareAiSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAiComparison = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/test/compare/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseId, targetId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate comparative diagnosis");
      }

      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (err: any) {
      console.error("Compare Error:", err);
      setError(err?.message || "Failed to generate comparative insights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiComparison();
  }, [baseId, targetId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/60 dark:border-white/[0.07] bg-surface-0/70 dark:bg-white/3 backdrop-blur-xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center shadow-2xs">
              <Cpu weight="fill" className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-48 bg-surface-2/60 dark:bg-white/6 rounded-lg animate-pulse" />
              <div className="h-3 w-32 bg-surface-2/60 dark:bg-white/6 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="h-6 w-24 bg-surface-2/60 dark:bg-white/6 rounded-full animate-pulse" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3.5 w-full bg-surface-2/60 dark:bg-white/6 rounded-lg animate-pulse" />
          <div className="h-3.5 w-5/6 bg-surface-2/60 dark:bg-white/6 rounded-lg animate-pulse" />
          <div className="h-3.5 w-4/6 bg-surface-2/60 dark:bg-white/6 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="rounded-2xl border border-border/60 dark:border-white/[0.07] bg-surface-0/70 dark:bg-white/3 backdrop-blur-xl p-6 shadow-xs text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto shadow-2xs">
          <Warning weight="fill" className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-text-primary">
            Comparative Diagnostics Unavailable
          </p>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            {error}
          </p>
        </div>
        <div className="pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchAiComparison}
            className="cursor-pointer text-xs rounded-xl h-10 px-4 border-border/60 dark:border-white/[0.07]"
          >
            <ArrowsClockwise weight="bold" className="h-3.5 w-3.5 mr-1.5" />
            Retry Analysis
          </Button>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const isImprovement =
    summary.verdict === "Significant Improvement" ||
    summary.verdict === "Moderate Improvement";

  return (
    <div className="rounded-2xl border border-border/60 dark:border-white/[0.07] bg-surface-0/70 dark:bg-white/3 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 dark:border-white/[0.07] pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center shadow-2xs shrink-0">
            <Cpu weight="fill" className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-text-primary tracking-tight">
                Comparison Summary
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-surface-1/80 dark:bg-white/4 text-text-secondary border border-border/50 dark:border-white/[0.07] uppercase">
                Automated Analysis
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Side-by-side performance changes and root causes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              isImprovement ? "score-badge-good border-emerald-500/20" : "score-badge-poor border-red-500/20"
            }`}
          >
            {summary.verdict}
          </span>
        </div>
      </div>

      {/* Headline & Executive Summary */}
      <div className="p-5 rounded-2xl bg-surface-1/70 dark:bg-[#0c0e14]/90 border border-border/60 dark:border-white/[0.07] space-y-2 shadow-2xs">
        <p className="text-sm font-bold text-brand-600 dark:text-brand-400 flex items-center gap-2">
          <Lightning weight="fill" className="h-4.5 w-4.5 shrink-0" />
          {summary.headline}
        </p>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {summary.executiveSummary}
        </p>
      </div>

      {/* Key Wins & Key Regressions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Key Wins */}
        {summary.keyWins.length > 0 && (
          <div className="bg-surface-1/60 dark:bg-[#0c0e14]/80 p-5 rounded-2xl border border-border/60 dark:border-white/[0.07] space-y-3 shadow-2xs">
            <p className="text-xs font-bold text-score-good uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle weight="fill" className="h-4 w-4 text-score-good" />
              Improvements
            </p>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              {summary.keyWins.map((win, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-score-good font-bold mt-0.5">•</span>
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Regressions */}
        {summary.keyRegressions.length > 0 && (
          <div className="bg-surface-1/60 dark:bg-[#0c0e14]/80 p-5 rounded-2xl border border-border/60 dark:border-white/[0.07] space-y-3 shadow-2xs">
            <p className="text-xs font-bold text-score-poor uppercase tracking-wider flex items-center gap-1.5">
              <Warning weight="fill" className="h-4 w-4 text-score-poor" />
              Regressions
            </p>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              {summary.keyRegressions.map((reg, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-score-poor font-bold mt-0.5">•</span>
                  <span>{reg}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommended Action */}
      {summary.recommendedAction && (
        <div className="flex items-start gap-3 p-4 bg-surface-1/60 dark:bg-[#0c0e14]/80 border border-border/60 dark:border-white/[0.07] rounded-2xl text-xs shadow-2xs">
          <ShieldCheck weight="fill" className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider text-[10px] block">
              Recommended Next Step
            </span>
            <p className="text-text-secondary leading-relaxed mt-0.5">
              {summary.recommendedAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

