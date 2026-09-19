"use client";

import { useEffect, useRef } from "react";
import { TAGLINE } from "./landing-data";

export default function LandingTagline() {
  const taglineRef = useRef<HTMLDivElement>(null);
  const taglineWords = TAGLINE.split(" ");

  useEffect(() => {
    if (!taglineRef.current) return;
    const words = Array.from(
      taglineRef.current.querySelectorAll<HTMLSpanElement>(".tagline-word")
    );
    let rafId: number | null = null;

    const activateVisible = () => {
      const triggerY = window.innerHeight * 0.82;
      let delay = 0;
      words.forEach((word) => {
        if (word.dataset.active === "true") return;
        const rect = word.getBoundingClientRect();
        if (rect.top < triggerY) {
          const d = delay;
          setTimeout(() => {
            word.dataset.active = "true";
          }, d);
          delay += 52;
        }
      });
      rafId = null;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(activateVisible);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    activateVisible();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      aria-label="Core message"
      style={{ padding: "96px 0", background: "#000000" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div ref={taglineRef} style={{ maxWidth: "760px" }}>
          <p
            style={{
              fontSize: "12px",
              fontFamily: "var(--font-mono), monospace",
              color: "rgba(255,255,255,0.28)",
              marginBottom: "32px",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            WHY IT MATTERS
          </p>
          <div
            style={{
              fontSize: "clamp(28px, 4.5vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.22,
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}
          >
            {taglineWords.map((word, i) => (
              <span key={i} className="tagline-word">
                {word}{" "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
