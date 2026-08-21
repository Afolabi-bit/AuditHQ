/**
 * lib/pdf/primitives.ts
 * Low-level jsPDF drawing helpers used throughout the PDF engine.
 * All functions accept a `doc: any` (jsPDF instance) as the first argument.
 */

import { RGB, COLORS } from "./tokens";

// ─── Color Setters ───────────────────────────────────────────────────────────

export function fill(doc: any, color: RGB) {
  doc.setFillColor(...color);
}

export function draw(doc: any, color: RGB) {
  doc.setDrawColor(...color);
}

export function textColor(doc: any, color: RGB) {
  doc.setTextColor(...color);
}

// ─── Shape Primitives ────────────────────────────────────────────────────────

/** Filled axis-aligned rectangle. */
export function filledRect(doc: any, x: number, y: number, w: number, h: number, color: RGB) {
  fill(doc, color);
  doc.rect(x, y, w, h, "F");
}

/** Rounded rectangle with fill only. */
export function filledRoundRect(doc: any, x: number, y: number, w: number, h: number, r: number, color: RGB) {
  fill(doc, color);
  doc.roundedRect(x, y, w, h, r, r, "F");
}

/** Rounded rectangle with stroke only. */
export function strokedRoundRect(doc: any, x: number, y: number, w: number, h: number, r: number, color: RGB, lw = 0.3) {
  draw(doc, color);
  doc.setLineWidth(lw);
  doc.roundedRect(x, y, w, h, r, r, "S");
}

/** Horizontal rule. */
export function hLine(doc: any, x1: number, y: number, x2: number, color: RGB, w = 0.25) {
  doc.setDrawColor(...color);
  doc.setLineWidth(w);
  doc.line(x1, y, x2, y);
}

// ─── Brand Vector Logo ───────────────────────────────────────────────────────

/**
 * Draws the vector brand logo: blue rounded tile with crisp geometric lightning bolt + wordmark.
 * Uses pure vector triangles/polygons to ensure zero font-dependency or unicode glyph corruption.
 */
export function drawBrandLogo(
  doc: any,
  x: number,
  y: number,
  options?: { isDark?: boolean; showText?: boolean; size?: number }
) {
  const isDark = options?.isDark ?? true;
  const showText = options?.showText ?? true;
  const s = options?.size ?? 7.5; // size in mm

  // Brand tile: rounded rectangle with brand color
  filledRoundRect(doc, x, y, s, s, 1.8, COLORS.brand);

  // Geometric Vector Lightning Bolt (sharp pure vectors)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);

  // Upper blade of the lightning bolt
  doc.triangle(
    x + s * 0.58, y + s * 0.16, // top apex
    x + s * 0.28, y + s * 0.54, // left notch
    x + s * 0.52, y + s * 0.54, // center right
    "F"
  );
  // Lower blade of the lightning bolt
  doc.triangle(
    x + s * 0.42, y + s * 0.84, // bottom point
    x + s * 0.72, y + s * 0.46, // right notch
    x + s * 0.48, y + s * 0.46, // center left
    "F"
  );
  // Center bridge
  doc.rect(x + s * 0.44, y + s * 0.46, s * 0.12, s * 0.08, "F");

  // Wordmark: "AuditHQ"
  if (showText) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    textColor(doc, isDark ? COLORS.white : COLORS.ink);
    doc.text("Audit", x + s + 3, y + s * 0.76);

    const auditW = doc.getTextWidth("Audit");
    textColor(doc, isDark ? [147, 197, 253] : COLORS.brand);
    doc.text("HQ", x + s + 3 + auditW, y + s * 0.76);
  }
}

// ─── Composite Widgets ───────────────────────────────────────────────────────

/**
 * Draws a status pill (rounded chip with label).
 */
export function drawStatusPill(
  doc: any,
  x: number, y: number,
  label: string,
  bgColor: RGB, textCol: RGB,
  pillW = 20, pillH = 5, fontSize = 6
) {
  filledRoundRect(doc, x, y, pillW, pillH, 1.2, bgColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize);
  textColor(doc, textCol);
  doc.text(label, x + pillW / 2, y + pillH / 2 + 1.1, { align: "center" });
}

/**
 * Draws a horizontal progress bar with a track background.
 */
export function drawMiniBar(
  doc: any,
  x: number, y: number,
  totalW: number, h: number,
  fraction: number,
  fillCol: RGB,
  trackCol: RGB = COLORS.border
) {
  filledRoundRect(doc, x, y, totalW, h, h / 2, trackCol);
  if (fraction > 0) {
    const filled = Math.max(2, Math.min(totalW, totalW * fraction));
    filledRoundRect(doc, x, y, filled, h, h / 2, fillCol);
  }
}

/**
 * Draws a circular arc gauge using connected line segments (pure vector).
 */
export function drawVectorGauge(
  doc: any,
  cx: number, cy: number,
  r: number,
  score: number,
  strokeRgb: RGB,
  trackRgb: RGB = COLORS.border
) {
  const steps = 60;
  doc.setLineWidth(1.8);

  // Background track
  doc.setDrawColor(...trackRgb);
  for (let i = 0; i < steps; i++) {
    const a1 = (i / steps) * 2 * Math.PI - Math.PI / 2;
    const a2 = ((i + 1) / steps) * 2 * Math.PI - Math.PI / 2;
    doc.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
  }

  // Colored progress arc
  doc.setDrawColor(...strokeRgb);
  const progressSteps = Math.max(1, Math.round((Math.min(100, Math.max(0, score)) / 100) * steps));
  for (let i = 0; i < progressSteps; i++) {
    const a1 = (i / steps) * 2 * Math.PI - Math.PI / 2;
    const a2 = ((i + 1) / steps) * 2 * Math.PI - Math.PI / 2;
    doc.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
  }
}
