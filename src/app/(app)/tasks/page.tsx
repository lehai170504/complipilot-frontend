"use client";

import { useMemo, useState } from "react";
import { ListChecks, Plus } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { FilterBar } from "@/components/layout/filter-bar";
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
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import { useTasksQuery, useTaskSummaryQuery } from "@/features/tasks/hooks/tasks-hooks";
import { TaskCard } from "@/features/tasks/components/task-card";
import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog";
import type { ListTasksParams } from "@/features/tasks/api/tasks-api";
import type { ComplianceTaskPriority, ComplianceTaskStatus, SortDirection } from "@/lib/api/api-types";

const ALL = "ALL";

const taskStatusOptions: ComplianceTaskStatus[] = ["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"];
const taskPriorityOptions: ComplianceTaskPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const taskSortOptions = [
  { value: "createdAt", label: "Created date" },
  { value: "updatedAt", label: "Updated date" },
  { value: "dueDate", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "title", label: "Title" },
];

export default function TasksPage() {
  const { activeOrganization, canManageCompliance } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [priorityFilter, setPriorityFilter] = useState<string>(ALL);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("DESC");
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
            status: statusFilter !== ALL ? (statusFilter as ComplianceTaskStatus) : undefined,
            priority: priorityFilter !== ALL ? (priorityFilter as ComplianceTaskPriority) : undefined,
            sortBy: sortBy as ListTasksParams["sortBy"],
            sortDirection,
          }
        : undefined,
    [organizationId, page, search, statusFilter, priorityFilter, sortBy, sortDirection]
  );

  const tasksQuery = useTasksQuery(params);
  const taskSummaryQuery = useTaskSummaryQuery(organizationId);
  const tasks = tasksQuery.data?.items ?? [];
  const totalPages = tasksQuery.data?.totalPages ?? 0;
  const totalItems = tasksQuery.data?.totalItems ?? 0;
  const summary = taskSummaryQuery.data;

  return (
    <div className="space-y-6">
      <HeroSection summary={summary} />
      <FilterToolbar
        search={search} onSearchChange={(v) => { setSearch(v); setPage(0); }}
        statusFilter={statusFilter} onStatusChange={(v) => { setStatusFilter(v); setPage(0); }}
        priorityFilter={priorityFilter} onPriorityChange={(v) => { setPriorityFilter(v); setPage(0); }}
        sortBy={sortBy} onSortByChange={setSortBy}
        sortDirection={sortDirection} onSortDirectionChange={(v) => setSortDirection(v as SortDirection)}
        canManageCompliance={canManageCompliance}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />

      {tasksQuery.error ? <ErrorAlert error={tasksQuery.error} /> : null}

      {tasksQuery.isLoading ? (
        <Card><CardContent className="p-8 text-muted-foreground">Loading tasks...</CardContent></Card>
      ) : tasks.length === 0 ? (
        <EmptyState canManageCompliance={canManageCompliance} onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : (
        <section className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id} task={task} organizationId={organizationId}
              canManageCompliance={canManageCompliance}
              isEditing={editingTaskId === task.id}
              onStartEdit={() => setEditingTaskId(task.id)}
              onCancelEdit={() => setEditingTaskId(null)}
            />
          ))}
        </section>
      )}

      <Pagination
        page={page} totalPages={totalPages} totalItems={totalItems}
        isFetching={tasksQuery.isFetching} onPageChange={setPage}
      />

      <CreateTaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} organizationId={organizationId} />
    </div>
  );
}

function HeroSection({ summary }: { summary: { open: number; overdue: number } | undefined }) {
  return (
    <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Compliance tasks</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
            Track and resolve compliance action items.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Create tasks linked to compliance controls, assign priorities, set due dates, and track progress.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Open</p>
              <p className="mt-1 text-3xl font-bold">{summary?.open ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Overdue</p>
              <p className="mt-1 text-3xl font-bold text-red-400">{summary?.overdue ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterToolbar({
  search, onSearchChange,
  statusFilter, onStatusChange,
  priorityFilter, onPriorityChange,
  sortBy, onSortByChange,
  sortDirection, onSortDirectionChange,
  canManageCompliance, onCreateClick,
}: {
  search: string; onSearchChange: (v: string) => void;
  statusFilter: string; onStatusChange: (v: string) => void;
  priorityFilter: string; onPriorityChange: (v: string) => void;
  sortBy: string; onSortByChange: (v: string) => void;
  sortDirection: string; onSortDirectionChange: (v: string) => void;
  canManageCompliance: boolean; onCreateClick: () => void;
}) {
  return (
    <FilterBar
      actions={
        canManageCompliance ? (
          <Button onClick={onCreateClick} size="sm" type="button">
            <Plus className="mr-2 size-4" />New task
          </Button>
        ) : undefined
      }
    >
      <Input className="min-w-[180px] flex-1 lg:max-w-[280px]" placeholder="Search tasks..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="min-w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {taskStatusOptions.map((s) => <SelectItem key={s} value={s}>{s.replaceAll("_", " ")}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={priorityFilter} onValueChange={onPriorityChange}>
        <SelectTrigger className="min-w-[120px]"><SelectValue placeholder="Priority" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All</SelectItem>
          {taskPriorityOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="min-w-[120px]"><SelectValue placeholder="Sort" /></SelectTrigger>
        <SelectContent>
          {taskSortOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={sortDirection} onValueChange={onSortDirectionChange}>
        <SelectTrigger className="min-w-[80px]"><SelectValue placeholder="Dir" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="DESC">Desc</SelectItem>
          <SelectItem value="ASC">Asc</SelectItem>
        </SelectContent>
      </Select>
    </FilterBar>
  );
}

function EmptyState({ canManageCompliance, onCreateClick }: { canManageCompliance: boolean; onCreateClick: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
        <div className="rounded-3xl bg-slate-950 p-4 text-cyan-300"><ListChecks className="size-8" /></div>
        <h3 className="mt-5 text-xl font-semibold">No tasks found</h3>
        <p className="mt-2 max-w-md text-muted-foreground">
          {canManageCompliance ? "Create a task to start tracking compliance action items." : "No tasks are assigned yet."}
        </p>
        {canManageCompliance ? (
          <Button className="mt-5" onClick={onCreateClick}><Plus className="mr-2 size-4" />Create first task</Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function Pagination({
  page, totalPages, totalItems, isFetching, onPageChange,
}: {
  page: number; totalPages: number; totalItems: number; isFetching: boolean;
  onPageChange: (updater: (p: number) => number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">Page {page + 1} of {Math.max(totalPages, 1)} · {totalItems} items</p>
      <div className="flex gap-2">
        <Button disabled={page <= 0 || isFetching} onClick={() => onPageChange((p) => Math.max(p - 1, 0))} variant="outline">Previous</Button>
        <Button disabled={page + 1 >= totalPages || isFetching} onClick={() => onPageChange((p) => p + 1)} variant="outline">Next</Button>
      </div>
    </div>
  );
}
