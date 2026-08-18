"use client";

import React, { useMemo } from "react";
import { parseLighthouseReport } from "@/lib/report-parser";
import { ReportHeader } from "./ReportHeader";
import { CategoryScoreRings } from "./CategoryScoreRings";
import { CoreWebVitalsGrid } from "./CoreWebVitalsGrid";
import { VisualExperience } from "./VisualExperience";
import { ReportTabs } from "./ReportTabs";
import { Card, CardContent } from "../ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface TestReportViewProps {
  test: {
    id: number;
    status: string;
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
}

export const TestReportView: React.FC<TestReportViewProps> = ({ test }) => {
  const parsedReport = useMemo(() => {
    return parseLighthouseReport(test.fullReport);
  }, [test.fullReport]);

  if (test.status !== "completed") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Card className="max-w-md w-full border-amber-200 bg-amber-50/50 p-6">
          <CardContent className="p-0 space-y-3">
            <AlertCircle className="h-10 w-10 text-amber-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">
              {test.status === "pending" ? "Audit In Progress..." : "Audit Failed"}
            </h2>
            <p className="text-xs text-slate-600">
              {test.status === "pending"
                ? "This test is still being processed by Google PageSpeed Insights. Please refresh in a few moments."
                : "This audit could not be completed. Check the URL or server logs for details."}
            </p>
            <div className="pt-2">
              <Link href="/dashboard">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Fixed / Sticky Header */}
      <ReportHeader
        testId={test.id}
        url={test.domain.url}
        device={test.domain.device}
        network={test.domain.network}
        createdAt={test.createdAt}
        rawReport={test.fullReport}
      />

      {/* Main Report Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
      </main>
    </div>
  );
};
