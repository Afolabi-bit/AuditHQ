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
} from "lucide-react";
import { Button } from "../ui/button";
import { generateReportPDF } from "@/lib/generate-report-pdf";

interface ReportHeaderProps {
  testId: number;
  url: string;
  device: string;
  network?: string;
  createdAt: string | Date;
  rawReport: any;
  isPublic?: boolean;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  testId,
  url,
  device,
  network,
  createdAt,
  rawReport,
  isPublic = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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
      await generateReportPDF(testId, url, device, network, createdAt, rawReport);
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const isDesktop = device?.toLowerCase() === "desktop";

  return (
    <div className="bg-[hsl(222,47%,8%)] text-white border-b border-surface-3/30 relative overflow-hidden w-full max-w-full">
      {/* Ambient subtle glow */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-brand-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 relative w-full min-w-0">
        {/* Navigation & Public Indicator */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          {isPublic ? (
            <Link
              href="/"
              className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white transition-colors gap-2 group"
            >
              <div className="h-6 w-6 rounded-md bg-brand-600 flex items-center justify-center text-white">
                <Zap className="h-3.5 w-3.5 fill-white" />
              </div>
              <span className="font-bold tracking-tight">AuditHQ Public Report</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transform group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
          )}

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/5 border border-white/10 text-brand-200">
              <Activity className="h-3 w-3 mr-1.5 text-brand-500" />
              Lighthouse 12 Engine
            </span>
            <span className="text-[11px] font-mono text-slate-400">Audit #{testId}</span>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 min-w-0 w-full">
          <div className="space-y-3 max-w-3xl min-w-0 flex-1">
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-brand-400 font-semibold">
                Audited Endpoint
              </p>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono break-all">
                  {url}
                </h1>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white transition-colors shrink-0"
                  title="Open live website in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                {isDesktop ? (
                  <Monitor className="h-3.5 w-3.5 text-brand-400" />
                ) : (
                  <Smartphone className="h-3.5 w-3.5 text-brand-400" />
                )}
                {isDesktop ? "Desktop Chrome" : "Mobile Moto G4"}
              </span>

              {network && (
                <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                  Network: {network}
                </span>
              )}

              <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-slate-400">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>

              <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-slate-400">
                <Clock className="h-3 w-3" />
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Action Buttons with clear Visual Hierarchy */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0">
            {/* Share Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyShareLink}
              className="bg-white/5 hover:bg-white/10 text-slate-200 border-white/15 h-9 rounded-xl font-semibold text-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                  Share Report
                </>
              )}
            </Button>

            {/* Export JSON */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="bg-white/5 hover:bg-white/10 text-slate-200 border-white/15 h-9 rounded-xl font-semibold text-xs transition-colors"
            >
              <FileCode className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              JSON
            </Button>

            {/* Download PDF — PRIMARY CTA */}
            <Button
              size="sm"
              onClick={handleExportPdf}
              disabled={isGeneratingPdf}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs h-9 px-4 rounded-xl shadow-brand transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
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
                <Button size="sm" className="bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs h-9 px-4 rounded-xl shadow-xs transition-all">
                  <Zap className="h-3.5 w-3.5 mr-1.5 fill-slate-950" />
                  Audit Your Site Free
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button size="sm" className="bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs h-9 px-4 rounded-xl shadow-xs transition-all">
                  <RotateCw className="h-3.5 w-3.5 mr-1.5" />
                  New Audit
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
