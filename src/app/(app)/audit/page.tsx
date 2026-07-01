"use client";

import { useMemo, useState } from "react";
import { Download, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { FilterBar } from "@/components/layout/filter-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuditEventCard } from "@/features/audit/components/audit-event-card";
import { useAuditEventsQuery } from "@/features/audit/hooks/audit-hooks";
import { useExportAuditEventsCsvMutation } from "@/features/exports/hooks/export-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import type {
  AuditAction,
  AuditResourceType,
  SortDirection,
} from "@/lib/api/api-types";

const ALL = "ALL";

const auditActionOptions: AuditAction[] = [
  "COMPLIANCE_FRAMEWORK_APPLIED",
  "COMPLIANCE_ITEM_CREATED",
  "COMPLIANCE_ITEM_UPDATED",
  "EVIDENCE_DOCUMENT_CREATED",
  "EVIDENCE_DOCUMENT_UPDATED",
  "EVIDENCE_DOCUMENT_ARCHIVED",
  "EVIDENCE_LINK_CREATED",
  "EVIDENCE_LINK_DELETED",
  "COMPLIANCE_TASK_CREATED",
  "COMPLIANCE_TASK_UPDATED",
  "COMPLIANCE_TASK_DELETED",
  "BILLING_PLAN_CHANGE_REQUESTED",
  "BILLING_PLAN_CHANGE_APPROVED",
  "BILLING_PLAN_CHANGE_REJECTED",
];

const auditResourceTypeOptions: AuditResourceType[] = [
  "COMPLIANCE_FRAMEWORK",
  "COMPLIANCE_ITEM",
  "EVIDENCE_DOCUMENT",
  "EVIDENCE_LINK",
  "COMPLIANCE_TASK",
  "BILLING_PLAN_CHANGE_REQUEST",
];

const auditSortOptions = [
  { value: "createdAt", labelKey: "timestamp" },
  { value: "action", labelKey: "action" },
  { value: "resourceType", labelKey: "resourceType" },
  { value: "actorEmail", labelKey: "actorEmail" },
] as const;

type AuditSortBy = "createdAt" | "action" | "resourceType" | "actorEmail";

export default function AuditPage() {
  const t = useTranslations("audit");

  const { activeOrganization, canViewAudit } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const exportAuditCsvMutation = useExportAuditEventsCsvMutation();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>(ALL);
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>(ALL);
  const [sortBy, setSortBy] = useState<AuditSortBy>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("DESC");

  const params = useMemo(
    () =>
      organizationId
        ? {
          organizationId,
          page,
          size: 15,
          q: search.trim() || undefined,
          action:
            actionFilter !== ALL ? (actionFilter as AuditAction) : undefined,
          resourceType:
            resourceTypeFilter !== ALL
              ? (resourceTypeFilter as AuditResourceType)
              : undefined,
          sortBy,
          sortDirection,
        }
        : undefined,
    [
      organizationId,
      page,
      search,
      actionFilter,
      resourceTypeFilter,
      sortBy,
      sortDirection,
    ],
  );

  const auditQuery = useAuditEventsQuery(params);

  const events = auditQuery.data?.items ?? [];
  const totalPages = auditQuery.data?.totalPages ?? 0;
  const totalItems = auditQuery.data?.totalItems ?? 0;

  function handleExportCsv() {
    if (!organizationId) {
      return;
    }

    exportAuditCsvMutation.mutate(organizationId);
  }

  if (!canViewAudit) {
    return (
      <Card>
        <CardContent className="p-8 text-muted-foreground">
          You do not have permission to view audit events.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="compliance-hero">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              {t("heroEyebrow")}
            </p>

            <h2 className="mt-4 max-w-3xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
              {t("heroTitle")}
            </h2>

            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              {t("heroDescription")}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
            disabled={!organizationId || exportAuditCsvMutation.isPending}
            onClick={handleExportCsv}
          >
            <Download className="mr-2 size-4" />
            {exportAuditCsvMutation.isPending ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </section>

      <FilterBar>
        <Input
          className="min-w-[180px] flex-1 lg:max-w-[280px]"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
        />

        <Select
          value={actionFilter}
          onValueChange={(value) => {
            setActionFilter(value);
            setPage(0);
          }}
        >
          <SelectTrigger className="min-w-[150px]">
            <SelectValue placeholder={t("filters.action")} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL}>{t("filters.allActions")}</SelectItem>

            {auditActionOptions.map((action) => (
              <SelectItem key={action} value={action}>
                {t(`actions.${action}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={resourceTypeFilter}
          onValueChange={(value) => {
            setResourceTypeFilter(value);
            setPage(0);
          }}
        >
          <SelectTrigger className="min-w-[150px]">
            <SelectValue placeholder={t("filters.resource")} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL}>{t("filters.allResources")}</SelectItem>

            {auditResourceTypeOptions.map((resourceType) => (
              <SelectItem key={resourceType} value={resourceType}>
                {t(`resourceTypes.${resourceType}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value as AuditSortBy);
            setPage(0);
          }}
        >
          <SelectTrigger className="min-w-[130px]">
            <SelectValue placeholder={t("filters.sort")} />
          </SelectTrigger>

          <SelectContent>
            {auditSortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(`sort.${option.labelKey}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortDirection}
          onValueChange={(value) => {
            setSortDirection(value as SortDirection);
            setPage(0);
          }}
        >
          <SelectTrigger className="min-w-[110px]">
            <SelectValue placeholder={t("filters.direction")} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="DESC">{t("sort.newest")}</SelectItem>
            <SelectItem value="ASC">{t("sort.oldest")}</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      {auditQuery.error ? <ErrorAlert error={auditQuery.error} /> : null}

      {exportAuditCsvMutation.error ? (
        <ErrorAlert error={exportAuditCsvMutation.error} />
      ) : null}

      {auditQuery.isLoading ? (
        <Card>
          <CardContent className="p-8 text-muted-foreground">
            {t("state.loading")}
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="rounded-3xl bg-primary/10 p-4 text-primary">
              <ScrollText className="size-8" />
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              {t("state.emptyTitle")}
            </h3>

            <p className="mt-2 max-w-md text-muted-foreground">
              {t("state.emptyDescription")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-3">
          {events.map((event) => (
            <AuditEventCard key={event.id} event={event} />
          ))}
        </section>
      )}

      <div className="flex flex-col gap-4 rounded-3xl border border-border/50 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t("pagination.page")} {page + 1} {t("pagination.of")}{" "}
          {Math.max(totalPages, 1)} · {totalItems} {t("pagination.events")}
        </p>

        <div className="flex gap-2">
          <Button
            disabled={page <= 0 || auditQuery.isFetching}
            onClick={() =>
              setPage((currentPage) => Math.max(currentPage - 1, 0))
            }
            variant="outline"
          >
            {t("pagination.previous")}
          </Button>

          <Button
            disabled={page + 1 >= totalPages || auditQuery.isFetching}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            variant="outline"
          >
            {t("pagination.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
