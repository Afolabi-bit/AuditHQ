"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Globe,
  Loader2,
  Monitor,
  Smartphone,
  Zap,
} from "lucide-react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { useSWRConfig } from "swr";
import { useAppStore } from "@/lib/store/useAppStore";

interface NewTestProps {
  user: KindeUser;
}

const NewTest: React.FC<NewTestProps> = ({ user }) => {
  const [url, setUrl] = useState("");
  const [device, setDevice] = useState<string>("Desktop");
  const [network, setNetwork] = useState<string>("No Throttling");
  const [isTesting, setIsTesting] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState({
    validity: true,
    message: "",
  });

  const { mutate } = useSWRConfig();

  const validateUrl = (urlToValidate: string) => {
    if (!urlToValidate || urlToValidate.trim() === "") {
      return { validity: false, message: "URL is required" };
    }
    const withProtocol = /^https?:\/\//i.test(urlToValidate.trim())
      ? urlToValidate.trim()
      : `https://${urlToValidate.trim()}`;
    const urlPattern =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    if (!urlPattern.test(withProtocol)) {
      return {
        validity: false,
        message: "Please enter a valid domain (e.g., example.com)",
      };
    }
    return { validity: true, message: "" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateUrl(url);
    if (!validation.validity) {
      setIsUrlValid(validation);
      return;
    }

    setIsUrlValid({ validity: true, message: "" });
    setIsTesting(true);

    const queuedToastId = toast.loading("Connecting to cloud audit cluster...", {
      description: `Target: ${url} (${device})`,
    });

    try {
      const response = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          device,
          network,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Audit failed", {
          id: queuedToastId,
          description:
            data.message || data.error || "Failed to execute Lighthouse audit.",
        });
        setIsTesting(false);
        return;
      }

      const testId = data.testId || data.id;
      const score = data.results?.performanceScore ?? data.performanceScore;
      const normalizedTargetUrl = data.url || url;

      // Optimistically push the newly completed test to local Zustand store
      if (testId) {
        const dId = String(data.domainId || "d-" + Date.now());
        useAppStore.getState().upsertTest({
          id: String(testId),
          domainId: dId,
          status: "completed",
          performanceScore: score ?? null,
          fcp: data.results?.fcp ?? null,
          lcp: data.results?.lcp ?? null,
          tbt: data.results?.tbt ?? null,
          cls: data.results?.cls ?? null,
          device,
          network,
          errorMessage: null,
          createdAt: new Date().toISOString(),
          domain: {
            id: dId,
            url: normalizedTargetUrl,
            device,
            network,
            ownerId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }

      // Background revalidation to sync with server
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
    <div className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-8 shadow-xs hover:border-brand-200 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-brand-50 text-brand-500 border border-brand-200 flex items-center justify-center shadow-2xs">
              <Zap className="h-4 w-4 fill-brand-500" />
            </div>
            <h2 className="text-lg font-bold text-text-primary font-sans">
              Run New Performance Audit
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary">
            Execute headless Lighthouse evaluation with real-world device & network throttling
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-score-good bg-[#e3fcf7] border border-[#abf5d1] dark:bg-[#00875a]/15 dark:text-[#4de7b4] dark:border-[#00875a]/30">
          <span className="w-2 h-2 rounded-full bg-score-good animate-pulse" />
          Engine Ready
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-end">
          {/* URL Input */}
          <div className="md:col-span-6 space-y-2">
            <Label htmlFor="url" className="text-xs font-bold text-text-secondary uppercase tracking-wider font-sans">
              Website URL
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                <Globe className="h-4.5 w-4.5" />
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
                className={`pl-10 h-12 text-sm bg-surface-1 border-border text-text-primary placeholder:text-text-tertiary focus:bg-surface-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl transition-all font-mono ${
                  !isUrlValid.validity ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""
                }`}
              />
            </div>
            {!isUrlValid.validity && (
              <p className="text-xs text-destructive font-medium">{isUrlValid.message}</p>
            )}
          </div>

          {/* Device Selection */}
          <div className="md:col-span-3 space-y-2">
            <Label className="text-xs font-bold text-text-secondary uppercase tracking-wider font-sans">
              Device Profile
            </Label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-1 rounded-xl border border-border h-12 items-center">
              <button
                type="button"
                onClick={() => setDevice("Desktop")}
                className={`h-9.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  device === "Desktop"
                    ? "bg-surface-0 text-brand-500 shadow-2xs border border-border"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Monitor className="h-4 w-4" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice("Mobile")}
                className={`h-9.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  device === "Mobile"
                    ? "bg-surface-0 text-brand-500 shadow-2xs border border-border"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Smartphone className="h-4 w-4" />
                Mobile
              </button>
            </div>
          </div>

          {/* Network Throttling */}
          <div className="md:col-span-3 space-y-2">
            <Label className="text-xs font-bold text-text-secondary uppercase tracking-wider font-sans">
              Network
            </Label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-surface-1 rounded-xl border border-border h-12 items-center">
              {["No Throttling", "4G", "3G"].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setNetwork(net)}
                  className={`h-9.5 rounded-lg text-xs font-semibold flex items-center justify-center transition-all truncate px-1 cursor-pointer ${
                    network === net
                      ? "bg-surface-0 text-brand-500 shadow-2xs border border-border"
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
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isTesting}
            className="h-11 px-6 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer gap-2"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                Auditing in Headless Chromium…
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 fill-white" />
                Launch Cloud Audit
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTest;
