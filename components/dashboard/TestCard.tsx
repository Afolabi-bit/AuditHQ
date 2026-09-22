"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Desktop,
  DeviceMobile,
  XCircle,
  ArrowRight,
  Warning,
  Globe,
  Cpu,
  Trash,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { DeleteTestModal } from "./DeleteTestModal";

interface TestCardProps {
  id: string | number;
  url: string;
  status: string;
  date: string;
  device: string;
  errorMessage?: string | null;
  score: number | null;
  fcp: number | null;
  lcp: number | null;
  tti: number | null;
  cls: number | null;
  speedIndex?: number | null;
  onDeleted?: (id: string) => void;
}

function getScoreColors(score: number | null) {
  if (score == null) {
    return {
      text: "text-text-tertiary",
      badge: "score-badge-neutral",
      label: "Evaluating",
    };
  }
  if (score >= 90) {
    return {
      text: "text-score-good",
      badge: "score-badge-good",
      label: "Good",
    };
  }
  if (score >= 50) {
    return {
      text: "text-score-warn",
      badge: "score-badge-warn",
      label: "Needs Work",
    };
  }
  return {
    text: "text-score-poor",
    badge: "score-badge-poor",
    label: "Poor",
  };
}

const TestCard = ({
  id,
  url,
  status,
  date,
  device,
  errorMessage,
  score,
  fcp,
  lcp,
  tti,
  cls,
  onDeleted,
}: TestCardProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isCompleted = status === "completed";
  const isPending = status === "pending";
  const isFailed = status === "failed";
  const scoreColors = getScoreColors(score);

  return (
    <>
      <div
        className={`rounded-2xl backdrop-blur-md transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 overflow-hidden shadow-2xs hover:shadow-md ${
          isCompleted
            ? "bg-surface-0/70 dark:bg-white/3 border border-border/60 dark:border-white/[0.07] hover:border-brand-500/40 dark:hover:border-white/20"
            : isPending
            ? "bg-surface-0/70 dark:bg-white/3 border border-brand-300 dark:border-brand-500/30"
            : "bg-destructive/5 dark:bg-red-500/4 border border-destructive/20 dark:border-red-500/20"
        }`}
      >
        <div className="p-5 sm:p-6 lg:p-7 space-y-5">
          {/* Top Header: URL, Badges & Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="h-6 w-6 rounded-lg bg-surface-1/80 dark:bg-white/5 border border-border/40 dark:border-white/5 flex items-center justify-center text-text-secondary dark:text-white/70 shrink-0">
                  <Globe weight="bold" className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-text-primary hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate max-w-xl">
                  {url}
                </h3>
                {isPending && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-brand-50 text-brand-600 border border-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/30">
                    <span className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-pulse" />
                    Auditing…
                  </span>
                )}
                {isFailed && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-destructive/10 text-destructive border border-destructive/20">
                    <XCircle weight="fill" className="h-3.5 w-3.5" />
                    Failed
                  </span>
                )}
              </div>

              {/* Metadata Subheader */}
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Clock weight="bold" className="h-3.5 w-3.5 text-text-tertiary" />
                  {date}
                </span>
                <span className="text-text-tertiary">•</span>
                <span className="flex items-center gap-1.5 capitalize">
                  {device?.toLowerCase() === "mobile" ? (
                    <DeviceMobile weight="bold" className="h-3.5 w-3.5 text-text-tertiary" />
                  ) : (
                    <Desktop weight="bold" className="h-3.5 w-3.5 text-text-tertiary" />
                  )}
                  {device || "Desktop"}
                </span>
                <span className="text-text-tertiary">•</span>
                <span className="text-text-tertiary font-mono text-[11px]">Audit #{id}</span>
              </div>
            </div>

            {/* Composite Score Pill Header & Action */}
            <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
              {isCompleted && (
                <div className="text-end">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Performance</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${scoreColors.text}`}>
                      {typeof score === "number" ? score : "—"}
                    </span>
                    <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full shadow-2xs ${scoreColors.badge}`}>
                      {scoreColors.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Delete Trigger */}
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                title="Delete this audit run"
                aria-label="Delete this audit run"
                className="h-8 w-8 rounded-lg bg-surface-1/80 dark:bg-white/4 hover:bg-rose-500/10 hover:border-rose-500/30 text-text-tertiary hover:text-rose-600 dark:hover:text-rose-400 border border-border/40 dark:border-white/6 flex items-center justify-center transition-colors cursor-pointer focus-ring"
              >
                <Trash weight="bold" className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Failed Error Message Banner */}
          {isFailed && errorMessage && (
            <div className="flex items-start gap-3 text-xs text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">
              <Warning weight="fill" className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Pending Animation Banner */}
          {isPending && (
            <div className="flex items-center gap-3 text-xs text-brand-600 dark:text-brand-300 bg-surface-1/60 dark:bg-white/3 p-4 rounded-xl border border-border/40 dark:border-white/6">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600"></span>
              </span>
              <span className="font-medium">Lighthouse is running traces and recording performance metrics…</span>
            </div>
          )}

          {/* Completed Metrics Strip */}
          {isCompleted && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 sm:p-4 rounded-xl bg-surface-1/60 dark:bg-white/3 border border-border/40 dark:border-white/5 flex flex-col justify-between hover:bg-surface-1 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">FCP</p>
                  <span className={`w-1.5 h-1.5 rounded-full ${fcp != null && Number(fcp) <= 1.8 ? 'bg-score-good' : fcp != null && Number(fcp) <= 3.0 ? 'bg-score-warn' : 'bg-score-poor'}`} />
                </div>
                <p className="text-base sm:text-lg font-bold text-text-primary font-mono mt-1">
                  {fcp != null ? `${Number(fcp).toFixed(1)}s` : "—"}
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">First Contentful Paint</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-surface-1/60 dark:bg-white/3 border border-border/40 dark:border-white/5 flex flex-col justify-between hover:bg-surface-1 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">LCP</p>
                  <span className={`w-1.5 h-1.5 rounded-full ${lcp != null && Number(lcp) <= 2.5 ? 'bg-score-good' : lcp != null && Number(lcp) <= 4.0 ? 'bg-score-warn' : 'bg-score-poor'}`} />
                </div>
                <p className="text-base sm:text-lg font-bold text-text-primary font-mono mt-1">
                  {lcp != null ? `${Number(lcp).toFixed(1)}s` : "—"}
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">Largest Contentful Paint</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-surface-1/60 dark:bg-white/3 border border-border/40 dark:border-white/5 flex flex-col justify-between hover:bg-surface-1 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">TBT</p>
                  <span className={`w-1.5 h-1.5 rounded-full ${tti != null && (Number(tti) <= 200 || Number(tti) * 1000 <= 200) ? 'bg-score-good' : 'bg-score-warn'}`} />
                </div>
                <p className="text-base sm:text-lg font-bold text-text-primary font-mono mt-1">
                  {tti != null ? `${Math.round(Number(tti) > 100 ? Number(tti) : Number(tti) * 1000)}ms` : "—"}
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">Total Blocking Time</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-surface-1/60 dark:bg-white/3 border border-border/40 dark:border-white/5 flex flex-col justify-between hover:bg-surface-1 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">CLS</p>
                  <span className={`w-1.5 h-1.5 rounded-full ${cls != null && Number(cls) <= 0.1 ? 'bg-score-good' : cls != null && Number(cls) <= 0.25 ? 'bg-score-warn' : 'bg-score-poor'}`} />
                </div>
                <p className="text-base sm:text-lg font-bold text-text-primary font-mono mt-1">
                  {cls != null ? Number(cls).toFixed(2) : "—"}
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">Cumulative Layout Shift</p>
              </div>
            </div>
          )}
        </div>

        {/* Prominent Action Footer with Ergonomic Touch Target */}
        {isCompleted && (
          <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-surface-1/50 dark:bg-white/2 border-t border-border/40 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-text-secondary w-full sm:w-auto justify-between sm:justify-start">
              <span className="inline-flex items-center gap-1.5 font-medium text-text-tertiary">
                <Cpu weight="fill" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                Diagnostics ready
              </span>
            </div>

            <Link href={`/dashboard/test/${id}`} className="w-full sm:w-auto">
              <Button
                size="default"
                className="w-full sm:w-auto min-h-11 sm:min-h-9.5 px-6 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs shadow-brand-500/25 cursor-pointer gap-2 transition-transform active:scale-[0.98] focus-ring"
              >
                <span>View Report</span>
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      <DeleteTestModal
        testId={id}
        url={url}
        date={date}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={onDeleted}
      />
    </>
  );
};

export default TestCard;


