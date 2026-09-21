"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card/90 dark:group-[.toaster]:bg-[#0c0e14]/95 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-text-primary group-[.toaster]:border-border/60 dark:group-[.toaster]:border-white/[0.08] group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:border font-sans text-sm",
          description: "group-[.toast]:text-text-secondary font-sans text-xs",
          actionButton:
            "group-[.toast]:bg-brand-600 group-[.toast]:text-white font-semibold text-xs rounded-xl shadow-xs",
          cancelButton:
            "group-[.toast]:bg-surface-1/80 group-[.toast]:text-text-secondary text-xs rounded-xl",
          closeButton:
            "group-[.toast]:bg-surface-0/80 dark:group-[.toast]:bg-white/[0.04] group-[.toast]:text-text-secondary group-[.toast]:border-border/60 dark:group-[.toast]:border-white/[0.08] group-[.toast]:hover:text-text-primary",
        },
      }}
      {...props}
    />
  );
};
