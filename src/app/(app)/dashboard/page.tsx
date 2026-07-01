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
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-card via-background to-card p-8 text-foreground shadow-2xl ring-1 ring-border sm:p-12">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[20rem] w-[20rem] rounded-full bg-accent/10 blur-[80px]" />

        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {canManageCompliance
                ? t("managerWorkspace")
                : t("memberWorkspace")}
            </Badge>
            <h2 className="mt-4 max-w-3xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl lg:text-5xl">
              {t("welcome", {
                name: currentUserQuery.data?.fullName ?? t("fallbackName"),
              })}
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div className="min-w-[280px] space-y-4 rounded-3xl border border-border/50 bg-muted/30 p-5 backdrop-blur-md transition-colors hover:bg-muted/50">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("activeOrganization")}
              </p>
              <p className="mt-1 text-xl font-bold text-foreground">
                {activeOrganization?.organizationName ?? "Loading..."}
              </p>
              <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {activeOrganization?.role ?? "—"}
              </div>
            </div>

            {canManageCompliance ? (
              <SeedDemoWorkspaceButton organizationId={organizationId} />
            ) : null}
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

        <Card>
          <CardHeader>
            <CardTitle>{t("complianceStatus")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
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
                  className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                  key={label}
                >
                  <span className="text-sm font-medium text-muted-foreground">{label}</span>
                  <span className="font-bold text-foreground">{value}</span>
                </div>
              ))}
            </div>
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
                    className="rounded-2xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                    key={item.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
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
                    className="rounded-2xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                    key={event.id}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ScrollText className="size-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{event.summary}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          <span className="font-medium">{event.actorEmail ?? "System"}</span> ·{" "}
                          {formatDateTime(event.createdAt)}
                        </p>
                        <div className="mt-2 inline-flex rounded-full border border-border/50 bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {event.action} / {event.resourceType}
                        </div>
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
