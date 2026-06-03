import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  acceptOrganizationInvitation,
  createOrganizationInvitation,
  getOrganizationInvitationByToken,
  listOrganizationInvitations,
  revokeOrganizationInvitation,
} from "@/features/organizations/api/organization-invitations-api";
import type {
  AcceptOrganizationInvitationRequest,
  CreateOrganizationInvitationRequest,
} from "@/lib/api/api-types";

export function useOrganizationInvitationsQuery(
  organizationId: string | undefined,
) {
  return useQuery({
    queryKey: ["organization-invitations", organizationId],
    queryFn: () => listOrganizationInvitations(organizationId!),
    enabled: Boolean(organizationId),
  });
}

export function useCreateOrganizationInvitationMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateOrganizationInvitationRequest) =>
      createOrganizationInvitation(organizationId!, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["organization-invitations", organizationId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["organization-usage", organizationId],
      });
    },
  });
}

export function useRevokeOrganizationInvitationMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      revokeOrganizationInvitation(organizationId!, invitationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["organization-invitations", organizationId],
      });
    },
  });
}

export function useOrganizationInvitationByTokenQuery(token: string | undefined) {
  return useQuery({
    queryKey: ["organization-invitation", token],
    queryFn: () => getOrganizationInvitationByToken(token!),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useAcceptOrganizationInvitationMutation(token: string | undefined) {
  return useMutation({
    mutationFn: (request: AcceptOrganizationInvitationRequest) =>
      acceptOrganizationInvitation(token!, request),
  });
}