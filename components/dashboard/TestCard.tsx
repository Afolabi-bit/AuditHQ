import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Monitor,
  Smartphone,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface TestCardProps {
  id: number;
  url: string;
  status: string;
  date: string;
  device: string;
  errorMessage?: string | null;
  score: number | null;
  fcp: number | null;
  lcp: number | null;
  tti: number | null;
  cls: number | null;
  speedIndex: number | null;
}

function getScoreTextColor(score: number | null): string {
  if (score == null) return "text-text-tertiary";
  if (score >= 90) return "text-score-good";
  if (score >= 50) return "text-score-warn";
  return "text-score-poor";
}

function getScoreBadgeClass(score: number | null): string {
  if (score == null) return "bg-surface-2 text-text-tertiary";
  if (score >= 90) return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (score >= 50) return "bg-amber-50 text-amber-700 border border-amber-200";
  return "bg-rose-50 text-rose-700 border border-rose-200";
}

function getScoreLabel(score: number | null): string {
  if (score == null) return "Evaluating";
  if (score >= 90) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

const TestCard = ({
  id,
  url,
  status,
  date,
  device,
  errorMessage,
  score,
  fcp,
  lcp,
  tti,
  cls,
  speedIndex,
}: TestCardProps) => {
  const isCompleted = status === "completed";
  const isPending = status === "pending";
  const isFailed = status === "failed";

  const cardContent = (
    <div
      className={`rounded-2xl bg-surface-0 border border-surface-3 p-5 shadow-xs transition-all ${
        isCompleted
          ? "hover:border-brand-200 hover:shadow-sm cursor-pointer group"
          : isPending
          ? "bg-surface-1/60"
          : "bg-rose-50/20"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* URL & Status Header */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="text-base font-bold text-text-primary group-hover:text-brand-600 transition-colors truncate max-w-md font-mono">
              {url}
            </h3>
            {isPending && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 border border-brand-200">
                <Loader2 className="h-3 w-3 animate-spin" />
                Auditing…
              </span>
            )}
            {isFailed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <XCircle className="h-3 w-3" />
                Audit Failed
              </span>
            )}
          </div>

          {/* Metadata Row */}
          <div className="flex items-center space-x-3 text-xs text-text-secondary mb-3 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-text-tertiary" />
              {date}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 capitalize">
              {device?.toLowerCase() === "mobile" ? (
                <Smartphone className="h-3 w-3 text-text-tertiary" />
              ) : (
                <Monitor className="h-3 w-3 text-text-tertiary" />
              )}
              {device || "Desktop"}
            </span>
          </div>

          {/* Failure Error Display */}
          {isFailed && errorMessage && (
            <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 mt-2 font-mono">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pending Skeleton / Pulse */}
          {isPending && (
            <div className="flex items-center gap-2 text-xs font-mono text-text-secondary bg-surface-1 p-2.5 rounded-xl border border-surface-3">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
              <span>Lighthouse engine executing render pass and network trace…</span>
            </div>
          )}

          {/* Completed Metrics Grid */}
          {isCompleted && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2 rounded-lg bg-surface-1 border border-surface-3">
                <p className="text-[10px] text-text-tertiary uppercase font-mono">FCP</p>
                <p className="text-xs font-mono font-bold text-text-primary">
                  {fcp != null ? `${fcp}s` : "—"}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-surface-1 border border-surface-3">
                <p className="text-[10px] text-text-tertiary uppercase font-mono">LCP</p>
                <p className="text-xs font-mono font-bold text-text-primary">
                  {lcp != null ? `${lcp}s` : "—"}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-surface-1 border border-surface-3">
                <p className="text-[10px] text-text-tertiary uppercase font-mono">TBT</p>
                <p className="text-xs font-mono font-bold text-text-primary">
                  {tti != null ? `${tti}s` : "—"}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-surface-1 border border-surface-3">
                <p className="text-[10px] text-text-tertiary uppercase font-mono">CLS</p>
                <p className="text-xs font-mono font-bold text-text-primary">
                  {cls != null ? cls : "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Score Badge Pill */}
        {isCompleted && (
          <div className="shrink-0 flex flex-col items-center justify-center p-3 rounded-xl bg-surface-1 border border-surface-3 min-w-[76px] text-center">
            <span className={`text-3xl font-mono font-extrabold tracking-tight ${getScoreTextColor(score)}`}>
              {typeof score === "number" ? score : "—"}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${getScoreBadgeClass(score)}`}>
              {getScoreLabel(score)}
            </span>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {isCompleted && (
        <div className="mt-3 pt-2.5 border-t border-surface-2 flex items-center justify-between text-xs text-text-tertiary font-mono">
          <span>Audit #{id}</span>
          <span className="font-semibold text-brand-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-sans">
            View Full Report <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      )}
    </div>
  );

  if (isCompleted) {
    return (
      <Link href={`/dashboard/test/${id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default TestCard;
