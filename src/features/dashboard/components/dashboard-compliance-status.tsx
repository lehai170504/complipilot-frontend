"use client";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useComplianceSummaryQuery } from "@/features/compliance/hooks/compliance-hooks";

export function DashboardComplianceStatus({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const t = useTranslations("dashboard");

  const complianceSummaryQuery = useComplianceSummaryQuery(organizationId);
  const complianceSummary = complianceSummaryQuery.data;

  return (
    <Card className="compliance-surface">
      <CardHeader>
        <CardTitle>{t("complianceStatus")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
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
              className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
              key={label as string}
            >
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <span className="font-bold text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
