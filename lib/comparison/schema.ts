import { z } from "zod";

export const compareAiSummarySchema = z.object({
  headline: z
    .string()
    .describe(
      "1-sentence punchy summary of the net change in performance between the base and target runs (e.g. 'Target build reduced LCP by 650ms through responsive image compression, but added 120ms of main-thread script execution.')."
    ),
  verdict: z
    .enum(["Significant Improvement", "Moderate Improvement", "Neutral / Comparable", "Regression", "Severe Regression"])
    .describe("Overall speed and user experience verdict."),
  executiveSummary: z
    .string()
    .describe(
      "2-3 sentences written in clear, high-impact business English summarizing the root causes and user experience impact of this build change."
    ),
  keyWins: z
    .array(z.string())
    .max(3)
    .describe("Up to 3 specific optimizations or improvements achieved in the target run."),
  keyRegressions: z
    .array(z.string())
    .max(3)
    .describe("Up to 3 specific regressions, newly introduced scripts, or payload bloats in the target run (if any)."),
  recommendedAction: z
    .string()
    .describe(
      "A concrete next step recommendation for the engineering team (e.g. 'Safe to ship to production' or 'Defer third-party script to restore TBT before merging')."
    ),
});

export type CompareAiSummaryData = z.infer<typeof compareAiSummarySchema>;
