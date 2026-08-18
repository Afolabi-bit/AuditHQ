import { inngest } from "@/lib/inngest";
import { runPageSpeedAudit } from "@/lib/pagespeed-runner";
import prisma from "@/lib/db";

export const runLighthouseAudit = inngest.createFunction(
  {
    id: "pagespeed-runner",
    triggers: [{ event: "test/run-audit" }],
  },
  async ({ event, step }) => {
    const { testId, url, device, network } = event.data;

    // Step 1: Run the audit via Google PageSpeed Insights Cloud API
    const results = await step.run("run-pagespeed-audit", async () => {
      return await runPageSpeedAudit({
        url,
        device,
        network,
      });
    });

    // Step 2: Save results to database
    await step.run("save-results-to-db", async () => {
      await prisma.test.update({
        where: { id: testId },
        data: {
          status: "completed",
          performanceScore: results.performanceScore,
          fcp: results.fcp,
          lcp: results.lcp,
          tbt: results.tbt,
          cls: results.cls,
          fullReport: results.fullReport,
        },
      });
    });

    return { success: true, testId };
  }
);
