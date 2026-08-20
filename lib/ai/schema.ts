import { z } from "zod";

export const aiSummarySchema = z.object({
  headline: z.string().describe("1-sentence punchy diagnosis of site health and primary bottleneck"),
  executiveSummary: z.string().describe("2-3 concise sentences in plain English for non-technical clients and stakeholders"),
  verdict: z.enum(["Optimal", "Good", "Needs Attention", "Critical"]).describe("Overall speed grade"),
  estimatedImpact: z.object({
    timeSavedFormatted: z.string().describe("Formatted potential load time reduction, e.g. '-1.4s' or '-650ms'"),
    conversionLift: z.string().describe("Estimated conversion or bounce rate improvement, e.g. '+7-11%'"),
  }),
  priorityFixes: z.array(
    z.object({
      title: z.string().describe("Short, actionable title for the fix"),
      category: z.enum(["JavaScript", "Images", "CSS", "Server & Cache", "Layout Shift"]).describe("Technical category"),
      urgency: z.enum(["High", "Medium", "Low"]).describe("Implementation priority"),
      wastedFormatted: z.string().optional().describe("e.g. 'Saved: 850ms' or 'Saved: 1.2 MB'"),
      problem: z.string().describe("Clear explanation of what is currently causing the bottleneck"),
      solution: z.string().describe("Exact technical or architectural solution to resolve it"),
      codeSnippet: z.string().optional().describe("Concrete copy-paste code snippet or configuration fix (e.g., Next.js Image, script loading, font-display, cache headers)"),
    })
  ).max(4).describe("Top 3 to 4 prioritized fixes ranked by ROI"),
  keyStrengths: z.array(z.string()).max(3).describe("2 to 3 positive performance highlights or passed audits"),
});

export type AiSummaryData = z.infer<typeof aiSummarySchema>;
