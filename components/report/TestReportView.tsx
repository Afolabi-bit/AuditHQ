"use client";

import React, { useMemo, useEffect } from "react";
import { parseLighthouseReport } from "@/lib/report-parser";
import { ReportHeader } from "./ReportHeader";
import { CategoryScoreRings } from "./CategoryScoreRings";
import { CoreWebVitalsGrid } from "./CoreWebVitalsGrid";
import { VisualExperience } from "./VisualExperience";
import { ReportTabs } from "./ReportTabs";
import { AiInsightsCard } from "./AiInsightsCard";
import { AlertCircle, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAppStore, toStoredTest } from "@/lib/store/useAppStore";

interface TestReportViewProps {
  test: {
    id: string | number;
    status: string;
    errorMessage?: string | null;
    performanceScore: number | null;
    fcp: number | null;
    lcp: number | null;
    tbt: number | null;
    cls: number | null;
    fullReport: any;
    aiSummary?: any;
    createdAt: Date | string;
    domain: {
      id: string | number;
      url: string;
      device: string;
      network: string;
    };
  };
  isPublic?: boolean;
}

export const TestReportView: React.FC<TestReportViewProps> = ({
  test,
  isPublic = false,
}) => {
  // Sync loaded test & AI summary into Zustand localStorage store
  useEffect(() => {
    if (test.status === "completed") {
      useAppStore.getState().upsertTest(toStoredTest(test));
      if (test.aiSummary) {
        useAppStore.getState().setAiSummaryOnce(String(test.id), test.aiSummary);
      }
    }
  }, [test.id, test.status, test.aiSummary]);

  const parsedReport = useMemo(() => {
    return parseLighthouseReport(test.fullReport);
  }, [test.fullReport]);

  if (test.status !== "completed") {
    const isPending = test.status === "pending";

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center w-full max-w-full">
        <div className="max-w-md w-full rounded-xl bg-surface-0 border border-border p-8 shadow-xs space-y-4">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto border ${
              isPending
                ? "bg-brand-50 text-brand-500 border-brand-200"
                : "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/15 dark:text-[#ff7452] dark:border-[#de350b]/30"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <AlertCircle className="h-6 w-6" />
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-text-primary font-sans">
              {isPending ? "Cloud Audit in Progress..." : "Audit Encountered an Issue"}
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isPending
                ? "Lighthouse 12.0 is executing mobile/desktop simulations. This page will update automatically."
                : test.errorMessage ||
                  "This audit could not be completed. Check the domain URL or try running the test again."}
            </p>
          </div>
          <div className="pt-2">
            <Link href={isPublic ? "/" : "/dashboard"}>
              <Button
                size="sm"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg px-4 h-9 cursor-pointer"
              >
                {isPublic ? "Return to AuditHQ Home" : "Return to Dashboard"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 w-full max-w-full overflow-x-hidden">
      {/* Top Header with Breadcrumbs & Actions */}
      <ReportHeader
        testId={test.id}
        url={test.domain.url}
        device={test.domain.device}
        network={test.domain.network}
        createdAt={test.createdAt}
        rawReport={test.fullReport}
        isPublic={isPublic}
      />

      {/* Main Report Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10 sm:space-y-12 w-full overflow-x-hidden min-w-0">
        {/* 1. Category Score Rings Hero */}
        <CategoryScoreRings scores={parsedReport.scores} />

        {/* 2. Core Web Vitals Metric Cards */}
        <CoreWebVitalsGrid metrics={parsedReport.metrics} />

        {/* 3. AI Performance Diagnostics & Executive Summary */}
        <AiInsightsCard
          testId={test.id}
          initialSummary={test.aiSummary}
          isPublic={isPublic}
        />

        {/* 4. Visual Experience (Filmstrip Timeline & Screenshot Preview) */}
        <VisualExperience
          filmstrip={parsedReport.filmstrip}
          fullPageScreenshot={parsedReport.fullPageScreenshot}
          url={test.domain.url}
        />

        {/* 4. Deep-Dive Interactive Tabs */}
        <ReportTabs report={parsedReport} />

        {/* 5. Public Footer CTA Banner (if viewed publicly) */}
        {isPublic && (
          <div className="mt-12 bg-linear-to-br from-brand-600 to-brand-700 dark:from-[#1e1b38] dark:to-surface-0 dark:border dark:border-brand-500/30 rounded-2xl p-8 text-center text-white space-y-4 print:hidden shadow-xl">
            <h3 className="text-2xl font-bold font-sans text-white dark:text-text-primary">
              Optimize your website performance with AuditHQ
            </h3>
            <p className="text-white/90 dark:text-text-secondary text-sm max-w-xl mx-auto">
              Run automated Lighthouse cloud audits, track Core Web Vitals over time, and get instant recommendations to build faster web experiences.
            </p>
            <div className="pt-2">
              <Link href="/">
                <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-brand-500 dark:text-white dark:hover:bg-brand-600 font-extrabold shadow-md rounded-lg cursor-pointer">
                  <Zap className="h-4 w-4 mr-2 fill-current" />
                  Run Free Audit Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
