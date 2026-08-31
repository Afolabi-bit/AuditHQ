"use client";

import React, { useState } from "react";
import {
  Globe,
  CaretDown,
  CaretUp,
  ArrowsLeftRight,
  Lightning,
  Clock,
  Desktop,
  DeviceMobile,
  CheckCircle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import TestCard from "./TestCard";
import { submitDomain } from "@/app/utils/actions";
import { useAppStore, StoredTest, toStoredTest } from "@/lib/store/useAppStore";
import { CompareSelectorModal } from "@/components/compare/CompareSelectorModal";

export type DomainGroupTestItem = {
  id: string;
  createdAt: Date | string;
  domainId: string;
  device?: string;
  network?: string;
  status: string;
  errorMessage?: string | null;
  performanceScore: number | null;
  fcp: number | null;
  lcp: number | null;
  tbt: number | null;
  cls: number | null;
  domain: {
    id: string;
    createdAt: Date | string;
    url: string;
    device: string;
    network: string;
    ownerId: string;
    updatedAt: Date | string;
  };
};

interface DomainGroupCardProps {
  url: string;
  tests: DomainGroupTestItem[];
  userId: string;
  defaultExpanded?: boolean;
  onRunTestStarted?: () => void;
}

function getScoreBadgeStyle(score: number | null) {
  if (score == null) return "bg-surface-2 text-text-tertiary border-border";
  if (score >= 90) return "score-badge-good";
  if (score >= 50) return "score-badge-warn";
  return "score-badge-poor";
}

function msToSeconds(ms: number | null | undefined): number | null {
  if (ms == null) return null;
  return Math.round(ms / 100) / 10;
}

export const DomainGroupCard: React.FC<DomainGroupCardProps> = ({
  url,
  tests,
  userId,
  defaultExpanded = true,
  onRunTestStarted,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isQueueing, setIsQueueing] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const upsertTest = useAppStore((state) => state.upsertTest);

  const completedTests = tests.filter((t) => t.status === "completed");
  const latestTest = tests[0]; // Newest first

  // Calculate domain-level average score
  const validScores = completedTests
    .map((t) => t.performanceScore)
    .filter((s): s is number => typeof s === "number");

  const avgScore =
    validScores.length > 0
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : null;

  const handleQuickAudit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!url || isQueueing) return;

    try {
      setIsQueueing(true);
      const res = await submitDomain({
        url,
        device: latestTest?.device || "desktop",
        network: latestTest?.network || "No Throttling",
        userID: userId,
      });

      if (res.success && res.testId) {
        // Optimistically upsert pending test
        upsertTest(
          toStoredTest({
            id: res.testId,
            createdAt: new Date().toISOString(),
            domainId: latestTest?.domainId || "pending",
            device: latestTest?.device || "desktop",
            network: latestTest?.network || "No Throttling",
            status: "pending",
            errorMessage: null,
            performanceScore: null,
            fcp: null,
            lcp: null,
            tbt: null,
            cls: null,
            domain: {
              id: latestTest?.domainId || "pending",
              url,
              device: latestTest?.device || "desktop",
              network: latestTest?.network || "No Throttling",
              ownerId: userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          })
        );
        if (onRunTestStarted) onRunTestStarted();
      }
    } catch (err) {
      console.error("Error triggering quick audit:", err);
    } finally {
      setIsQueueing(false);
    }
  };

  return (
    <div className="bg-surface-0 border border-border rounded-2xl overflow-hidden shadow-xs hover:border-brand-200 dark:hover:border-brand-500/30 transition-all">
      {/* ── Domain Summary Header Banner ── */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 sm:p-6 bg-surface-1/50 hover:bg-surface-1/80 border-b border-border/70 transition-colors cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none"
      >
        {/* Left Info: Domain Identity, Badges & Activity */}
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="h-8 w-8 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center shrink-0">
              <Globe weight="bold" className="h-4 w-4" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-text-primary hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate">
              {url}
            </h3>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-2 text-text-secondary border border-border/80">
              {tests.length} {tests.length === 1 ? "Audit" : "Audits"}
            </span>

            {latestTest?.device && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-surface-2 text-text-tertiary border border-border/60 uppercase">
                {latestTest.device.toLowerCase() === "mobile" ? (
                  <DeviceMobile weight="bold" className="h-3 w-3" />
                ) : (
                  <Desktop weight="bold" className="h-3 w-3" />
                )}
                {latestTest.device}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap">
            {latestTest && (
              <span className="flex items-center gap-1 text-text-tertiary">
                <Clock weight="bold" className="h-3.5 w-3.5" />
                Last audited:{" "}
                {new Date(latestTest.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Right Info: Score Overview & Domain Controls */}
        <div className="flex items-center flex-wrap gap-3 sm:gap-4 shrink-0">
          {/* Domain Score Pill */}
          {avgScore != null && (
            <div className="flex items-center gap-2 bg-surface-0 px-3.5 py-2 rounded-xl border border-border shadow-2xs">
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Domain Avg
                </p>
                <div className="text-lg font-bold font-mono text-text-primary">
                  {avgScore}/100
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreBadgeStyle(
                  avgScore
                )}`}
              >
                {avgScore >= 90 ? "Good" : avgScore >= 50 ? "Needs Work" : "Poor"}
              </span>
            </div>
          )}

          {/* Action: Domain-Specific Comparison */}
          {completedTests.length >= 2 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsCompareOpen(true);
              }}
              className="h-9 px-3.5 text-xs font-semibold border-border hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-300 gap-1.5 rounded-xl cursor-pointer"
            >
              <ArrowsLeftRight weight="bold" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>Compare Domain Runs</span>
            </Button>
          )}

          {/* Action: Run New Audit */}
          <Button
            type="button"
            size="sm"
            onClick={handleQuickAudit}
            disabled={isQueueing}
            className="h-9 px-3.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white gap-1.5 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Lightning weight="fill" className="h-3.5 w-3.5" />
            <span>{isQueueing ? "Auditing…" : "Run Audit"}</span>
          </Button>

          {/* Expand Toggle */}
          <button
            type="button"
            className="h-9 w-9 rounded-xl bg-surface-2/70 hover:bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label={isExpanded ? "Collapse domain group" : "Expand domain group"}
          >
            {isExpanded ? (
              <CaretUp weight="bold" className="h-4 w-4" />
            ) : (
              <CaretDown weight="bold" className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── Collapsible Domain Audit List ── */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-surface-0 space-y-4 border-t border-border/40 animate-in fade-in-50 duration-150">
          {tests.map((test) => {
            const rawLcp = test.lcp;
            const rawFcp = test.fcp;
            const rawTbt = test.tbt;
            const lcpSeconds = msToSeconds(rawLcp);
            const fcpSeconds = msToSeconds(rawFcp);
            const tbtSeconds = msToSeconds(rawTbt);
            const clsValue = test.cls != null ? Number(test.cls) : null;

            return (
              <TestCard
                key={test.id}
                id={test.id}
                url={test.domain?.url || url}
                status={test.status}
                date={new Date(test.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                device={test.device || test.domain?.device || "Desktop"}
                errorMessage={test.errorMessage}
                score={test.performanceScore}
                fcp={fcpSeconds}
                lcp={lcpSeconds}
                tti={tbtSeconds}
                cls={clsValue}
                speedIndex={null}
              />
            );
          })}
        </div>
      )}

      {/* Domain-Level Compare Selector Modal (Restricted to this Domain) */}
      <CompareSelectorModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        initialBaseId={completedTests[1]?.id}
        initialTargetId={completedTests[0]?.id}
        isPublic={false}
      />
    </div>
  );
};
