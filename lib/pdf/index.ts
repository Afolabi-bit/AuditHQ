/**
 * lib/pdf/index.ts
 * Orchestrates the multi-page PDF report by composing individual page renderers.
 * This is the only public export surface for the pdf module.
 */

import { parseLighthouseReport } from "../report-parser";
import type { AiSummaryData } from "../ai/schema";
import { drawCoverPage }       from "./page-cover";
import { drawCWVPage }         from "./page-cwv";
import { drawOpportunitiesPage } from "./page-opps";
import { drawResourcesPage }   from "./page-resources";

/**
 * Generates and downloads a multi-page A4 executive performance report PDF.
 *
 * @param testId      Lighthouse audit ID (shown in header/filename).
 * @param url         Audited URL.
 * @param device      "desktop" | "mobile" — affects emulation label.
 * @param network     Optional network condition string (e.g. "4G").
 * @param createdAt   Audit timestamp (Date or ISO string).
 * @param rawReport   Raw Lighthouse JSON report (lhr object).
 * @param aiSummary   Optional pre-generated AI summary; enriches cover + remediation pages.
 */
export async function generateReportPDF(
  testId:    string | number,
  url:       string,
  device:    string,
  network:   string | undefined,
  createdAt: string | Date,
  rawReport: any,
  aiSummary?: AiSummaryData | null
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // ── Parse structured data from the raw Lighthouse report ──────────────────
  const parsed = parseLighthouseReport(rawReport);

  // ── Common metadata ───────────────────────────────────────────────────────
  const auditDate    = new Date(createdAt);
  const formattedDate = auditDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const formattedTime = auditDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const isDesktop    = device?.toLowerCase() === "desktop";

  let hostname = url;
  try { hostname = new URL(url).hostname; } catch { /* keep raw url */ }

  // ── Page 4 is conditional (only when substantive data exists) ─────────────
  const hasPage4 =
    parsed.thirdParties.length > 0 ||
    parsed.resourceSummary.length > 0 ||
    parsed.securityChecks.length > 0 ||
    parsed.seoIssues.length > 0;

  const totalPages = hasPage4 ? 4 : 3;

  // ── Page 1 — Cover & Executive Summary ───────────────────────────────────
  drawCoverPage({
    doc, testId, url, isDesktop, network,
    formattedDate, formattedTime,
    parsed, aiSummary, totalPages,
  });

  // ── Page 2 — Core Web Vitals Deep Dive ───────────────────────────────────
  drawCWVPage({ doc, testId, hostname, parsed, totalPages });

  // ── Page 3 — Opportunities & AI Remediation ───────────────────────────────
  drawOpportunitiesPage({ doc, testId, hostname, parsed, rawReport, aiSummary, totalPages });

  // ── Page 4 — Resource & Security Analysis (conditional) ───────────────────
  if (hasPage4) {
    drawResourcesPage({ doc, testId, hostname, parsed, totalPages });
  }

  // ── Save / download ───────────────────────────────────────────────────────
  try {
    const slug = new URL(url).hostname.replace(/\./g, "-");
    doc.save(`audithq-report-${testId}-${slug}.pdf`);
  } catch {
    doc.save(`audithq-report-${testId}.pdf`);
  }
}
