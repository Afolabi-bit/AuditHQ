import Link from "next/link";
import {
  Clock,
  Monitor,
  Smartphone,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface TestCardProps {
  id: string | number;
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
  if (score == null) return "bg-surface-2 text-text-tertiary border-border";
  if (score >= 90) return "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/15 dark:text-[#4de7b4] dark:border-[#00875a]/30";
  if (score >= 50) return "bg-[#fff8e5] text-[#b76e00] border-[#ffe380] dark:bg-[#b76e00]/15 dark:text-[#ffc400] dark:border-[#b76e00]/30";
  return "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/15 dark:text-[#ff7452] dark:border-[#de350b]/30";
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
}: TestCardProps) => {
  const isCompleted = status === "completed";
  const isPending = status === "pending";
  const isFailed = status === "failed";

  const cardContent = (
    <div
      className={`rounded-xl bg-surface-0 border p-5 shadow-xs transition-all ${
        isCompleted
          ? "border-border hover:border-brand-200 hover:shadow-md cursor-pointer group"
          : isPending
          ? "border-brand-200 bg-surface-1"
          : "border-destructive/30 bg-destructive/5"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* URL & Status Header */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="text-base font-bold text-text-primary group-hover:text-brand-500 transition-colors truncate max-w-md font-mono">
              {url}
            </h3>
            {isPending && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-500 border border-brand-200">
                <Loader2 className="h-3 w-3 animate-spin" />
                Auditing…
              </span>
            )}
            {isFailed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                <XCircle className="h-3 w-3" />
                Audit Failed
              </span>
            )}
          </div>

          {/* Metadata Row */}
          <div className="flex items-center space-x-3 text-xs text-text-tertiary mb-3 font-mono">
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
            <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 mt-2 font-mono">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pending State */}
          {isPending && (
            <div className="flex items-center gap-2 text-xs font-mono text-brand-500 bg-brand-50 p-2.5 rounded-lg border border-brand-200">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
              <span>Lighthouse engine executing render pass and network trace…</span>
            </div>
          )}

          {/* Completed Metrics Grid */}
          {isCompleted && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 font-mono">
              <div className="p-2 rounded-lg bg-surface-1 border border-border">
                <p className="text-[10px] text-text-tertiary uppercase">FCP</p>
                <p className="text-xs font-bold text-text-primary">
                  {fcp != null ? `${Number(fcp).toFixed(1)}s` : "—"}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-surface-1 border border-border">
                <p className="text-[10px] text-text-tertiary uppercase">LCP</p>
                <p className="text-xs font-bold text-text-primary">
                  {lcp != null ? `${Number(lcp).toFixed(1)}s` : "—"}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-surface-1 border border-border">
                <p className="text-[10px] text-text-tertiary uppercase">TBT</p>
                <p className="text-xs font-bold text-text-primary">
                  {tti != null ? `${Number(tti).toFixed(1)}s` : "—"}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-surface-1 border border-border">
                <p className="text-[10px] text-text-tertiary uppercase">CLS</p>
                <p className="text-xs font-bold text-text-primary">
                  {cls != null ? Number(cls).toFixed(2) : "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Score Badge Box */}
        {isCompleted && (
          <div className="shrink-0 flex flex-col items-center justify-center p-3 rounded-xl bg-surface-1 border border-border min-w-19 text-center">
            <span className={`text-3xl font-mono font-bold tracking-tight ${getScoreTextColor(score)}`}>
              {typeof score === "number" ? score : "—"}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 border ${getScoreBadgeClass(score)}`}>
              {getScoreLabel(score)}
            </span>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {isCompleted && (
        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-text-tertiary font-mono">
          <span>Audit #{id}</span>
          <span className="font-semibold text-brand-500 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-sans">
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
