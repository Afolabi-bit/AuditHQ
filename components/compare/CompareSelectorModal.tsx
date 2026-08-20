"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightLeft,
  Calendar,
  Monitor,
  Smartphone,
  X,
  Zap,
  Check,
  Search,
} from "lucide-react";
import { useAppStore, StoredTest } from "@/lib/store/useAppStore";
import { Button } from "@/components/ui/button";

interface CompareSelectorModalProps {
  initialBaseId?: string;
  initialTargetId?: string;
  isOpen: boolean;
  onClose: () => void;
  isPublic?: boolean;
}

export const CompareSelectorModal: React.FC<CompareSelectorModalProps> = ({
  initialBaseId,
  initialTargetId,
  isOpen,
  onClose,
  isPublic = false,
}) => {
  const router = useRouter();
  const tests = useAppStore((state) => state.tests);
  const testsOrder = useAppStore((state) => state.testsOrder);

  // All completed tests in chronological order (newest first)
  const completedTests = useMemo(() => {
    return testsOrder
      .map((id) => tests[id])
      .filter((t): t is StoredTest => Boolean(t && t.status === "completed"));
  }, [tests, testsOrder]);

  // Default: Base is second newest, Target is newest
  const defaultTarget = initialTargetId || (completedTests.length > 0 ? completedTests[0]?.id : "");
  const defaultBase =
    initialBaseId ||
    (completedTests.length > 1 ? completedTests[1]?.id : defaultTarget);

  const [baseId, setBaseId] = useState<string>(defaultBase);
  const [targetId, setTargetId] = useState<string>(defaultTarget);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"base" | "target">("base");

  useEffect(() => {
    if (initialBaseId) setBaseId(initialBaseId);
    if (initialTargetId) setTargetId(initialTargetId);
  }, [initialBaseId, initialTargetId]);

  if (!isOpen) return null;

  const baseTest = tests[baseId];
  const targetTest = tests[targetId];

  const handleSwap = () => {
    const temp = baseId;
    setBaseId(targetId);
    setTargetId(temp);
  };

  const handleLaunch = () => {
    if (!baseId || !targetId || baseId === targetId) return;
    const basePath = isPublic ? "/compare" : "/dashboard/compare";
    router.push(`${basePath}?base=${baseId}&target=${targetId}`);
    onClose();
  };

  const filteredList = completedTests.filter((t) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.domain?.url?.toLowerCase().includes(query) ||
      t.device?.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query)
    );
  });

  const getScoreBadge = (score: number | null) => {
    if (score == null) return "bg-surface-2 text-text-tertiary border-border";
    if (score >= 90) return "bg-[#e3fcf7] text-[#00875a] border-[#abf5d1] dark:bg-[#00875a]/15 dark:text-[#4de7b4] dark:border-[#00875a]/30";
    if (score >= 50) return "bg-[#fff8e5] text-[#b76e00] border-[#ffe380] dark:bg-[#b76e00]/15 dark:text-[#ffc400] dark:border-[#b76e00]/30";
    return "bg-[#ffebe6] text-[#de350b] border-[#ffbdad] dark:bg-[#de350b]/15 dark:text-[#ff7452] dark:border-[#de350b]/30";
  };

  const isSameTest = baseId && targetId && baseId === targetId;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface-0 border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 shrink-0">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-bold text-text-primary font-sans flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-brand-500" />
              Compare Audit Runs
            </h3>
            <p className="text-xs text-text-secondary">
              Select any baseline and target test to evaluate regressions and score deltas
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Selected Pair Preview Card */}
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center bg-surface-1 p-3.5 rounded-xl border border-border shrink-0">
          {/* Base Selection Box */}
          <button
            type="button"
            onClick={() => setActiveTab("base")}
            className={`sm:col-span-5 p-3 rounded-lg border text-left transition-all cursor-pointer ${
              activeTab === "base"
                ? "bg-surface-0 border-brand-500 shadow-xs ring-1 ring-brand-500/30"
                : "bg-surface-0/60 border-border hover:bg-surface-0"
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-sans">
                1. Base Run (Baseline)
              </span>
              {activeTab === "base" && (
                <span className="h-2 w-2 rounded-full bg-brand-500" />
              )}
            </div>
            {baseTest ? (
              <div className="space-y-0.5">
                <p className="text-xs font-mono font-bold text-text-primary truncate">
                  {baseTest.domain?.url || "Audit Run"}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-text-tertiary">
                  <span>{baseTest.device || "Desktop"}</span>
                  <span className="font-bold text-text-primary">
                    {baseTest.performanceScore ?? "—"}/100
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-tertiary font-mono">Select Base Run below</p>
            )}
          </button>

          {/* Center Swap Action */}
          <div className="sm:col-span-1 flex justify-center py-1 sm:py-0">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!baseId || !targetId}
              className="h-8 w-8 rounded-full bg-surface-0 border border-border shadow-xs hover:border-brand-500 hover:text-brand-500 flex items-center justify-center text-xs font-bold text-text-secondary transition-all cursor-pointer group disabled:opacity-40"
              title="Swap Base and Target"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* Target Selection Box */}
          <button
            type="button"
            onClick={() => setActiveTab("target")}
            className={`sm:col-span-5 p-3 rounded-lg border text-left transition-all cursor-pointer ${
              activeTab === "target"
                ? "bg-surface-0 border-brand-500 shadow-xs ring-1 ring-brand-500/30"
                : "bg-surface-0/60 border-border hover:bg-surface-0"
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-sans">
                2. Target Run (Comparison)
              </span>
              {activeTab === "target" && (
                <span className="h-2 w-2 rounded-full bg-brand-500" />
              )}
            </div>
            {targetTest ? (
              <div className="space-y-0.5">
                <p className="text-xs font-mono font-bold text-text-primary truncate">
                  {targetTest.domain?.url || "Audit Run"}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-text-tertiary">
                  <span>{targetTest.device || "Desktop"}</span>
                  <span className="font-bold text-text-primary">
                    {targetTest.performanceScore ?? "—"}/100
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-tertiary font-mono">Select Target Run below</p>
            )}
          </button>
        </div>

        {/* Search & Active Tab Selector */}
        <div className="space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-secondary">
              Selecting for:{" "}
              <strong className="text-brand-500 font-sans">
                {activeTab === "base" ? "1. Base Run (Baseline)" : "2. Target Run (Comparison)"}
              </strong>
            </span>

            <span className="text-[11px] font-mono text-text-tertiary">
              {filteredList.length} completed audits available
            </span>
          </div>

          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              placeholder="Search audits by URL or device..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-1 border border-border rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-brand-500 focus:bg-surface-0 transition-all"
            />
          </div>
        </div>

        {/* Audit List */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1 min-h-48">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center text-xs text-text-tertiary font-mono space-y-1">
              <p>No matching completed audits found.</p>
              <p className="text-[11px]">Try adjusting your search query.</p>
            </div>
          ) : (
            filteredList.map((testItem) => {
              const isSelectedForBase = baseId === testItem.id;
              const isSelectedForTarget = targetId === testItem.id;
              const isCurrentActiveSelected =
                activeTab === "base" ? isSelectedForBase : isSelectedForTarget;

              return (
                <div
                  key={testItem.id}
                  onClick={() => {
                    if (activeTab === "base") {
                      setBaseId(testItem.id);
                      if (targetId === testItem.id) {
                        setActiveTab("target");
                      }
                    } else {
                      setTargetId(testItem.id);
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCurrentActiveSelected
                      ? "bg-brand-50/70 dark:bg-brand-500/10 border-brand-500 shadow-xs"
                      : "bg-surface-1 hover:bg-surface-2 border-border text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono font-bold truncate text-text-primary">
                        {testItem.domain?.url || "Audit Run"}
                      </p>

                      {isSelectedForBase && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-surface-2 text-text-secondary border border-border shrink-0">
                          Base
                        </span>
                      )}
                      {isSelectedForTarget && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-brand-50 text-brand-500 border border-brand-200 shrink-0">
                          Target
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-text-tertiary font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(testItem.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {testItem.device?.toLowerCase().includes("mobile") ? (
                          <Smartphone className="h-3 w-3" />
                        ) : (
                          <Monitor className="h-3 w-3" />
                        )}
                        {testItem.device || "Desktop"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono font-bold text-xs px-2.5 py-1 rounded-md border ${getScoreBadge(
                        testItem.performanceScore
                      )}`}
                    >
                      {testItem.performanceScore ?? "—"}/100
                    </span>

                    <div
                      className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all ${
                        isCurrentActiveSelected
                          ? "bg-brand-500 border-brand-500 text-white"
                          : "border-border bg-surface-0 text-transparent hover:border-brand-300"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono">
            {isSameTest && (
              <span className="text-score-warn font-semibold">
                ⚠️ Select two different audit runs to compare
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={!baseId || !targetId || Boolean(isSameTest)}
              onClick={handleLaunch}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold cursor-pointer gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              Launch Side-by-Side Comparison
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
