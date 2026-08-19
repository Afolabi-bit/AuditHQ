"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Image as ImageIcon, Maximize2, X, Film, Clock } from "lucide-react";
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
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Film className="h-5 w-5 text-blue-600" />
            Visual Experience & Filmstrip
          </h3>
          <p className="text-xs text-slate-500">
            How the page visibly renders from the user's perspective over time
          </p>
        </div>

        {fullPageScreenshot && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLightboxOpen(true)}
            className="text-xs text-slate-700 bg-white hover:bg-slate-50"
          >
            <Maximize2 className="h-3.5 w-3.5 mr-1.5" />
            View Full Screenshot
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Filmstrip Carousel */}
        {filmstrip.length > 0 && (
          <Card
            className={`border-slate-200 shadow-xs ${fullPageScreenshot ? "lg:col-span-8" : "lg:col-span-12"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  Loading Progression Timeline
                </span>
                <span className="text-slate-400">
                  {filmstrip.length} frames captured
                </span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                {filmstrip.map((frame, index) => (
                  <div
                    key={index}
                    className="shrink-0 flex flex-col items-center space-y-1.5"
                  >
                    <div className="w-28 h-20 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden shadow-2xs hover:border-blue-400 transition-colors">
                      <img
                        src={frame.data}
                        alt={`Frame at ${(frame.timing / 1000).toFixed(1)}s`}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 px-1.5 py-0.5 rounded-sm bg-slate-100">
                      {(frame.timing / 1000).toFixed(1)} s
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Page Screenshot Thumbnail */}
        {fullPageScreenshot && (
          <Card
            className={`border-slate-200 shadow-xs ${filmstrip.length > 0 ? "lg:col-span-4" : "lg:col-span-12"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                  Rendered Page View
                </span>
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="text-blue-600 hover:underline text-[11px] font-medium"
                >
                  Expand
                </button>
              </div>

              <div
                onClick={() => setLightboxOpen(true)}
                className="relative h-28 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden group cursor-pointer"
              >
                <img
                  src={fullPageScreenshot}
                  alt={`Rendered screenshot of ${url}`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Maximize2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && fullPageScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                Full Page Render: {url}
              </h4>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-60px)]">
              <img
                src={fullPageScreenshot}
                alt={`Full screenshot of ${url}`}
                className="w-full h-auto rounded-lg border border-slate-200"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
