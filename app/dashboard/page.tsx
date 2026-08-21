import getSessionUser from "@/lib/auth";
import Welcome from "@/components/dashboard/Welcome";
import StatsOverviewCards from "@/components/dashboard/StatsOverviewCards";
import AnalyticsAndRecentTabs from "@/components/dashboard/AnalyticsAndRecentTabs";
import NewTest from "@/components/dashboard/NewTest";
import { redirect } from "next/navigation";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = (await getSessionUser()) as KindeUser;

  if (!user) {
    redirect("/api/auth/register");
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14 space-y-10 sm:space-y-12">
      {/* 1. Greeting header (instant) */}
      <Welcome user={user} />

      {/* 2. Stats cards (instant cards, scoped inline number skeletons) */}
      <StatsOverviewCards user={user} />

      {/* 3. Audit execution command bar (instant, interactive immediately) */}
      <NewTest user={user} />

      {/* 4. Deep-dive tabs & recent tests (instant tabs, scoped content skeletons) */}
      <AnalyticsAndRecentTabs user={user} />
    </main>
  );
}
