import { apiClient } from "@/lib/api/api-client";
import type {
  AuditAction,
  AuditEvent,
  AuditResourceType,
  PageResponse,
  SortDirection,
} from "@/lib/api/api-types";

export type ListAuditEventsParams = {
  organizationId: string;
  page?: number;
  size?: number;
  action?: AuditAction;
  resourceType?: AuditResourceType;
  q?: string;
  sortBy?: "createdAt" | "action" | "resourceType" | "actorEmail";
  sortDirection?: SortDirection;
};

function buildAuditQuery(params: ListAuditEventsParams): string {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 20));

  if (params.action) searchParams.set("action", params.action);
  if (params.resourceType) searchParams.set("resourceType", params.resourceType);
  if (params.q) searchParams.set("q", params.q);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

  return searchParams.toString();
}

export async function listAuditEvents(
  params: ListAuditEventsParams
): Promise<PageResponse<AuditEvent>> {
  const query = buildAuditQuery(params);

  return apiClient<PageResponse<AuditEvent>>(
    `/api/v1/organizations/${params.organizationId}/audit-events?${query}`
  );
}