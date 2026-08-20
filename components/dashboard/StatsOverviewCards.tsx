"use client";

import React from "react";
import {
  BarChart3,
  Clock,
  Globe,
  TrendingDown,
  TrendingUp,
  Minus,
  Activity,
} from "lucide-react";
import useSWR from "swr";
import { DashboardStats } from "@/app/utils/actions";
import { useAppStore } from "@/lib/store/useAppStore";

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
  const storedStats = useAppStore((state) => state.stats);
  const isFresh = useAppStore.getState().isStatsFresh(120_000);

  const { data, isLoading: swrLoading } = useSWR<{ stats: DashboardStats }>(
    "/api/dashboard/stats",
    fetcher,
    {
      revalidateOnFocus: false, // Don't query database on tab switches
      revalidateOnReconnect: false,
      dedupingInterval: 120_000, // 2-minute deduplication window
      revalidateIfStale: !isFresh,
      onSuccess: (freshData) => {
        if (freshData?.stats) {
          useAppStore.getState().setStats(freshData.stats);
        }
      },
    }
  );

  const resolvedStats = data?.stats ?? storedStats ?? initialStats;
  const isLoading = !resolvedStats && swrLoading;

  const stats = resolvedStats ?? {
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
      <div className="bg-surface-0 border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider font-sans">
              Audits This Month
            </p>
            <div className="text-3xl font-mono font-bold text-text-primary tracking-tight">
              {isLoading ? (
                <div className="h-8 w-14 rounded-md bg-surface-2 animate-pulse my-0.5" />
              ) : (
                <>
                  {stats.testsThisMonth}
                  <span className="text-sm font-normal text-text-tertiary ml-1.5 font-sans">
                    / {stats.testsLimit || 100}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-500">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-text-tertiary">
            <span>Monthly Quota</span>
            <span>{isLoading ? "—" : `${usagePercent}%`}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${isLoading ? 0 : usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Average Performance */}
      <div className="bg-surface-0 border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider font-sans">
              Avg Performance
            </p>
            <div className={`text-3xl font-mono font-bold tracking-tight ${getScoreTextColor(stats.avgPerformance)}`}>
              {isLoading ? (
                <div className="h-8 w-12 rounded-md bg-surface-2 animate-pulse my-0.5" />
              ) : (
                stats.avgPerformance != null ? Math.round(Number(stats.avgPerformance)) : "—"
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-score-good/10 border border-score-good/30 flex items-center justify-center text-score-good">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center text-xs">
          {isLoading ? (
            <div className="h-4 w-28 rounded bg-surface-2 animate-pulse" />
          ) : stats.performanceDiff != null && stats.performanceDiff !== 0 ? (
            stats.performanceDiff > 0 ? (
              <span className="inline-flex items-center gap-1 text-score-good font-semibold font-mono text-[11px]">
                <TrendingUp className="h-3.5 w-3.5" />
                +{Number(stats.performanceDiff) % 1 === 0 ? stats.performanceDiff : Number(stats.performanceDiff).toFixed(1)} pts vs earlier
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-score-poor font-semibold font-mono text-[11px]">
                <TrendingDown className="h-3.5 w-3.5" />
                {Number(stats.performanceDiff) % 1 === 0 ? stats.performanceDiff : Number(stats.performanceDiff).toFixed(1)} pts vs earlier
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
      <div className="bg-surface-0 border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider font-sans">
              Monitored Domains
            </p>
            <div className="text-3xl font-mono font-bold text-text-primary tracking-tight">
              {isLoading ? (
                <div className="h-8 w-10 rounded-md bg-surface-2 animate-pulse my-0.5" />
              ) : (
                stats.activeSites
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-500">
            <Globe className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-text-tertiary font-mono text-[11px]">
          {isLoading ? (
            <div className="h-3 w-24 rounded bg-surface-2 animate-pulse" />
          ) : (
            <span>{stats.activeSites === 1 ? "1 unique domain" : `${stats.activeSites} unique domains`}</span>
          )}
        </div>
      </div>

      {/* 4. Average Load Time (LCP) */}
      <div className="bg-surface-0 border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider font-sans">
              Avg Load Time (LCP)
            </p>
            <div className="text-3xl font-mono font-bold text-text-primary tracking-tight">
              {isLoading ? (
                <div className="h-8 w-16 rounded-md bg-surface-2 animate-pulse my-0.5" />
              ) : stats.avgLoadTime != null ? (
                <>
                  {Number(stats.avgLoadTime) % 1 === 0
                    ? stats.avgLoadTime
                    : Number(stats.avgLoadTime).toFixed(1)}
                  <span className="text-base font-normal text-text-tertiary ml-0.5">s</span>
                </>
              ) : (
                "—"
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-score-warn/10 border border-score-warn/30 flex items-center justify-center text-score-warn">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center text-xs">
          {isLoading ? (
            <div className="h-4 w-28 rounded bg-surface-2 animate-pulse" />
          ) : stats.avgLoadTime != null ? (
            stats.avgLoadTime <= 2.5 ? (
              <span className="inline-flex items-center gap-1 text-score-good font-semibold font-mono text-[11px]">
                <TrendingDown className="h-3.5 w-3.5" />
                Optimal (&lt;2.5s target)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-score-warn font-semibold font-mono text-[11px]">
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
