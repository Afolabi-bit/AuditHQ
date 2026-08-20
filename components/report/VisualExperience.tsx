"use client";

import React, { useState } from "react";
import { Maximize2, Film, Clock, X } from "lucide-react";
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
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2 font-sans">
            <Film className="h-4 w-4 text-brand-500" />
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
            className="text-xs font-semibold text-text-primary bg-surface-0 hover:bg-surface-2 border-border rounded-md h-8 px-3 cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5 mr-1.5 text-text-tertiary" />
            Full Render View
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5 w-full min-w-0">
        {/* Filmstrip Reel */}
        {filmstrip.length > 0 && (
          <div
            className={`bg-surface-0 border border-border rounded-xl p-5 shadow-xs min-w-0 overflow-hidden ${
              fullPageScreenshot ? "lg:col-span-8" : "lg:col-span-12"
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-text-primary">
                <Clock className="h-3.5 w-3.5 text-brand-500" />
                Time-Lapse Capture
              </span>
              <span className="text-text-tertiary">
                {filmstrip.length} sequential frames
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {filmstrip.map((frame, index) => (
                <div
                  key={index}
                  className="shrink-0 flex flex-col items-center space-y-1.5 group"
                >
                  <div className="w-28 h-20 bg-surface-1 rounded-lg border border-border overflow-hidden group-hover:border-brand-200 transition-all">
                    <img
                      src={frame.data}
                      alt={`Frame captured at ${(frame.timing / 1000).toFixed(1)}s`}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-text-secondary px-2 py-0.5 rounded-md bg-surface-1 border border-border">
                    {(frame.timing / 1000).toFixed(1)} s
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Page Screenshot Thumbnail */}
        {fullPageScreenshot && (
          <div
            className={`bg-surface-0 border border-border rounded-xl p-5 shadow-xs min-w-0 overflow-hidden ${
              filmstrip.length > 0 ? "lg:col-span-4" : "lg:col-span-12"
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="font-bold text-text-primary">Full Page Render</span>
              <button
                onClick={() => setLightboxOpen(true)}
                className="text-[11px] text-brand-500 hover:underline cursor-pointer font-sans font-semibold"
              >
                Expand
              </button>
            </div>

            <div
              onClick={() => setLightboxOpen(true)}
              className="h-28 bg-surface-1 rounded-lg border border-border overflow-hidden cursor-pointer group relative"
            >
              <img
                src={fullPageScreenshot}
                alt="Full Page Screenshot"
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
            className="bg-surface-0 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto p-4 shadow-2xl border border-border space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h4 className="text-sm font-bold text-text-primary font-sans">Full Page Screenshot</h4>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-2 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-lg overflow-hidden border border-border">
              <img
                src={fullPageScreenshot}
                alt="Full Page Screenshot Full Resolution"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
