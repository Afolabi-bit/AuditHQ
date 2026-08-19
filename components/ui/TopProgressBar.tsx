"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When pathname changes, finish loading
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (
        anchor &&
        anchor.href &&
        anchor.target !== "_blank" &&
        !anchor.hasAttribute("download") &&
        anchor.origin === window.location.origin
      ) {
        const url = new URL(anchor.href);
        // If clicking a link to a different path
        if (url.pathname !== window.location.pathname) {
          setLoading(true);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 h-[2.5px] bg-transparent pointer-events-none overflow-hidden">
      <div className="h-full bg-[#635bff] shadow-[0_0_8px_#635bff] animate-[progress_1.2s_ease-in-out_infinite]" />
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 70%;
            margin-left: 15%;
          }
          100% {
            width: 100%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
