import { describe, expect, it } from "vitest";

import { getVisibleNavigationGroups } from "./app-navigation";

describe("responsive app navigation", () => {
  it("keeps workspace routes available and filters role-restricted routes", () => {
    const groups = getVisibleNavigationGroups({
      canViewAudit: false,
      canManageBilling: false,
      canViewPlatformAdmin: false,
    });
    const routes = groups.flatMap((group) => group.items.map((item) => item.href));

    expect(routes).toEqual([
      "/dashboard",
      "/tasks",
      "/compliance",
      "/evidence",
      "/workspaces",
    ]);
  });

  it("includes administrative routes when the user has permission", () => {
    const groups = getVisibleNavigationGroups({
      canViewAudit: true,
      canManageBilling: true,
      canViewPlatformAdmin: true,
    });
    const routes = groups.flatMap((group) => group.items.map((item) => item.href));

    expect(routes).toContain("/audit");
    expect(routes).toContain("/billing");
    expect(routes).toContain("/platform-admin");
    expect(routes).toContain("/system-status");
  });
});
