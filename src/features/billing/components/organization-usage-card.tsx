import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { FileCheck2, HardDrive, Sparkles, Users, ExternalLink, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createCustomerPortalSession } from "@/features/billing/api/billing-api";
import type { OrganizationUsageResponse } from "@/lib/api/api-types";

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function percent(value: number, limit: number) {
  if (limit <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((value / limit) * 100));
}

function UsageRow({
  icon,
  label,
  value,
  limit,
  formattedValue,
  formattedLimit,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  limit: number;
  formattedValue?: string;
  formattedLimit?: string;
}) {
  const usagePercent = percent(value, limit);

  return (
    <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <span className="line-clamp-2 text-sm leading-tight">{label}</span>
      </div>

      <div>
        <div className="mb-2 flex items-baseline gap-1 text-2xl font-bold text-foreground">
          {formattedValue ?? value}
          <span className="text-sm font-normal text-muted-foreground">
            / {formattedLimit ?? limit}
          </span>
        </div>
        <Progress className="h-1.5" value={usagePercent} />
      </div>
    </div>
  );
}

export function OrganizationUsageCard({
  usage,
}: {
  usage: OrganizationUsageResponse;
}) {
  const [isManagingBilling, setIsManagingBilling] = useState(false);

  const handleManageBilling = async () => {
    try {
      setIsManagingBilling(true);
      const response = await createCustomerPortalSession(usage.organizationId);
      window.location.href = response.url;
    } catch (error) {
      toast.error("Failed to open billing portal. You may need to upgrade first.");
      setIsManagingBilling(false);
    }
  };

  return (
    <Card className="compliance-surface">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Current plan
            </p>

            <div className="mt-1 flex items-end gap-3">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {usage.plan}
              </h3>

              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                {usage.subscriptionStatus}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManageBilling}
            disabled={isManagingBilling}
            className="gap-2"
          >
            {isManagingBilling ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ExternalLink className="size-4" />
            )}
            Manage Billing
          </Button>
        </div>

        <div className="grid gap-6 pt-4 sm:grid-cols-2 md:grid-cols-4">
          <UsageRow
            icon={<Users className="size-4 text-primary" />}
            label="Members"
            limit={usage.memberLimit}
            value={usage.memberCount}
          />

          <UsageRow
            icon={<FileCheck2 className="size-4 text-primary" />}
            label="Evidence"
            limit={usage.evidenceDocumentLimit}
            value={usage.evidenceDocumentCount}
          />

          <UsageRow
            formattedLimit={formatBytes(usage.storageLimitBytes)}
            formattedValue={formatBytes(usage.storageUsedBytes)}
            icon={<HardDrive className="size-4 text-primary" />}
            label="Storage"
            limit={usage.storageLimitBytes}
            value={usage.storageUsedBytes}
          />

          <UsageRow
            icon={<Sparkles className="size-4 text-primary" />}
            label="AI analyses this month"
            limit={usage.aiAnalysisLimitPerMonth}
            value={usage.aiAnalysisCountThisMonth}
          />
        </div>
      </CardContent>
    </Card>
  );
}