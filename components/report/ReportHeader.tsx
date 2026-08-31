"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowSquareOut,
  DownloadSimple,
  ShareNetwork,
  Check,
  ArrowsClockwise,
  Desktop,
  DeviceMobile,
  Clock,
  Lightning,
  CircleNotch,
  FileCode,
  ArrowsLeftRight,
  CaretDown,
  FileText,
} from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { generateReportPDF, type PdfReportFormat } from "@/lib/generate-report-pdf";
import { CompareSelectorModal } from "@/components/compare/CompareSelectorModal";

interface ReportHeaderProps {
  testId: string | number;
  url: string;
  device: string;
  network?: string;
  createdAt: string | Date;
  rawReport: any;
  aiSummary?: any | null;
  isPublic?: boolean;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  testId,
  url,
  device,
  network,
  createdAt,
  rawReport,
  aiSummary = null,
  isPublic = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [activePdfFormat, setActivePdfFormat] = useState<PdfReportFormat | null>(null);
  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const pdfMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (pdfMenuRef.current && !pdfMenuRef.current.contains(e.target as Node)) {
        setIsPdfMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPdfMenuOpen(false);
      }
    };

    if (isPdfMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPdfMenuOpen]);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = new Date(createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopyShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/report/${testId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleExportJson = () => {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(rawReport, null, 2));
      const a = document.createElement("a");
      a.setAttribute("href", dataStr);
      a.setAttribute(
        "download",
        `audithq-audit-${testId}-${new URL(url).hostname}.json`
      );
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
        testId,
        url,
        device,
        network,
        createdAt,
        rawReport,
        aiSummary,
        format
      );
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setActivePdfFormat(null);
    }
  };

  const isDesktop = device?.toLowerCase() === "desktop";
  const isGeneratingPdf = activePdfFormat !== null;

  return (
    <header className="bg-surface-0 text-text-primary border-b border-border shadow-2xs sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4.5 space-y-3">
        {/* Top Breadcrumb / Nav Line */}
        <div className="flex items-center justify-between text-xs">
          {isPublic ? (
            <Link
              href="/"
              className="inline-flex items-center text-xs font-bold text-text-secondary hover:text-text-primary transition-colors gap-2"
            >
              <div className="h-6 w-6 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Lightning weight="fill" className="h-3.5 w-3.5 text-white" />
              </div>
              <span>AuditHQ Public Report</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center font-semibold text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 transition-colors gap-1.5"
            >
              <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
              <span>Back to Console</span>
            </Link>
          )}

          <div className="flex items-center gap-2 font-mono text-[11px] text-text-tertiary">
            <span className="px-2 py-0.5 rounded-full bg-surface-1 border border-border">
              Lighthouse 12.0
            </span>
            <span className="hidden sm:inline">#{String(testId).slice(0, 12)}</span>
          </div>
        </div>

        {/* Main Content & Actions Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-0.5">
          {/* Endpoint & Tags */}
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight truncate max-w-xl">
                {url}
              </h1>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-text-tertiary hover:text-brand-600 dark:hover:text-brand-400 transition-colors p-1 rounded-md hover:bg-surface-1 shrink-0"
                title="Open live URL in new tab"
              >
                <ArrowSquareOut weight="bold" className="h-4 w-4" />
              </a>
            </div>

            {/* Compact Metadata Chips */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
              <span className="inline-flex items-center gap-1 bg-surface-1 border border-border px-2 py-0.5 rounded-md">
                {isDesktop ? (
                  <Desktop weight="bold" className="h-3 w-3 text-brand-600 dark:text-brand-400" />
                ) : (
                  <DeviceMobile weight="bold" className="h-3 w-3 text-brand-600 dark:text-brand-400" />
                )}
                {isDesktop ? "Desktop Chrome" : "Mobile"}
              </span>

              {network && (
                <span className="bg-surface-1 border border-border px-2 py-0.5 rounded-md text-text-tertiary">
                  {network}
                </span>
              )}

              <span className="text-text-tertiary">
                {formattedDate} • {formattedTime}
              </span>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-0">
            {/* Share Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyShareLink}
              className="bg-surface-0 hover:bg-surface-1 text-text-secondary hover:text-text-primary border-border h-8.5 px-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check weight="bold" className="h-3.5 w-3.5 mr-1 text-score-good" />
                  Copied!
                </>
              ) : (
                <>
                  <ShareNetwork weight="bold" className="h-3.5 w-3.5 mr-1 text-text-tertiary" />
                  Share
                </>
              )}
            </Button>

            {/* Compare with Another Audit */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCompareOpen(true)}
              className="bg-surface-0 hover:bg-surface-1 text-text-secondary hover:text-text-primary border-border h-8.5 px-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer gap-1"
            >
              <ArrowsLeftRight weight="bold" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>Compare</span>
            </Button>

            {/* Export JSON */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="bg-surface-0 hover:bg-surface-1 text-text-secondary hover:text-text-primary border-border h-8.5 px-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              title="Download raw JSON"
            >
              <FileCode weight="bold" className="h-3.5 w-3.5 text-text-tertiary" />
            </Button>

            {/* Download PDF Dropdown Menu */}
            <div className="relative" ref={pdfMenuRef}>
              <Button
                size="sm"
                disabled={isGeneratingPdf}
                onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs h-8.5 px-3 rounded-xl shadow-xs cursor-pointer gap-1.5"
              >
                {isGeneratingPdf ? (
                  <>
                    <CircleNotch weight="bold" className="h-3.5 w-3.5 animate-spin" />
                    <span>Rendering…</span>
                  </>
                ) : (
                  <>
                    <DownloadSimple weight="bold" className="h-3.5 w-3.5" />
                    <span>PDF</span>
                    <CaretDown weight="bold" className="h-3 w-3 opacity-70" />
                  </>
                )}
              </Button>

              {/* PDF Format Dropdown */}
              {isPdfMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-2xl bg-surface-0 border border-border shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <p className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                    Select PDF Format
                  </p>

                  <button
                    onClick={() => handleExportPdf("basic")}
                    className="w-full px-3.5 py-2 text-left hover:bg-surface-1 transition-colors flex items-start gap-2.5 cursor-pointer text-xs"
                  >
                    <FileText weight="fill" className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text-primary">Executive Summary</p>
                      <p className="text-[11px] text-text-tertiary">1-Page C-level performance briefing</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExportPdf("detailed")}
                    className="w-full px-3.5 py-2 text-left hover:bg-surface-1 transition-colors flex items-start gap-2.5 cursor-pointer text-xs"
                  >
                    <DownloadSimple weight="bold" className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text-primary">Full Technical Audit</p>
                      <p className="text-[11px] text-text-tertiary">Detailed CWVs & payload diagnostics</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Run New Audit */}
            {!isPublic && (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-surface-0 hover:bg-surface-1 text-text-secondary hover:text-text-primary border-border h-8.5 px-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer gap-1"
                >
                  <ArrowsClockwise weight="bold" className="h-3.5 w-3.5 text-text-tertiary" />
                  <span className="hidden sm:inline">New Audit</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      <CompareSelectorModal
        isOpen={isCompareOpen}
        initialBaseId={String(testId)}
        onClose={() => setIsCompareOpen(false)}
        isPublic={isPublic}
      />
    </header>
  );
};

