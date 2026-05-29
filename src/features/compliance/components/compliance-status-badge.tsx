"use client";

import { useTranslations } from "next-intl";

import type { ComplianceStatus } from "@/lib/api/api-types";
import { Badge } from "@/components/ui/badge";

const classNameMap: Record<ComplianceStatus, string> = {
  OPEN: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  IN_PROGRESS: "bg-blue-50 text-blue-700 hover:bg-blue-50",
  READY_FOR_REVIEW: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  COMPLIANT: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  NON_COMPLIANT: "bg-red-50 text-red-700 hover:bg-red-50",
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
