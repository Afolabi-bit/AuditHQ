import { ParsedLighthouseReport } from "@/lib/report-parser";

export type MetricPolarity = "higher_is_better" | "lower_is_better";

export type DeltaStatus = "improved" | "regressed" | "neutral" | "unchanged";

export interface MetricDelta {
  id: string;
  name: string;
  baseValue: number | null;
  targetValue: number | null;
  baseDisplay: string;
  targetDisplay: string;
  delta: number | null;
  deltaDisplay: string;
  percentChange: number | null;
  status: DeltaStatus;
  polarity: MetricPolarity;
  unit: string;
}

export interface ResourceTypeDiff {
  resourceType: "script" | "stylesheet" | "image" | "font" | "document" | "other" | "total";
  label: string;
  baseBytes: number;
  targetBytes: number;
  deltaBytes: number;
  percentChange: number;
  baseFormatted: string;
  targetFormatted: string;
  deltaFormatted: string;
  status: DeltaStatus;
}

export type OpportunityState = "resolved" | "worsened" | "improved" | "new_issue" | "unchanged";

export interface OpportunityTransition {
  id: string;
  title: string;
  description: string;
  baseSavingsMs: number;
  targetSavingsMs: number;
  deltaSavingsMs: number;
  baseSavingsBytes: number;
  targetSavingsBytes: number;
  deltaSavingsBytes: number;
  state: OpportunityState;
}

export interface SynchronizedFrame {
  timestampMs: number;
  baseFrame: string | null;
  targetFrame: string | null;
  isBasePainted: boolean;
  isTargetPainted: boolean;
}

export interface ComparisonReport {
  base: {
    id: string;
    url: string;
    device: string;
    network: string;
    createdAt: string;
    score: number;
    parsed: ParsedLighthouseReport;
  };
  target: {
    id: string;
    url: string;
    device: string;
    network: string;
    createdAt: string;
    score: number;
    parsed: ParsedLighthouseReport;
  };
  scoreDelta: MetricDelta;
  metrics: {
    lcp: MetricDelta;
    fcp: MetricDelta;
    tbt: MetricDelta;
    cls: MetricDelta;
    speedIndex: MetricDelta;
    ttfb: MetricDelta;
  };
  categories: {
    performance: MetricDelta;
    accessibility: MetricDelta;
    bestPractices: MetricDelta;
    seo: MetricDelta;
  };
  overallVerdict: {
    title: string;
    subtitle: string;
    badge: string;
    type: "positive" | "negative" | "neutral";
    speedDeltaFormatted: string;
  };
  resourceDiffs: ResourceTypeDiff[];
  filmstripFrames: SynchronizedFrame[];
  opportunityTransitions: OpportunityTransition[];
}
