"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Code2,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AiSummaryData } from "@/lib/ai/schema";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/useAppStore";

interface AiInsightsCardProps {
  testId: string | number;
  initialSummary?: any;
  isPublic?: boolean;
}

export const AiInsightsCard: React.FC<AiInsightsCardProps> = ({
  testId,
  initialSummary = null,
  isPublic = false,
}) => {
  // Priority: initialSummary (SSR) > store > null
  const storedSummary = useAppStore.getState().getAiSummary(String(testId));
  const resolvedInitial = initialSummary ?? storedSummary ?? null;

  const [summary, setSummary] = useState<AiSummaryData | null>(resolvedInitial);
  const [loading, setLoading] = useState<boolean>(!resolvedInitial);
  const [error, setError] = useState<string | null>(null);
  const [expandedFixIndex, setExpandedFixIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const setSummaryAndCache = (s: AiSummaryData) => {
    setSummary(s);
    useAppStore.getState().setAiSummaryOnce(String(testId), s);
  };

  const fetchOrGenerateSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: try a cheap DB-only GET first
      const getRes = await fetch(`/api/test/${testId}/ai-summary`);
      if (getRes.ok) {
        const getData = await getRes.json();
        if (getData.summary) {
          setSummaryAndCache(getData.summary);
          return;
        }
      }

      // Step 2: nothing in DB yet — generate once via POST
      const postRes = await fetch(`/api/test/${testId}/ai-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!postRes.ok) {
        const data = await postRes.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate AI insights");
      }

      const postData = await postRes.json();
      if (postData.summary) {
        setSummaryAndCache(postData.summary);
      }
    } catch (err: any) {
      console.error("AI Insights Error:", err);
      setError(err?.message || "Failed to load AI insights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!summary) {
      fetchOrGenerateSummary();
    }
  }, [testId]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case "Optimal":
      case "Good":
        return "bg-score-good/10 text-score-good border-score-good/30";
      case "Needs Attention":
        return "bg-score-average/10 text-score-average border-score-average/30";
      case "Critical":
      default:
        return "bg-score-poor/10 text-score-poor border-score-poor/30";
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Low":
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-brand-500/30 bg-surface-0 p-6 sm:p-8 shadow-md space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 animate-pulse">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-48 bg-surface-2 rounded-md animate-pulse" />
              <div className="h-3 w-32 bg-surface-2 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-16 bg-surface-1 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-24 bg-surface-1 rounded-xl animate-pulse" />
            <div className="h-24 bg-surface-1 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const sanitizeErrorMessage = (msg: string | null): string => {
    if (!msg)
      return "Unable to generate AI performance diagnostics at this moment.";
    if (
      msg.includes("API key") ||
      msg.includes("GOOGLE_GENERATIVE_AI_API_KEY")
    ) {
      return "Google AI API key is missing or invalid in environment settings.";
    }
    if (
      msg.includes("quota") ||
      msg.includes("rate") ||
      msg.includes("RESOURCE_EXHAUSTED")
    ) {
      return "AI service quota reached. Please wait a few seconds and retry.";
    }
    if (
      msg.includes("prisma") ||
      msg.includes("invocation") ||
      msg.includes("Invalid")
    ) {
      return "Database cache sync issue. Please retry analysis.";
    }
    // Truncate any overly long stack trace
    if (msg.length > 120) {
      return "Unable to complete AI analysis. Click Retry to attempt again.";
    }
    return msg;
  };

  if (error && !summary) {
    return (
      <div className="rounded-2xl border border-border bg-surface-0 p-6 shadow-xs text-center space-y-3.5">
        <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-text-primary font-sans">
            AI Performance Diagnostic Unavailable
          </p>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            {sanitizeErrorMessage(error)}
          </p>
        </div>
        <div className="pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchOrGenerateSummary()}
            disabled={loading}
            className="cursor-pointer text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Analyzing..." : "Retry Analysis"}
          </Button>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <section className="rounded-2xl border border-brand-500/30 bg-surface-0 shadow-lg relative overflow-hidden">
      {/* Subtle Gradient Accent Bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-brand-600 via-indigo-500 to-purple-600" />

      <div className="p-6 sm:p-8 space-y-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight font-sans">
                  AI Performance Diagnostics
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getVerdictStyle(
                    summary.verdict,
                  )}`}
                >
                  {summary.verdict}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Automated engineering analysis and framework-aware code fixes
              </p>
            </div>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-brand-500/5 border border-brand-500/20 space-y-2">
          <p className="text-sm font-bold text-brand-600 dark:text-brand-400 font-sans flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            {summary.headline}
          </p>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {summary.executiveSummary}
          </p>
        </div>

        {/* Quantified ROI & Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-3.5 bg-surface-1 rounded-xl border border-border flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-lg bg-score-good/10 text-score-good flex items-center justify-center">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-tertiary">
                Est. Load Time Reduction
              </p>
              <p className="text-base font-extrabold text-score-good">
                {summary.estimatedImpact.timeSavedFormatted.replace(/^[+-]/, "")} Faster
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-surface-1 rounded-xl border border-border flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-tertiary">
                Est. Conversion Lift (ROI)
              </p>
              <p className="text-base font-extrabold text-brand-600 dark:text-brand-400 font-mono">
                {summary.estimatedImpact.conversionLift}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-surface-1 rounded-xl border border-border flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-tertiary">
                Remediation Plan
              </p>
              <p className="text-base font-extrabold text-text-primary">
                {summary.priorityFixes.length} Priority Fixes
              </p>
            </div>
          </div>
        </div>

        {/* Priority Code Fixes Accordion List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-text-secondary">
            Prioritized Engineering Remediation
          </h3>

          <div className="space-y-2.5">
            {summary.priorityFixes.map((fix, idx) => {
              const isExpanded = expandedFixIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-surface-1 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFixIndex(isExpanded ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-surface-2/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                      <span className="font-mono text-xs font-bold text-brand-500 w-5">
                        0{idx + 1}
                      </span>
                      <span className="text-sm font-bold text-text-primary font-sans truncate">
                        {fix.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getUrgencyBadge(
                          fix.urgency,
                        )}`}
                      >
                        {fix.urgency}
                      </span>
                      <span className="text-[11px] font-mono text-text-tertiary bg-surface-2 px-2 py-0.5 rounded border border-border">
                        {fix.category}
                      </span>
                      {fix.wastedFormatted && (
                        <span className="text-[11px] font-mono font-semibold text-score-good">
                          {fix.wastedFormatted}
                        </span>
                      )}
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-text-tertiary" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-text-tertiary" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-border/60 bg-surface-0/60 space-y-3.5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
                        <div className="p-3 bg-surface-1 rounded-lg border border-border space-y-1">
                          <p className="font-bold text-text-tertiary uppercase text-[10px]">
                            Root Cause
                          </p>
                          <p className="text-text-secondary leading-relaxed">
                            {fix.problem}
                          </p>
                        </div>
                        <div className="p-3 bg-surface-1 rounded-lg border border-border space-y-1">
                          <p className="font-bold text-brand-500 uppercase text-[10px]">
                            Remediation Plan
                          </p>
                          <p className="text-text-secondary leading-relaxed">
                            {fix.solution}
                          </p>
                        </div>
                      </div>

                      {fix.codeSnippet && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-mono text-text-tertiary">
                            <span className="flex items-center gap-1.5">
                              <Code2 className="h-3.5 w-3.5 text-brand-500" />
                              Recommended Code Implementation
                            </span>
                            <button
                              onClick={() => handleCopy(fix.codeSnippet!, idx)}
                              className="inline-flex items-center gap-1 text-[11px] text-brand-500 hover:text-brand-600 cursor-pointer font-sans font-semibold"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-score-good" />
                                  <span className="text-score-good">
                                    Copied!
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-3.5 rounded-lg bg-surface-1 border border-border text-xs font-mono overflow-x-auto text-text-primary leading-relaxed">
                            <code>{fix.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Strengths Pills */}
        {summary.keyStrengths && summary.keyStrengths.length > 0 && (
          <div className="pt-2 border-t border-border flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-text-tertiary text-[11px] uppercase font-bold mr-1">
              Passed Checks:
            </span>
            {summary.keyStrengths.map((str, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-score-good/10 text-score-good border border-score-good/20 font-medium text-[11px]"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {str}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
