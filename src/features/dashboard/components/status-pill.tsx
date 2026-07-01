"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

const statusVariantMap: Record<string, string> = {
  OPEN: "bg-muted text-muted-foreground hover:bg-muted/80",
  IN_PROGRESS: "bg-info/10 text-info hover:bg-info/20",
  READY_FOR_REVIEW: "bg-warning/10 text-warning hover:bg-warning/20",
  COMPLIANT: "bg-success/10 text-success hover:bg-success/20",
  NON_COMPLIANT: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  WAIVED: "bg-primary/10 text-primary hover:bg-primary/20",
  DONE: "bg-success/10 text-success hover:bg-success/20",
  CANCELLED: "bg-muted text-muted-foreground hover:bg-muted/80",
  LOW: "bg-muted text-muted-foreground hover:bg-muted/80",
  MEDIUM: "bg-info/10 text-info hover:bg-info/20",
  HIGH: "bg-warning/10 text-warning hover:bg-warning/20",
  CRITICAL: "bg-destructive/10 text-destructive hover:bg-destructive/20",
};

export function StatusPill({ status }: { status: string }) {
  const tStatus = useTranslations("status");

  return (
    <Badge
      className={
        statusVariantMap[status] ??
        "bg-muted text-muted-foreground hover:bg-muted/80"
      }
      variant="secondary"
    >
      {tStatus.has(status) ? tStatus(status) : status.replaceAll("_", " ")}
    </Badge>
  );
}
