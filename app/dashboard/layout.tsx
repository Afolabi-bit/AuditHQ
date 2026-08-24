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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Clean, airy top navigation bar */}
      <DashboardNav user={user} />

      {/* Spacious full-width main content canvas */}
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
}
