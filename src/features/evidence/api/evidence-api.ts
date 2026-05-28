import { apiClient } from "@/lib/api/api-client";
import type {
  EvidenceDocument,
  EvidenceSourceType,
  EvidenceType,
  PageResponse,
  SortDirection,
} from "@/lib/api/api-types";

export type EvidenceSortBy =
  | "createdAt"
  | "updatedAt"
  | "title"
  | "evidenceType"
  | "sourceType";

export type ListEvidenceParams = {
  organizationId: string;
  page?: number;
  size?: number;
  evidenceType?: EvidenceType;
  sourceType?: EvidenceSourceType;
  q?: string;
  sortBy?: EvidenceSortBy;
  sortDirection?: SortDirection;
};

export type CreateEvidenceRequest = {
  title: string;
  description?: string | null;
  evidenceType: EvidenceType;
  sourceType: EvidenceSourceType;
  fileObjectKey?: string | null;
  externalUrl?: string | null;
  contentType?: string | null;
  fileSizeBytes?: number | null;
};

function buildEvidenceQuery(params: ListEvidenceParams): string {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 20));

  if (params.evidenceType) {
    searchParams.set("evidenceType", params.evidenceType);
  }

  if (params.sourceType) {
    searchParams.set("sourceType", params.sourceType);
  }

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (params.sortDirection) {
    searchParams.set("sortDirection", params.sortDirection);
  }

  return searchParams.toString();
}

export async function listEvidence(
  params: ListEvidenceParams
): Promise<PageResponse<EvidenceDocument>> {
  const query = buildEvidenceQuery(params);

  return apiClient<PageResponse<EvidenceDocument>>(
    `/api/v1/organizations/${params.organizationId}/evidence?${query}`
  );
}

export async function createEvidence(
  organizationId: string,
  request: CreateEvidenceRequest
): Promise<EvidenceDocument> {
  return apiClient<EvidenceDocument>(
    `/api/v1/organizations/${organizationId}/evidence`,
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
}

export async function archiveEvidence(
  organizationId: string,
  evidenceId: string
): Promise<void> {
  return apiClient<void>(
    `/api/v1/organizations/${organizationId}/evidence/${evidenceId}`,
    {
      method: "DELETE",
    }
  );
}