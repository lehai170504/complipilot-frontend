import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { Providers } from "@/app/providers";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
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
    "AI Compliance & Evidence OS for managing controls, evidence, tasks, and audit readiness.",
  applicationName: "CompliPilot",
  keywords: [
    "CompliPilot",
    "Compliance",
    "Evidence Management",
    "Audit Trail",
    "GRC",
    "Security Controls",
    "Compliance Tasks",
    "AI Compliance",
  ],
  authors: [
    {
      name: "CompliPilot",
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
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
      <body className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
        <Providers>{children}</Providers>

        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              borderRadius: "0.875rem",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--card-foreground)",
              boxShadow:
                "0 18px 45px rgb(15 23 42 / 0.12), 0 8px 18px rgb(15 23 42 / 0.08)",
            },
          }}
        />
      </body>
    </html>
  );
}