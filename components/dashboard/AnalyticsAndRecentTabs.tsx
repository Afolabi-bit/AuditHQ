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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AnalyticsAndRecentTabsProps {
  user: KindeUser;
  initialStats?: DashboardStats | null;
}

const AnalyticsAndRecentTabs: React.FC<AnalyticsAndRecentTabsProps> = ({
  user,
  initialStats,
}) => {
  const { data, isLoading: swrLoading } = useSWR<{ stats: DashboardStats }>(
    "/api/dashboard/stats",
    fetcher,
    {
      fallbackData: initialStats ? { stats: initialStats } : undefined,
      revalidateOnFocus: true,
    },
  );

  const isLoading = !data && !initialStats && swrLoading;
  const stats = data?.stats ||
    initialStats || {
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
    <Tabs defaultValue="recent" className="space-y-6 mt-8">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <TabsList className="bg-surface-1 p-1 rounded-lg border border-border h-10">
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-500 data-[state=active]:shadow-xs px-4 py-1.5 rounded-md text-xs font-semibold transition-all font-sans cursor-pointer text-text-secondary hover:text-text-primary"
          >
            Recent Audits
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-500 data-[state=active]:shadow-xs px-4 py-1.5 rounded-md text-xs font-semibold transition-all font-sans cursor-pointer text-text-secondary hover:text-text-primary"
          >
            Performance Analytics
          </TabsTrigger>
        </TabsList>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-text-tertiary font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-score-good animate-pulse" />
          Live Telemetry Active
        </span>
      </div>

      {/* ── Tab 1: Recent Tests ────────────────────────────────────────────── */}
      <TabsContent value="recent" className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-text-primary font-sans">
              Recent Audits
            </h2>
            <p className="text-xs text-text-secondary">
              Chronological feed of automated Lighthouse test runs
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          <RecentTests user={user} />
        </div>
      </TabsContent>

      {/* ── Tab 2: Analytics ──────────────────────────────────────────────── */}
      <TabsContent value="analytics" className="space-y-6 pt-1">
        {/* Performance Score Trend Timeline */}
        <div className="bg-surface-0 border border-border rounded-xl p-6 shadow-xs hover:border-brand-200 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2 font-sans">
                <TrendingUp className="h-4 w-4 text-brand-500" />
                Performance Score Trajectory
              </h3>
              <p className="text-xs text-text-secondary">
                Sequential score distribution and variation tracking across recent audit executions
              </p>
            </div>

            {stats.avgPerformance != null && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-50 text-brand-500 border border-brand-200">
                Avg: {stats.avgPerformance}/100
              </span>
            )}
          </div>

          <PerformanceTrajectoryChart
            data={stats.performanceTrends}
            avgScore={stats.avgPerformance}
          />
        </div>

        {/* Core Web Vitals & Optimization Priorities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Web Vitals Means */}
          <div className="bg-surface-0 border border-border rounded-xl p-6 shadow-xs space-y-6">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-text-primary font-sans flex items-center gap-2">
                <Gauge className="h-4 w-4 text-score-good" />
                Core Web Vitals Aggregates
              </h3>
              <p className="text-xs text-text-secondary">
                Mean user experience metrics across all audited endpoints
              </p>
            </div>

            <div className="space-y-5">
              {/* LCP */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-text-primary font-sans">
                      Largest Contentful Paint (LCP)
                    </span>
                    <p className="text-[11px] text-text-tertiary">Main content rendering speed</p>
                  </div>
                  <span
                    className={`font-mono font-bold ${
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
                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
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
                <div className="flex justify-between text-[10px] font-mono text-text-tertiary">
                  <span>{isLoading ? "Loading…" : lcp == null ? "No data" : lcp <= 2.5 ? "Good" : lcp <= 4.0 ? "Needs Improvement" : "Poor"}</span>
                  <span>Target: ≤ 2.5s</span>
                </div>
              </div>

              {/* TBT */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-text-primary font-sans">
                      Total Blocking Time (TBT)
                    </span>
                    <p className="text-[11px] text-text-tertiary">Main thread responsiveness</p>
                  </div>
                  <span
                    className={`font-mono font-bold ${
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
                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
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
                <div className="flex justify-between text-[10px] font-mono text-text-tertiary">
                  <span>{isLoading ? "Loading…" : tbt == null ? "No data" : tbt <= 200 ? "Good" : tbt <= 600 ? "Needs Improvement" : "Poor"}</span>
                  <span>Target: ≤ 200ms</span>
                </div>
              </div>

              {/* CLS */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-text-primary font-sans">
                      Cumulative Layout Shift (CLS)
                    </span>
                    <p className="text-[11px] text-text-tertiary">Visual stability index</p>
                  </div>
                  <span
                    className={`font-mono font-bold ${
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
                      Number(cls).toFixed(2)
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cls == null
                        ? "bg-surface-3"
                        : cls <= 0.1
                        ? "bg-score-good"
                        : cls <= 0.25
                        ? "bg-score-warn"
                        : "bg-score-poor"
                    }`}
                    style={{
                      width: `${
                        cls == null
                          ? 0
                          : Math.max(10, Math.min(100, Math.round((0.1 / Math.max(0.01, cls)) * 100)))
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-text-tertiary">
                  <span>{cls == null ? "No data" : cls <= 0.1 ? "Good" : cls <= 0.25 ? "Needs Improvement" : "Poor"}</span>
                  <span>Target: ≤ 0.1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Priorities */}
          <div className="bg-surface-0 border border-border rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-text-primary font-sans flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-500" />
                Optimization Priorities
              </h3>
              <p className="text-xs text-text-secondary">
                Actionable recommendations synthesized from aggregated audit passes
              </p>
            </div>

            <div className="space-y-3 flex-1">
              {stats.recommendations.map((rec, idx) => {
                if (rec.type === "warning") {
                  return (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3.5 bg-[#fff8e5] border border-[#ffe380] dark:bg-[#b76e00]/15 dark:border-[#b76e00]/30 rounded-lg"
                    >
                      <AlertCircle className="h-4 w-4 text-score-warn shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-score-warn font-sans">
                          {rec.title}
                        </p>
                        <p className="text-[11px] text-text-tertiary mt-0.5 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  );
                }

                if (rec.type === "success") {
                  return (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3.5 bg-[#e3fcf7] border border-[#abf5d1] dark:bg-[#00875a]/15 dark:border-[#00875a]/30 rounded-lg"
                    >
                      <CheckCircle2 className="h-4 w-4 text-score-good shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-score-good font-sans">
                          {rec.title}
                        </p>
                        <p className="text-[11px] text-text-tertiary mt-0.5 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 bg-brand-50 border border-brand-200 rounded-lg"
                  >
                    <Info className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-brand-500 font-sans">
                        {rec.title}
                      </p>
                      <p className="text-[11px] text-text-tertiary mt-0.5 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsAndRecentTabs;
