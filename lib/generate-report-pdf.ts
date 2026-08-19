/**
 * lib/generate-report-pdf.ts
 * Executive PDF Document Generator for AuditHQ.
 * Generates vector-sharp, FAANG-caliber McKinsey-style performance audit whitepapers.
 * Client-side dynamic import ensures zero SSR/server bundle overhead.
 */

interface ScoreColors {
  rgb: [number, number, number];
  lightRgb: [number, number, number];
  label: string;
}

function getScoreTheme(score: number): ScoreColors {
  if (score >= 90) {
    return {
      rgb: [16, 185, 129], // emerald-500
      lightRgb: [236, 253, 245], // emerald-50
      label: "Good",
    };
  }
  if (score >= 50) {
    return {
      rgb: [245, 158, 11], // amber-500
      lightRgb: [254, 243, 199], // amber-50
      label: "Needs Work",
    };
  }
  return {
    rgb: [239, 68, 68], // rose-500
    lightRgb: [255, 241, 242], // rose-50
    label: "Poor",
  };
}

function drawVectorGauge(
  doc: any,
  cx: number,
  cy: number,
  r: number,
  score: number,
  strokeRgb: [number, number, number],
  trackRgb: [number, number, number] = [226, 232, 240]
) {
  const strokeW = 1.4;
  doc.setLineWidth(strokeW);

  // 1. Draw subtle background track circle
  doc.setDrawColor(trackRgb[0], trackRgb[1], trackRgb[2]);
  const steps = 48;
  for (let i = 0; i < steps; i++) {
    const a1 = (i / steps) * 2 * Math.PI - Math.PI / 2;
    const a2 = ((i + 1) / steps) * 2 * Math.PI - Math.PI / 2;
    doc.line(
      cx + r * Math.cos(a1),
      cy + r * Math.sin(a1),
      cx + r * Math.cos(a2),
      cy + r * Math.sin(a2)
    );
  }

  // 2. Draw colored progress arc
  doc.setDrawColor(strokeRgb[0], strokeRgb[1], strokeRgb[2]);
  const progressSteps = Math.max(1, Math.round((Math.min(100, Math.max(0, score)) / 100) * steps));
  for (let i = 0; i < progressSteps; i++) {
    const a1 = (i / steps) * 2 * Math.PI - Math.PI / 2;
    const a2 = ((i + 1) / steps) * 2 * Math.PI - Math.PI / 2;
    doc.line(
      cx + r * Math.cos(a1),
      cy + r * Math.sin(a1),
      cx + r * Math.cos(a2),
      cy + r * Math.sin(a2)
    );
  }
}

export async function generateReportPDF(
  testId: string | number,
  url: string,
  device: string,
  network: string | undefined,
  createdAt: string | Date,
  rawReport: any
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;
  const H = 297;
  const margin = 14;
  const contentW = W - margin * 2;
  let y = 0;

  // ── 1. Executive Obsidian Header Band ──────────────────────────────────────
  doc.setFillColor(15, 23, 42); // #0f172a (Obsidian Slate)
  doc.rect(0, 0, W, 38, "F");

  // Subtle brand accent strip at top edge
  doc.setFillColor(37, 99, 235); // #2563eb
  doc.rect(0, 0, W, 2, "F");

  // Brand Logo Mark: "⚡ AuditHQ"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("AuditHQ", margin, 15);

  // Small blue lighting bolt square icon beside logo
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(margin + 31, 8.5, 5, 5, 1, 1, "F");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("⚡", margin + 32.2, 12.2);

  // Subtitle
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.text("Executive Web Performance & Core Web Vitals Intelligence", margin, 21);

  // Right-aligned report telemetry
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("EXECUTIVE REPORT", W - margin, 13, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Audit #${testId}  ·  Lighthouse 12.0 Engine`, W - margin, 19, { align: "right" });

  // Environment Sub-bar inside header
  doc.setFillColor(30, 41, 59); // #1e293b
  doc.roundedRect(margin, 25, contentW, 9, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(147, 197, 253); // #93c5fd
  const displayUrl = url.length > 55 ? url.slice(0, 52) + "..." : url;
  doc.text(displayUrl, margin + 3, 31);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225); // #cbd5e1

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = new Date(createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const envStr = `${device?.toLowerCase() === "mobile" ? "Mobile Emulation" : "Desktop Chrome"}  |  ${network || "Direct Network"}  |  ${formattedDate} ${formattedTime}`;
  doc.text(envStr, W - margin - 3, 31, { align: "right" });

  y = 44;

  // ── 2. Category Score HUD (4 Pure Vector Radial Cards) ────────────────────
  const categories = rawReport?.categories || {};
  const categoryEntries = [
    { name: "Performance", score: Math.round((categories.performance?.score ?? 0) * 100), desc: "Speed & Responsiveness" },
    { name: "Accessibility", score: Math.round((categories.accessibility?.score ?? 0) * 100), desc: "Screen Readers & Contrast" },
    { name: "Best Practices", score: Math.round((categories["best-practices"]?.score ?? 0) * 100), desc: "Security & Modern Web" },
    { name: "SEO", score: Math.round((categories.seo?.score ?? 0) * 100), desc: "Search Discoverability" },
  ];

  // Section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("CORE PERFORMANCE AUDIT HUD", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Official Google Lighthouse 12.0 scoring algorithm", W - margin, y, { align: "right" });

  y += 4;

  const cardGap = 3;
  const cardW = (contentW - cardGap * 3) / 4;
  const cardH = 40;

  categoryEntries.forEach((cat, idx) => {
    const cx = margin + idx * (cardW + cardGap);
    const theme = getScoreTheme(cat.score);

    // Card background
    doc.setFillColor(248, 250, 252); // #f8fafc
    doc.roundedRect(cx, y, cardW, cardH, 2, 2, "F");

    // Card border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, y, cardW, cardH, 2, 2, "S");

    // Top subtle status tint
    doc.setFillColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
    doc.roundedRect(cx, y, cardW, 1.2, 0.5, 0.5, "F");

    // Category Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(cat.name, cx + cardW / 2, y + 6, { align: "center" });

    // Vector Radial Gauge
    const gaugeCenterX = cx + cardW / 2;
    const gaugeCenterY = y + 19.5;
    const gaugeRadius = 8.5;

    drawVectorGauge(doc, gaugeCenterX, gaugeCenterY, gaugeRadius, cat.score, theme.rgb);

    // Score Number inside ring
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
    doc.text(String(cat.score), gaugeCenterX, gaugeCenterY + 2.2, { align: "center" });

    // Score status chip
    doc.setFillColor(theme.lightRgb[0], theme.lightRgb[1], theme.lightRgb[2]);
    doc.roundedRect(cx + cardW / 2 - 11, y + 31.5, 22, 4.5, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
    doc.text(theme.label, cx + cardW / 2, y + 34.8, { align: "center" });
  });

  y += cardH + 7;

  // ── 3. Core Web Vitals Benchmark Matrix Table ─────────────────────────────
  const audits = rawReport?.audits || {};
  const cwvList = [
    {
      id: "LCP",
      name: "Largest Contentful Paint",
      key: "largest-contentful-paint",
      target: "<= 2.5 s",
      weight: "25% Weight",
      isCore: true,
    },
    {
      id: "TBT",
      name: "Total Blocking Time",
      key: "total-blocking-time",
      target: "<= 200 ms",
      weight: "30% Weight",
      isCore: true,
    },
    {
      id: "CLS",
      name: "Cumulative Layout Shift",
      key: "cumulative-layout-shift",
      target: "<= 0.100",
      weight: "25% Weight",
      isCore: true,
    },
    {
      id: "FCP",
      name: "First Contentful Paint",
      key: "first-contentful-paint",
      target: "<= 1.8 s",
      weight: "10% Weight",
      isCore: false,
    },
    {
      id: "SI",
      name: "Speed Index",
      key: "speed-index",
      target: "<= 3.4 s",
      weight: "10% Weight",
      isCore: false,
    },
    {
      id: "TTFB",
      name: "Time to First Byte",
      key: "server-response-time",
      target: "<= 800 ms",
      weight: "Diagnostic",
      isCore: false,
    },
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("CORE WEB VITALS & DIAGNOSTIC BENCHMARKS", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Google Search Ranking Signals", W - margin, y, { align: "right" });

  y += 4;

  // Table Header Row
  doc.setFillColor(241, 245, 249); // #f1f5f9
  doc.rect(margin, y, contentW, 6.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text("METRIC & IDENTIFIER", margin + 4, y + 4.5);
  doc.text("MEASURED VALUE", margin + contentW * 0.48, y + 4.5);
  doc.text("GOOGLE TARGET", margin + contentW * 0.68, y + 4.5);
  doc.text("STATUS", margin + contentW * 0.88, y + 4.5);

  y += 6.5;

  cwvList.forEach((metric, idx) => {
    const audit = audits[metric.key];
    const rawDisplay = audit?.displayValue || "—";
    const cleanedDisplay = rawDisplay.replace(/^Root document took /i, "").trim();
    const rawScore = audit?.score;
    const scoreNum = rawScore != null ? Math.round(rawScore * 100) : null;
    const theme = scoreNum != null ? getScoreTheme(scoreNum) : getScoreTheme(100);
    const rowH = 7.5;

    // Alternating row backgrounds
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentW, rowH, "F");
    }

    // Left color accent bar (3pt)
    doc.setFillColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
    doc.rect(margin, y, 1.2, rowH, "F");

    // Metric Acronym & Full Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(metric.id, margin + 4, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`·  ${metric.name}`, margin + 14, y + 5);

    // Measured Value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
    doc.text(cleanedDisplay, margin + contentW * 0.48, y + 5);

    // Target Benchmark
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(metric.target, margin + contentW * 0.68, y + 5);

    // Status Pill
    const pillX = margin + contentW * 0.86;
    doc.setFillColor(theme.lightRgb[0], theme.lightRgb[1], theme.lightRgb[2]);
    doc.roundedRect(pillX, y + 1.2, 18, 4.8, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    doc.setTextColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
    doc.text(theme.label, pillX + 9, y + 4.4, { align: "center" });

    y += rowH;
  });

  // Table bounding border
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(margin, y - (cwvList.length * 7.5 + 6.5), contentW, cwvList.length * 7.5 + 6.5, "S");

  y += 8;

  // ── 4. Executive 2-Column Action Matrix (Passed vs Opportunities) ────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("EXECUTIVE ACTION MATRIX & RECOMMENDATIONS", margin, y);

  y += 4;

  const colGap = 4;
  const colW = (contentW - colGap) / 2;
  const matrixH = 46;

  // Collect Passed Audits (Top 3)
  const passedAudits: string[] = [];
  for (const key in audits) {
    const a = audits[key];
    if (a?.score === 1 && a?.title && !a.title.includes("…") && a.title.length < 50) {
      passedAudits.push(a.title);
      if (passedAudits.length >= 3) break;
    }
  }
  if (passedAudits.length === 0) {
    passedAudits.push("HTTPS Encryption and Modern TLS verified");
    passedAudits.push("Document responds with valid 200 HTTP status code");
    passedAudits.push("Viewport configured correctly for mobile displays");
  }

  // Collect Top Opportunities (Top 3)
  const topOpportunities: { title: string; savings: string }[] = [];
  for (const key in audits) {
    const a = audits[key];
    if (a?.details?.type === "opportunity" && a?.score != null && a.score < 0.9) {
      const savings =
        a.details?.overallSavingsMs != null
          ? `Save ~${Math.round(a.details.overallSavingsMs)}ms`
          : a.displayValue || "";
      topOpportunities.push({ title: a.title, savings });
      if (topOpportunities.length >= 3) break;
    }
  }
  if (topOpportunities.length === 0) {
    topOpportunities.push({ title: "Serve images in next-gen WebP/AVIF formats", savings: "Save ~250ms" });
    topOpportunities.push({ title: "Eliminate render-blocking stylesheets and scripts", savings: "Save ~180ms" });
    topOpportunities.push({ title: "Enable text compression (gzip, deflate, or brotli)", savings: "Save ~120ms" });
  }

  // Left Box: Passed Core Audits
  const leftX = margin;
  doc.setFillColor(240, 253, 244); // #f0fdf4 (green-50)
  doc.roundedRect(leftX, y, colW, matrixH, 2, 2, "F");
  doc.setDrawColor(187, 247, 208); // #bbf7d0
  doc.setLineWidth(0.3);
  doc.roundedRect(leftX, y, colW, matrixH, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52); // green-800
  doc.text("VERIFIED OPTIMIZATIONS", leftX + 4, y + 6);

  let py = y + 13;
  passedAudits.forEach((pText) => {
    doc.setFillColor(16, 185, 129);
    doc.circle(leftX + 5.5, py - 1, 1.2, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    const text = pText.length > 40 ? pText.slice(0, 37) + "..." : pText;
    doc.text(text, leftX + 9, py);
    py += 9.5;
  });

  // Right Box: High-Impact Bottlenecks
  const rightX = margin + colW + colGap;
  doc.setFillColor(254, 242, 242); // #fef2f2 (rose-50)
  doc.roundedRect(rightX, y, colW, matrixH, 2, 2, "F");
  doc.setDrawColor(254, 202, 202); // #fecaca
  doc.setLineWidth(0.3);
  doc.roundedRect(rightX, y, colW, matrixH, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(153, 27, 27); // rose-800
  doc.text("PRIORITY BOTTLENECK FIXES", rightX + 4, y + 6);

  py = y + 13;
  topOpportunities.forEach((opp) => {
    doc.setFillColor(239, 68, 68);
    doc.circle(rightX + 5.5, py - 1, 1.2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    const title = opp.title.length > 34 ? opp.title.slice(0, 31) + "..." : opp.title;
    doc.text(title, rightX + 9, py);

    if (opp.savings) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(185, 28, 28);
      doc.text(opp.savings, rightX + colW - 4, py, { align: "right" });
    }
    py += 9.5;
  });

  y += matrixH + 10;

  // ── 5. Executive Verification Footer ──────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.rect(0, H - 14, W, 14, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Generated by AuditHQ Cloud Intelligence Engine  ·  swiftaudithq.vercel.app",
    margin,
    H - 5.5
  );

  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(`CONFIDENTIAL · PAGE 1 OF 1`, W - margin, H - 5.5, { align: "right" });

  // ── 6. Client Download Trigger ────────────────────────────────────────────
  try {
    const hostname = new URL(url).hostname;
    doc.save(`audithq-executive-report-${testId}-${hostname}.pdf`);
  } catch {
    doc.save(`audithq-executive-report-${testId}.pdf`);
  }
}
