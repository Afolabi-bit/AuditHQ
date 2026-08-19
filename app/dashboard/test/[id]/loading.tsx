import React from "react";

export default function TestDetailsLoading() {
  return (
    <div className="w-full max-w-full overflow-x-hidden animate-in fade-in-50 duration-150">
      {/* 1. Report Header Skeleton */}
      <div className="bg-white border-b border-[#e3e8ee] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-36 rounded bg-[#f1f5f9] animate-pulse" />
            <div className="h-7 w-72 rounded-md bg-[#f1f5f9] animate-pulse" />
            <div className="flex items-center gap-2 pt-1">
              <div className="h-5 w-20 rounded-full bg-[#f1f5f9] animate-pulse" />
              <div className="h-5 w-28 rounded-full bg-[#f1f5f9] animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="h-9 w-28 rounded-lg bg-[#635bff]/20 animate-pulse" />
            <div className="h-9 w-20 rounded-lg bg-[#f1f5f9] animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. Main Body Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Category Header & 4 Score Rings */}
        <section className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-[#e3e8ee] rounded-xl p-4 px-6 shadow-xs h-[68px]">
            <div className="space-y-1.5">
              <div className="h-4 w-44 rounded bg-[#f1f5f9] animate-pulse" />
              <div className="h-3 w-80 rounded bg-[#f1f5f9] animate-pulse" />
            </div>
            <div className="h-6 w-36 rounded-full bg-[#f1f5f9] animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-white border border-[#e3e8ee] p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] flex flex-col justify-between h-[272px]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#f0f2ff] animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-24 rounded bg-[#f1f5f9] animate-pulse" />
                    <div className="h-2.5 w-32 rounded bg-[#f1f5f9] animate-pulse" />
                  </div>
                </div>

                <div className="my-5 flex items-center justify-center">
                  <div className="h-28 w-28 rounded-full border-8 border-[#f1f5f9] animate-pulse flex items-center justify-center">
                    <div className="h-8 w-12 rounded bg-[#f1f5f9] animate-pulse" />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
                  <div className="h-3 w-24 rounded bg-[#f1f5f9] animate-pulse" />
                  <div className="h-4 w-16 rounded bg-[#f1f5f9] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6 Core Web Vitals Grid */}
        <section className="space-y-4">
          <div className="space-y-1">
            <div className="h-4 w-56 rounded bg-[#f1f5f9] animate-pulse" />
            <div className="h-3 w-96 max-w-full rounded bg-[#f1f5f9] animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-white border border-[#e3e8ee] p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] space-y-4 h-[218px] flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-[#f0f2ff] animate-pulse" />
                      <div className="h-4 w-20 rounded bg-[#f1f5f9] animate-pulse" />
                    </div>
                    <div className="h-4 w-16 rounded-full bg-[#f1f5f9] animate-pulse" />
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div className="h-7 w-20 rounded bg-[#f1f5f9] animate-pulse" />
                    <div className="h-4 w-24 rounded bg-[#f1f5f9] animate-pulse" />
                  </div>
                  <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full" />
                </div>
                <div className="pt-3 border-t border-[#f1f5f9] flex justify-between">
                  <div className="h-3 w-28 rounded bg-[#f1f5f9] animate-pulse" />
                  <div className="h-3 w-16 rounded bg-[#f1f5f9] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
