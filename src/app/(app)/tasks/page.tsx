"use client";

import { useMemo, useState } from "react";
import { ListChecks } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { FilterBar } from "@/components/layout/filter-bar";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog";
import { TaskCard } from "@/features/tasks/components/task-card";
import {
  useTaskSummaryQuery,
  useTasksQuery,
} from "@/features/tasks/hooks/tasks-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ComplianceTaskPriority,
  ComplianceTaskStatus,
  SortDirection,
} from "@/lib/api/api-types";

const ALL = "ALL";

const taskStatusOptions: ComplianceTaskStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
];

const taskPriorityOptions: ComplianceTaskPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const taskSortOptions = [
  "createdAt",
  "updatedAt",
  "dueDate",
  "priority",
  "status",
  "title",
] as const;

type TaskSortBy = (typeof taskSortOptions)[number];

export default function TasksPage() {
  const t = useTranslations("tasksPage");
  const tCommon = useTranslations("common");
  const tStatus = useTranslations("status");
  const tSort = useTranslations("sortLabels");
  const tPagination = useTranslations("pagination");

  const { activeOrganization, canManageCompliance } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [priorityFilter, setPriorityFilter] = useState<string>(ALL);
  const [sortBy, setSortBy] = useState<TaskSortBy>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("ASC");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const params = useMemo(
    () =>
      organizationId
        ? {
            organizationId,
            page,
            size: 10,
            q: search.trim() || undefined,
            status:
              statusFilter !== ALL
                ? (statusFilter as ComplianceTaskStatus)
                : undefined,
            priority:
              priorityFilter !== ALL
                ? (priorityFilter as ComplianceTaskPriority)
                : undefined,
            sortBy,
            sortDirection,
          }
        : undefined,
    [
      organizationId,
      page,
      search,
      statusFilter,
      priorityFilter,
      sortBy,
      sortDirection,
    ],
  );

  const tasksQuery = useTasksQuery(params);
  const summaryQuery = useTaskSummaryQuery(organizationId);

  const tasks = tasksQuery.data?.items ?? [];
  const totalPages = tasksQuery.data?.totalPages ?? 0;
  const totalItems = tasksQuery.data?.totalItems ?? 0;
  const summary = summaryQuery.data;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              {t("heroEyebrow")}
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
              {t("heroTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              {t("heroDescription")}
            </p>
          </div>

          {canManageCompliance ? (
            <Button
              className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              {t("createTask")}
            </Button>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("totalTasks")}
          value={summary?.total ?? 0}
          icon={ListChecks}
        />
        <MetricCard
          title={t("open")}
          value={summary?.open ?? 0}
          icon={ListChecks}
        />
        <MetricCard
          title={t("inProgress")}
          value={summary?.inProgress ?? 0}
          icon={ListChecks}
        />
        <MetricCard
          title={t("overdue")}
          value={summary?.overdue ?? 0}
          icon={ListChecks}
        />
      </section>

      <FilterBar>
        <Input
          className="min-w-[180px] flex-1 lg:max-w-[280px]"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
            setEditingTaskId(null);
          }}
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(0);
            setEditingTaskId(null);
          }}
        >
          <SelectTrigger className="min-w-[150px]">
            <SelectValue placeholder={t("allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("allStatuses")}</SelectItem>
            {taskStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {tStatus(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(value) => {
            setPriorityFilter(value);
            setPage(0);
            setEditingTaskId(null);
          }}
        >
          <SelectTrigger className="min-w-[150px]">
            <SelectValue placeholder={t("allPriorities")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("allPriorities")}</SelectItem>
            {taskPriorityOptions.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {tStatus(priority)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as TaskSortBy)}
        >
          <SelectTrigger className="min-w-[130px]">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            {taskSortOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {tSort(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortDirection}
          onValueChange={(value) => setSortDirection(value as SortDirection)}
        >
          <SelectTrigger className="min-w-[110px]">
            <SelectValue placeholder={t("direction")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">{t("desc")}</SelectItem>
            <SelectItem value="ASC">{t("asc")}</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      {tasksQuery.error ? <ErrorAlert error={tasksQuery.error} /> : null}

      {tasksQuery.isLoading ? (
        <Card>
          <CardContent className="p-8 text-muted-foreground">
            {t("loading")}
          </CardContent>
        </Card>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="rounded-3xl bg-slate-950 p-4 text-cyan-300">
              <ListChecks className="size-8" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">{t("emptyTitle")}</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              {canManageCompliance
                ? t("emptyDescriptionManager")
                : t("emptyDescriptionMember")}
            </p>
            {canManageCompliance ? (
              <Button
                className="mt-5"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                {t("createFirstTask")}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              organizationId={organizationId}
              canManageCompliance={canManageCompliance}
              isEditing={editingTaskId === task.id}
              onStartEdit={() => setEditingTaskId(task.id)}
              onCancelEdit={() => setEditingTaskId(null)}
            />
          ))}
        </section>
      )}

      <div className="flex items-center justify-between rounded-3xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          {tPagination("summary", {
            page: page + 1,
            totalPages: Math.max(totalPages, 1),
            totalItems,
          })}
        </p>

        <div className="flex gap-2">
          <Button
            disabled={page <= 0 || tasksQuery.isFetching}
            onClick={() => {
              setPage((currentPage) => Math.max(currentPage - 1, 0));
              setEditingTaskId(null);
            }}
            variant="outline"
          >
            {tCommon("previous")}
          </Button>
          <Button
            disabled={page + 1 >= totalPages || tasksQuery.isFetching}
            onClick={() => {
              setPage((currentPage) => currentPage + 1);
              setEditingTaskId(null);
            }}
            variant="outline"
          >
            {tCommon("next")}
          </Button>
        </div>
      </div>

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        organizationId={organizationId}
      />
    </div>
  );
}
