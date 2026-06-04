import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  applyFrameworkToOrganization,
  createComplianceItem,
  createFramework,
  createRequirement,
  getComplianceSummary,
  getDueSoonComplianceItems,
  getOverdueComplianceItems,
  listComplianceItems,
  listFrameworks,
  listRequirements,
  seedDemoWorkspace,
  suggestMissingEvidenceWithAi,
  updateComplianceItem,
  type CreateComplianceItemRequest,
  type CreateFrameworkRequest,
  type CreateRequirementRequest,
  type UpdateComplianceItemRequest,
} from "@/features/compliance/api/compliance-api";
import { toast } from "@/lib/toast";

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
  frameworks: ["compliance", "frameworks"] as const,
  requirements: (frameworkId: string | undefined) =>
    ["compliance", "requirements", frameworkId] as const,
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
  organizationId: string | undefined,
) {
  return useQuery({
    queryKey: complianceQueryKeys.dueSoon(organizationId),
    queryFn: () => getDueSoonComplianceItems(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useOverdueComplianceItemsQuery(
  organizationId: string | undefined,
) {
  return useQuery({
    queryKey: complianceQueryKeys.overdue(organizationId),
    queryFn: () => getOverdueComplianceItems(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useFrameworksQuery() {
  return useQuery({
    queryKey: complianceQueryKeys.frameworks,
    queryFn: listFrameworks,
  });
}

export function useRequirementsQuery(frameworkId: string | undefined) {
  return useQuery({
    queryKey: complianceQueryKeys.requirements(frameworkId),
    queryFn: () => listRequirements(frameworkId as string),
    enabled: Boolean(frameworkId),
  });
}

export function useSeedDemoWorkspaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: string) => seedDemoWorkspace(organizationId),
    onSuccess: async (data) => {
      toast.success("Workspace seeded", {
        description: `${data.createdCount} controls created, ${data.skippedCount} skipped.`,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["compliance"] }),
        queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to seed workspace");
    },
  });
}

export function useUpdateComplianceItemMutation(
  organizationId: string | undefined,
) {
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
      toast.success("Control updated");
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
    onError: () => {
      toast.error("Failed to update control");
    },
  });
}

export function useCreateComplianceItemMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateComplianceItemRequest) =>
      createComplianceItem(organizationId as string, request),
    onSuccess: async () => {
      toast.success("Compliance item created");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: complianceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to create compliance item");
    },
  });
}

export function useCreateFrameworkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateFrameworkRequest) => createFramework(request),
    onSuccess: async () => {
      toast.success("Framework created");
      await queryClient.invalidateQueries({
        queryKey: complianceQueryKeys.frameworks,
      });
    },
    onError: () => {
      toast.error("Failed to create framework");
    },
  });
}

export function useCreateRequirementMutation(frameworkId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRequirementRequest) =>
      createRequirement(frameworkId as string, request),
    onSuccess: async () => {
      toast.success("Requirement created");
      await queryClient.invalidateQueries({
        queryKey: complianceQueryKeys.requirements(frameworkId),
      });
    },
    onError: () => {
      toast.error("Failed to create requirement");
    },
  });
}

export function useSuggestMissingEvidenceWithAiMutation(
  organizationId: string | undefined,
) {
  return useMutation({
    mutationFn: (itemId: string) => {
      if (!organizationId) {
        throw new Error("Missing active organization.");
      }

      return suggestMissingEvidenceWithAi(organizationId, itemId);
    },
  });
}

export function useApplyFrameworkToOrganizationMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (frameworkId: string) => {
      if (!organizationId) {
        throw new Error("Missing active organization.");
      }

      return applyFrameworkToOrganization(organizationId, frameworkId);
    },
    onSuccess: async (data) => {
      toast.success("Framework applied", {
        description: `${data.createdCount} controls created, ${data.skippedCount} skipped.`,
      });

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
        queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to apply framework");
    },
  });
}
