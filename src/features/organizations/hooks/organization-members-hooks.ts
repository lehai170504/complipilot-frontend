"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createOrganizationMember,
  deleteOrganizationMember,
  listOrganizationMembers,
  seedDemoOrganizationUsers,
  updateOrganizationMemberRole,
  updateOrganizationMemberStatus,
  type CreateOrganizationMemberRequest,
  type OrganizationMemberRole,
  type OrganizationMemberStatus,
} from "@/features/organizations/api/organization-members-api";

export const organizationMembersQueryKeys = {
  all: ["organization-members"] as const,
  list: (organizationId: string | undefined) =>
    ["organization-members", organizationId] as const,
};

export function useOrganizationMembersQuery(
  organizationId: string | undefined,
) {
  return useQuery({
    queryKey: organizationMembersQueryKeys.list(organizationId),
    queryFn: () => listOrganizationMembers(organizationId!),
    enabled: Boolean(organizationId),
  });
}

export function useCreateOrganizationMemberMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateOrganizationMemberRequest) =>
      createOrganizationMember(organizationId!, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKeys.list(organizationId),
      });
    },
  });
}

export function useUpdateOrganizationMemberRoleMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: OrganizationMemberRole;
    }) => updateOrganizationMemberRole(organizationId!, memberId, { role }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKeys.list(organizationId),
      });
      void queryClient.invalidateQueries({
        queryKey: ["auth", "organizations"],
      });
      void queryClient.invalidateQueries({ queryKey: ["me", "organizations"] });
    },
  });
}

export function useUpdateOrganizationMemberStatusMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      status,
    }: {
      memberId: string;
      status: OrganizationMemberStatus;
    }) => updateOrganizationMemberStatus(organizationId!, memberId, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKeys.list(organizationId),
      });
      void queryClient.invalidateQueries({
        queryKey: ["auth", "organizations"],
      });
      void queryClient.invalidateQueries({ queryKey: ["me", "organizations"] });
    },
  });
}

export function useDeleteOrganizationMemberMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) =>
      deleteOrganizationMember(organizationId!, memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKeys.list(organizationId),
      });
      void queryClient.invalidateQueries({
        queryKey: ["auth", "organizations"],
      });
      void queryClient.invalidateQueries({ queryKey: ["me", "organizations"] });
    },
  });
}

export function useSeedDemoOrganizationUsersMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => seedDemoOrganizationUsers(organizationId!),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKeys.list(organizationId),
      });
    },
  });
}
