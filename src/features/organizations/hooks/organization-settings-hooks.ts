import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getOrganizationSettings,
  updateOrganizationSettings,
} from "@/features/organizations/api/organization-settings-api";
import type { UpdateOrganizationSettingsRequest } from "@/lib/api/api-types";
import { toast } from "@/lib/toast";

export function useOrganizationSettingsQuery(
  organizationId: string | undefined,
) {
  return useQuery({
    queryKey: ["organization-settings", organizationId],
    queryFn: () => getOrganizationSettings(organizationId!),
    enabled: Boolean(organizationId),
  });
}

export function useUpdateOrganizationSettingsMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateOrganizationSettingsRequest) =>
      updateOrganizationSettings(organizationId!, request),
    onSuccess: async () => {
      toast.success("Workspace settings updated");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["organization-settings", organizationId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["organizations"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["active-organization"],
        }),
      ]);
    },
    onError: () => {
      toast.error("Failed to update workspace settings");
    },
  });
}