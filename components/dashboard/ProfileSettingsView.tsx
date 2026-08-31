"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Envelope,
  ShieldCheck,
  Globe,
  Lightning,
  ArrowLeft,
  Palette,
  ChartBar,
  Lock,
} from "@phosphor-icons/react";
import { ThemeSelector } from "@/components/dashboard/ThemeSelector";
import { SignOutButton } from "@/components/dashboard/SignOutButton";

interface ProfileSettingsViewProps {
  user: {
    id: string;
    given_name?: string | null;
    family_name?: string | null;
    email?: string | null;
    picture?: string | null;
  };
  totalAudits: number;
  auditsThisMonth: number;
  totalDomains: number;
  latestTest?: {
    createdAt: string | Date;
    domain?: {
      url: string;
    } | null;
  } | null;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  user,
  totalAudits,
  auditsThisMonth,
  totalDomains,
  latestTest,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "appearance" | "usage" | "security">("general");

  const fullName = [user.given_name, user.family_name].filter(Boolean).join(" ") || "AuditHQ Developer";

  const settingsTabs = [
    {
      id: "general",
      label: "General Profile",
      icon: <User weight="bold" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette weight="bold" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
    },
    {
      id: "usage",
      label: "Audit Quotas",
      icon: <ChartBar weight="bold" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
    },
    {
      id: "security",
      label: "Security & Session",
      icon: <Lock weight="bold" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 overflow-hidden w-full">
      {/* ── Breadcrumb & Back Action ────────────────────────────────────────── */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 pb-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0"
        >
          <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
          Back to Console
        </Link>
        <span className="text-[11px] font-mono text-text-tertiary truncate max-w-full">
          User ID: {user.id.slice(0, 12)}…
        </span>
      </div>

      <div className="space-y-1 sm:space-y-1.5">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
          Account Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Manage your personal credentials, engine quotas, and display theme
        </p>
      </div>

      {/* ── Top Segmented Pill Nav ─────────────────────────────────────────── */}
      <div className="border-b border-border/80 pb-2.5">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {settingsTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-brand-600 text-white shadow-xs font-bold"
                    : "bg-surface-0 text-text-secondary hover:text-text-primary hover:bg-surface-1 border border-border"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Tab Content Area ─────────────────────────────────────────── */}
      <div className="space-y-5 sm:space-y-6">
        {/* TAB 1: General Profile */}
        {activeTab === "general" && (
          <div className="bg-surface-0 border border-border rounded-2xl p-4 sm:p-7 md:p-9 shadow-xs space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-border">
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3.5 sm:gap-5 min-w-0">
                <div className="relative shrink-0">
                  {user.picture ? (
                    <div className="relative h-14 w-14 sm:h-18 sm:w-18 rounded-2xl overflow-hidden ring-2 ring-border shadow-2xs">
                      <Image
                        src={user.picture}
                        alt={fullName}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 sm:h-18 sm:w-18 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center font-bold text-xl sm:text-2xl shadow-xs">
                      {user.given_name?.[0]?.toUpperCase() || <User weight="bold" className="h-6 w-6 sm:h-8 sm:w-8" />}
                    </div>
                  )}
                  <span
                    className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-score-good border-2 border-surface-0 rounded-full flex items-center justify-center"
                    title="Active account"
                  >
                    <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-white" />
                  </span>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-xl font-bold text-text-primary truncate max-w-full">
                      {fullName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold score-badge-good shrink-0 whitespace-nowrap">
                      Verified Account
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary flex items-center gap-1.5 truncate max-w-full" title={user.email || ""}>
                    <Envelope weight="bold" className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                </div>
              </div>

              <div className="bg-surface-1 border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left sm:text-right shrink-0">
                <p className="text-[10px] sm:text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                  Current Plan
                </p>
                <p className="text-xs sm:text-sm font-bold text-text-primary">
                  Developer Tier (Free)
                </p>
              </div>
            </div>

            {/* Account Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 text-xs">
              <div className="bg-surface-1 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border space-y-1">
                <p className="text-text-tertiary font-medium text-[11px]">Authentication</p>
                <p className="font-bold text-text-primary flex items-center gap-1.5">
                  <ShieldCheck weight="fill" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span className="truncate">Kinde OAuth 2.0</span>
                </p>
              </div>

              <div className="bg-surface-1 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border space-y-1">
                <p className="text-text-tertiary font-medium text-[11px]">Audit Engine</p>
                <p className="font-bold text-text-primary flex items-center gap-1.5">
                  <Lightning weight="fill" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span className="truncate">Lighthouse 12.0</span>
                </p>
              </div>

              <div className="bg-surface-1 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border space-y-1">
                <p className="text-text-tertiary font-medium text-[11px]">Connected Sites</p>
                <p className="font-bold text-text-primary flex items-center gap-1.5">
                  <Globe weight="bold" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span className="truncate">{totalDomains} {totalDomains === 1 ? "Domain" : "Domains"}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Appearance & Theme */}
        {activeTab === "appearance" && (
          <div className="bg-surface-0 border border-border rounded-2xl p-4 sm:p-7 md:p-9 shadow-xs space-y-5 sm:space-y-6">
            <div className="space-y-1 pb-2 border-b border-border/80">
              <h2 className="text-sm sm:text-base font-bold text-text-primary">
                Appearance & Display Theme
              </h2>
              <p className="text-xs text-text-secondary">
                Select your preferred theme across the dashboard console and reports
              </p>
            </div>

            <ThemeSelector />
          </div>
        )}

        {/* TAB 3: Usage & Quotas */}
        {activeTab === "usage" && (
          <div className="bg-surface-0 border border-border rounded-2xl p-4 sm:p-7 md:p-9 shadow-xs space-y-5 sm:space-y-6">
            <div className="space-y-1 pb-2 border-b border-border/80">
              <h3 className="text-sm sm:text-base font-bold text-text-primary">
                Monthly Usage Quota & Limits
              </h3>
              <p className="text-xs text-text-secondary">
                Execution capacity and telemetry history under your active workspace
              </p>
            </div>

            <div className="border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-surface-1 space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-text-secondary">
                  Audits Run This Month
                </span>
                <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 whitespace-nowrap">
                  {auditsThisMonth} / 100
                </span>
              </div>
              <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 dark:bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (auditsThisMonth / 100) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] sm:text-xs text-text-tertiary leading-relaxed">
                Monthly quotas reset automatically on the 1st of every calendar month.
              </p>
            </div>

            <div className="border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-surface-1 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-text-secondary">Lifetime Cloud Audits</span>
                <span className="font-bold font-mono text-text-primary whitespace-nowrap">{totalAudits} audits</span>
              </div>
              {latestTest && (
                <p className="text-text-tertiary truncate max-w-full">
                  Most recent audit: <span className="text-text-primary font-mono">{latestTest.domain?.url}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Security & Sign Out */}
        {activeTab === "security" && (
          <div className="bg-surface-0 border border-border rounded-2xl p-4 sm:p-7 md:p-9 shadow-xs space-y-5 sm:space-y-6">
            <div className="space-y-1 pb-2 border-b border-border/80">
              <h2 className="text-sm sm:text-base font-bold text-text-primary">
                Account Session & Security
              </h2>
              <p className="text-xs text-text-secondary">
                Manage active workstation credentials and sign out
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-destructive/5 border border-destructive/20">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-text-primary">
                  Sign Out of AuditHQ
                </h4>
                <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">
                  End your current session on this device and return to the login screen.
                </p>
              </div>

              <SignOutButton />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

