import React, { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import getSessionUser from "@/lib/auth";
import prisma from "@/lib/db";
import { buildComparisonReport } from "@/lib/comparison/diff-engine";
import { CompareReportView } from "@/components/compare/CompareReportView";
import { TestReportSkeleton } from "@/components/report/TestReportSkeleton";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
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
        <div className="max-w-md w-full rounded-2xl bg-surface-0 border border-border p-8 shadow-xs space-y-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-text-primary font-sans">
              Audit Not Ready for Comparison
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Both test runs must be in completed status to generate a regression report.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button size="sm" className="cursor-pointer">
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
        <div className="max-w-md w-full rounded-2xl bg-surface-0 border border-border p-8 shadow-xs space-y-4">
          <div className="h-12 w-12 rounded-xl bg-brand-50 border border-brand-200 text-brand-500 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-text-primary font-sans">
              Select Audits to Compare
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Please specify two audit IDs (base & target) to generate a regression comparison report.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button size="sm" className="cursor-pointer">
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
