import { apiClient } from "@/lib/api/api-client";
import type {
  DisableOrganizationRequest,
  OrganizationSettingsResponse,
  UpdateOrganizationSettingsRequest,
} from "@/lib/api/api-types";

export function getOrganizationSettings(
  organizationId: string,
): Promise<OrganizationSettingsResponse> {
  return apiClient<OrganizationSettingsResponse>(
    `/api/v1/organizations/${organizationId}/settings`,
  );
}

export function updateOrganizationSettings(
  organizationId: string,
  request: UpdateOrganizationSettingsRequest,
): Promise<OrganizationSettingsResponse> {
  return apiClient<OrganizationSettingsResponse>(
    `/api/v1/organizations/${organizationId}/settings`,
    {
      method: "PATCH",
      body: JSON.stringify(request),
    },
  );
}

export function disableOrganizationWorkspace(
  organizationId: string,
  request: DisableOrganizationRequest,
): Promise<OrganizationSettingsResponse> {
  return apiClient<OrganizationSettingsResponse>(
    `/api/v1/organizations/${organizationId}/settings/disable`,
    {
      method: "PATCH",
      body: JSON.stringify(request),
    },
  );
}
