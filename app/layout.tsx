import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import getSessionUser from "@/lib/auth";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { syncUserToDatabase } from "./utils/actions";
import { Toaster } from "@/components/ui/sonner";
import { TopProgressBar } from "@/components/ui/TopProgressBar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const BASE_URL = "https://swiftaudithq.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AuditHQ — Web Performance Engineering Console",
    template: "%s | AuditHQ",
  },
  description:
    "Run cloud Google Lighthouse audits. Track Core Web Vitals, diagnose regressions with AI, and export executive whitepapers in seconds.",
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
      "Run cloud Google Lighthouse audits. Track Core Web Vitals, diagnose regressions with AI, and export executive whitepapers in seconds.",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable}`}
    >
      <body
        className="bg-background text-foreground font-sans antialiased min-h-screen selection:bg-brand-600/20 selection:text-brand-500"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopProgressBar />
          {children}
          <Toaster position="bottom-right" closeButton duration={5000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
