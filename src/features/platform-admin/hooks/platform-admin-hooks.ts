import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approvePlatformBillingPlanChangeRequest,
  getPlatformOrganizationUsage,
  listPlatformBillingPlanChangeRequests,
  listPlatformOrganizations,
  listPlatformUsers,
  rejectPlatformBillingPlanChangeRequest,
  updatePlatformOrganizationSubscription,
} from "@/features/platform-admin/api/platform-admin-api";
import { toast } from "@/lib/toast";
import { BillingPlanChangeRequestStatus } from "@/lib/api/api-types";

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

export function useUpdatePlatformOrganizationSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      plan,
    }: {
      organizationId: string;
      plan: "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";
    }) => updatePlatformOrganizationSubscription(organizationId, plan),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["platform-admin", "organizations"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["platform-admin", "organization-usage"],
        }),
      ]);
    },
  });
}

export function usePlatformBillingPlanChangeRequestsQuery(
  status: BillingPlanChangeRequestStatus | undefined = "PENDING",
) {
  return useQuery({
    queryKey: ["platform-admin", "billing-plan-change-requests", status],
    queryFn: () => listPlatformBillingPlanChangeRequests(status, 0, 20),
  });
}

export function useApprovePlatformBillingPlanChangeRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      approvePlatformBillingPlanChangeRequest(requestId),
    onSuccess: async () => {
      toast.success("Plan change request approved");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["platform-admin", "billing-plan-change-requests"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["platform-admin", "organizations"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["platform-admin", "organization-usage"],
        }),
      ]);
    },
    onError: () => {
      toast.error("Failed to approve request");
    },
  });
}

export function useRejectPlatformBillingPlanChangeRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      rejectPlatformBillingPlanChangeRequest(requestId),
    onSuccess: async () => {
      toast.success("Plan change request rejected");

      await queryClient.invalidateQueries({
        queryKey: ["platform-admin", "billing-plan-change-requests"],
      });
    },
    onError: () => {
      toast.error("Failed to reject request");
    },
  });
}
