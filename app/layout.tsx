import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import getSessionUser from "@/lib/auth";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { syncUserToDatabase } from "./utils/actions";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://swiftaudithq.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AuditHQ — Website Performance Auditing",
    template: "%s | AuditHQ",
  },
  description:
    "Run instant Google Lighthouse audits from the cloud. Track Core Web Vitals, identify performance bottlenecks, and share results — all in one place.",
  keywords: [
    "lighthouse audit",
    "web performance",
    "core web vitals",
    "page speed",
    "FCP",
    "LCP",
    "CLS",
    "website speed test",
  ],
  authors: [{ name: "AuditHQ" }],
  creator: "AuditHQ",

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "AuditHQ",
    title: "AuditHQ — Website Performance Auditing",
    description:
      "Run instant Google Lighthouse audits from the cloud. Track Core Web Vitals, identify performance bottlenecks, and share results — all in one place.",
    images: [
      {
        url: "/apple-touch-icon.jpg",
        width: 1024,
        height: 1024,
        alt: "AuditHQ — Website Performance Auditing",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "AuditHQ — Website Performance Auditing",
    description:
      "Run instant Google Lighthouse audits. Track Core Web Vitals. Share results.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            duration: 5000,
          }}
        />
      </body>
    </html>
  );
}
