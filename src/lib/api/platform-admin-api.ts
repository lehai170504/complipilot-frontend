import { apiClient } from "@/lib/api/api-client";
import type {
  OrganizationUsageResponse,
  PageResponse,
  PlatformOrganizationResponse,
  PlatformUserResponse,
  SubscriptionPlan,
} from "@/lib/api/api-types";

export function listPlatformOrganizations(
  page = 0,
  size = 20,
): Promise<PageResponse<PlatformOrganizationResponse>> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  return apiClient<PageResponse<PlatformOrganizationResponse>>(
    `/api/v1/platform/organizations?${searchParams.toString()}`,
  );
}

export function listPlatformUsers(
  page = 0,
  size = 20,
): Promise<PageResponse<PlatformUserResponse>> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  return apiClient<PageResponse<PlatformUserResponse>>(
    `/api/v1/platform/users?${searchParams.toString()}`,
  );
}

export function getPlatformOrganizationUsage(
  organizationId: string,
): Promise<OrganizationUsageResponse> {
  return apiClient<OrganizationUsageResponse>(
    `/api/v1/platform/organizations/${organizationId}/usage`,
  );
}

export function updatePlatformOrganizationSubscription(
  organizationId: string,
  plan: SubscriptionPlan,
): Promise<OrganizationUsageResponse> {
  return apiClient<OrganizationUsageResponse>(
    `/api/v1/platform/organizations/${organizationId}/subscription`,
    {
      method: "PATCH",
      body: JSON.stringify({ plan }),
    },
  );
}
