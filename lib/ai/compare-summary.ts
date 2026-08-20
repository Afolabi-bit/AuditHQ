import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import prisma from "@/lib/db";
import { buildComparisonReport } from "@/lib/comparison/diff-engine";
import { compareAiSummarySchema, CompareAiSummaryData } from "@/lib/comparison/schema";

/**
 * Generates an AI-driven comparative diagnosis between any two completed tests.
 */
export async function generateCompareAiSummary(
  baseTestId: string,
  targetTestId: string
): Promise<CompareAiSummaryData | null> {
  const [baseTest, targetTest] = await Promise.all([
    prisma.test.findUnique({
      where: { id: baseTestId },
      select: {
        id: true,
        device: true,
        network: true,
        createdAt: true,
        performanceScore: true,
        fullReport: true,
        domain: {
          select: { url: true, device: true, network: true },
        },
      },
    }),
    prisma.test.findUnique({
      where: { id: targetTestId },
      select: {
        id: true,
        device: true,
        network: true,
        createdAt: true,
        performanceScore: true,
        fullReport: true,
        domain: {
          select: { url: true, device: true, network: true },
        },
      },
    }),
  ]);

  if (!baseTest || !targetTest || !baseTest.fullReport || !targetTest.fullReport) {
    return null;
  }

  const report = buildComparisonReport({
    baseTest: {
      id: baseTest.id,
      url: baseTest.domain.url,
      device: baseTest.device,
      network: baseTest.network || "No Throttling",
      createdAt: baseTest.createdAt,
      performanceScore: baseTest.performanceScore,
      fullReport: baseTest.fullReport,
    },
    targetTest: {
      id: targetTest.id,
      url: targetTest.domain.url,
      device: targetTest.device,
      network: targetTest.network || "No Throttling",
      createdAt: targetTest.createdAt,
      performanceScore: targetTest.performanceScore,
      fullReport: targetTest.fullReport,
    },
  });

  const topTransitions = report.opportunityTransitions.slice(0, 6).map((t) => ({
    title: t.title,
    state: t.state,
    deltaSavingsMs: t.deltaSavingsMs,
    deltaSavingsBytes: t.deltaSavingsBytes,
  }));

  const resourceChanges = report.resourceDiffs
    .filter((r) => Math.abs(r.deltaBytes) > 2000)
    .map((r) => ({
      resource: r.label,
      delta: r.deltaFormatted,
      percentChange: `${r.percentChange}%`,
      status: r.status,
    }));

  const systemPrompt = `You are a Principal Web Performance Engineer and Core Web Vitals specialist at a top tech company.
Your job is to analyze the performance diff between a BASE test run and a TARGET test run.
Compare metric shifts (LCP, FCP, TBT, CLS), network payload changes, and opportunity fixes/regressions.
Provide an objective, highly actionable, concise comparison diagnosis with:
1. 1-sentence headline summarizing net delta.
2. An accurate speed verdict.
3. 2-3 sentence executive summary.
4. Specific wins and regressions.
5. Concrete recommended action for engineering teams.`;

  const userPrompt = `
Base Test URL: ${report.base.url} (${report.base.device})
Target Test URL: ${report.target.url} (${report.target.device})

Score Shift:
- Base Performance Score: ${report.base.score}/100
- Target Performance Score: ${report.target.score}/100
- Delta: ${report.scoreDelta.deltaDisplay} (${report.scoreDelta.status})

Core Web Vitals Deltas:
- LCP: ${report.metrics.lcp.baseDisplay} -> ${report.metrics.lcp.targetDisplay} (Delta: ${report.metrics.lcp.deltaDisplay}, ${report.metrics.lcp.status})
- FCP: ${report.metrics.fcp.baseDisplay} -> ${report.metrics.fcp.targetDisplay} (Delta: ${report.metrics.fcp.deltaDisplay}, ${report.metrics.fcp.status})
- TBT: ${report.metrics.tbt.baseDisplay} -> ${report.metrics.tbt.targetDisplay} (Delta: ${report.metrics.tbt.deltaDisplay}, ${report.metrics.tbt.status})
- CLS: ${report.metrics.cls.baseDisplay} -> ${report.metrics.cls.targetDisplay} (Delta: ${report.metrics.cls.deltaDisplay}, ${report.metrics.cls.status})
- Speed Index: ${report.metrics.speedIndex.baseDisplay} -> ${report.metrics.speedIndex.targetDisplay} (Delta: ${report.metrics.speedIndex.deltaDisplay})
- TTFB: ${report.metrics.ttfb.baseDisplay} -> ${report.metrics.ttfb.targetDisplay} (Delta: ${report.metrics.ttfb.deltaDisplay})

Network Payload Differences:
${JSON.stringify(resourceChanges, null, 2)}

Audit Opportunity State Transitions:
${JSON.stringify(topTransitions, null, 2)}
`;

  const { object } = await generateObject({
    model: google("gemini-3.6-flash"),
    schema: compareAiSummarySchema,
    system: systemPrompt,
    prompt: userPrompt,
  });

  return object;
}
