import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getTaskSummary,
  listTasks,
  updateTask,
  type ListTasksParams,
  type UpdateTaskRequest,
} from "@/features/tasks/api/tasks-api";
import type { CreateComplianceTaskRequest } from "@/lib/api/api-types";
import { toast } from "@/lib/toast";

export const taskQueryKeys = {
  all: ["tasks"] as const,
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

export function useCreateTaskMutation(organizationId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateComplianceTaskRequest) =>
      createTask(organizationId as string, request),
    onSuccess: async () => {
      toast.success("Task created");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });
}

export function useUpdateTaskMutation(organizationId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      request,
    }: {
      taskId: string;
      request: UpdateTaskRequest;
    }) => updateTask(organizationId as string, taskId, request),
    onSuccess: async () => {
      toast.success("Task updated");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
}

export function useDeleteTaskMutation(organizationId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) =>
      deleteTask(organizationId as string, taskId),
    onSuccess: async () => {
      toast.success("Task deleted");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["audit-events"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });
}