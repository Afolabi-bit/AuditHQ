"use client";

import React from "react";
import { Lightning, User } from "@phosphor-icons/react";
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
    <nav className="bg-surface-0/80 backdrop-blur-xl saturate-180 border-b border-border/70 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Brand Logo & Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-6 min-w-0">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 sm:space-x-2.5 group transition-opacity shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background p-1 -m-1"
            >
              <div className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-700 transition-colors">
                <Lightning weight="fill" className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-text-primary">
                AuditHQ
              </span>
              <span className="hidden md:inline-flex items-center text-[10px] font-mono font-medium text-text-tertiary px-1.5 py-0.5 rounded-md bg-surface-1 border border-border/70">
                v1.2
              </span>
            </Link>

            {/* Nav Links (Responsive: Compact on mobile, full label on desktop) */}
            <div className="flex items-center space-x-1 shrink-0">
              <Link
                href="/dashboard"
                className={`min-h-[36px] px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isConsole
                    ? "text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 shadow-2xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-1"
                }`}
              >
                Console
              </Link>
              <Link
                href="/profile"
                className={`min-h-[36px] px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isProfile
                    ? "text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 shadow-2xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-1"
                }`}
              >
                <span className="sm:hidden">Profile</span>
                <span className="hidden sm:inline">Profile & Settings</span>
              </Link>
            </div>
          </div>

          {/* Right Actions & Profile */}
          <div className="flex items-center shrink-0">
            <Link
              href="/profile"
              className={`flex items-center transition-all cursor-pointer group shrink-0 sm:gap-2.5 sm:p-1.5 sm:pe-3 sm:rounded-xl sm:border min-h-[44px] min-w-[44px] justify-center sm:justify-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isProfile
                  ? "sm:bg-brand-50 sm:dark:bg-brand-500/10 sm:border-brand-200 sm:dark:border-brand-500/30 sm:text-brand-600 sm:dark:text-brand-300"
                  : "sm:bg-surface-0 sm:border-border sm:hover:border-brand-200 sm:hover:bg-surface-1"
              }`}
              title="Account Profile & Settings"
              aria-label="Account Profile & Settings"
            >
              <div className="text-end hidden sm:block leading-tight max-w-35 truncate">
                <p className="text-xs font-semibold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                  {user?.given_name} {user?.family_name}
                </p>
                <p className="text-[11px] text-text-tertiary truncate">
                  {user?.email}
                </p>
              </div>

              {/* Clean Avatar Circle with high contrast ring */}
              <div className="relative shrink-0">
                {user?.picture ? (
                  <span className="relative w-8 h-8 inline-block rounded-full overflow-hidden ring-1 ring-border group-hover:ring-brand-400 dark:group-hover:ring-brand-400/60 transition-all">
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
                      <User weight="bold" className="h-4 w-4" />
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

