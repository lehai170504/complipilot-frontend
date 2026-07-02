"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Card, CardContent } from "@/components/ui/card";
import { OrganizationUsageCard } from "@/features/billing/components/organization-usage-card";
import { PlanChangeHistoryCard } from "@/features/billing/components/plan-change-history-card";
import { UsageLimitWarningCard } from "@/features/billing/components/usage-limit-warning-card";
import { useOrganizationUsageQuery } from "@/features/billing/hooks/billing-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

export default function BillingPage() {
  const t = useTranslations("billing");
  const tPage = useTranslations("billingPage");
  const { activeOrganization } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const usageQuery = useOrganizationUsageQuery(organizationId);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700 ease-out pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-foreground">
          <CreditCard className="size-8 text-primary" />
          {tPage("title")}
        </h1>
        <p className="text-muted-foreground">
          {tPage("description")}
        </p>
      </div>

      {usageQuery.error ? <ErrorAlert error={usageQuery.error} /> : null}

      {usageQuery.isLoading ? (
        <Card className="compliance-surface">
          <CardContent className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {t("loadingUsage")}
          </CardContent>
        </Card>
      ) : usageQuery.data ? (
        <div className="space-y-8">
          <OrganizationUsageCard usage={usageQuery.data} />

          <UsageLimitWarningCard
            usage={usageQuery.data}
            onUpgradeClick={() => {
              // Handled by modal
            }}
          />
          <PlanChangeHistoryCard organizationId={organizationId} />
        </div>
      ) : null}
    </div>
  );
}
