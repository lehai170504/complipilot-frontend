"use client";

import { Clock3, RefreshCcw } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useBillingPlanChangeRequestsQuery } from "@/features/billing/hooks/billing-hooks";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusTone(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 hover:bg-amber-50";
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
    case "REJECTED":
      return "bg-red-50 text-red-700 hover:bg-red-50";
    case "CANCELLED":
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
  }
}

export function PlanChangeHistoryCard({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const requestsQuery = useBillingPlanChangeRequestsQuery(organizationId);
  const requests = requestsQuery.data?.items ?? [];

  return (
    <Card>
      <CardContent className="p-0">
        <div className="border-b p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
              <RefreshCcw className="size-5" />
            </div>

            <div>
              <h3 className="font-semibold">Plan change history</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Recent plan change requests for this workspace.
              </p>
            </div>
          </div>
        </div>

        {requestsQuery.error ? (
          <div className="p-5">
            <ErrorAlert error={requestsQuery.error} />
          </div>
        ) : null}

        {requestsQuery.isLoading ? (
          <div className="flex items-center gap-2 p-5 text-sm text-muted-foreground">
            <Clock3 className="size-4 animate-pulse" />
            Loading plan change history...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No plan change requests yet.
          </div>
        ) : (
          <div className="divide-y">
            {requests.map((request) => (
              <div key={request.id} className="p-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{request.currentPlan}</Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                      <Badge variant="outline">{request.requestedPlan}</Badge>
                      <Badge
                        variant="secondary"
                        className={statusTone(request.status)}
                      >
                        {request.status}
                      </Badge>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                      Requested by {request.requestedByEmail}
                    </p>

                    {request.reviewedByEmail ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Reviewed by {request.reviewedByEmail}
                      </p>
                    ) : null}

                    {request.requestNote ? (
                      <div className="mt-3 rounded-2xl border bg-slate-50 p-3 text-sm">
                        <p className="font-medium text-slate-700">
                          Request note
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                          {request.requestNote}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(request.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
