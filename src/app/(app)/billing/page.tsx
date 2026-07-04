"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Card, CardContent } from "@/components/ui/card";
import { OrganizationUsageCard } from "@/features/billing/components/organization-usage-card";

import { UsageLimitWarningCard } from "@/features/billing/components/usage-limit-warning-card";
import { useOrganizationUsageQuery } from "@/features/billing/hooks/billing-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

export default function BillingPage() {
  const t = useTranslations("billing");
  const tPage = useTranslations("billingPage");
  const { activeOrganization, canManageBilling } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const usageQuery = useOrganizationUsageQuery(organizationId);

  if (!canManageBilling) {
    return (
      <div className="compliance-page-shell">
        <section className="compliance-hero">
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-destructive">
                Access Denied
              </p>
              <h2 className="mt-4 flex items-center gap-3 max-w-3xl text-2xl font-bold tracking-tight text-foreground">
                Insufficient Permissions
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                Only the Owner of this workspace can manage billing and subscriptions.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="compliance-page-shell">
      <section className="compliance-hero">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              SaaS Operations
            </p>
            <h2 className="mt-4 flex items-center gap-3 max-w-3xl text-2xl font-bold tracking-tight text-foreground">
              {tPage("title")}
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              {tPage("description")}
            </p>
          </div>
        </div>
      </section>

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
