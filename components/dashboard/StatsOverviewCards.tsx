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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StatsOverviewCardsProps {
  initialStats?: DashboardStats | null;
}

function getScoreTextColor(score: number | null): string {
  if (score == null) return "text-[#8898aa]";
  if (score >= 90) return "text-[#00875a]";
  if (score >= 50) return "text-[#b76e00]";
  return "text-[#de350b]";
}

const StatsOverviewCards: React.FC<StatsOverviewCardsProps> = ({ initialStats }) => {
  const { data, isLoading: swrLoading } = useSWR<{ stats: DashboardStats }>(
    "/api/dashboard/stats",
    fetcher,
    {
      fallbackData: initialStats ? { stats: initialStats } : undefined,
      revalidateOnFocus: true,
    }
  );

  const isLoading = !data && !initialStats && swrLoading;
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
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#8898aa] uppercase tracking-wider font-sans">
              Audits This Month
            </p>
            <div className="text-3xl font-mono font-bold text-[#0a2540] tracking-tight">
              {isLoading ? (
                <div className="h-8 w-14 rounded-md bg-[#f1f5f9] animate-pulse my-0.5" />
              ) : (
                <>
                  {stats.testsThisMonth}
                  <span className="text-sm font-normal text-[#8898aa] ml-1.5 font-sans">
                    / {stats.testsLimit || 100}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#f0f2ff] border border-brand-200 flex items-center justify-center text-[#635bff]">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f1f5f9] space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-[#8898aa]">
            <span>Monthly Quota</span>
            <span>{isLoading ? "—" : `${usagePercent}%`}</span>
          </div>
          <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#635bff] rounded-full transition-all duration-500"
              style={{ width: `${isLoading ? 0 : usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Average Performance */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#8898aa] uppercase tracking-wider font-sans">
              Avg Performance
            </p>
            <div className={`text-3xl font-mono font-bold tracking-tight ${getScoreTextColor(stats.avgPerformance)}`}>
              {isLoading ? (
                <div className="h-8 w-12 rounded-md bg-[#f1f5f9] animate-pulse my-0.5" />
              ) : (
                stats.avgPerformance != null ? Math.round(Number(stats.avgPerformance)) : "—"
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#e3fcf7] border border-[#abf5d1] flex items-center justify-center text-[#00875a]">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center text-xs">
          {isLoading ? (
            <div className="h-4 w-28 rounded bg-[#f1f5f9] animate-pulse" />
          ) : stats.performanceDiff != null && stats.performanceDiff !== 0 ? (
            stats.performanceDiff > 0 ? (
              <span className="inline-flex items-center gap-1 text-[#00875a] font-semibold font-mono text-[11px]">
                <TrendingUp className="h-3.5 w-3.5" />
                +{Number(stats.performanceDiff) % 1 === 0 ? stats.performanceDiff : Number(stats.performanceDiff).toFixed(1)} pts vs earlier
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#de350b] font-semibold font-mono text-[11px]">
                <TrendingDown className="h-3.5 w-3.5" />
                {Number(stats.performanceDiff) % 1 === 0 ? stats.performanceDiff : Number(stats.performanceDiff).toFixed(1)} pts vs earlier
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 text-[#8898aa] font-mono text-[11px]">
              <Minus className="h-3 w-3" />
              {stats.avgPerformance != null ? "Baseline calibrated" : "No completed audits"}
            </span>
          )}
        </div>
      </div>

      {/* 3. Active Domains */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#8898aa] uppercase tracking-wider font-sans">
              Monitored Domains
            </p>
            <div className="text-3xl font-mono font-bold text-[#0a2540] tracking-tight">
              {isLoading ? (
                <div className="h-8 w-10 rounded-md bg-[#f1f5f9] animate-pulse my-0.5" />
              ) : (
                stats.activeSites
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#f0f2ff] border border-brand-200 flex items-center justify-center text-[#635bff]">
            <Globe className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#8898aa] font-mono text-[11px]">
          {isLoading ? (
            <div className="h-3 w-24 rounded bg-[#f1f5f9] animate-pulse" />
          ) : (
            <span>{stats.activeSites === 1 ? "1 unique domain" : `${stats.activeSites} unique domains`}</span>
          )}
        </div>
      </div>

      {/* 4. Average Load Time (LCP) */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#8898aa] uppercase tracking-wider font-sans">
              Avg Load Time (LCP)
            </p>
            <div className="text-3xl font-mono font-bold text-[#0a2540] tracking-tight">
              {isLoading ? (
                <div className="h-8 w-16 rounded-md bg-[#f1f5f9] animate-pulse my-0.5" />
              ) : stats.avgLoadTime != null ? (
                <>
                  {Number(stats.avgLoadTime) % 1 === 0
                    ? stats.avgLoadTime
                    : Number(stats.avgLoadTime).toFixed(1)}
                  <span className="text-base font-normal text-[#8898aa] ml-0.5">s</span>
                </>
              ) : (
                "—"
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#fff8e5] border border-[#ffe380] flex items-center justify-center text-[#b76e00]">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center text-xs">
          {isLoading ? (
            <div className="h-4 w-28 rounded bg-[#f1f5f9] animate-pulse" />
          ) : stats.avgLoadTime != null ? (
            stats.avgLoadTime <= 2.5 ? (
              <span className="inline-flex items-center gap-1 text-[#00875a] font-semibold font-mono text-[11px]">
                <TrendingDown className="h-3.5 w-3.5" />
                Optimal (&lt;2.5s target)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#b76e00] font-semibold font-mono text-[11px]">
                <TrendingUp className="h-3.5 w-3.5" />
                Needs optimization
              </span>
            )
          ) : (
            <span className="text-[#8898aa] font-mono text-[11px]">
              Target: &lt;2.5s LCP
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsOverviewCards;
