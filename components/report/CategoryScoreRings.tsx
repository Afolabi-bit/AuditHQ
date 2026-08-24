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
      {/* Legend and Composite Score Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/60 text-xs">
        <span className="font-mono text-text-secondary">
          Average Category Score: <strong className="text-text-primary font-bold">{avgCategoryScore}/100</strong>
        </span>

        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-score-good" />
            90–100 Good
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-score-warn" />
            50–89 Needs Work
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-score-poor" />
            0–49 Poor
          </span>
        </div>
      </div>

      {/* 4 Cards Grid with generous gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ScoreGauge
          score={scores.performance}
          label="Performance"
          subtitle="Speed & responsiveness"
          categoryKey="performance"
        />
        <ScoreGauge
          score={scores.accessibility}
          label="Accessibility"
          subtitle="A11y & color contrast"
          categoryKey="accessibility"
        />
        <ScoreGauge
          score={scores.bestPractices}
          label="Best Practices"
          subtitle="Security & modern APIs"
          categoryKey="bestPractices"
        />
        <ScoreGauge
          score={scores.seo}
          label="SEO"
          subtitle="Crawlability & indexing"
          categoryKey="seo"
        />
      </div>
    </section>
  );
};
