import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { TestReportView } from "@/components/report/TestReportView";
import { TestReportSkeleton } from "@/components/report/TestReportSkeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface PublicReportPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PublicReportPageProps): Promise<Metadata> {
  const { id } = await params;
  const testId = parseInt(id, 10);

  if (isNaN(testId)) {
    return { title: "Audit Report - AuditHQ" };
  }

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: { domain: true },
  });

  if (!test) {
    return { title: "Audit Not Found - AuditHQ" };
  }

  return {
    title: `Audit Report: ${test.domain.url} | AuditHQ`,
    description: `Lighthouse Performance Score: ${test.performanceScore ?? "N/A"}/100. Core Web Vitals report for ${test.domain.url}.`,
  };
}

async function AsyncPublicReportFetcher({ testId }: { testId: number }) {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      domain: true,
    },
  });

  if (!test) {
    notFound();
  }

  return <TestReportView test={test as any} isPublic={true} />;
}

export default async function PublicReportPage({ params }: PublicReportPageProps) {
  const { id } = await params;
  const testId = parseInt(id, 10);

  if (isNaN(testId)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface-1 flex flex-col justify-between">
      {/* ── Top Announcement Banner for Public Viewers ─────────────────────── */}
      <div className="bg-[#0a2540] text-white px-4 py-2.5 text-xs border-b border-[#0a2540]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-[#00875a] animate-pulse" />
            <span>Public AuditHQ Snapshot · Read-Only View</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/80 hidden md:inline">
              Want to audit your own website and track performance history?
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-semibold text-white bg-[#635bff] hover:bg-brand-700 px-3 py-1 rounded-md transition-colors text-[11px] shadow-xs cursor-pointer"
            >
              Run Free Audit
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Report Content with Scoped Dynamic Skeletons ──────────────── */}
      <main className="flex-1 pb-16">
        <Suspense fallback={<TestReportSkeleton isPublic={true} />}>
          <AsyncPublicReportFetcher testId={testId} />
        </Suspense>
      </main>
    </div>
  );
}
