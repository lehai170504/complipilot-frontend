"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ClipboardCheck,
  FileClock,
  Plus,
  ShieldCheck,
  Download,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { ManagementPageHeader } from "@/components/layout/management-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useExportComplianceItemsCsvMutation } from "@/features/exports/hooks/export-hooks";

export default function CompliancePage() {
  const t = useTranslations("compliancePage");

  const { activeOrganization, canManageCompliance } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const complianceItemsQuery = useComplianceItemsQuery(organizationId);
  const complianceSummaryQuery = useComplianceSummaryQuery(organizationId);
  const exportComplianceCsvMutation = useExportComplianceItemsCsvMutation();

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
    <div className="compliance-page-shell">
      <ManagementPageHeader
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        description={t("heroDescription")}
        icon={ShieldCheck}
        actions={canManageCompliance ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                disabled={
                  !organizationId || exportComplianceCsvMutation.isPending
                }
                onClick={() => {
                  if (!organizationId) {
                    return;
                  }

                  exportComplianceCsvMutation.mutate(organizationId);
                }}
              >
                <Download className="mr-2 size-4" />
                {exportComplianceCsvMutation.isPending
                  ? "Exporting..."
                  : "Export CSV"}
              </Button>

              <SeedDemoWorkspaceButton organizationId={organizationId} />

              <Button
                onClick={() => setIsCreateItemDialogOpen(true)}
              >
                <Plus className="mr-2 size-4" />
                {t("createItem")}
              </Button>
            </>
          ) : undefined}
      />

      <Tabs defaultValue="active" className="w-full">
        <div className="mb-5 flex items-center justify-between">
          <TabsList className="h-11 w-full justify-start rounded-xl border border-border bg-muted/50 p-1 sm:w-auto">
            <TabsTrigger className="flex-1 rounded-lg px-4 sm:flex-none" value="active">{t("activeControls")}</TabsTrigger>
            <TabsTrigger className="flex-1 rounded-lg px-4 sm:flex-none" value="frameworks">{t("frameworkTemplates")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="mt-0 space-y-6">
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
            <Card className="compliance-surface">
              <CardContent className="p-8 text-muted-foreground">
                {t("loading")}
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card className="compliance-surface">
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
            <div className="grid gap-4">
              {items.map((item) => (
                <ComplianceItemCard
                  canManageCompliance={canManageCompliance}
                  item={item}
                  key={item.id}
                  organizationId={organizationId}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="frameworks" className="mt-0">
          <FrameworksPanel
            organizationId={organizationId}
            canManageCompliance={canManageCompliance}
          />
        </TabsContent>
      </Tabs>

      <CreateComplianceItemDialog
        open={isCreateItemDialogOpen}
        onOpenChange={setIsCreateItemDialogOpen}
        organizationId={organizationId}
      />
    </div>
  );
}
