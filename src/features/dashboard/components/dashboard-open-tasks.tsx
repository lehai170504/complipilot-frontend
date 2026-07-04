"use client";

import { useTranslations } from "next-intl";

import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { StatusPill } from "@/features/dashboard/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasksQuery } from "@/features/tasks/hooks/tasks-hooks";

function formatDate(date: string | null) {
  if (!date) return "No due date";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function DashboardOpenTasks({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const t = useTranslations("dashboard");

  const openTasksQuery = useTasksQuery(
    organizationId
      ? {
        organizationId,
        status: "OPEN",
        page: 0,
        size: 5,
        sortBy: "dueDate",
        sortDirection: "ASC",
      }
      : undefined,
  );

  return (
    <Card className="compliance-surface">
      <CardHeader>
        <CardTitle>{t("openTasksTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {openTasksQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">{t("loadingTasks")}</p>
        ) : openTasksQuery.data?.items.length ? (
          <div className="space-y-3">
            {openTasksQuery.data.items.map((task) => (
              <div
                className="rounded-2xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                key={task.id}
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <p className="font-semibold text-foreground">{task.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {task.description ?? t("noDescription")}
                    </p>
                  </div>

                  <StatusPill status={task.priority} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <StatusPill status={task.status} />
                  <span>
                    {t("due", {
                      date: formatDate(task.dueDate),
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState message={t("noOpenTasks")} />
        )}
      </CardContent>
    </Card>
  );
}
