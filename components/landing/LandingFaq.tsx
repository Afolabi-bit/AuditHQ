"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { FAQS, EASING } from "./landing-data";

export default function LandingFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      style={{ padding: "96px 0", background: "#000000" }}
    >
      <div
        style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}
      >
        <div
          className="reveal-section"
          style={{ marginBottom: "64px", textAlign: "center" }}
        >
          <p
            style={{
              fontSize: "12px",
              fontFamily: "var(--font-mono), monospace",
              color: "#3b82f6",
              marginBottom: "16px",
              fontWeight: 600,
              letterSpacing: "0.08em",
            }}
          >
            FAQ
          </p>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 700,
              lineHeight: "40px",
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}
          >
            Questions before you start
          </h2>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="reveal-section"
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#181818",
                overflow: "hidden",
                outline: "none",
              }}
            >
              <button
                aria-expanded={openFaq === i}
                aria-controls={`faq-answer-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "start",
                  gap: "16px",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onBlur={(e) => (e.currentTarget.style.background = "none")}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#ffffff",
                    lineHeight: "24px",
                    textAlign: "start",
                  }}
                >
                  {faq.q}
                </span>
                <CaretDown
                  weight="bold"
                  style={{
                    width: "16px",
                    height: "16px",
                    color: "rgba(255,255,255,0.38)",
                    flexShrink: 0,
                    transform:
                      openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: `transform 700ms ${EASING}`,
                  }}
                />
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                style={{
                  maxHeight: openFaq === i ? "400px" : "0px",
                  overflow: "hidden",
                  transition: `max-height 700ms ${EASING}`,
                }}
              >
                <p
                  style={{
                    padding: "0 24px 20px",
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "rgba(255,255,255,0.50)",
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
