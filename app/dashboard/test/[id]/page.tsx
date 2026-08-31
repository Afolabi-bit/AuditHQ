import React, { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import getSessionUser from "@/lib/auth";
import prisma from "@/lib/db";
import { TestReportView } from "@/components/report/TestReportView";
import { TestReportSkeleton } from "@/components/report/TestReportSkeleton";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

export const dynamic = "force-dynamic";

interface TestPageProps {
  params: Promise<{ id: string }>;
}

async function AsyncTestReportFetcher({
  testId,
  userId,
}: {
  testId: string;
  userId: string;
}) {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      domain: true,
    },
  });

  if (!test || test.deletedAt) {
    notFound();
  }

  // Ensure user owns this test domain
  if (test.domain.ownerId !== userId) {
    notFound();
  }

  return <TestReportView test={test as any} />;
}

export default async function TestDetailsPage({ params }: TestPageProps) {
  const user = (await getSessionUser()) as KindeUser | null;

  if (!user?.id) {
    redirect("/api/auth/register");
  }

  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Suspense fallback={<TestReportSkeleton />}>
        <AsyncTestReportFetcher testId={id} userId={user.id} />
      </Suspense>
    </div>
  );
}
