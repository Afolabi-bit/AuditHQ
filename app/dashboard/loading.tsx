import React from "react";

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in-50 duration-150">
      {/* 1. Welcome Header Skeleton */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="h-7 w-64 rounded-md bg-[#e3e8ee]/80 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-md bg-[#e3e8ee]/50 animate-pulse" />
        </div>
        <div className="h-7 w-44 rounded-full bg-white border border-[#e3e8ee] shadow-xs flex items-center px-3">
          <div className="h-2 w-2 rounded-full bg-[#e3e8ee] animate-pulse mr-2" />
          <div className="h-3 w-28 rounded bg-[#f1f5f9] animate-pulse" />
        </div>
      </div>

      {/* 2. 4 Stats Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-white border border-[#e3e8ee] p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] flex flex-col justify-between h-[138px]"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-[#f1f5f9] animate-pulse" />
                <div className="h-8 w-20 rounded-md bg-[#f1f5f9] animate-pulse" />
              </div>
              <div className="h-10 w-10 rounded-lg bg-[#f0f2ff] border border-[#c7cefe]/50 animate-pulse" />
            </div>
            <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
              <div className="h-3 w-32 rounded bg-[#f1f5f9] animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. New Test Command Bar Skeleton */}
      <div className="rounded-xl bg-white border border-[#e3e8ee] p-6 shadow-[0_1px_3px_rgba(50,50,93,0.08)] mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-4 w-44 rounded bg-[#f1f5f9] animate-pulse" />
            <div className="h-3 w-72 rounded bg-[#f1f5f9] animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="h-10 flex-1 w-full rounded-lg bg-[#f8fafc] border border-[#e3e8ee] animate-pulse" />
          <div className="h-10 w-32 rounded-lg bg-[#635bff]/20 animate-pulse shrink-0" />
        </div>
      </div>

      {/* 4. Tabs & Recent Tests Skeleton */}
      <div className="space-y-6 mt-8">
        <div className="flex items-center justify-between border-b border-[#e3e8ee] pb-3">
          <div className="h-9 w-48 rounded-lg bg-[#f1f5f9] border border-[#e3e8ee] animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-white border border-[#e3e8ee] p-4.5 flex items-center justify-between shadow-[0_1px_3px_rgba(50,50,93,0.08)] h-[84px]"
            >
              <div className="space-y-2 flex-1 max-w-md">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-52 rounded bg-[#f1f5f9] animate-pulse" />
                  <div className="h-4 w-16 rounded-full bg-[#f1f5f9] animate-pulse" />
                </div>
                <div className="h-3 w-32 rounded bg-[#f1f5f9] animate-pulse" />
              </div>
              <div className="h-12 w-16 rounded-xl bg-[#f1f5f9] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
