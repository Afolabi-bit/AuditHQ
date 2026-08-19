import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { TestReportView } from "@/components/report/TestReportView";
import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight, ShieldCheck } from "lucide-react";

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

export default async function PublicReportPage({ params }: PublicReportPageProps) {
  const { id } = await params;
  const testId = parseInt(id, 10);

  if (isNaN(testId)) {
    notFound();
  }

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      domain: true,
    },
  });

  if (!test) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface-1 flex flex-col justify-between">
      {/* ── Top Announcement Banner for Public Viewers ─────────────────────── */}
      <div className="bg-brand-900 text-white px-4 py-2.5 text-xs border-b border-brand-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Public AuditHQ Snapshot · Read-Only View</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-300 hidden md:inline">
              Want to audit your own website and track performance history?
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-semibold text-white bg-brand-600 hover:bg-brand-700 px-3 py-1 rounded-lg transition-colors text-[11px] shadow-xs"
            >
              Run Free Audit
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Report Content ────────────────────────────────────────────── */}
      <main className="flex-1 pb-16">
        <TestReportView test={test as any} isPublic={true} />
      </main>

      {/* ── Mobile Sticky Bottom Conversion Bar ────────────────────────────── */}
      <div className="md:hidden sticky bottom-0 z-40 bg-surface-0/90 backdrop-blur-md border-t border-surface-3 p-3 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Zap className="h-4 w-4 fill-white" />
          </div>
          <span className="text-xs font-bold text-text-primary">AuditHQ</span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-brand transition-all"
        >
          Run Free Audit
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
