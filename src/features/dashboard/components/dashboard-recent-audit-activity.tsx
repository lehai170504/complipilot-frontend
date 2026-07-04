"use client";

import { useTranslations } from "next-intl";
import { ScrollText } from "lucide-react";

import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditEventsQuery } from "@/features/audit/hooks/audit-hooks";

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function DashboardRecentAuditActivity({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const t = useTranslations("dashboard");

  const auditEventsQuery = useAuditEventsQuery(
    organizationId
      ? {
        organizationId,
        page: 0,
        size: 5,
        sortBy: "createdAt",
        sortDirection: "DESC",
      }
      : undefined,
  );

  return (
    <Card className="compliance-surface">
      <CardHeader>
        <CardTitle>{t("recentAuditActivity")}</CardTitle>
      </CardHeader>
      <CardContent>
        {auditEventsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">
            {t("loadingAuditEvents")}
          </p>
        ) : auditEventsQuery.data?.items.length ? (
          <div className="space-y-3">
            {auditEventsQuery.data.items.map((event) => (
              <div
                className="rounded-2xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                key={event.id}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ScrollText className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{event.summary}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-medium">{event.actorEmail ?? "System"}</span> ·{" "}
                      {formatDateTime(event.createdAt)}
                    </p>
                    <div className="mt-2 inline-flex rounded-full border border-border/50 bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {event.action} / {event.resourceType}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState message={t("noAuditEvents")} />
        )}
      </CardContent>
    </Card>
  );
}
