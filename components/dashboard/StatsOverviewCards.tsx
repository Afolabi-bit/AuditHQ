"use client";

import {
  BarChart3,
  Clock,
  Globe,
  TrendingDown,
  TrendingUp,
  Minus,
  Activity,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import useSWR from "swr";
import { DashboardStats } from "@/app/utils/actions";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StatsOverviewCardsProps {
  initialStats?: DashboardStats | null;
}

function getScoreTextColor(score: number | null): string {
  if (score == null) return "text-text-tertiary";
  if (score >= 90) return "text-score-good";
  if (score >= 50) return "text-score-warn";
  return "text-score-poor";
}

const StatsOverviewCards: React.FC<StatsOverviewCardsProps> = ({ initialStats }) => {
  const { data } = useSWR<{ stats: DashboardStats }>("/api/dashboard/stats", fetcher, {
    fallbackData: initialStats ? { stats: initialStats } : undefined,
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  const stats = data?.stats || initialStats || {
    testsThisMonth: 0,
    testsLimit: 100,
    avgPerformance: null,
    performanceDiff: null,
    activeSites: 0,
    avgLoadTime: null,
    loadTimeDiff: null,
    performanceTrends: [],
    coreWebVitals: { lcp: null, tbt: null, cls: null },
    recommendations: [],
  };

  const usagePercent = Math.min(
    100,
    Math.round((stats.testsThisMonth / (stats.testsLimit || 100)) * 100)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* 1. Tests This Month */}
      <div className="bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs hover:shadow-sm hover:border-brand-200 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider font-sans">
              Monthly Audits
            </p>
            <p className="text-3xl font-mono font-bold text-text-primary tracking-tight">
              {stats.testsThisMonth}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-surface-2 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-text-tertiary">
            <span>Quota Used</span>
            <span className="font-semibold text-text-primary">
              {stats.testsThisMonth} / {stats.testsLimit}
            </span>
          </div>
          {/* Segmented / Smooth Modern Bar */}
          <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Average Performance */}
      <div className="bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs hover:shadow-sm hover:border-brand-200 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider font-sans">
              Avg Performance
            </p>
            <p className={`text-3xl font-mono font-bold tracking-tight ${getScoreTextColor(stats.avgPerformance)}`}>
              {stats.avgPerformance != null ? stats.avgPerformance : "—"}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-surface-2 flex items-center text-xs">
          {stats.performanceDiff != null && stats.performanceDiff !== 0 ? (
            stats.performanceDiff > 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold font-mono text-[11px]">
                <TrendingUp className="h-3.5 w-3.5" />
                +{stats.performanceDiff} pts vs earlier
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-600 font-semibold font-mono text-[11px]">
                <TrendingDown className="h-3.5 w-3.5" />
                {stats.performanceDiff} pts vs earlier
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 text-text-tertiary font-mono text-[11px]">
              <Minus className="h-3 w-3" />
              {stats.avgPerformance != null ? "Baseline calibrated" : "No completed audits"}
            </span>
          )}
        </div>
      </div>

      {/* 3. Active Domains */}
      <div className="bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs hover:shadow-sm hover:border-brand-200 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider font-sans">
              Monitored Domains
            </p>
            <p className="text-3xl font-mono font-bold text-text-primary tracking-tight">
              {stats.activeSites}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Globe className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-surface-2 flex items-center justify-between text-xs text-text-tertiary font-mono text-[11px]">
          <span>{stats.activeSites === 1 ? "1 unique domain" : `${stats.activeSites} unique domains`}</span>
        </div>
      </div>

      {/* 4. Average Load Time (LCP) */}
      <div className="bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs hover:shadow-sm hover:border-brand-200 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider font-sans">
              Avg Load Time (LCP)
            </p>
            <p className="text-3xl font-mono font-bold text-text-primary tracking-tight">
              {stats.avgLoadTime != null ? (
                <>
                  {stats.avgLoadTime}
                  <span className="text-base font-normal text-text-tertiary ml-0.5">s</span>
                </>
              ) : (
                "—"
              )}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-surface-2 flex items-center text-xs">
          {stats.avgLoadTime != null ? (
            stats.avgLoadTime <= 2.5 ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold font-mono text-[11px]">
                <TrendingDown className="h-3.5 w-3.5" />
                Optimal (&lt;2.5s target)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-600 font-semibold font-mono text-[11px]">
                <TrendingUp className="h-3.5 w-3.5" />
                Needs optimization
              </span>
            )
          ) : (
            <span className="text-text-tertiary font-mono text-[11px]">
              Target: &lt;2.5s LCP
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsOverviewCards;
