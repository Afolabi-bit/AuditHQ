"use client";

import React from "react";
import { Zap, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const DashboardNav = ({ user }: { user: KindeUser }) => {
  const pathname = usePathname();

  const isConsole = pathname === "/dashboard" || pathname.startsWith("/dashboard/test");
  const isProfile = pathname === "/dashboard/profile";

  return (
    <nav className="bg-white border-b border-[#e3e8ee] sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-15">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2.5 group transition-opacity"
            >
              <div className="h-8 w-8 rounded-lg bg-[#635bff] flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition-colors">
                <Zap className="h-4.5 w-4.5 fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#0a2540] font-sans">
                AuditHQ
              </span>
            </Link>

            <div className="flex items-center space-x-1">
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  isConsole
                    ? "text-[#635bff] bg-[#f0f2ff] border border-brand-200/60 shadow-xs"
                    : "text-[#425466] hover:text-[#0a2540] hover:bg-[#f8fafc]"
                }`}
              >
                Console
              </Link>
              <Link
                href="/dashboard/profile"
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  isProfile
                    ? "text-[#635bff] bg-[#f0f2ff] border border-brand-200/60 shadow-xs"
                    : "text-[#425466] hover:text-[#0a2540] hover:bg-[#f8fafc]"
                }`}
              >
                Profile & Settings
              </Link>
            </div>
          </div>

          {/* Right Actions & Interactive Profile Pill */}
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/profile"
              className={`flex items-center space-x-3 p-1.5 pr-2.5 rounded-xl border transition-all cursor-pointer group ${
                isProfile
                  ? "bg-[#f0f2ff] border-brand-200 text-[#635bff]"
                  : "bg-white border-transparent hover:border-[#e3e8ee] hover:bg-[#f8fafc]"
              }`}
              title="View Account Profile"
            >
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-xs font-semibold text-[#0a2540] group-hover:text-[#635bff] transition-colors">
                  {user?.given_name} {user?.family_name}
                </p>
                <p className="text-[11px] text-[#8898aa] font-mono">
                  {user?.email}
                </p>
              </div>

              <div className="relative">
                {user?.picture ? (
                  <span className="relative w-8 h-8 inline-block rounded-full overflow-hidden ring-1 ring-[#e3e8ee] group-hover:ring-brand-200 transition-all">
                    <Image
                      src={user.picture}
                      alt={`${user?.given_name || "User"} profile picture`}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="w-8 h-8 rounded-full bg-[#f0f2ff] text-[#635bff] border border-brand-200 flex items-center justify-center font-bold text-xs group-hover:bg-[#e0e4ff] transition-all">
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
