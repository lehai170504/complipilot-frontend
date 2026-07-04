import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cancelBillingPlanChangeRequest,
  createBillingPlanChangeRequest,
  createCheckoutSession,
  getLatestBillingPlanChangeRequest,
  getOrganizationUsage,
  listBillingPlanChangeRequests,
} from "@/features/billing/api/billing-api";
import type {
  CreateBillingPlanChangeRequest,
  CreateCheckoutSessionRequest,
} from "@/lib/api/api-types";
import { toast } from "@/lib/toast";

export const billingQueryKeys = {
  all: ["billing"] as const,
  usage: (organizationId: string | undefined) =>
    ["billing", "usage", organizationId] as const,
  latestPlanChangeRequest: (organizationId: string | undefined) =>
    ["billing", "plan-change-request", "latest", organizationId] as const,
  planChangeRequests: (organizationId: string | undefined) =>
    ["billing", "plan-change-requests", organizationId] as const,
};

export function useOrganizationUsageQuery(organizationId: string | undefined) {
  return useQuery({
    queryKey: billingQueryKeys.usage(organizationId),
    queryFn: () => getOrganizationUsage(organizationId!),
    enabled: Boolean(organizationId),
  });
}

export function useLatestBillingPlanChangeRequestQuery(
  organizationId: string | undefined,
) {
  return useQuery({
    queryKey: billingQueryKeys.latestPlanChangeRequest(organizationId),
    queryFn: () => getLatestBillingPlanChangeRequest(organizationId!),
    enabled: Boolean(organizationId),
  });
}

export function useCreateBillingPlanChangeRequestMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateBillingPlanChangeRequest) =>
      createBillingPlanChangeRequest(organizationId!, request),
    onSuccess: async (data) => {
      toast.success("Plan change requested", {
        description: `Requested ${data.requestedPlan}. A platform admin can approve it.`,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: billingQueryKeys.latestPlanChangeRequest(organizationId),
        }),
        queryClient.invalidateQueries({
          queryKey: ["platform-admin", "billing-plan-change-requests"],
        }),
        queryClient.invalidateQueries({
          queryKey: billingQueryKeys.planChangeRequests(organizationId),
        }),
      ]);
    },
    onError: () => {
      toast.error("Failed to request plan change");
    },
  });
}

export function useCreateCheckoutSessionMutation(
  organizationId: string | undefined,
) {
  return useMutation({
    mutationFn: (request: CreateCheckoutSessionRequest) =>
      createCheckoutSession(organizationId!, request),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      toast.info("Checkout is not connected yet", {
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to start checkout", {
        description: error?.message || "Please try again later.",
      });
    },
  });
}

export function useBillingPlanChangeRequestsQuery(
  organizationId: string | undefined,
) {
  return useQuery({
    queryKey: billingQueryKeys.planChangeRequests(organizationId),
    queryFn: () => listBillingPlanChangeRequests(organizationId!, 0, 10),
    enabled: Boolean(organizationId),
  });
}

export function useCancelBillingPlanChangeRequestMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      cancelBillingPlanChangeRequest(organizationId!, requestId),
    onSuccess: async () => {
      toast.success("Plan change request cancelled");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: billingQueryKeys.latestPlanChangeRequest(organizationId),
        }),
        queryClient.invalidateQueries({
          queryKey: billingQueryKeys.planChangeRequests(organizationId),
        }),
        queryClient.invalidateQueries({
          queryKey: ["platform-admin", "billing-plan-change-requests"],
        }),
      ]);
    },
    onError: () => {
      toast.error("Failed to cancel plan change request");
    },
  });
}
