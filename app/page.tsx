import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import getSessionUser from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPageClient from "@/components/landing/LandingPageClient";

export default async function LandingPage() {
  const user = (await getSessionUser()) as KindeUser | null;
  if (user) redirect("/dashboard");
  return <LandingPageClient />;
}
