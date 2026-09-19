"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { Lightning, ArrowRight } from "@phosphor-icons/react";
import { EASING } from "./landing-data";

export default function LandingHero() {
  return (
    <section
      aria-label="Hero"
      style={{ paddingTop: "148px", paddingBottom: "96px", textAlign: "center", background: "#000000" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Status badge */}
        <div
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "9999px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", marginBottom: "32px", fontSize: "12px", fontFamily: "var(--font-mono), monospace", color: "rgba(255,255,255,0.55)" }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block", flexShrink: 0 }} />
          Cloud runner active
          <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
          Chromium 128
          <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
          Lighthouse 12.0
        </div>

        {/* Headline */}
        <h1
          style={{ fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.035em", maxWidth: "680px", margin: "0 auto 24px", textWrap: "balance", background: "linear-gradient(90deg, #FFFFFF 0%, #9B9B9B 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          Cloud Lighthouse audits that match what your users see
        </h1>

        {/* Subheadline */}
        <p style={{ fontSize: "18px", lineHeight: "28px", color: "rgba(255,255,255,0.50)", maxWidth: "560px", margin: "0 auto 40px", textWrap: "pretty" }}>
          Your dev laptop masks real mobile latency, CPU throttling, and cold caches. AuditHQ runs
          deterministic Lighthouse 12.0 audits in isolated cloud containers, so your scores mean something.
        </p>

        {/* CTA */}
        <div style={{ marginBottom: "64px" }}>
          <RegisterLink
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: 600, color: "#ffffff", background: "#2563eb", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", transition: `all 700ms ${EASING}`, outline: "none" }}
            onFocus={(e) => ((e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 0 3px rgba(37,99,235,0.55)")}
            onBlur={(e) => ((e.currentTarget as HTMLAnchorElement).style.boxShadow = "none")}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "#1d4ed8"; el.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "#2563eb"; el.style.transform = "translateY(0)"; }}
            onMouseDown={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.97)")}
            onMouseUp={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)")}
          >
            <Lightning weight="fill" style={{ width: "16px", height: "16px" }} />
            Run free cloud audit
            <ArrowRight weight="bold" style={{ width: "16px", height: "16px" }} />
          </RegisterLink>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.07)", marginBottom: "64px" }}>
          {[
            { value: "100", label: "free audits per month" },
            { value: "23s", label: "median audit duration" },
            { value: "4G Fast", label: "deterministic throttle" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", lineHeight: 1, fontFamily: "var(--font-mono), monospace" }}>{stat.value}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "6px" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Console mockup */}
        <div className="reveal-section" style={{ maxWidth: "820px", margin: "0 auto", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", background: "#181818", overflow: "hidden", textAlign: "left" }}>
          {/* Topbar */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1F1F1F", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "inline-block" }} />
              ))}
              <span style={{ marginLeft: "8px", fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "rgba(255,255,255,0.32)" }}>
                target: https://production.app
              </span>
            </div>
            <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontFamily: "var(--font-mono), monospace", background: "rgba(16,185,129,0.10)", color: "#10b981", border: "1px solid rgba(16,185,129,0.22)", fontWeight: 600 }}>
              Score 97/100
            </span>
          </div>

          {/* CWV grid */}
          <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[
              { label: "LCP", value: "0.8s", spec: "≤ 2.5s" },
              { label: "TBT", value: "0ms", spec: "≤ 200ms" },
              { label: "CLS", value: "0.00", spec: "≤ 0.10" },
              { label: "FCP", value: "0.4s", spec: "≤ 1.8s" },
            ].map((m) => (
              <div key={m.label} style={{ padding: "12px", borderRadius: "10px", background: "#272727", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-mono), monospace", marginBottom: "4px" }}>{m.label}</p>
                <p style={{ fontSize: "22px", fontWeight: 700, color: "#10b981", lineHeight: 1, fontFamily: "var(--font-mono), monospace" }}>{m.value}</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", marginTop: "4px", fontFamily: "var(--font-mono), monospace" }}>Spec {m.spec}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "#1F1F1F", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "rgba(255,255,255,0.28)" }}>Main thread quiet: 820ms</span>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "rgba(255,255,255,0.28)" }}>Payload: 412 KB uncompressed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
