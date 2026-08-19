import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import getSessionUser from "@/lib/auth";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { syncUserToDatabase } from "./utils/actions";
import { Toaster } from "sonner";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const BASE_URL = "https://swiftaudithq.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AuditHQ — Web Performance Engineering Console",
    template: "%s | AuditHQ",
  },
  description:
    "Run automated Google Lighthouse cloud audits. Track Core Web Vitals, diagnose regressions, and export executive whitepapers in seconds.",
  keywords: [
    "lighthouse audit",
    "web performance",
    "core web vitals",
    "page speed",
    "FCP",
    "LCP",
    "CLS",
    "developer console",
  ],
  authors: [{ name: "AuditHQ" }],
  creator: "AuditHQ",

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "AuditHQ",
    title: "AuditHQ — Web Performance Engineering Console",
    description:
      "Run automated Google Lighthouse cloud audits. Track Core Web Vitals, diagnose regressions, and export executive whitepapers in seconds.",
    images: [
      {
        url: "/apple-touch-icon.jpg",
        width: 1024,
        height: 1024,
        alt: "AuditHQ — Web Performance Engineering Console",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "AuditHQ — Web Performance Engineering Console",
    description:
      "Run instant Google Lighthouse cloud audits. Track Core Web Vitals. Share results.",
    images: ["/apple-touch-icon.jpg"],
  },

  icons: {
    icon: "/icon.jpg",
    apple: "/apple-touch-icon.jpg",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = (await getSessionUser()) as KindeUser | null;

  if (user) {
    await syncUserToDatabase(user);
  }

  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} bg-[#f6f9fc] text-[#0a2540] font-sans antialiased min-h-screen selection:bg-[#635bff]/15 selection:text-[#635bff]`}
      >
        {children}
        <Toaster
          position="bottom-right"
          theme="light"
          closeButton
          toastOptions={{
            duration: 5000,
            className: "bg-white text-[#0a2540] border border-[#e3e8ee] shadow-xl rounded-lg font-sans text-sm",
          }}
        />
      </body>
    </html>
  );
}
