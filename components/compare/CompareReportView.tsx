"use client";

import React from "react";
import { ComparisonReport } from "@/lib/comparison/types";
import { CompareHeader } from "./CompareHeader";
import { ExecutiveDeltaBanner } from "./ExecutiveDeltaBanner";
import { CoreWebVitalsDeltaGrid } from "./CoreWebVitalsDeltaGrid";
import { SynchronizedFilmstrip } from "./SynchronizedFilmstrip";
import { ResourcePayloadDiff } from "./ResourcePayloadDiff";
import { OpportunitiesDiffMatrix } from "./OpportunitiesDiffMatrix";
import { AiRegressionCard } from "./AiRegressionCard";

interface CompareReportViewProps {
  report: ComparisonReport;
  isPublic?: boolean;
}

export const CompareReportView: React.FC<CompareReportViewProps> = ({
  report,
  isPublic = false,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 w-full max-w-full overflow-x-hidden">
      {/* 1. Header with Metadata, Swap Action & Sharing */}
      <CompareHeader report={report} isPublic={isPublic} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full overflow-x-hidden min-w-0">
        {/* 2. Executive Net Delta & Score Hero Banner */}
        <ExecutiveDeltaBanner report={report} />

        {/* 3. Core Web Vitals Side-by-Side Delta Grid */}
        <CoreWebVitalsDeltaGrid metrics={report.metrics} />

        {/* 4. AI Comparative Regression Diagnosis */}
        <AiRegressionCard baseId={report.base.id} targetId={report.target.id} />

        {/* 5. Synchronized Filmstrip Progression Player */}
        <SynchronizedFilmstrip
          frames={report.filmstripFrames}
          baseUrl={report.base.url}
          targetUrl={report.target.url}
        />

        {/* 6. Network Resource & Bundle Payload Bloat Breakdown */}
        <ResourcePayloadDiff resourceDiffs={report.resourceDiffs} />

        {/* 7. Lighthouse Opportunities Transition Matrix */}
        <OpportunitiesDiffMatrix transitions={report.opportunityTransitions} />
      </main>
    </div>
  );
};
