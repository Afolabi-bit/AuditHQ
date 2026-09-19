import { STEPS } from "./landing-data";

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-label="How it works"
      style={{ padding: "96px 0", background: "#000000" }}
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
            HOW IT WORKS
          </p>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 700,
              lineHeight: "40px",
              letterSpacing: "-0.025em",
              maxWidth: "480px",
              textWrap: "balance",
            }}
          >
            From URL to audit report in three steps
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="reveal-section"
              style={{
                padding: "32px",
                borderRadius: "16px",
                background: "#181818",
                border: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  insetInlineEnd: "20px",
                  fontSize: "56px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.035)",
                  fontFamily: "var(--font-mono), monospace",
                  lineHeight: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
                aria-hidden="true"
              >
                {step.num}
              </span>
              <p
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-mono), monospace",
                  color: "#3b82f6",
                  marginBottom: "16px",
                  fontWeight: 600,
                }}
              >
                STEP {step.num}
              </p>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: "28px",
                  marginBottom: "12px",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "rgba(255,255,255,0.48)",
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
