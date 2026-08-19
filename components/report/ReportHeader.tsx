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
      // Fallback for browsers that block clipboard access
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
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation / Public Tag */}
        <div className="flex items-center justify-between mb-4">
          {isPublic ? (
            <Link
              href="/"
              className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors gap-1.5"
            >
              <Zap className="h-4 w-4 text-blue-600" />
              <span>AuditHQ Public Report</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" />
              Back to Dashboard
            </Link>
          )}

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Activity className="h-3 w-3 mr-1" />
              Lighthouse Cloud Engine
            </span>
            <span className="text-xs text-slate-400">Audit #{testId}</span>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight break-all">
                {url}
              </h1>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                {isDesktop ? (
                  <Monitor className="h-3.5 w-3.5 text-blue-600" />
                ) : (
                  <Smartphone className="h-3.5 w-3.5 text-blue-600" />
                )}
                {isDesktop ? "Desktop Chrome" : "Mobile Emulation"}
              </span>

              {network && (
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                  Network: {network}
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>

              <span className="inline-flex items-center gap-1 text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyShareLink}
              className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5 text-emerald-600" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-1.5 text-slate-500" />
                  Share
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              disabled={isGeneratingPdf}
              className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin text-slate-500" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1.5 text-slate-500" />
                  Download PDF
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
            >
              <Download className="h-4 w-4 mr-1.5 text-slate-500" />
              JSON
            </Button>

            {isPublic ? (
              <Link href="/">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                  <Zap className="h-4 w-4 mr-1.5" />
                  Audit Your Site
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                  <RotateCw className="h-4 w-4 mr-1.5" />
                  New Test
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
