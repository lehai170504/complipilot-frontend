import { useQuery } from "@tanstack/react-query";

import {
  getTaskSummary,
  listTasks,
  type ListTasksParams,
} from "@/features/tasks/api/tasks-api";

export const taskQueryKeys = {
  summary: (organizationId: string | undefined) =>
    ["tasks", "summary", organizationId] as const,
  list: (params: ListTasksParams | undefined) =>
    ["tasks", "list", params] as const,
};

export function useTaskSummaryQuery(organizationId: string | undefined) {
  return useQuery({
    queryKey: taskQueryKeys.summary(organizationId),
    queryFn: () => getTaskSummary(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useTasksQuery(params: ListTasksParams | undefined) {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => listTasks(params as ListTasksParams),
    enabled: Boolean(params?.organizationId),
  });
}