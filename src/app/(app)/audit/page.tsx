"use client";

import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { FilterBar } from "@/components/layout/filter-bar";
import { AuditEventCard } from "@/features/audit/components/audit-event-card";
import { useAuditEventsQuery } from "@/features/audit/hooks/audit-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
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
];

const auditResourceTypeOptions: AuditResourceType[] = [
  "COMPLIANCE_FRAMEWORK",
  "COMPLIANCE_ITEM",
  "EVIDENCE_DOCUMENT",
  "EVIDENCE_LINK",
  "COMPLIANCE_TASK",
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
  const { activeOrganization } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

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
    ]
  );

  const auditQuery = useAuditEventsQuery(params);
  const events = auditQuery.data?.items ?? [];
  const totalPages = auditQuery.data?.totalPages ?? 0;
  const totalItems = auditQuery.data?.totalItems ?? 0;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
          {t("heroEyebrow")}
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("heroTitle")}
        </h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          {t("heroDescription")}
        </p>
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
          onValueChange={(value) => setSortBy(value as AuditSortBy)}
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
          onValueChange={(value) => setSortDirection(value as SortDirection)}
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

      {auditQuery.isLoading ? (
        <Card>
          <CardContent className="p-8 text-muted-foreground">
            {t("state.loading")}
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="rounded-3xl bg-slate-950 p-4 text-cyan-300">
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

      <div className="flex items-center justify-between rounded-3xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          {t("pagination.page")} {page + 1} {t("pagination.of")}{" "}
          {Math.max(totalPages, 1)} · {totalItems}{" "}
          {t("pagination.events")}
        </p>

        <div className="flex gap-2">
          <Button
            disabled={page <= 0 || auditQuery.isFetching}
            onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
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