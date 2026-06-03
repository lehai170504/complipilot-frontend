"use client";

import {
  AlertTriangle,
  ClipboardCheck,
  FileClock,
  ListChecks,
  ScrollText,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { StatusPill } from "@/features/dashboard/components/status-pill";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeedDemoWorkspaceButton } from "@/features/dashboard/components/seed-demo-workspace-button";
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
import { ErrorAlert } from "@/components/feedback/error-alert";
import { OrganizationUsageCard } from "@/features/billing/components/organization-usage-card";
import { useOrganizationUsageQuery } from "@/features/billing/hooks/billing-hooks";

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
  const t = useTranslations("dashboard");

  const currentUserQuery = useCurrentUserQuery();
  const { activeOrganization, canManageCompliance } = useActiveOrganization();

  const organizationId = activeOrganization?.organizationId;

  const complianceSummaryQuery = useComplianceSummaryQuery(organizationId);
  const dueSoonQuery = useDueSoonComplianceItemsQuery(organizationId);
  const overdueQuery = useOverdueComplianceItemsQuery(organizationId);
  const taskSummaryQuery = useTaskSummaryQuery(organizationId);
  const organizationUsageQuery = useOrganizationUsageQuery(organizationId);

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
                {canManageCompliance
                  ? t("managerWorkspace")
                  : t("memberWorkspace")}
              </Badge>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
                {t("welcome", {
                  name: currentUserQuery.data?.fullName ?? t("fallbackName"),
                })}
              </h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                {t("description")}
              </p>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/6 p-4">
              <div>
                <p className="text-sm text-slate-400">
                  {t("activeOrganization")}
                </p>
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
          title={t("complianceReady")}
          value={`${complianceReadyPercent}%`}
          description={t("complianceReadyDescription", {
            compliant: complianceSummary?.compliant ?? 0,
            total: complianceSummary?.totalItems ?? 0,
          })}
          icon={ClipboardCheck}
        />

        <MetricCard
          title={t("openTasks")}
          value={taskSummary?.open ?? 0}
          description={t("openTasksDescription", {
            overdue: taskSummary?.overdue ?? 0,
          })}
          icon={ListChecks}
        />

        <MetricCard
          title={t("dueSoon")}
          value={dueSoonQuery.data?.length ?? 0}
          description={t("dueSoonDescription")}
          icon={FileClock}
        />

        <MetricCard
          title={t("overdue")}
          value={overdueQuery.data?.length ?? 0}
          description={t("overdueDescription")}
          icon={AlertTriangle}
        />
      </section>

      <section>
        {organizationUsageQuery.isLoading ? (
          <Card>
            <CardContent className="p-5 text-sm text-muted-foreground">
              Loading plan usage...
            </CardContent>
          </Card>
        ) : organizationUsageQuery.error ? (
          <ErrorAlert error={organizationUsageQuery.error} />
        ) : organizationUsageQuery.data ? (
          <OrganizationUsageCard usage={organizationUsageQuery.data} />
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>{t("openTasksTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {openTasksQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                {t("loadingTasks")}
              </p>
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
                          {task.description ?? t("noDescription")}
                        </p>
                      </div>

                      <StatusPill status={task.priority} />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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

        <Card>
          <CardHeader>
            <CardTitle>{t("complianceStatus")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              [t("statusBreakdown.open"), complianceSummary?.open ?? 0],
              [
                t("statusBreakdown.inProgress"),
                complianceSummary?.inProgress ?? 0,
              ],
              [
                t("statusBreakdown.readyForReview"),
                complianceSummary?.readyForReview ?? 0,
              ],
              [
                t("statusBreakdown.compliant"),
                complianceSummary?.compliant ?? 0,
              ],
              [
                t("statusBreakdown.nonCompliant"),
                complianceSummary?.nonCompliant ?? 0,
              ],
              [t("statusBreakdown.waived"), complianceSummary?.waived ?? 0],
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
            <CardTitle>{t("dueSoonControls")}</CardTitle>
          </CardHeader>
          <CardContent>
            {dueSoonQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                {t("loadingDueSoon")}
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
                          {t("due", {
                            date: formatDate(item.dueDate),
                          })}
                        </p>
                      </div>
                      <StatusPill status={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState message={t("noDueSoon")} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("recentAuditActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            {auditEventsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                {t("loadingAuditEvents")}
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
              <DashboardEmptyState message={t("noAuditEvents")} />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
