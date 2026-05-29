"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

const statusVariantMap: Record<string, string> = {
  OPEN: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  IN_PROGRESS: "bg-blue-50 text-blue-700 hover:bg-blue-50",
  READY_FOR_REVIEW: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  COMPLIANT: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  NON_COMPLIANT: "bg-red-50 text-red-700 hover:bg-red-50",
  WAIVED: "bg-purple-50 text-purple-700 hover:bg-purple-50",
  DONE: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  CANCELLED: "bg-slate-100 text-slate-500 hover:bg-slate-100",
  LOW: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  MEDIUM: "bg-blue-50 text-blue-700 hover:bg-blue-50",
  HIGH: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  CRITICAL: "bg-red-50 text-red-700 hover:bg-red-50",
};

export function StatusPill({ status }: { status: string }) {
  const tStatus = useTranslations("status");

  return (
    <Badge
      className={
        statusVariantMap[status] ??
        "bg-slate-100 text-slate-700 hover:bg-slate-100"
      }
      variant="secondary"
    >
      {tStatus.has(status) ? tStatus(status) : status.replaceAll("_", " ")}
    </Badge>
  );
}
