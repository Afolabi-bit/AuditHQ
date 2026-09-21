"use client";

import React, { useState } from "react";
import { Warning, Trash, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { deleteTest } from "@/app/utils/actions";
import { useAppStore } from "@/lib/store/useAppStore";

interface DeleteTestModalProps {
  testId: string | number | null;
  url?: string;
  date?: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: (testId: string) => void;
}

export const DeleteTestModal: React.FC<DeleteTestModalProps> = ({
  testId,
  url,
  date,
  isOpen,
  onClose,
  onDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const removeTest = useAppStore((state) => state.removeTest);

  if (!isOpen || !testId) return null;

  const testIdStr = String(testId);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setErrorMessage(null);

      const result = await deleteTest(testIdStr);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to delete test");
        setIsDeleting(false);
        return;
      }

      // Optimistically remove from local store
      removeTest(testIdStr);

      if (onDeleted) {
        onDeleted(testIdStr);
      }

      setIsDeleting(false);
      onClose();
    } catch (err) {
      console.error("Error deleting audit test:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface-0/95 dark:bg-[#0c0e14]/95 backdrop-blur-2xl border border-border/60 dark:border-white/[0.08] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center shrink-0">
              <Warning weight="fill" className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Delete Audit Run
              </h3>
              <p className="text-xs text-text-secondary font-mono">Audit #{testIdStr}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="h-8.5 w-8.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border/60 dark:border-white/[0.07] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            <X weight="bold" className="h-4 w-4" />
          </button>
        </div>

        {/* Audit Details Box */}
        <div className="bg-surface-1/70 dark:bg-white/[0.03] border border-border/60 dark:border-white/[0.07] rounded-2xl p-4 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between items-center gap-2">
            <span className="text-text-tertiary">Target URL:</span>
            <span
              className="text-text-primary font-bold truncate max-w-50"
              title={url}
            >
              {url || "Unknown URL"}
            </span>
          </div>
          {date && (
            <div className="flex justify-between items-center gap-2">
              <span className="text-text-tertiary">Run Date:</span>
              <span className="text-text-secondary">{date}</span>
            </div>
          )}
        </div>

        {/* Quota Disclaimer Notice */}
        <div className="bg-surface-1/70 dark:bg-white/[0.03] border border-border/60 dark:border-white/[0.07] rounded-2xl p-4 text-xs text-text-secondary space-y-1 leading-relaxed">
          <p className="font-semibold text-text-primary">
            Are you sure you want to delete this test?
          </p>
          <p className="text-[11px] text-text-tertiary">
            This permanently removes the report and traces from your account.
            The run still counts against your monthly quota.
          </p>
        </div>

        {errorMessage && (
          <div className="text-xs font-mono text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20">
            {errorMessage}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="h-10 px-4 text-xs font-semibold rounded-xl border-border/60 dark:border-white/[0.08] cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-10 px-4 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Trash weight="bold" className="h-4 w-4" />
            {isDeleting ? "Deleting…" : "Delete Audit"}
          </Button>
        </div>
      </div>
    </div>
  );
};
