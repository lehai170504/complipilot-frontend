import { apiClient } from "@/lib/api/api-client";
import type {
  ComplianceTask,
  ComplianceTaskStatus,
  ComplianceTaskSummaryResponse,
  PageResponse,
  SortDirection,
} from "@/lib/api/api-types";

export type ListTasksParams = {
  organizationId: string;
  page?: number;
  size?: number;
  status?: ComplianceTaskStatus;
  q?: string;
  sortBy?: "createdAt" | "updatedAt" | "dueDate" | "priority" | "status" | "title";
  sortDirection?: SortDirection;
};

function buildTasksQuery(params: ListTasksParams): string {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 20));

  if (params.status) searchParams.set("status", params.status);
  if (params.q) searchParams.set("q", params.q);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

  return searchParams.toString();
}

export async function getTaskSummary(
  organizationId: string
): Promise<ComplianceTaskSummaryResponse> {
  return apiClient<ComplianceTaskSummaryResponse>(
    `/api/v1/organizations/${organizationId}/tasks/summary`
  );
}

export async function listTasks(
  params: ListTasksParams
): Promise<PageResponse<ComplianceTask>> {
  const query = buildTasksQuery(params);

  return apiClient<PageResponse<ComplianceTask>>(
    `/api/v1/organizations/${params.organizationId}/tasks?${query}`
  );
}