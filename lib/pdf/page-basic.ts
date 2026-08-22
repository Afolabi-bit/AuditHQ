/**
 * lib/pdf/page-basic.ts
 * Generates a concise, high-impact 1-page Executive Summary PDF.
 * Contains: Masthead, Overall Score Verdict, 4 Category Gauges,
 * Core Web Vitals Benchmark Table, and Executive AI Summary / Top Opportunities.
 */

import type { ParsedLighthouseReport } from "../report-parser";
import { formatMilliseconds, formatBytes } from "../report-parser";
import type { AiSummaryData } from "../ai/schema";
import { COLORS, getScoreTheme, getRatingTheme } from "./tokens";
import {
  filledRect, filledRoundRect, strokedRoundRect,
  textColor, hLine, drawStatusPill, drawVectorGauge, drawBrandLogo,
} from "./primitives";
import { PAGE_W, MARGIN, CONTENT_W, drawFooter, drawSectionDivider, trunc, wrapText, cleanText } from "./layout";

interface BasicReportArgs {
  doc:           any;
  testId:        string | number;
  url:           string;
  isDesktop:     boolean;
  network:       string | undefined;
  formattedDate: string;
  formattedTime: string;
  parsed:        ParsedLighthouseReport;
  rawReport:     any;
  aiSummary:     AiSummaryData | null | undefined;
}

export function drawBasicReportPage({
  doc, testId, url, isDesktop, network,
  formattedDate, formattedTime, parsed, rawReport, aiSummary,
}: BasicReportArgs): void {
  // ── 1. Header Masthead Band (y: 0–40mm) ───────────────────────────────────
  filledRect(doc, 0, 0, PAGE_W, 40, COLORS.obsidian);
  filledRect(doc, 0, 0, PAGE_W, 2.5, COLORS.brand);

  // Brand vector logo
  drawBrandLogo(doc, MARGIN, 7.5, { isDark: true, showText: true, size: 7 });

  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  textColor(doc, COLORS.faint);
  doc.text("Web Performance & Core Web Vitals Intelligence Platform", MARGIN, 18.5);

  // Right metadata
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  textColor(doc, COLORS.white);
  doc.text("EXECUTIVE PERFORMANCE SUMMARY", PAGE_W - MARGIN, 13.5, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  textColor(doc, COLORS.faint);
  doc.text(`Audit ID: #${testId}  ·  Lighthouse 12.0`, PAGE_W - MARGIN, 19, { align: "right" });
  doc.text(`${formattedDate} · ${formattedTime}`, PAGE_W - MARGIN, 23.5, { align: "right" });

  // URL sub-bar
  filledRoundRect(doc, MARGIN, 26, CONTENT_W, 11, 1.5, COLORS.slate800);
  filledRect(doc, MARGIN, 26, 2.5, 11, COLORS.brand);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  textColor(doc, [147, 197, 253]);
  doc.text(trunc(url, 65), MARGIN + 5.5, 31.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  textColor(doc, COLORS.ghostWhite);
  doc.text(
    `${isDesktop ? "Desktop Chrome" : "Mobile Emulation"}  ·  ${network || "Direct Connection"}`,
    PAGE_W - MARGIN - 5, 31.5, { align: "right" }
  );

  // ── 2. Overall Verdict Banner (y: 44–60mm) ──────────────────────────────────
  let y = 44;
  const overallScore = parsed.scores.performance;
  const ot = getScoreTheme(overallScore);

  filledRoundRect(doc, MARGIN, y, CONTENT_W, 16, 2, ot.light);
  strokedRoundRect(doc, MARGIN, y, CONTENT_W, 16, 2, ot.fill, 0.35);
  filledRect(doc, MARGIN, y, 2.5, 16, ot.fill);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  textColor(doc, ot.dark);
  doc.text("OVERALL PERFORMANCE VERDICT", MARGIN + 7, y + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  textColor(doc, ot.dark);
  doc.text(
    `This site scored ${overallScore}/100 on Performance. ${
      ot.label === "Good"
        ? "The site is fast and well-optimized - maintain your current practices."
        : ot.label === "Needs Work"
        ? "There are significant opportunities to improve load time and user experience."
        : "Critical performance issues detected that are likely harming conversions and SEO rankings."
    }`,
    MARGIN + 7, y + 11, { maxWidth: CONTENT_W - 42 }
  );

  // Score badge
  const badgeW = 30;
  const badgeX = PAGE_W - MARGIN - badgeW - 3;
  filledRoundRect(doc, badgeX, y + 2, badgeW, 12, 1.8, ot.fill);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  textColor(doc, COLORS.white);
  const scoreStr = String(overallScore);
  const scoreW = doc.getTextWidth(scoreStr);
  const totalScoreW = scoreW + 11;
  const startScoreX = badgeX + (badgeW - totalScoreW) / 2;

  doc.text(scoreStr, startScoreX, y + 9.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("/100", startScoreX + scoreW + 1, y + 9.5);

  y += 20;

  // ── 3. Category Score HUD (4 Cards) (y: 64–106mm) ──────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  textColor(doc, COLORS.ink);
  doc.text("LIGHTHOUSE CATEGORY SCORES", MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  textColor(doc, COLORS.muted);
  doc.text("Google scoring algorithm · 0-100 scale", PAGE_W - MARGIN, y, { align: "right" });
  y += 4;

  const catGap = 3.5;
  const catW   = (CONTENT_W - catGap * 3) / 4;
  const catH   = 41;
  const cats = [
    { name: "Performance",    score: parsed.scores.performance,   desc: "Speed & Response" },
    { name: "Accessibility",  score: parsed.scores.accessibility,  desc: "A11y & Contrast"  },
    { name: "Best Practices", score: parsed.scores.bestPractices,  desc: "Modern Standards" },
    { name: "SEO",            score: parsed.scores.seo,            desc: "Discoverability"  },
  ];

  cats.forEach((cat, idx) => {
    const cx = MARGIN + idx * (catW + catGap);
    const th = getScoreTheme(cat.score);

    filledRoundRect(doc, cx, y, catW, catH, 2, COLORS.white);
    strokedRoundRect(doc, cx, y, catW, catH, 2, COLORS.border, 0.3);
    filledRoundRect(doc, cx, y, catW, 1.8, 0.8, th.fill);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    textColor(doc, COLORS.ink);
    doc.text(cat.name, cx + catW / 2, y + 7, { align: "center" });

    const gcx = cx + catW / 2;
    const gcy = y + 19;
    drawVectorGauge(doc, gcx, gcy, 8.5, cat.score, th.fill, [230, 235, 242]);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(cat.score >= 100 ? 9.5 : 11);
    textColor(doc, th.fill);
    doc.text(String(cat.score), gcx, gcy + 2.5, { align: "center" });

    drawStatusPill(doc, cx + catW / 2 - 11, y + 31.5, th.label, th.light, th.dark, 22, 4.8, 5.8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    textColor(doc, COLORS.muted);
    doc.text(cat.desc, cx + catW / 2, y + 38.5, { align: "center" });
  });

  y += catH + 7;

  // ── 4. Core Web Vitals Benchmark Summary (y: 111–178mm) ────────────────────
  y = drawSectionDivider(doc, y, "CORE WEB VITALS BENCHMARKS", "Google Search Ranking Signals");

  const cwvMetrics = [
    { id: "LCP",  name: "Largest Contentful Paint",  data: parsed.metrics.lcp,        target: "<= 2.5 s",  isCore: true  },
    { id: "TBT",  name: "Total Blocking Time",        data: parsed.metrics.tbt,        target: "<= 200 ms", isCore: true  },
    { id: "CLS",  name: "Cumulative Layout Shift",    data: parsed.metrics.cls,        target: "<= 0.10",   isCore: true  },
    { id: "FCP",  name: "First Contentful Paint",     data: parsed.metrics.fcp,        target: "<= 1.8 s",  isCore: false },
    { id: "SI",   name: "Speed Index",                data: parsed.metrics.speedIndex, target: "<= 3.4 s",  isCore: false },
    { id: "TTFB", name: "Time to First Byte",         data: parsed.metrics.ttfb,       target: "<= 800 ms", isCore: false },
  ];

  // Table header
  filledRect(doc, MARGIN, y, CONTENT_W, 6.5, COLORS.slate100);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  textColor(doc, COLORS.muted);
  doc.text("ID",          MARGIN + 2,                y + 4.5);
  doc.text("METRIC NAME", MARGIN + 14,               y + 4.5);
  doc.text("MEASURED",    MARGIN + CONTENT_W * 0.48, y + 4.5);
  doc.text("TARGET",      MARGIN + CONTENT_W * 0.68, y + 4.5);
  doc.text("STATUS",      MARGIN + CONTENT_W * 0.88, y + 4.5);
  y += 6.5;

  cwvMetrics.forEach((m, idx) => {
    const th   = getRatingTheme(m.data.rating);
    const rowH = 7.5;

    filledRect(doc, MARGIN, y, CONTENT_W, rowH, idx % 2 === 0 ? COLORS.slate50 : COLORS.white);
    filledRect(doc, MARGIN, y, 2, rowH, th.fill);

    // ID
    if (m.isCore) {
      filledRoundRect(doc, MARGIN + 1.5, y + 1.3, 8.5, 4.5, 0.6, th.light);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.8);
      textColor(doc, th.dark);
      doc.text(m.id, MARGIN + 5.7, y + 4.5, { align: "center" });
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      textColor(doc, COLORS.muted);
      doc.text(m.id, MARGIN + 2, y + 5);
    }

    // Name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    textColor(doc, COLORS.ink);
    doc.text(m.name, MARGIN + 14, y + 5);

    // Measured
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    textColor(doc, th.fill);
    doc.text(cleanText(m.data.displayValue), MARGIN + CONTENT_W * 0.48, y + 5);

    // Target
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    textColor(doc, COLORS.muted);
    doc.text(m.target, MARGIN + CONTENT_W * 0.68, y + 5);

    // Status
    drawStatusPill(doc, MARGIN + CONTENT_W * 0.87, y + 1.3, th.rating, th.fill, COLORS.white, 15, 4.8, 5.5);

    y += rowH;
  });

  hLine(doc, MARGIN, y, MARGIN + CONTENT_W, COLORS.border);
  y += 7;

  // ── 5. Executive Insights & Key Actions (y: ~183–274mm) ────────────────────
  y = drawSectionDivider(doc, y, "EXECUTIVE SUMMARY & ACTION PLAN", "Automated Performance Intelligence");

  if (aiSummary) {
    const headLines = wrapText(doc, aiSummary.headline, CONTENT_W - 44, 7.8);
    const summLines = wrapText(doc, aiSummary.executiveSummary, CONTENT_W - 14, 6.5);

    const boxH = 46;
    filledRoundRect(doc, MARGIN, y, CONTENT_W, boxH, 2, [239, 246, 255]);
    strokedRoundRect(doc, MARGIN, y, CONTENT_W, boxH, 2, COLORS.brand, 0.35);
    filledRect(doc, MARGIN, y, 2.5, boxH, COLORS.brand);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    textColor(doc, COLORS.brand);
    doc.text("AI EXECUTIVE DIAGNOSIS", MARGIN + 6, y + 5.5);

    const aiTheme =
      aiSummary.verdict === "Optimal" || aiSummary.verdict === "Good"
        ? COLORS.emerald
        : aiSummary.verdict === "Needs Attention"
        ? COLORS.amber
        : COLORS.rose;
    drawStatusPill(doc, PAGE_W - MARGIN - 26, y + 2.5, aiSummary.verdict, aiTheme, COLORS.white, 24, 4.8, 5.8);

    // Headline
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    textColor(doc, COLORS.ink);
    let ty = y + 11.5;
    headLines.slice(0, 2).forEach((l: string) => {
      doc.text(l, MARGIN + 6, ty);
      ty += 3.8;
    });

    // Summary
    ty += 0.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.4);
    textColor(doc, COLORS.muted);
    summLines.slice(0, 2).forEach((l: string) => {
      doc.text(l, MARGIN + 6, ty);
      ty += 3.3;
    });

    // 3 Impact Cards at bottom of box
    const ibW = (CONTENT_W - 10) / 3;
    const iy  = y + boxH - 12;
    const rawTimeSaved = cleanText(aiSummary.estimatedImpact.timeSavedFormatted).replace(/^[+-]/, "");
    const timeSavedDisplay = rawTimeSaved ? `${rawTimeSaved} Faster` : "Optimized";
    const convLiftClean    = cleanText(aiSummary.estimatedImpact.conversionLift) || "+5-10%";

    const metrics = [
      { value: timeSavedDisplay, label: "EST. LOAD TIME REDUCTION",  color: COLORS.emerald },
      { value: convLiftClean,    label: "EST. CONVERSION LIFT (ROI)", color: COLORS.brand   },
      { value: `${aiSummary.priorityFixes.length} Actions`, label: "PRIORITY FIX ACTIONS", color: COLORS.rose },
    ];

    metrics.forEach((m, i) => {
      const bx = MARGIN + 6 + i * ibW;
      filledRoundRect(doc, bx, iy, ibW - 2, 9.5, 1.2, COLORS.white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      textColor(doc, m.color);
      doc.text(m.value, bx + (ibW - 2) / 2, iy + 5, { align: "center" });
      doc.setFontSize(4.8);
      doc.setFont("helvetica", "normal");
      textColor(doc, COLORS.muted);
      doc.text(m.label, bx + (ibW - 2) / 2, iy + 8, { align: "center" });
    });
  } else {
    // Top opportunities fallback when no AI summary is ready
    const opps = parsed.opportunities.slice(0, 3);
    const boxH = 46;

    filledRoundRect(doc, MARGIN, y, CONTENT_W, boxH, 2, COLORS.slate50);
    strokedRoundRect(doc, MARGIN, y, CONTENT_W, boxH, 2, COLORS.border, 0.3);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    textColor(doc, COLORS.ink);
    doc.text("PRIORITY OPPORTUNITIES", MARGIN + 6, y + 6);

    let oy = y + 12;
    if (opps.length > 0) {
      opps.forEach((opp, i) => {
        filledRoundRect(doc, MARGIN + 6, oy, CONTENT_W - 12, 9.5, 1.2, COLORS.white);
        filledRect(doc, MARGIN + 6, oy, 2, 9.5, COLORS.amber);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.8);
        textColor(doc, COLORS.ink);
        doc.text(trunc(opp.title, 55), MARGIN + 11, oy + 4.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(5.8);
        textColor(doc, COLORS.muted);
        doc.text(trunc(opp.description, 70), MARGIN + 11, oy + 8);

        if (opp.overallSavingsMs && opp.overallSavingsMs > 0) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(6.8);
          textColor(doc, COLORS.emerald);
          doc.text(`-${cleanText(formatMilliseconds(opp.overallSavingsMs))}`, PAGE_W - MARGIN - 10, oy + 5.5, { align: "right" });
        }

        oy += 10.5;
      });
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      textColor(doc, COLORS.muted);
      doc.text("No high-impact bottlenecks detected. Performance meets established targets.", MARGIN + 6, y + 14);
    }
  }

  // ── 6. Page Footer ────────────────────────────────────────────────────────
  drawFooter(doc, 1, 1);
}
