"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Desktop, CheckCircle } from "@phosphor-icons/react";

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    {
      id: "light",
      label: "Light Theme",
      desc: "High-contrast precision slate & crisp white surfaces",
      icon: Sun,
      preview: {
        bg: "bg-[#f8fafc]",
        card: "bg-white border-[#e2e8f0]",
        accent: "bg-[#2563eb]",
        text: "bg-[#0f172a]",
        muted: "bg-[#94a3b8]",
      },
    },
    {
      id: "dark",
      label: "Dark Theme",
      desc: "Deep obsidian black with calibrated cobalt accents",
      icon: Moon,
      preview: {
        bg: "bg-[#05070a]",
        card: "bg-[#0c0e14] border-white/[0.08]",
        accent: "bg-[#2563eb]",
        text: "bg-[#f1f5f9]",
        muted: "bg-[#64748b]",
      },
    },
    {
      id: "system",
      label: "System Match",
      desc: "Automatically syncs with your operating system preference",
      icon: Desktop,
      preview: {
        bg: "bg-gradient-to-r from-[#f8fafc] to-[#05070a]",
        card: "bg-gradient-to-r from-white to-[#0c0e14] border-[#e2e8f0] dark:border-white/[0.08]",
        accent: "bg-[#2563eb]",
        text: "bg-gradient-to-r from-[#0f172a] to-[#f1f5f9]",
        muted: "bg-gradient-to-r from-[#94a3b8] to-[#64748b]",
      },
    },
  ];

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-36 rounded-2xl bg-surface-2/40 border border-border/60 dark:border-white/[0.07] animate-pulse"
          />
        ))}
      </div>
    );
  }

  const currentTheme = theme || "system";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {themes.map((t) => {
        const isSelected = currentTheme === t.id;
        const Icon = t.icon;

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            className={`text-start p-5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between gap-4 backdrop-blur-xl ${
              isSelected
                ? "bg-surface-0/90 dark:bg-white/[0.06] border-brand-500 ring-2 ring-brand-500/20 shadow-xs"
                : "bg-surface-0/60 dark:bg-white/[0.02] border-border/60 dark:border-white/[0.07] hover:border-brand-300 dark:hover:border-brand-500/30 hover:bg-surface-1/60 dark:hover:bg-white/[0.04]"
            }`}
          >
            {/* Visual Mini Preview Tile */}
            <div
              className={`w-full h-16 rounded-xl ${t.preview.bg} p-2 flex flex-col justify-between border ${
                isSelected ? "border-brand-200/50 dark:border-brand-500/40" : "border-border/60 dark:border-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`h-2.5 w-12 rounded-full ${t.preview.text}`} />
                <div className={`h-2.5 w-6 rounded-full ${t.preview.accent}`} />
              </div>
              <div
                className={`w-full h-6 rounded-lg ${t.preview.card} border p-1 flex items-center gap-1.5`}
              >
                <div className={`h-1.5 w-8 rounded-full ${t.preview.muted}`} />
                <div className={`h-1.5 w-4 rounded-full ${t.preview.accent}`} />
              </div>
            </div>

            {/* Label & Description */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    weight={isSelected ? "fill" : "bold"}
                    className={`h-4 w-4 ${
                      isSelected ? "text-brand-600 dark:text-brand-400" : "text-text-secondary"
                    }`}
                  />
                  <h4 className="text-xs font-bold text-text-primary">
                    {t.label}
                  </h4>
                </div>

                {isSelected && (
                  <CheckCircle weight="fill" className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-text-secondary leading-snug">
                {t.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

