"use client";

import React, { useState, useEffect } from "react";
import { SignOut, Warning, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

export const SignOutButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="bg-surface-0 hover:bg-destructive/10 text-destructive border-destructive/30 font-semibold text-xs rounded-lg px-4 h-9 cursor-pointer w-full sm:w-auto shrink-0 shadow-xs transition-colors"
      >
        <SignOut weight="bold" className="h-4 w-4 mr-1.5" />
        Sign Out
      </Button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-dialog-title"
            className="bg-surface-0 border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
                  <Warning weight="fill" className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    id="signout-dialog-title"
                    className="text-base font-bold text-text-primary"
                  >
                    Confirm Sign Out
                  </h3>
                  <p className="text-xs text-text-secondary">
                    End your active AuditHQ session
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X weight="bold" className="h-4 w-4" />
              </button>
            </div>

            {/* Message Body */}
            <p className="text-xs text-text-secondary leading-relaxed bg-surface-1 p-3.5 rounded-xl border border-border">
              Are you sure you want to sign out? You will need to log back in with your credentials to access your performance audits, continuous telemetry, and account settings.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-text-secondary bg-surface-0 hover:bg-surface-2 hover:text-text-primary border-border rounded-lg h-9 px-4 cursor-pointer"
              >
                Cancel
              </Button>

              <LogoutLink className="inline-flex">
                <Button
                  type="button"
                  size="sm"
                  className="bg-destructive hover:bg-destructive/90 text-white font-semibold text-xs rounded-lg h-9 px-4 shadow-sm cursor-pointer"
                >
                  <SignOut weight="bold" className="h-4 w-4 mr-1.5" />
                  Sign Out
                </Button>
              </LogoutLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

