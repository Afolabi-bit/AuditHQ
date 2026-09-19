"use client";

import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { Lightning, ArrowRight } from "@phosphor-icons/react";
import { EASING, NAV_LINKS } from "./landing-data";

interface LandingNavProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export default function LandingNav({ menuOpen, onToggleMenu }: LandingNavProps) {
  return (
    <>
      {/* Floating island nav */}
      <div
        className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none"
        style={{ paddingTop: "max(24px, env(safe-area-inset-top))" }}
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
          {/* Logo */}
          <a
            href="/"
            aria-label="AuditHQ home"
            style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}
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
              <Lightning weight="fill" style={{ width: "14px", height: "14px", color: "#ffffff" }} />
            </div>
            <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em", color: "#ffffff" }}>
              AuditHQ
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ gap: "28px", alignItems: "center" }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: `color 700ms ${EASING}` }}
                onFocus={(e) => (e.currentTarget.style.color = "#ffffff")}
                onBlur={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "4px" }}>
            <LoginLink
              style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.55)", padding: "7px 12px", borderRadius: "9999px", textDecoration: "none", transition: `color 700ms ${EASING}`, display: "inline-block" }}
              onFocus={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#ffffff")}
              onBlur={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)")}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#ffffff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)")}
            >
              Sign in
            </LoginLink>
            <RegisterLink
              style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", background: "#2563eb", padding: "7px 16px", borderRadius: "9999px", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", transition: `background 700ms ${EASING}, transform 700ms ${EASING}`, outline: "none" }}
              onFocus={(e) => ((e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 0 2px #ffffff")}
              onBlur={(e) => ((e.currentTarget as HTMLAnchorElement).style.boxShadow = "none")}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#1d4ed8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#2563eb")}
              onMouseDown={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.97)")}
              onMouseUp={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)")}
            >
              Start free
              <ArrowRight weight="bold" style={{ width: "13px", height: "13px" }} />
            </RegisterLink>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="md:hidden"
            onClick={onToggleMenu}
            style={{ position: "relative", width: "32px", height: "32px", background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
          >
            <span style={{ position: "absolute", left: "6px", width: "20px", height: "2px", background: "#ffffff", borderRadius: "1px", top: menuOpen ? "15px" : "10px", transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)", transition: `all 700ms ${EASING}` }} />
            <span style={{ position: "absolute", left: "6px", width: "20px", height: "2px", background: "#ffffff", borderRadius: "1px", top: "15px", opacity: menuOpen ? 0 : 1, transition: `all 700ms ${EASING}` }} />
            <span style={{ position: "absolute", left: "6px", width: "20px", height: "2px", background: "#ffffff", borderRadius: "1px", top: menuOpen ? "15px" : "20px", transform: menuOpen ? "rotate(-45deg)" : "rotate(0deg)", transition: `all 700ms ${EASING}` }} />
          </button>
        </nav>
      </div>

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.90)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "40px", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: `opacity 700ms ${EASING}` }}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onToggleMenu}
            style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.03em", color: "#ffffff", textDecoration: "none", transform: menuOpen ? "translateY(0)" : "translateY(48px)", opacity: menuOpen ? 1 : 0, transition: `all 700ms ${EASING}`, transitionDelay: menuOpen ? `${80 + i * 55}ms` : "0ms" }}
          >
            {link.label}
          </a>
        ))}
        <div style={{ transform: menuOpen ? "translateY(0)" : "translateY(48px)", opacity: menuOpen ? 1 : 0, transition: `all 700ms ${EASING}`, transitionDelay: menuOpen ? "260ms" : "0ms", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <RegisterLink style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", background: "#2563eb", padding: "12px 32px", borderRadius: "9999px", textDecoration: "none", display: "inline-block" }}>
            Start auditing free
          </RegisterLink>
          <LoginLink style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
            Sign in to existing account
          </LoginLink>
        </div>
      </div>
    </>
  );
}
