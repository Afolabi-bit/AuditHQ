"use client";

import { BENEFITS, EASING } from "./landing-data";

export default function LandingBenefits() {
  return (
    <section
      id="capabilities"
      aria-label="Capabilities"
      style={{ padding: "96px 0", background: "#0A0A0A" }}
    >
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
      >
        <div className="reveal-section" style={{ marginBottom: "64px" }}>
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
            CAPABILITIES
          </p>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 700,
              lineHeight: "40px",
              letterSpacing: "-0.025em",
              maxWidth: "520px",
              textWrap: "balance",
            }}
          >
            Precision instrumentation for engineering teams
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {BENEFITS.map(({ Icon, title, body }, i) => (
            <div
              key={i}
              className="reveal-section"
              style={{
                padding: "32px",
                borderRadius: "16px",
                background: "#181818",
                border: "1px solid rgba(255,255,255,0.06)",
                transition: `border-color 700ms ${EASING}, transform 700ms ${EASING}`,
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(37,99,235,0.32)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(37,99,235,0.10)",
                  border: "1px solid rgba(37,99,235,0.20)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <Icon
                  weight="bold"
                  style={{
                    width: "18px",
                    height: "18px",
                    color: "#60a5fa",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "24px",
                  marginBottom: "8px",
                  textWrap: "balance",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "rgba(255,255,255,0.48)",
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
