import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import prisma from "@/lib/db";
import { aiSummarySchema, AiSummaryData } from "./schema";
import { parseLighthouseReport } from "@/lib/report-parser";

/**
 * Generates and permanently caches an AI summary for a completed test in PostgreSQL.
 * If already cached in the database, returns the stored summary immediately and NEVER invokes the LLM.
 */
export async function getOrGenerateAiSummary(
  testId: string
): Promise<AiSummaryData | null> {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      domain: {
        select: {
          url: true,
          device: true,
          network: true,
        },
      },
    },
  });

  if (!test || test.status !== "completed" || !test.fullReport) {
    return null;
  }

  // ── 1. Strict DB Cache Check: If exists, return immediately with zero LLM execution ──
  if (test.aiSummary) {
    return test.aiSummary as unknown as AiSummaryData;
  }

  // ── 2. First-Time Generation ──
  const parsed = parseLighthouseReport(test.fullReport);

  const topOpportunities = parsed.opportunities
    .filter(
      (opp) =>
        (opp.overallSavingsMs && opp.overallSavingsMs > 50) ||
        (opp.overallSavingsBytes && opp.overallSavingsBytes > 20000)
    )
    .slice(0, 5)
    .map((opp) => ({
      id: opp.id,
      title: opp.title,
      description: opp.description,
      savingsMs: opp.overallSavingsMs,
      savingsBytes: opp.overallSavingsBytes,
      displayValue: opp.displayValue,
      topItems: opp.items?.slice(0, 3).map((it) => ({
        url: it.url ? it.url.split("/").pop() || it.url : undefined,
        wastedMs: it.wastedMs,
        wastedBytes: it.wastedBytes,
      })),
    }));

  const topDiagnostics = parsed.diagnostics.slice(0, 4).map((d) => ({
    id: d.id,
    title: d.title,
    displayValue: d.displayValue,
  }));

  const systemPrompt = `You are an elite Web Performance Engineer and Core Web Vitals expert.
Your job is to analyze website performance audit telemetry from Google Lighthouse and provide:
1. A 1-sentence punchy headline diagnosis.
2. A 2-3 sentence executive summary written in plain, compelling English for stakeholders and founders.
3. An accurate overall speed grade verdict ("Optimal" | "Good" | "Needs Attention" | "Critical").
4. Quantified potential time savings (e.g. "-1.4s" or "-650ms") and conversion lift impact.
5. Up to 4 prioritized, highly actionable code fixes. Where applicable, provide concrete, drop-in code snippets (e.g., Next.js Image component, font-display: swap, script loading strategies, dynamic imports, resource hints).
6. 2-3 key positive strengths of the website.`;

  const userPrompt = `
Website URL: ${test.domain.url}
Emulated Device: ${test.domain.device} (${test.domain.network})
Category Scores:
- Performance: ${parsed.scores.performance}/100
- Accessibility: ${parsed.scores.accessibility}/100
- Best Practices: ${parsed.scores.bestPractices}/100
- SEO: ${parsed.scores.seo}/100

Core Web Vitals Metrics:
- First Contentful Paint (FCP): ${parsed.metrics.fcp.displayValue} (${parsed.metrics.fcp.rating})
- Largest Contentful Paint (LCP): ${parsed.metrics.lcp.displayValue} (${parsed.metrics.lcp.rating})
- Total Blocking Time (TBT): ${parsed.metrics.tbt.displayValue} (${parsed.metrics.tbt.rating})
- Cumulative Layout Shift (CLS): ${parsed.metrics.cls.displayValue} (${parsed.metrics.cls.rating})
- Speed Index: ${parsed.metrics.speedIndex.displayValue}
- Time to First Byte (TTFB): ${parsed.metrics.ttfb.displayValue}

Total Transferred Size: ${(parsed.totalByteWeight / 1024 / 1024).toFixed(2)} MB

Top Opportunities:
${JSON.stringify(topOpportunities, null, 2)}

Diagnostics:
${JSON.stringify(topDiagnostics, null, 2)}
`;

  const { object } = await generateObject({
    model: google("gemini-3.6-flash"),
    schema: aiSummarySchema,
    system: systemPrompt,
    prompt: userPrompt,
  });

  // ── 3. Permanently save into database ──
  await prisma.test.update({
    where: { id: test.id },
    data: {
      aiSummary: object as any,
    },
  });

  return object;
}
