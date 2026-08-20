"use client";

import React, { useState } from "react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import TestCard from "./TestCard";
import useSWR from "swr";
import { useAppStore, toStoredTest } from "@/lib/store/useAppStore";
import { ArrowRightLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompareSelectorModal } from "@/components/compare/CompareSelectorModal";

// Define the type for the data returned from the API
type RecentTestData = {
  id: string;
  createdAt: Date | string;
  domainId: string;
  device?: string;
  network?: string;
  status: string;
  errorMessage?: string | null;
  performanceScore: number | null;
  fcp: number | null;
  lcp: number | null;
  tbt: number | null;
  cls: number | null;
  domain: {
    id: string;
    createdAt: Date | string;
    url: string;
    device: string;
    network: string;
    ownerId: string;
    updatedAt: Date | string;
  };
};

/** Convert milliseconds to seconds, rounded to 1 decimal place */
function msToSeconds(ms: number | null | undefined): number | null {
  if (ms == null) return null;
  return Math.round(ms / 100) / 10;
}

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((res) => res.json());

const RecentTests = ({ user }: { user: KindeUser }) => {
  const tests = useAppStore((state) => state.tests);
  const testsOrder = useAppStore((state) => state.testsOrder);
  const storedList = testsOrder.map((id) => tests[id]).filter(Boolean);
  const isFresh = useAppStore.getState().isTestsFresh(120_000);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const { data, error, isLoading } = useSWR(
    `/api/tests/recent?userId=${user.id}`,
    fetcher,
    {
      revalidateOnFocus: false, // Don't query database on tab switches
      revalidateOnReconnect: false,
      dedupingInterval: 120_000, // 2-minute deduplication window
      revalidateIfStale: !isFresh,
      onSuccess: (freshData) => {
        if (freshData?.tests) {
          useAppStore.getState().setTests(freshData.tests.map(toStoredTest));
        }
      },
    },
  );

  // Use store as instant cache while SWR is loading
  const displayTests: RecentTestData[] = data?.tests ?? (storedList.length > 0 ? (storedList as any) : []);
  const showSkeleton = isLoading && storedList.length === 0;

  if (showSkeleton) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-surface-0 border border-border p-4.5 flex items-center justify-between shadow-xs h-21"
          >
            <div className="space-y-2 flex-1 max-w-md">
              <div className="flex items-center gap-2">
                <div className="h-4 w-48 rounded bg-surface-2 animate-pulse" />
                <div className="h-4 w-16 rounded-full bg-surface-2 animate-pulse" />
              </div>
              <div className="h-3 w-32 rounded bg-surface-2 animate-pulse" />
            </div>
            <div className="h-12 w-16 rounded-xl bg-surface-2 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error && storedList.length === 0) {
    return (
      <div className="text-center py-8 text-destructive font-mono text-xs">
        Failed to load tests. Please try refreshing.
      </div>
    );
  }

  if (displayTests.length === 0) {
    return (
      <div className="text-center py-8 text-text-tertiary font-mono text-xs bg-surface-0 border border-border rounded-xl p-8 shadow-xs">
        No audits found. Run your first audit using the command bar above!
      </div>
    );
  }

  const completedTests = displayTests.filter((t) => t.status === "completed");

  return (
    <div className="space-y-3.5">
      {/* Comparison Toolbar */}
      {completedTests.length >= 2 && (
        <div className="flex items-center justify-between bg-surface-0 border border-border px-4 py-2.5 rounded-xl text-xs shadow-2xs">
          <div className="flex items-center gap-2 text-text-secondary">
            <div className="h-6 w-6 rounded-md bg-brand-50 border border-brand-200 text-brand-500 flex items-center justify-center">
              <ArrowRightLeft className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-text-primary">
              Audit Regression & Diff Engine
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCompareModalOpen(true)}
            className="h-8 text-xs font-semibold border-border hover:border-brand-300 hover:text-brand-500 cursor-pointer gap-1.5 shadow-2xs"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-brand-500" />
            Compare Audits
          </Button>
        </div>
      )}

      {/* Tests Feed */}
      <div className="space-y-3">
        {displayTests.map((test) => {
          const rawLcp = test.lcp;
          const rawFcp = test.fcp;
          const rawTbt = test.tbt;
          const lcpSeconds = msToSeconds(rawLcp);
          const fcpSeconds = msToSeconds(rawFcp);
          const tbtSeconds = msToSeconds(rawTbt);
          const clsValue = test.cls != null ? Number(test.cls) : null;

          return (
            <TestCard
              key={test.id}
              id={test.id}
              url={test.domain?.url || "Unknown URL"}
              status={test.status}
              date={new Date(test.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              device={test.device || test.domain?.device || "Desktop"}
              errorMessage={test.errorMessage}
              score={test.performanceScore}
              fcp={fcpSeconds}
              lcp={lcpSeconds}
              tti={tbtSeconds}
              cls={clsValue}
              speedIndex={null}
            />
          );
        })}
      </div>

      {/* Compare Selector Modal */}
      <CompareSelectorModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        isPublic={false}
      />
    </div>
  );
};

export default RecentTests;
