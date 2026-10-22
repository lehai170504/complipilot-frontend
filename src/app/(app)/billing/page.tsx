"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Card, CardContent } from "@/components/ui/card";
import { ManagementPageHeader } from "@/components/layout/management-page-header";
import { OrganizationUsageCard } from "@/features/billing/components/organization-usage-card";

import { UsageLimitWarningCard } from "@/features/billing/components/usage-limit-warning-card";
import { useOrganizationUsageQuery } from "@/features/billing/hooks/billing-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

export default function BillingPage() {
  const t = useTranslations("billing");
  const tPage = useTranslations("billingPage");
  const tHeader = useTranslations("managementHeaders.billingAccessDenied");
  const { activeOrganization, canManageBilling } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const usageQuery = useOrganizationUsageQuery(organizationId);

  if (!canManageBilling) {
    return (
      <div className="compliance-page-shell">
        <ManagementPageHeader
          eyebrow={tHeader("eyebrow")}
          title={tHeader("title")}
          description={tHeader("description")}
          icon={CreditCard}
        />
      </div>
    );
  }

  return (
    <div className="compliance-page-shell">
      <ManagementPageHeader
        eyebrow="SaaS operations"
        title={tPage("title")}
        description={tPage("description")}
        icon={CreditCard}
      />

      {usageQuery.error ? <ErrorAlert error={usageQuery.error} /> : null}

      {usageQuery.isLoading ? (
        <Card className="compliance-surface">
          <CardContent className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {t("loadingUsage")}
          </CardContent>
        </Card>
      ) : usageQuery.data ? (
        <div className="flex flex-col gap-6">
          <UsageLimitWarningCard
            usage={usageQuery.data}
            onUpgradeClick={() => {
              // Usually we'd trigger the modal here. For now, open mail client or contact sales.
              window.location.href = "mailto:sales@complipilot.com?subject=Upgrade Plan";
            }}
          />

          <div className="flex flex-col gap-6">
            <OrganizationUsageCard usage={usageQuery.data} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
