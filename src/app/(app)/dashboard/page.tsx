"use client";

import {
  AlertTriangle,
  ClipboardCheck,
  FileClock,
  ListChecks,
  ScrollText,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { MetricCard } from "@/features/dashboard/components/metric-card";
import { DashboardOpenTasks } from "@/features/dashboard/components/dashboard-open-tasks";
import { DashboardRecentAuditActivity } from "@/features/dashboard/components/dashboard-recent-audit-activity";
import { DashboardComplianceStatus } from "@/features/dashboard/components/dashboard-compliance-status";
import { DashboardDueSoonControls } from "@/features/dashboard/components/dashboard-due-soon-controls";
import { Badge } from "@/components/ui/badge";

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
} from "@/features/tasks/hooks/tasks-hooks";


export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const currentUserQuery = useCurrentUserQuery();
  const { activeOrganization, canManageCompliance } = useActiveOrganization();

  const organizationId = activeOrganization?.organizationId;

  const complianceSummaryQuery = useComplianceSummaryQuery(organizationId);
  const dueSoonQuery = useDueSoonComplianceItemsQuery(organizationId);
  const overdueQuery = useOverdueComplianceItemsQuery(organizationId);
  const taskSummaryQuery = useTaskSummaryQuery(organizationId);

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
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
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



      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        {/* Main Column */}
        <div className="flex flex-col gap-6">
          <DashboardOpenTasks organizationId={organizationId} />
          <DashboardRecentAuditActivity organizationId={organizationId} />
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-6">
          <DashboardComplianceStatus organizationId={organizationId} />
          <DashboardDueSoonControls organizationId={organizationId} />
        </div>
      </div>
    </div>
  );
}
