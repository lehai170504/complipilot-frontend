import Cookies from "js-cookie";

import type { ActiveOrganization } from "@/features/organizations/types/organization-types";

const ACTIVE_ORGANIZATION_KEY = "complipilot_active_organization";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: Cookies.CookieAttributes = {
  sameSite: "strict",
  secure: isProduction,
  expires: 30,
  path: "/",
};

export function getActiveOrganization(): ActiveOrganization | null {
  const rawValue = Cookies.get(ACTIVE_ORGANIZATION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as ActiveOrganization;
  } catch {
    Cookies.remove(ACTIVE_ORGANIZATION_KEY, { path: "/" });
    return null;
  }
}

export function setActiveOrganization(organization: ActiveOrganization): void {
  Cookies.set(ACTIVE_ORGANIZATION_KEY, JSON.stringify(organization), cookieOptions);
}

export function clearActiveOrganization(): void {
  Cookies.remove(ACTIVE_ORGANIZATION_KEY, { path: "/" });
}