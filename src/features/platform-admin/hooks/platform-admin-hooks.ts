import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getPlatformOrganizationUsage,
  listPlatformOrganizations,
  listPlatformUsers,
  updatePlatformOrganizationSubscription,
} from "@/features/platform-admin/api/platform-admin-api";

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
