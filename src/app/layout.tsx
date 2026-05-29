import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { Providers } from "@/app/providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CompliPilot",
    template: "%s | CompliPilot",
  },
  description:
    "AI Compliance & Evidence OS for controls, evidence, tasks, and audit readiness.",
  applicationName: "CompliPilot",
  keywords: [
    "Compliance",
    "Evidence Management",
    "Audit Trail",
    "GRC",
    "Security Controls",
    "Compliance Tasks",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-background antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { borderRadius: "1rem", border: "1px solid oklch(0.88 0.01 248)" },
          }}
        />
      </body>
    </html>
  );
}