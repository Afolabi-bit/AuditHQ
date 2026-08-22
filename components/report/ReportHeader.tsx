"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Share2,
  Check,
  RotateCw,
  Monitor,
  Smartphone,
  Clock,
  Calendar,
  Activity,
  Zap,
  Loader2,
  FileCode,
  ArrowRightLeft,
  ChevronDown,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react";
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
    <div className="bg-surface-0 text-text-primary border-b border-border shadow-xs w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full min-w-0">
        {/* Navigation & Public Indicator */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          {isPublic ? (
            <Link
              href="/"
              className="inline-flex items-center text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors gap-2.5 group"
            >
              <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-2xs">
                <Zap className="h-4 w-4 fill-white" />
              </div>
              <span className="font-bold tracking-tight text-sm">AuditHQ Public Report</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Back to Console
            </Link>
          )}

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-brand-50 border border-brand-200 text-brand-500 shadow-2xs">
              <Activity className="h-3.5 w-3.5 mr-1.5 text-brand-500" />
              Lighthouse 12 Engine
            </span>
            <span className="text-xs font-mono text-text-tertiary">Audit #{testId}</span>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8 min-w-0 w-full">
          <div className="space-y-3.5 max-w-3xl min-w-0 flex-1">
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-brand-500 font-bold">
                Audited Endpoint
              </p>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold text-text-primary tracking-tight font-mono break-all">
                  {url}
                </h1>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-tertiary hover:text-brand-500 transition-colors shrink-0"
                  title="Open live website in new tab"
                >
                  <ExternalLink className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-text-secondary">
              <span className="inline-flex items-center gap-1.5 bg-surface-1 border border-border px-2.5 py-1 rounded-md">
                {isDesktop ? (
                  <Monitor className="h-3.5 w-3.5 text-brand-500" />
                ) : (
                  <Smartphone className="h-3.5 w-3.5 text-brand-500" />
                )}
                {isDesktop ? "Desktop Chrome" : "Mobile Moto G4"}
              </span>

              {network && (
                <span className="inline-flex items-center gap-1 bg-surface-1 border border-border px-2.5 py-1 rounded-md">
                  Network: {network}
                </span>
              )}

              <span className="inline-flex items-center gap-1 bg-surface-1 border border-border px-2.5 py-1 rounded-md text-text-tertiary">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>

              <span className="inline-flex items-center gap-1 bg-surface-1 border border-border px-2.5 py-1 rounded-md text-text-tertiary">
                <Clock className="h-3 w-3" />
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0">
            {/* Share Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyShareLink}
              className="bg-surface-0 hover:bg-surface-2 text-text-secondary hover:text-text-primary border-border h-9 rounded-md font-semibold text-xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5 text-score-good" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 mr-1.5 text-text-tertiary" />
                  Share Report
                </>
              )}
            </Button>

            {/* Compare with Another Audit */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCompareOpen(true)}
              className="bg-surface-0 hover:bg-surface-2 text-text-secondary hover:text-text-primary border-border h-9 rounded-md font-semibold text-xs transition-colors cursor-pointer gap-1.5"
              title="Compare this audit against another run"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-brand-500" />
              <span>Compare</span>
            </Button>

            {/* Export JSON */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="bg-surface-0 hover:bg-surface-2 text-text-secondary hover:text-text-primary border-border h-9 rounded-md font-semibold text-xs transition-colors cursor-pointer"
            >
              <FileCode className="h-3.5 w-3.5 mr-1.5 text-text-tertiary" />
              JSON
            </Button>

            {/* Download PDF Dropdown Menu */}
            <div className="relative" ref={pdfMenuRef}>
              <Button
                size="sm"
                onClick={() => setIsPdfMenuOpen((prev) => !prev)}
                disabled={isGeneratingPdf}
                className="bg-brand-600 hover:bg-brand-700 active:bg-brand-900 text-white font-semibold text-xs h-9 px-3.5 rounded-md shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>
                      {activePdfFormat === "basic" ? "Generating 1-Page..." : "Building Whitepaper..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 text-white" />
                    <span>Download PDF</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${
                        isPdfMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </Button>

              {/* Floating Options Menu */}
              {isPdfMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-surface-0 border border-border shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 border-b border-border/70 mb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary font-sans">
                      Select PDF Report Format
                    </p>
                  </div>

                  {/* Option 1: Basic (1 Page) */}
                  <button
                    type="button"
                    onClick={() => handleExportPdf("basic")}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-surface-1 transition-colors flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-text-primary font-sans">
                          Executive Summary
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-brand-50 text-brand-600 border border-brand-200 shrink-0">
                          1 Page
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-tight">
                        Quick overview with score HUD, Core Web Vitals & key diagnosis
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Detailed (Multi-Page Whitepaper) */}
                  <button
                    type="button"
                    onClick={() => handleExportPdf("detailed")}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-surface-1 transition-colors flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-score-good/10 border border-score-good/30 text-score-good flex items-center justify-center shrink-0 group-hover:bg-score-good group-hover:text-white transition-colors">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-text-primary font-sans">
                          Detailed Whitepaper
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-score-good/10 text-score-good border border-score-good/30 shrink-0">
                          Full Audit
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-tight">
                        Comprehensive multi-page audit with diagnostics, opportunities & remediation playbook
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Context Navigation CTA */}
            {isPublic ? (
              <Link href="/">
                <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs h-9 px-4 rounded-md shadow-xs transition-all cursor-pointer">
                  <Zap className="h-3.5 w-3.5 mr-1.5 fill-white" />
                  Audit Your Site Free
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button size="sm" className="bg-surface-2 hover:bg-surface-3 text-text-primary border border-border font-semibold text-xs h-9 px-4 rounded-md shadow-xs transition-all cursor-pointer">
                  <RotateCw className="h-3.5 w-3.5 mr-1.5 text-text-secondary" />
                  New Audit
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      <CompareSelectorModal
        initialBaseId={String(testId)}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        isPublic={isPublic}
      />
    </div>
  );
};
