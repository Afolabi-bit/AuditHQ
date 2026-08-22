/**
 * lib/pdf/index.ts
 * Orchestrates PDF report generation in two executive formats:
 * 1. "basic"    -> 1-page Executive Summary with score HUD, CWV table, and key findings.
 * 2. "detailed" -> Comprehensive multi-page whitepaper with deep-dive diagnostics & remediation playbook.
 */

import { parseLighthouseReport } from "../report-parser";
import type { AiSummaryData } from "../ai/schema";
import { drawCoverPage }          from "./page-cover";
import { drawCWVPage }            from "./page-cwv";
import { drawOpportunitiesPage }  from "./page-opps";
import { drawResourcesPage }      from "./page-resources";
import { drawBasicReportPage }    from "./page-basic";

export type PdfReportFormat = "basic" | "detailed";

/**
 * Generates and downloads an executive performance report PDF.
 *
 * @param testId      Lighthouse audit ID (shown in header/filename).
 * @param url         Audited URL.
 * @param device      "desktop" | "mobile" — affects emulation label.
 * @param network     Optional network condition string (e.g. "4G").
 * @param createdAt   Audit timestamp (Date or ISO string).
 * @param rawReport   Raw Lighthouse JSON report (lhr object).
 * @param aiSummary   Optional pre-generated AI summary; enriches cover + remediation pages.
 * @param format      "basic" (1 page) | "detailed" (multi-page whitepaper, default).
 */
export async function generateReportPDF(
  testId:    string | number,
  url:       string,
  device:    string,
  network:   string | undefined,
  createdAt: string | Date,
  rawReport: any,
  aiSummary?: AiSummaryData | null,
  format:    PdfReportFormat = "detailed"
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // ── Parse structured data from the raw Lighthouse report ──────────────────
  const parsed = parseLighthouseReport(rawReport);

  // ── Common metadata ───────────────────────────────────────────────────────
  const auditDate     = new Date(createdAt);
  const formattedDate = auditDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const formattedTime = auditDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const isDesktop     = device?.toLowerCase() === "desktop";

  let hostname = url;
  try { hostname = new URL(url).hostname; } catch { /* keep raw url */ }

  if (format === "basic") {
    // ── 1-Page Basic Executive Summary ──────────────────────────────────────
    drawBasicReportPage({
      doc,
      testId,
      url,
      isDesktop,
      network,
      formattedDate,
      formattedTime,
      parsed,
      rawReport,
      aiSummary,
    });
  } else {
    // ── Detailed Multi-Page Whitepaper ──────────────────────────────────────
    const hasPage4 =
      parsed.thirdParties.length > 0 ||
      parsed.resourceSummary.length > 0 ||
      parsed.securityChecks.length > 0 ||
      parsed.seoIssues.length > 0;

    const totalPages = hasPage4 ? 4 : 3;

    // Page 1 — Cover & Executive Summary
    drawCoverPage({
      doc, testId, url, isDesktop, network,
      formattedDate, formattedTime,
      parsed, aiSummary, totalPages,
    });

    // Page 2 — Core Web Vitals Deep Dive
    drawCWVPage({ doc, testId, hostname, parsed, totalPages });

    // Page 3 — Opportunities & AI Remediation
    drawOpportunitiesPage({ doc, testId, hostname, parsed, rawReport, aiSummary, totalPages });

    // Page 4 — Resource & Security Analysis (conditional)
    if (hasPage4) {
      drawResourcesPage({ doc, testId, hostname, parsed, totalPages });
    }
  }

  // ── Save / download ───────────────────────────────────────────────────────
  const suffix = format === "basic" ? "summary" : "detailed";
  try {
    const slug = new URL(url).hostname.replace(/\./g, "-");
    doc.save(`audithq-${suffix}-report-${testId}-${slug}.pdf`);
  } catch {
    doc.save(`audithq-${suffix}-report-${testId}.pdf`);
  }
}
