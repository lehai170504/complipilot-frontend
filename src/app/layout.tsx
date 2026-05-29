import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { Providers } from "@/app/providers";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
      className={`${inter.variable} ${jetBrainsMono.variable} h-full bg-background antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground font-sans">
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { 
              borderRadius: "0.5rem", 
              border: "1px solid var(--color-border)",
              background: "var(--color-card)",
              color: "var(--color-foreground)"
            },
          }}
        />
      </body>
    </html>
  );
}