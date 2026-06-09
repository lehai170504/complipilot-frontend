"use client";

import { Activity, Clock3 } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUserProfileActivityQuery } from "@/features/profile/hooks/profile-hooks";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function actionLabel(action: string) {
  return action
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function actionTone(action: string) {
  if (action.includes("DELETED") || action.includes("ARCHIVED")) {
    return "bg-red-50 text-red-700 hover:bg-red-50";
  }

  if (action.includes("CREATED") || action.includes("APPLIED")) {
    return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
  }

  if (action.includes("UPDATED")) {
    return "bg-cyan-50 text-cyan-700 hover:bg-cyan-50";
  }

  return "bg-slate-100 text-slate-700 hover:bg-slate-100";
}

export function ProfileActivityCard() {
  const activityQuery = useUserProfileActivityQuery();

  const activities = activityQuery.data?.items ?? [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
            <Activity className="size-5" />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Recent activity</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Recent actions attributed to your account across workspaces.
            </p>
          </div>
        </div>

        {activityQuery.error ? (
          <div className="mt-5">
            <ErrorAlert error={activityQuery.error} />
          </div>
        ) : null}

        {activityQuery.isLoading ? (
          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="size-4 animate-pulse" />
            Loading activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed p-6 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
              <Activity className="size-5" />
            </div>
            <p className="mt-3 font-medium">No activity yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Actions you perform will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-2xl border bg-white p-4"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={actionTone(activity.action)}
                      >
                        {actionLabel(activity.action)}
                      </Badge>

                      <Badge variant="outline">
                        {actionLabel(activity.resourceType)}
                      </Badge>
                    </div>

                    <p className="mt-3 text-sm font-medium">
                      {activity.summary}
                    </p>

                    {activity.metadataJson ? (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {activity.metadataJson}
                      </p>
                    ) : null}
                  </div>

                  <p className="shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(activity.createdAt)}
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
