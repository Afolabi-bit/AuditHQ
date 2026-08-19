import { notFound, redirect } from "next/navigation";
import getSessionUser from "@/lib/auth";
import prisma from "@/lib/db";
import { TestReportView } from "@/components/report/TestReportView";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

export const dynamic = "force-dynamic";

interface TestPageProps {
  params: Promise<{ id: string }>;
}

export default async function TestDetailsPage({ params }: TestPageProps) {
  const user = (await getSessionUser()) as KindeUser | null;

  if (!user?.id) {
    redirect("/api/auth/register");
  }

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

  // Ensure user owns this test domain
  if (test.domain.ownerId !== user.id) {
    notFound();
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <TestReportView test={test as any} />
    </div>
  );
}
