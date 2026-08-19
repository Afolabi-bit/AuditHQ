import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { TestReportView } from "@/components/report/TestReportView";
import type { Metadata } from "next";

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
    <div className="min-h-screen bg-slate-50">
      <TestReportView test={test as any} isPublic={true} />
    </div>
  );
}
