"use server";

import prisma from "@/lib/db";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

export async function syncUserToDatabase(user: KindeUser) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || "",
          name: user.given_name + " " + user.family_name,
        },
      });
    }
  } catch (error) {
    console.error("Error syncing user:", error);
  }
}

/**
 * Cancels any pending tests for a specific domain.
 * Scoped to a single domain to avoid corrupting other users' data.
 */
async function cancelPendingTestsForDomain(domainId: number) {
  await prisma.test.updateMany({
    where: {
      domainId: domainId,
      status: "pending",
    },
    data: {
      status: "cancelled",
    },
  });
}

interface Domain {
  url: string;
  device: string;
  network: string;
  userID: string;
}

export async function submitDomain(data: Domain) {
  let test;
  try {
    const normalizedUrl = data.url.trim().replace(/\/+$/, "");

    // Look for existing tracked domain for this user
    let domain = await prisma.domain.findFirst({
      where: {
        url: normalizedUrl,
        ownerId: data.userID,
      },
    });

    if (domain) {
      // Cancel previous pending tests for this domain & update latest preferences
      await cancelPendingTestsForDomain(domain.id);
      await prisma.domain.update({
        where: { id: domain.id },
        data: {
          device: data.device || "desktop",
          network: data.network || "No Throttling",
        },
      });

      test = await prisma.test.create({
        data: {
          domainId: domain.id,
          device: data.device || "desktop",
          network: data.network || "No Throttling",
          status: "pending",
        },
      });
    } else {
      domain = await prisma.domain.create({
        data: {
          url: normalizedUrl,
          device: data.device || "desktop",
          network: data.network || "No Throttling",
          ownerId: data.userID,
        },
      });

      test = await prisma.test.create({
        data: {
          domainId: domain.id,
          device: data.device || "desktop",
          network: data.network || "No Throttling",
          status: "pending",
        },
      });
    }

    return {
      success: true,
      message: "Test queued successfully",
      testId: test.id,
    };
  } catch (error) {
    console.error("Error submitting domain:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to submit domain: ${error.message}`);
    }
    throw new Error("Failed to submit domain");
  }
}

export async function getTestStatus(id: number) {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id: id,
      },
    });
    return test;
  } catch (error) {
    console.error("Error getting test status:", error);
    throw new Error("Failed to get test status");
  }
}

export async function getRecentTests(userID: string) {
  try {
    const tests = await prisma.test.findMany({
      where: {
        domain: {
          ownerId: userID,
        },
      },
      include: {
        domain: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return tests;
  } catch (error) {
    console.error("Error getting recent tests:", error);
    throw new Error("Failed to get recent tests");
  }
}

export interface DashboardStats {
  testsThisMonth: number;
  testsLimit: number;
  avgPerformance: number | null;
  performanceDiff: number | null;
  activeSites: number;
  avgLoadTime: number | null;
  loadTimeDiff: number | null;
  performanceTrends: { date: string; score: number }[];
  coreWebVitals: {
    lcp: number | null;
    tbt: number | null;
    cls: number | null;
  };
  recommendations: {
    type: "warning" | "info" | "success";
    title: string;
    description: string;
  }[];
}

export async function getDashboardStats(
  userID: string,
): Promise<DashboardStats> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Run parallel count & aggregate queries
    const [testsThisMonth, activeSites, completedTests] = await Promise.all([
      prisma.test.count({
        where: {
          domain: { ownerId: userID },
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.domain.count({
        where: {
          ownerId: userID,
        },
      }),
      prisma.test.findMany({
        where: {
          domain: { ownerId: userID },
          status: "completed",
          performanceScore: { not: null },
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

    const testsLimit = 100;

    if (completedTests.length === 0) {
      return {
        testsThisMonth,
        testsLimit,
        avgPerformance: null,
        performanceDiff: null,
        activeSites,
        avgLoadTime: null,
        loadTimeDiff: null,
        performanceTrends: [],
        coreWebVitals: {
          lcp: null,
          tbt: null,
          cls: null,
        },
        recommendations: [
          {
            type: "info",
            title: "Run your first performance audit",
            description:
              "Enter any website URL above to generate deep Lighthouse metrics and Core Web Vitals.",
          },
        ],
      };
    }

    // 1. Calculate Average Performance
    const validScores = completedTests
      .map((t) => t.performanceScore)
      .filter((s): s is number => typeof s === "number");

    const avgPerformance =
      validScores.length > 0
        ? Math.round(
            validScores.reduce((a, b) => a + b, 0) / validScores.length,
          )
        : null;

    // Performance diff (compare latest half vs older half if >= 4 tests)
    let performanceDiff: number | null = null;
    if (validScores.length >= 4) {
      const mid = Math.floor(validScores.length / 2);
      const recentAvg =
        validScores.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
      const olderAvg =
        validScores.slice(mid).reduce((a, b) => a + b, 0) /
        (validScores.length - mid);
      performanceDiff = Math.round(recentAvg - olderAvg);
    }

    // 2. Calculate Average Load Time (LCP in seconds)
    const validLcps = completedTests
      .map((t) => t.lcp)
      .filter((l): l is number => typeof l === "number" && l > 0);

    const avgLoadTimeMs =
      validLcps.length > 0
        ? validLcps.reduce((a, b) => a + b, 0) / validLcps.length
        : null;

    const avgLoadTime =
      avgLoadTimeMs != null
        ? Math.round(avgLoadTimeMs / 100) / 10 // Convert to seconds with 1 decimal
        : null;

    let loadTimeDiff: number | null = null;
    if (validLcps.length >= 4) {
      const mid = Math.floor(validLcps.length / 2);
      const recentLcpAvg =
        validLcps.slice(0, mid).reduce((a, b) => a + b, 0) / mid / 1000;
      const olderLcpAvg =
        validLcps.slice(mid).reduce((a, b) => a + b, 0) /
        (validLcps.length - mid) /
        1000;
      loadTimeDiff = Math.round((recentLcpAvg - olderLcpAvg) * 10) / 10;
    }

    // 3. Performance Trend (Last 7 completed tests, chronological)
    const trendSlice = completedTests.slice(0, 7).reverse();
    const performanceTrends = trendSlice.map((t) => ({
      date: new Date(t.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: t.performanceScore ?? 0,
    }));

    // 4. Core Web Vitals Averages
    const validTbts = completedTests
      .map((t) => t.tbt)
      .filter((v): v is number => typeof v === "number" && v >= 0);
    const avgTbt =
      validTbts.length > 0
        ? Math.round(validTbts.reduce((a, b) => a + b, 0) / validTbts.length)
        : null;

    const validCls = completedTests
      .map((t) => t.cls)
      .filter((v): v is number => typeof v === "number" && v >= 0);
    const avgCls =
      validCls.length > 0
        ? Math.round(
            (validCls.reduce((a, b) => a + b, 0) / validCls.length) * 100,
          ) / 100
        : null;

    // 5. Dynamic Recommendations derived from live metrics
    const recommendations: DashboardStats["recommendations"] = [];

    if (avgLoadTime != null && avgLoadTime > 2.5) {
      recommendations.push({
        type: "warning",
        title: "Optimize Largest Contentful Paint (LCP)",
        description: `Average LCP is ${avgLoadTime}s (threshold: 2.5s). Compress hero images, use WebP/AVIF formats, and prioritize critical CSS.`,
      });
    }

    if (avgTbt != null && avgTbt > 200) {
      recommendations.push({
        type: "warning",
        title: "Reduce Total Blocking Time (TBT)",
        description: `Average TBT is ${avgTbt}ms (threshold: 200ms). Minimize heavy third-party scripts and defer non-essential JavaScript execution.`,
      });
    }

    if (avgCls != null && avgCls > 0.1) {
      recommendations.push({
        type: "warning",
        title: "Fix Cumulative Layout Shift (CLS)",
        description: `Average CLS is ${avgCls} (threshold: 0.1). Set explicit width & height on images and ad containers to avoid layout jumping.`,
      });
    }

    if (avgPerformance != null && avgPerformance >= 90) {
      recommendations.push({
        type: "success",
        title: "Outstanding Site Health",
        description:
          "Your monitored sites are achieving optimal Lighthouse performance scores across devices.",
      });
    }

    if (recommendations.length === 0) {
      recommendations.push(
        {
          type: "success",
          title: "Good Server Response Time",
          description:
            "Time to First Byte (TTFB) and CDN caching are performing within optimal parameters.",
        },
        {
          type: "info",
          title: "Continuous Monitoring",
          description:
            "Run periodic mobile and desktop audits to catch performance regressions early.",
        },
      );
    }

    return {
      testsThisMonth,
      testsLimit,
      avgPerformance,
      performanceDiff,
      activeSites,
      avgLoadTime,
      loadTimeDiff,
      performanceTrends,
      coreWebVitals: {
        lcp: avgLoadTime,
        tbt: avgTbt,
        cls: avgCls,
      },
      recommendations,
    };
  } catch (error) {
    console.error("Error computing dashboard stats:", error);
    throw new Error("Failed to compute dashboard stats");
  }
}
