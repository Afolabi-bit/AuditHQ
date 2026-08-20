"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRightLeft,
  Calendar,
  Globe,
  Monitor,
  Smartphone,
  Share2,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComparisonReport } from "@/lib/comparison/types";
import { useState } from "react";

interface CompareHeaderProps {
  report: ComparisonReport;
  isPublic?: boolean;
}

export const CompareHeader: React.FC<CompareHeaderProps> = ({
  report,
  isPublic = false,
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleSwap = () => {
    const comparePath = isPublic ? "/compare" : "/dashboard/compare";
    router.push(`${comparePath}?base=${report.target.id}&target=${report.base.id}`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/compare?base=${report.base.id}&target=${report.target.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatRunDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <header className="border-b border-border bg-surface-0/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {/* Top bar with back link and actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={isPublic ? "/" : "/dashboard"}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors bg-surface-1 hover:bg-surface-2 px-3 py-1.5 rounded-lg border border-border"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {isPublic ? "AuditHQ Home" : "Dashboard"}
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-border" />

            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">
              <Zap className="h-3.5 w-3.5 fill-brand-500" />
              Audit Regression & Diff Engine
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwap}
              className="h-8.5 text-xs font-semibold gap-1.5 border-border hover:border-brand-300 hover:text-brand-500 transition-colors cursor-pointer"
              title="Swap Base and Target runs"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Swap Runs</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8.5 text-xs font-semibold gap-1.5 border-border cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-score-good" />
                  <span className="text-score-good">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Comparison</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Comparison Hero Header: Base vs Target */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center bg-surface-1 p-3.5 sm:p-4 rounded-xl border border-border">
          {/* Base Run */}
          <div className="md:col-span-5 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-2 text-text-secondary border border-border">
                Base Run (Baseline)
              </span>
              <span className="text-[11px] font-mono text-text-tertiary flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatRunDate(report.base.createdAt)}
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-text-primary truncate font-mono flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-text-tertiary shrink-0" />
              {report.base.url}
            </p>
            <div className="flex items-center gap-2 text-xs text-text-tertiary font-mono">
              <span className="flex items-center gap-1">
                {report.base.device.toLowerCase().includes("mobile") ? (
                  <Smartphone className="h-3.5 w-3.5" />
                ) : (
                  <Monitor className="h-3.5 w-3.5" />
                )}
                {report.base.device}
              </span>
              <span>•</span>
              <span className="font-bold text-text-primary font-sans">
                Score: {report.base.score}/100
              </span>
            </div>
          </div>

          {/* Center VS Indicator with Swap Button */}
          <div className="md:col-span-1 flex justify-center items-center py-1 md:py-0">
            <button
              onClick={handleSwap}
              className="h-8 w-8 rounded-full bg-surface-0 border border-border shadow-xs hover:border-brand-500 hover:text-brand-500 flex items-center justify-center text-xs font-bold text-text-secondary transition-all cursor-pointer group"
              title="Click to Swap Base and Target"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* Target Run */}
          <div className="md:col-span-5 space-y-1 md:text-right">
            <div className="flex items-center gap-2 md:justify-end">
              <span className="text-[11px] font-mono text-text-tertiary flex items-center gap-1 order-2 md:order-1">
                <Calendar className="h-3 w-3" />
                {formatRunDate(report.target.createdAt)}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-500 border border-brand-200 order-1 md:order-2">
                Target Run (Comparison)
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-text-primary truncate font-mono flex items-center gap-1.5 md:justify-end">
              <Globe className="h-4 w-4 text-text-tertiary shrink-0 order-first md:order-last" />
              {report.target.url}
            </p>
            <div className="flex items-center gap-2 text-xs text-text-tertiary font-mono md:justify-end">
              <span className="font-bold text-text-primary font-sans">
                Score: {report.target.score}/100
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {report.target.device.toLowerCase().includes("mobile") ? (
                  <Smartphone className="h-3.5 w-3.5" />
                ) : (
                  <Monitor className="h-3.5 w-3.5" />
                )}
                {report.target.device}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
