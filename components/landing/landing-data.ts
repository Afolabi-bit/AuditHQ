import {
  ArrowsLeftRight,
  Code,
  LinkSimple,
  FileText,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

export const EASING = "cubic-bezier(0.32,0.72,0,1)";

export const NAV_LINKS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export type Benefit = {
  Icon: PhosphorIcon;
  title: string;
  body: string;
};

export const BENEFITS: Benefit[] = [
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

export const STEPS = [
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

export const TESTIMONIALS = [
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

export const FAQS = [
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

export const TAGLINE =
  "Performance regressions found in production drain real revenue. Catch them in the cloud before your users do.";
