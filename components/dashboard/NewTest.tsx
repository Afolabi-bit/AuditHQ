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
import { normalizeAndValidateUrl } from "@/app/utils/validateUrl";
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

    const urlValidation = normalizeAndValidateUrl(url);
    setIsUrlValid({ validity: urlValidation.validity, message: urlValidation.message });

    if (!urlValidation.validity || !user) {
      return;
    }

    const normalizedTargetUrl = urlValidation.normalizedUrl;

    // Immediately update input field to show the corrected URL
    setUrl(normalizedTargetUrl);
    setIsTesting(true);

    const queuedToastId = toast.loading(`Queuing audit for ${normalizedTargetUrl}…`, {
      description: "Connecting to Google Lighthouse Cloud Engine",
    });

    try {
      const req = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.id,
          url: normalizedTargetUrl,
          device,
          network,
        }),
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

            // Synchronously update recent tests and stats cache
            await Promise.all([
              mutate(`/api/tests/recent?userId=${user.id}`),
              mutate("/api/dashboard/stats"),
            ]);

            toast.success("Audit complete!", {
              id: queuedToastId,
              description: `Performance score: ${statusData.performanceScore ?? "—"}/100 for ${url}`,
              action: {
                label: "View Full Report",
                onClick: () =>
                  (window.location.href = `/dashboard/test/${testId}`),
              },
            });
          } else if (statusData.status === "failed") {
            if (pollInterval) clearInterval(pollInterval);
            setIsTesting(false);

            await Promise.all([
              mutate(`/api/tests/recent?userId=${user.id}`),
              mutate("/api/dashboard/stats"),
            ]);

            toast.error("Audit failed", {
              id: queuedToastId,
              description:
                statusData.errorMessage ||
                "Lighthouse encountered an error analysing this page.",
            });
          }
        } catch (err) {
          console.error("Polling status error:", err);
        }
      }, 3000);

      setTimeout(() => {
        if (pollInterval) {
          clearInterval(pollInterval);
          setIsTesting(false);
          toast.error("Audit timed out", {
            id: queuedToastId,
            description: "The test took too long. Please try again.",
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
    <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 sm:p-7 shadow-sm hover:border-brand-200 transition-all mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#f0f2ff] text-[#635bff] border border-brand-200 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 fill-[#635bff]" />
            </div>
            <h2 className="text-base font-bold text-[#0a2540] font-sans">
              Run New Performance Audit
            </h2>
          </div>
          <p className="text-xs text-[#425466]">
            Execute headless Lighthouse evaluation with device & network throttling
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-[#00875a] bg-[#e3fcf7] border border-[#abf5d1]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00875a]" />
          Engine Ready
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          {/* URL Input */}
          <div className="md:col-span-6 space-y-1.5">
            <Label htmlFor="url" className="text-xs font-semibold text-[#425466] uppercase tracking-wider">
              Website URL
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8898aa]">
                <Globe className="h-4 w-4" />
              </div>
              <Input
                id="url"
                type="text"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={url}
                placeholder="example.com, www.example.com, or https://…"
                onChange={(e) => setUrl(e.target.value)}
                onClick={() => setIsUrlValid({ validity: true, message: "" })}
                className={`pl-9.5 h-11 text-sm bg-white border-[#e3e8ee] text-[#0a2540] placeholder:text-[#8898aa] focus:bg-white focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/20 rounded-lg transition-all font-mono ${
                  !isUrlValid.validity ? "border-[#de350b] focus:border-[#de350b] focus:ring-[#de350b]/20" : ""
                }`}
              />
            </div>
            {!isUrlValid.validity && (
              <p className="text-xs text-[#de350b] font-medium">{isUrlValid.message}</p>
            )}
          </div>

          {/* Device Selection */}
          <div className="md:col-span-3 space-y-1.5">
            <Label className="text-xs font-semibold text-[#425466] uppercase tracking-wider">
              Device Profile
            </Label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#f8fafc] rounded-lg border border-[#e3e8ee] h-11 items-center">
              <button
                type="button"
                onClick={() => setDevice("Desktop")}
                className={`h-8.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  device === "Desktop"
                    ? "bg-white text-[#635bff] shadow-[0_1px_2px_rgba(50,50,93,0.08)] border border-[#e3e8ee]"
                    : "text-[#425466] hover:text-[#0a2540]"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice("Mobile")}
                className={`h-8.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  device === "Mobile"
                    ? "bg-white text-[#635bff] shadow-[0_1px_2px_rgba(50,50,93,0.08)] border border-[#e3e8ee]"
                    : "text-[#425466] hover:text-[#0a2540]"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Mobile
              </button>
            </div>
          </div>

          {/* Network Throttling */}
          <div className="md:col-span-3 space-y-1.5">
            <Label className="text-xs font-semibold text-[#425466] uppercase tracking-wider">
              Network
            </Label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#f8fafc] rounded-lg border border-[#e3e8ee] h-11 items-center">
              {["No Throttling", "4G", "3G"].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setNetwork(net)}
                  className={`h-8.5 rounded-md text-[11px] font-semibold flex items-center justify-center transition-all truncate px-1 cursor-pointer ${
                    network === net
                      ? "bg-white text-[#635bff] shadow-[0_1px_2px_rgba(50,50,93,0.08)] border border-[#e3e8ee]"
                      : "text-[#425466] hover:text-[#0a2540]"
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
            className="w-full sm:w-auto h-11 px-7 rounded-lg font-semibold text-sm bg-[#635bff] hover:bg-brand-700 active:bg-[#4b45d0] text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
