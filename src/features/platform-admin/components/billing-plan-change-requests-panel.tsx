"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useApprovePlatformBillingPlanChangeRequestMutation,
  usePlatformBillingPlanChangeRequestsQuery,
  useRejectPlatformBillingPlanChangeRequestMutation,
} from "@/features/platform-admin/hooks/platform-admin-hooks";
import type { BillingPlanChangeRequestStatus } from "@/lib/api/api-types";

type StatusFilter = "ALL" | BillingPlanChangeRequestStatus;

const statusOptions: StatusFilter[] = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusTone(status: string) {
  if (status === "PENDING") {
    return "bg-warning/10 text-warning hover:bg-amber-50";
  }

  if (status === "APPROVED") {
    return "bg-success/10 text-success hover:bg-emerald-50";
  }

  if (status === "REJECTED") {
    return "bg-destructive/10 text-red-700 hover:bg-red-50";
  }

  return "bg-muted text-slate-700 hover:bg-slate-100";
}

export function BillingPlanChangeRequestsPanel() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("PENDING");

  const queryStatus = statusFilter === "ALL" ? undefined : statusFilter;

  const requestsQuery = usePlatformBillingPlanChangeRequestsQuery(queryStatus);
  const approveMutation = useApprovePlatformBillingPlanChangeRequestMutation();
  const rejectMutation = useRejectPlatformBillingPlanChangeRequestMutation();

  const requests = requestsQuery.data?.items ?? [];
  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  return (
    <Card className="compliance-surface">
      <CardContent className="p-0">
        <div className="flex flex-col justify-between gap-4 border-b p-5 md:flex-row md:items-start">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-background text-primary">
              <Sparkles className="size-5" />
            </div>

            <div>
              <h3 className="font-semibold">Billing requests</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Review plan change requests from workspaces.
              </p>
            </div>
          </div>

          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>

              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "ALL" ? "All requests" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {requestsQuery.error ? (
          <div className="p-5">
            <ErrorAlert error={requestsQuery.error} />
          </div>
        ) : null}

        {requestsQuery.isLoading ? (
          <div className="flex items-center gap-2 p-5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading billing requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-background text-primary">
              <Sparkles className="size-5" />
            </div>
            <p className="mt-3 font-medium">No requests found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing the status filter.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {requests.map((request) => {
              const canReview = request.status === "PENDING";

              return (
                <div key={request.id} className="p-5">
                  <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {request.organizationName}
                        </p>

                        <Badge
                          variant="secondary"
                          className={statusTone(request.status)}
                        >
                          {request.status}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Requested by {request.requestedByEmail}
                      </p>

                      {request.reviewedByEmail ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Reviewed by {request.reviewedByEmail}
                        </p>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="outline">{request.currentPlan}</Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="outline">{request.requestedPlan}</Badge>
                      </div>

                      {request.requestNote ? (
                        <div className="mt-3 rounded-2xl border bg-muted/30 p-3 text-sm">
                          <p className="font-medium text-slate-700">
                            Request note
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                            {request.requestNote}
                          </p>
                        </div>
                      ) : null}

                      <p className="mt-3 text-xs text-muted-foreground">
                        Created {formatDate(request.createdAt)}
                      </p>
                    </div>

                    {canReview ? (
                      <div className="flex shrink-0 gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isMutating}
                          onClick={() => rejectMutation.mutate(request.id)}
                        >
                          <XCircle className="mr-2 size-4" />
                          Reject
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          disabled={isMutating}
                          onClick={() => approveMutation.mutate(request.id)}
                        >
                          <CheckCircle2 className="mr-2 size-4" />
                          Approve
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
