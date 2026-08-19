"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import RecentTests from "./RecentTests";
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
      refreshInterval: 10000,
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

  const getScoreBarColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500 hover:bg-emerald-600";
    if (score >= 50) return "bg-amber-500 hover:bg-amber-600";
    return "bg-rose-500 hover:bg-rose-600";
  };

  const lcp = stats.coreWebVitals.lcp;
  const tbt = stats.coreWebVitals.tbt;
  const cls = stats.coreWebVitals.cls;

  return (
    <Tabs defaultValue="recent" className="space-y-6 mt-7">
      <TabsList className="bg-slate-100 p-1 border border-slate-200">
        <TabsTrigger
          value="recent"
          className="data-[state=active]:bg-white data-[state=active]:shadow-xs"
        >
          Recent Tests
        </TabsTrigger>
        <TabsTrigger
          value="analytics"
          className="data-[state=active]:bg-white data-[state=active]:shadow-xs"
        >
          Live Analytics
        </TabsTrigger>
      </TabsList>

      {/* Recent Tests Tab */}
      <TabsContent value="recent" className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recent Performance Audits
            </h2>
            <p className="text-sm text-slate-500">
              Live history of automated Lighthouse tests across your domains
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <RecentTests user={user} />
        </div>
      </TabsContent>

      {/* Analytics Tab */}
      <TabsContent value="analytics" className="space-y-6">
        {/* Performance Trends Card */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Performance Score History
                </CardTitle>
                <CardDescription>
                  Chronological performance trend from your most recent audits
                </CardDescription>
              </div>
              {stats.avgPerformance != null && (
                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Avg: {stats.avgPerformance}/100
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {stats.performanceTrends.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Sparkles className="h-8 w-8 mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  No audit history yet
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Run audits for your websites above to populate live historical
                  tracking and trend lines.
                </p>
              </div>
            ) : (
              <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
                {stats.performanceTrends.map((data, index) => {
                  const heightPercent = Math.max(12, data.score);
                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center group h-full justify-end"
                    >
                      <span className="text-xs font-bold text-slate-700 mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        {data.score}
                      </span>
                      <div
                        className={`w-full max-w-12 rounded-t-lg transition-all duration-300 ${getScoreBarColor(
                          data.score,
                        )} shadow-xs`}
                        style={{ height: `${heightPercent}%` }}
                        title={`Score: ${data.score} on ${data.date}`}
                      />
                      <p className="text-[11px] font-medium text-slate-500 mt-2 truncate w-full text-center">
                        {data.date}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Core Web Vitals & Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Web Vitals Overview */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Core Web Vitals Averages
              </CardTitle>
              <CardDescription>
                Mean user experience metrics across all your tested pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* LCP */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">
                      Largest Contentful Paint (LCP)
                    </span>
                    <p className="text-xs text-slate-500">
                      Main content loading speed
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      lcp == null
                        ? "text-slate-400"
                        : lcp <= 2.5
                          ? "text-emerald-600"
                          : lcp <= 4.0
                            ? "text-amber-600"
                            : "text-rose-600"
                    }`}
                  >
                    {lcp != null ? `${lcp}s` : "—"}
                  </span>
                </div>
                <Progress
                  value={
                    lcp == null
                      ? 0
                      : Math.max(
                          10,
                          Math.min(
                            100,
                            Math.round((2.5 / Math.max(0.5, lcp)) * 75),
                          ),
                        )
                  }
                  className="h-2 bg-slate-100"
                />
                <p className="text-xs text-slate-500 mt-1.5 flex justify-between">
                  <span>
                    {lcp == null
                      ? "No data"
                      : lcp <= 2.5
                        ? "Good"
                        : lcp <= 4.0
                          ? "Needs Improvement"
                          : "Poor"}
                  </span>
                  <span>Target: &le; 2.5s</span>
                </p>
              </div>

              {/* TBT */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">
                      Total Blocking Time (TBT)
                    </span>
                    <p className="text-xs text-slate-500">
                      Main thread responsiveness
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      tbt == null
                        ? "text-slate-400"
                        : tbt <= 200
                          ? "text-emerald-600"
                          : tbt <= 600
                            ? "text-amber-600"
                            : "text-rose-600"
                    }`}
                  >
                    {tbt != null ? `${tbt} ms` : "—"}
                  </span>
                </div>
                <Progress
                  value={
                    tbt == null
                      ? 0
                      : Math.max(
                          10,
                          Math.min(
                            100,
                            Math.round((200 / Math.max(50, tbt)) * 85),
                          ),
                        )
                  }
                  className="h-2 bg-slate-100"
                />
                <p className="text-xs text-slate-500 mt-1.5 flex justify-between">
                  <span>
                    {tbt == null
                      ? "No data"
                      : tbt <= 200
                        ? "Good"
                        : tbt <= 600
                          ? "Needs Improvement"
                          : "Poor"}
                  </span>
                  <span>Target: &le; 200 ms</span>
                </p>
              </div>

              {/* CLS */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">
                      Cumulative Layout Shift (CLS)
                    </span>
                    <p className="text-xs text-slate-500">
                      Visual stability during render
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      cls == null
                        ? "text-slate-400"
                        : cls <= 0.1
                          ? "text-emerald-600"
                          : cls <= 0.25
                            ? "text-amber-600"
                            : "text-rose-600"
                    }`}
                  >
                    {cls != null ? cls : "—"}
                  </span>
                </div>
                <Progress
                  value={
                    cls == null
                      ? 0
                      : Math.max(
                          10,
                          Math.min(
                            100,
                            Math.round((0.1 / Math.max(0.01, cls)) * 80),
                          ),
                        )
                  }
                  className="h-2 bg-slate-100"
                />
                <p className="text-xs text-slate-500 mt-1.5 flex justify-between">
                  <span>
                    {cls == null
                      ? "No data"
                      : cls <= 0.1
                        ? "Good"
                        : cls <= 0.25
                          ? "Needs Improvement"
                          : "Poor"}
                  </span>
                  <span>Target: &le; 0.1</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          <Card className="border-slate-200 shadow-xs flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Actionable Optimization Priorities
              </CardTitle>
              <CardDescription>
                Tailored recommendations derived from your live audit metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 flex-1">
              {stats.recommendations.map((rec, idx) => {
                if (rec.type === "warning") {
                  return (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl"
                    >
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">
                          {rec.title}
                        </p>
                        <p className="text-xs text-amber-700/90 mt-0.5 leading-relaxed">
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
                      className="flex items-start space-x-3 p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">
                          {rec.title}
                        </p>
                        <p className="text-xs text-emerald-700/90 mt-0.5 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl"
                  >
                    <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        {rec.title}
                      </p>
                      <p className="text-xs text-blue-700/90 mt-0.5 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsAndRecentTabs;
