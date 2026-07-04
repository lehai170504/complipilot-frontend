import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCheckoutSession,
  getOrganizationUsage,
} from "@/features/billing/api/billing-api";
import type {
  CreateCheckoutSessionRequest,
} from "@/lib/api/api-types";
import { toast } from "@/lib/toast";

export const billingQueryKeys = {
  all: ["billing"] as const,
  usage: (organizationId: string | undefined) =>
    ["billing", "usage", organizationId] as const,
};

export function useOrganizationUsageQuery(organizationId: string | undefined) {
  return useQuery({
    queryKey: billingQueryKeys.usage(organizationId),
    queryFn: () => getOrganizationUsage(organizationId!),
    enabled: Boolean(organizationId),
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

