import { useQuery } from "@tanstack/react-query";

import {
  getPlatformOrganizationUsage,
  listPlatformOrganizations,
  listPlatformUsers,
} from "@/lib/api/platform-admin-api";

export function usePlatformOrganizationsQuery() {
  return useQuery({
    queryKey: ["platform-admin", "organizations"],
    queryFn: () => listPlatformOrganizations(0, 20),
  });
}

export function usePlatformUsersQuery() {
  return useQuery({
    queryKey: ["platform-admin", "users"],
    queryFn: () => listPlatformUsers(0, 20),
  });
}

export function usePlatformOrganizationUsageQuery(
  organizationId: string | undefined,
) {
  return useQuery({
    queryKey: ["platform-admin", "organization-usage", organizationId],
    queryFn: () => getPlatformOrganizationUsage(organizationId!),
    enabled: Boolean(organizationId),
  });
}
