"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, CheckCircle2 } from "lucide-react";

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
      desc: "Stripe-inspired crisp slate & white canvas",
      icon: Sun,
      preview: {
        bg: "bg-[#f6f9fc]",
        card: "bg-white border-[#e3e8ee]",
        accent: "bg-[#635bff]",
        text: "bg-[#0a2540]",
        muted: "bg-[#8898aa]",
      },
    },
    {
      id: "dark",
      label: "Dark Theme",
      desc: "Linear/Vercel obsidian black & luminous blurple",
      icon: Moon,
      preview: {
        bg: "bg-[#08090a]",
        card: "bg-[#0f1011] border-white/10",
        accent: "bg-[#7c75ff]",
        text: "bg-[#f7f8f8]",
        muted: "bg-[#62666d]",
      },
    },
    {
      id: "system",
      label: "System Match",
      desc: "Automatically syncs with your OS dark/light mode",
      icon: Laptop,
      preview: {
        bg: "bg-gradient-to-r from-[#f6f9fc] to-[#08090a]",
        card: "bg-gradient-to-r from-white to-[#0f1011] border-[#e3e8ee] dark:border-white/10",
        accent: "bg-[#635bff]",
        text: "bg-gradient-to-r from-[#0a2540] to-[#f7f8f8]",
        muted: "bg-gradient-to-r from-[#8898aa] to-[#62666d]",
      },
    },
  ];

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-36 rounded-xl bg-surface-2/40 border border-border animate-pulse"
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
            className={`text-left p-4.5 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between gap-4 ${
              isSelected
                ? "bg-surface-0 border-brand-500 ring-2 ring-brand-500/20 shadow-sm"
                : "bg-surface-0 border-border hover:border-brand-200 hover:bg-surface-2/50"
            }`}
          >
            {/* Visual Mini Preview Tile */}
            <div
              className={`w-full h-16 rounded-lg ${t.preview.bg} p-2 flex flex-col justify-between border ${
                isSelected ? "border-brand-200/50" : "border-border/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`h-2.5 w-12 rounded-full ${t.preview.text}`} />
                <div className={`h-2.5 w-6 rounded-full ${t.preview.accent}`} />
              </div>
              <div
                className={`w-full h-6 rounded-md ${t.preview.card} border p-1 flex items-center gap-1.5`}
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
                    className={`h-4 w-4 ${
                      isSelected ? "text-brand-500" : "text-text-secondary"
                    }`}
                  />
                  <h4 className="text-xs font-bold text-text-primary font-sans">
                    {t.label}
                  </h4>
                </div>

                {isSelected && (
                  <CheckCircle2 className="h-4 w-4 text-brand-500 shrink-0" />
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
