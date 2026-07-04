"use client";

import { useTranslations } from "next-intl";

import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { StatusPill } from "@/features/dashboard/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDueSoonComplianceItemsQuery } from "@/features/compliance/hooks/compliance-hooks";

function formatDate(date: string | null) {
  if (!date) return "No due date";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function DashboardDueSoonControls({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const t = useTranslations("dashboard");

  const dueSoonQuery = useDueSoonComplianceItemsQuery(organizationId);

  return (
    <Card className="compliance-surface">
      <CardHeader>
        <CardTitle>{t("dueSoonControls")}</CardTitle>
      </CardHeader>
      <CardContent>
        {dueSoonQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">
            {t("loadingDueSoon")}
          </p>
        ) : dueSoonQuery.data?.length ? (
          <div className="space-y-3">
            {dueSoonQuery.data.slice(0, 5).map((item) => (
              <div
                className="rounded-2xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                key={item.id}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-foreground line-clamp-1" title={`${item.requirementCode} · ${item.requirementTitle}`}>
                      {item.requirementCode} · {item.requirementTitle}
                    </p>
                    <StatusPill status={item.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("due", {
                      date: formatDate(item.dueDate),
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState message={t("noDueSoon")} />
        )}
      </CardContent>
    </Card>
  );
}
