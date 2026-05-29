import { apiClient } from "@/lib/api/api-client";
import type {
  ComplianceTask,
  ComplianceTaskPriority,
  ComplianceTaskStatus,
  ComplianceTaskSummaryResponse,
  CreateComplianceTaskRequest,
  PageResponse,
  SortDirection,
} from "@/lib/api/api-types";

export type ListTasksParams = {
  organizationId: string;
  page?: number;
  size?: number;
  status?: ComplianceTaskStatus;
  priority?: ComplianceTaskPriority;
  assigneeUserId?: string;
  complianceItemId?: string;
  q?: string;
  sortBy?: "createdAt" | "updatedAt" | "dueDate" | "priority" | "status" | "title";
  sortDirection?: SortDirection;
};

export type UpdateTaskRequest = {
  title: string;
  description?: string | null;
  assigneeUserId?: string | null;
  priority?: ComplianceTaskPriority | null;
  dueDate?: string | null;
  status?: ComplianceTaskStatus | null;
};

function buildTasksQuery(params: ListTasksParams): string {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 20));

  if (params.status) searchParams.set("status", params.status);
  if (params.priority) searchParams.set("priority", params.priority);
  if (params.assigneeUserId) searchParams.set("assigneeUserId", params.assigneeUserId);
  if (params.complianceItemId) searchParams.set("complianceItemId", params.complianceItemId);
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

export async function createTask(
  organizationId: string,
  request: CreateComplianceTaskRequest
): Promise<ComplianceTask> {
  return apiClient<ComplianceTask>(
    `/api/v1/organizations/${organizationId}/tasks`,
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
}

export async function updateTask(
  organizationId: string,
  taskId: string,
  request: UpdateTaskRequest
): Promise<ComplianceTask> {
  return apiClient<ComplianceTask>(
    `/api/v1/organizations/${organizationId}/tasks/${taskId}`,
    {
      method: "PATCH",
      body: JSON.stringify(request),
    }
  );
}

export async function deleteTask(
  organizationId: string,
  taskId: string
): Promise<void> {
  return apiClient<void>(
    `/api/v1/organizations/${organizationId}/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );
}