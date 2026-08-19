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
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#e3e8ee] rounded-xl p-4 px-6 shadow-[0_1px_3px_rgba(50,50,93,0.08)]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-[#0a2540] tracking-tight font-sans">
              Core Performance Audit
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#f0f2ff] text-[#635bff] border border-brand-200">
              Composite Index: {avgCategoryScore}/100
            </span>
          </div>
          <p className="text-xs text-[#425466]">
            Multi-dimensional evaluation based on official Google Lighthouse 12.0 scoring algorithms
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-[#425466]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00875a]" />
            90–100 Good
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#b76e00]" />
            50–89 Needs Work
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#de350b]" />
            0–49 Poor
          </span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
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
