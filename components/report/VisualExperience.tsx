"use client";

import React, { useState } from "react";
import { ArrowsOut, FilmStrip, Clock, X } from "@phosphor-icons/react";
import { Button } from "../ui/button";

interface VisualExperienceProps {
  filmstrip: Array<{
    timing: number;
    timestamp: number;
    data: string;
  }>;
  fullPageScreenshot: string | null;
  url: string;
}

export const VisualExperience: React.FC<VisualExperienceProps> = ({
  filmstrip,
  fullPageScreenshot,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!fullPageScreenshot && filmstrip.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
            <FilmStrip weight="bold" className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            Visual Rendering Progression
          </h3>
          <p className="text-xs text-text-secondary">
            Sequential frame captures documenting perceived render progression
          </p>
        </div>

        {fullPageScreenshot && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLightboxOpen(true)}
            className="text-xs font-semibold text-text-primary bg-surface-0 hover:bg-surface-1 border-border rounded-xl h-9 px-3.5 cursor-pointer shadow-2xs"
          >
            <ArrowsOut weight="bold" className="h-3.5 w-3.5 mr-1.5 text-text-tertiary" />
            Full Render View
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full min-w-0">
        {/* Filmstrip Reel */}
        {filmstrip.length > 0 && (
          <div
            className={`bg-surface-0 border border-border rounded-2xl p-5 sm:p-6 shadow-xs min-w-0 overflow-hidden ${
              fullPageScreenshot ? "lg:col-span-8" : "lg:col-span-12"
            }`}
          >
            <div className="flex items-center justify-between mb-4 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-text-primary">
                <Clock weight="bold" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                Time-Lapse Capture
              </span>
              <span className="text-text-tertiary">
                {filmstrip.length} frames
              </span>
            </div>

            <div className="flex items-center gap-3.5 overflow-x-auto pb-3">
              {filmstrip.map((frame, index) => (
                <div
                  key={index}
                  className="shrink-0 flex flex-col items-center space-y-2 group"
                >
                  <div className="w-32 h-22 bg-surface-1 rounded-xl border border-border overflow-hidden group-hover:border-brand-300 dark:group-hover:border-brand-500/40 transition-all shadow-2xs">
                    <img
                      src={frame.data}
                      alt={`Frame at ${(frame.timing / 1000).toFixed(1)}s`}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-mono font-semibold text-text-secondary px-2.5 py-0.5 rounded-full bg-surface-1 border border-border">
                    {(frame.timing / 1000).toFixed(1)}s
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Page Screenshot Thumbnail */}
        {fullPageScreenshot && (
          <div
            className={`bg-surface-0 border border-border rounded-2xl p-5 sm:p-6 shadow-xs min-w-0 overflow-hidden ${
              filmstrip.length > 0 ? "lg:col-span-4" : "lg:col-span-12"
            }`}
          >
            <div className="flex items-center justify-between mb-4 text-xs">
              <span className="font-semibold text-text-primary">Full Page Render</span>
              <button
                onClick={() => setLightboxOpen(true)}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline cursor-pointer font-semibold"
              >
                Expand
              </button>
            </div>

            <div
              onClick={() => setLightboxOpen(true)}
              className="h-32 bg-surface-1 rounded-xl border border-border overflow-hidden cursor-pointer group relative shadow-2xs"
            >
              <img
                src={fullPageScreenshot}
                alt="Full Page Screenshot Preview"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && fullPageScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="bg-surface-0 rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl border border-border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h4 className="text-sm font-bold text-text-primary">Full Page Screenshot</h4>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-1 cursor-pointer"
              >
                <X weight="bold" className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src={fullPageScreenshot}
                alt="Full Page Screenshot"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
