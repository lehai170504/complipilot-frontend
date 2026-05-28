import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getComplianceSummary,
  getDueSoonComplianceItems,
  getOverdueComplianceItems,
  seedDemoWorkspace,
} from "@/features/compliance/api/compliance-api";

export const complianceQueryKeys = {
  all: ["compliance"] as const,
  summary: (organizationId: string | undefined) =>
    ["compliance", "summary", organizationId] as const,
  dueSoon: (organizationId: string | undefined) =>
    ["compliance", "due-soon", organizationId] as const,
  overdue: (organizationId: string | undefined) =>
    ["compliance", "overdue", organizationId] as const,
};

export function useComplianceSummaryQuery(organizationId: string | undefined) {
  return useQuery({
    queryKey: complianceQueryKeys.summary(organizationId),
    queryFn: () => getComplianceSummary(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useDueSoonComplianceItemsQuery(
  organizationId: string | undefined
) {
  return useQuery({
    queryKey: complianceQueryKeys.dueSoon(organizationId),
    queryFn: () => getDueSoonComplianceItems(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useOverdueComplianceItemsQuery(
  organizationId: string | undefined
) {
  return useQuery({
    queryKey: complianceQueryKeys.overdue(organizationId),
    queryFn: () => getOverdueComplianceItems(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useSeedDemoWorkspaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: string) => seedDemoWorkspace(organizationId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["compliance"] }),
        queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
  });
}