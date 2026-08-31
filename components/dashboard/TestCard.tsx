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
        className={`rounded-2xl bg-surface-0 border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
          isCompleted
            ? "border-border hover:border-brand-300 dark:hover:border-brand-500/40"
            : isPending
            ? "border-brand-200 dark:border-brand-500/30 bg-surface-0"
            : "border-destructive/30 bg-destructive/5"
        }`}
      >
        <div className="p-5 sm:p-6 lg:p-7 space-y-5">
          {/* Top Header: URL, Badges & Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="h-6 w-6 rounded-lg bg-surface-2 flex items-center justify-center text-text-secondary shrink-0">
                  <Globe weight="bold" className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-text-primary hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate max-w-xl">
                  {url}
                </h3>
                {isPending && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 border border-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/30">
                    <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                    Auditing…
                  </span>
                )}
                {isFailed && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
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
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Performance</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${scoreColors.text}`}>
                      {typeof score === "number" ? score : "—"}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${scoreColors.badge}`}>
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
                className="h-8 w-8 rounded-lg bg-surface-1 hover:bg-rose-500/10 hover:border-rose-500/30 text-text-tertiary hover:text-rose-600 dark:hover:text-rose-400 border border-border flex items-center justify-center transition-colors cursor-pointer"
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
            <div className="flex items-center gap-3 text-xs text-brand-600 dark:text-brand-300 bg-surface-1 p-4 rounded-xl border border-border">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600"></span>
              </span>
              <span className="font-medium">Lighthouse headless browser is capturing traces, Core Web Vitals, and filmstrips…</span>
            </div>
          )}

          {/* Completed Metrics Strip */}
          {isCompleted && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 sm:p-3.5 rounded-xl bg-surface-1 border border-border/80 flex flex-col justify-between">
                <p className="text-[11px] font-semibold text-text-secondary uppercase">FCP</p>
                <p className="text-base sm:text-lg font-bold text-text-primary font-mono mt-1">
                  {fcp != null ? `${Number(fcp).toFixed(1)}s` : "—"}
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">First Contentful Paint</p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-surface-1 border border-border/80 flex flex-col justify-between">
                <p className="text-[11px] font-semibold text-text-secondary uppercase">LCP</p>
                <p className="text-base sm:text-lg font-bold text-text-primary font-mono mt-1">
                  {lcp != null ? `${Number(lcp).toFixed(1)}s` : "—"}
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">Largest Contentful Paint</p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-surface-1 border border-border/80 flex flex-col justify-between">
                <p className="text-[11px] font-semibold text-text-secondary uppercase">TBT</p>
                <p className="text-base sm:text-lg font-bold text-text-primary font-mono mt-1">
                  {tti != null ? `${Math.round(Number(tti) > 100 ? Number(tti) : Number(tti) * 1000)}ms` : "—"}
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">Total Blocking Time</p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-surface-1 border border-border/80 flex flex-col justify-between">
                <p className="text-[11px] font-semibold text-text-secondary uppercase">CLS</p>
                <p className="text-base sm:text-lg font-bold text-text-primary font-mono mt-1">
                  {cls != null ? Number(cls).toFixed(2) : "—"}
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">Cumulative Layout Shift</p>
              </div>
            </div>
          )}
        </div>

        {/* Prominent Action Footer */}
        {isCompleted && (
          <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-surface-1/70 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-text-secondary w-full sm:w-auto justify-between sm:justify-start">
              <span className="inline-flex items-center gap-1.5 font-medium text-text-tertiary">
                <Cpu weight="fill" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                Diagnostics Available
              </span>
            </div>

            <Link href={`/dashboard/test/${id}`} className="w-full sm:w-auto">
              <Button
                size="default"
                className="w-full sm:w-auto h-11 sm:h-9 px-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-xs shadow-brand-500/20 cursor-pointer gap-2 transition-transform active:scale-[0.98]"
              >
                <span>View Full Report</span>
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


