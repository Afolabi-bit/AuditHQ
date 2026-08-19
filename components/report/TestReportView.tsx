"use client";

import React, { useMemo } from "react";
import { parseLighthouseReport } from "@/lib/report-parser";
import { ReportHeader } from "./ReportHeader";
import { CategoryScoreRings } from "./CategoryScoreRings";
import { CoreWebVitalsGrid } from "./CoreWebVitalsGrid";
import { VisualExperience } from "./VisualExperience";
import { ReportTabs } from "./ReportTabs";
import { Card, CardContent } from "../ui/card";
import { AlertCircle, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface TestReportViewProps {
  test: {
    id: number;
    status: string;
    errorMessage?: string | null;
    performanceScore: number | null;
    fcp: number | null;
    lcp: number | null;
    tbt: number | null;
    cls: number | null;
    fullReport: any;
    createdAt: Date | string;
    domain: {
      id: number;
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
  const parsedReport = useMemo(() => {
    return parseLighthouseReport(test.fullReport);
  }, [test.fullReport]);

  if (test.status !== "completed") {
    const isPending = test.status === "pending";

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center w-full max-w-full">
        <div className="max-w-md w-full rounded-xl bg-white border border-[#e3e8ee] p-8 shadow-[0_1px_3px_rgba(50,50,93,0.08)] space-y-4">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto border ${
              isPending
                ? "bg-[#f0f2ff] text-[#635bff] border-[#c7cefe]"
                : "bg-[#ffebe6] text-[#de350b] border-[#ffbdad]"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <AlertCircle className="h-6 w-6" />
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#0a2540] font-sans">
              {isPending ? "Cloud Audit in Progress..." : "Audit Encountered an Issue"}
            </h2>
            <p className="text-xs text-[#425466] leading-relaxed">
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
                className="bg-[#635bff] hover:bg-[#5851ea] text-white font-semibold text-xs rounded-lg px-4 h-9 cursor-pointer"
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
    <div className="min-h-screen bg-[#f6f9fc] pb-16 w-full max-w-full overflow-x-hidden">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full max-w-full overflow-x-hidden min-w-0">
        {/* 1. Category Score Rings (4 Circular SVG Gauges) */}
        <CategoryScoreRings scores={parsedReport.scores} />

        {/* 2. Core Web Vitals Metric Cards */}
        <CoreWebVitalsGrid metrics={parsedReport.metrics} />

        {/* 3. Visual Experience (Filmstrip Timeline & Screenshot Preview) */}
        <VisualExperience
          filmstrip={parsedReport.filmstrip}
          fullPageScreenshot={parsedReport.fullPageScreenshot}
          url={test.domain.url}
        />

        {/* 4. Deep-Dive Interactive Tabs */}
        <ReportTabs report={parsedReport} />

        {/* 5. Public Footer CTA Banner (if viewed publicly) */}
        {isPublic && (
          <div className="mt-12 bg-[#635bff] rounded-xl p-8 text-center text-white space-y-4 print:hidden shadow-md">
            <h3 className="text-2xl font-bold font-sans">
              Optimize your website performance with AuditHQ
            </h3>
            <p className="text-white/85 text-sm max-w-xl mx-auto">
              Run automated Lighthouse cloud audits, track Core Web Vitals over time, and get instant recommendations to build faster web experiences.
            </p>
            <div className="pt-2">
              <Link href="/">
                <Button size="lg" className="bg-white text-[#635bff] hover:bg-[#f0f2ff] font-bold shadow-sm rounded-lg cursor-pointer">
                  <Zap className="h-4 w-4 mr-2 fill-[#635bff]" />
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
