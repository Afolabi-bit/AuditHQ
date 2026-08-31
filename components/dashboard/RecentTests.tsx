"use client";

import React, { useState, useMemo } from "react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import TestCard from "./TestCard";
import { DomainGroupCard, DomainGroupTestItem } from "./DomainGroupCard";
import useSWR from "swr";
import { useAppStore, toStoredTest, StoredTest } from "@/lib/store/useAppStore";
import {
  ArrowsLeftRight,
  Tray,
  List,
  Folders,
  MagnifyingGlass,
  Globe,
} from "@phosphor-icons/react";
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
  const [viewMode, setViewMode] = useState<"domain" | "feed">("domain");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, error, isLoading, mutate } = useSWR(
    `/api/tests/recent?userId=${user.id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 120_000,
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

  // Domain Grouping Computation
  const domainGroups = useMemo(() => {
    const map = new Map<string, DomainGroupTestItem[]>();

    for (const test of displayTests) {
      const urlKey = test.domain?.url?.trim() || "Unknown Domain";
      if (!map.has(urlKey)) {
        map.set(urlKey, []);
      }
      map.get(urlKey)!.push(test as DomainGroupTestItem);
    }

    // Sort tests in each domain descending by date
    map.forEach((items) => {
      items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    // Convert to sorted array of groups (newest activity first)
    const groups = Array.from(map.entries()).map(([url, groupTests]) => ({
      url,
      tests: groupTests,
      latestDate: new Date(groupTests[0]?.createdAt || 0).getTime(),
    }));

    groups.sort((a, b) => b.latestDate - a.latestDate);

    if (!searchQuery.trim()) return groups;

    const query = searchQuery.toLowerCase();
    return groups.filter(
      (g) =>
        g.url.toLowerCase().includes(query) ||
        g.tests.some(
          (t) =>
            String(t.id).includes(query) ||
            t.device?.toLowerCase().includes(query)
        )
    );
  }, [displayTests, searchQuery]);

  // Feed Filtered List
  const filteredFeedTests = useMemo(() => {
    if (!searchQuery.trim()) return displayTests;
    const query = searchQuery.toLowerCase();
    return displayTests.filter(
      (t) =>
        t.domain?.url?.toLowerCase().includes(query) ||
        String(t.id).includes(query) ||
        t.device?.toLowerCase().includes(query)
    );
  }, [displayTests, searchQuery]);

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
    <div className="space-y-5">
      {/* ── Control Deck: View Switcher, Search & Comparison Trigger ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-surface-0 border border-border p-3 sm:p-4 rounded-2xl shadow-2xs">
        {/* Left: View Mode Segmented Switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-surface-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setViewMode("domain")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "domain"
                  ? "bg-surface-0 text-brand-600 dark:text-brand-300 shadow-2xs border border-border/80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Folders weight={viewMode === "domain" ? "fill" : "bold"} className="h-3.5 w-3.5" />
              <span>Group by Domain</span>
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-surface-2 text-text-tertiary">
                {domainGroups.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("feed")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "feed"
                  ? "bg-surface-0 text-brand-600 dark:text-brand-300 shadow-2xs border border-border/80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <List weight={viewMode === "feed" ? "fill" : "bold"} className="h-3.5 w-3.5" />
              <span>Chronological Feed</span>
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-surface-2 text-text-tertiary">
                {displayTests.length}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Search Input & Global Compare Action */}
        <div className="flex items-center gap-2.5 flex-1 md:justify-end">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass weight="bold" className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              placeholder="Search domains or audit #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-1 border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-brand-500 focus:bg-surface-0 transition-all"
            />
          </div>

          {completedTests.length >= 2 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCompareModalOpen(true)}
              className="h-8.5 px-3.5 text-xs font-semibold border-border hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-300 cursor-pointer gap-1.5 rounded-xl shrink-0"
            >
              <ArrowsLeftRight weight="bold" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span className="hidden sm:inline">Compare 2 Audits</span>
              <span className="sm:hidden">Compare</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── View Mode: Group by Domain ── */}
      {viewMode === "domain" && (
        <div className="space-y-4">
          {domainGroups.length === 0 ? (
            <div className="py-12 text-center text-xs text-text-tertiary font-mono bg-surface-0 border border-border rounded-2xl p-6">
              No domains matched &quot;{searchQuery}&quot;.
            </div>
          ) : (
            domainGroups.map((group) => (
              <DomainGroupCard
                key={group.url}
                url={group.url}
                tests={group.tests}
                userId={user.id}
                defaultExpanded={true}
                onRunTestStarted={() => mutate()}
              />
            ))
          )}
        </div>
      )}

      {/* ── View Mode: Chronological Feed ── */}
      {viewMode === "feed" && (
        <div className="space-y-4">
          {filteredFeedTests.length === 0 ? (
            <div className="py-12 text-center text-xs text-text-tertiary font-mono bg-surface-0 border border-border rounded-2xl p-6">
              No audit runs matched &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredFeedTests.map((test) => {
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
                  onDeleted={() => mutate()}
                />
              );
            })
          )}
        </div>
      )}

      {/* Global Compare Selector Modal */}
      <CompareSelectorModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        isPublic={false}
      />
    </div>
  );
};

export default RecentTests;
