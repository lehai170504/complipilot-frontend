"use client";

import { CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useApprovePlatformBillingPlanChangeRequestMutation,
  usePlatformBillingPlanChangeRequestsQuery,
  useRejectPlatformBillingPlanChangeRequestMutation,
} from "@/features/platform-admin/hooks/platform-admin-hooks";

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
    return "bg-amber-50 text-amber-700 hover:bg-amber-50";
  }

  if (status === "APPROVED") {
    return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
  }

  if (status === "REJECTED") {
    return "bg-red-50 text-red-700 hover:bg-red-50";
  }

  return "bg-slate-100 text-slate-700 hover:bg-slate-100";
}

export function BillingPlanChangeRequestsPanel() {
  const requestsQuery = usePlatformBillingPlanChangeRequestsQuery("PENDING");
  const approveMutation = useApprovePlatformBillingPlanChangeRequestMutation();
  const rejectMutation = useRejectPlatformBillingPlanChangeRequestMutation();

  const requests = requestsQuery.data?.items ?? [];

  return (
    <Card>
      <CardContent className="p-0">
        <div className="border-b p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
              <Sparkles className="size-5" />
            </div>

            <div>
              <h3 className="font-semibold">Billing requests</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Review pending plan change requests from workspaces.
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
            <Loader2 className="size-4 animate-spin" />
            Loading billing requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
              <Sparkles className="size-5" />
            </div>
            <p className="mt-3 font-medium">No pending requests</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Plan upgrade requests will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {requests.map((request) => (
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

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <Badge variant="outline">{request.currentPlan}</Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="outline">{request.requestedPlan}</Badge>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">
                      Created {formatDate(request.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={
                        approveMutation.isPending || rejectMutation.isPending
                      }
                      onClick={() => rejectMutation.mutate(request.id)}
                    >
                      <XCircle className="mr-2 size-4" />
                      Reject
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      disabled={
                        approveMutation.isPending || rejectMutation.isPending
                      }
                      onClick={() => approveMutation.mutate(request.id)}
                    >
                      <CheckCircle2 className="mr-2 size-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
