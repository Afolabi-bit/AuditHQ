import React from "react";

export default function ReportLoading() {
  return (
    <div className="min-h-screen bg-surface-1">
      {/* Header Skeleton */}
      <div className="bg-surface-0 border-b border-surface-3 py-6 px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-4 w-32 rounded bg-surface-2 animate-pulse" />
          <div className="h-8 w-96 rounded bg-surface-2 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-5 w-24 rounded bg-surface-2 animate-pulse" />
            <div className="h-5 w-32 rounded bg-surface-2 animate-pulse" />
            <div className="h-5 w-40 rounded bg-surface-2 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Category Gauges Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-surface-0 border border-surface-3 rounded-3xl p-6 h-56 flex flex-col justify-between items-center"
            >
              <div className="flex justify-between w-full">
                <div className="h-4 w-24 rounded bg-surface-2 animate-pulse" />
                <div className="h-8 w-8 rounded bg-surface-2 animate-pulse" />
              </div>
              <div className="h-28 w-28 rounded-full border-4 border-surface-2 animate-pulse" />
              <div className="h-4 w-20 rounded bg-surface-2 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Core Web Vitals Skeleton */}
        <div className="bg-surface-0 border border-surface-3 rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <div className="h-5 w-48 rounded bg-surface-2 animate-pulse" />
            <div className="h-4 w-72 rounded bg-surface-2 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-28 border border-surface-3 rounded-xl p-4 bg-surface-1/30 space-y-3"
              >
                <div className="h-4 w-24 rounded bg-surface-2 animate-pulse" />
                <div className="h-6 w-16 rounded bg-surface-2 animate-pulse" />
                <div className="h-2.5 w-full rounded bg-surface-2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
