"use client";

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import TestCard from "./TestCard";
import useSWR from "swr";

// Define the type for the data returned from the API
type RecentTestData = {
  id: number;
  createdAt: Date;
  domainId: number;
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
    id: number;
    createdAt: Date;
    url: string;
    device: string;
    network: string;
    ownerId: string;
    updatedAt: Date;
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
  const { data, error, isLoading } = useSWR(
    `/api/tests/recent?userId=${user.id}`,
    fetcher,
    {
      // Only refresh every 2s if there is an active pending test; otherwise 0 (idle)
      refreshInterval: (latestData) => {
        const tests = latestData?.tests || [];
        const hasPending = tests.some((t: RecentTestData) => t.status === "pending");
        return hasPending ? 2000 : 0;
      },
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 500,
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-white border border-[#e3e8ee] p-4.5 flex items-center justify-between shadow-sm h-[84px]"
          >
            <div className="space-y-2 flex-1 max-w-md">
              <div className="flex items-center gap-2">
                <div className="h-4 w-48 rounded bg-[#f1f5f9] animate-pulse" />
                <div className="h-4 w-16 rounded-full bg-[#f1f5f9] animate-pulse" />
              </div>
              <div className="h-3 w-32 rounded bg-[#f1f5f9] animate-pulse" />
            </div>
            <div className="h-12 w-16 rounded-xl bg-[#f1f5f9] animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 font-mono text-xs">
        Failed to load tests. Please try refreshing.
      </div>
    );
  }

  const tests: RecentTestData[] = data?.tests || [];

  if (tests.length === 0) {
    return (
      <div className="text-center py-8 text-[#8898aa] font-mono text-xs bg-white border border-[#e3e8ee] rounded-xl p-8 shadow-xs">
        No audits found. Run your first audit using the command bar above!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tests.map((test) => {
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
  );
};

export default RecentTests;
