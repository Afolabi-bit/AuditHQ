import React from "react";
import getSessionUser from "@/lib/auth";
import { redirect } from "next/navigation";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import prisma from "@/lib/db";
import { ProfileSettingsView } from "@/components/dashboard/ProfileSettingsView";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = (await getSessionUser()) as KindeUser | null;

  if (!user?.id) {
    redirect("/api/auth/register");
  }

  // Fetch account stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalAudits, auditsThisMonth, totalDomains, latestTest] = await Promise.all([
    prisma.test.count({
      where: { domain: { ownerId: user.id } },
    }),
    prisma.test.count({
      where: {
        domain: { ownerId: user.id },
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.domain.count({
      where: { ownerId: user.id },
    }),
    prisma.test.findFirst({
      where: { domain: { ownerId: user.id } },
      orderBy: { createdAt: "desc" },
      include: { domain: true },
    }),
  ]);

  return (
    <ProfileSettingsView
      user={user}
      totalAudits={totalAudits}
      auditsThisMonth={auditsThisMonth}
      totalDomains={totalDomains}
      latestTest={latestTest}
    />
  );
}
