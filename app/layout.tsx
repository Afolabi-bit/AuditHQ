import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import getSessionUser from "@/lib/auth";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { syncUserToDatabase } from "./utils/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuditHQ - Performance Testing Made Easy",
  description:
    "Simplify your performance testing with AuditHQ. Create, run, and analyze tests effortlessly.",
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
      </body>
    </html>
  );
}
