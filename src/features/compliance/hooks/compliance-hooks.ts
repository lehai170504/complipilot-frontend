import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getComplianceSummary,
  getDueSoonComplianceItems,
  getOverdueComplianceItems,
  listComplianceItems,
  seedDemoWorkspace,
  updateComplianceItem,
  type UpdateComplianceItemRequest,
} from "@/features/compliance/api/compliance-api";

export const complianceQueryKeys = {
  all: ["compliance"] as const,
  summary: (organizationId: string | undefined) =>
    ["compliance", "summary", organizationId] as const,
  items: (organizationId: string | undefined) =>
    ["compliance", "items", organizationId] as const,
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

export function useComplianceItemsQuery(organizationId: string | undefined) {
  return useQuery({
    queryKey: complianceQueryKeys.items(organizationId),
    queryFn: () => listComplianceItems(organizationId as string),
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

export function useUpdateComplianceItemMutation(organizationId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      request,
    }: {
      itemId: string;
      request: UpdateComplianceItemRequest;
    }) => updateComplianceItem(organizationId as string, itemId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: complianceQueryKeys.items(organizationId),
        }),
        queryClient.invalidateQueries({
          queryKey: complianceQueryKeys.summary(organizationId),
        }),
        queryClient.invalidateQueries({
          queryKey: complianceQueryKeys.dueSoon(organizationId),
        }),
        queryClient.invalidateQueries({
          queryKey: complianceQueryKeys.overdue(organizationId),
        }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
  });
}