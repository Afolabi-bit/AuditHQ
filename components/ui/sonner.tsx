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
            "group toast group-[.toaster]:bg-surface-0 group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:border font-sans text-sm",
          description: "group-[.toast]:text-text-secondary font-sans text-xs",
          actionButton:
            "group-[.toast]:bg-brand-600 group-[.toast]:text-white font-semibold text-xs",
          cancelButton:
            "group-[.toast]:bg-surface-1 group-[.toast]:text-text-secondary text-xs",
          closeButton:
            "group-[.toast]:bg-surface-0 group-[.toast]:text-text-secondary group-[.toast]:border-border group-[.toast]:hover:text-text-primary",
        },
      }}
      {...props}
    />
  );
};
