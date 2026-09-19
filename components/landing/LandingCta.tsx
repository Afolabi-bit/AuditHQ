"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { ArrowRight } from "@phosphor-icons/react";
import { EASING } from "./landing-data";

export default function LandingCta() {
  return (
    <section
      aria-label="Get started"
      style={{ padding: "96px 0", background: "#0A0A0A" }}
    >
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
      >
        <div
          className="reveal-section"
          style={{
            borderRadius: "24px",
            background: "#181818",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontFamily: "var(--font-mono), monospace",
              color: "#3b82f6",
              marginBottom: "24px",
              fontWeight: 600,
              letterSpacing: "0.08em",
            }}
          >
            GET STARTED
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4.5vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: "560px",
              margin: "0 auto 16px",
              textWrap: "balance",
              background:
                "linear-gradient(90deg, #FFFFFF 0%, #9B9B9B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Stop auditing on a laptop. Start measuring reality.
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              color: "rgba(255,255,255,0.42)",
              maxWidth: "400px",
              margin: "0 auto 40px",
              textWrap: "pretty",
            }}
          >
            100 free audits per month. No credit card required. Your first
            result in 23 seconds.
          </p>
          <RegisterLink
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#ffffff",
              background: "#2563eb",
              padding: "12px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              transition: `all 700ms ${EASING}`,
              marginBottom: "24px",
              outline: "none",
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 0 3px rgba(37,99,235,0.55)")
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "none")
            }
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#1d4ed8";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#2563eb";
              el.style.transform = "translateY(0)";
            }}
            onMouseDown={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(0.97)")
            }
            onMouseUp={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-1px)")
            }
          >
            Start auditing free
            <ArrowRight
              weight="bold"
              style={{ width: "16px", height: "16px" }}
            />
          </RegisterLink>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              fontSize: "12px",
              color: "rgba(255,255,255,0.30)",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            <span>100 free audits monthly</span>
            <span style={{ color: "rgba(255,255,255,0.14)" }}>·</span>
            <span>No credit card</span>
            <span style={{ color: "rgba(255,255,255,0.14)" }}>·</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
