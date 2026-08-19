import React from "react";
import { Button } from "../ui/button";
import { Settings, User, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const DashboardNav = ({ user }: { user: KindeUser }) => {
  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AuditHQ
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-between h-[42px] space-x-4">
            <div className="hidden md:flex items-center space-x-6 pr-4 h-full  border-r border-gray-200">
              <Link
                href="/docs"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Docs
              </Link>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex hover:bg-gray-100 "
              asChild
            >
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.given_name} {user?.family_name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <Link
                href="/profile"
                className="rounded-full w-9 h-9 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all"
              >
                {user?.picture ? (
                  <span className="relative w-9 h-9 inline-block rounded-full overflow-hidden ring-1 ring-gray-200">
                    <Image
                      src={user.picture}
                      alt={`${user?.given_name || "User"} profile picture`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    {user?.given_name?.[0]?.toUpperCase() || (
                      <User className="h-5 w-5" />
                    )}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
