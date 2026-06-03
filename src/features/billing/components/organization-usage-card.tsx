import type { ReactNode } from "react";
import { FileCheck2, HardDrive, Sparkles, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          {icon}
          {label}
        </div>

        <span className="text-muted-foreground">
          {formattedValue ?? value} / {formattedLimit ?? limit}
        </span>
      </div>

      <Progress value={usagePercent} />
    </div>
  );
}

export function OrganizationUsageCard({
  usage,
}: {
  usage: OrganizationUsageResponse;
}) {
  return (
    <Card>
      <CardContent className="space-y-5 p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Current plan
          </p>

          <div className="mt-1 flex items-end justify-between gap-3">
            <h3 className="text-2xl font-semibold tracking-tight">
              {usage.plan}
            </h3>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {usage.subscriptionStatus}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <UsageRow
            icon={<Users className="size-4 text-cyan-700" />}
            label="Members"
            limit={usage.memberLimit}
            value={usage.memberCount}
          />

          <UsageRow
            icon={<FileCheck2 className="size-4 text-cyan-700" />}
            label="Evidence"
            limit={usage.evidenceDocumentLimit}
            value={usage.evidenceDocumentCount}
          />

          <UsageRow
            formattedLimit={formatBytes(usage.storageLimitBytes)}
            formattedValue={formatBytes(usage.storageUsedBytes)}
            icon={<HardDrive className="size-4 text-cyan-700" />}
            label="Storage"
            limit={usage.storageLimitBytes}
            value={usage.storageUsedBytes}
          />

          <UsageRow
            icon={<Sparkles className="size-4 text-cyan-700" />}
            label="AI analyses this month"
            limit={usage.aiAnalysisLimitPerMonth}
            value={usage.aiAnalysisCountThisMonth}
          />
        </div>
      </CardContent>
    </Card>
  );
}