"use client";

import React, { useState, FormEvent } from "react";
import {
  Globe,
  Monitor,
  Smartphone,
  Zap,
  Loader2,
  ArrowRight,
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

    const queuedToastId = toast.loading(`Auditing ${normalizedTargetUrl}…`, {
      description: "Executing Google Lighthouse 12.0 cloud evaluation",
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

      if (!req.ok || !res?.data?.testId || res?.data?.status === "failed") {
        toast.error("Audit failed", {
          id: queuedToastId,
          description:
            res?.message ||
            "Lighthouse could not complete this audit. Please check the URL and try again.",
        });
        setIsTesting(false);
        return;
      }

      const testId = res.data.testId;
      const score = res.data.performanceScore;

      // Force synchronous cache revalidation
      await Promise.all([
        mutate(`/api/tests/recent?userId=${user.id}`),
        mutate("/api/dashboard/stats"),
      ]);

      setIsTesting(false);
      setUrl("");

      toast.success("Audit complete!", {
        id: queuedToastId,
        description: `Performance score: ${score ?? "—"}/100 for ${normalizedTargetUrl}`,
        action: {
          label: "View Full Report",
          onClick: () =>
            (window.location.href = `/dashboard/test/${testId}`),
        },
      });
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("Connection error", {
        id: queuedToastId,
        description: "Could not connect to the audit engine. Please try again.",
      });
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-surface-0 border border-border rounded-xl p-6 sm:p-7 shadow-sm hover:border-brand-200 transition-all mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-brand-50 text-brand-500 border border-brand-200 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 fill-brand-500" />
            </div>
            <h2 className="text-base font-bold text-text-primary font-sans">
              Run New Performance Audit
            </h2>
          </div>
          <p className="text-xs text-text-secondary">
            Execute headless Lighthouse evaluation with device & network throttling
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-score-good bg-[#e3fcf7] border border-[#abf5d1] dark:bg-[#00875a]/15 dark:text-[#4de7b4] dark:border-[#00875a]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-score-good" />
          Engine Ready
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                type="text"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={url}
                placeholder="example.com, www.example.com, or https://…"
                onChange={(e) => setUrl(e.target.value)}
                onClick={() => setIsUrlValid({ validity: true, message: "" })}
                className={`pl-9.5 h-11 text-sm bg-surface-0 border-border text-text-primary placeholder:text-text-tertiary focus:bg-surface-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg transition-all font-mono ${
                  !isUrlValid.validity ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""
                }`}
              />
            </div>
            {!isUrlValid.validity && (
              <p className="text-xs text-destructive font-medium">{isUrlValid.message}</p>
            )}
          </div>

          {/* Device Selection */}
          <div className="md:col-span-3 space-y-1.5">
            <Label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Device Profile
            </Label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-1 rounded-lg border border-border h-11 items-center">
              <button
                type="button"
                onClick={() => setDevice("Desktop")}
                className={`h-8.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  device === "Desktop"
                    ? "bg-surface-0 text-brand-500 shadow-xs border border-border"
                    : "text-text-secondary hover:text-text-primary"
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
                    ? "bg-surface-0 text-brand-500 shadow-xs border border-border"
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
            <div className="grid grid-cols-3 gap-1 p-1 bg-surface-1 rounded-lg border border-border h-11 items-center">
              {["No Throttling", "4G", "3G"].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setNetwork(net)}
                  className={`h-8.5 rounded-md text-[11px] font-semibold flex items-center justify-center transition-all truncate px-1 cursor-pointer ${
                    network === net
                      ? "bg-surface-0 text-brand-500 shadow-xs border border-border"
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
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg px-5 h-10 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                Executing Lighthouse Audit…
              </>
            ) : (
              <>
                Start Performance Audit
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTest;
