"use client";

import { useState, useEffect, useRef } from "react";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import {
  Lightning,
  ArrowRight,
  ArrowsLeftRight,
  Code,
  LinkSimple,
  FileText,
  DeviceMobile,
  Clock,
  CaretDown,
} from "@phosphor-icons/react";

const EASING = "cubic-bezier(0.32,0.72,0,1)";

const NAV_LINKS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const BENEFITS = [
  {
    Icon: ArrowsLeftRight,
    title: "Reproducible scores, run after run",
    body: "Same container, same throttle profile, same Chromium build. Your performance score stops depending on who ran it and when.",
  },
  {
    Icon: Code,
    title: "Catch regressions before they reach users",
    body: "Trigger an audit against your staging branch in 23 seconds. Get a score delta before the pull request merges.",
  },
  {
    Icon: LinkSimple,
    title: "Share results without screenshots",
    body: "Every audit generates a permanent public URL. Send the link. Recipients see the full report, no account required.",
  },
  {
    Icon: FileText,
    title: "Export when your client needs a document",
    body: "Generate a vector PDF with score dials, metric tables, and a remediation roadmap. Ready to send in one click.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Paste your URL",
    body: "Enter any publicly accessible URL — staging, production, or a specific page path.",
  },
  {
    num: "02",
    title: "Cloud runs the audit",
    body: "An isolated Chromium container boots, applies deterministic 4G throttling, and runs Lighthouse 12.0. Takes about 23 seconds.",
  },
  {
    num: "03",
    title: "Read, share, or export",
    body: "Get your Core Web Vitals scores, ranked remediation opportunities, a permanent public link, and an exportable PDF.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We had been arguing about Lighthouse scores for weeks because local runs kept giving different numbers. AuditHQ ended that debate on day one. Now the score in the pull request is the score that ships.",
  },
  {
    quote:
      "The shareable link feature alone is worth it. I used to spend 20 minutes stitching screenshots into a slide deck for clients. Now I paste one URL and the conversation starts from data.",
  },
  {
    quote:
      "We run 47 audits a week across four client domains. The historical trajectory charts caught a TBT regression in week two that our monitoring missed entirely. Paid for itself before the month ended.",
  },
];

const FAQS = [
  {
    q: "How is this different from running Lighthouse in my browser?",
    a: "Local Lighthouse runs are shaped by your machine's CPU load, browser extensions, cached resources, and your actual network connection. AuditHQ runs in a clean, isolated container with pinned CPU and memory quotas and deterministic 4G traffic shaping via Chrome DevTools Protocol. You get scores that reflect what a real mobile user on a median connection actually experiences.",
  },
  {
    q: "What is included in the free tier?",
    a: "100 audits per month, full Core Web Vitals reporting, shareable public URLs, historical trend tracking, and PDF export. No credit card required to start.",
  },
  {
    q: "How long does an audit take?",
    a: "Most audits complete in 18 to 25 seconds. Complex single-page applications with heavy JavaScript bundles can take up to 40 seconds.",
  },
  {
    q: "Can I audit a staging or localhost URL?",
    a: "Publicly accessible staging URLs work without any configuration. For localhost or private URLs behind a firewall, you can use a tunnel tool like ngrok to expose a temporary public endpoint.",
  },
  {
    q: "What device and network profile do you use?",
    a: "We emulate a Moto G Power with a 4x CPU slowdown factor and a 4G Fast connection profile: 150ms round-trip latency and 1.638 Mbps throughput. These match Google's Lighthouse 12.0 defaults for mobile auditing.",
  },
  {
    q: "Will my score vary between runs?",
    a: "Score variance is typically within 1 to 3 points between runs on the same URL. Our standardized environment eliminates the main sources of drift: local CPU spikes, network jitter, and browser state.",
  },
  {
    q: "Can I share results with clients who do not have an account?",
    a: "Yes. Every audit generates a permanent, read-only public URL that anyone can open without signing in. You can also export a vector PDF for documents and presentations.",
  },
  {
    q: "How is historical tracking handled?",
    a: "Every audit you run is stored in your account with a timestamp. The dashboard shows your score trajectory across recent runs, with delta indicators that highlight regressions or improvements between audits.",
  },
];

const TAGLINE =
  "Performance regressions found in production drain real revenue. Catch them in the cloud before your users do.";

export default function LandingPageClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!taglineRef.current) return;
    const words = Array.from(
      taglineRef.current.querySelectorAll<HTMLSpanElement>(".tagline-word"),
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const taglineWords = TAGLINE.split(" ");

  return (
    <div
      style={{
        background: "#000000",
        color: "#ffffff",
        minHeight: "100vh",
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >

      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{ paddingTop: "24px" }}
      >
        <nav
          aria-label="Main navigation"
          className="pointer-events-auto"
          style={{
            background: "rgba(24,24,24,0.90)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "9999px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          <a
            href="/"
            aria-label="AuditHQ home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                height: "30px",
                width: "30px",
                borderRadius: "8px",
                background: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: `background 700ms ${EASING}`,
              }}
            >
              <Lightning
                weight="fill"
                style={{ width: "14px", height: "14px", color: "#ffffff" }}
              />
            </div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#ffffff",
              }}
            >
              AuditHQ
            </span>
          </a>

          <div
            className="hidden md:flex"
            style={{ gap: "28px", alignItems: "center" }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  transition: `color 700ms ${EASING}`,
                }}
                onFocus={(e) => (e.currentTarget.style.color = "#ffffff")}
                onBlur={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                }
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: "4px" }}
          >
            <LoginLink
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.55)",
                padding: "7px 12px",
                borderRadius: "9999px",
                textDecoration: "none",
                transition: `color 700ms ${EASING}`,
                display: "inline-block",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#ffffff")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.55)")
              }
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#ffffff")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.55)")
              }
            >
              Sign in
            </LoginLink>
            <RegisterLink
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#ffffff",
                background: "#2563eb",
                padding: "7px 16px",
                borderRadius: "9999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
                transition: `background 700ms ${EASING}, transform 700ms ${EASING}`,
                outline: "none",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 0 2px #ffffff")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "none")
              }
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "#1d4ed8")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "#2563eb")
              }
              onMouseDown={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(0.97)")
              }
              onMouseUp={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1)")
              }
            >
              Start free
              <ArrowRight
                weight="bold"
                style={{ width: "13px", height: "13px" }}
              />
            </RegisterLink>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              position: "relative",
              width: "32px",
              height: "32px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "6px",
                width: "20px",
                height: "2px",
                background: "#ffffff",
                borderRadius: "1px",
                top: menuOpen ? "15px" : "10px",
                transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
                transition: `all 700ms ${EASING}`,
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "6px",
                width: "20px",
                height: "2px",
                background: "#ffffff",
                borderRadius: "1px",
                top: "15px",
                opacity: menuOpen ? 0 : 1,
                transition: `all 700ms ${EASING}`,
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "6px",
                width: "20px",
                height: "2px",
                background: "#ffffff",
                borderRadius: "1px",
                top: menuOpen ? "15px" : "20px",
                transform: menuOpen ? "rotate(-45deg)" : "rotate(0deg)",
                transition: `all 700ms ${EASING}`,
              }}
            />
          </button>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.90)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: `opacity 700ms ${EASING}`,
        }}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              textDecoration: "none",
              transform: menuOpen ? "translateY(0)" : "translateY(48px)",
              opacity: menuOpen ? 1 : 0,
              transition: `all 700ms ${EASING}`,
              transitionDelay: menuOpen ? `${80 + i * 55}ms` : "0ms",
            }}
          >
            {link.label}
          </a>
        ))}
        <div
          style={{
            transform: menuOpen ? "translateY(0)" : "translateY(48px)",
            opacity: menuOpen ? 1 : 0,
            transition: `all 700ms ${EASING}`,
            transitionDelay: menuOpen ? "260ms" : "0ms",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <RegisterLink
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#ffffff",
              background: "#2563eb",
              padding: "12px 32px",
              borderRadius: "9999px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Start auditing free
          </RegisterLink>
          <LoginLink
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
              textDecoration: "none",
            }}
          >
            Sign in to existing account
          </LoginLink>
        </div>
      </div>

      <main id="main-content">
        <section
          aria-label="Hero"
          style={{
            paddingTop: "148px",
            paddingBottom: "96px",
            textAlign: "center",
            background: "#000000",
          }}
        >
          <div
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                marginBottom: "32px",
                fontSize: "12px",
                fontFamily: "var(--font-mono), monospace",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              Cloud runner active
              <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
              Chromium 128
              <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
              Lighthouse 12.0
            </div>

            {/* Main headline — gradient text (B5 dark theme) */}
            <h1
              style={{
                fontSize: "clamp(38px, 6vw, 64px)",
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: "-0.035em",
                maxWidth: "680px",
                margin: "0 auto 24px",
                textWrap: "balance",
                background: "linear-gradient(90deg, #FFFFFF 0%, #9B9B9B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Cloud Lighthouse audits that match what your users see
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: "18px",
                lineHeight: "28px",
                color: "rgba(255,255,255,0.50)",
                maxWidth: "560px",
                margin: "0 auto 40px",
                textWrap: "pretty",
              }}
            >
              Your dev laptop masks real mobile latency, CPU throttling, and
              cold caches. AuditHQ runs deterministic Lighthouse 12.0 audits in
              isolated cloud containers, so your scores mean something.
            </p>

            {/* Primary CTA */}
            <div style={{ marginBottom: "64px" }}>
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
                <Lightning
                  weight="fill"
                  style={{ width: "16px", height: "16px" }}
                />
                Run free cloud audit
                <ArrowRight
                  weight="bold"
                  style={{ width: "16px", height: "16px" }}
                />
              </RegisterLink>
            </div>

            {/* Proof stats bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "48px",
                flexWrap: "wrap",
                paddingTop: "32px",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                marginBottom: "64px",
              }}
            >
              {[
                { value: "100", label: "free audits per month" },
                { value: "23s", label: "median audit duration" },
                { value: "4G Fast", label: "deterministic throttle" },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#ffffff",
                      lineHeight: 1,
                      fontFamily: "var(--font-mono), monospace",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.35)",
                      marginTop: "6px",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Hero console mockup */}
            <div
              className="reveal-section"
              style={{
                maxWidth: "820px",
                margin: "0 auto",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#181818",
                overflow: "hidden",
                textAlign: "left",
              }}
            >
              {/* Console topbar */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "#1F1F1F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.12)",
                        display: "inline-block",
                      }}
                    />
                  ))}
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "11px",
                      fontFamily: "var(--font-mono), monospace",
                      color: "rgba(255,255,255,0.32)",
                    }}
                  >
                    target: https://production.app
                  </span>
                </div>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontFamily: "var(--font-mono), monospace",
                    background: "rgba(16,185,129,0.10)",
                    color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.22)",
                    fontWeight: 600,
                  }}
                >
                  Score 97/100
                </span>
              </div>

              {/* Core Web Vitals grid */}
              <div
                style={{
                  padding: "20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "12px",
                }}
              >
                {[
                  { label: "LCP", value: "0.8s", spec: "≤ 2.5s" },
                  { label: "TBT", value: "0ms", spec: "≤ 200ms" },
                  { label: "CLS", value: "0.00", spec: "≤ 0.10" },
                  { label: "FCP", value: "0.4s", spec: "≤ 1.8s" },
                ].map((m) => (
                  <div
                    key={m.label}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#272727",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.38)",
                        fontFamily: "var(--font-mono), monospace",
                        marginBottom: "4px",
                      }}
                    >
                      {m.label}
                    </p>
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#10b981",
                        lineHeight: 1,
                        fontFamily: "var(--font-mono), monospace",
                      }}
                    >
                      {m.value}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.28)",
                        marginTop: "4px",
                        fontFamily: "var(--font-mono), monospace",
                      }}
                    >
                      Spec {m.spec}
                    </p>
                  </div>
                ))}
              </div>

              {/* Console footer */}
              <div
                style={{
                  padding: "10px 20px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: "#1F1F1F",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono), monospace",
                    color: "rgba(255,255,255,0.28)",
                  }}
                >
                  Main thread quiet: 820ms
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono), monospace",
                    color: "rgba(255,255,255,0.28)",
                  }}
                >
                  Payload: 412 KB uncompressed
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Problem / Solution ────────────────────────────────────── */}
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
              {[
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
              ].map((item, i) => (
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

        {/* ── Tagline reveal — B11 (mandatory) ─────────────────────── */}
        <section
          aria-label="Core message"
          style={{ padding: "96px 0", background: "#000000" }}
        >
          <div
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
          >
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

        {/* ── Benefits ──────────────────────────────────────────────── */}
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
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.06)";
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

        {/* ── How it works ──────────────────────────────────────────── */}
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
                      right: "20px",
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

        {/* ── Testimonials ──────────────────────────────────────────── */}
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

        {/* ── FAQ ───────────────────────────────────────────────────── */}
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
                      textAlign: "left",
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
                        textAlign: "left",
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

        {/* ── Final CTA ─────────────────────────────────────────────── */}
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
                padding: "80px 48px",
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
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
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
    </div>
  );
}
