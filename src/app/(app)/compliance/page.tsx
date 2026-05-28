"use client";

import {
  AlertTriangle,
  ClipboardCheck,
  FileClock,
  ShieldCheck,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ComplianceItemCard } from "@/features/compliance/components/compliance-item-card";
import { useComplianceItemsQuery } from "@/features/compliance/hooks/compliance-hooks";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { SeedDemoWorkspaceButton } from "@/features/dashboard/components/seed-demo-workspace-button";
import { useComplianceSummaryQuery } from "@/features/compliance/hooks/compliance-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

export default function CompliancePage() {
  const { activeOrganization, canManageCompliance } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const complianceItemsQuery = useComplianceItemsQuery(organizationId);
  const complianceSummaryQuery = useComplianceSummaryQuery(organizationId);

  const summary = complianceSummaryQuery.data;
  const items = complianceItemsQuery.data ?? [];

  const readyPercent =
    summary && summary.totalItems > 0
      ? Math.round(((summary.compliant + summary.waived) / summary.totalItems) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Compliance controls
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
              Manage your control readiness from one workspace.
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Review baseline requirements, update statuses, capture notes, and
              prepare each control for evidence review.
            </p>
          </div>

          {canManageCompliance ? (
            <SeedDemoWorkspaceButton organizationId={organizationId} />
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Ready"
          value={`${readyPercent}%`}
          description={`${summary?.compliant ?? 0} compliant controls`}
          icon={ShieldCheck}
        />
        <MetricCard
          title="Total controls"
          value={summary?.totalItems ?? 0}
          description="Controls in active workspace"
          icon={ClipboardCheck}
        />
        <MetricCard
          title="Needs work"
          value={(summary?.open ?? 0) + (summary?.inProgress ?? 0)}
          description="Open or in progress"
          icon={FileClock}
        />
        <MetricCard
          title="Non-compliant"
          value={summary?.nonCompliant ?? 0}
          description="Controls requiring attention"
          icon={AlertTriangle}
        />
      </section>

      {complianceItemsQuery.error ? (
        <ErrorAlert error={complianceItemsQuery.error} />
      ) : null}

      {complianceItemsQuery.isLoading ? (
        <Card>
          <CardContent className="p-8 text-muted-foreground">
            Loading compliance controls...
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold">No controls yet</h3>
              <p className="mt-2 text-muted-foreground">
                Seed the security baseline to create demo compliance controls for
                this workspace.
              </p>

              {canManageCompliance ? (
                <div className="mt-5">
                  <SeedDemoWorkspaceButton organizationId={organizationId} />
                </div>
              ) : (
                <Button className="mt-5" disabled>
                  Ask an admin to apply a framework
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
    </div>
  );
}