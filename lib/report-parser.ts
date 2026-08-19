/**
 * Parses and extracts structured, strongly-typed data from raw Google PageSpeed / Lighthouse LHR JSON reports.
 */

export interface ParsedLighthouseReport {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    fcp: { value: number | null; displayValue: string; score: number | null; rating: "good" | "needs-improvement" | "poor" };
    lcp: { value: number | null; displayValue: string; score: number | null; rating: "good" | "needs-improvement" | "poor" };
    tbt: { value: number | null; displayValue: string; score: number | null; rating: "good" | "needs-improvement" | "poor" };
    cls: { value: number | null; displayValue: string; score: number | null; rating: "good" | "needs-improvement" | "poor" };
    speedIndex: { value: number | null; displayValue: string; score: number | null; rating: "good" | "needs-improvement" | "poor" };
    ttfb: { value: number | null; displayValue: string; score: number | null; rating: "good" | "needs-improvement" | "poor" };
  };
  filmstrip: Array<{
    timing: number;
    timestamp: number;
    data: string;
  }>;
  fullPageScreenshot: string | null;
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
    displayValue?: string;
    overallSavingsMs?: number;
    overallSavingsBytes?: number;
    items?: Array<{
      url?: string;
      label?: string;
      totalBytes?: number;
      wastedBytes?: number;
      wastedMs?: number;
      node?: any;
    }>;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    displayValue?: string;
    details?: any;
  }>;
  resourceSummary: Array<{
    resourceType: string;
    label: string;
    requestCount: number;
    transferSize: number;
  }>;
  totalByteWeight: number;
  thirdParties: Array<{
    entity: string;
    transferSize: number;
    blockingTime: number;
    subItems?: Array<{ url: string; transferSize: number; blockingTime: number }>;
  }>;
  accessibilityIssues: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
    items?: Array<any>;
  }>;
  seoIssues: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
    displayValue?: string;
  }>;
  securityChecks: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
    displayValue?: string;
  }>;
}

function getMetricRating(
  metricKey: "fcp" | "lcp" | "tbt" | "cls" | "speedIndex" | "ttfb",
  val: number | null
): "good" | "needs-improvement" | "poor" {
  if (val == null) return "needs-improvement";
  switch (metricKey) {
    case "fcp":
      return val <= 1800 ? "good" : val <= 3000 ? "needs-improvement" : "poor";
    case "lcp":
      return val <= 2500 ? "good" : val <= 4000 ? "needs-improvement" : "poor";
    case "tbt":
      return val <= 200 ? "good" : val <= 600 ? "needs-improvement" : "poor";
    case "cls":
      return val <= 0.1 ? "good" : val <= 0.25 ? "needs-improvement" : "poor";
    case "speedIndex":
      return val <= 3400 ? "good" : val <= 5800 ? "needs-improvement" : "poor";
    case "ttfb":
      return val <= 800 ? "good" : val <= 1800 ? "needs-improvement" : "poor";
    default:
      return "good";
  }
}

export function parseLighthouseReport(lhr: any): ParsedLighthouseReport {
  if (!lhr || typeof lhr !== "object") {
    return createEmptyReport();
  }

  const categories = lhr.categories || {};
  const audits = lhr.audits || {};

  // 1. Scores
  const scores = {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
  };

  // 2. Metrics
  const fcpVal = audits["first-contentful-paint"]?.numericValue ?? null;
  const lcpVal = audits["largest-contentful-paint"]?.numericValue ?? null;
  const tbtVal = audits["total-blocking-time"]?.numericValue ?? null;
  const clsVal = audits["cumulative-layout-shift"]?.numericValue ?? null;
  const siVal = audits["speed-index"]?.numericValue ?? null;
  const ttfbVal = audits["server-response-time"]?.numericValue ?? null;

  const metrics = {
    fcp: {
      value: fcpVal,
      displayValue: audits["first-contentful-paint"]?.displayValue || (fcpVal ? `${(fcpVal / 1000).toFixed(2)} s` : "—"),
      score: audits["first-contentful-paint"]?.score ?? null,
      rating: getMetricRating("fcp", fcpVal),
    },
    lcp: {
      value: lcpVal,
      displayValue: audits["largest-contentful-paint"]?.displayValue || (lcpVal ? `${(lcpVal / 1000).toFixed(2)} s` : "—"),
      score: audits["largest-contentful-paint"]?.score ?? null,
      rating: getMetricRating("lcp", lcpVal),
    },
    tbt: {
      value: tbtVal,
      displayValue: audits["total-blocking-time"]?.displayValue || (tbtVal ? `${Math.round(tbtVal)} ms` : "—"),
      score: audits["total-blocking-time"]?.score ?? null,
      rating: getMetricRating("tbt", tbtVal),
    },
    cls: {
      value: clsVal,
      displayValue: audits["cumulative-layout-shift"]?.displayValue || (clsVal != null ? clsVal.toFixed(3) : "—"),
      score: audits["cumulative-layout-shift"]?.score ?? null,
      rating: getMetricRating("cls", clsVal),
    },
    speedIndex: {
      value: siVal,
      displayValue: audits["speed-index"]?.displayValue || (siVal ? `${(siVal / 1000).toFixed(2)} s` : "—"),
      score: audits["speed-index"]?.score ?? null,
      rating: getMetricRating("speedIndex", siVal),
    },
    ttfb: {
      value: ttfbVal,
      displayValue:
        ttfbVal != null
          ? `${Math.round(ttfbVal)} ms`
          : audits["server-response-time"]?.displayValue?.replace(/^Root document took /i, "") || "—",
      score: audits["server-response-time"]?.score ?? null,
      rating: getMetricRating("ttfb", ttfbVal),
    },
  };

  // 3. Filmstrip Thumbnails
  const filmstripAudits = audits["screenshot-thumbnails"]?.details?.items || [];
  const filmstrip = filmstripAudits.map((item: any) => ({
    timing: item.timing,
    timestamp: item.timestamp,
    data: item.data,
  }));

  // 4. Full Page Screenshot
  const fullPageScreenshot = lhr.fullPageScreenshot?.screenshot?.data || audits["final-screenshot"]?.details?.data || null;

  // 5. Opportunities (High Impact performance improvements)
  const opportunityAuditKeys = [
    "render-blocking-insight",
    "render-blocking-resources",
    "image-delivery-insight",
    "modern-image-formats",
    "uses-optimized-images",
    "responsive-images",
    "unused-javascript",
    "unused-css-rules",
    "unminified-css",
    "unminified-javascript",
    "cache-insight",
    "uses-long-cache-ttl",
    "duplicated-javascript-insight",
    "legacy-javascript-insight",
    "redirects",
    "total-byte-weight",
    "font-display-insight",
    "dom-size-insight",
    "dom-size",
  ];

  const opportunities: ParsedLighthouseReport["opportunities"] = [];
  const diagnostics: ParsedLighthouseReport["diagnostics"] = [];

  for (const [key, audit] of Object.entries<any>(audits)) {
    if (!audit || typeof audit !== "object") continue;

    const isFailedOrWarning = audit.score != null && audit.score < 0.9;
    const isOpportunityKey = opportunityAuditKeys.includes(key);

    if (isOpportunityKey && (isFailedOrWarning || audit.details?.overallSavingsMs || audit.details?.overallSavingsBytes)) {
      opportunities.push({
        id: key,
        title: audit.title || key,
        description: audit.description || "",
        score: audit.score,
        displayValue: audit.displayValue,
        overallSavingsMs: audit.details?.overallSavingsMs || audit.metricSavings?.LCP || audit.metricSavings?.FCP,
        overallSavingsBytes: audit.details?.overallSavingsBytes,
        items: audit.details?.items?.slice(0, 10),
      });
    } else if (isFailedOrWarning && audit.details?.type === "table") {
      diagnostics.push({
        id: key,
        title: audit.title || key,
        description: audit.description || "",
        displayValue: audit.displayValue,
        details: audit.details,
      });
    }
  }

  // 6. Resource Summary
  const rawResourceItems = audits["resource-summary"]?.details?.items || [];
  const resourceSummary = rawResourceItems
    .filter((item: any) => item.resourceType !== "total")
    .map((item: any) => ({
      resourceType: item.resourceType,
      label: item.label || formatResourceType(item.resourceType),
      requestCount: item.requestCount || 0,
      transferSize: item.transferSize || 0,
    }));

  const totalByteWeight = audits["total-byte-weight"]?.numericValue || 
    rawResourceItems.find((i: any) => i.resourceType === "total")?.transferSize || 0;

  // 7. Third-Party Code Impact
  const thirdPartyItems = audits["third-parties-insight"]?.details?.items || audits["third-party-summary"]?.details?.items || [];
  const thirdParties = thirdPartyItems.map((item: any) => ({
    entity: item.entity?.text || item.entity || "Third-party script",
    transferSize: item.transferSize || 0,
    blockingTime: item.blockingTime || 0,
    subItems: item.subItems?.items?.map((sub: any) => ({
      url: sub.url,
      transferSize: sub.transferSize || 0,
      blockingTime: sub.blockingTime || 0,
    })),
  }));

  // 8. Accessibility Issues
  const accessibilityRefs = categories.accessibility?.auditRefs || [];
  const accessibilityIssues = accessibilityRefs
    .map((ref: any) => audits[ref.id])
    .filter((audit: any) => audit && audit.score != null && audit.score < 1)
    .map((audit: any) => ({
      id: audit.id,
      title: audit.title,
      description: audit.description,
      score: audit.score,
      items: audit.details?.items?.slice(0, 5),
    }));

  // 9. SEO Issues
  const seoRefs = categories.seo?.auditRefs || [];
  const seoIssues = seoRefs
    .map((ref: any) => audits[ref.id])
    .filter((audit: any) => audit && audit.score != null && audit.score < 1)
    .map((audit: any) => ({
      id: audit.id,
      title: audit.title,
      description: audit.description,
      score: audit.score,
      displayValue: audit.displayValue,
    }));

  // 10. Security Checks
  const securityAuditKeys = [
    "is-on-https",
    "csp-xss",
    "has-hsts",
    "clickjacking-mitigation",
    "trusted-types-xss",
    "origin-isolation",
    "errors-in-console",
    "deprecations",
    "third-party-cookies",
  ];

  const securityChecks = securityAuditKeys
    .map((key) => audits[key])
    .filter(Boolean)
    .map((audit: any) => ({
      id: audit.id,
      title: audit.title,
      description: audit.description,
      score: audit.score,
      displayValue: audit.displayValue,
    }));

  return {
    scores,
    metrics,
    filmstrip,
    fullPageScreenshot,
    opportunities,
    diagnostics,
    resourceSummary,
    totalByteWeight,
    thirdParties,
    accessibilityIssues,
    seoIssues,
    securityChecks,
  };
}

function formatResourceType(type: string): string {
  switch (type) {
    case "document": return "HTML / Document";
    case "script": return "JavaScript";
    case "stylesheet": return "CSS Stylesheets";
    case "image": return "Images";
    case "font": return "Web Fonts";
    case "media": return "Media / Video";
    case "other": return "Other";
    default: return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

function createEmptyReport(): ParsedLighthouseReport {
  return {
    scores: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 },
    metrics: {
      fcp: { value: null, displayValue: "—", score: null, rating: "needs-improvement" },
      lcp: { value: null, displayValue: "—", score: null, rating: "needs-improvement" },
      tbt: { value: null, displayValue: "—", score: null, rating: "needs-improvement" },
      cls: { value: null, displayValue: "—", score: null, rating: "needs-improvement" },
      speedIndex: { value: null, displayValue: "—", score: null, rating: "needs-improvement" },
      ttfb: { value: null, displayValue: "—", score: null, rating: "needs-improvement" },
    },
    filmstrip: [],
    fullPageScreenshot: null,
    opportunities: [],
    diagnostics: [],
    resourceSummary: [],
    totalByteWeight: 0,
    thirdParties: [],
    accessibilityIssues: [],
    seoIssues: [],
    securityChecks: [],
  };
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatMilliseconds(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}
