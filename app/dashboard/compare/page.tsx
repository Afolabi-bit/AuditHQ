import React, { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import getSessionUser from "@/lib/auth";
import prisma from "@/lib/db";
import { buildComparisonReport } from "@/lib/comparison/diff-engine";
import { CompareReportView } from "@/components/compare/CompareReportView";
import { TestReportSkeleton } from "@/components/report/TestReportSkeleton";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { ArrowLeft, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface ComparePageProps {
  searchParams: Promise<{ base?: string; target?: string }>;
}

async function AsyncCompareFetcher({
  baseId,
  targetId,
  userId,
}: {
  baseId: string;
  targetId: string;
  userId: string;
}) {
  const [baseTest, targetTest] = await Promise.all([
    prisma.test.findUnique({
      where: { id: baseId },
      include: { domain: true },
    }),
    prisma.test.findUnique({
      where: { id: targetId },
      include: { domain: true },
    }),
  ]);

  if (!baseTest || !targetTest) {
    notFound();
  }

  // Ensure user owns domains or test is completed
  if (baseTest.domain.ownerId !== userId && targetTest.domain.ownerId !== userId) {
    notFound();
  }

  if (baseTest.status !== "completed" || targetTest.status !== "completed") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-card/80 dark:bg-[#0c0e14]/90 backdrop-blur-xl border border-border/60 dark:border-white/[0.07] p-8 sm:p-10 shadow-2xl space-y-5">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
            <WarningCircle weight="fill" className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-text-primary">
              Audit Not Ready for Comparison
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Both test runs must be in completed status to generate a regression report.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button size="sm" className="rounded-xl px-5 h-10 font-semibold cursor-pointer shadow-sm">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const report = buildComparisonReport({
    baseTest: {
      id: baseTest.id,
      url: baseTest.domain.url,
      device: baseTest.device,
      network: baseTest.network || "No Throttling",
      createdAt: baseTest.createdAt,
      performanceScore: baseTest.performanceScore,
      fullReport: baseTest.fullReport,
    },
    targetTest: {
      id: targetTest.id,
      url: targetTest.domain.url,
      device: targetTest.device,
      network: targetTest.network || "No Throttling",
      createdAt: targetTest.createdAt,
      performanceScore: targetTest.performanceScore,
      fullReport: targetTest.fullReport,
    },
  });

  return <CompareReportView report={report} isPublic={false} />;
}

export default async function DashboardComparePage({ searchParams }: ComparePageProps) {
  const user = (await getSessionUser()) as KindeUser | null;

  if (!user?.id) {
    redirect("/api/auth/register");
  }

  const params = await searchParams;
  const baseId = params.base;
  const targetId = params.target;

  if (!baseId || !targetId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-card/80 dark:bg-[#0c0e14]/90 backdrop-blur-xl border border-border/60 dark:border-white/[0.07] p-8 sm:p-10 shadow-2xl space-y-5">
          <div className="h-14 w-14 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center mx-auto shadow-xs">
            <WarningCircle weight="fill" className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-text-primary">
              Select Audits to Compare
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Please specify two audit IDs (base & target) to generate a regression comparison report.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button size="sm" className="rounded-xl px-5 h-10 font-semibold cursor-pointer shadow-sm">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <Suspense fallback={<TestReportSkeleton />}>
      <AsyncCompareFetcher baseId={baseId} targetId={targetId} userId={user.id} />
    </Suspense>
  );
}
