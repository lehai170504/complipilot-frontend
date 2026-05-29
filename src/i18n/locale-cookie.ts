"use client";

import Cookies from "js-cookie";

import {
  defaultLocale,
  isAppLocale,
  localeCookieName,
  type AppLocale,
} from "@/i18n/config";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: Cookies.CookieAttributes = {
  sameSite: "strict",
  secure: isProduction,
  expires: 365,
  path: "/",
};

export function getClientLocale(): AppLocale {
  const locale = Cookies.get(localeCookieName);

  return isAppLocale(locale) ? locale : defaultLocale;
}

export function setClientLocale(locale: AppLocale): void {
  Cookies.set(localeCookieName, locale, cookieOptions);
}