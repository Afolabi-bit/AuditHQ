"use client";

import React, { useState, useEffect } from "react";
import {
  Gauge,
  Pulse,
  Cpu,
  FilmStrip,
  Stack,
  CaretRight,
} from "@phosphor-icons/react";

interface SectionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const sections: SectionItem[] = [
  {
    id: "executive-scorecard",
    label: "Scorecard",
    icon: <Gauge weight="bold" className="h-4 w-4" />,
  },
  {
    id: "core-web-vitals",
    label: "Web Vitals",
    icon: <Pulse weight="bold" className="h-4 w-4" />,
  },
  {
    id: "ai-diagnostics",
    label: "Diagnostics",
    icon: <Cpu weight="fill" className="h-4 w-4" />,
  },
  {
    id: "visual-experience",
    label: "Filmstrip",
    icon: <FilmStrip weight="bold" className="h-4 w-4" />,
  },
  {
    id: "report-tabs",
    label: "Deep Dive",
    icon: <Stack weight="bold" className="h-4 w-4" />,
  },
];

export const ReportJumpRail: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("executive-scorecard");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop Sticky Sidebar (Left Anchor Rail) */}
      <aside className="hidden xl:block w-56 shrink-0">
        <div className="sticky top-24 space-y-3 bg-surface-0 border border-border rounded-2xl p-3.5 shadow-xs">
          <div className="px-3 py-1.5 border-b border-border/70">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
              Report Sections
            </p>
          </div>

          <nav className="space-y-1">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-500/30 shadow-2xs"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-1"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? "text-brand-600 dark:text-brand-400" : "text-text-tertiary"}>
                      {sec.icon}
                    </span>
                    <span>{sec.label}</span>
                  </div>
                  {isActive && <CaretRight weight="bold" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile/Tablet Sticky Horizontal Anchor Pill Bar */}
      <div className="xl:hidden sticky top-16 z-30 bg-surface-0/95 backdrop-blur-md border-b border-border py-2 px-4 -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-auto shadow-2xs">
        <div className="flex items-center gap-1.5 min-w-max">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-surface-1 text-text-secondary hover:text-text-primary border border-border"
                }`}
              >
                {sec.icon}
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

