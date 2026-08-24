"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  Globe,
  Zap,
  ArrowLeft,
  Palette,
  BarChart3,
  Lock,
} from "lucide-react";
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
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette className="h-4 w-4" />,
    },
    {
      id: "usage",
      label: "Audit Quotas",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: "security",
      label: "Security & Session",
      icon: <Lock className="h-4 w-4" />,
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* ── Breadcrumb & Back Action ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Console
        </Link>
        <span className="text-xs font-mono text-text-tertiary">
          User ID: {user.id.slice(0, 16)}…
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Account Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Manage your personal credentials, engine quotas, and display theme
        </p>
      </div>

      {/* ── Top Segmented Pill Nav ─────────────────────────────────────────── */}
      <div className="border-b border-border/80 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {settingsTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
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

      {/* ── Active Tab Content Area (Spacious & Open) ───────────────────────── */}
      <div className="space-y-6">
        {/* TAB 1: General Profile */}
        {activeTab === "general" && (
          <div className="bg-surface-0 border border-border rounded-2xl p-7 sm:p-9 shadow-xs space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
              <div className="flex items-center gap-5">
                <div className="relative">
                  {user.picture ? (
                    <div className="relative h-18 w-18 rounded-2xl overflow-hidden ring-2 ring-border shadow-2xs">
                      <Image
                        src={user.picture}
                        alt={fullName}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-18 w-18 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center font-bold text-2xl shadow-xs">
                      {user.given_name?.[0]?.toUpperCase() || <User className="h-8 w-8" />}
                    </div>
                  )}
                  <span
                    className="absolute -bottom-1 -right-1 h-5 w-5 bg-score-good border-2 border-surface-0 rounded-full flex items-center justify-center"
                    title="Active account"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-text-primary">
                      {fullName}
                    </h2>
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold score-badge-good">
                      Verified Account
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-text-tertiary" />
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="bg-surface-1 border border-border rounded-2xl p-4 px-5 text-right sm:self-center">
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                  Current Plan
                </p>
                <p className="text-sm font-bold text-text-primary">
                  Developer Tier (Free)
                </p>
              </div>
            </div>

            {/* Account Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              <div className="bg-surface-1 rounded-2xl p-5 border border-border space-y-1.5">
                <p className="text-text-tertiary font-medium">Authentication</p>
                <p className="font-bold text-text-primary flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  Kinde OAuth 2.0 / SSO
                </p>
              </div>

              <div className="bg-surface-1 rounded-2xl p-5 border border-border space-y-1.5">
                <p className="text-text-tertiary font-medium">Audit Engine</p>
                <p className="font-bold text-text-primary flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  Lighthouse 12.0 Cloud
                </p>
              </div>

              <div className="bg-surface-1 rounded-2xl p-5 border border-border space-y-1.5">
                <p className="text-text-tertiary font-medium">Connected Sites</p>
                <p className="font-bold text-text-primary flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  {totalDomains} {totalDomains === 1 ? "Domain" : "Domains"} Monitored
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Appearance & Theme */}
        {activeTab === "appearance" && (
          <div className="bg-surface-0 border border-border rounded-2xl p-7 sm:p-9 shadow-xs space-y-6">
            <div className="space-y-1 pb-2 border-b border-border/80">
              <h2 className="text-base font-bold text-text-primary">
                Appearance & Display Theme
              </h2>
              <p className="text-xs text-text-secondary">
                Select your preferred theme across the dashboard console and performance reports
              </p>
            </div>

            <ThemeSelector />
          </div>
        )}

        {/* TAB 3: Usage & Quotas */}
        {activeTab === "usage" && (
          <div className="bg-surface-0 border border-border rounded-2xl p-7 sm:p-9 shadow-xs space-y-6">
            <div className="space-y-1 pb-2 border-b border-border/80">
              <h2 className="text-base font-bold text-text-primary">
                Monthly Audit Quotas & History
              </h2>
              <p className="text-xs text-text-secondary">
                Execution budget and telemetry history under your current Developer tier
              </p>
            </div>

            <div className="border border-border rounded-2xl p-6 bg-surface-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">
                  Audits Run This Billing Cycle
                </span>
                <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                  {auditsThisMonth} / 100
                </span>
              </div>
              <div className="h-2.5 w-full bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 dark:bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (auditsThisMonth / 100) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-text-tertiary">
                Monthly quotas reset automatically on the 1st of every calendar month.
              </p>
            </div>

            <div className="border border-border rounded-2xl p-6 bg-surface-1 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-secondary">Lifetime Cloud Audits</span>
                <span className="font-bold font-mono text-text-primary">{totalAudits} audits</span>
              </div>
              {latestTest && (
                <p className="text-text-tertiary">
                  Most recent audit: <span className="text-text-primary font-mono">{latestTest.domain?.url}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Security & Sign Out */}
        {activeTab === "security" && (
          <div className="bg-surface-0 border border-border rounded-2xl p-7 sm:p-9 shadow-xs space-y-6">
            <div className="space-y-1 pb-2 border-b border-border/80">
              <h2 className="text-base font-bold text-text-primary">
                Account Session & Security
              </h2>
              <p className="text-xs text-text-secondary">
                Manage active workstation credentials and sign out
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-text-primary">
                  Sign Out of AuditHQ
                </h4>
                <p className="text-xs text-text-secondary">
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
