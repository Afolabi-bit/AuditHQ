"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowsLeftRight,
  Calendar,
  Desktop,
  DeviceMobile,
  X,
  Lightning,
  Check,
  MagnifyingGlass,
} from "@phosphor-icons/react";
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
  const currentUserId = useAppStore((state) => state.currentUserId);
  const tests = useAppStore((state) => state.tests);
  const testsOrder = useAppStore((state) => state.testsOrder);

  // All completed tests in chronological order (newest first)
  const completedTests = useMemo(() => {
    return testsOrder
      .map((id) => tests[id])
      .filter((t): t is StoredTest => {
        if (!t || t.status !== "completed") return false;
        if (!isPublic && currentUserId && t.domain?.ownerId && t.domain.ownerId !== currentUserId) {
          return false;
        }
        return true;
      });
  }, [tests, testsOrder, isPublic, currentUserId]);

  const defaultTarget = initialTargetId || (completedTests.length > 0 ? String(completedTests[0]?.id) : "");
  const defaultBase =
    initialBaseId ||
    (completedTests.length > 1 ? String(completedTests[1]?.id) : defaultTarget);

  const [baseId, setBaseId] = useState<string>(String(defaultBase));
  const [targetId, setTargetId] = useState<string>(String(defaultTarget));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlot, setActiveSlot] = useState<"base" | "target">("base");

  // Keep state synced when modal is opened or props change
  useEffect(() => {
    if (isOpen) {
      if (initialBaseId) setBaseId(String(initialBaseId));
      if (initialTargetId) setTargetId(String(initialTargetId));
    }
  }, [isOpen, initialBaseId, initialTargetId]);

  if (!isOpen) return null;

  const baseTest =
    tests[baseId] ||
    completedTests.find((t) => String(t.id) === String(baseId)) ||
    null;

  const targetTest =
    tests[targetId] ||
    completedTests.find((t) => String(t.id) === String(targetId)) ||
    null;

  const handleSwap = () => {
    const temp = baseId;
    setBaseId(targetId);
    setTargetId(temp);
  };

  const handleSelect = (id: string | number, slot?: "base" | "target") => {
    const idStr = String(id);
    const targetSlot = slot || activeSlot;

    if (targetSlot === "base") {
      setBaseId(idStr);
      // Auto-focus target slot next if it's currently empty or same
      if (!targetId || targetId === idStr) {
        setActiveSlot("target");
      }
    } else {
      setTargetId(idStr);
      // If base was empty or same, point back to base
      if (!baseId || baseId === idStr) {
        setActiveSlot("base");
      }
    }
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
      String(t.id).toLowerCase().includes(query)
    );
  });

  const getScoreBadge = (score: number | null) => {
    if (score == null) return "bg-surface-2 text-text-tertiary border-border";
    if (score >= 90) return "score-badge-good";
    if (score >= 50) return "score-badge-warn";
    return "score-badge-poor";
  };

  const isSameTest = baseId && targetId && String(baseId) === String(targetId);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-surface-0 border border-border rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[88vh] h-full overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
              <ArrowsLeftRight weight="bold" className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              Compare Audit Runs
            </h3>
            <p className="text-xs text-text-secondary">
              Select a baseline and target test to evaluate regressions and score deltas
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer shrink-0"
          >
            <X weight="bold" className="h-4 w-4" />
          </button>
        </div>

        {/* 2. Selected Pair Preview Box */}
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center bg-surface-1 p-2.5 rounded-xl border border-border shrink-0 my-3">
          {/* Base Selection Box */}
          <button
            type="button"
            onClick={() => setActiveSlot("base")}
            className={`sm:col-span-5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              activeSlot === "base"
                ? "bg-surface-0 border-brand-500 shadow-xs ring-1 ring-brand-500/30"
                : "bg-surface-0/60 border-border hover:bg-surface-0"
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-mono">
                1. Base (Baseline)
              </span>
              {activeSlot === "base" && (
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
              )}
            </div>
            {baseTest ? (
              <div className="space-y-0.5">
                <p className="text-xs font-mono font-bold text-text-primary truncate">
                  {baseTest.domain?.url || "Audit Run"}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                  <span>{baseTest.device || "Desktop"}</span>
                  <span className="font-bold text-text-primary">
                    {baseTest.performanceScore ?? "—"}/100
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-tertiary font-mono">Click a test below to set</p>
            )}
          </button>

          {/* Swap Button */}
          <div className="sm:col-span-1 flex justify-center py-0.5 sm:py-0">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!baseId || !targetId}
              className="h-7 w-7 rounded-full bg-surface-0 border border-border shadow-xs hover:border-brand-500 hover:text-brand-500 flex items-center justify-center text-xs font-bold text-text-secondary transition-all cursor-pointer group disabled:opacity-40"
              title="Swap Base and Target"
            >
              <ArrowsLeftRight weight="bold" className="h-3 w-3 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* Target Selection Box */}
          <button
            type="button"
            onClick={() => setActiveSlot("target")}
            className={`sm:col-span-5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              activeSlot === "target"
                ? "bg-surface-0 border-brand-500 shadow-xs ring-1 ring-brand-500/30"
                : "bg-surface-0/60 border-border hover:bg-surface-0"
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-mono">
                2. Target (Comparison)
              </span>
              {activeSlot === "target" && (
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
              )}
            </div>
            {targetTest ? (
              <div className="space-y-0.5">
                <p className="text-xs font-mono font-bold text-text-primary truncate">
                  {targetTest.domain?.url || "Audit Run"}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                  <span>{targetTest.device || "Desktop"}</span>
                  <span className="font-bold text-text-primary">
                    {targetTest.performanceScore ?? "—"}/100
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-tertiary font-mono">Click a test below to set</p>
            )}
          </button>
        </div>

        {/* 3. Search & Active Slot Instruction */}
        <div className="space-y-2 shrink-0 mb-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">
              Clicking a test selects for:{" "}
              <strong className="text-brand-600 dark:text-brand-300 font-bold">
                {activeSlot === "base" ? "1. Base Run (Baseline)" : "2. Target Run (Comparison)"}
              </strong>
            </span>

            <span className="text-[11px] font-mono text-text-tertiary">
              {filteredList.length} audits
            </span>
          </div>

          <div className="relative">
            <MagnifyingGlass weight="bold" className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              placeholder="Search audits by URL or device..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-1 border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-brand-500 focus:bg-surface-0 transition-all"
            />
          </div>
        </div>

        {/* 4. Interactive Scrollable Audit List Container */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
          {filteredList.length === 0 ? (
            <div className="py-10 text-center text-xs text-text-tertiary font-mono space-y-1">
              <p>No matching completed audits found.</p>
              <p className="text-[11px]">Try running new tests or adjusting your search query.</p>
            </div>
          ) : (
            filteredList.map((testItem) => {
              const idStr = String(testItem.id);
              const isSelectedForBase = String(baseId) === idStr;
              const isSelectedForTarget = String(targetId) === idStr;
              const isCurrentActiveSelected =
                activeSlot === "base" ? isSelectedForBase : isSelectedForTarget;

              return (
                <div
                  key={testItem.id}
                  onClick={() => handleSelect(testItem.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isCurrentActiveSelected
                      ? "bg-brand-50/60 dark:bg-brand-500/15 border-brand-500 shadow-2xs"
                      : isSelectedForBase || isSelectedForTarget
                      ? "bg-surface-1 border-brand-200 dark:border-brand-500/40"
                      : "bg-surface-1 hover:bg-surface-2 border-border text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-mono font-bold truncate text-text-primary max-w-xs" title={testItem.domain?.url}>
                        {testItem.domain?.url || "Audit Run"}
                      </p>

                      {isSelectedForBase && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-surface-2 text-text-secondary border border-border shrink-0">
                          Base
                        </span>
                      )}
                      {isSelectedForTarget && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 shrink-0">
                          Target
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-text-tertiary font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar weight="bold" className="h-3 w-3" />
                        {new Date(testItem.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {testItem.device?.toLowerCase().includes("mobile") ? (
                          <DeviceMobile weight="bold" className="h-3 w-3" />
                        ) : (
                          <Desktop weight="bold" className="h-3 w-3" />
                        )}
                        {testItem.device || "Desktop"}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Score */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Direct Quick Slot Buttons on Hover / Focus */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSelect(testItem.id, "base")}
                        className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                          isSelectedForBase
                            ? "bg-brand-600 text-white"
                            : "bg-surface-0 hover:bg-surface-2 border border-border text-text-secondary hover:text-text-primary"
                        }`}
                        title="Set as Base"
                      >
                        Base
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelect(testItem.id, "target")}
                        className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                          isSelectedForTarget
                            ? "bg-brand-600 text-white"
                            : "bg-surface-0 hover:bg-surface-2 border border-border text-text-secondary hover:text-text-primary"
                        }`}
                        title="Set as Target"
                      >
                        Target
                      </button>
                    </div>

                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full border ${getScoreBadge(
                        testItem.performanceScore
                      )}`}
                    >
                      {testItem.performanceScore ?? "—"}/100
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. Sticky Footer Action Bar */}
        <div className="pt-3 mt-2 border-t border-border flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono">
            {isSameTest && (
              <span className="text-score-warn font-semibold text-[11px]">
                ⚠️ Select 2 different audits to compare
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer h-8 text-xs font-medium border-border"
            >
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={!baseId || !targetId || Boolean(isSameTest)}
              onClick={handleLaunch}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold cursor-pointer gap-1.5 shadow-xs disabled:opacity-40 h-8 text-xs rounded-lg"
            >
              <Lightning weight="fill" className="h-3.5 w-3.5" />
              Compare Runs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

