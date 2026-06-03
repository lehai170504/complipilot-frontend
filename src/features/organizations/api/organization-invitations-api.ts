import { apiClient } from "@/lib/api/api-client";
import type {
  AcceptOrganizationInvitationRequest,
  CreateOrganizationInvitationRequest,
  OrganizationInvitationResponse,
} from "@/lib/api/api-types";

export function createOrganizationInvitation(
  organizationId: string,
  request: CreateOrganizationInvitationRequest,
): Promise<OrganizationInvitationResponse> {
  return apiClient<OrganizationInvitationResponse>(
    `/api/v1/organizations/${organizationId}/invitations`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );
}

export function listOrganizationInvitations(
  organizationId: string,
): Promise<OrganizationInvitationResponse[]> {
  return apiClient<OrganizationInvitationResponse[]>(
    `/api/v1/organizations/${organizationId}/invitations`,
  );
}

export function revokeOrganizationInvitation(
  organizationId: string,
  invitationId: string,
): Promise<void> {
  return apiClient<void>(
    `/api/v1/organizations/${organizationId}/invitations/${invitationId}`,
    {
      method: "DELETE",
    },
  );
}

export function getOrganizationInvitationByToken(
  token: string,
): Promise<OrganizationInvitationResponse> {
  return apiClient<OrganizationInvitationResponse>(
    `/api/v1/organization-invitations/${token}`,
    {
      auth: false,
    },
  );
}

export function acceptOrganizationInvitation(
  token: string,
  request: AcceptOrganizationInvitationRequest,
): Promise<OrganizationInvitationResponse> {
  return apiClient<OrganizationInvitationResponse>(
    `/api/v1/organization-invitations/${token}/accept`,
    {
      method: "POST",
      auth: false,
      body: JSON.stringify(request),
    },
  );
}