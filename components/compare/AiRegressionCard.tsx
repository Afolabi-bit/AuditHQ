"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
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
        throw new Error(data.error || "Failed to generate AI comparison diagnosis");
      }

      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (err: any) {
      console.error("AI Compare Error:", err);
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
      <div className="rounded-2xl border border-brand-500/20 bg-linear-to-br from-brand-500/5 via-surface-0 to-surface-0 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <div className="space-y-1">
              <div className="h-4 w-48 bg-surface-2 rounded animate-pulse" />
              <div className="h-3 w-32 bg-surface-2 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-6 w-24 bg-surface-2 rounded-full animate-pulse" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3.5 w-full bg-surface-2 rounded animate-pulse" />
          <div className="h-3.5 w-5/6 bg-surface-2 rounded animate-pulse" />
          <div className="h-3.5 w-4/6 bg-surface-2 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="rounded-2xl border border-border bg-surface-0 p-6 shadow-xs text-center space-y-3">
        <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-text-primary font-sans">
            AI Regression Analysis Unavailable
          </p>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            {error}
          </p>
        </div>
        <div className="pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchAiComparison}
            className="cursor-pointer text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
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
    <div className="rounded-2xl border border-brand-500/30 bg-linear-to-br from-brand-500/5 via-surface-0 to-surface-0 p-7 sm:p-9 shadow-xs space-y-6 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-500 shadow-2xs shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-text-primary font-sans">
                AI Regression Diagnosis & Changelog
              </h2>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-50 text-brand-500 border border-brand-200 uppercase shadow-2xs">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Automated comparative telemetry synthesis & root-cause evaluation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border font-mono shadow-2xs ${
              isImprovement
                ? "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/20 dark:text-[#4de7b4] dark:border-[#00875a]/30"
                : "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/20 dark:text-[#ff7452] dark:border-[#de350b]/30"
            }`}
          >
            {summary.verdict}
          </span>
        </div>
      </div>

      {/* Headline & Executive Summary */}
      <div className="p-5 sm:p-6 rounded-xl bg-brand-500/5 border border-brand-500/20 space-y-2.5">
        <p className="text-sm sm:text-base font-bold text-brand-600 dark:text-brand-400 font-sans flex items-center gap-2">
          <Zap className="h-4.5 w-4.5 shrink-0 fill-current" />
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
          <div className="bg-surface-1 p-4 rounded-xl border border-border space-y-2.5">
            <p className="text-xs font-bold text-score-good uppercase tracking-wider font-sans flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-score-good" />
              Key Optimizations Achieved
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
          <div className="bg-surface-1 p-4 rounded-xl border border-border space-y-2.5">
            <p className="text-xs font-bold text-score-poor uppercase tracking-wider font-sans flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-score-poor" />
              Identified Regressions
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
        <div className="flex items-start gap-3 p-3.5 bg-brand-50 border border-brand-200 rounded-xl text-xs">
          <ShieldCheck className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-brand-500 uppercase tracking-wider text-[10px] block font-sans">
              Engineering Action Recommendation
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
