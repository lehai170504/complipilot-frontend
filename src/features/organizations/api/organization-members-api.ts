import { apiClient } from "@/lib/api/api-client";

export type OrganizationMemberRole =
  | "OWNER"
  | "ADMIN"
  | "COMPLIANCE_MANAGER"
  | "MEMBER"
  | "AUDITOR";

export type OrganizationMemberStatus = "ACTIVE" | "INVITED" | "DISABLED";

export type OrganizationMember = {
  id: string;
  organizationId: string;
  userId: string;
  email: string;
  fullName: string;
  role: OrganizationMemberRole;
  status: OrganizationMemberStatus;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrganizationMemberRequest = {
  email: string;
  fullName: string;
  password: string;
  role: OrganizationMemberRole;
};

export type UpdateOrganizationMemberRoleRequest = {
  role: OrganizationMemberRole;
};

export type UpdateOrganizationMemberStatusRequest = {
  status: OrganizationMemberStatus;
};

export type SeedDemoUsersResponse = {
  createdUsers: number;
  createdMemberships: number;
  updatedMemberships: number;
  members: OrganizationMember[];
};

export async function listOrganizationMembers(
  organizationId: string,
): Promise<OrganizationMember[]> {
  return apiClient<OrganizationMember[]>(
    `/api/v1/organizations/${organizationId}/members`,
  );
}

export async function createOrganizationMember(
  organizationId: string,
  request: CreateOrganizationMemberRequest,
): Promise<OrganizationMember> {
  return apiClient<OrganizationMember>(
    `/api/v1/organizations/${organizationId}/members`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );
}

export async function updateOrganizationMemberRole(
  organizationId: string,
  memberId: string,
  request: UpdateOrganizationMemberRoleRequest,
): Promise<OrganizationMember> {
  return apiClient<OrganizationMember>(
    `/api/v1/organizations/${organizationId}/members/${memberId}/role`,
    {
      method: "PATCH",
      body: JSON.stringify(request),
    },
  );
}

export async function updateOrganizationMemberStatus(
  organizationId: string,
  memberId: string,
  request: UpdateOrganizationMemberStatusRequest,
): Promise<OrganizationMember> {
  return apiClient<OrganizationMember>(
    `/api/v1/organizations/${organizationId}/members/${memberId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(request),
    },
  );
}

export async function deleteOrganizationMember(
  organizationId: string,
  memberId: string,
): Promise<void> {
  return apiClient<void>(
    `/api/v1/organizations/${organizationId}/members/${memberId}`,
    {
      method: "DELETE",
    },
  );
}

export async function seedDemoOrganizationUsers(
  organizationId: string,
): Promise<SeedDemoUsersResponse> {
  return apiClient<SeedDemoUsersResponse>(
    `/api/v1/organizations/${organizationId}/members/seed-demo-users`,
    {
      method: "POST",
    },
  );
}
