"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  ArrowRightLeft,
  User,
  Globe,
  BarChart3,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { KindeUser, LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import useSWR from "swr";
import { useAppStore } from "@/lib/store/useAppStore";

interface AppSidebarProps {
  user: KindeUser;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AppSidebar: React.FC<AppSidebarProps> = ({ user }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data } = useSWR("/api/dashboard/stats", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120_000,
  });

  const stats = data?.stats || {
    testsThisMonth: 0,
    testsLimit: 100,
    activeSites: 0,
  };

  const usagePercent = Math.min(
    100,
    Math.round((stats.testsThisMonth / (stats.testsLimit || 100)) * 100)
  );

  const navItems = [
    {
      label: "Console & Audits",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      active: pathname === "/dashboard" || pathname.startsWith("/dashboard/test"),
    },
    {
      label: "Compare Engine",
      href: "/dashboard/compare",
      icon: <ArrowRightLeft className="h-4 w-4" />,
      active: pathname.startsWith("/dashboard/compare") || pathname.startsWith("/compare"),
    },
    {
      label: "Account & Settings",
      href: "/dashboard/profile",
      icon: <User className="h-4 w-4" />,
      active: pathname === "/dashboard/profile",
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4.5">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-8.5 w-8.5 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-700 transition-colors">
              <Zap className="h-4.5 w-4.5 fill-white" />
            </div>
            <div>
              <span className="text-base font-bold text-text-primary tracking-tight block leading-tight">
                AuditHQ
              </span>
              <span className="text-[10px] text-text-tertiary font-mono block">
                Performance Cloud
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-2">
            Navigation
          </p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                item.active
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 shadow-2xs"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-1"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={item.active ? "text-brand-600 dark:text-brand-400" : "text-text-tertiary"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.active && <ChevronRight className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />}
            </Link>
          ))}
        </div>

        {/* Quota Meter Box */}
        <div className="p-3.5 bg-surface-1 rounded-2xl border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-secondary">Monthly Quota</span>
            <span className="font-mono text-[11px] font-bold text-brand-600 dark:text-brand-300">
              {stats.testsThisMonth} / {stats.testsLimit || 100}
            </span>
          </div>
          <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 dark:bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="text-[10px] text-text-tertiary">
            {100 - stats.testsThisMonth} free cloud audits remaining
          </p>
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-border space-y-3">
        <Link
          href="/dashboard/profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-1 transition-colors cursor-pointer group"
        >
          <div className="relative shrink-0">
            {user.picture ? (
              <span className="relative w-8 h-8 inline-block rounded-full overflow-hidden ring-1 ring-border">
                <Image
                  src={user.picture}
                  alt={`${user.given_name || "User"} avatar`}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </span>
            ) : (
              <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center font-bold text-xs">
                {user.given_name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
              </span>
            )}
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-xs font-semibold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
              {user.given_name} {user.family_name}
            </p>
            <p className="text-[11px] text-text-tertiary truncate">{user.email}</p>
          </div>
        </Link>

        <div className="flex items-center justify-between px-1 text-xs">
          <LogoutLink className="inline-flex items-center gap-1.5 text-text-tertiary hover:text-destructive transition-colors text-[11px] font-medium">
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </LogoutLink>
          <span className="text-[10px] text-text-tertiary font-mono">v12.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Left Sidebar ────────────────────────────────────────────── */}
      <aside className="hidden lg:block w-64 shrink-0 bg-surface-0 border-r border-border h-screen sticky top-0 z-40 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* ── Mobile Header & Slide-over Drawer ───────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-40 bg-surface-0/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between shadow-2xs">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Zap className="h-4 w-4 fill-white" />
          </div>
          <span className="font-bold text-base text-text-primary">AuditHQ</span>
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg border border-border bg-surface-1 text-text-secondary hover:text-text-primary cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Slide-Over */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
              <div className="w-screen max-w-xs bg-surface-0 border-r border-border shadow-2xl">
                {sidebarContent}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
