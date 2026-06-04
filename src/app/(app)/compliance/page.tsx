"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ClipboardCheck,
  FileClock,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ComplianceItemCard } from "@/features/compliance/components/compliance-item-card";
import { CreateComplianceItemDialog } from "@/features/compliance/components/create-compliance-item-dialog";
import { FrameworksPanel } from "@/features/compliance/components/frameworks-panel";
import {
  useComplianceItemsQuery,
  useComplianceSummaryQuery,
} from "@/features/compliance/hooks/compliance-hooks";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { SeedDemoWorkspaceButton } from "@/features/dashboard/components/seed-demo-workspace-button";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

export default function CompliancePage() {
  const t = useTranslations("compliancePage");

  const { activeOrganization, canManageCompliance } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const complianceItemsQuery = useComplianceItemsQuery(organizationId);
  const complianceSummaryQuery = useComplianceSummaryQuery(organizationId);

  const [isCreateItemDialogOpen, setIsCreateItemDialogOpen] = useState(false);

  const summary = complianceSummaryQuery.data;
  const items = complianceItemsQuery.data ?? [];

  const readyPercent =
    summary && summary.totalItems > 0
      ? Math.round(
          ((summary.compliant + summary.waived) / summary.totalItems) * 100,
        )
      : 0;

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
            <div className="flex flex-col gap-2 sm:flex-row">
              <SeedDemoWorkspaceButton organizationId={organizationId} />
              <Button
                onClick={() => setIsCreateItemDialogOpen(true)}
                variant="outline"
                className="border-cyan-300/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Plus className="mr-2 size-4" />
                {t("createItem")}
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("ready")}
          value={`${readyPercent}%`}
          description={t("readyDescription", {
            count: summary?.compliant ?? 0,
          })}
          icon={ShieldCheck}
        />
        <MetricCard
          title={t("totalControls")}
          value={summary?.totalItems ?? 0}
          description={t("totalControlsDescription")}
          icon={ClipboardCheck}
        />
        <MetricCard
          title={t("needsWork")}
          value={(summary?.open ?? 0) + (summary?.inProgress ?? 0)}
          description={t("needsWorkDescription")}
          icon={FileClock}
        />
        <MetricCard
          title={t("nonCompliant")}
          value={summary?.nonCompliant ?? 0}
          description={t("nonCompliantDescription")}
          icon={AlertTriangle}
        />
      </section>

      {complianceItemsQuery.error ? (
        <ErrorAlert error={complianceItemsQuery.error} />
      ) : null}

      {complianceItemsQuery.isLoading ? (
        <Card>
          <CardContent className="p-8 text-muted-foreground">
            {t("loading")}
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold">{t("emptyTitle")}</h3>
              <p className="mt-2 text-muted-foreground">
                {t("emptyDescription")}
              </p>

              {canManageCompliance ? (
                <div className="mt-5">
                  <SeedDemoWorkspaceButton organizationId={organizationId} />
                </div>
              ) : (
                <Button className="mt-5" disabled>
                  {t("askAdmin")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-4">
          {items.map((item) => (
            <ComplianceItemCard
              canManageCompliance={canManageCompliance}
              item={item}
              key={item.id}
              organizationId={organizationId}
            />
          ))}
        </section>
      )}

      <FrameworksPanel
        organizationId={organizationId}
        canManageCompliance={canManageCompliance}
      />

      <CreateComplianceItemDialog
        open={isCreateItemDialogOpen}
        onOpenChange={setIsCreateItemDialogOpen}
        organizationId={organizationId}
      />
    </div>
  );
}
