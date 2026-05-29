"use client";

import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";

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
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import { useAuditEventsQuery } from "@/features/audit/hooks/audit-hooks";
import { AuditEventCard } from "@/features/audit/components/audit-event-card";
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
  { value: "createdAt", label: "Timestamp" },
  { value: "action", label: "Action" },
  { value: "resourceType", label: "Resource type" },
  { value: "actorEmail", label: "Actor email" },
];

function formatActionLabel(action: AuditAction) {
  return action.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatResourceTypeLabel(type: AuditResourceType) {
  return type.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AuditPage() {
  const { activeOrganization } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>(ALL);
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>(ALL);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("DESC");

  const params = useMemo(
    () =>
      organizationId
        ? {
            organizationId, page, size: 15,
            q: search.trim() || undefined,
            action: actionFilter !== ALL ? (actionFilter as AuditAction) : undefined,
            resourceType: resourceTypeFilter !== ALL ? (resourceTypeFilter as AuditResourceType) : undefined,
            sortBy: sortBy as "createdAt" | "action" | "resourceType" | "actorEmail",
            sortDirection,
          }
        : undefined,
    [organizationId, page, search, actionFilter, resourceTypeFilter, sortBy, sortDirection]
  );

  const auditQuery = useAuditEventsQuery(params);
  const events = auditQuery.data?.items ?? [];
  const totalPages = auditQuery.data?.totalPages ?? 0;
  const totalItems = auditQuery.data?.totalItems ?? 0;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Audit trail</p>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          Monitor every compliance action in your organization.
        </h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Search, filter, and sort through recent audit events to track who did what and when.
        </p>
      </section>

      <FilterBar>
        <Input className="min-w-[180px] flex-1 lg:max-w-[280px]" placeholder="Search by summary or actor email..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(0); }}>
          <SelectTrigger className="min-w-[150px]"><SelectValue placeholder="Action" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All actions</SelectItem>
            {auditActionOptions.map((a) => <SelectItem key={a} value={a}>{formatActionLabel(a)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={resourceTypeFilter} onValueChange={(v) => { setResourceTypeFilter(v); setPage(0); }}>
          <SelectTrigger className="min-w-[150px]"><SelectValue placeholder="Resource" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All resources</SelectItem>
            {auditResourceTypeOptions.map((r) => <SelectItem key={r} value={r}>{formatResourceTypeLabel(r)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="min-w-[130px]"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            {auditSortOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortDirection} onValueChange={(v) => setSortDirection(v as SortDirection)}>
          <SelectTrigger className="min-w-[110px]"><SelectValue placeholder="Dir" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Newest</SelectItem>
            <SelectItem value="ASC">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      {auditQuery.error ? <ErrorAlert error={auditQuery.error} /> : null}

      {auditQuery.isLoading ? (
        <Card><CardContent className="p-8 text-muted-foreground">Loading audit events...</CardContent></Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="rounded-3xl bg-slate-950 p-4 text-cyan-300"><ScrollText className="size-8" /></div>
            <h3 className="mt-5 text-xl font-semibold">No audit events yet</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              Audit events will appear here as you take compliance actions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-3">
          {events.map((event) => <AuditEventCard key={event.id} event={event} />)}
        </section>
      )}

      <div className="flex items-center justify-between rounded-3xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Page {page + 1} of {Math.max(totalPages, 1)} · {totalItems} events</p>
        <div className="flex gap-2">
          <Button disabled={page <= 0 || auditQuery.isFetching} onClick={() => setPage((p) => Math.max(p - 1, 0))} variant="outline">Previous</Button>
          <Button disabled={page + 1 >= totalPages || auditQuery.isFetching} onClick={() => setPage((p) => p + 1)} variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
}
