/**
 * lib/generate-report-pdf.ts
 * Generates a branded AuditHQ performance audit PDF using jsPDF.
 * Dynamically imported on the client to avoid SSR/bundle issues.
 */

function getScoreColor(score: number): [number, number, number] {
  if (score >= 90) return [22, 163, 74];  // green-600
  if (score >= 50) return [234, 88, 12];  // orange-600
  return [220, 38, 38];                   // red-600
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

export async function generateReportPDF(
  testId: number,
  url: string,
  device: string,
  network: string | undefined,
  createdAt: string | Date,
  rawReport: any
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 0;

  // ── Header Band ──────────────────────────────────────────────────────────
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 0, W, 40, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("AuditHQ", margin, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(191, 219, 254); // blue-200
  doc.text("Performance Audit Report  ·  Powered by Lighthouse Cloud Engine", margin, 27);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Audit #${testId}`, W - margin, 17, { align: "right" });

  y = 52;

  // ── Metadata Block ────────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y - 5, contentW, 34, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  const displayUrl = url.length > 60 ? url.slice(0, 57) + "..." : url;
  doc.text(displayUrl, margin + 4, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = new Date(createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const metaItems = [
    `Device: ${device}`,
    `Network: ${network || "No Throttling"}`,
    `Date: ${formattedDate}  ${formattedTime}`,
  ];
  doc.text(metaItems.join("   ·   "), margin + 4, y + 18);

  y += 46;

  // ── Section: Category Scores ─────────────────────────────────────────────
  const categories = rawReport?.categories || {};
  const categoryEntries: { name: string; score: number }[] = [
    { name: "Performance", score: Math.round((categories.performance?.score ?? 0) * 100) },
    { name: "Accessibility", score: Math.round((categories.accessibility?.score ?? 0) * 100) },
    { name: "Best Practices", score: Math.round((categories["best-practices"]?.score ?? 0) * 100) },
    { name: "SEO", score: Math.round((categories.seo?.score ?? 0) * 100) },
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("Category Scores", margin, y);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 2, W - margin, y + 2);

  y += 10;

  const boxW = (contentW - 9) / 4;
  categoryEntries.forEach((cat, i) => {
    const bx = margin + i * (boxW + 3);
    const by = y;
    const rgb = getScoreColor(cat.score);

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(bx, by, boxW, 32, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    doc.text(String(cat.score), bx + boxW / 2, by + 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(cat.name, bx + boxW / 2, by + 26, { align: "center" });

    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.circle(bx + boxW / 2, by + 30, 1.2, "F");
  });

  y += 44;

  // ── Section: Core Web Vitals ──────────────────────────────────────────────
  const audits = rawReport?.audits || {};
  const metrics = [
    { label: "First Contentful Paint", key: "first-contentful-paint", shortLabel: "FCP" },
    { label: "Largest Contentful Paint", key: "largest-contentful-paint", shortLabel: "LCP" },
    { label: "Total Blocking Time", key: "total-blocking-time", shortLabel: "TBT" },
    { label: "Cumulative Layout Shift", key: "cumulative-layout-shift", shortLabel: "CLS" },
    { label: "Speed Index", key: "speed-index", shortLabel: "SI" },
    { label: "Time to Interactive", key: "interactive", shortLabel: "TTI" },
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("Core Web Vitals", margin, y);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 2, W - margin, y + 2);
  y += 10;

  // Table header row
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentW, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Metric", margin + 3, y + 5.5);
  doc.text("Value", margin + contentW * 0.55, y + 5.5);
  doc.text("Rating", margin + contentW * 0.78, y + 5.5);
  y += 8;

  metrics.forEach((metric, idx) => {
    const audit = audits[metric.key];
    const displayValue = audit?.displayValue || "N/A";
    const rawScore = audit?.score;
    const scoreNum = rawScore != null ? Math.round(rawScore * 100) : null;
    const rgb = scoreNum != null ? getScoreColor(scoreNum) : ([100, 116, 139] as [number, number, number]);
    const ratingLabel = scoreNum != null ? getScoreLabel(scoreNum) : "N/A";
    const rowH = 9;

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentW, rowH, "F");
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${metric.shortLabel}  –  ${metric.label}`, margin + 3, y + 6);

    doc.setFont("helvetica", "bold");
    doc.text(displayValue, margin + contentW * 0.55, y + 6);

    const pillX = margin + contentW * 0.78;
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.roundedRect(pillX, y + 1.5, 24, 5.5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(ratingLabel, pillX + 12, y + 5.5, { align: "center" });

    y += rowH;
  });

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.rect(margin, y - metrics.length * 9, contentW, metrics.length * 9, "S");

  y += 14;

  // ── Top Opportunities ──────────────────────────────────────────────────────
  const opportunities: { title: string; savings: string }[] = [];
  for (const key in audits) {
    const a = audits[key];
    if (a?.details?.type === "opportunity" && a?.score != null && a.score < 0.9) {
      const savings =
        a.details?.overallSavingsMs != null
          ? `Save ~${Math.round(a.details.overallSavingsMs)}ms`
          : a.displayValue || "";
      opportunities.push({ title: a.title, savings });
      if (opportunities.length >= 5) break;
    }
  }

  if (opportunities.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Top Opportunities", margin, y);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 2, W - margin, y + 2);
    y += 10;

    opportunities.forEach((opp, idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentW, 8.5, "F");
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      const title = opp.title.length > 60 ? opp.title.slice(0, 57) + "..." : opp.title;
      doc.text(`·  ${title}`, margin + 3, y + 6);

      if (opp.savings) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(opp.savings, W - margin - 3, y + 6, { align: "right" });
      }
      y += 8.5;
    });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(margin, y - opportunities.length * 8.5, contentW, opportunities.length * 8.5, "S");
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  const pageH = 297;
  doc.setFillColor(241, 245, 249);
  doc.rect(0, pageH - 18, W, 18, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Generated by AuditHQ  ·  ${new Date().toLocaleString()}  ·  swiftaudithq.vercel.app`,
    W / 2,
    pageH - 8,
    { align: "center" }
  );

  // ── Save ───────────────────────────────────────────────────────────────────
  try {
    const hostname = new URL(url).hostname;
    doc.save(`audithq-report-${testId}-${hostname}.pdf`);
  } catch {
    doc.save(`audithq-report-${testId}.pdf`);
  }
}
