"use client";

import React from "react";
import { Zap, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const DashboardNav = ({ user }: { user: KindeUser }) => {
  const pathname = usePathname();

  const isConsole =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/test");
  const isProfile = pathname === "/profile" || pathname.startsWith("/profile");

  return (
    <nav className="bg-surface-0/90 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Brand Logo & Navigation */}
          <div className="flex items-center space-x-4 sm:space-x-8 min-w-0">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2.5 group transition-opacity shrink-0"
            >
              <div className="h-8.5 w-8.5 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-700 transition-colors">
                <Zap className="h-4.5 w-4.5 fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-text-primary">
                AuditHQ
              </span>
            </Link>

            {/* Desktop / Tablet Nav Links (Hidden on Mobile) */}
            <div className="hidden sm:flex items-center space-x-1 shrink-0">
              <Link
                href="/dashboard"
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isConsole
                    ? "text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-1"
                }`}
              >
                Console
              </Link>
              <Link
                href="/profile"
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isProfile
                    ? "text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-1"
                }`}
              >
                Profile & Settings
              </Link>
            </div>
          </div>

          {/* Right Actions & Profile (Avatar on mobile, Avatar + Name on desktop) */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/profile"
              className={`flex items-center space-x-2.5 p-1 sm:p-1.5 sm:pr-3 rounded-xl border transition-all cursor-pointer group shrink-0 ${
                isProfile
                  ? "bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/30 text-brand-600 dark:text-brand-300"
                  : "bg-surface-0 border-border hover:border-brand-200 hover:bg-surface-1"
              }`}
              title="Account Profile & Settings"
            >
              <div className="text-right hidden sm:block leading-tight max-w-35 truncate">
                <p className="text-xs font-semibold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                  {user?.given_name} {user?.family_name}
                </p>
                <p className="text-[11px] text-text-tertiary truncate">
                  {user?.email}
                </p>
              </div>

              <div className="relative shrink-0">
                {user?.picture ? (
                  <span className="relative w-8 h-8 inline-block rounded-full overflow-hidden ring-1 ring-border group-hover:ring-brand-300 transition-all">
                    <Image
                      src={user.picture}
                      alt={`${user?.given_name || "User"} avatar`}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center font-bold text-xs group-hover:bg-brand-100 transition-all">
                    {user?.given_name?.[0]?.toUpperCase() || (
                      <User className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
