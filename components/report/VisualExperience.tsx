"use client";

import React, { useState } from "react";
import { Maximize2, Film, Clock } from "lucide-react";
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
          <h3 className="text-base font-bold text-[#0a2540] flex items-center gap-2 font-sans">
            <Film className="h-4 w-4 text-[#635bff]" />
            Visual Rendering Progression
          </h3>
          <p className="text-xs text-[#425466]">
            Sequential frame captures documenting perceived render progression
          </p>
        </div>

        {fullPageScreenshot && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLightboxOpen(true)}
            className="text-xs font-semibold text-[#0a2540] bg-white hover:bg-[#f8fafc] border-[#e3e8ee] rounded-md h-8 px-3 cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5 mr-1.5 text-[#8898aa]" />
            Full Render View
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5 w-full min-w-0">
        {/* Filmstrip Reel */}
        {filmstrip.length > 0 && (
          <div
            className={`bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] min-w-0 overflow-hidden ${
              fullPageScreenshot ? "lg:col-span-8" : "lg:col-span-12"
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-[#0a2540]">
                <Clock className="h-3.5 w-3.5 text-[#635bff]" />
                Time-Lapse Capture
              </span>
              <span className="text-[#8898aa]">
                {filmstrip.length} sequential frames
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {filmstrip.map((frame, index) => (
                <div
                  key={index}
                  className="shrink-0 flex flex-col items-center space-y-1.5 group"
                >
                  <div className="w-28 h-20 bg-[#f8fafc] rounded-lg border border-[#e3e8ee] overflow-hidden group-hover:border-brand-200 transition-all">
                    <img
                      src={frame.data}
                      alt={`Frame captured at ${(frame.timing / 1000).toFixed(1)}s`}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#425466] px-2 py-0.5 rounded-md bg-[#f8fafc] border border-[#e3e8ee]">
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
            className={`bg-white border border-[#e3e8ee] rounded-xl p-5 shadow-[0_1px_3px_rgba(50,50,93,0.08)] min-w-0 overflow-hidden ${
              filmstrip.length > 0 ? "lg:col-span-4" : "lg:col-span-12"
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="font-bold text-[#0a2540]">Full Page Render</span>
              <button
                onClick={() => setLightboxOpen(true)}
                className="text-[11px] text-[#635bff] hover:underline cursor-pointer"
              >
                Expand
              </button>
            </div>

            <div
              onClick={() => setLightboxOpen(true)}
              className="h-28 bg-[#f8fafc] rounded-lg border border-[#e3e8ee] overflow-hidden cursor-pointer group relative"
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto p-4 shadow-2xl border border-[#e3e8ee] space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#e3e8ee] pb-3">
              <h4 className="text-sm font-bold text-[#0a2540] font-sans">Full Page Screenshot</h4>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-1 rounded-md text-[#8898aa] hover:text-[#0a2540] hover:bg-[#f8fafc] cursor-pointer"
              >
                Close
              </button>
            </div>
            <img
              src={fullPageScreenshot}
              alt="Full Page Screenshot"
              className="w-full h-auto rounded-lg border border-[#e3e8ee]"
            />
          </div>
        </div>
      )}
    </section>
  );
};
