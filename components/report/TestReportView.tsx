"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { parseLighthouseReport } from "@/lib/report-parser";
import { ReportHeader } from "./ReportHeader";
import { Card, CardContent } from "../ui/card";
import { AlertCircle, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

// Lazily loaded — these are heavy components with large dependency trees
const CategoryScoreRings = dynamic(
  () => import("./CategoryScoreRings").then((m) => ({ default: m.CategoryScoreRings })),
  { ssr: false }
);
const CoreWebVitalsGrid = dynamic(
  () => import("./CoreWebVitalsGrid").then((m) => ({ default: m.CoreWebVitalsGrid })),
  { ssr: false }
);
const VisualExperience = dynamic(
  () => import("./VisualExperience").then((m) => ({ default: m.VisualExperience })),
  { ssr: false }
);
const ReportTabs = dynamic(
  () => import("./ReportTabs").then((m) => ({ default: m.ReportTabs })),
  { ssr: false }
);

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
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center w-full max-w-full">
        <Card className="max-w-md w-full border-amber-200 bg-amber-50/50 p-6">
          <CardContent className="p-0 space-y-3">
            <AlertCircle className="h-10 w-10 text-amber-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">
              {test.status === "pending" ? "Audit In Progress..." : "Audit Failed"}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {test.status === "pending"
                ? "This test is currently being processed by Google PageSpeed Insights. Please refresh in a few moments."
                : test.errorMessage ||
                  "This audit could not be completed. Check the URL or server logs for details."}
            </p>
            <div className="pt-2">
              <Link href={isPublic ? "/" : "/dashboard"}>
                <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white">
                  {isPublic ? "Go to AuditHQ Home" : "Return to Dashboard"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
            <h3 className="text-2xl font-bold">
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
