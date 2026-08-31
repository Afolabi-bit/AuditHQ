"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TrendUp } from "@phosphor-icons/react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import RecentTests from "./RecentTests";
import { PerformanceTrajectoryChart } from "./PerformanceTrajectoryChart";
import useSWR from "swr";
import { DashboardStats } from "@/app/utils/actions";
import { useAppStore } from "@/lib/store/useAppStore";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AnalyticsAndRecentTabsProps {
  user: KindeUser;
  initialStats?: DashboardStats | null;
}

const AnalyticsAndRecentTabs: React.FC<AnalyticsAndRecentTabsProps> = ({
  user,
  initialStats,
}) => {
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
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 120_000,
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

  const stats = resolvedStats || {
    testsThisMonth: 0,
    testsLimit: 100,
    activeSites: 0,
    avgPerformance: null,
    performanceDiff: null,
    avgLoadTime: null,
    loadTimeDiff: null,
    performanceTrends: [],
    coreWebVitals: {
      lcp: null,
      tbt: null,
      cls: null,
    },
    recommendations: [],
  };

  const cwv = stats.coreWebVitals || { lcp: null, tbt: null, cls: null };

  return (
    <Tabs defaultValue="recent" className="space-y-8">
      {/* Tab Navigation Pill Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <TabsList className="bg-surface-1 p-1 rounded-xl border border-border h-11 self-start">
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-600 dark:data-[state=active]:text-brand-300 data-[state=active]:shadow-xs px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer text-text-secondary hover:text-text-primary"
          >
            Recent Audits
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-600 dark:data-[state=active]:text-brand-300 data-[state=active]:shadow-xs px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer text-text-secondary hover:text-text-primary"
          >
            Performance Analytics
          </TabsTrigger>
        </TabsList>
      </div>

      {/* ── Tab 1: Recent Tests ────────────────────────────────────────────── */}
      <TabsContent value="recent" className="space-y-5 pt-1">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary">
            Audit Activity & History
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Chronological feed of automated and user-triggered Lighthouse cloud audit runs
          </p>
        </div>

        <RecentTests user={user} />
      </TabsContent>

      {/* ── Tab 2: Analytics ──────────────────────────────────────────────── */}
      <TabsContent value="analytics" className="space-y-8 pt-1">
        {/* Performance Score Trend Timeline */}
        <div className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-8 shadow-xs hover:border-brand-200 dark:hover:border-brand-500/30 transition-all space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2.5">
                <TrendUp weight="bold" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                Performance Score Trajectory
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                Sequential score distribution and variation tracking across recent audit executions
              </p>
            </div>

            {stats.avgPerformance != null && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 self-start sm:self-auto shadow-2xs">
                Fleet Average: {stats.avgPerformance}/100
              </span>
            )}
          </div>


          <PerformanceTrajectoryChart
            data={(stats.performanceTrends || []).map((t) => ({
              id: t.id,
              date: t.date,
              time: t.time,
              url: t.url,
              device: t.device,
              score: t.score,
            }))}
            avgScore={stats.avgPerformance}
          />
        </div>

        {/* Aggregate CWV Metric Insights */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-text-primary font-sans">
              Aggregated Core Web Vitals
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              Weighted averages across all audited domains against Google threshold targets
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* LCP Metric */}
            <div className="bg-surface-0 border border-border rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">
                  Avg Largest Contentful Paint (LCP)
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">
                  Target ≤ 2.5s
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-bold font-mono ${
                    cwv.lcp == null
                      ? "text-text-tertiary"
                      : cwv.lcp <= 2.5
                      ? "text-score-good"
                      : cwv.lcp <= 4.0
                      ? "text-score-warn"
                      : "text-score-poor"
                  }`}
                >
                  {cwv.lcp != null ? `${cwv.lcp}s` : "—"}
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary">
                {cwv.lcp == null
                  ? "No telemetry recorded"
                  : cwv.lcp <= 2.5
                  ? "✓ Fast viewport visual"
                  : cwv.lcp <= 4.0
                  ? "⚠ Needs improvement"
                  : "✗ Slow visual render"}
              </p>
            </div>

            {/* TBT Metric */}
            <div className="bg-surface-0 border border-border rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">
                  Avg Total Blocking Time (TBT)
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">
                  Target ≤ 200ms
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-bold font-mono ${
                    cwv.tbt == null
                      ? "text-text-tertiary"
                      : cwv.tbt <= 200
                      ? "text-score-good"
                      : cwv.tbt <= 600
                      ? "text-score-warn"
                      : "text-score-poor"
                  }`}
                >
                  {cwv.tbt != null ? `${Math.round(cwv.tbt)}ms` : "—"}
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary">
                {cwv.tbt == null
                  ? "No telemetry recorded"
                  : cwv.tbt <= 200
                  ? "✓ Main thread responsive"
                  : cwv.tbt <= 600
                  ? "⚠ High script latency"
                  : "✗ Heavy execution blocks"}
              </p>
            </div>

            {/* CLS Metric */}
            <div className="bg-surface-0 border border-border rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">
                  Avg Cumulative Layout Shift (CLS)
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">
                  Target ≤ 0.1
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-bold font-mono ${
                    cwv.cls == null
                      ? "text-text-tertiary"
                      : cwv.cls <= 0.1
                      ? "text-score-good"
                      : cwv.cls <= 0.25
                      ? "text-score-warn"
                      : "text-score-poor"
                  }`}
                >
                  {cwv.cls != null ? cwv.cls.toFixed(2) : "—"}
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary">
                {cwv.cls == null
                  ? "No telemetry recorded"
                  : cwv.cls <= 0.1
                  ? "✓ Visual elements stable"
                  : cwv.cls <= 0.25
                  ? "⚠ Minor layout shifting"
                  : "✗ Severe visual shifts"}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsAndRecentTabs;
