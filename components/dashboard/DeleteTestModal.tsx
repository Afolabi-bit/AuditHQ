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
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-surface-0 border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center shrink-0">
              <Warning weight="fill" className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Delete Audit Run
              </h3>
              <p className="text-xs text-text-secondary">
                Audit #{testIdStr}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="h-8 w-8 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            <X weight="bold" className="h-4 w-4" />
          </button>
        </div>

        {/* Audit Details Box */}
        <div className="bg-surface-1 border border-border rounded-xl p-3.5 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-text-tertiary">Target URL:</span>
            <span className="text-text-primary font-bold truncate max-w-[200px]" title={url}>
              {url || "Unknown URL"}
            </span>
          </div>
          {date && (
            <div className="flex justify-between">
              <span className="text-text-tertiary">Run Date:</span>
              <span className="text-text-secondary">{date}</span>
            </div>
          )}
        </div>

        {/* Quota Disclaimer Notice */}
        <div className="bg-surface-1 border border-border/80 rounded-xl p-3.5 text-xs text-text-secondary space-y-1 leading-relaxed">
          <p className="font-semibold text-text-primary">
            Are you sure you want to delete this test?
          </p>
          <p className="text-[11px] text-text-tertiary">
            This will permanently remove the audit report and performance traces from your dashboard. Please note that this execution still counts against your monthly usage quota.
          </p>
        </div>

        {errorMessage && (
          <div className="text-xs font-mono text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
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
            className="h-9 px-4 text-xs font-semibold border-border cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-9 px-4 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Trash weight="bold" className="h-4 w-4" />
            {isDeleting ? "Deleting…" : "Delete Audit Run"}
          </Button>
        </div>
      </div>
    </div>
  );
};
