/**
 * lib/pdf/page-opps.ts
 * Draws Page 3: Ranked opportunities table, verified optimizations grid,
 * and the AI-powered remediation playbook (if AI summary is available).
 */

import type { ParsedLighthouseReport } from "../report-parser";
import { formatMilliseconds, formatBytes } from "../report-parser";
import type { AiSummaryData } from "../ai/schema";
import { COLORS } from "./tokens";
import {
  filledRect, filledRoundRect, strokedRoundRect,
  textColor, hLine, drawStatusPill,
} from "./primitives";
import { PAGE_W, MARGIN, CONTENT_W, drawFooter, drawSectionDivider, drawPageMiniHeader, trunc, wrapText } from "./layout";

interface OppsPageArgs {
  doc:        any;
  testId:     string | number;
  hostname:   string;
  parsed:     ParsedLighthouseReport;
  rawReport:  any;
  aiSummary:  AiSummaryData | null | undefined;
  totalPages: number;
}

/** Maps a 0–1 Lighthouse score to an urgency string. */
function urgencyByScore(score: number | null): "High" | "Medium" | "Low" {
  if (score === null) return "Medium";
  if (score < 0.5)  return "High";
  if (score < 0.75) return "Medium";
  return "Low";
}

/** Returns fill/dark colors for High/Medium/Low urgency. */
function urgencyTheme(urgency: string) {
  if (urgency === "High")   return { fill: COLORS.rose,  dark: [153, 27, 27] as [number, number, number] };
  if (urgency === "Medium") return { fill: COLORS.amber, dark: [120, 53, 15] as [number, number, number] };
  return                    { fill: COLORS.brand, dark: [30, 64, 175]  as [number, number, number] };
}

export function drawOpportunitiesPage({
  doc, testId, hostname, parsed, rawReport, aiSummary, totalPages,
}: OppsPageArgs): void {
  doc.addPage();

  drawPageMiniHeader(doc, testId, hostname, "Opportunities & Recommendations");

  let y = 18;

  // ── 3a. Opportunities table ───────────────────────────────────────────────
  const topOpps = parsed.opportunities.slice(0, 6);
  y = drawSectionDivider(
    doc, y,
    "PERFORMANCE OPPORTUNITIES",
    `${topOpps.length} actionable bottlenecks identified · Ranked by potential impact`
  );

  if (topOpps.length > 0) {
    // Header row
    filledRect(doc, MARGIN, y, CONTENT_W, 7.5, COLORS.slate100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    textColor(doc, COLORS.muted);
    doc.text("#",           MARGIN + 3,                y + 5);
    doc.text("OPPORTUNITY", MARGIN + 10,               y + 5);
    doc.text("SAVINGS",     MARGIN + CONTENT_W * 0.62, y + 5);
    doc.text("SIZE SAVED",  MARGIN + CONTENT_W * 0.78, y + 5);
    doc.text("URGENCY",     MARGIN + CONTENT_W * 0.89, y + 5);
    y += 7.5;

    topOpps.forEach((opp, idx) => {
      const rowH    = 11;
      const urgency = urgencyByScore(opp.score);
      const ut      = urgencyTheme(urgency);

      filledRect(doc, MARGIN, y, CONTENT_W, rowH, idx % 2 === 0 ? COLORS.slate50 : COLORS.white);
      filledRect(doc, MARGIN, y, 2, rowH, ut.fill);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      textColor(doc, COLORS.muted);
      doc.text(String(idx + 1).padStart(2, "0"), MARGIN + 3.5, y + 7.5);

      textColor(doc, COLORS.ink);
      doc.text(trunc(opp.title, 42), MARGIN + 10, y + 5.2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.8);
      textColor(doc, COLORS.muted);
      doc.text(trunc(opp.description, 65), MARGIN + 10, y + 9.5);

      // Time savings
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      textColor(doc, COLORS.emerald);
      if (opp.overallSavingsMs && opp.overallSavingsMs > 0) {
        doc.text(`−${formatMilliseconds(opp.overallSavingsMs)}`, MARGIN + CONTENT_W * 0.62, y + 7.5);
      } else if (opp.displayValue) {
        doc.setFontSize(6.5);
        doc.text(trunc(opp.displayValue, 18), MARGIN + CONTENT_W * 0.62, y + 7.5);
      } else {
        textColor(doc, COLORS.muted);
        doc.setFontSize(6.5);
        doc.text("—", MARGIN + CONTENT_W * 0.62, y + 7.5);
      }

      // Byte savings
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      textColor(doc, COLORS.muted);
      doc.text(
        opp.overallSavingsBytes && opp.overallSavingsBytes > 0
          ? `−${formatBytes(opp.overallSavingsBytes)}`
          : "—",
        MARGIN + CONTENT_W * 0.78, y + 7.5
      );

      drawStatusPill(doc, MARGIN + CONTENT_W * 0.88, y + 2.8, urgency, ut.fill, COLORS.white, 18, 5.2, 6);
      y += rowH;
    });

    hLine(doc, MARGIN, y, MARGIN + CONTENT_W, COLORS.border);
  } else {
    filledRoundRect(doc, MARGIN, y, CONTENT_W, 13, 2, COLORS.emeraldLight);
    strokedRoundRect(doc, MARGIN, y, CONTENT_W, 13, 2, COLORS.emerald, 0.3);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    textColor(doc, [6, 95, 70]);
    doc.text("✓  No significant opportunities detected — site is well-optimized!", MARGIN + 6, y + 8.5);
    y += 13;
  }

  y += 7;

  // ── 3b. Passed audits grid ────────────────────────────────────────────────
  const passedAudits: string[] = [];
  for (const key in (rawReport?.audits || {})) {
    const a = rawReport.audits[key];
    if (a?.score === 1 && a?.title && a.title.length < 55 && !a.title.includes("…")) {
      passedAudits.push(a.title);
      if (passedAudits.length >= 6) break;
    }
  }

  if (passedAudits.length > 0) {
    y = drawSectionDivider(doc, y, "VERIFIED OPTIMIZATIONS", `${passedAudits.length} audits fully passed`);

    const colW2  = (CONTENT_W - 6) / 2;
    const half   = Math.ceil(passedAudits.length / 2);
    const col1   = passedAudits.slice(0, half);
    const col2   = passedAudits.slice(half);
    const lineH  = 7.5;
    const startY = y;

    col1.forEach((p, i) => {
      filledRect(doc, MARGIN, startY + i * lineH, colW2, lineH, i % 2 === 0 ? COLORS.slate50 : COLORS.white);
      filledRect(doc, MARGIN, startY + i * lineH, 2, lineH, COLORS.emerald);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      textColor(doc, COLORS.ink);
      doc.text(trunc(p, 46), MARGIN + 6, startY + i * lineH + 5.2);
    });

    col2.forEach((p, i) => {
      const rx = MARGIN + colW2 + 6;
      filledRect(doc, rx, startY + i * lineH, colW2, lineH, i % 2 === 0 ? COLORS.slate50 : COLORS.white);
      filledRect(doc, rx, startY + i * lineH, 2, lineH, COLORS.emerald);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      textColor(doc, COLORS.ink);
      doc.text(trunc(p, 46), rx + 6, startY + i * lineH + 5.2);
    });

    y = startY + Math.max(col1.length, col2.length) * lineH + 7;
  }

  // ── 3c. AI Remediation Playbook ───────────────────────────────────────────
  if (aiSummary && aiSummary.priorityFixes.length > 0) {
    y = drawSectionDivider(doc, y, "AI-POWERED REMEDIATION PLAYBOOK", "Ranked by ROI · Powered by Google Gemini");

    aiSummary.priorityFixes.slice(0, 3).forEach((fix, idx) => {
      const ut         = urgencyTheme(fix.urgency);
      const problemLines  = wrapText(doc, fix.problem,  CONTENT_W / 2 - 10, 6.5);
      const solutionLines = wrapText(doc, fix.solution, CONTENT_W / 2 - 10, 6.5);
      const boxH = 13 + Math.max(problemLines.length, solutionLines.length) * 4.2 + (fix.wastedFormatted ? 5 : 0);

      filledRoundRect(doc, MARGIN, y, CONTENT_W, boxH, 2.5, COLORS.white);
      strokedRoundRect(doc, MARGIN, y, CONTENT_W, boxH, 2.5, COLORS.border, 0.3);
      filledRect(doc, MARGIN, y, 2.5, boxH, ut.fill);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      textColor(doc, ut.dark);
      doc.text(`FIX ${String(idx + 1).padStart(2, "0")}`, MARGIN + 6, y + 6);

      doc.setFontSize(8);
      textColor(doc, COLORS.ink);
      doc.text(trunc(fix.title, 56), MARGIN + 20, y + 6);

      drawStatusPill(doc, MARGIN + 20, y + 8.5, fix.category, COLORS.slate100, COLORS.muted, 30, 4.8, 5.8);
      drawStatusPill(doc, MARGIN + 53, y + 8.5, fix.urgency,  ut.fill, COLORS.white, 16, 4.8, 5.8);

      if (fix.wastedFormatted) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        textColor(doc, COLORS.emerald);
        doc.text(fix.wastedFormatted, MARGIN + 72, y + 12);
      }

      const bodyY = y + 15.5;
      const solX  = MARGIN + CONTENT_W / 2 + 2;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      textColor(doc, COLORS.muted);
      doc.text("ROOT CAUSE", MARGIN + 6, bodyY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      textColor(doc, COLORS.ink);
      doc.text(problemLines.slice(0, 4), MARGIN + 6, bodyY + 4.5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      textColor(doc, COLORS.brand);
      doc.text("REMEDIATION", solX, bodyY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      textColor(doc, COLORS.ink);
      doc.text(solutionLines.slice(0, 4), solX, bodyY + 4.5);

      y += boxH + 4;
    });

    // Key strengths strip
    if (aiSummary.keyStrengths && aiSummary.keyStrengths.length > 0) {
      filledRoundRect(doc, MARGIN, y, CONTENT_W, 9.5, 2, COLORS.emeraldLight);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      textColor(doc, [6, 95, 70]);
      doc.text("KEY STRENGTHS:", MARGIN + 5, y + 6.5);
      doc.setFont("helvetica", "normal");
      doc.text(aiSummary.keyStrengths.join("  ·  "), MARGIN + 32, y + 6.5);
    }
  }

  drawFooter(doc, 3, totalPages);
}
