import React from "react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      {/* Skeleton Navbar */}
      <div className="h-15 border-b border-[#e3e8ee] bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#f0f2ff] animate-pulse" />
          <div className="h-5 w-24 rounded bg-[#f1f5f9] animate-pulse" />
        </div>
        <div className="h-8 w-8 rounded-full bg-[#f1f5f9] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-[#f1f5f9] animate-pulse" />
          <div className="h-4 w-72 rounded bg-[#f1f5f9] animate-pulse" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#e3e8ee] rounded-xl p-5 h-28 space-y-4 shadow-xs"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 rounded bg-[#f1f5f9] animate-pulse" />
                <div className="h-8 w-8 rounded-lg bg-[#f1f5f9] animate-pulse" />
              </div>
              <div className="h-6 w-28 rounded bg-[#f1f5f9] animate-pulse" />
            </div>
          ))}
        </div>

        {/* Action Command Bar Skeleton */}
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 h-36 flex items-center justify-between shadow-xs">
          <div className="space-y-3 w-2/3">
            <div className="h-5 w-48 rounded bg-[#f1f5f9] animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-[#f1f5f9] animate-pulse" />
          </div>
          <div className="h-10 w-28 rounded-lg bg-[#f0f2ff] animate-pulse" />
        </div>

        {/* List Skeleton */}
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 space-y-4 shadow-xs">
          <div className="h-5 w-32 rounded bg-[#f1f5f9] animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-lg border border-[#e3e8ee] bg-[#f8fafc] flex items-center justify-between px-4"
              >
                <div className="space-y-2">
                  <div className="h-4 w-64 rounded bg-[#f1f5f9] animate-pulse" />
                  <div className="h-3 w-32 rounded bg-[#f1f5f9] animate-pulse" />
                </div>
                <div className="h-8 w-16 rounded bg-[#f1f5f9] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
