"use client";

import React from "react";
import { ScoreGauge } from "./ScoreGauge";
import { Zap, ShieldCheck, Eye, Search } from "lucide-react";

interface CategoryScoreRingsProps {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

export const CategoryScoreRings: React.FC<CategoryScoreRingsProps> = ({ scores }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Executive Performance Overview
          </h2>
          <p className="text-xs text-slate-500">
            Official Google Lighthouse audit scores across all four key dimensions
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 90–100 Good
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 50–89 Needs Work
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 0–49 Poor
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreGauge
          score={scores.performance}
          label="Performance"
          subtitle="Speed & responsiveness"
        />
        <ScoreGauge
          score={scores.accessibility}
          label="Accessibility"
          subtitle="Screen readers & contrast"
        />
        <ScoreGauge
          score={scores.bestPractices}
          label="Best Practices"
          subtitle="Security & modern web"
        />
        <ScoreGauge
          score={scores.seo}
          label="SEO"
          subtitle="Search indexability"
        />
      </div>
    </section>
  );
};
