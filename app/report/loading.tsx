import React from "react";

export default function ReportLoading() {
  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-[#e3e8ee] p-7 space-y-4 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="h-4 w-32 rounded bg-[#f1f5f9] animate-pulse" />
          <div className="h-8 w-80 rounded bg-[#f1f5f9] animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-24 rounded bg-[#f1f5f9] animate-pulse" />
            <div className="h-6 w-32 rounded bg-[#f1f5f9] animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Score Ring Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#e3e8ee] rounded-xl p-6 h-56 flex flex-col items-center justify-center space-y-4 shadow-xs"
            >
              <div className="h-28 w-28 rounded-full border-4 border-[#f1f5f9] animate-pulse" />
              <div className="h-4 w-24 rounded bg-[#f1f5f9] animate-pulse" />
            </div>
          ))}
        </div>

        {/* Vitals Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#e3e8ee] rounded-xl p-5 h-36 space-y-3 shadow-xs"
            >
              <div className="flex justify-between">
                <div className="h-4 w-20 rounded bg-[#f1f5f9] animate-pulse" />
                <div className="h-4 w-12 rounded bg-[#f1f5f9] animate-pulse" />
              </div>
              <div className="h-8 w-24 rounded bg-[#f1f5f9] animate-pulse" />
              <div className="h-2 w-full rounded-full bg-[#f1f5f9] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
