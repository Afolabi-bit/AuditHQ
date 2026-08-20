"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TrendingUp,
  Gauge,
  Layers,
} from "lucide-react";
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

  const lcp = stats.coreWebVitals.lcp;
  const tbt = stats.coreWebVitals.tbt;
  const cls = stats.coreWebVitals.cls;

  return (
    <Tabs defaultValue="recent" className="space-y-8">
      {/* Tab Navigation Pill Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <TabsList className="bg-surface-1 p-1 rounded-xl border border-border h-11 self-start">
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-500 data-[state=active]:shadow-xs px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all font-sans cursor-pointer text-text-secondary hover:text-text-primary"
          >
            Recent Audits
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-500 data-[state=active]:shadow-xs px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all font-sans cursor-pointer text-text-secondary hover:text-text-primary"
          >
            Performance Analytics
          </TabsTrigger>
        </TabsList>

        <span className="inline-flex items-center gap-2 text-xs text-text-tertiary font-mono">
          <span className="w-2 h-2 rounded-full bg-score-good animate-pulse" />
          Live Telemetry Feed Active
        </span>
      </div>

      {/* ── Tab 1: Recent Tests ────────────────────────────────────────────── */}
      <TabsContent value="recent" className="space-y-5 pt-1">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary font-sans">
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
        <div className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-8 shadow-xs hover:border-brand-200 transition-all space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2.5 font-sans">
                <TrendingUp className="h-5 w-5 text-brand-500" />
                Performance Score Trajectory
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                Sequential score distribution and variation tracking across recent audit executions
              </p>
            </div>

            {stats.avgPerformance != null && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-brand-50 text-brand-500 border border-brand-200 self-start sm:self-auto shadow-2xs">
                Fleet Average: {stats.avgPerformance}/100
              </span>
            )}
          </div>

          <PerformanceTrajectoryChart
            data={stats.performanceTrends}
            avgScore={stats.avgPerformance}
          />
        </div>

        {/* Core Web Vitals & Optimization Priorities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Core Web Vitals Means */}
          <div className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-text-primary font-sans flex items-center gap-2.5">
                <Gauge className="h-5 w-5 text-score-good" />
                Core Web Vitals Aggregates
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                Mean user experience metrics across all audited endpoints
              </p>
            </div>

            <div className="space-y-6">
              {/* LCP */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-text-primary font-sans">
                      Largest Contentful Paint (LCP)
                    </span>
                    <p className="text-[11px] text-text-tertiary">Main viewport paint speed</p>
                  </div>
                  <span
                    className={`font-mono font-bold text-sm ${
                      isLoading || lcp == null
                        ? "text-text-tertiary"
                        : lcp <= 2.5
                        ? "text-score-good"
                        : lcp <= 4.0
                        ? "text-score-warn"
                        : "text-score-poor"
                    }`}
                  >
                    {isLoading ? (
                      <span className="inline-block h-4 w-12 rounded bg-surface-2 animate-pulse" />
                    ) : lcp != null ? (
                      `${Number(lcp).toFixed(1)}s`
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLoading || lcp == null
                        ? "bg-surface-3"
                        : lcp <= 2.5
                        ? "bg-score-good"
                        : lcp <= 4.0
                        ? "bg-score-warn"
                        : "bg-score-poor"
                    }`}
                    style={{
                      width: `${
                        isLoading || lcp == null
                          ? 0
                          : Math.max(10, Math.min(100, Math.round((2.5 / Math.max(0.5, lcp)) * 100)))
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-text-tertiary">
                  <span>{isLoading ? "Loading…" : lcp == null ? "No data" : lcp <= 2.5 ? "Good" : lcp <= 4.0 ? "Needs Improvement" : "Poor"}</span>
                  <span>Target: ≤ 2.5s</span>
                </div>
              </div>

              {/* TBT */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-text-primary font-sans">
                      Total Blocking Time (TBT)
                    </span>
                    <p className="text-[11px] text-text-tertiary">Main thread input delay</p>
                  </div>
                  <span
                    className={`font-mono font-bold text-sm ${
                      isLoading || tbt == null
                        ? "text-text-tertiary"
                        : tbt <= 200
                        ? "text-score-good"
                        : tbt <= 600
                        ? "text-score-warn"
                        : "text-score-poor"
                    }`}
                  >
                    {isLoading ? (
                      <span className="inline-block h-4 w-12 rounded bg-surface-2 animate-pulse" />
                    ) : tbt != null ? (
                      `${Math.round(Number(tbt))}ms`
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLoading || tbt == null
                        ? "bg-surface-3"
                        : tbt <= 200
                        ? "bg-score-good"
                        : tbt <= 600
                        ? "bg-score-warn"
                        : "bg-score-poor"
                    }`}
                    style={{
                      width: `${
                        isLoading || tbt == null
                          ? 0
                          : Math.max(10, Math.min(100, Math.round((200 / Math.max(50, tbt)) * 100)))
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-text-tertiary">
                  <span>{isLoading ? "Loading…" : tbt == null ? "No data" : tbt <= 200 ? "Good" : tbt <= 600 ? "Needs Improvement" : "Poor"}</span>
                  <span>Target: ≤ 200ms</span>
                </div>
              </div>

              {/* CLS */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-text-primary font-sans">
                      Cumulative Layout Shift (CLS)
                    </span>
                    <p className="text-[11px] text-text-tertiary">Visual layout stability</p>
                  </div>
                  <span
                    className={`font-mono font-bold text-sm ${
                      isLoading || cls == null
                        ? "text-text-tertiary"
                        : cls <= 0.1
                        ? "text-score-good"
                        : cls <= 0.25
                        ? "text-score-warn"
                        : "text-score-poor"
                    }`}
                  >
                    {isLoading ? (
                      <span className="inline-block h-4 w-12 rounded bg-surface-2 animate-pulse" />
                    ) : cls != null ? (
                      Number(cls).toFixed(3)
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLoading || cls == null
                        ? "bg-surface-3"
                        : cls <= 0.1
                        ? "bg-score-good"
                        : cls <= 0.25
                        ? "bg-score-warn"
                        : "bg-score-poor"
                    }`}
                    style={{
                      width: `${
                        isLoading || cls == null
                          ? 0
                          : Math.max(10, Math.min(100, Math.round((0.1 / Math.max(0.01, cls)) * 100)))
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-text-tertiary">
                  <span>{isLoading ? "Loading…" : cls == null ? "No data" : cls <= 0.1 ? "Good" : cls <= 0.25 ? "Needs Improvement" : "Poor"}</span>
                  <span>Target: ≤ 0.100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Optimization Priorities */}
          <div className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-text-primary font-sans flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-brand-500" />
                Strategic Recommendations
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                Prioritized interventions based on collective audit telemetry
              </p>
            </div>

            <div className="space-y-4">
              {stats.recommendations && stats.recommendations.length > 0 ? (
                stats.recommendations.slice(0, 3).map((rec, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-surface-1 border border-border space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-brand-50 text-brand-500 border border-brand-200">
                        Priority {i + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-text-primary font-sans">
                        {rec.title}
                      </h4>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-xs text-text-tertiary font-mono space-y-2">
                  <div className="h-10 w-10 rounded-full bg-surface-1 border border-border flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <p>No systemic performance regressions detected.</p>
                  <p className="text-[11px]">Run more audits to generate strategic diagnostic insights.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsAndRecentTabs;
