"use client";

import {
  AlertTriangle,
  Building2,
  ClipboardCheck,
  FileClock,
  ListChecks,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { MetricCard } from "@/features/dashboard/components/metric-card";
import { ManagementPageHeader } from "@/components/layout/management-page-header";
import { DashboardOpenTasks } from "@/features/dashboard/components/dashboard-open-tasks";
import { DashboardRecentAuditActivity } from "@/features/dashboard/components/dashboard-recent-audit-activity";
import { DashboardComplianceStatus } from "@/features/dashboard/components/dashboard-compliance-status";
import { DashboardDueSoonControls } from "@/features/dashboard/components/dashboard-due-soon-controls";
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
    <div className="space-y-6 sm:space-y-8">
      <ManagementPageHeader
        eyebrow={canManageCompliance ? t("managerWorkspace") : t("memberWorkspace")}
        title={t("welcome", {
          name: currentUserQuery.data?.fullName ?? t("fallbackName"),
        })}
        description={t("description")}
        icon={Building2}
        actions={
          <div className="flex w-full flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background/80 px-4 py-3 sm:min-w-64">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("activeOrganization")}
              </p>
              <p className="mt-1 max-w-56 truncate text-sm font-semibold text-foreground">
                {activeOrganization?.organizationName ?? "Loading..."}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {activeOrganization?.role ?? "—"}
              </p>
            </div>

            {canManageCompliance ? (
              <SeedDemoWorkspaceButton organizationId={organizationId} />
            ) : null}
          </div>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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



      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.85fr)] 2xl:gap-5">
        <div className="flex min-w-0 flex-col gap-5">
          <DashboardOpenTasks organizationId={organizationId} />
          <DashboardRecentAuditActivity organizationId={organizationId} />
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <DashboardComplianceStatus organizationId={organizationId} />
          <DashboardDueSoonControls organizationId={organizationId} />
        </div>
      </div>
    </div>
  );
}
