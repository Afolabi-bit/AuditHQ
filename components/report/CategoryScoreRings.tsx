"use client";

import React from "react";
import { ScoreGauge } from "./ScoreGauge";

interface CategoryScoreRingsProps {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

export const CategoryScoreRings: React.FC<CategoryScoreRingsProps> = ({ scores }) => {
  const avgCategoryScore = Math.round(
    (scores.performance + scores.accessibility + scores.bestPractices + scores.seo) / 4
  );

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-0 border border-border rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight font-sans">
              Core Performance Audit
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-brand-50 text-brand-500 border border-brand-200 shadow-2xs">
              Composite Index: {avgCategoryScore}/100
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary">
            Multi-dimensional evaluation based on official Google Lighthouse 12.0 scoring algorithms
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-text-secondary font-mono">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-score-good" />
            90–100 Good
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-score-warn" />
            50–89 Needs Work
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-score-poor" />
            0–49 Poor
          </span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        <ScoreGauge
          score={scores.performance}
          label="Performance"
          subtitle="Speed & responsiveness"
          categoryKey="performance"
        />
        <ScoreGauge
          score={scores.accessibility}
          label="Accessibility"
          subtitle="A11y compliance & contrast"
          categoryKey="accessibility"
        />
        <ScoreGauge
          score={scores.bestPractices}
          label="Best Practices"
          subtitle="Security & modern standards"
          categoryKey="bestPractices"
        />
        <ScoreGauge
          score={scores.seo}
          label="SEO"
          subtitle="Discoverability & crawling"
          categoryKey="seo"
        />
      </div>
    </section>
  );
};
