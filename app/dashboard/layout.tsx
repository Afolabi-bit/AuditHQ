import React from "react";
import getSessionUser from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = (await getSessionUser()) as KindeUser | null;

  if (!user) {
    redirect("/api/auth/register");
  }

  return (
    <div className="min-h-screen bg-surface-1 text-[#0a2540]">
      {/* Persistent Top Navigation — renders once, stays mounted on all page transitions */}
      <DashboardNav user={user} />
      {children}
    </div>
  );
}
