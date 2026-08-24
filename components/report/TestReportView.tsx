"use client";

import React, { useMemo, useEffect, useState, useRef } from "react";
import { parseLighthouseReport } from "@/lib/report-parser";
import { CategoryScoreRings } from "./CategoryScoreRings";
import { CoreWebVitalsGrid } from "./CoreWebVitalsGrid";
import { VisualExperience } from "./VisualExperience";
import { AiInsightsCard } from "./AiInsightsCard";
import { OpportunitiesTab } from "./OpportunitiesTab";
import { NetworkPayloadTab } from "./NetworkPayloadTab";
import { AuditsListTab } from "./AuditsListTab";
import { SecurityTab } from "./SecurityTab";
import { DiagnosticsTab } from "./DiagnosticsTab";
import {
  ReportCollapsibleSidebar,
  type ReportSectionKey,
} from "./ReportCollapsibleSidebar";
import {
  DiagnosticInspectorDrawer,
  type DiagnosticItemDetail,
} from "./DiagnosticInspectorDrawer";
import {
  AlertCircle,
  Zap,
  Loader2,
  Menu,
  Share2,
  Check,
  Download,
  FileCode,
  ArrowRightLeft,
  ChevronDown,
  FileText,
  ExternalLink,
  Monitor,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAppStore, toStoredTest } from "@/lib/store/useAppStore";
import { generateReportPDF, type PdfReportFormat } from "@/lib/generate-report-pdf";
import { CompareSelectorModal } from "@/components/compare/CompareSelectorModal";

interface TestReportViewProps {
  test: {
    id: string | number;
    status: string;
    errorMessage?: string | null;
    performanceScore: number | null;
    fcp: number | null;
    lcp: number | null;
    tbt: number | null;
    cls: number | null;
    fullReport: any;
    aiSummary?: any;
    createdAt: Date | string;
    domain: {
      id: string | number;
      url: string;
      device: string;
      network: string;
    };
  };
  isPublic?: boolean;
}

export const TestReportView: React.FC<TestReportViewProps> = ({
  test,
  isPublic = false,
}) => {
  const [inspectedItem, setInspectedItem] = useState<DiagnosticItemDetail | null>(null);
  const [activeSection, setActiveSection] = useState<ReportSectionKey>("scorecard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePdfFormat, setActivePdfFormat] = useState<PdfReportFormat | null>(null);
  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const pdfMenuRef = useRef<HTMLDivElement>(null);

  // Close PDF dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (pdfMenuRef.current && !pdfMenuRef.current.contains(e.target as Node)) {
        setIsPdfMenuOpen(false);
      }
    };
    if (isPdfMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isPdfMenuOpen]);

  // Sync loaded test & AI summary into Zustand localStorage store
  useEffect(() => {
    if (test.status === "completed") {
      useAppStore.getState().upsertTest(toStoredTest(test));
      if (test.aiSummary) {
        useAppStore.getState().setAiSummaryOnce(String(test.id), test.aiSummary);
      }
    }
  }, [test.id, test.status, test.aiSummary]);

  const parsedReport = useMemo(() => {
    return parseLighthouseReport(test.fullReport);
  }, [test.fullReport]);

  const formattedDate = new Date(test.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const isDesktop = test.domain.device?.toLowerCase() === "desktop";

  const handleCopyShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/report/${test.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleExportJson = () => {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(test.fullReport, null, 2));
      const a = document.createElement("a");
      a.setAttribute("href", dataStr);
      a.setAttribute("download", `audithq-${test.id}-${new URL(test.domain.url).hostname}.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("Export JSON error:", e);
    }
  };

  const handleExportPdf = async (format: PdfReportFormat) => {
    setActivePdfFormat(format);
    setIsPdfMenuOpen(false);
    try {
      await generateReportPDF(
        test.id,
        test.domain.url,
        test.domain.device,
        test.domain.network,
        test.createdAt,
        test.fullReport,
        test.aiSummary,
        format
      );
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setActivePdfFormat(null);
    }
  };

  if (test.status !== "completed") {
    const isPending = test.status === "pending";

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center w-full max-w-full">
        <div className="max-w-md w-full rounded-2xl bg-surface-0 border border-border p-8 shadow-xs space-y-5">
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center mx-auto border ${
              isPending
                ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border-brand-200 dark:border-brand-500/30"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <AlertCircle className="h-7 w-7" />
            )}
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-text-primary">
              {isPending ? "Cloud Audit in Progress…" : "Audit Encountered an Issue"}
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isPending
                ? "Lighthouse 12.0 engine is executing headless simulations. This page will update automatically upon completion."
                : test.errorMessage ||
                  "This audit could not be completed. Check the domain URL or try running the test again."}
            </p>
          </div>
          <div className="pt-2">
            <Link href={isPublic ? "/" : "/dashboard"}>
              <Button
                size="sm"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl px-5 h-10 cursor-pointer shadow-xs"
              >
                {isPublic ? "Return to AuditHQ Home" : "Return to Dashboard"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sectionTitles: Record<ReportSectionKey, { title: string; subtitle: string }> = {
    scorecard: {
      title: "Executive Health Scorecard",
      subtitle: "Multi-dimensional Lighthouse 12.0 category assessment and composite performance index",
    },
    vitals: {
      title: "Core Web Vitals & Diagnostic Metrics",
      subtitle: "Official Google ranking vitals, main-thread responsiveness, and rendering milestones",
    },
    ai: {
      title: "AI Performance Diagnostics & Remediation",
      subtitle: "Automated root-cause analysis, projected ROI speed lift, and framework-specific code fixes",
    },
    visual: {
      title: "Visual Load Experience & Filmstrip",
      subtitle: "Step-by-step visual progression player and high-resolution full-page screenshot",
    },
    opportunities: {
      title: "Optimization Opportunities & Savings",
      subtitle: "Actionable recommendations to reclaim wasted network payload bytes and reduce render delays",
    },
    network: {
      title: "Network Payloads & Third-Party Overhead",
      subtitle: "Asset distribution, MIME type breakdown, and third-party script latency analysis",
    },
    a11y: {
      title: "Accessibility & SEO Compliance",
      subtitle: "WCAG 2.1 contrast ratios, ARIA attribute validation, and search crawlability audit",
    },
    security: {
      title: "Security Checks & Vulnerability Audits",
      subtitle: "HTTPS enforcement, CSP headers, cross-origin isolation, and JavaScript library checks",
    },
    diagnostics: {
      title: "Engine Diagnostics & DOM Health",
      subtitle: "Detailed runtime breakdown of main-thread execution, layout shifts, and DOM element nodes",
    },
  };

  const activeMeta = sectionTitles[activeSection];

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row overflow-hidden bg-background text-foreground">
      {/* ── 1. Static Fixed Left Sidebar (Pure Navigation) ────────────────── */}
      <ReportCollapsibleSidebar
        report={parsedReport}
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        isPublic={isPublic}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* ── 2. Main Content Viewport ───────────────────────────────────────── */}
      <div className="flex-1 min-w-0 h-full overflow-y-auto flex flex-col">
        {/* Mobile Header Bar with Hamburger */}
        <div className="lg:hidden sticky top-0 z-30 bg-surface-0/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-border bg-surface-1 text-text-secondary hover:text-text-primary cursor-pointer shrink-0"
              title="Open Navigation"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <span className="font-bold text-sm text-text-primary truncate">
              {test.domain.url}
            </span>
          </div>

          <span className="text-xs font-mono font-bold score-badge-good px-2.5 py-0.5 rounded-full shrink-0">
            {parsedReport.scores.performance}/100
          </span>
        </div>

        {/* Spacious Main Reading Canvas */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
          {/* ── Prominent Top Action & Sharing Bar ─────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            {/* Left: Audited Endpoint & Context */}
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight truncate max-w-md" title={test.domain.url}>
                  {test.domain.url}
                </h2>
                <a
                  href={test.domain.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-md hover:bg-surface-1 shrink-0"
                  title="Open live URL"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <span className="inline-flex items-center gap-1 font-medium">
                  {isDesktop ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                  {isDesktop ? "Desktop Chrome" : "Mobile Simulation"}
                </span>
                <span>•</span>
                <span>{formattedDate}</span>
                <span>•</span>
                <span className="font-mono">Audit #{String(test.id).slice(0, 10)}</span>
              </div>
            </div>

            {/* Right: Prominent Sharing & Download Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Share Report */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyShareLink}
                className="h-8.5 px-3 rounded-lg text-xs font-semibold border-border bg-surface-0 hover:bg-surface-1 text-text-secondary hover:text-text-primary cursor-pointer shadow-2xs gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-score-good" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-text-tertiary" />
                    <span>Share</span>
                  </>
                )}
              </Button>

              {/* Compare Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCompareOpen(true)}
                className="h-8.5 px-3 rounded-lg text-xs font-semibold border-border bg-surface-0 hover:bg-surface-1 text-text-secondary hover:text-text-primary cursor-pointer shadow-2xs gap-1.5"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                <span>Compare</span>
              </Button>

              {/* PDF Download Dropdown */}
              <div className="relative" ref={pdfMenuRef}>
                <Button
                  size="sm"
                  disabled={activePdfFormat !== null}
                  onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                  className="h-8.5 px-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs cursor-pointer gap-1.5"
                >
                  {activePdfFormat ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Exporting…</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      <span>Export PDF</span>
                      <ChevronDown className="h-3 w-3 opacity-80" />
                    </>
                  )}
                </Button>

                {isPdfMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-surface-0 border border-border shadow-xl py-1.5 z-50 animate-in fade-in duration-100">
                    <button
                      onClick={() => handleExportPdf("basic")}
                      className="w-full px-3 py-2 text-left hover:bg-surface-1 transition-colors flex items-start gap-2 cursor-pointer text-xs"
                    >
                      <FileText className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-text-primary">Executive Summary</p>
                        <p className="text-[10px] text-text-tertiary">1-Page C-level performance brief</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleExportPdf("detailed")}
                      className="w-full px-3 py-2 text-left hover:bg-surface-1 transition-colors flex items-start gap-2 cursor-pointer text-xs"
                    >
                      <Download className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-text-primary">Full Technical Audit</p>
                        <p className="text-[10px] text-text-tertiary">Comprehensive whitepaper</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* JSON Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJson}
                className="h-8.5 px-2.5 rounded-lg border-border bg-surface-0 hover:bg-surface-1 text-text-secondary hover:text-text-primary cursor-pointer shadow-2xs"
                title="Download raw Lighthouse JSON"
              >
                <FileCode className="h-3.5 w-3.5 text-text-tertiary" />
              </Button>
            </div>
          </div>

          {/* Active Section Header Bar */}
          <div className="space-y-1 pb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              {activeMeta.title}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              {activeMeta.subtitle}
            </p>
          </div>

          {/* Active Section Content Container */}
          <div className="space-y-8 pb-12">
            {/* Section 1: Executive Scorecard */}
            {activeSection === "scorecard" && (
              <div className="animate-in fade-in duration-200">
                <CategoryScoreRings scores={parsedReport.scores} />
              </div>
            )}

            {/* Section 2: Core Web Vitals */}
            {activeSection === "vitals" && (
              <div className="animate-in fade-in duration-200">
                <CoreWebVitalsGrid metrics={parsedReport.metrics} />
              </div>
            )}

            {/* Section 3: AI Insights */}
            {activeSection === "ai" && (
              <div className="animate-in fade-in duration-200">
                <AiInsightsCard
                  testId={test.id}
                  initialSummary={test.aiSummary}
                  isPublic={isPublic}
                />
              </div>
            )}

            {/* Section 4: Filmstrip Timeline */}
            {activeSection === "visual" && (
              <div className="animate-in fade-in duration-200">
                <VisualExperience
                  filmstrip={parsedReport.filmstrip}
                  fullPageScreenshot={parsedReport.fullPageScreenshot}
                  url={test.domain.url}
                />
              </div>
            )}

            {/* Section 5: Opportunities */}
            {activeSection === "opportunities" && (
              <div className="animate-in fade-in duration-200">
                <OpportunitiesTab
                  opportunities={parsedReport.opportunities}
                  diagnostics={parsedReport.diagnostics}
                  onInspectItem={(item) => setInspectedItem(item)}
                />
              </div>
            )}

            {/* Section 6: Network Payloads */}
            {activeSection === "network" && (
              <div className="animate-in fade-in duration-200">
                <NetworkPayloadTab
                  resourceSummary={parsedReport.resourceSummary}
                  totalByteWeight={parsedReport.totalByteWeight}
                  thirdParties={parsedReport.thirdParties}
                />
              </div>
            )}

            {/* Section 7: Accessibility & SEO */}
            {activeSection === "a11y" && (
              <div className="animate-in fade-in duration-200">
                <AuditsListTab
                  accessibilityIssues={parsedReport.accessibilityIssues}
                  seoIssues={parsedReport.seoIssues}
                />
              </div>
            )}

            {/* Section 8: Security */}
            {activeSection === "security" && (
              <div className="animate-in fade-in duration-200">
                <SecurityTab securityChecks={parsedReport.securityChecks} />
              </div>
            )}

            {/* Section 9: Diagnostics */}
            {activeSection === "diagnostics" && (
              <div className="animate-in fade-in duration-200">
                <DiagnosticsTab
                  diagnostics={parsedReport.diagnostics}
                  onInspectItem={(item) => setInspectedItem(item)}
                />
              </div>
            )}
          </div>

          {/* Public Footer CTA Banner (if viewed publicly) */}
          {isPublic && (
            <div className="mt-12 bg-linear-to-br from-brand-600 to-brand-700 dark:bg-surface-0 dark:from-surface-0 dark:to-surface-0 border border-border rounded-3xl p-8 sm:p-10 text-center text-white space-y-4 shadow-xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Optimize your website performance with AuditHQ
              </h3>
              <p className="text-white/90 text-sm max-w-xl mx-auto leading-relaxed">
                Run automated Lighthouse cloud audits, track Core Web Vitals over time, and get instant recommendations to build faster web experiences.
              </p>
              <div className="pt-3">
                <Link href="/">
                  <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-100 font-extrabold shadow-md rounded-xl cursor-pointer px-7 h-12">
                    <Zap className="h-4 w-4 mr-2 fill-current" />
                    Run Free Audit Now
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Slide-Over Contextual Diagnostic Inspector Drawer */}
      <DiagnosticInspectorDrawer
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
      />

      {/* Compare Modal */}
      {isCompareOpen && (
        <CompareSelectorModal
          isOpen={isCompareOpen}
          initialBaseId={String(test.id)}
          onClose={() => setIsCompareOpen(false)}
          isPublic={isPublic}
        />
      )}
    </div>
  );
};
