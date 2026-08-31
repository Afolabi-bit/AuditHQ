"use client";

import React, { useState } from "react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import TestCard from "./TestCard";
import useSWR from "swr";
import { useAppStore, toStoredTest, StoredTest } from "@/lib/store/useAppStore";
import { ArrowsLeftRight, Tray } from "@phosphor-icons/react";
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
  // Synchronize active user ID with local store on mount/change
  React.useEffect(() => {
    if (user?.id) {
      useAppStore.getState().syncUser(user.id);
    }
  }, [user?.id]);

  const currentUserId = useAppStore((state) => state.currentUserId);
  const tests = useAppStore((state) => state.tests);
  const testsOrder = useAppStore((state) => state.testsOrder);

  // Strictly verify user identity before trusting persisted store
  const isUserMatching = currentUserId === user.id;
  const storedList = isUserMatching
    ? testsOrder
        .map((id) => tests[id])
        .filter((t): t is StoredTest => Boolean(t && (!t.domain?.ownerId || t.domain.ownerId === user.id)))
    : [];

  const isFresh = isUserMatching && useAppStore.getState().isTestsFresh(user.id, 120_000);

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
          useAppStore.getState().setTests(freshData.tests.map(toStoredTest), user.id);
        }
      },
    },
  );

  // Use store as instant cache ONLY if the user identity matches
  const displayTests: RecentTestData[] = data?.tests ?? (isUserMatching && storedList.length > 0 ? (storedList as any) : []);
  const showSkeleton = isLoading && displayTests.length === 0;

  if (showSkeleton) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-surface-0 border border-border p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1 max-w-md">
                <div className="h-5 w-48 rounded-lg bg-surface-2 animate-pulse" />
                <div className="h-3.5 w-32 rounded-md bg-surface-2 animate-pulse" />
              </div>
              <div className="h-10 w-24 rounded-xl bg-surface-2 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-16 rounded-xl bg-surface-1 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && storedList.length === 0) {
    return (
      <div className="text-center py-10 text-destructive font-mono text-xs bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
        Failed to load tests. Please try refreshing the page.
      </div>
    );
  }

  if (displayTests.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-surface-0 border border-border rounded-2xl shadow-xs space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-surface-1 border border-border flex items-center justify-center mx-auto text-text-tertiary">
          <Tray weight="bold" className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-sm font-semibold text-text-primary">No performance audits yet</h3>
          <p className="text-xs text-text-secondary">
            Enter a website URL in the command bar above to generate your first Lighthouse audit and automated diagnostics.
          </p>
        </div>
      </div>
    );
  }

  const completedTests = displayTests.filter((t) => t.status === "completed");

  return (
    <div className="space-y-4">
      {/* Comparison Toolbar */}
      {completedTests.length >= 2 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-0 border border-border px-5 py-3.5 rounded-2xl text-xs shadow-2xs gap-3">
          <div className="flex items-center gap-2.5 text-text-secondary">
            <div className="h-7 w-7 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center shrink-0">
              <ArrowsLeftRight weight="bold" className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="font-semibold text-text-primary block sm:inline">
                Audit Regression & Diff Engine
              </span>
              <span className="text-text-tertiary hidden sm:inline ml-2">
                Compare performance metrics across dates or environments
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCompareModalOpen(true)}
            className="h-9 px-4 text-xs font-semibold border-border hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-300 cursor-pointer gap-2 shadow-2xs rounded-xl self-start sm:self-auto"
          >
            <ArrowsLeftRight weight="bold" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            Compare 2 Audits
          </Button>
        </div>
      )}

      {/* Tests Feed */}
      <div className="space-y-4">
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

