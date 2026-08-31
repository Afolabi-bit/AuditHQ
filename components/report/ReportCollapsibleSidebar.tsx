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
          label: "Executive Scorecard",
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
          label: "Automated Diagnostics",
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
          label: "Security Checks",
          icon: <ShieldCheck weight="fill" className="h-4 w-4" />,
          dot: securityDot,
        },
        {
          id: "diagnostics" as ReportSectionKey,
          label: "Diagnostics",
          icon: <Stack weight="bold" className="h-4 w-4" />,
          dot: diagnosticsDot,
        },
      ],
    },
  ];

  const sidebarBody = (
    <div className="h-full flex flex-col justify-between p-3 space-y-4">
      <div className="space-y-4">
        {/* Top Header & Collapse Toggle */}
        <div className="flex items-center justify-between pb-2 border-b border-border">
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              {isPublic ? (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
                  Home
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
                  Console
                </Link>
              )}

              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-1 cursor-pointer"
                title="Collapse Sidebar"
              >
                <CaretLeft weight="bold" className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden lg:flex mx-auto p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-1 cursor-pointer"
              title="Expand Sidebar"
            >
              <CaretRight weight="bold" className="h-4 w-4" />
            </button>
          )}

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-1"
          >
            <X weight="bold" className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-0.5">
              {!isCollapsed && (
                <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-1">
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
                    className={`w-full flex items-center justify-between rounded-lg transition-colors cursor-pointer ${
                      isCollapsed ? "p-2 justify-center" : "px-2.5 py-1.5"
                    } ${
                      isActive
                        ? "bg-surface-2 text-text-primary font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-1 font-normal"
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
                        <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${item.dot}`} />
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
        className={`hidden lg:block shrink-0 bg-surface-0 border-r border-border h-screen sticky top-0 overflow-y-auto z-20 transition-all duration-200 ${
          isCollapsed ? "w-14" : "w-56"
        }`}
      >
        {sidebarBody}
      </aside>

      {/* Mobile Slide-Over Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-12">
            <div className="w-screen max-w-xs bg-surface-0 border-r border-border shadow-xl animate-in slide-in-from-left">
              {sidebarBody}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

