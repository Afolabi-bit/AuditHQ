import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { buildComparisonReport } from "@/lib/comparison/diff-engine";
import { CompareReportView } from "@/components/compare/CompareReportView";
import { TestReportSkeleton } from "@/components/report/TestReportSkeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface PublicComparePageProps {
  searchParams: Promise<{ base?: string; target?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PublicComparePageProps): Promise<Metadata> {
  const params = await searchParams;
  const { base, target } = params;

  if (!base || !target) {
    return { title: "Audit Regression Comparison - AuditHQ" };
  }

  const [baseTest, targetTest] = await Promise.all([
    prisma.test.findUnique({
      where: { id: base },
      select: { performanceScore: true, domain: { select: { url: true } } },
    }),
    prisma.test.findUnique({
      where: { id: target },
      select: { performanceScore: true, domain: { select: { url: true } } },
    }),
  ]);

  if (!baseTest || !targetTest) {
    return { title: "Audit Comparison Not Found - AuditHQ" };
  }

  return {
    title: `Comparison: ${baseTest.domain.url} (${baseTest.performanceScore}/100) vs (${targetTest.performanceScore}/100) | AuditHQ`,
    description: `Core Web Vitals and Lighthouse regression analysis between audit snapshots.`,
  };
}

async function AsyncPublicCompareFetcher({
  baseId,
  targetId,
}: {
  baseId: string;
  targetId: string;
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

  if (!baseTest || !targetTest || !baseTest.fullReport || !targetTest.fullReport) {
    notFound();
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

  return <CompareReportView report={report} isPublic={true} />;
}

export default async function PublicComparePage({ searchParams }: PublicComparePageProps) {
  const params = await searchParams;
  const baseId = params.base;
  const targetId = params.target;

  if (!baseId || !targetId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-card/80 dark:bg-[#0c0e14]/90 backdrop-blur-xl border border-border/60 dark:border-white/[0.07] p-8 sm:p-10 shadow-2xl space-y-5">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto shadow-xs">
            <WarningCircle weight="fill" className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-text-primary">
              Invalid Comparison Parameters
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              To compare audits, provide two valid audit IDs in the query parameters.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/">
              <Button size="sm" className="rounded-xl px-5 h-10 font-semibold cursor-pointer shadow-sm">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<TestReportSkeleton />}>
      <AsyncPublicCompareFetcher baseId={baseId} targetId={targetId} />
    </Suspense>
  );
}

