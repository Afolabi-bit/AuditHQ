"use client";

import React from "react";
import Link from "next/link";
import {
  Gauge,
  Pulse,
  Cpu,
  FilmStrip,
  Lightning,
  HardDrives,
  Eye,
  ShieldCheck,
  Stack,
  ArrowLeft,
  X,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { ParsedLighthouseReport } from "@/lib/report-parser";

export type ReportSectionKey =
  | "scorecard"
  | "vitals"
  | "ai"
  | "visual"
  | "opportunities"
  | "network"
  | "a11y"
  | "security"
  | "diagnostics";

interface ReportSidebarProps {
  report: ParsedLighthouseReport;
  activeSection: ReportSectionKey;
  onSelectSection: (section: ReportSectionKey) => void;
  isPublic?: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const ReportCollapsibleSidebar: React.FC<ReportSidebarProps> = ({
  report,
  activeSection,
  onSelectSection,
  isPublic = false,
  mobileOpen,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Critical dot evaluation logic
  const getScoreDot = (score: number) => {
    if (score < 50) return "bg-score-poor";
    if (score < 90) return "bg-score-warn";
    return null;
  };

  const hasVitalsPoor = Object.values(report.metrics).some((m) => m.rating === "poor");
  const hasVitalsWarn = Object.values(report.metrics).some((m) => m.rating === "needs-improvement");
  const vitalsDot = hasVitalsPoor ? "bg-score-poor" : hasVitalsWarn ? "bg-score-warn" : null;

  const totalA11yAndSeo = report.accessibilityIssues.length + report.seoIssues.length;
  const a11yDot = totalA11yAndSeo > 0 ? "bg-score-poor" : null;

  const securityWarnings = report.securityChecks.filter((c) => c.score != null && c.score < 1).length;
  const securityDot = securityWarnings > 0 ? "bg-score-poor" : null;

  const opportunitiesDot = report.opportunities.length > 0 ? "bg-score-warn" : null;
  const diagnosticsDot = report.diagnostics.length > 0 ? "bg-score-warn" : null;

  const navGroups = [
    {
      groupTitle: "Overview",
      items: [
        {
          id: "scorecard" as ReportSectionKey,
          label: "Category Scores",
          icon: <Gauge weight="bold" className="h-4 w-4" />,
          dot: getScoreDot(report.scores.performance),
        },
        {
          id: "vitals" as ReportSectionKey,
          label: "Core Web Vitals",
          icon: <Pulse weight="bold" className="h-4 w-4" />,
          dot: vitalsDot,
        },
        {
          id: "ai" as ReportSectionKey,
          label: "Diagnostics & Fixes",
          icon: <Cpu weight="fill" className="h-4 w-4" />,
          dot: null,
        },
        {
          id: "visual" as ReportSectionKey,
          label: "Visual Filmstrip",
          icon: <FilmStrip weight="bold" className="h-4 w-4" />,
          dot: null,
        },
      ],
    },
    {
      groupTitle: "Audits",
      items: [
        {
          id: "opportunities" as ReportSectionKey,
          label: "Opportunities",
          icon: <Lightning weight="fill" className="h-4 w-4" />,
          dot: opportunitiesDot,
        },
        {
          id: "network" as ReportSectionKey,
          label: "Network Payloads",
          icon: <HardDrives weight="fill" className="h-4 w-4" />,
          dot: null,
        },
        {
          id: "a11y" as ReportSectionKey,
          label: "Accessibility & SEO",
          icon: <Eye weight="bold" className="h-4 w-4" />,
          dot: a11yDot,
        },
        {
          id: "security" as ReportSectionKey,
          label: "Security",
          icon: <ShieldCheck weight="fill" className="h-4 w-4" />,
          dot: securityDot,
        },
        {
          id: "diagnostics" as ReportSectionKey,
          label: "DOM & Diagnostics",
          icon: <Stack weight="bold" className="h-4 w-4" />,
          dot: diagnosticsDot,
        },
      ],
    },
  ];

  const sidebarBody = (
    <div className="h-full flex flex-col justify-between p-3.5 space-y-4">
      <div className="space-y-4">
        {/* Top Header & Collapse Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50 dark:border-white/[0.06]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              {isPublic ? (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
                  Home
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
                  Console
                </Link>
              )}

              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex p-1.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-1 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                title="Collapse Sidebar"
              >
                <CaretLeft weight="bold" className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden lg:flex mx-auto p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-1 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <CaretRight weight="bold" className="h-4 w-4" />
            </button>
          )}

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-1 dark:hover:bg-white/[0.04]"
          >
            <X weight="bold" className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-1.5">
                  {group.groupTitle}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectSection(item.id);
                      onCloseMobile();
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between rounded-xl transition-all cursor-pointer ${
                      isCollapsed ? "p-2.5 justify-center" : "px-3 py-2"
                    } ${
                      isActive
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20 shadow-2xs"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-1/60 dark:hover:bg-white/[0.03] border border-transparent font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 relative">
                      <span className={isActive ? "text-brand-600 dark:text-brand-400" : "text-text-tertiary"}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="truncate text-xs">{item.label}</span>
                      )}

                      {/* Collapsed dot indicator */}
                      {isCollapsed && item.dot && (
                        <span className={`absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full ring-2 ring-background ${item.dot}`} />
                      )}
                    </div>

                    {/* Expanded dot indicator */}
                    {!isCollapsed && item.dot && (
                      <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Collapsible Left Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 bg-surface-0/70 dark:bg-[#080a10]/80 backdrop-blur-xl border-e border-border/60 dark:border-white/[0.07] h-screen sticky top-0 overflow-y-auto z-20 transition-all duration-200 ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        {sidebarBody}
      </aside>

      {/* Mobile Slide-Over Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 start-0 max-w-full flex pe-12">
            <div className="w-screen max-w-xs bg-surface-0/95 dark:bg-[#080a10]/95 backdrop-blur-2xl border-e border-border/60 dark:border-white/[0.07] shadow-2xl animate-in slide-in-from-left duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]">
              {sidebarBody}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

