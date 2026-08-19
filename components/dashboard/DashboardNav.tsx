"use client";

import React from "react";
import { Zap, User, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { KindeUser, LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

const DashboardNav = ({ user }: { user: KindeUser }) => {
  return (
    <nav className="bg-surface-0 border-b border-surface-3 sticky top-0 z-50 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2.5 group transition-opacity"
            >
              <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-brand">
                <Zap className="h-4 w-4 fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-text-primary font-sans">
                AuditHQ
              </span>
            </Link>

            <div className="hidden sm:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-xs font-semibold text-brand-600 border-b-2 border-brand-600 rounded-t"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Right Actions & User Profile */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 pl-3 border-l border-surface-3">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-xs font-semibold text-text-primary">
                  {user?.given_name} {user?.family_name}
                </p>
                <p className="text-[11px] text-text-tertiary font-mono">
                  {user?.email}
                </p>
              </div>

              <div className="relative">
                {user?.picture ? (
                  <span className="relative w-8 h-8 inline-block rounded-full overflow-hidden ring-1 ring-surface-3">
                    <Image
                      src={user.picture}
                      alt={`${user?.given_name || "User"} profile picture`}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center font-bold text-xs">
                    {user?.given_name?.[0]?.toUpperCase() || (
                      <User className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>

              <LogoutLink
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-text-tertiary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </LogoutLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
