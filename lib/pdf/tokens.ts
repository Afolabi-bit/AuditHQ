/**
 * lib/pdf/tokens.ts
 * Brand color palette and score-theme helpers for the PDF engine.
 */

export type RGB = [number, number, number];

export const COLORS = {
  // Background layers
  obsidian:    [10, 16, 32]    as RGB,
  slate800:    [24, 33, 55]    as RGB,
  slate100:    [241, 245, 249] as RGB,
  slate50:     [248, 250, 252] as RGB,
  white:       [255, 255, 255] as RGB,

  // Brand accent
  brand:       [37, 99, 235]   as RGB,  // blue-600
  brandLight:  [219, 234, 254] as RGB,  // blue-100
  indigo:      [99, 102, 241]  as RGB,

  // Semantic
  emerald:     [16, 185, 129]  as RGB,
  emeraldLight:[209, 250, 229] as RGB,
  amber:       [245, 158, 11]  as RGB,
  amberLight:  [254, 243, 199] as RGB,
  rose:        [239, 68, 68]   as RGB,
  roseLight:   [254, 226, 226] as RGB,
  violet:      [139, 92, 246]  as RGB,

  // Text
  ink:         [15, 23, 42]    as RGB,
  muted:       [100, 116, 139] as RGB,
  faint:       [148, 163, 184] as RGB,
  ghostWhite:  [203, 213, 225] as RGB,

  // Border
  border:      [226, 232, 240] as RGB,
} as const;

export interface ScoreTheme {
  fill:   RGB;
  light:  RGB;
  dark:   RGB;
  label:  string;
  rating: string;
}

/** Returns a color theme based on a 0–100 Lighthouse score. */
export function getScoreTheme(score: number): ScoreTheme {
  if (score >= 90) return { fill: COLORS.emerald, light: COLORS.emeraldLight, dark: [6, 95, 70],   label: "Good",       rating: "PASS" };
  if (score >= 50) return { fill: COLORS.amber,   light: COLORS.amberLight,   dark: [120, 53, 15], label: "Needs Work", rating: "WARN" };
  return              { fill: COLORS.rose,    light: COLORS.roseLight,    dark: [153, 27, 27], label: "Poor",       rating: "FAIL" };
}

/** Returns a color theme based on a Lighthouse metric rating string. */
export function getRatingTheme(rating: "good" | "needs-improvement" | "poor"): ScoreTheme {
  if (rating === "good")              return { fill: COLORS.emerald, light: COLORS.emeraldLight, dark: [6, 95, 70],   label: "Good", rating: "PASS" };
  if (rating === "needs-improvement") return { fill: COLORS.amber,   light: COLORS.amberLight,   dark: [120, 53, 15], label: "Avg",  rating: "WARN" };
  return                              { fill: COLORS.rose,    light: COLORS.roseLight,    dark: [153, 27, 27], label: "Poor", rating: "FAIL" };
}
