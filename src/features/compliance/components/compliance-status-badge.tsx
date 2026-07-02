"use client";

import { useTranslations } from "next-intl";

import type { ComplianceStatus } from "@/lib/api/api-types";
import { Badge } from "@/components/ui/badge";

const classNameMap: Record<ComplianceStatus, string> = {
  OPEN: "bg-muted text-slate-700 hover:bg-slate-100",
  IN_PROGRESS: "bg-blue-50 text-blue-700 hover:bg-blue-50",
  READY_FOR_REVIEW: "bg-warning/10 text-warning hover:bg-amber-50",
  COMPLIANT: "bg-success/10 text-success hover:bg-emerald-50",
  NON_COMPLIANT: "bg-destructive/10 text-red-700 hover:bg-red-50",
  WAIVED: "bg-purple-50 text-purple-700 hover:bg-purple-50",
};

export function ComplianceStatusBadge({
  status,
}: {
  status: ComplianceStatus;
}) {
  const tStatus = useTranslations("status");

  return (
    <Badge className={classNameMap[status]} variant="secondary">
      {tStatus(status)}
    </Badge>
  );
}
