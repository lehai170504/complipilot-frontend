"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Database,
  FileText,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { OrganizationUsageResponse } from "@/lib/api/api-types";

type UsageWarning = {
  key: string;
  label: string;
  current: number;
  max: number;
  percentage: number;
  level: "warning" | "danger";
  icon: "members" | "evidence" | "storage" | "ai";
};

function percentage(current: number, max: number) {
  if (!max || max <= 0) {
    return 0;
  }

  return Math.min(Math.round((current / max) * 100), 100);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  const mb = kb / 1024;

  if (mb < 1024) {
    return `${mb.toFixed(1)} MB`;
  }

  const gb = mb / 1024;

  return `${gb.toFixed(1)} GB`;
}

function iconFor(type: UsageWarning["icon"]) {
  switch (type) {
    case "members":
      return <Users className="size-4" />;
    case "evidence":
      return <FileText className="size-4" />;
    case "storage":
      return <Database className="size-4" />;
    case "ai":
      return <Sparkles className="size-4" />;
    default:
      return <AlertTriangle className="size-4" />;
  }
}

function levelTone(level: UsageWarning["level"]) {
  if (level === "danger") {
    return "bg-red-50 text-red-700 hover:bg-red-50";
  }

  return "bg-amber-50 text-amber-700 hover:bg-amber-50";
}

function buildWarnings(usage: OrganizationUsageResponse): UsageWarning[] {
  const membersPercentage = percentage(usage.memberCount, usage.memberLimit);

  const evidencePercentage = percentage(
    usage.evidenceDocumentCount,
    usage.evidenceDocumentLimit,
  );

  const storagePercentage = percentage(
    usage.storageUsedBytes,
    usage.storageLimitBytes,
  );

  const aiPercentage = percentage(
    usage.aiAnalysisCountThisMonth,
    usage.aiAnalysisLimitPerMonth,
  );

  const rawWarnings: UsageWarning[] = [
    {
      key: "members",
      label: "Workspace members",
      current: usage.memberCount,
      max: usage.memberLimit,
      percentage: membersPercentage,
      level: membersPercentage >= 95 ? "danger" : "warning",
      icon: "members",
    },
    {
      key: "evidence",
      label: "Evidence documents",
      current: usage.evidenceDocumentCount,
      max: usage.evidenceDocumentLimit,
      percentage: evidencePercentage,
      level: evidencePercentage >= 95 ? "danger" : "warning",
      icon: "evidence",
    },
    {
      key: "storage",
      label: "Storage usage",
      current: usage.storageUsedBytes,
      max: usage.storageLimitBytes,
      percentage: storagePercentage,
      level: storagePercentage >= 95 ? "danger" : "warning",
      icon: "storage",
    },
    {
      key: "ai",
      label: "AI analyses this month",
      current: usage.aiAnalysisCountThisMonth,
      max: usage.aiAnalysisLimitPerMonth,
      percentage: aiPercentage,
      level: aiPercentage >= 95 ? "danger" : "warning",
      icon: "ai",
    },
  ];

  return rawWarnings.filter((item) => item.percentage >= 80);
}

function displayUsage(warning: UsageWarning) {
  if (warning.key === "storage") {
    return `${formatBytes(warning.current)} / ${formatBytes(warning.max)}`;
  }

  return `${warning.current.toLocaleString()} / ${warning.max.toLocaleString()}`;
}

export function UsageLimitWarningCard({
  usage,
  onUpgradeClick,
}: {
  usage: OrganizationUsageResponse;
  onUpgradeClick: () => void;
}) {
  const warnings = buildWarnings(usage);

  if (warnings.length === 0) {
    return null;
  }

  const hasDanger = warnings.some((warning) => warning.level === "danger");

  return (
    <Card className={hasDanger ? "border-red-200" : "border-amber-200"}>
      <CardContent className="p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="flex items-start gap-3">
            <div
              className={
                hasDanger
                  ? "flex size-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700"
                  : "flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"
              }
            >
              <AlertTriangle className="size-5" />
            </div>

            <div>
              <h3 className="font-semibold">
                Your workspace is close to plan limits
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Some usage counters are above 80% of the current {usage.plan}{" "}
                plan. Consider upgrading before actions are blocked.
              </p>
            </div>
          </div>

          <Button type="button" variant="outline" onClick={onUpgradeClick}>
            <ArrowUpRight className="mr-2 size-4" />
            Review plans
          </Button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {warnings.map((warning) => (
            <div
              key={warning.key}
              className="rounded-2xl border bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {iconFor(warning.icon)}
                  {warning.label}
                </div>

                <Badge variant="secondary" className={levelTone(warning.level)}>
                  {warning.percentage}%
                </Badge>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {displayUsage(warning)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
