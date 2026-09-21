"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lightning,
  SquaresFour,
  ArrowsLeftRight,
  User,
  ChartBar,
  SignOut,
  CaretRight,
  List,
  X,
} from "@phosphor-icons/react";
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
      label: "Audits & History",
      href: "/dashboard",
      icon: <SquaresFour weight="fill" className="h-4 w-4" />,
      active: pathname === "/dashboard" || pathname.startsWith("/dashboard/test"),
    },
    {
      label: "Compare Audits",
      href: "/dashboard/compare",
      icon: <ArrowsLeftRight weight="bold" className="h-4 w-4" />,
      active: pathname.startsWith("/dashboard/compare") || pathname.startsWith("/compare"),
    },
    {
      label: "Settings",
      href: "/profile",
      icon: <User weight="fill" className="h-4 w-4" />,
      active: pathname === "/profile" || pathname.startsWith("/profile"),
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4.5">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-8.5 w-8.5 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-700 transition-colors">
              <Lightning weight="fill" className="h-4.5 w-4.5 text-white" />
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
            <X weight="bold" className="h-5 w-5" />
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
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 shadow-2xs font-bold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-1"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={item.active ? "text-brand-600 dark:text-brand-400" : "text-text-tertiary"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <CaretRight
                weight="bold"
                className={`h-3.5 w-3.5 transition-transform ${
                  item.active
                    ? "text-brand-600 dark:text-brand-400 translate-x-0.5"
                    : "text-text-tertiary opacity-40"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Plan / Usage Widget */}
        <div className="bg-surface-1/70 dark:bg-white/[0.03] border border-border/60 dark:border-white/[0.07] rounded-2xl p-4 space-y-3 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ChartBar weight="fill" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-bold text-text-primary">Cloud Plan</span>
            </div>
            <span className="text-[10px] font-mono font-bold score-badge-good px-2.5 py-0.5 rounded-full">
              Developer
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-text-tertiary">
              <span>Monthly quota</span>
              <span>
                {stats.testsThisMonth} / {stats.testsLimit || 100}
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-2 dark:bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Info & Sign Out */}
      <div className="pt-4 border-t border-border/60 dark:border-white/[0.07] space-y-3">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-1/70 dark:hover:bg-white/[0.04] transition-colors group cursor-pointer"
        >
          <div className="relative shrink-0">
            {user?.picture ? (
              <span className="relative w-9 h-9 inline-block rounded-full overflow-hidden ring-1 ring-border/60 group-hover:ring-brand-400 transition-all">
                <Image
                  src={user.picture}
                  alt={user?.given_name || "User"}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </span>
            ) : (
              <span className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center font-bold text-xs">
                {user?.given_name?.[0]?.toUpperCase() || <User weight="bold" className="h-4 w-4" />}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-text-primary truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {user?.given_name} {user?.family_name}
            </p>
            <p className="text-[11px] text-text-tertiary truncate font-mono">
              {user?.email}
            </p>
          </div>
        </Link>

        <LogoutLink className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors border border-transparent hover:border-destructive/20 cursor-pointer">
          <SignOut weight="bold" className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </LogoutLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Rail */}
      <aside className="hidden lg:block w-64 shrink-0 bg-surface-0/80 dark:bg-[#05070a]/90 backdrop-blur-xl border-e border-border/60 dark:border-white/[0.07] h-screen sticky top-0 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-surface-0/80 dark:bg-[#05070a]/90 backdrop-blur-xl border-b border-border/60 dark:border-white/[0.07] px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-xs">
            <Lightning weight="fill" className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-text-primary">AuditHQ</span>
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg border border-border/60 dark:border-white/[0.07] bg-surface-1 text-text-secondary hover:text-text-primary"
        >
          <List weight="bold" className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 start-0 max-w-full flex pe-10">
            <div className="w-screen max-w-xs bg-surface-0/95 dark:bg-[#0c0e14]/95 backdrop-blur-2xl border-e border-border/60 dark:border-white/[0.08] shadow-2xl animate-in slide-in-from-start">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

