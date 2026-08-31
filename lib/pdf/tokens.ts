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
  sky:         [56, 189, 248]  as RGB,  // sky-400

  // Semantic
  emerald:     [5, 150, 105]   as RGB,  // emerald-600
  emeraldLight:[209, 250, 229] as RGB,  // emerald-100
  amber:       [217, 119, 6]   as RGB,  // amber-600
  amberLight:  [254, 243, 199] as RGB,  // amber-100
  rose:        [220, 38, 38]   as RGB,  // red-600
  roseLight:   [254, 226, 226] as RGB,  // red-100
  cyan:        [2, 132, 199]   as RGB,  // cyan-600

  // Text
  ink:         [15, 23, 42]    as RGB,
  muted:       [71, 85, 105]   as RGB,
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
