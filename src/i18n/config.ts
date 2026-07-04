export const locales = ["en", "vi"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "vi";

export const localeCookieName = "complipilot_locale";

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return value === "en" || value === "vi";
}