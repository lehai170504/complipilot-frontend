import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";

import { Providers } from "@/app/providers";
import {
  defaultLocale,
  isAppLocale,
  localeCookieName,
  type AppLocale,
} from "@/i18n/config";

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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

async function getLocaleFromCookie(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(localeCookieName)?.value;

  return isAppLocale(locale) ? locale : defaultLocale;
}

async function getMessages(locale: AppLocale) {
  return (await import(`@/messages/${locale}.json`)).default;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromCookie();
  const messages = await getMessages(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetBrainsMono.variable} h-full bg-background antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>

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