"use client";

import { Clock, Tag, User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/features/dashboard/components/status-pill";
import type { AuditEvent, AuditResourceType } from "@/lib/api/api-types";

function formatResourceTypeLabel(type: AuditResourceType) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function AuditEventCard({ event }: { event: AuditEvent }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={event.action} />
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {formatResourceTypeLabel(event.resourceType)}
              </span>
            </div>
            <p className="mt-3 break-words text-sm font-medium">
              {event.summary}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {event.actorEmail ? (
                <span className="inline-flex items-center gap-1">
                  <User className="size-3" />
                  {event.actorEmail}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {formatDateTime(event.createdAt)}
              </span>
              {event.resourceId ? (
                <span className="inline-flex items-center gap-1">
                  <Tag className="size-3" />
                  {event.resourceId.slice(0, 8)}...
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
