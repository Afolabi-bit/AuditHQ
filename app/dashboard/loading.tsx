import React from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-surface-1">
      {/* Skeleton Navbar */}
      <div className="h-14 border-b border-surface-3 bg-surface-0 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-surface-2 animate-pulse" />
          <div className="h-4 w-24 rounded bg-surface-2 animate-pulse" />
        </div>
        <div className="h-8 w-8 rounded-full bg-surface-2 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-surface-2 animate-pulse" />
          <div className="h-4 w-72 rounded bg-surface-2 animate-pulse" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-0 border border-surface-3 rounded-2xl p-5 h-28 space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 rounded bg-surface-2 animate-pulse" />
                <div className="h-8 w-8 rounded bg-surface-2 animate-pulse" />
              </div>
              <div className="h-6 w-32 rounded bg-surface-2 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Action Command Bar Skeleton */}
        <div className="bg-surface-0 border border-surface-3 rounded-2xl p-6 h-36 flex items-center justify-between">
          <div className="space-y-3 w-2/3">
            <div className="h-5 w-48 rounded bg-surface-2 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-surface-2 animate-pulse" />
          </div>
          <div className="h-10 w-24 rounded-xl bg-surface-2 animate-pulse" />
        </div>

        {/* List Skeleton */}
        <div className="bg-surface-0 border border-surface-3 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-surface-2 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl border border-surface-3 bg-surface-1/40 flex items-center justify-between px-4"
              >
                <div className="space-y-2">
                  <div className="h-4 w-64 rounded bg-surface-2 animate-pulse" />
                  <div className="h-3 w-32 rounded bg-surface-2 animate-pulse" />
                </div>
                <div className="h-8 w-12 rounded bg-surface-2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
