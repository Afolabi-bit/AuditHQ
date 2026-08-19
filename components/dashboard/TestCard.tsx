import Link from "next/link";
import {
  Badge,
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
import { getScoreBgColor, getScoreColor } from "@/data";

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
    <Card
      className={`hover:shadow-md transition-all ${
        isCompleted ? "hover:border-blue-300 cursor-pointer group" : ""
      } ${
        isPending
          ? "bg-slate-50/80 border-slate-200"
          : isFailed
          ? "bg-rose-50/30 border-rose-200"
          : ""
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors break-all">
                {url}
              </h3>
              {isCompleted && (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
              {isPending && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Running Audit...
                </Badge>
              )}
              {isFailed && (
                <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50">
                  <XCircle className="h-3 w-3 mr-1" />
                  Audit Failed
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4 text-xs text-slate-500 mb-3">
              <span className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                {date}
              </span>
              <span className="flex items-center capitalize">
                {device?.toLowerCase() === "mobile" ? (
                  <Smartphone className="h-3.5 w-3.5 mr-1 text-slate-400" />
                ) : (
                  <Monitor className="h-3.5 w-3.5 mr-1 text-slate-400" />
                )}
                {device || "Desktop"}
              </span>
            </div>

            {isFailed && errorMessage && (
              <div className="flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-md border border-rose-200 mt-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isCompleted && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div>
                  <p className="text-xs text-slate-400 font-medium">FCP</p>
                  <p className="text-sm font-bold text-slate-700">
                    {fcp != null ? `${fcp}s` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">LCP</p>
                  <p className="text-sm font-bold text-slate-700">
                    {lcp != null ? `${lcp}s` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">TBT</p>
                  <p className="text-sm font-bold text-slate-700">
                    {tti != null ? `${tti}s` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">CLS</p>
                  <p className="text-sm font-bold text-slate-700">
                    {cls != null ? cls : "—"}
                  </p>
                </div>
                <div className="flex items-end">
                  <span className="inline-flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    View Report <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {isCompleted && (
            <div className="ml-4 shrink-0 text-center">
              <div
                className={`text-4xl sm:text-5xl font-extrabold ${getScoreColor(score)}`}
              >
                {typeof score === "number" ? score : "—"}
              </div>
              <div
                className={`text-xs font-semibold mt-1 px-2.5 py-0.5 rounded-full ${getScoreBgColor(
                  score
                )} ${getScoreColor(score)}`}
              >
                {typeof score === "number"
                  ? score >= 90
                    ? "Good"
                    : score >= 50
                    ? "Needs Work"
                    : "Poor"
                  : "Unknown"}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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
