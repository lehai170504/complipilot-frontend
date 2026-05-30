import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  archiveEvidence,
  createEvidence,
  createFileEvidence,
  createEvidenceDownloadUrl,
  listEvidence,
  updateEvidence,
  linkEvidenceToComplianceItem,
  listEvidenceLinks,
  unlinkEvidence,
  type CreateEvidenceRequest,
  type CreateFileEvidenceRequest,
  type ListEvidenceParams,
  analyzeEvidenceWithAi,
  getLatestEvidenceAiAnalysis,
} from "@/features/evidence/api/evidence-api";
import type { UpdateEvidenceDocumentRequest } from "@/lib/api/api-types";
import { toast } from "@/lib/toast";

export const evidenceQueryKeys = {
  all: ["evidence"] as const,
  list: (params: ListEvidenceParams | undefined) =>
    ["evidence", "list", params] as const,
  links: (organizationId: string | undefined, itemId: string | undefined) =>
    ["evidence", "links", organizationId, itemId] as const,
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
      toast.success("Evidence created");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: evidenceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to create evidence");
    },
  });
}

export function useCreateFileEvidenceMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateFileEvidenceRequest) =>
      createFileEvidence(organizationId as string, request),
    onSuccess: async () => {
      toast.success("File uploaded & evidence created");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: evidenceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to upload file");
    },
  });
}

export function useUpdateEvidenceMutation(organizationId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      evidenceId,
      request,
    }: {
      evidenceId: string;
      request: UpdateEvidenceDocumentRequest;
    }) => updateEvidence(organizationId as string, evidenceId, request),
    onSuccess: async () => {
      toast.success("Evidence updated");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: evidenceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to update evidence");
    },
  });
}

export function useCreateEvidenceDownloadUrlMutation(
  organizationId: string | undefined,
) {
  return useMutation({
    mutationFn: (evidenceId: string) =>
      createEvidenceDownloadUrl(organizationId as string, evidenceId),
  });
}

export function useArchiveEvidenceMutation(organizationId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (evidenceId: string) =>
      archiveEvidence(organizationId as string, evidenceId),
    onSuccess: async () => {
      toast.success("Evidence archived");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: evidenceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to archive evidence");
    },
  });
}

export function useEvidenceLinksQuery(
  organizationId: string | undefined,
  itemId: string | undefined,
) {
  return useQuery({
    queryKey: evidenceQueryKeys.links(organizationId, itemId),
    queryFn: () =>
      listEvidenceLinks(organizationId as string, itemId as string),
    enabled: Boolean(organizationId && itemId),
  });
}

export function useLinkEvidenceMutation(
  organizationId: string | undefined,
  itemId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (evidenceDocumentId: string) =>
      linkEvidenceToComplianceItem(
        organizationId as string,
        itemId as string,
        evidenceDocumentId,
      ),
    onSuccess: async () => {
      toast.success("Evidence linked");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: evidenceQueryKeys.links(organizationId, itemId),
        }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to link evidence");
    },
  });
}

export function useUnlinkEvidenceMutation(
  organizationId: string | undefined,
  itemId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (evidenceDocumentId: string) =>
      unlinkEvidence(
        organizationId as string,
        itemId as string,
        evidenceDocumentId,
      ),
    onSuccess: async () => {
      toast.success("Evidence unlinked");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: evidenceQueryKeys.links(organizationId, itemId),
        }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to unlink evidence");
    },
  });
}

export function useAnalyzeEvidenceWithAiMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (evidenceId: string) => {
      if (!organizationId) {
        throw new Error("Missing active organization.");
      }

      return analyzeEvidenceWithAi(organizationId, evidenceId);
    },
    onSuccess: (data, evidenceId) => {
      queryClient.setQueryData(
        ["evidence-ai-analysis", organizationId, evidenceId, "latest"],
        data,
      );
    },
  });
}

export function useLatestEvidenceAiAnalysisQuery(
  organizationId: string | undefined,
  evidenceId: string | undefined,
) {
  return useQuery({
    queryKey: ["evidence-ai-analysis", organizationId, evidenceId, "latest"],
    queryFn: () => {
      if (!organizationId || !evidenceId) {
        throw new Error("Missing organization or evidence.");
      }

      return getLatestEvidenceAiAnalysis(organizationId, evidenceId);
    },
    enabled: Boolean(organizationId && evidenceId),
    retry: false,
  });
}
