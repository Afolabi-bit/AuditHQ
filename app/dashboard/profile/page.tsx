import React from "react";
import getSessionUser from "@/lib/auth";
import { redirect } from "next/navigation";
import { KindeUser, LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Activity,
  Globe,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const fullName = [user.given_name, user.family_name].filter(Boolean).join(" ") || "AuditHQ Developer";

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ── Breadcrumb & Back Action ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#425466] hover:text-[#0a2540] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Console
        </Link>
        <span className="text-xs font-mono text-[#8898aa]">
          User ID: {user.id.slice(0, 16)}…
        </span>
      </div>

      {/* ── 1. Profile Header Card ───────────────────────────────────────────── */}
      <div className="bg-white border border-[#e3e8ee] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              {user.picture ? (
                <div className="relative h-18 w-18 rounded-2xl overflow-hidden ring-2 ring-[#e3e8ee] shadow-sm">
                  <Image
                    src={user.picture}
                    alt={fullName}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-18 w-18 rounded-2xl bg-[#f0f2ff] text-[#635bff] border border-brand-200 flex items-center justify-center font-bold text-2xl shadow-xs">
                  {user.given_name?.[0]?.toUpperCase() || <User className="h-8 w-8" />}
                </div>
              )}
              <span
                className="absolute -bottom-1 -right-1 h-5 w-5 bg-[#00875a] border-2 border-white rounded-full flex items-center justify-center"
                title="Active account"
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>

            {/* Name & Role */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-[#0a2540] font-sans tracking-tight">
                  {fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#e3fcf7] text-[#00875a] border border-[#abf5d1]">
                  Verified Account
                </span>
              </div>
              <p className="text-xs text-[#425466] flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#8898aa]" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Plan Badge */}
          <div className="bg-[#f8fafc] border border-[#e3e8ee] rounded-xl p-3.5 px-5 text-right sm:self-center">
            <p className="text-[11px] font-bold text-[#8898aa] uppercase tracking-wider">
              Current Plan
            </p>
            <p className="text-sm font-extrabold text-[#0a2540] font-sans">
              Developer Tier (Free)
            </p>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e3e8ee] space-y-1">
            <p className="text-[#8898aa] font-medium">Auth Provider</p>
            <p className="font-bold text-[#0a2540] flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-[#635bff]" />
              Kinde OAuth 2.0 / SSO
            </p>
          </div>

          <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e3e8ee] space-y-1">
            <p className="text-[#8898aa] font-medium">Engine Environment</p>
            <p className="font-bold text-[#0a2540] flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-[#635bff]" />
              Lighthouse 12.0 Cloud
            </p>
          </div>

          <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e3e8ee] space-y-1">
            <p className="text-[#8898aa] font-medium">Tracked Domains</p>
            <p className="font-bold text-[#0a2540] flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-[#635bff]" />
              {totalDomains} {totalDomains === 1 ? "Site" : "Sites"} Connected
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. Usage & Performance Telemetry ─────────────────────────────────── */}
      <div className="bg-white border border-[#e3e8ee] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[#0a2540] font-sans">
            Monthly Audit Quota & Usage
          </h2>
          <p className="text-xs text-[#425466]">
            Summary of Google PageSpeed evaluations executed under your account this billing cycle
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-[#e3e8ee] rounded-xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#425466]">
                Audits This Month
              </span>
              <span className="text-xs font-mono font-bold text-[#635bff]">
                {auditsThisMonth} / 100
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#635bff] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (auditsThisMonth / 100) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-[#8898aa]">
              Quota resets on the 1st of next month.
            </p>
          </div>

          <div className="border border-[#e3e8ee] rounded-xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#425466]">
                Lifetime Audits Executed
              </span>
              <span className="text-xs font-mono font-bold text-[#0a2540]">
                {totalAudits} audits
              </span>
            </div>
            <p className="text-xs text-[#425466]">
              {latestTest ? (
                <>
                  Last audit:{" "}
                  <span className="font-mono font-semibold text-[#0a2540]">
                    {latestTest.domain?.url}
                  </span>{" "}
                  ({new Date(latestTest.createdAt).toLocaleDateString()})
                </>
              ) : (
                "No audits executed yet."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Session & Sign Out Section ────────────────────────────────────── */}
      <div className="bg-white border border-[#e3e8ee] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[#0a2540] font-sans">
            Account Session & Security
          </h2>
          <p className="text-xs text-[#425466]">
            Manage your active session on this device
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-xl bg-[#fffbfb] border border-[#ffbdad]">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-[#0a2540] font-sans">
              Sign Out of AuditHQ
            </h4>
            <p className="text-xs text-[#425466]">
              End your current authenticated session and return to the login screen.
            </p>
          </div>

          <LogoutLink>
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-[#ffebe6] text-[#de350b] border-[#ffbdad] font-semibold text-xs rounded-lg px-4 h-9 cursor-pointer w-full sm:w-auto shrink-0 shadow-xs"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Sign Out
            </Button>
          </LogoutLink>
        </div>
      </div>
    </main>
  );
}
