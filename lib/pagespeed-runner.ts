import "server-only";
import prisma from "./db";

export interface PageSpeedAuditParams {
  url: string;
  device?: "mobile" | "desktop" | string;
  network?: string;
  apiKey?: string;
}

export interface PageSpeedAuditResult {
  performanceScore: number;
  accessibilityScore?: number;
  bestPracticesScore?: number;
  seoScore?: number;
  fcp: number | null;
  lcp: number | null;
  tbt: number | null;
  cls: number | null;
  speedIndex?: number | null;
  fullReport: any;
}

/**
 * Runs a performance & SEO audit on the given URL using the official Google PageSpeed Insights API.
 * This runs on Google's cloud infrastructure (Lighthouse engine) with zero local Chrome dependency.
 */
export async function runPageSpeedAudit(
  params: PageSpeedAuditParams,
): Promise<PageSpeedAuditResult> {
  const {
    url,
    device = "desktop",
    apiKey = process.env.PAGESPEED_API_KEY,
  } = params;

  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error("A valid URL is required for auditing");
  }

  // Ensure URL has protocol
  let targetUrl = url.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  // Validate URL format
  try {
    new URL(targetUrl);
  } catch {
    throw new Error(`The provided URL is invalid: "${targetUrl}"`);
  }

  const strategy = device.toLowerCase() === "mobile" ? "MOBILE" : "DESKTOP";

  // Build Google PageSpeed Insights API URL
  const apiUrl = new URL(
    "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed",
  );
  apiUrl.searchParams.set("url", targetUrl);
  apiUrl.searchParams.set("strategy", strategy);
  apiUrl.searchParams.append("category", "PERFORMANCE");
  apiUrl.searchParams.append("category", "ACCESSIBILITY");
  apiUrl.searchParams.append("category", "BEST_PRACTICES");
  apiUrl.searchParams.append("category", "SEO");

  if (apiKey) {
    apiUrl.searchParams.set("key", apiKey);
  }

  console.log(
    `🔍 [PageSpeed API] Running cloud audit on: ${targetUrl} (${strategy})...`,
  );

  const response = await fetch(apiUrl.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    // Cache for 10 seconds to avoid duplicate immediate hits, but keep fresh
    next: { revalidate: 0 },
  });

  console.log(response);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "❌ [PageSpeed API] Error response:",
      response.status,
      errorText,
    );
    let errorMessage = `Google PageSpeed API failed with status ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.error?.message) {
        errorMessage = parsed.error.message;
      }
    } catch {
      // Use fallback error message
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const lhr = data.lighthouseResult;

  if (!lhr) {
    throw new Error("PageSpeed API returned no Lighthouse report data");
  }

  const categories = lhr.categories || {};
  const audits = lhr.audits || {};

  const performanceScore =
    categories.performance?.score != null
      ? Math.round(categories.performance.score * 100)
      : 0;

  const accessibilityScore =
    categories.accessibility?.score != null
      ? Math.round(categories.accessibility.score * 100)
      : undefined;

  const bestPracticesScore =
    categories["best-practices"]?.score != null
      ? Math.round(categories["best-practices"].score * 100)
      : undefined;

  const seoScore =
    categories.seo?.score != null
      ? Math.round(categories.seo.score * 100)
      : undefined;

  const fcp = audits["first-contentful-paint"]?.numericValue ?? null;
  const lcp = audits["largest-contentful-paint"]?.numericValue ?? null;
  const tbt = audits["total-blocking-time"]?.numericValue ?? null;
  const cls = audits["cumulative-layout-shift"]?.numericValue ?? null;
  const speedIndex = audits["speed-index"]?.numericValue ?? null;

  console.log(
    "\n================ [PAGESPEED API RAW RESPONSE] ================",
  );
  console.log(JSON.stringify(data, null, 2));
  console.log(
    "===============================================================\n",
  );

  console.log("📊 [PAGESPEED EXTRACTED METRICS]:", {
    url: targetUrl,
    strategy,
    performanceScore,
    accessibilityScore,
    bestPracticesScore,
    seoScore,
    fcp_ms: fcp,
    lcp_ms: lcp,
    tbt_ms: tbt,
    cls: cls,
    speedIndex_ms: speedIndex,
  });

  return {
    performanceScore,
    accessibilityScore,
    bestPracticesScore,
    seoScore,
    fcp,
    lcp,
    tbt,
    cls,
    speedIndex,
    fullReport: lhr,
  };
}

/**
 * Executes an audit asynchronously for a specific test record in the database.
 * Updates test status to 'completed' or 'failed' upon completion.
 */
export async function executeAuditForTest(
  testId: number,
  url: string,
  device: string,
  network?: string,
) {
  try {
    const results = await runPageSpeedAudit({
      url,
      device,
      network,
    });

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

    console.log(
      `✅ [DB] Updated test #${testId} with completed PageSpeed audit results`,
    );
  } catch (error) {
    console.error(
      `❌ [DB] Test #${testId} failed during PageSpeed audit:`,
      error,
    );
    await prisma.test
      .update({
        where: { id: testId },
        data: {
          status: "failed",
        },
      })
      .catch((dbErr) => {
        console.error(
          `Failed to update test #${testId} to failed status:`,
          dbErr,
        );
      });
  }
}
