"use client";

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import TestCard from "./TestCard";
import { Loader2 } from "lucide-react";
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RecentTests = ({ user }: { user: KindeUser }) => {
  const { data, error, isLoading } = useSWR(
    `/api/tests/recent?userId=${user.id}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-white border border-[#e3e8ee] p-4.5 flex items-center justify-between shadow-[0_1px_3px_rgba(50,50,93,0.08)]"
          >
            <div className="space-y-2 flex-1 max-w-md">
              <div className="flex items-center gap-2">
                <div className="h-4 w-48 rounded bg-[#f1f5f9] animate-pulse" />
                <div className="h-4 w-16 rounded-full bg-[#f1f5f9] animate-pulse" />
              </div>
              <div className="h-3 w-32 rounded bg-[#f1f5f9] animate-pulse" />
            </div>
            <div className="h-14 w-16 rounded-xl bg-[#f1f5f9] animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load tests. Please try again.
      </div>
    );
  }

  const tests: RecentTestData[] = data?.tests || [];

  if (tests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tests found. Submit your first test above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <TestCard
          key={test.id}
          id={test.id}
          url={test.domain.url}
          status={test.status}
          errorMessage={test.errorMessage}
          date={new Date(test.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
          device={test.device || test.domain.device}
          score={test.performanceScore ?? null}
          fcp={msToSeconds(test.fcp)}
          lcp={msToSeconds(test.lcp)}
          tti={msToSeconds(test.tbt)}
          cls={test.cls ?? null}
          speedIndex={null}
        />
      ))}
    </div>
  );
};

export default RecentTests;
