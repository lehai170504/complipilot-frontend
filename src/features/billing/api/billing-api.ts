import { apiClient } from "@/lib/api/api-client";
import type { OrganizationUsageResponse } from "@/lib/api/api-types";

export function getOrganizationUsage(
  organizationId: string,
): Promise<OrganizationUsageResponse> {
  return apiClient<OrganizationUsageResponse>(
    `/api/v1/organizations/${organizationId}/billing/usage`,
  );
}
