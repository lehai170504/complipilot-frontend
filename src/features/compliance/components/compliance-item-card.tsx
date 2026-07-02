"use client";

import { CalendarDays, ExternalLink, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ComplianceStatusBadge } from "@/features/compliance/components/compliance-status-badge";
import {
  allowedComplianceTransitions,
  complianceStatusOptions,
} from "@/features/compliance/constants";
import { useUpdateComplianceItemMutation } from "@/features/compliance/hooks/compliance-hooks";
import type {
  CompanyComplianceItem,
  ComplianceStatus,
} from "@/lib/api/api-types";

function formatDate(date: string | null, locale: string, noDueDate: string) {
  if (!date) {
    return noDueDate;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function ComplianceItemCard({
  item,
  organizationId,
  canManageCompliance,
}: {
  item: CompanyComplianceItem;
  organizationId: string | undefined;
  canManageCompliance: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("complianceItemCard");
  const tStatus = useTranslations("status");

  const updateMutation = useUpdateComplianceItemMutation(organizationId);

  const [status, setStatus] = useState<ComplianceStatus>(item.status);
  const [notes, setNotes] = useState(item.notes ?? "");

  const hasChanges = status !== item.status || notes !== (item.notes ?? "");
  const allowedNextStatuses = allowedComplianceTransitions[item.status] ?? [];

  function handleSave() {
    updateMutation.mutate({
      itemId: item.id,
      request: {
        status,
        notes: notes.trim() ? notes.trim() : null,
      },
    });
  }

  return (
    <Card className="compliance-surface overflow-hidden">
      <CardContent className="p-0">
        <div className="border-b bg-background p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary">
                  {item.requirementCode}
                </span>
                <ComplianceStatusBadge status={item.status} />
              </div>

              <h3 className="mt-3 truncate text-lg font-semibold tracking-tight">
                {item.requirementTitle}
              </h3>

              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />
                {formatDate(item.dueDate, locale, t("noDueDate"))}
              </div>

              <Link
                className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:text-cyan-800"
                href={`/compliance/${item.id}`}
              >
                {t("viewDetails")}
                <ExternalLink className="ml-1 size-3" />
              </Link>
            </div>

            {canManageCompliance ? (
              <div className="w-full space-y-2 lg:w-56">
                <Label>{t("status")}</Label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as ComplianceStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    {complianceStatusOptions
                      .filter(
                        (option) =>
                          option === item.status ||
                          allowedNextStatuses.includes(option),
                      )
                      .map((option) => (
                        <SelectItem key={option} value={option}>
                          {tStatus(option)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 bg-muted/30 p-5">
          <div className="space-y-2">
            <Label>{t("notes")}</Label>
            <Textarea
              disabled={!canManageCompliance}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={t("notesPlaceholder")}
              rows={3}
            />
          </div>

          {updateMutation.error ? (
            <ErrorAlert error={updateMutation.error} />
          ) : null}

          {canManageCompliance ? (
            <div className="flex justify-end">
              <Button
                disabled={!hasChanges || updateMutation.isPending}
                onClick={handleSave}
                type="button"
              >
                <Save className="mr-2 size-4" />
                {updateMutation.isPending ? t("saving") : t("saveChanges")}
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
