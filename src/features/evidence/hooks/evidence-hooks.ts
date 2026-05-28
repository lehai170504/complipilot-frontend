import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  archiveEvidence,
  createEvidence,
  listEvidence,
  type CreateEvidenceRequest,
  type ListEvidenceParams,
} from "@/features/evidence/api/evidence-api";

export const evidenceQueryKeys = {
  all: ["evidence"] as const,
  list: (params: ListEvidenceParams | undefined) =>
    ["evidence", "list", params] as const,
};

export function useEvidenceQuery(params: ListEvidenceParams | undefined) {
  return useQuery({
    queryKey: evidenceQueryKeys.list(params),
    queryFn: () => listEvidence(params as ListEvidenceParams),
    enabled: Boolean(params?.organizationId),
  });
}

export function useCreateEvidenceMutation(organizationId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateEvidenceRequest) =>
      createEvidence(organizationId as string, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: evidenceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
  });
}

export function useArchiveEvidenceMutation(organizationId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (evidenceId: string) =>
      archiveEvidence(organizationId as string, evidenceId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: evidenceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
  });
}