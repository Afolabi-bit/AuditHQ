"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Lightning,
  Clock,
  HardDrives,
  Copy,
  Check,
} from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { formatBytes, formatMilliseconds } from "@/lib/report-parser";

export interface DiagnosticItemDetail {
  id: string;
  title: string;
  description: string;
  displayValue?: string;
  overallSavingsMs?: number;
  overallSavingsBytes?: number;
  score?: number | null;
  items?: Array<{
    url?: string;
    totalBytes?: number;
    wastedBytes?: number;
    wastedMs?: number;
    node?: any;
    source?: string;
    duration?: number;
  }>;
}

interface DiagnosticInspectorDrawerProps {
  item: DiagnosticItemDetail | null;
  onClose: () => void;
}

export const DiagnosticInspectorDrawer: React.FC<DiagnosticInspectorDrawerProps> = ({
  item,
  onClose,
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [item, onClose]);

  if (!item) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const hasSavingsMs = item.overallSavingsMs && item.overallSavingsMs > 0;
  const hasSavingsBytes = item.overallSavingsBytes && item.overallSavingsBytes > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Right Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-xl bg-surface-0 border-l border-border shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="p-6 border-b border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-600 dark:text-brand-400">
                <Lightning weight="fill" className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span>Diagnostic Inspector</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-1 transition-colors cursor-pointer"
                title="Close drawer (Esc)"
              >
                <X weight="bold" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-text-primary">
                {item.title}
              </h2>
              {item.displayValue && (
                <p className="text-xs font-semibold text-score-good">
                  {item.displayValue}
                </p>
              )}
            </div>

            {/* Savings Badges */}
            {(hasSavingsMs || hasSavingsBytes) && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {hasSavingsMs && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold score-badge-good">
                    <Clock weight="bold" className="h-3.5 w-3.5" />
                    Est. Time Savings: {formatMilliseconds(item.overallSavingsMs!)}
                  </span>
                )}
                {hasSavingsBytes && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
                    <HardDrives weight="fill" className="h-3.5 w-3.5" />
                    Est. Byte Savings: {formatBytes(item.overallSavingsBytes!)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Detailed Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Diagnostic Overview
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed bg-surface-1 p-4 rounded-2xl border border-border">
                {item.description}
              </p>
            </div>

            {/* Affected Resources / URLs List */}
            {item.items && item.items.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    Affected Assets & Endpoints ({item.items.length})
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {item.items.map((row, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-surface-1 rounded-2xl border border-border space-y-2 text-xs"
                    >
                      {row.url && (
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-xs text-text-primary break-all">
                            {row.url}
                          </span>
                          <button
                            onClick={() => handleCopy(row.url!)}
                            className="p-1 text-text-tertiary hover:text-text-primary shrink-0 cursor-pointer"
                            title="Copy URL"
                          >
                            {copiedUrl === row.url ? (
                              <Check weight="bold" className="h-3.5 w-3.5 text-score-good" />
                            ) : (
                              <Copy weight="bold" className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-text-secondary pt-1 border-t border-border/60">
                        {row.wastedMs != null && (
                          <span className="font-semibold text-score-good">
                            Wasted: {formatMilliseconds(row.wastedMs)}
                          </span>
                        )}
                        {row.wastedBytes != null && (
                          <span className="text-text-tertiary">
                            Potential Savings: {formatBytes(row.wastedBytes)}
                          </span>
                        )}
                        {row.totalBytes != null && (
                          <span className="text-text-tertiary">
                            Total Payload: {formatBytes(row.totalBytes)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-5 border-t border-border bg-surface-1/50 flex items-center justify-between">
            <span className="text-xs text-text-tertiary font-mono">
              Audit ID: {item.id}
            </span>
            <Button
              size="sm"
              onClick={onClose}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl px-5 h-9 cursor-pointer"
            >
              Done Inspecting
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

