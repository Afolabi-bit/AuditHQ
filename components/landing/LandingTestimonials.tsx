import { TESTIMONIALS } from "./landing-data";

export default function LandingTestimonials() {
  return (
    <section
      aria-label="Testimonials"
      style={{ padding: "96px 0", background: "#0A0A0A" }}
    >
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
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
            WHAT PEOPLE SAY
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
            From the teams using it every day
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="reveal-section"
              style={{
                padding: "32px",
                borderRadius: "16px",
                background: "#181818",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "24px",
                  color: "rgba(255,255,255,0.68)",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
