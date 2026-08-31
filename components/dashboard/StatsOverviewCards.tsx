"use client";

import React from "react";
import {
  ChartBar,
  Clock,
  Globe,
  TrendDown,
  TrendUp,
  Minus,
  Pulse,
  Lightning,
} from "@phosphor-icons/react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import useSWR from "swr";
import { DashboardStats } from "@/app/utils/actions";
import { useAppStore } from "@/lib/store/useAppStore";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StatsOverviewCardsProps {
  user?: KindeUser;
  initialStats?: DashboardStats | null;
}

function getScoreTextColor(score: number | null): string {
  if (score == null) return "text-text-tertiary";
  if (score >= 90) return "text-score-good";
  if (score >= 50) return "text-score-warn";
  return "text-score-poor";
}

const StatsOverviewCards: React.FC<StatsOverviewCardsProps> = ({ user, initialStats }) => {
  React.useEffect(() => {
    if (user?.id) {
      useAppStore.getState().syncUser(user.id);
    }
  }, [user?.id]);

  const currentUserId = useAppStore((state) => state.currentUserId);
  const storedStats = useAppStore((state) => state.stats);

  const isUserMatching = !user?.id || currentUserId === user.id;
  const isFresh = isUserMatching && useAppStore.getState().isStatsFresh(user?.id, 120_000);

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
          useAppStore.getState().setStats(freshData.stats, user?.id);
        }
      },
    }
  );

  const resolvedStats = data?.stats ?? (isUserMatching ? storedStats : null) ?? initialStats;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
      {/* 1. Tests This Month */}
      <div className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-brand-200 dark:hover:border-brand-500/30 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              Audits This Month
            </p>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-text-primary tracking-tight">
              {isLoading ? (
                <div className="h-9 w-16 rounded-lg bg-surface-2 animate-pulse my-1" />
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
          <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center shrink-0">
            <ChartBar weight="fill" className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border/70 space-y-2">
          <div className="flex justify-between text-xs text-text-tertiary">
            <span>Monthly Quota</span>
            <span className="font-semibold text-text-secondary">{isLoading ? "—" : `${usagePercent}%`}</span>
          </div>
          <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 dark:bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${isLoading ? 0 : usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Average Performance */}
      <div className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-brand-200 dark:hover:border-brand-500/30 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              Avg Performance
            </p>
            <div className={`text-3xl sm:text-4xl font-bold font-mono tracking-tight ${getScoreTextColor(stats.avgPerformance)}`}>
              {isLoading ? (
                <div className="h-9 w-14 rounded-lg bg-surface-2 animate-pulse my-1" />
              ) : (
                stats.avgPerformance != null ? Math.round(Number(stats.avgPerformance)) : "—"
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-score-good/10 text-score-good border border-score-good/20 flex items-center justify-center shrink-0">
            <Pulse weight="bold" className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border/70 flex items-center text-xs">
          {isLoading ? (
            <div className="h-4 w-32 rounded bg-surface-2 animate-pulse" />
          ) : stats.performanceDiff != null && stats.performanceDiff !== 0 ? (
            stats.performanceDiff > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-score-good font-semibold text-xs">
                <TrendUp weight="bold" className="h-3.5 w-3.5" />
                +{Number(stats.performanceDiff) % 1 === 0 ? stats.performanceDiff : Number(stats.performanceDiff).toFixed(1)} pts vs earlier
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-score-poor font-semibold text-xs">
                <TrendDown weight="bold" className="h-3.5 w-3.5" />
                {Number(stats.performanceDiff) % 1 === 0 ? stats.performanceDiff : Number(stats.performanceDiff).toFixed(1)} pts vs earlier
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1.5 text-text-tertiary">
              <Minus weight="bold" className="h-3.5 w-3.5" />
              Stable baseline
            </span>
          )}
        </div>
      </div>

      {/* 3. Active Monitored Domains */}
      <div className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-brand-200 dark:hover:border-brand-500/30 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              Active Domains
            </p>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-text-primary tracking-tight">
              {isLoading ? (
                <div className="h-9 w-12 rounded-lg bg-surface-2 animate-pulse my-1" />
              ) : (
                stats.activeSites
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center shrink-0">
            <Globe weight="bold" className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border/70 flex items-center text-xs text-text-tertiary">
          {isLoading ? (
            <div className="h-4 w-28 rounded bg-surface-2 animate-pulse" />
          ) : (
            <span>Multi-environment ready</span>
          )}
        </div>
      </div>

      {/* 4. Avg Page Load Time */}
      <div className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-brand-200 dark:hover:border-brand-500/30 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              Avg Load Time
            </p>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-text-primary tracking-tight">
              {isLoading ? (
                <div className="h-9 w-16 rounded-lg bg-surface-2 animate-pulse my-1" />
              ) : stats.avgLoadTime != null ? (
                `${(Number(stats.avgLoadTime) / 1000).toFixed(1)}s`
              ) : (
                "—"
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center shrink-0">
            <Clock weight="bold" className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border/70 flex items-center text-xs">
          {isLoading ? (
            <div className="h-4 w-32 rounded bg-surface-2 animate-pulse" />
          ) : stats.loadTimeDiff != null && stats.loadTimeDiff !== 0 ? (
            stats.loadTimeDiff < 0 ? (
              <span className="inline-flex items-center gap-1.5 text-score-good font-semibold text-xs">
                <TrendUp weight="bold" className="h-3.5 w-3.5" />
                {Math.abs(Number(stats.loadTimeDiff))}ms faster
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-score-poor font-semibold text-xs">
                <TrendDown weight="bold" className="h-3.5 w-3.5" />
                +{Math.abs(Number(stats.loadTimeDiff))}ms slower
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1.5 text-text-tertiary">
              <Minus weight="bold" className="h-3.5 w-3.5" />
              Lighthouse simulated LCP
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsOverviewCards;

