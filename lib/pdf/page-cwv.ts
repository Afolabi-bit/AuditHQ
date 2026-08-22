/**
 * lib/pdf/page-cwv.ts
 * Draws Page 2: Core Web Vitals benchmark table, score composition chart,
 * and the lab-vs-field data notice.
 */

import type { ParsedLighthouseReport } from "../report-parser";
import { COLORS, getRatingTheme } from "./tokens";
import { filledRect, filledRoundRect, strokedRoundRect, textColor, hLine, drawStatusPill, drawMiniBar } from "./primitives";
import { PAGE_W, MARGIN, CONTENT_W, drawFooter, drawSectionDivider, drawPageMiniHeader, wrapText, cleanText } from "./layout";

interface CWVPageArgs {
  doc:        any;
  testId:     string | number;
  hostname:   string;
  parsed:     ParsedLighthouseReport;
  totalPages: number;
}

export function drawCWVPage({ doc, testId, hostname, parsed, totalPages }: CWVPageArgs): void {
  doc.addPage();

  drawPageMiniHeader(doc, testId, hostname, "Core Web Vitals Analysis");

  let y = 18;
  y = drawSectionDivider(doc, y, "CORE WEB VITALS & DIAGNOSTIC BENCHMARKS", "Google Search Ranking Signals · Lighthouse 12.0");

  // ── Metric definitions (Standard safe ASCII targets) ──────────────────────
  const cwvMetrics = [
    { id: "LCP",  name: "Largest Contentful Paint",  data: parsed.metrics.lcp,        target: "<= 2.5 s",  weight: 0.25, isCore: true  },
    { id: "TBT",  name: "Total Blocking Time",        data: parsed.metrics.tbt,        target: "<= 200 ms", weight: 0.30, isCore: true  },
    { id: "CLS",  name: "Cumulative Layout Shift",    data: parsed.metrics.cls,        target: "<= 0.10",   weight: 0.25, isCore: true  },
    { id: "FCP",  name: "First Contentful Paint",     data: parsed.metrics.fcp,        target: "<= 1.8 s",  weight: 0.10, isCore: false },
    { id: "SI",   name: "Speed Index",                data: parsed.metrics.speedIndex, target: "<= 3.4 s",  weight: 0.10, isCore: false },
    { id: "TTFB", name: "Time to First Byte",         data: parsed.metrics.ttfb,       target: "<= 800 ms", weight: 0,    isCore: false },
  ];

  // ── Column x-positions ────────────────────────────────────────────────────
  const col = {
    id:     MARGIN + 1.5,
    name:   MARGIN + 15,
    value:  MARGIN + CONTENT_W * 0.44,
    target: MARGIN + CONTENT_W * 0.60,
    weight: MARGIN + CONTENT_W * 0.74,
    status: MARGIN + CONTENT_W * 0.87,
  };

  // ── Table header row ──────────────────────────────────────────────────────
  filledRect(doc, MARGIN, y, CONTENT_W, 7.5, COLORS.slate100);
  strokedRoundRect(doc, MARGIN, y, CONTENT_W, 7.5, 0, COLORS.border, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  textColor(doc, COLORS.muted);
  doc.text("ID",          col.id,     y + 5);
  doc.text("METRIC NAME", col.name,   y + 5);
  doc.text("MEASURED",    col.value,  y + 5);
  doc.text("TARGET",      col.target, y + 5);
  doc.text("WEIGHT",      col.weight, y + 5);
  doc.text("STATUS",      col.status, y + 5);
  y += 7.5;

  // ── Data rows ─────────────────────────────────────────────────────────────
  cwvMetrics.forEach((m, idx) => {
    const th   = getRatingTheme(m.data.rating);
    const rowH = 9.5;

    filledRect(doc, MARGIN, y, CONTENT_W, rowH, idx % 2 === 0 ? COLORS.slate50 : COLORS.white);
    filledRect(doc, MARGIN, y, 2.5, rowH, th.fill);

    // ID cell
    if (m.isCore) {
      filledRoundRect(doc, col.id - 0.5, y + 1.6, 9, 4.5, 0.8, th.light);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.2);
      textColor(doc, th.dark);
      doc.text(m.id, col.id + 4, y + 5, { align: "center" });
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      textColor(doc, COLORS.muted);
      doc.text(m.id, col.id + 2, y + 6.2);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    textColor(doc, COLORS.ink);
    doc.text(m.name, col.name, y + 6.2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    textColor(doc, th.fill);
    doc.text(cleanText(m.data.displayValue), col.value, y + 6.2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    textColor(doc, COLORS.muted);
    doc.text(m.target, col.target, y + 6.2);

    if (m.weight > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      textColor(doc, COLORS.muted);
      doc.text(`${Math.round(m.weight * 100)}%`, col.weight, y + 6.2);
      drawMiniBar(doc, col.weight + 8, y + 3.2, 14, 2.5, m.weight / 0.30, th.fill);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.2);
      textColor(doc, COLORS.faint);
      doc.text("Diagnostic", col.weight, y + 6.2);
    }

    drawStatusPill(doc, col.status, y + 2, th.rating, th.fill, COLORS.white, 14, 5.2, 6);
    y += rowH;
  });

  hLine(doc, MARGIN, y, MARGIN + CONTENT_W, COLORS.border);
  y += 9;

  // ── Score Composition chart ───────────────────────────────────────────────
  y = drawSectionDivider(
    doc, y,
    "PERFORMANCE SCORE COMPOSITION",
    "Weighted contribution of each metric to the 0-100 Performance score"
  );

  const scoredMetrics = cwvMetrics.filter(m => m.weight > 0);
  const barTotalW     = CONTENT_W - 88; // 180 - 88 = 92mm bar width, avoids overlapping text

  scoredMetrics.forEach((m, idx) => {
    const th           = getRatingTheme(m.data.rating);
    const pct          = m.data.score != null ? m.data.score : 0;
    const contribution = Math.round(pct * m.weight * 100);
    const rh           = 9.5;

    filledRect(doc, MARGIN, y, CONTENT_W, rh, idx % 2 === 0 ? COLORS.slate50 : COLORS.white);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    textColor(doc, COLORS.ink);
    doc.text(m.id, MARGIN + 3, y + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    textColor(doc, COLORS.muted);
    doc.text(m.name, MARGIN + 15, y + 6.5);

    // Progress bar positioned safely between label and score numbers
    drawMiniBar(doc, MARGIN + 64, y + 2.8, barTotalW, 3.8, pct, th.fill, COLORS.border);

    // Raw score percentage
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    textColor(doc, th.fill);
    doc.text(`${Math.round(pct * 100)}`, PAGE_W - MARGIN - 20, y + 6.5, { align: "right" });

    // Points contributed to total performance score
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    textColor(doc, COLORS.muted);
    doc.text(`+${contribution} pts`, PAGE_W - MARGIN - 3, y + 6.5, { align: "right" });

    y += rh;
  });

  hLine(doc, MARGIN, y, MARGIN + CONTENT_W, COLORS.border);
  y += 10;

  // ── Lab vs. Field notice ──────────────────────────────────────────────────
  filledRoundRect(doc, MARGIN, y, CONTENT_W, 20, 2.5, [255, 251, 235]);
  strokedRoundRect(doc, MARGIN, y, CONTENT_W, 20, 2.5, COLORS.amber, 0.3);
  filledRect(doc, MARGIN, y, 2.5, 20, COLORS.amber);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  textColor(doc, [120, 53, 15]);
  doc.text("IMPORTANT - LAB VS. FIELD DATA", MARGIN + 7, y + 6.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  textColor(doc, COLORS.muted);
  const note =
    "These metrics are collected under controlled lab conditions using simulated network throttling and device emulation. " +
    "Real-world (field) data from Chrome UX Report may differ based on geographic distribution, device mix, and cache state. " +
    "Lab data is highly actionable for identifying specific bottlenecks and measuring optimization impact.";
  const labLines = wrapText(doc, note, CONTENT_W - 12, 6.8);
  doc.text(labLines.slice(0, 3), MARGIN + 7, y + 13);

  drawFooter(doc, 2, totalPages);
}
