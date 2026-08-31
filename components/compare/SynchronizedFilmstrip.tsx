"use client";

import React, { useState } from "react";
import { FilmStrip, Eye, Clock, ArrowsOut, X, Globe } from "@phosphor-icons/react";
import { SynchronizedFrame } from "@/lib/comparison/types";

interface SynchronizedFilmstripProps {
  frames: SynchronizedFrame[];
  baseUrl: string;
  targetUrl: string;
}

export const SynchronizedFilmstrip: React.FC<SynchronizedFilmstripProps> = ({
  frames,
  baseUrl,
  targetUrl,
}) => {
  const [selectedFrame, setSelectedFrame] = useState<{
    timestampMs: number;
    baseFrame: string | null;
    targetFrame: string | null;
  } | null>(null);

  if (!frames || frames.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2.5">
            <FilmStrip weight="bold" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            Synchronized Visual Progression (Filmstrip Diff)
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Side-by-side perceptual timeline comparing rendering progression at identical timestamp intervals
          </p>
        </div>

        <span className="text-xs font-mono text-text-tertiary bg-surface-1 px-3 py-1 rounded-lg border border-border shadow-2xs">
          500ms Interpolation Interval
        </span>
      </div>

      <div className="bg-surface-0 border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 overflow-hidden">
        {/* Filmstrip Horizontal Scroller */}
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border">
          <div className="inline-flex flex-col gap-4 min-w-max">
            {/* Timeline Timestamp Markers */}
            <div className="flex gap-3 pl-32">
              {frames.map((f) => (
                <div
                  key={f.timestampMs}
                  className="w-40 sm:w-44 text-center text-xs font-mono font-bold text-text-tertiary border-b border-border pb-1.5 flex items-center justify-center gap-1"
                >
                  <Clock weight="bold" className="h-3 w-3" />
                  {f.timestampMs === 0 ? "0.0s (Start)" : `${(f.timestampMs / 1000).toFixed(1)}s`}
                </div>
              ))}
            </div>

            {/* Row 1: Base Run */}
            <div className="flex items-center gap-3">
              <div className="w-28 sm:w-32 shrink-0 space-y-0.5 pr-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-2 text-text-secondary border border-border inline-block">
                  Base Run
                </span>
                <p className="text-xs font-mono text-text-primary truncate" title={baseUrl}>
                  {baseUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>

              {frames.map((f) => (
                <div
                  key={`base-${f.timestampMs}`}
                  onClick={() => setSelectedFrame(f)}
                  className="w-40 sm:w-44 h-24 sm:h-28 bg-surface-1 rounded-lg border border-border overflow-hidden relative group cursor-pointer hover:border-brand-500 dark:hover:border-brand-500/40 transition-all shrink-0 shadow-2xs flex items-center justify-center"
                >
                  {f.baseFrame ? (
                    <img
                      src={f.baseFrame}
                      alt={`Base render at ${f.timestampMs}ms`}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="text-[10px] text-text-tertiary font-mono text-center p-2">
                      Blank Canvas
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                    <ArrowsOut weight="bold" className="h-3.5 w-3.5" />
                    <span>Enlarge</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Target Run */}
            <div className="flex items-center gap-3">
              <div className="w-28 sm:w-32 shrink-0 space-y-0.5 pr-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 inline-block">
                  Target Run
                </span>
                <p className="text-xs font-mono text-text-primary truncate" title={targetUrl}>
                  {targetUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>

              {frames.map((f) => (
                <div
                  key={`target-${f.timestampMs}`}
                  onClick={() => setSelectedFrame(f)}
                  className="w-40 sm:w-44 h-24 sm:h-28 bg-surface-1 rounded-lg border border-border overflow-hidden relative group cursor-pointer hover:border-brand-500 dark:hover:border-brand-500/40 transition-all shrink-0 shadow-2xs flex items-center justify-center"
                >
                  {f.targetFrame ? (
                    <img
                      src={f.targetFrame}
                      alt={`Target render at ${f.timestampMs}ms`}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="text-[10px] text-text-tertiary font-mono text-center p-2">
                      Blank Canvas
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                    <ArrowsOut weight="bold" className="h-3.5 w-3.5" />
                    <span>Enlarge</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-text-tertiary font-mono text-center sm:text-left flex items-center gap-1.5 pt-2 border-t border-border/60">
          <Eye weight="bold" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
          Click any frame to inspect the high-resolution rendering difference side-by-side.
        </p>
      </div>

      {/* Enlarged Side-by-Side Modal */}
      {selectedFrame && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedFrame(null)}
        >
          <div
            className="bg-surface-0 border border-border rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Clock weight="bold" className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  Visual Comparison at {(selectedFrame.timestampMs / 1000).toFixed(1)}s ({selectedFrame.timestampMs}ms)
                </h3>
                <p className="text-xs text-text-secondary">
                  Side-by-side viewport render comparison
                </p>
              </div>

              <button
                onClick={() => setSelectedFrame(null)}
                className="h-8 w-8 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X weight="bold" className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Base Frame Modal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-surface-2 text-text-secondary border border-border">
                    Base Run Baseline
                  </span>
                  <span className="text-xs font-mono text-text-tertiary">
                    {(selectedFrame.timestampMs / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="aspect-video bg-surface-1 rounded-xl border border-border overflow-hidden flex items-center justify-center">
                  {selectedFrame.baseFrame ? (
                    <img
                      src={selectedFrame.baseFrame}
                      alt="Base enlarged frame"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <p className="text-xs font-mono text-text-tertiary">No render data captured</p>
                  )}
                </div>
              </div>

              {/* Target Frame Modal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
                    Target Run Comparison
                  </span>
                  <span className="text-xs font-mono text-text-tertiary">
                    {(selectedFrame.timestampMs / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="aspect-video bg-surface-1 rounded-xl border border-border overflow-hidden flex items-center justify-center">
                  {selectedFrame.targetFrame ? (
                    <img
                      src={selectedFrame.targetFrame}
                      alt="Target enlarged frame"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <p className="text-xs font-mono text-text-tertiary">No render data captured</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

