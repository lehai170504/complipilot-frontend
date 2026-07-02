"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusPill } from "@/features/dashboard/components/status-pill";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/features/tasks/hooks/tasks-hooks";
import type {
  ComplianceTask,
  ComplianceTaskPriority,
  ComplianceTaskStatus,
} from "@/lib/api/api-types";

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

function formatDate(date: string | null, locale: string, noDueDate: string) {
  if (!date) return noDueDate;

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function TaskCard({
  task,
  organizationId,
  canManageCompliance,
  isEditing,
  onStartEdit,
  onCancelEdit,
}: {
  task: ComplianceTask;
  organizationId: string | undefined;
  canManageCompliance: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("taskCard");
  const tStatus = useTranslations("status");

  const updateMutation = useUpdateTaskMutation(organizationId);
  const deleteMutation = useDeleteTaskMutation(organizationId);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState<ComplianceTaskStatus>(task.status);
  const [priority, setPriority] = useState<ComplianceTaskPriority>(
    task.priority,
  );
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleSave() {
    updateMutation.mutate(
      {
        taskId: task.id,
        request: {
          title: title.trim(),
          description: description.trim() || null,
          status,
          priority,
          dueDate: dueDate || null,
        },
      },
      { onSuccess: () => onCancelEdit() },
    );
  }

  function handleDelete() {
    deleteMutation.mutate(task.id, {
      onSuccess: () => setShowDeleteConfirm(false),
    });
  }

  if (isEditing) {
    return (
      <Card className="compliance-surface overflow-hidden ring-2 ring-cyan-300">
        <CardContent className="p-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("fields.title")}</Label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t("fields.description")}</Label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>{t("fields.status")}</Label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as ComplianceTaskStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatusOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {tStatus(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("fields.priority")}</Label>
                <Select
                  value={priority}
                  onValueChange={(value) =>
                    setPriority(value as ComplianceTaskPriority)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskPriorityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {tStatus(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("fields.dueDate")}</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
            </div>

            {updateMutation.error ? (
              <ErrorAlert error={updateMutation.error} />
            ) : null}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onCancelEdit} type="button">
                <X className="mr-2 size-4" />
                {t("cancel")}
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || updateMutation.isPending}
                type="button"
              >
                <Save className="mr-2 size-4" />
                {updateMutation.isPending ? t("saving") : t("save")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="compliance-surface overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`flex size-10 items-center justify-center rounded-2xl ${
                  task.status === "DONE"
                    ? "bg-success/20 text-success"
                    : task.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-background text-primary"
                }`}
              >
                {task.status === "DONE" ? (
                  <CheckCircle2 className="size-5" />
                ) : task.status === "IN_PROGRESS" ? (
                  <Clock className="size-5" />
                ) : (
                  <Circle className="size-5" />
                )}
              </div>
              <StatusPill status={task.status} />
              <StatusPill status={task.priority} />
            </div>

            <h3 className="mt-3 truncate text-lg font-semibold tracking-tight">
              {task.title}
            </h3>

            {task.description ? (
              <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-muted-foreground">
                {task.description}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-4" />
                {t("due", {
                  date: formatDate(task.dueDate, locale, t("noDueDate")),
                })}
              </span>
              {task.assigneeEmail ? (
                <Badge variant="secondary">{task.assigneeEmail}</Badge>
              ) : null}
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {t("created", {
                date: formatDateTime(task.createdAt, locale),
                email: task.createdByEmail,
              })}
            </p>
          </div>

          {canManageCompliance ? (
            <div className="flex shrink-0 flex-col gap-2">
              <Button onClick={onStartEdit} size="sm" variant="outline">
                {t("edit")}
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                size="sm"
                variant="outline"
              >
                <Trash2 className="mr-2 size-4" />
                {t("delete")}
              </Button>
            </div>
          ) : null}
        </div>

        {showDeleteConfirm ? (
          <div className="border-t bg-destructive/10 p-4">
            <p className="text-sm font-medium text-red-800">
              {t("deleteConfirm", { title: task.title })}
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                size="sm"
              >
                {deleteMutation.isPending ? t("deleting") : t("confirm")}
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                size="sm"
                variant="outline"
              >
                {t("cancel")}
              </Button>
            </div>

            {deleteMutation.error ? (
              <div className="mt-2">
                <ErrorAlert error={deleteMutation.error} />
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
