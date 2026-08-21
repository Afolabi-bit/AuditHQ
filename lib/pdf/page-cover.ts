/**
 * lib/pdf/page-cover.ts
 * Draws Page 1: Cover header, verdict banner, category score HUD, and AI summary box.
 */

import type { ParsedLighthouseReport } from "../report-parser";
import type { AiSummaryData } from "../ai/schema";
import { COLORS, getScoreTheme } from "./tokens";
import {
  filledRect, filledRoundRect, strokedRoundRect,
  textColor, drawStatusPill, drawVectorGauge, drawBrandLogo,
} from "./primitives";
import { PAGE_W, MARGIN, CONTENT_W, drawFooter, trunc, wrapText } from "./layout";

interface CoverPageArgs {
  doc:           any;
  testId:        string | number;
  url:           string;
  isDesktop:     boolean;
  network:       string | undefined;
  formattedDate: string;
  formattedTime: string;
  parsed:        ParsedLighthouseReport;
  aiSummary:     AiSummaryData | null | undefined;
  totalPages:    number;
}

export function drawCoverPage({
  doc, testId, url, isDesktop, network,
  formattedDate, formattedTime, parsed, aiSummary, totalPages,
}: CoverPageArgs): void {
  // ── 1. Executive Masthead Band ───────────────────────────────────────────────
  filledRect(doc, 0, 0, PAGE_W, 46, COLORS.obsidian);
  filledRect(doc, 0, 0, PAGE_W, 2.5, COLORS.brand);

  // Pure Vector Brand Logo (Tile + Wordmark)
  drawBrandLogo(doc, MARGIN, 10, { isDark: true, showText: true, size: 7.5 });

  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  textColor(doc, COLORS.faint);
  doc.text("Web Performance & Core Web Vitals Intelligence Platform", MARGIN, 22.5);

  // Right-aligned report metadata
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  textColor(doc, COLORS.white);
  doc.text("EXECUTIVE PERFORMANCE REPORT", PAGE_W - MARGIN, 15, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  textColor(doc, COLORS.faint);
  doc.text(`Audit ID: #${testId}  ·  Lighthouse 12.0 Engine`, PAGE_W - MARGIN, 21.5, { align: "right" });
  doc.text(`Generated: ${formattedDate} at ${formattedTime}`, PAGE_W - MARGIN, 26.5, { align: "right" });

  // URL sub-bar inside masthead
  filledRoundRect(doc, MARGIN, 29, CONTENT_W, 13, 2, COLORS.slate800);
  filledRect(doc, MARGIN, 29, 2.5, 13, COLORS.brand);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  textColor(doc, [147, 197, 253]);
  doc.text(trunc(url, 70), MARGIN + 6, 35);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  textColor(doc, COLORS.ghostWhite);
  doc.text(
    `${isDesktop ? "Desktop Chrome 125" : "Mobile — Moto G4 Emulation"}  ·  ${network || "Direct Connection"}`,
    MARGIN + 6, 39.5
  );

  // ── 2. Overall Verdict Banner ──────────────────────────────────────────────
  let y = 53;
  const overallScore = parsed.scores.performance;
  const ot = getScoreTheme(overallScore);

  filledRoundRect(doc, MARGIN, y, CONTENT_W, 18, 2.5, ot.light);
  strokedRoundRect(doc, MARGIN, y, CONTENT_W, 18, 2.5, ot.fill, 0.4);
  filledRect(doc, MARGIN, y, 3, 18, ot.fill);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  textColor(doc, ot.dark);
  doc.text("OVERALL PERFORMANCE VERDICT", MARGIN + 8, y + 6.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  textColor(doc, ot.dark);
  doc.text(
    `This site scored ${overallScore}/100 on Performance. ${
      ot.label === "Good"
        ? "The site is fast and well-optimized — maintain your current practices."
        : ot.label === "Needs Work"
        ? "There are significant opportunities to improve load time and user experience."
        : "Critical performance issues detected that are likely harming conversions and SEO rankings."
    }`,
    MARGIN + 8, y + 12, { maxWidth: CONTENT_W - 40 }
  );

  // Score badge
  filledRoundRect(doc, PAGE_W - MARGIN - 30, y + 2.5, 28, 13, 2, ot.fill);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  textColor(doc, COLORS.white);
  doc.text(String(overallScore), PAGE_W - MARGIN - 16, y + 12, { align: "center" });
  doc.setFontSize(6);
  doc.text("/100", PAGE_W - MARGIN - 5, y + 12);

  y += 24;

  // ── 3. Category Score HUD ──────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  textColor(doc, COLORS.ink);
  doc.text("LIGHTHOUSE CATEGORY SCORES", MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  textColor(doc, COLORS.muted);
  doc.text("Google scoring algorithm · 0–100 scale", PAGE_W - MARGIN, y, { align: "right" });
  y += 4.5;

  const catGap = 4;
  const catW   = (CONTENT_W - catGap * 3) / 4;
  const catH   = 46;
  const cats = [
    { name: "Performance",    score: parsed.scores.performance,   desc: "Speed & Responsiveness" },
    { name: "Accessibility",  score: parsed.scores.accessibility,  desc: "A11y & Contrast"        },
    { name: "Best Practices", score: parsed.scores.bestPractices,  desc: "Security & Modern Web"  },
    { name: "SEO",            score: parsed.scores.seo,            desc: "Search Discoverability" },
  ];

  cats.forEach((cat, idx) => {
    const cx = MARGIN + idx * (catW + catGap);
    const th = getScoreTheme(cat.score);

    filledRoundRect(doc, cx, y, catW, catH, 2.5, COLORS.white);
    strokedRoundRect(doc, cx, y, catW, catH, 2.5, COLORS.border);
    filledRoundRect(doc, cx, y, catW, 2, 1, th.fill);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    textColor(doc, COLORS.ink);
    doc.text(cat.name, cx + catW / 2, y + 8, { align: "center" });

    const gcx = cx + catW / 2;
    const gcy = y + 22;
    drawVectorGauge(doc, gcx, gcy, 10, cat.score, th.fill, [230, 235, 242]);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(cat.score >= 100 ? 10 : 12);
    textColor(doc, th.fill);
    doc.text(String(cat.score), gcx, gcy + 2.5, { align: "center" });

    drawStatusPill(doc, cx + catW / 2 - 12, y + 36.5, th.label, th.light, th.dark, 24, 5.5, 6.2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.8);
    textColor(doc, COLORS.muted);
    doc.text(cat.desc, cx + catW / 2, y + 44.5, { align: "center" });
  });

  y += catH + 9;

  // ── 4. AI Summary Box (or fallback Audit Scope) ────────────────────────────
  if (aiSummary) {
    filledRoundRect(doc, MARGIN, y, CONTENT_W, 50, 2.5, [239, 246, 255]);
    strokedRoundRect(doc, MARGIN, y, CONTENT_W, 50, 2.5, COLORS.brand, 0.4);
    filledRect(doc, MARGIN, y, 3, 50, COLORS.brand);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    textColor(doc, COLORS.brand);
    doc.text("AI PERFORMANCE INTELLIGENCE", MARGIN + 7, y + 7);

    const aiTheme =
      aiSummary.verdict === "Optimal" || aiSummary.verdict === "Good"
        ? COLORS.emerald
        : aiSummary.verdict === "Needs Attention"
        ? COLORS.amber
        : COLORS.rose;
    drawStatusPill(doc, PAGE_W - MARGIN - 30, y + 3.5, aiSummary.verdict, aiTheme, COLORS.white, 28, 6, 6.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    textColor(doc, COLORS.ink);
    const headLines = wrapText(doc, aiSummary.headline, CONTENT_W - 45, 8.5);
    doc.text(headLines.slice(0, 2), MARGIN + 7, y + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    textColor(doc, COLORS.muted);
    const summLines = wrapText(doc, aiSummary.executiveSummary, CONTENT_W - 10, 7.2);
    doc.text(summLines.slice(0, 3), MARGIN + 7, y + 23);

    // Impact metrics row
    const ibW     = (CONTENT_W - 10) / 3;
    const impactY = y + 36;
    const metrics = [
      { value: aiSummary.estimatedImpact.timeSavedFormatted, label: "POTENTIAL SPEED GAIN",  color: COLORS.emerald },
      { value: aiSummary.estimatedImpact.conversionLift,     label: "CONVERSION LIFT EST.",  color: COLORS.brand   },
      { value: String(aiSummary.priorityFixes.length),        label: "PRIORITY FIX ACTIONS", color: COLORS.rose    },
    ];
    metrics.forEach((m, i) => {
      const bx = MARGIN + 7 + i * ibW;
      filledRoundRect(doc, bx, impactY, ibW - 2, 11, 1.5, COLORS.white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      textColor(doc, m.color);
      doc.text(m.value, bx + (ibW - 2) / 2, impactY + 6.5, { align: "center" });
      doc.setFontSize(5.5);
      doc.setFont("helvetica", "normal");
      textColor(doc, COLORS.muted);
      doc.text(m.label, bx + (ibW - 2) / 2, impactY + 10, { align: "center" });
    });
  } else {
    filledRoundRect(doc, MARGIN, y, CONTENT_W, 22, 2.5, COLORS.slate50);
    strokedRoundRect(doc, MARGIN, y, CONTENT_W, 22, 2.5, COLORS.border);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    textColor(doc, COLORS.ink);
    doc.text("AUDIT SCOPE", MARGIN + 6, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    textColor(doc, COLORS.muted);
    doc.text(
      `Full Lighthouse audit of ${trunc(url, 60)} performed on ${formattedDate} using ` +
      `${isDesktop ? "Desktop Chrome" : "Mobile Moto G4"} emulation${network ? ` over ${network}` : ""}. ` +
      `This report covers Core Web Vitals, performance opportunities, resource breakdown, and security signals.`,
      MARGIN + 6, y + 13, { maxWidth: CONTENT_W - 8 }
    );
  }

  drawFooter(doc, 1, totalPages);
}
