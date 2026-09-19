"use client";

import { useState, useEffect } from "react";
import LandingNav from "./LandingNav";
import LandingHero from "./LandingHero";
import LandingProblem from "./LandingProblem";
import LandingTagline from "./LandingTagline";
import LandingBenefits from "./LandingBenefits";
import LandingHowItWorks from "./LandingHowItWorks";
import LandingTestimonials from "./LandingTestimonials";
import LandingFaq from "./LandingFaq";
import LandingCta from "./LandingCta";
import LandingFooter from "./LandingFooter";

export default function LandingPageClient() {
  const [menuOpen, setMenuOpen] = useState(false);

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
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div
      style={{
        background: "#000000",
        color: "#ffffff",
        minHeight: "100vh",
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >
      <LandingNav
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((prev) => !prev)}
      />

      <main id="main-content">
        <LandingHero />
        <LandingProblem />
        <LandingTagline />
        <LandingBenefits />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingFaq />
        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
