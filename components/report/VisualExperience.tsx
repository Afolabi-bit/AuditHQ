"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Maximize2, X, Film, Clock, Eye } from "lucide-react";
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
  url,
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
            <Film className="h-4 w-4 text-brand-600" />
            Visual Rendering Progression
          </h3>
          <p className="text-xs text-text-secondary">
            High-speed frame captures documenting perceived render progression and visual stability
          </p>
        </div>

        {fullPageScreenshot && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLightboxOpen(true)}
            className="text-xs font-semibold text-text-primary bg-surface-0 hover:bg-surface-1 border-surface-3 rounded-xl h-8 px-3"
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
            className={`bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs min-w-0 overflow-hidden ${
              fullPageScreenshot ? "lg:col-span-8" : "lg:col-span-12"
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-text-primary">
                <Clock className="h-3.5 w-3.5 text-brand-600" />
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
                  <div className="w-28 h-20 bg-surface-1 rounded-xl border border-surface-3 overflow-hidden shadow-2xs group-hover:border-brand-400 group-hover:shadow-sm transition-all">
                    <img
                      src={frame.data}
                      alt={`Frame captured at ${(frame.timing / 1000).toFixed(1)}s`}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-text-secondary px-2 py-0.5 rounded-md bg-surface-1 border border-surface-3">
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
            className={`bg-surface-0 border border-surface-3 rounded-2xl p-5 shadow-xs min-w-0 overflow-hidden ${
              filmstrip.length > 0 ? "lg:col-span-4" : "lg:col-span-12"
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-text-primary">
                <ImageIcon className="h-3.5 w-3.5 text-brand-600" />
                Viewport Snapshot
              </span>
              <button
                onClick={() => setLightboxOpen(true)}
                className="text-brand-600 hover:underline text-[11px] font-semibold cursor-pointer"
              >
                Expand View
              </button>
            </div>

            <div
              onClick={() => setLightboxOpen(true)}
              className="relative h-24 bg-surface-1 rounded-xl border border-surface-3 overflow-hidden group cursor-pointer"
            >
              <img
                src={fullPageScreenshot}
                alt={`Rendered screenshot of ${url}`}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-2xs">
                <Maximize2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && fullPageScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-surface-0 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-surface-3 w-full">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-3 bg-surface-1">
              <h4 className="text-sm font-bold text-text-primary truncate font-mono">
                Full Page Render · {url}
              </h4>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-60px)]">
              <img
                src={fullPageScreenshot}
                alt={`Full screenshot of ${url}`}
                className="w-full h-auto rounded-xl border border-surface-3 shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
