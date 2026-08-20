import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { buildComparisonReport } from "@/lib/comparison/diff-engine";
import { CompareReportView } from "@/components/compare/CompareReportView";
import { TestReportSkeleton } from "@/components/report/TestReportSkeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
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
        <div className="max-w-md w-full rounded-2xl bg-surface-0 border border-border p-8 shadow-xs space-y-4">
          <div className="h-12 w-12 rounded-xl bg-brand-50 border border-brand-200 text-brand-500 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-text-primary font-sans">
              Invalid Comparison Parameters
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              To compare audits, provide two valid audit IDs in the query parameters.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/">
              <Button size="sm" className="cursor-pointer">
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
