"use client";

import React from "react";
import { Zap, User, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { KindeUser, LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

const DashboardNav = ({ user }: { user: KindeUser }) => {
  return (
    <nav className="bg-white border-b border-[#e3e8ee] sticky top-0 z-50 shadow-[0_1px_2px_rgba(50,50,93,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-15">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2.5 group transition-opacity"
            >
              <div className="h-8 w-8 rounded-lg bg-[#635bff] flex items-center justify-center text-white shadow-sm group-hover:bg-[#5851ea] transition-colors">
                <Zap className="h-4.5 w-4.5 fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#0a2540] font-sans">
                AuditHQ
              </span>
            </Link>

            <div className="hidden sm:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-xs font-semibold text-[#635bff] bg-[#f0f2ff] rounded-md border border-[#c7cefe]/50"
              >
                Console
              </Link>
            </div>
          </div>

          {/* Right Actions & User Profile */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 pl-3 border-l border-[#e3e8ee]">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-xs font-semibold text-[#0a2540]">
                  {user?.given_name} {user?.family_name}
                </p>
                <p className="text-[11px] text-[#8898aa] font-mono">
                  {user?.email}
                </p>
              </div>

              <div className="relative">
                {user?.picture ? (
                  <span className="relative w-8 h-8 inline-block rounded-full overflow-hidden ring-1 ring-[#e3e8ee]">
                    <Image
                      src={user.picture}
                      alt={`${user?.given_name || "User"} profile picture`}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="w-8 h-8 rounded-full bg-[#f0f2ff] text-[#635bff] border border-[#c7cefe] flex items-center justify-center font-bold text-xs">
                    {user?.given_name?.[0]?.toUpperCase() || (
                      <User className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>

              <LogoutLink
                className="inline-flex items-center justify-center h-8 w-8 rounded-md text-[#8898aa] hover:text-[#de350b] hover:bg-[#ffebe6] transition-colors cursor-pointer"
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
