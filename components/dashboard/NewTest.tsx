"use client";

import { FormEvent, useState } from "react";
import {
  Loader2,
  Zap,
  Globe,
  Monitor,
  Smartphone,
  Wifi,
  Play,
} from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import isValidUrl from "@/app/utils/validateUrl";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { mutate } from "swr";
import { toast } from "sonner";

const NewTest = ({ user }: { user: KindeUser }) => {
  const [url, setUrl] = useState("");
  const [device, setDevice] = useState("Desktop");
  const [network, setNetwork] = useState("No Throttling");
  const [isUrlValid, setIsUrlValid] = useState({ validity: true, message: "" });
  const [isTesting, setIsTesting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const urlvalidation = isValidUrl(url);
    setIsUrlValid(urlvalidation);

    if (urlvalidation.validity === false || !user) {
      return;
    }

    setIsTesting(true);

    const queuedToastId = toast.loading(`Queuing audit for ${url}…`, {
      description: "Connecting to Google Lighthouse Cloud Engine",
    });

    try {
      const req = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.id, url, device, network }),
      });

      const res = await req.json();

      if (!req.ok || !res?.data?.testId) {
        toast.dismiss(queuedToastId);
        toast.error("Failed to queue audit", {
          description:
            res?.message ||
            "Could not start the audit. Please check the URL and try again.",
        });
        setIsTesting(false);
        setIsUrlValid({
          validity: false,
          message:
            res?.message ||
            "Failed to start performance audit. Please check the URL or try again.",
        });
        return;
      }

      const testId = res.data.testId;

      toast.loading("Audit running…", {
        id: queuedToastId,
        description: `Lighthouse is analysing ${url}`,
      });

      mutate(`/api/tests/recent?userId=${user.id}`);
      mutate("/api/dashboard/stats");

      let pollInterval: NodeJS.Timeout | null = null;

      pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/test/${testId}/status`);
          const statusData = await statusResponse.json();

          if (statusData.status === "completed") {
            if (pollInterval) clearInterval(pollInterval);
            setIsTesting(false);
            setUrl("");

            mutate(`/api/tests/recent?userId=${user.id}`);
            mutate("/api/dashboard/stats");

            toast.success("Audit complete!", {
              id: queuedToastId,
              description: `Performance score: ${statusData.performanceScore ?? "—"}/100 for ${url}`,
              action: {
                label: "View Full Report",
                onClick: () =>
                  window.open(`/dashboard/test/${testId}`, "_blank"),
              },
              duration: 8000,
            });
          } else if (statusData.status === "failed") {
            if (pollInterval) clearInterval(pollInterval);
            setIsTesting(false);

            mutate(`/api/tests/recent?userId=${user.id}`);
            mutate("/api/dashboard/stats");

            toast.error("Audit failed", {
              id: queuedToastId,
              description:
                statusData.errorMessage ||
                "The audit could not be completed. Please check the URL and try again.",
              duration: 8000,
            });
          }
        } catch (error) {
          console.error("Error polling test status:", error);
          if (pollInterval) clearInterval(pollInterval);
          setIsTesting(false);
          toast.dismiss(queuedToastId);
          toast.error("Lost connection to audit", {
            description: "Unable to retrieve audit status. Please refresh.",
          });
        }
      }, 2000);

      setTimeout(() => {
        if (pollInterval) {
          clearInterval(pollInterval);
          setIsTesting(false);
          toast.dismiss(queuedToastId);
          toast.warning("Audit timed out", {
            description:
              "The audit took too long to respond. It may still complete in the background.",
            duration: 8000,
          });
        }
      }, 300000);
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.dismiss(queuedToastId);
      toast.error("Network error", {
        description: "Could not connect to the server. Please try again.",
      });
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-surface-0 border border-surface-3 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-brand-200 transition-all mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 fill-brand-600" />
            </div>
            <h2 className="text-base font-bold text-text-primary font-sans">
              Run New Performance Audit
            </h2>
          </div>
          <p className="text-xs text-text-secondary">
            Execute headless Lighthouse evaluation with device & network throttling
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-text-tertiary bg-surface-1 border border-surface-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Engine Ready
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          {/* URL Input */}
          <div className="md:col-span-6 space-y-1.5">
            <Label htmlFor="url" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Website URL
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                <Globe className="h-4 w-4" />
              </div>
              <Input
                id="url"
                type="url"
                value={url}
                placeholder="https://example.com"
                onChange={(e) => setUrl(e.target.value)}
                onClick={() => setIsUrlValid({ validity: true, message: "" })}
                className={`pl-9.5 h-11 text-sm bg-surface-1/60 border-surface-3 focus:bg-surface-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl transition-all font-mono ${
                  !isUrlValid.validity ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""
                }`}
              />
            </div>
            {!isUrlValid.validity && (
              <p className="text-xs text-rose-600 font-medium">{isUrlValid.message}</p>
            )}
          </div>

          {/* Device Selection */}
          <div className="md:col-span-3 space-y-1.5">
            <Label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Device Profile
            </Label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-1 rounded-xl border border-surface-3 h-11 items-center">
              <button
                type="button"
                onClick={() => setDevice("Desktop")}
                className={`h-8.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  device === "Desktop"
                    ? "bg-surface-0 text-brand-600 shadow-xs border border-surface-3"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice("Mobile")}
                className={`h-8.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  device === "Mobile"
                    ? "bg-surface-0 text-brand-600 shadow-xs border border-surface-3"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Mobile
              </button>
            </div>
          </div>

          {/* Network Throttling */}
          <div className="md:col-span-3 space-y-1.5">
            <Label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Network
            </Label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-surface-1 rounded-xl border border-surface-3 h-11 items-center">
              {["No Throttling", "4G", "3G"].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setNetwork(net)}
                  className={`h-8.5 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-all truncate px-1 ${
                    network === net
                      ? "bg-surface-0 text-brand-600 shadow-xs border border-surface-3"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  title={net}
                >
                  {net === "No Throttling" ? "Direct" : net}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={isTesting}
            className="w-full sm:w-auto h-11 px-7 rounded-xl font-semibold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-brand transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-white" />
                Executing Audit Engine…
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2 fill-white" />
                Start Performance Audit
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTest;
