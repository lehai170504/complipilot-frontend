"use client";

import {
  AlertTriangle,
  ClipboardCheck,
  FileClock,
  ListChecks,
  ScrollText,
} from "lucide-react";

import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { StatusPill } from "@/features/dashboard/components/status-pill";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth-hooks";
import {
  useComplianceSummaryQuery,
  useDueSoonComplianceItemsQuery,
  useOverdueComplianceItemsQuery,
} from "@/features/compliance/hooks/compliance-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import {
  useTaskSummaryQuery,
  useTasksQuery,
} from "@/features/tasks/hooks/tasks-hooks";
import { useAuditEventsQuery } from "@/features/audit/hooks/audit-hooks";
import { SeedDemoWorkspaceButton } from "@/features/dashboard/components/seed-demo-workspace-button";

function formatDate(date: string | null) {
  if (!date) return "No due date";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function DashboardPage() {
  const currentUserQuery = useCurrentUserQuery();
  const { activeOrganization, canManageCompliance } = useActiveOrganization();

  const organizationId = activeOrganization?.organizationId;

  const complianceSummaryQuery = useComplianceSummaryQuery(organizationId);
  const dueSoonQuery = useDueSoonComplianceItemsQuery(organizationId);
  const overdueQuery = useOverdueComplianceItemsQuery(organizationId);
  const taskSummaryQuery = useTaskSummaryQuery(organizationId);

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

  const auditEventsQuery = useAuditEventsQuery(
    organizationId
      ? {
          organizationId,
          page: 0,
          size: 5,
          sortBy: "createdAt",
          sortDirection: "DESC",
        }
      : undefined,
  );

  const complianceSummary = complianceSummaryQuery.data;
  const taskSummary = taskSummaryQuery.data;

  const complianceReadyPercent =
    complianceSummary && complianceSummary.totalItems > 0
      ? Math.round(
          ((complianceSummary.compliant + complianceSummary.waived) /
            complianceSummary.totalItems) *
            100,
        )
      : 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div className="relative">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Badge className="bg-cyan-300/15 text-cyan-200 hover:bg-cyan-300/15">
                {canManageCompliance ? "Manager workspace" : "Member workspace"}
              </Badge>
              <h2 className="mt-4 max-w-3xl truncate text-3xl font-bold tracking-tight md:text-4xl">
                Welcome back,{" "}
                {currentUserQuery.data?.fullName ?? "compliance lead"}.
              </h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Monitor controls, evidence readiness, open tasks, and recent
                audit activity for your active organization.
              </p>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/6 p-4">
              <div>
                <p className="text-sm text-slate-400">Active organization</p>
                <p className="mt-1 text-lg font-semibold">
                  {activeOrganization?.organizationName ?? "Loading..."}
                </p>
                <p className="mt-1 text-sm text-cyan-200">
                  {activeOrganization?.role ?? "—"}
                </p>
              </div>

              {canManageCompliance ? (
                <SeedDemoWorkspaceButton organizationId={organizationId} />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Compliance ready"
          value={`${complianceReadyPercent}%`}
          description={`${complianceSummary?.compliant ?? 0} compliant / ${
            complianceSummary?.totalItems ?? 0
          } total`}
          icon={ClipboardCheck}
        />

        <MetricCard
          title="Open tasks"
          value={taskSummary?.open ?? 0}
          description={`${taskSummary?.overdue ?? 0} overdue tasks`}
          icon={ListChecks}
        />

        <MetricCard
          title="Due soon"
          value={dueSoonQuery.data?.length ?? 0}
          description="Controls due in the next 14 days"
          icon={FileClock}
        />

        <MetricCard
          title="Overdue"
          value={overdueQuery.data?.length ?? 0}
          description="Controls past due date"
          icon={AlertTriangle}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Open tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {openTasksQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading tasks...</p>
            ) : openTasksQuery.data?.items.length ? (
              <div className="space-y-3">
                {openTasksQuery.data.items.map((task) => (
                  <div
                    className="rounded-2xl border bg-slate-50 p-4"
                    key={task.id}
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <p className="font-semibold">{task.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {task.description ?? "No description"}
                        </p>
                      </div>

                      <StatusPill status={task.priority} />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <StatusPill status={task.status} />
                      <span>Due {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState message="No open tasks found for this workspace." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Open", complianceSummary?.open ?? 0],
              ["In progress", complianceSummary?.inProgress ?? 0],
              ["Ready for review", complianceSummary?.readyForReview ?? 0],
              ["Compliant", complianceSummary?.compliant ?? 0],
              ["Non-compliant", complianceSummary?.nonCompliant ?? 0],
              ["Waived", complianceSummary?.waived ?? 0],
            ].map(([label, value]) => (
              <div
                className="flex items-center justify-between rounded-2xl border bg-slate-50 px-4 py-3"
                key={label}
              >
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Due soon controls</CardTitle>
          </CardHeader>
          <CardContent>
            {dueSoonQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading due soon controls...
              </p>
            ) : dueSoonQuery.data?.length ? (
              <div className="space-y-3">
                {dueSoonQuery.data.slice(0, 5).map((item) => (
                  <div
                    className="rounded-2xl border bg-slate-50 p-4"
                    key={item.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {item.requirementCode} · {item.requirementTitle}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Due {formatDate(item.dueDate)}
                        </p>
                      </div>
                      <StatusPill status={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState message="No controls due soon." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent audit activity</CardTitle>
          </CardHeader>
          <CardContent>
            {auditEventsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading audit events...
              </p>
            ) : auditEventsQuery.data?.items.length ? (
              <div className="space-y-3">
                {auditEventsQuery.data.items.map((event) => (
                  <div
                    className="rounded-2xl border bg-slate-50 p-4"
                    key={event.id}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-2xl bg-slate-950 p-2 text-cyan-300">
                        <ScrollText className="size-4" />
                      </div>
                      <div>
                        <p className="font-semibold">{event.summary}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.actorEmail ?? "System"} ·{" "}
                          {formatDateTime(event.createdAt)}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {event.action} / {event.resourceType}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState message="No audit events yet." />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
