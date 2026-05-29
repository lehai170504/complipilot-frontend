"use client";

import Cookies from "js-cookie";

const ONBOARDING_DISMISSED_KEY = "complipilot_onboarding_dismissed";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: Cookies.CookieAttributes = {
  sameSite: "strict",
  secure: isProduction,
  expires: 365,
  path: "/",
};

export function hasDismissedOnboarding(): boolean {
  return Cookies.get(ONBOARDING_DISMISSED_KEY) === "true";
}

export function dismissOnboarding(): void {
  Cookies.set(ONBOARDING_DISMISSED_KEY, "true", cookieOptions);
}

export function resetOnboarding(): void {
  Cookies.remove(ONBOARDING_DISMISSED_KEY, { path: "/" });
}
