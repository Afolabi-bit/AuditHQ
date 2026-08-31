/**
 * lib/pdf/page-resources.ts
 * Draws Page 4 (conditional): Resource payload breakdown, third-party script impact,
 * and the security signals + SEO health two-column panel.
 */

import type { ParsedLighthouseReport } from "../report-parser";
import { formatBytes, formatMilliseconds } from "../report-parser";
import { COLORS } from "./tokens";
import { filledRect, textColor, hLine, drawStatusPill, drawMiniBar } from "./primitives";
import { PAGE_W, MARGIN, CONTENT_W, drawFooter, drawSectionDivider, drawPageMiniHeader, trunc, cleanText } from "./layout";

interface ResourcesPageArgs {
  doc:               any;
  testId:            string | number;
  hostname:          string;
  parsed:            ParsedLighthouseReport;
  totalPages:        number;
}

/** Color per resource type for the bar accent and transfer-size text. */
const RESOURCE_COLORS: Record<string, [number, number, number]> = {
  script:     COLORS.rose,
  stylesheet: COLORS.brand,
  image:      COLORS.amber,
  font:       COLORS.cyan,
  document:   COLORS.emerald,
  media:      COLORS.sky,
  other:      COLORS.muted,
};

export function drawResourcesPage({ doc, testId, hostname, parsed, totalPages }: ResourcesPageArgs): void {
  doc.addPage();

  drawPageMiniHeader(doc, testId, hostname, "Resource & Security Analysis");

  let y = 18;

  // ── 4a. Resource Payload Breakdown ────────────────────────────────────────
  if (parsed.resourceSummary.length > 0) {
    y = drawSectionDivider(
      doc, y,
      "RESOURCE PAYLOAD BREAKDOWN",
      `Total transferred: ${cleanText(formatBytes(parsed.totalByteWeight))}`
    );

    filledRect(doc, MARGIN, y, CONTENT_W, 7.5, COLORS.slate100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    textColor(doc, COLORS.muted);
    doc.text("RESOURCE TYPE",    MARGIN + 4,                y + 5);
    doc.text("REQUESTS",         MARGIN + CONTENT_W * 0.44, y + 5);
    doc.text("TRANSFER SIZE",    MARGIN + CONTENT_W * 0.58, y + 5);
    doc.text("SHARE OF PAYLOAD", MARGIN + CONTENT_W * 0.72, y + 5);
    y += 7.5;

    parsed.resourceSummary.forEach((res, idx) => {
      const rowH     = 8.5;
      const frac     = parsed.totalByteWeight > 0 ? res.transferSize / parsed.totalByteWeight : 0;
      const barColor = RESOURCE_COLORS[res.resourceType] ?? COLORS.muted;

      filledRect(doc, MARGIN, y, CONTENT_W, rowH, idx % 2 === 0 ? COLORS.slate50 : COLORS.white);
      filledRect(doc, MARGIN, y, 2, rowH, barColor);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      textColor(doc, COLORS.ink);
      doc.text(cleanText(res.label), MARGIN + 6, y + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      textColor(doc, COLORS.muted);
      doc.text(String(res.requestCount), MARGIN + CONTENT_W * 0.44, y + 6);

      doc.setFont("helvetica", "bold");
      textColor(doc, barColor);
      doc.text(cleanText(formatBytes(res.transferSize)), MARGIN + CONTENT_W * 0.58, y + 6);

      // Share bar (placed safely without colliding with percentage text)
      drawMiniBar(doc, MARGIN + CONTENT_W * 0.72, y + 2.8, CONTENT_W * 0.16, 2.8, frac, barColor);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.2);
      textColor(doc, COLORS.muted);
      doc.text(`${Math.round(frac * 100)}%`, MARGIN + CONTENT_W * 0.94, y + 6, { align: "right" });

      y += rowH;
    });

    hLine(doc, MARGIN, y, MARGIN + CONTENT_W, COLORS.border);
    y += 8;
  }

  // ── 4b. Third-Party Script Impact ─────────────────────────────────────────
  const topThirdParties = parsed.thirdParties.slice(0, 5);
  if (topThirdParties.length > 0) {
    y = drawSectionDivider(
      doc, y,
      "THIRD-PARTY SCRIPT IMPACT",
      `${topThirdParties.length} external entities analyzed`
    );

    filledRect(doc, MARGIN, y, CONTENT_W, 7.5, COLORS.slate100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    textColor(doc, COLORS.muted);
    doc.text("ENTITY / PROVIDER", MARGIN + 4,                y + 5);
    doc.text("TRANSFER SIZE",     MARGIN + CONTENT_W * 0.52, y + 5);
    doc.text("BLOCKING TIME",     MARGIN + CONTENT_W * 0.72, y + 5);
    y += 7.5;

    topThirdParties.forEach((tp, idx) => {
      const rowH       = 8.5;
      const isHigh     = tp.blockingTime > 200;
      const rowColor   = isHigh ? [255, 248, 248] as [number, number, number] : (idx % 2 === 0 ? COLORS.slate50 : COLORS.white);
      const accentColor = isHigh ? COLORS.rose : COLORS.muted;

      filledRect(doc, MARGIN, y, CONTENT_W, rowH, rowColor);
      filledRect(doc, MARGIN, y, 2, rowH, accentColor);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      textColor(doc, COLORS.ink);
      doc.text(trunc(tp.entity, 40), MARGIN + 6, y + 6);

      doc.setFont("helvetica", "normal");
      textColor(doc, COLORS.muted);
      doc.text(cleanText(formatBytes(tp.transferSize)), MARGIN + CONTENT_W * 0.52, y + 6);

      doc.setFont("helvetica", "bold");
      textColor(doc, isHigh ? COLORS.rose : COLORS.muted);
      doc.text(tp.blockingTime > 0 ? cleanText(formatMilliseconds(tp.blockingTime)) : "-", MARGIN + CONTENT_W * 0.72, y + 6);

      if (isHigh) {
        drawStatusPill(doc, MARGIN + CONTENT_W * 0.87, y + 1.8, "HIGH IMPACT", COLORS.roseLight, COLORS.rose, 22, 4.8, 5.5);
      }

      y += rowH;
    });

    hLine(doc, MARGIN, y, MARGIN + CONTENT_W, COLORS.border);
    y += 8;
  }

  // ── 4c. Security Signals & SEO Health ────────────────────────────────────
  const hasSecu = parsed.securityChecks.length > 0;
  const hasSeo  = parsed.seoIssues.length > 0;

  if (hasSecu || hasSeo) {
    y = drawSectionDivider(doc, y, "SECURITY SIGNALS & SEO HEALTH", "Lighthouse best-practices & SEO audit results");

    const halfW = (CONTENT_W - 6) / 2;

    // Security column
    if (hasSecu) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      textColor(doc, COLORS.ink);
      doc.text("SECURITY CHECKS", MARGIN, y);
      y += 5.5;

      parsed.securityChecks.slice(0, 6).forEach((chk, idx) => {
        const rowH = 8.5;
        const th   = chk.score === 1 ? { fill: COLORS.emerald, label: "PASS" }
                   : chk.score === 0 ? { fill: COLORS.rose,    label: "FAIL" }
                   :                   { fill: COLORS.amber,   label: "WARN" };

        filledRect(doc, MARGIN, y, halfW, rowH, idx % 2 === 0 ? COLORS.slate50 : COLORS.white);
        filledRect(doc, MARGIN, y, 2, rowH, th.fill);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        textColor(doc, COLORS.ink);
        doc.text(trunc(chk.title, 34), MARGIN + 5, y + 6);

        drawStatusPill(doc, MARGIN + halfW - 14, y + 1.8, th.label, th.fill, COLORS.white, 12, 4.8, 5.8);
        y += rowH;
      });
    }

    // SEO column (two-col layout - rendered alongside security block)
    if (hasSeo) {
      const seoY0 = hasSecu ? (y - parsed.securityChecks.slice(0, 6).length * 8.5 - 5.5) : y;
      const seoX  = MARGIN + halfW + 6;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      textColor(doc, COLORS.ink);
      doc.text("SEO ISSUES", seoX, seoY0);

      parsed.seoIssues.slice(0, 6).forEach((issue, idx) => {
        const rowH = 8.5;
        const ry   = seoY0 + 5.5 + idx * rowH;
        const th   = issue.score === 1 ? { fill: COLORS.emerald, label: "PASS" }
                   : issue.score === 0 ? { fill: COLORS.rose,    label: "FAIL" }
                   :                     { fill: COLORS.amber,   label: "WARN" };

        filledRect(doc, seoX, ry, halfW, rowH, idx % 2 === 0 ? COLORS.slate50 : COLORS.white);
        filledRect(doc, seoX, ry, 2, rowH, th.fill);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        textColor(doc, COLORS.ink);
        doc.text(trunc(issue.title, 34), seoX + 5, ry + 6);

        drawStatusPill(doc, seoX + halfW - 14, ry + 1.8, th.label, th.fill, COLORS.white, 12, 4.8, 5.8);
      });
    }
  }

  drawFooter(doc, 4, totalPages);
}
