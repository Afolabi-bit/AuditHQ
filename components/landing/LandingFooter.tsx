"use client";

import { Lightning } from "@phosphor-icons/react";
import { EASING } from "./landing-data";

export default function LandingFooter() {
  return (
    <footer
      style={{
        background: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "48px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "6px",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lightning
              weight="fill"
              style={{ width: "12px", height: "12px", color: "#ffffff" }}
            />
          </div>
          <span
            style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}
          >
            AuditHQ
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
          <span
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.30)",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            Web Performance Telemetry
          </span>
        </div>

        {/* Footer nav */}
        <nav aria-label="Footer navigation">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Privacy policy", href: "/privacy" },
              { label: "Terms of service", href: "/terms" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.32)",
                  textDecoration: "none",
                  transition: `color 700ms ${EASING}`,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.70)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.32)")
                }
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.70)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.32)")
                }
              >
                {link.label}
              </a>
            ))}
            <span
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.18)",
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              © {new Date().getFullYear()} AuditHQ
            </span>
          </div>
        </nav>
      </div>
    </footer>
  );
}
