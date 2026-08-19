"use client";

import {
  BarChart3,
  Clock,
  Globe,
  TrendingDown,
  TrendingUp,
  Minus,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import useSWR from "swr";
import { DashboardStats } from "@/app/utils/actions";
import { getScoreColor } from "@/data";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StatsOverviewCardsProps {
  initialStats?: DashboardStats | null;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 1. Tests This Month */}
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tests This Month</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {stats.testsThisMonth}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                of {stats.testsLimit} free quota
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <Progress value={usagePercent} className="mt-4 h-2 bg-slate-100" />
        </CardContent>
      </Card>

      {/* 2. Average Performance */}
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Performance</p>
              <p className={`text-3xl font-extrabold mt-1 ${getScoreColor(stats.avgPerformance)}`}>
                {stats.avgPerformance != null ? stats.avgPerformance : "—"}
              </p>
              <div className="flex items-center mt-1 text-xs">
                {stats.performanceDiff != null && stats.performanceDiff !== 0 ? (
                  stats.performanceDiff > 0 ? (
                    <span className="flex items-center text-emerald-600 font-medium">
                      <TrendingUp className="h-3.5 w-3.5 mr-1" />
                      +{stats.performanceDiff} pts vs earlier
                    </span>
                  ) : (
                    <span className="flex items-center text-rose-600 font-medium">
                      <TrendingDown className="h-3.5 w-3.5 mr-1" />
                      {stats.performanceDiff} pts vs earlier
                    </span>
                  )
                ) : (
                  <span className="flex items-center text-slate-400">
                    <Minus className="h-3.5 w-3.5 mr-1" />
                    {stats.avgPerformance != null ? "Baseline score" : "No completed audits"}
                  </span>
                )}
              </div>
            </div>
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Active Sites */}
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Domains</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {stats.activeSites}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {stats.activeSites === 1 ? "1 domain tested" : `${stats.activeSites} unique domains`}
              </p>
            </div>
            <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
              <Globe className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Average Load Time (LCP) */}
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Load Time (LCP)</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {stats.avgLoadTime != null ? `${stats.avgLoadTime}s` : "—"}
              </p>
              <div className="flex items-center mt-1 text-xs">
                {stats.avgLoadTime != null ? (
                  stats.avgLoadTime <= 2.5 ? (
                    <span className="flex items-center text-emerald-600 font-medium">
                      <TrendingDown className="h-3.5 w-3.5 mr-1" />
                      Healthy (&lt;2.5s target)
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-600 font-medium">
                      <TrendingUp className="h-3.5 w-3.5 mr-1" />
                      Needs optimization
                    </span>
                  )
                ) : (
                  <span className="flex items-center text-slate-400">
                    <Minus className="h-3.5 w-3.5 mr-1" />
                    Target: &lt;2.5s
                  </span>
                )}
              </div>
            </div>
            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverviewCards;
