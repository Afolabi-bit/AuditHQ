"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "../ui/button";
import { generateReportPDF } from "@/lib/generate-report-pdf";
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

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

  const handleExportPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateReportPDF(testId, url, device, network, createdAt, rawReport, aiSummary);
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const isDesktop = device?.toLowerCase() === "desktop";

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

            {/* Download PDF — Primary Action */}
            <Button
              size="sm"
              onClick={handleExportPdf}
              disabled={isGeneratingPdf}
              className="bg-brand-600 hover:bg-brand-700 active:bg-brand-900 text-white font-semibold text-xs h-9 px-4 rounded-md shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin text-white" />
                  Building PDF…
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 mr-1.5 text-white" />
                  Download PDF
                </>
              )}
            </Button>

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
