import { parseLighthouseReport, ParsedLighthouseReport } from "@/lib/report-parser";
import {
  ComparisonReport,
  MetricDelta,
  MetricPolarity,
  DeltaStatus,
  ResourceTypeDiff,
  OpportunityTransition,
  OpportunityState,
  SynchronizedFrame,
} from "./types";

/**
 * Format raw byte numbers to clean human-readable strings (KB, MB).
 */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 KB";
  const abs = Math.abs(bytes);
  if (abs >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * Helper to compute single metric delta with correct polarity
 */
export function computeMetricDelta({
  id,
  name,
  baseValue,
  targetValue,
  baseDisplay,
  targetDisplay,
  polarity,
  unit = "",
  decimals = 1,
}: {
  id: string;
  name: string;
  baseValue: number | null;
  targetValue: number | null;
  baseDisplay: string;
  targetDisplay: string;
  polarity: MetricPolarity;
  unit?: string;
  decimals?: number;
}): MetricDelta {
  if (baseValue == null || targetValue == null) {
    return {
      id,
      name,
      baseValue,
      targetValue,
      baseDisplay: baseDisplay || "—",
      targetDisplay: targetDisplay || "—",
      delta: null,
      deltaDisplay: "—",
      percentChange: null,
      status: "neutral",
      polarity,
      unit,
    };
  }

  const rawDelta = targetValue - baseValue;
  const delta = Number(rawDelta.toFixed(decimals));

  let percentChange: number | null = null;
  if (baseValue !== 0) {
    percentChange = Number((((targetValue - baseValue) / Math.abs(baseValue)) * 100).toFixed(1));
  }

  // Determine status based on polarity
  let status: DeltaStatus = "unchanged";
  const threshold = decimals === 0 ? 0.5 : Math.pow(10, -decimals) / 2;

  if (Math.abs(rawDelta) > threshold) {
    if (polarity === "higher_is_better") {
      status = rawDelta > 0 ? "improved" : "regressed";
    } else {
      // lower_is_better (e.g. LCP, TBT, CLS)
      status = rawDelta < 0 ? "improved" : "regressed";
    }
  }

  let deltaPrefix = rawDelta > 0 ? "+" : "";
  if (rawDelta === 0) deltaPrefix = "";

  const deltaDisplay = `${deltaPrefix}${delta}${unit ? ` ${unit}` : ""}`;

  return {
    id,
    name,
    baseValue,
    targetValue,
    baseDisplay: baseDisplay || `${baseValue}${unit}`,
    targetDisplay: targetDisplay || `${targetValue}${unit}`,
    delta,
    deltaDisplay,
    percentChange,
    status,
    polarity,
    unit,
  };
}

/**
 * Quantize and align non-uniform filmstrip captures into identical timestamps
 */
export function quantizeAndSynchronizeFilmstrip(
  baseFilmstrip: Array<{ timing: number; data: string }>,
  targetFilmstrip: Array<{ timing: number; data: string }>
): SynchronizedFrame[] {
  if ((!baseFilmstrip || baseFilmstrip.length === 0) && (!targetFilmstrip || targetFilmstrip.length === 0)) {
    return [];
  }

  const maxBase = baseFilmstrip.length > 0 ? Math.max(...baseFilmstrip.map((f) => f.timing)) : 0;
  const maxTarget = targetFilmstrip.length > 0 ? Math.max(...targetFilmstrip.map((f) => f.timing)) : 0;
  const maxTiming = Math.max(maxBase, maxTarget, 2000);

  // Generate 500ms quantized intervals up to max timing (capped at 6000ms)
  const stepMs = 500;
  const maxStep = Math.min(Math.ceil(maxTiming / stepMs) * stepMs, 6000);

  const frames: SynchronizedFrame[] = [];

  for (let t = 0; t <= maxStep; t += stepMs) {
    // Find latest frame at or before t
    const baseCandidate = [...baseFilmstrip]
      .filter((f) => f.timing <= t)
      .sort((a, b) => b.timing - a.timing)[0];

    const targetCandidate = [...targetFilmstrip]
      .filter((f) => f.timing <= t)
      .sort((a, b) => b.timing - a.timing)[0];

    const baseFrame = baseCandidate?.data || (baseFilmstrip.length > 0 ? baseFilmstrip[0].data : null);
    const targetFrame = targetCandidate?.data || (targetFilmstrip.length > 0 ? targetFilmstrip[0].data : null);

    // Consider painted if timestamp is > 0 and frame exists
    const isBasePainted = Boolean(baseCandidate && baseCandidate.timing > 0);
    const isTargetPainted = Boolean(targetCandidate && targetCandidate.timing > 0);

    frames.push({
      timestampMs: t,
      baseFrame,
      targetFrame,
      isBasePainted,
      isTargetPainted,
    });
  }

  return frames;
}

/**
 * Compare Network Resource Summary Breakdown
 */
export function computeResourceDiffs(
  baseSummary: ParsedLighthouseReport["resourceSummary"] = [],
  targetSummary: ParsedLighthouseReport["resourceSummary"] = [],
  baseTotalWeight = 0,
  targetTotalWeight = 0
): ResourceTypeDiff[] {
  const resourceTypes: Array<{ type: ResourceTypeDiff["resourceType"]; label: string }> = [
    { type: "script", label: "JavaScript" },
    { type: "stylesheet", label: "CSS Stylesheets" },
    { type: "image", label: "Images & Media" },
    { type: "font", label: "Web Fonts" },
    { type: "document", label: "HTML Document" },
    { type: "other", label: "Other / Third-Party" },
    { type: "total", label: "Total Page Weight" },
  ];

  return resourceTypes.map(({ type, label }) => {
    if (type === "total") {
      const deltaBytes = targetTotalWeight - baseTotalWeight;
      const percentChange = baseTotalWeight > 0 ? Number(((deltaBytes / baseTotalWeight) * 100).toFixed(1)) : 0;
      let status: DeltaStatus = "unchanged";
      if (Math.abs(deltaBytes) > 5000) {
        status = deltaBytes < 0 ? "improved" : "regressed";
      }

      return {
        resourceType: type,
        label,
        baseBytes: baseTotalWeight,
        targetBytes: targetTotalWeight,
        deltaBytes,
        percentChange,
        baseFormatted: formatBytes(baseTotalWeight),
        targetFormatted: formatBytes(targetTotalWeight),
        deltaFormatted: `${deltaBytes > 0 ? "+" : ""}${formatBytes(deltaBytes)}`,
        status,
      };
    }

    const baseItem = baseSummary.find((r) => r.resourceType === type);
    const targetItem = targetSummary.find((r) => r.resourceType === type);

    const baseBytes = baseItem?.transferSize || 0;
    const targetBytes = targetItem?.transferSize || 0;
    const deltaBytes = targetBytes - baseBytes;
    const percentChange = baseBytes > 0 ? Number(((deltaBytes / baseBytes) * 100).toFixed(1)) : 0;

    let status: DeltaStatus = "unchanged";
    if (Math.abs(deltaBytes) > 2000) {
      status = deltaBytes < 0 ? "improved" : "regressed";
    }

    return {
      resourceType: type,
      label,
      baseBytes,
      targetBytes,
      deltaBytes,
      percentChange,
      baseFormatted: formatBytes(baseBytes),
      targetFormatted: formatBytes(targetBytes),
      deltaFormatted: `${deltaBytes > 0 ? "+" : ""}${formatBytes(deltaBytes)}`,
      status,
    };
  });
}

/**
 * Compare Opportunities & Diagnostics state transitions
 */
export function computeOpportunityTransitions(
  baseOpps: ParsedLighthouseReport["opportunities"] = [],
  targetOpps: ParsedLighthouseReport["opportunities"] = []
): OpportunityTransition[] {
  const allIds = Array.from(new Set([...baseOpps.map((o) => o.id), ...targetOpps.map((o) => o.id)]));

  const transitions: OpportunityTransition[] = [];

  for (const id of allIds) {
    const base = baseOpps.find((o) => o.id === id);
    const target = targetOpps.find((o) => o.id === id);

    const title = target?.title || base?.title || id;
    const description = target?.description || base?.description || "";

    const baseSavingsMs = base?.overallSavingsMs || 0;
    const targetSavingsMs = target?.overallSavingsMs || 0;
    const deltaSavingsMs = targetSavingsMs - baseSavingsMs;

    const baseSavingsBytes = base?.overallSavingsBytes || 0;
    const targetSavingsBytes = target?.overallSavingsBytes || 0;
    const deltaSavingsBytes = targetSavingsBytes - baseSavingsBytes;

    let state: OpportunityState = "unchanged";

    if (base && !target) {
      state = "resolved";
    } else if (!base && target) {
      state = "new_issue";
    } else if (base && target) {
      if (deltaSavingsMs < -50 || deltaSavingsBytes < -10000) {
        state = "improved";
      } else if (deltaSavingsMs > 50 || deltaSavingsBytes > 10000) {
        state = "worsened";
      }
    }

    // Only include if there's non-trivial data
    if (baseSavingsMs > 0 || targetSavingsMs > 0 || baseSavingsBytes > 0 || targetSavingsBytes > 0) {
      transitions.push({
        id,
        title,
        description,
        baseSavingsMs,
        targetSavingsMs,
        deltaSavingsMs,
        baseSavingsBytes,
        targetSavingsBytes,
        deltaSavingsBytes,
        state,
      });
    }
  }

  // Sort: new_issue first, then worsened, then improved, then resolved
  const priorityOrder: Record<OpportunityState, number> = {
    new_issue: 1,
    worsened: 2,
    improved: 3,
    resolved: 4,
    unchanged: 5,
  };

  return transitions.sort((a, b) => priorityOrder[a.state] - priorityOrder[b.state]);
}

/**
 * Main Pure Function: Compare two raw test records and compute complete ComparisonReport
 */
export function buildComparisonReport({
  baseTest,
  targetTest,
}: {
  baseTest: {
    id: string;
    url: string;
    device: string;
    network?: string;
    createdAt: Date | string;
    performanceScore: number | null;
    fullReport: any;
  };
  targetTest: {
    id: string;
    url: string;
    device: string;
    network?: string;
    createdAt: Date | string;
    performanceScore: number | null;
    fullReport: any;
  };
}): ComparisonReport {
  const baseParsed = parseLighthouseReport(baseTest.fullReport);
  const targetParsed = parseLighthouseReport(targetTest.fullReport);

  const baseScore = baseTest.performanceScore ?? baseParsed.scores.performance ?? 0;
  const targetScore = targetTest.performanceScore ?? targetParsed.scores.performance ?? 0;

  // 1. Overall Score Delta
  const scoreDelta = computeMetricDelta({
    id: "performance_score",
    name: "Performance Score",
    baseValue: baseScore,
    targetValue: targetScore,
    baseDisplay: `${baseScore}/100`,
    targetDisplay: `${targetScore}/100`,
    polarity: "higher_is_better",
    unit: "pts",
    decimals: 0,
  });

  // 2. Core Web Vitals Deltas
  const metrics = {
    lcp: computeMetricDelta({
      id: "lcp",
      name: "Largest Contentful Paint (LCP)",
      baseValue: baseParsed.metrics.lcp.value ? baseParsed.metrics.lcp.value / 1000 : null,
      targetValue: targetParsed.metrics.lcp.value ? targetParsed.metrics.lcp.value / 1000 : null,
      baseDisplay: baseParsed.metrics.lcp.displayValue,
      targetDisplay: targetParsed.metrics.lcp.displayValue,
      polarity: "lower_is_better",
      unit: "s",
      decimals: 2,
    }),
    fcp: computeMetricDelta({
      id: "fcp",
      name: "First Contentful Paint (FCP)",
      baseValue: baseParsed.metrics.fcp.value ? baseParsed.metrics.fcp.value / 1000 : null,
      targetValue: targetParsed.metrics.fcp.value ? targetParsed.metrics.fcp.value / 1000 : null,
      baseDisplay: baseParsed.metrics.fcp.displayValue,
      targetDisplay: targetParsed.metrics.fcp.displayValue,
      polarity: "lower_is_better",
      unit: "s",
      decimals: 2,
    }),
    tbt: computeMetricDelta({
      id: "tbt",
      name: "Total Blocking Time (TBT)",
      baseValue: baseParsed.metrics.tbt.value,
      targetValue: targetParsed.metrics.tbt.value,
      baseDisplay: baseParsed.metrics.tbt.displayValue,
      targetDisplay: targetParsed.metrics.tbt.displayValue,
      polarity: "lower_is_better",
      unit: "ms",
      decimals: 0,
    }),
    cls: computeMetricDelta({
      id: "cls",
      name: "Cumulative Layout Shift (CLS)",
      baseValue: baseParsed.metrics.cls.value,
      targetValue: targetParsed.metrics.cls.value,
      baseDisplay: baseParsed.metrics.cls.displayValue,
      targetDisplay: targetParsed.metrics.cls.displayValue,
      polarity: "lower_is_better",
      unit: "",
      decimals: 3,
    }),
    speedIndex: computeMetricDelta({
      id: "speed_index",
      name: "Speed Index",
      baseValue: baseParsed.metrics.speedIndex.value ? baseParsed.metrics.speedIndex.value / 1000 : null,
      targetValue: targetParsed.metrics.speedIndex.value ? targetParsed.metrics.speedIndex.value / 1000 : null,
      baseDisplay: baseParsed.metrics.speedIndex.displayValue,
      targetDisplay: targetParsed.metrics.speedIndex.displayValue,
      polarity: "lower_is_better",
      unit: "s",
      decimals: 2,
    }),
    ttfb: computeMetricDelta({
      id: "ttfb",
      name: "Time to First Byte (TTFB)",
      baseValue: baseParsed.metrics.ttfb.value,
      targetValue: targetParsed.metrics.ttfb.value,
      baseDisplay: baseParsed.metrics.ttfb.displayValue,
      targetDisplay: targetParsed.metrics.ttfb.displayValue,
      polarity: "lower_is_better",
      unit: "ms",
      decimals: 0,
    }),
  };

  // 3. Category Score Deltas
  const categories = {
    performance: scoreDelta,
    accessibility: computeMetricDelta({
      id: "accessibility",
      name: "Accessibility",
      baseValue: baseParsed.scores.accessibility,
      targetValue: targetParsed.scores.accessibility,
      baseDisplay: `${baseParsed.scores.accessibility}/100`,
      targetDisplay: `${targetParsed.scores.accessibility}/100`,
      polarity: "higher_is_better",
      unit: "pts",
      decimals: 0,
    }),
    bestPractices: computeMetricDelta({
      id: "best_practices",
      name: "Best Practices",
      baseValue: baseParsed.scores.bestPractices,
      targetValue: targetParsed.scores.bestPractices,
      baseDisplay: `${baseParsed.scores.bestPractices}/100`,
      targetDisplay: `${targetParsed.scores.bestPractices}/100`,
      polarity: "higher_is_better",
      unit: "pts",
      decimals: 0,
    }),
    seo: computeMetricDelta({
      id: "seo",
      name: "SEO",
      baseValue: baseParsed.scores.seo,
      targetValue: targetParsed.scores.seo,
      baseDisplay: `${baseParsed.scores.seo}/100`,
      targetDisplay: `${targetParsed.scores.seo}/100`,
      polarity: "higher_is_better",
      unit: "pts",
      decimals: 0,
    }),
  };

  // 4. Overall Speed Verdict & Badge
  const scoreDiff = targetScore - baseScore;
  const lcpDiffSec = (metrics.lcp.delta ?? 0);

  let verdictTitle = "Performance Comparable";
  let verdictSubtitle = "Metrics showed no major deviation between builds.";
  let badge = "Neutral Delta";
  let verdictType: "positive" | "negative" | "neutral" = "neutral";
  let speedDeltaFormatted = "0.0s";

  if (scoreDiff >= 8 || lcpDiffSec <= -0.5) {
    verdictTitle = "Performance Optimization Confirmed";
    const speedGain = Math.abs(lcpDiffSec) > 0 ? `${Math.abs(lcpDiffSec).toFixed(1)}s faster LCP` : `+${scoreDiff} points lift`;
    verdictSubtitle = `Target build exhibits faster visual render times with ${speedGain}.`;
    badge = `⚡ Faster (+${scoreDiff} pts)`;
    verdictType = "positive";
    speedDeltaFormatted = `-${Math.abs(lcpDiffSec).toFixed(1)}s`;
  } else if (scoreDiff <= -8 || lcpDiffSec >= 0.5) {
    verdictTitle = "Performance Regression Detected";
    const slowdown = lcpDiffSec > 0 ? `${lcpDiffSec.toFixed(1)}s slower LCP` : `${scoreDiff} points drop`;
    verdictSubtitle = `Target build exhibits measurable slowdown with ${slowdown}. Review introduced assets and script payloads.`;
    badge = `🚨 Regression (${scoreDiff} pts)`;
    verdictType = "negative";
    speedDeltaFormatted = `+${Math.abs(lcpDiffSec).toFixed(1)}s`;
  }

  // 5. Filmstrip Alignment
  const filmstripFrames = quantizeAndSynchronizeFilmstrip(baseParsed.filmstrip, targetParsed.filmstrip);

  // 6. Network Resource Deltas
  const resourceDiffs = computeResourceDiffs(
    baseParsed.resourceSummary,
    targetParsed.resourceSummary,
    baseParsed.totalByteWeight,
    targetParsed.totalByteWeight
  );

  // 7. Opportunity Transitions
  const opportunityTransitions = computeOpportunityTransitions(baseParsed.opportunities, targetParsed.opportunities);

  return {
    base: {
      id: baseTest.id,
      url: baseTest.url,
      device: baseTest.device,
      network: baseTest.network || "No Throttling",
      createdAt: typeof baseTest.createdAt === "string" ? baseTest.createdAt : baseTest.createdAt.toISOString(),
      score: baseScore,
      parsed: baseParsed,
    },
    target: {
      id: targetTest.id,
      url: targetTest.url,
      device: targetTest.device,
      network: targetTest.network || "No Throttling",
      createdAt: typeof targetTest.createdAt === "string" ? targetTest.createdAt : targetTest.createdAt.toISOString(),
      score: targetScore,
      parsed: targetParsed,
    },
    scoreDelta,
    metrics,
    categories,
    overallVerdict: {
      title: verdictTitle,
      subtitle: verdictSubtitle,
      badge,
      type: verdictType,
      speedDeltaFormatted,
    },
    resourceDiffs,
    filmstripFrames,
    opportunityTransitions,
  };
}
