"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Activity,
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
  const { data } = useSWR<{ stats: DashboardStats }>(
    "/api/dashboard/stats",
    fetcher,
    {
      fallbackData: initialStats ? { stats: initialStats } : undefined,
      revalidateOnFocus: true,
    },
  );

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
      <div className="flex items-center justify-between border-b border-[#e3e8ee] pb-3">
        <TabsList className="bg-[#f1f5f9] p-1 rounded-lg border border-[#e3e8ee] h-10">
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-xs px-4 py-1.5 rounded-md text-xs font-semibold transition-all font-sans cursor-pointer"
          >
            Recent Audits
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-xs px-4 py-1.5 rounded-md text-xs font-semibold transition-all font-sans cursor-pointer"
          >
            Performance Analytics
          </TabsTrigger>
        </TabsList>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#8898aa] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00875a] animate-pulse" />
          Live Polling Active
        </span>
      </div>

      {/* ── Tab 1: Recent Tests ────────────────────────────────────────────── */}
      <TabsContent value="recent" className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-[#0a2540] font-sans">
              Recent Audits
            </h2>
            <p className="text-xs text-[#425466]">
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
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 shadow-[0_1px_3px_rgba(50,50,93,0.08)] hover:border-[#c7cefe] transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-[#0a2540] flex items-center gap-2 font-sans">
                <TrendingUp className="h-4 w-4 text-[#635bff]" />
                Performance Score Trajectory
              </h3>
              <p className="text-xs text-[#425466]">
                Sequential score distribution and variation tracking across recent audit executions
              </p>
            </div>

            {stats.avgPerformance != null && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#f0f2ff] text-[#635bff] border border-[#c7cefe]">
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
          <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 shadow-[0_1px_3px_rgba(50,50,93,0.08)] space-y-6">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-[#0a2540] font-sans flex items-center gap-2">
                <Gauge className="h-4 w-4 text-[#00875a]" />
                Core Web Vitals Aggregates
              </h3>
              <p className="text-xs text-[#425466]">
                Mean user experience metrics across all audited endpoints
              </p>
            </div>

            <div className="space-y-5">
              {/* LCP */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-[#0a2540] font-sans">
                      Largest Contentful Paint (LCP)
                    </span>
                    <p className="text-[11px] text-[#8898aa]">Main content rendering speed</p>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      lcp == null
                        ? "text-[#8898aa]"
                        : lcp <= 2.5
                        ? "text-[#00875a]"
                        : lcp <= 4.0
                        ? "text-[#b76e00]"
                        : "text-[#de350b]"
                    }`}
                  >
                    {lcp != null ? `${Number(lcp).toFixed(1)}s` : "—"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      lcp == null
                        ? "bg-[#e3e8ee]"
                        : lcp <= 2.5
                        ? "bg-[#00875a]"
                        : lcp <= 4.0
                        ? "bg-[#b76e00]"
                        : "bg-[#de350b]"
                    }`}
                    style={{
                      width: `${
                        lcp == null
                          ? 0
                          : Math.max(10, Math.min(100, Math.round((2.5 / Math.max(0.5, lcp)) * 100)))
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#8898aa]">
                  <span>{lcp == null ? "No data" : lcp <= 2.5 ? "Good" : lcp <= 4.0 ? "Needs Improvement" : "Poor"}</span>
                  <span>Target: ≤ 2.5s</span>
                </div>
              </div>

              {/* TBT */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-[#0a2540] font-sans">
                      Total Blocking Time (TBT)
                    </span>
                    <p className="text-[11px] text-[#8898aa]">Main thread responsiveness</p>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      tbt == null
                        ? "text-[#8898aa]"
                        : tbt <= 200
                        ? "text-[#00875a]"
                        : tbt <= 600
                        ? "text-[#b76e00]"
                        : "text-[#de350b]"
                    }`}
                  >
                    {tbt != null ? `${Math.round(Number(tbt))}ms` : "—"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      tbt == null
                        ? "bg-[#e3e8ee]"
                        : tbt <= 200
                        ? "bg-[#00875a]"
                        : tbt <= 600
                        ? "bg-[#b76e00]"
                        : "bg-[#de350b]"
                    }`}
                    style={{
                      width: `${
                        tbt == null
                          ? 0
                          : Math.max(10, Math.min(100, Math.round((200 / Math.max(50, tbt)) * 100)))
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#8898aa]">
                  <span>{tbt == null ? "No data" : tbt <= 200 ? "Good" : tbt <= 600 ? "Needs Improvement" : "Poor"}</span>
                  <span>Target: ≤ 200ms</span>
                </div>
              </div>

              {/* CLS */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-[#0a2540] font-sans">
                      Cumulative Layout Shift (CLS)
                    </span>
                    <p className="text-[11px] text-[#8898aa]">Visual stability index</p>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      cls == null
                        ? "text-[#8898aa]"
                        : cls <= 0.1
                        ? "text-[#00875a]"
                        : cls <= 0.25
                        ? "text-[#b76e00]"
                        : "text-[#de350b]"
                    }`}
                  >
                    {cls != null ? Number(cls).toFixed(2) : "—"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cls == null
                        ? "bg-[#e3e8ee]"
                        : cls <= 0.1
                        ? "bg-[#00875a]"
                        : cls <= 0.25
                        ? "bg-[#b76e00]"
                        : "bg-[#de350b]"
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
                <div className="flex justify-between text-[10px] font-mono text-[#8898aa]">
                  <span>{cls == null ? "No data" : cls <= 0.1 ? "Good" : cls <= 0.25 ? "Needs Improvement" : "Poor"}</span>
                  <span>Target: ≤ 0.1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Priorities */}
          <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 shadow-[0_1px_3px_rgba(50,50,93,0.08)] flex flex-col justify-between space-y-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-[#0a2540] font-sans flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#635bff]" />
                Optimization Priorities
              </h3>
              <p className="text-xs text-[#425466]">
                Actionable recommendations synthesized from aggregated audit passes
              </p>
            </div>

            <div className="space-y-3 flex-1">
              {stats.recommendations.map((rec, idx) => {
                if (rec.type === "warning") {
                  return (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3.5 bg-[#fff8e5] border border-[#ffe380] rounded-lg"
                    >
                      <AlertCircle className="h-4 w-4 text-[#b76e00] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-[#b76e00] font-sans">
                          {rec.title}
                        </p>
                        <p className="text-[11px] text-[#8898aa] mt-0.5 leading-relaxed">
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
                      className="flex items-start space-x-3 p-3.5 bg-[#e3fcf7] border border-[#abf5d1] rounded-lg"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#00875a] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-[#00875a] font-sans">
                          {rec.title}
                        </p>
                        <p className="text-[11px] text-[#8898aa] mt-0.5 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 bg-[#f0f2ff] border border-[#c7cefe] rounded-lg"
                  >
                    <Info className="h-4 w-4 text-[#635bff] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#635bff] font-sans">
                        {rec.title}
                      </p>
                      <p className="text-[11px] text-[#8898aa] mt-0.5 leading-relaxed">
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
