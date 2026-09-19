export default function LandingProblem() {
  const comparisons = [
    {
      before:
        "Your scores vary by 12+ points between team members running the same audit locally.",
      after:
        "Standardized container, pinned CPU quota, and fixed Chromium version. Same score, every time.",
    },
    {
      before:
        "Audit history is lost the moment you close the DevTools tab.",
      after:
        "Every run is stored. Track trajectory across weeks and catch regressions the moment they appear.",
    },
    {
      before:
        "Sharing results means exporting screenshots or writing up findings manually.",
      after:
        "Permanent public URLs and vector PDF exports. One click, ready to send.",
    },
  ];

  return (
    <section
      id="problem"
      aria-label="Problem and solution"
      style={{ background: "#0A0A0A", padding: "96px 0" }}
    >
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
      >
        <div
          className="reveal-section"
          style={{ maxWidth: "600px", marginBottom: "64px" }}
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
            THE PROBLEM
          </p>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 700,
              lineHeight: "40px",
              letterSpacing: "-0.025em",
              marginBottom: "16px",
              textWrap: "balance",
            }}
          >
            Your laptop gives you false confidence
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              color: "rgba(255,255,255,0.50)",
            }}
          >
            Local DevTools results are shaped by your hardware, your browser
            extensions, and your office wifi. None of that is what your
            users experience.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {comparisons.map((item, i) => (
            <div
              key={i}
              className="reveal-section"
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "24px", background: "#181818" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "11px",
                    fontFamily: "var(--font-mono), monospace",
                    color: "rgba(239,68,68,0.85)",
                    background: "rgba(239,68,68,0.07)",
                    border: "1px solid rgba(239,68,68,0.14)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  Without AuditHQ
                </span>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {item.before}
                </p>
              </div>
              <div style={{ padding: "24px", background: "#1F1F1F" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "11px",
                    fontFamily: "var(--font-mono), monospace",
                    color: "#10b981",
                    background: "rgba(16,185,129,0.07)",
                    border: "1px solid rgba(16,185,129,0.18)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  With AuditHQ
                </span>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {item.after}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
